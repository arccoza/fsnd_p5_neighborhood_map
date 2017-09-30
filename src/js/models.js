import ko from 'knockout'


export function PlacesVM(places) {
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

export function AppVM({places, map}) {
  this.menuShown = ko.observable(true)
  this.menuHidden = ko.computed(() => !this.menuShown())
  this.toggleMenu = () => this.menuShown(!this.menuShown())
  this.places = new PlacesVM(places)
}
