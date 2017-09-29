import ko from 'knockout'
import mapTheme from './map-theme.js'
var print = console.log.bind(console)


var places = [
  'Durban',
  'Tokyo',
  'Bangkok',
]

function AppVM() {
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

window.addEventListener('load', function(ev) {

  ko.applyBindings(new AppVM())

})


// key: AIzaSyAIThqsGw6NkA5oIJ1Q3nJmQrtA7B8-Uko
function initMap() {
  // Basic options for a simple Google Map
  // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  var mapOptions = {
    // How zoomed in you want the map to start at (always required)
    zoom: 11,

    // The latitude and longitude to center the map (always required)
    center: new google.maps.LatLng(40.6700, -73.9400), // New York

    // How you would like to style the map.
    // This is where you would paste any style found on Snazzy Maps.
    styles: mapTheme,
  }
  var mapElement = document.getElementById('map-area')
  var map = new google.maps.Map(mapElement, mapOptions)

  // Let's also add a marker while we're at it
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(40.6700, -73.9400),
    map: map,
    title: 'Snazzy!'
  })
}

window.initMap = initMap
