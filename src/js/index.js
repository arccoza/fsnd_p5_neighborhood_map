/*global google */
import ko from 'knockout';
import {AppVM} from './models.js';
import mapTheme from './map-theme.js';
import {GMap, Marker} from './google.js';
import {arrayDiff} from './utils.js';
import {places} from './places.js';


// Call ready when the DOM and Google Maps have loaded.
var domReady = new Promise((res) => window.addEventListener('load', (ev) => res(ev)));
var mapReady = new Promise((res, rej) => {
  window.mapLoaded = res;
  window.mapError = rej;
});

Promise.all([domReady, mapReady])
  .then((ev) => ready({ok: true}))
  .catch((ev) => ready({ok: false}));


// REF: https://stackoverflow.com/questions/24413766/how-to-use-svg-markers-in-google-maps-api-v3
var markerIcon = {
  path: 'M262.576,0C160.959,0,78.817,82.164,78.817,183.76c0,137.874,183.76,341.393,183.76,341.393s183.76-203.518,183.76-341.393 C446.336,82.164,364.193,0,262.576,0z M262.576,249.404c-36.257,0-65.644-29.387-65.644-65.644 c0-36.17,29.387-65.644,65.644-65.644s65.644,29.474,65.644,65.644C328.22,220.039,298.834,249.404,262.576,249.404z',
  fillColor: '#ff7ad5',
  fillOpacity: 1,
  strokeColor: '#eee',
  strokeOpacity: 1,
  anchor: {x: 525.153/2, y: 525.153},
  strokeWeight: 1,
  scale: 0.1
};

var mapOptions = {
  zoom: 13,
  center: {lat: -29.856849, lng: 31.013158},  // Durban
  styles: mapTheme,
};

function ready({ok}) {
  // console.log(window.google)
  var map = !window.google ? null : GMap(document.getElementById('map-area'), mapOptions);
  var appVM = new AppVM({places});
  var placesA = appVM.places.filtered();
  var selected = appVM.places.selected();

  if (map) {
    // Bind marker events to PlacesVM.
    places.createMarkers(Marker, {
      map,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
      onClick(m, p) {
        appVM.places.selected(p.id);
      },
      onInfoClose(m, p) {
        appVM.places.selected(null);
      },
    });

    // Refresh the map after the menu moves. Because there is a transition effect
    // on the menu, we register once for the idle event first. Just give the map
    // a little shake after opening/closing the menu to refresh.
    // REF: https://stackoverflow.com/a/31595722/1401702
    appVM.menuHidden.subscribe(() => {
      google.maps.event.addListenerOnce(map, 'idle',
        () => google.maps.event.trigger(map, 'resize'));
    });

    // Map filtered places in the PlacesVM to Google Maps markers.
    appVM.places.filtered.subscribe(placesB => {
      appVM.places.selected(null);  // Deselect any selected places while filtering.
      var {add, rem} = arrayDiff(placesA, placesB, v => v.id);
      add.forEach(({marker: m}) => m.setVisible(true));
      rem.forEach(({marker: m}) => m.setVisible(false));
      placesA = placesB;
    });

    // Map selected place in the PlacesVM to the associated Google Maps marker.
    appVM.places.selected.subscribe(id => {
      var placeA = id == null ? null : placesA.find(p => p.id == id);
      var placeB = selected == null ? null : appVM.places.list().find(p => p.id == selected);
      !placeA ? null : placeA.marker.active(true);
      !placeB ? null : placeB.marker.active(false);
      selected = id;
    });
  }
  else
    alert('Map loading failed.');

  ko.applyBindings(appVM);
}
