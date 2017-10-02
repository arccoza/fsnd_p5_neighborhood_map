import wikiSearch from './wikipedia.js'

// A factory function for generating Google Maps Markers
// with some default settings and additional properties.
// REF: https://developers.google.com/maps/documentation/
export function Marker(props) {
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
      <p>${info.summary == null ? 'No info.' : info.summary}</p>
      ${info.summary == null ? '' :
      `<p><a target="_blank" href="${info.link}">See more info on Wikipedia</a></p>`}`
    )
  })

  // If the place props have an onClick fn, bind it.
  if (props.onClick)
    m.addListener('click', props.onClick.bind(null, m, props))

  // If the place props have an onInfoClose fn, bind it.
  if (props.onInfoClose)
    m.info.addListener('closeclick', props.onInfoClose.bind(null, m, props))

  // A special method property, called without args, returns the current state.
  // Called with true or false, sets state.
  // When active == true a group of associated features are shown,
  // and hidden when active == false.
  m.active = function(b) {
    if (b == null)  // Get.
      return this._active
    else {  // Set.
      this._active = !!b
      console.log(this.getAnimation())
      // Stuck animation bug in Chrome when setting to null,
      // and then back to an animation. Using -1, a nonexistant animation
      // constant, the problem seems to vanish.
      // REF: https://stackoverflow.com/a/38921305/1401702
      this.setAnimation(b ? google.maps.Animation.BOUNCE : -1)
      console.log(this.getAnimation())
      if (this._active)
        this.info.open(m.getMap(), m)
      else
        this.info.close()
    }
  }

  return m
}

// key: AIzaSyAIThqsGw6NkA5oIJ1Q3nJmQrtA7B8-Uko
export function GMap(el, opts) {
  var map = new google.maps.Map(el, opts)
  return map
}
