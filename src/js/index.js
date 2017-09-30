import ko from 'knockout'
import mapTheme from './map-theme.js'
import wikiSearch from './wikipedia.js'
var print = console.log.bind(console)


// Call ready when the DOM has loaded.
window.addEventListener('load', function(ev) {
  ready()
})

var places = [
  {
    id: 0,
    name: 'Durban, South Africa',
    position: {lat: -29.856849, lng: 31.013158},
  },
  {
    id: 1,
    name: 'uShaka Marine World',
    position: {lat: -29.8653737, lng: 31.0432985},
    address: '1, King Shaka Ave, Point, Point, Durban, 4001, South Africa',
  },
  {
    id: 2,
    name: 'Surf Riders Food Shack',
    position: {lat: -29.8653737, lng: 31.0432985},
    address: '17 Erskine Terrace, South Beach, Durban, 4001, South Africa',
  },
  {
    id: 3,
    name: 'Moses Mabhida Stadium',
    position: {lat: -29.8289524, lng: 31.0281982},
    address: '44 Isaiah Ntshangase Rd, Stamford Hill, Durban, 4023, South Africa',
  },
  {
    id: 4,
    name: 'People\'s Park',
    position: {lat: -29.8358271, lng: 31.0301228},
    address: '65 Masabalala Yengwa Ave, Stamford Hill, Durban, 4025, South Africa',
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

function PlacesVM(places) {
  this.filter = ko.observable()
  this.list = ko.observableArray(places)
  this.filtered = ko.computed(() => {
    var f = this.filter()
    if (f) {
      return ko.utils.arrayFilter(this.list(),
        ({name: n}) => n.toUpperCase().indexOf(f.toUpperCase()) != -1)
    }
    return this.list()
  })
  this.clicked = ko.observable()
}

function AppVM({places, map}) {
  this.menuShown = ko.observable(true)
  this.menuHidden = ko.computed(() => !this.menuShown())
  this.toggleMenu = () => this.menuShown(!this.menuShown())
  this.places = new PlacesVM(places)
}

function Marker(props) {
  var m = new google.maps.Marker(props)
  m.addListener('click', props.clicked.bind(null, m))
}

// key: AIzaSyAIThqsGw6NkA5oIJ1Q3nJmQrtA7B8-Uko
function GMap(el, opts) {
  var map = new google.maps.Map(el, opts)

  var marker = Marker({
    position: new google.maps.LatLng(-29.8645465, 31.0438486),
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
    map: map,
    title: 'Snazzy!',
    clicked: (...ev) => print(ev)
  })

  return map
}

function ready() {
  var map = GMap(document.getElementById('map-area'), mapOptions)
  ko.applyBindings(new AppVM({places, map}))
}
