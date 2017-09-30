import ko from 'knockout'
import mapTheme from './map-theme.js'
var print = console.log.bind(console)


// Call ready when the DOM has loaded.
window.addEventListener('load', function(ev) {
  ready()
})

var places = [
  {
    name: 'Durban, South Africa',
    lat: -29.856849, lng: 31.013158
  },
  {
    name: 'uShaka Marine World',
    address: '1, King Shaka Ave, Point, Point, Durban, 4001, South Africa',
    web: 'ushakamarineworld.co.za',
  },
  {
    name: 'Surf Riders Food Shack',
    address: '17 Erskine Terrace, South Beach, Durban, 4001, South Africa',
    web: null,
  },
]

// REF: https://stackoverflow.com/questions/24413766/how-to-use-svg-markers-in-google-maps-api-v3
var markerIcon = {
  path: 'M262.576,0C160.959,0,78.817,82.164,78.817,183.76c0,137.874,183.76,341.393,183.76,341.393s183.76-203.518,183.76-341.393 C446.336,82.164,364.193,0,262.576,0z M262.576,249.404c-36.257,0-65.644-29.387-65.644-65.644 c0-36.17,29.387-65.644,65.644-65.644s65.644,29.474,65.644,65.644C328.22,220.039,298.834,249.404,262.576,249.404z',
  fillColor: '#ff7ad5',
  fillOpacity: 1,
  anchor: {x: 525.153/2, y: 525.153},
  strokeWeight: 0,
  scale: 0.1
}

var mapOptions = {
  zoom: 11,
  center: {lat: -29.856849, lng: 31.013158},  // Durban
  styles: mapTheme,
}

function AppVM({map}) {
  this.menuShown = ko.observable(true)
  this.menuHidden = ko.computed(() => !this.menuShown())
  this.toggleMenu = () => this.menuShown(!this.menuShown())

  this.search = ko.observable()
  this.places = ko.observableArray(places)
  this.placesSearch = ko.computed(() => {
    var s = this.search()
    if (s) {
      return ko.utils.arrayFilter(this.places(), p => p.toUpperCase().indexOf(s.toUpperCase()) != -1)
    }
    return this.places()
  })
}

// key: AIzaSyAIThqsGw6NkA5oIJ1Q3nJmQrtA7B8-Uko
function initMap() {
  var map = new google.maps.Map(document.getElementById('map-area'), mapOptions)

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(-29.8645465, 31.0438486),
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
    map: map,
    title: 'Snazzy!'
  })

  return map
}

function ready() {
  var map = initMap()
  ko.applyBindings(new AppVM({map}))
}

// https://stackoverflow.com/questions/27457977/searching-wikipedia-using-api
// https://www.mediawiki.org/wiki/API:Opensearch
// REF: https://stackoverflow.com/a/43667416/1401702
// REF: https://www.mediawiki.org/wiki/Manual:CORS#Description
function wikiSearch(topic) {
  var opts = {
    method: 'GET',
    mode: 'cors',
  }

  return fetch(
    `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${topic}&limit=1&namespace=0&format=json&redirects=resolve`,
    opts)
  .then(resp => {
    if (resp.ok)
      return resp.json()
    else
      throw resp
  })
}

wikiSearch('Durban, South Africa').then(resp => print(resp)).catch(err => print(err))
