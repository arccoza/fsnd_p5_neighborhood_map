import ko from 'knockout'
import mapTheme from './map-theme.js'
import wikiSearch from './wikipedia.js'
import {arrayDiff} from './utils.js'
var print = console.log.bind(console)


// Call ready when the DOM has loaded.
window.addEventListener('load', function(ev) {
  ready()
})

var places = [
  {
    id: 0,
    title: 'Durban, South Africa',
    position: {lat: -29.856849, lng: 31.013158},
  },
  {
    id: 1,
    title: 'uShaka Marine World',
    position: {lat: -29.8653737, lng: 31.0432985},
    address: '1, King Shaka Ave, Point, Point, Durban, 4001, South Africa',
  },
  {
    id: 2,
    title: 'Surf Riders Food Shack',
    position: {lat: -29.8653737, lng: 31.0432985},
    address: '17 Erskine Terrace, South Beach, Durban, 4001, South Africa',
  },
  {
    id: 3,
    title: 'Moses Mabhida Stadium',
    position: {lat: -29.8289524, lng: 31.0281982},
    address: '44 Isaiah Ntshangase Rd, Stamford Hill, Durban, 4023, South Africa',
  },
  {
    id: 4,
    title: 'People\'s Park',
    position: {lat: -29.8358271, lng: 31.0301228},
    address: '65 Masabalala Yengwa Ave, Stamford Hill, Durban, 4025, South Africa',
  },
]

places.createMarkers = function(Marker, opts={}) {
  for (var p of this)
    p.marker = Marker({...opts, ...p})
}

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
}

var mapOptions = {
  zoom: 11,
  center: {lat: -29.856849, lng: 31.013158},  // Durban
  styles: mapTheme,
}

function PlacesVM(places) {
  this.filter = ko.observable()
  this.list = ko.observableArray(places)
  this.filtered = ko.computed(() => {
    var f = this.filter()
    if (f) {
      return ko.utils.arrayFilter(this.list(),
        ({title: n}) => n.toUpperCase().indexOf(f.toUpperCase()) != -1)
    }
    return this.list()
  })
  this.selected = ko.observable()
}

function AppVM({places, map}) {
  this.menuShown = ko.observable(true)
  this.menuHidden = ko.computed(() => !this.menuShown())
  this.toggleMenu = () => this.menuShown(!this.menuShown())
  this.places = new PlacesVM(places)
}

function Marker(props) {
  var m = new google.maps.Marker(props)

  // Add an infowindow to this marker.
  m.info = new google.maps.InfoWindow({content: 'Loading...'})

  // Load data from Wikipedia and update the infowindow when it is ready.
  wikiSearch(props.title)
  .catch(err => m.info = new google.maps.InfoWindow({content: 'Failed to load info.'}))
  .then(info => {
    // REF: https://stackoverflow.com/questions/15114963/changing-data-in-the-info-window-with-google-map-markers
    m.info.setContent(
      `<h1>${info.title}</h1>
      <p>${info.summary}</p>
      <p><a href="${info.link}">See more info on Wikipedia</a></p>`
    )
  })

  if (props.onClick)
    m.addListener('click', props.onClick.bind(null, m))

  m.active = function(b) {
    if (b == null)
      return this._active
    else {
      this._active = !!b
      this.setAnimation(b ? google.maps.Animation.BOUNCE : null)
      if (this._active)
        this.info.open(m.getMap(), m)
      else
        this.info.close()
    }
  }

  return m
}

// key: AIzaSyAIThqsGw6NkA5oIJ1Q3nJmQrtA7B8-Uko
function GMap(el, opts) {
  var map = new google.maps.Map(el, opts)

  var marker = Marker({
    position: {lat: -29.8645465, lng: 31.0438486},
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
    map: map,
    title: 'Snazzy!',
    onClick: (m) => print(m)
  })

  return map
}

function ready() {
  var map = GMap(document.getElementById('map-area'), mapOptions)
  var appVM = new AppVM({places})
  var placesA = appVM.places.filtered()
  var selected = appVM.places.selected()

  places.createMarkers(Marker, {
    map,
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
  })

  // Map filtered places in the PlacesVM to Google Maps markers.
  appVM.places.filtered.subscribe(placesB => {
    appVM.places.selected(null)  // Deselect any selected places while filtering.
    var {add, rem} = arrayDiff(placesA, placesB, v => v.id)
    add.forEach(({marker: m}) => m.setMap(map))
    rem.forEach(({marker: m}) => m.setMap(null))
    placesA = placesB
  })

  // Map selected place in the PlacesVM to the associated Google Maps marker.
  appVM.places.selected.subscribe(id => {
    var placeA = id == null ? null : placesA.find(p => p.id == id)
    var placeB = selected == null ? null : appVM.places.list().find(p => p.id == selected)
    !placeA ? null : placeA.marker.active(true)
    !placeB ? null : placeB.marker.active(false)
    selected = id
  })

  ko.applyBindings(appVM)
}
