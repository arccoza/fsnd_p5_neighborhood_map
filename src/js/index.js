import ko from 'knockout'
var print = console.log.bind(console)
print(ko.applyBindings)


var places = [
  'Durban',
  'Tokyo',
  'Bangkok',
]

function AppVM() {
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
