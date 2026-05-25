export const travelPlaces = [
  {
    id: "fuzhou",
    place: "Fuzhou",
    country: "China",
    continent: "Asia",
    lat: 26.0745,
    lng: 119.2965,
  },
  {
    id: "toronto",
    place: "Toronto",
    country: "Canada",
    continent: "North America",
    lat: 43.6532,
    lng: -79.3832,
  },
  {
    id: "iceland",
    place: "Iceland",
    country: "Iceland",
    continent: "Europe",
    lat: 64.1466,
    lng: -21.9426,
  },
  {
    id: "san-francisco",
    place: "San Francisco",
    country: "United States",
    continent: "North America",
    lat: 37.7749,
    lng: -122.4194,
  },
];

export const travelRoutes = [
  {
    id: "fuzhou-toronto",
    from: travelPlaces[0],
    to: travelPlaces[1],
  },
  {
    id: "toronto-iceland",
    from: travelPlaces[1],
    to: travelPlaces[2],
  },
  {
    id: "iceland-toronto",
    from: travelPlaces[2],
    to: travelPlaces[1],
  },
  {
    id: "toronto-san-francisco",
    from: travelPlaces[1],
    to: travelPlaces[3],
  },
];
