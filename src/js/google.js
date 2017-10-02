import wikiSearch from './wikipedia.js'


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
      <p><a href="${info.link}">See more info on Wikipedia</a></p>`
    )
  })

  if (props.onClick)
    m.addListener('click', props.onClick.bind(null, m, props))

  if (props.onInfoClose)
    m.info.addListener('closeclick', props.onInfoClose.bind(null, m, props))

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
export function GMap(el, opts) {
  var map = new google.maps.Map(el, opts)
  return map
}
