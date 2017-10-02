var places = [
  {
    id: 0,
    title: 'Durban, South Africa',
    position: {lat: -29.856849, lng: 31.013158},
  },
  {
    id: 1,
    title: 'Golden Mile, Durban',
    position: {lat: -29.847707, lng: 31.038169},
  },
  {
    id: 2,
    title: 'uShaka Marine World',
    position: {lat: -29.867258, lng: 31.045858},
    address: '1, King Shaka Ave, Point, Point, Durban, 4001, South Africa',
  },
  {
    id: 3,
    title: 'Surf Riders Food Shack',
    position: {lat: -29.8653737, lng: 31.0432985},
    address: '17 Erskine Terrace, South Beach, Durban, 4001, South Africa',
  },
  {
    id: 4,
    title: 'Moses Mabhida Stadium',
    position: {lat: -29.8289524, lng: 31.0281982},
    address: '44 Isaiah Ntshangase Rd, Stamford Hill, Durban, 4023, South Africa',
  },
  {
    id: 5,
    title: 'People\'s Park, Moses Mabhida',
    position: {lat: -29.8358271, lng: 31.0301228},
    address: '65 Masabalala Yengwa Ave, Stamford Hill, Durban, 4025, South Africa',
  },
  {
    id: 6,
    title: 'The Pavilion mall',
    position: {lat: -29.848028, lng: 30.936382},
    address: '5 Jack Martens Dr, Dawncliffe, Westville, 3629, South Africa',
  },
  {
    id: 7,
    title: 'Burman Bush',
    position: {lat: -29.817700, lng: 31.017622},
    address: 'Burman Dr, Morningside, Durban, 4001, South Africa',
  },
  {
    id: 8,
    title: 'The Cenotaph, Durban',
    position: {lat: -29.858703, lng: 31.025217},
  },
  {
    id: 9,
    title: 'Berea, Durban',
    position: {lat: -29.850833, lng: 30.993056},
  },
];

places.createMarkers = function(Marker, opts={}) {
  for (var p of this)
    p.marker = Marker(Object.assign({}, opts, p));
};

export {places};
