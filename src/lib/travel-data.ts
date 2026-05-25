export interface TravelStop {
  id: string;
  lat: number;
  lng: number;
  place: string;
  region: string;
  date: string;
  note: string;
}

export interface TravelRoute {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
}

export const travelStops: TravelStop[] = [
  {
    id: "toronto",
    lat: 43.6532,
    lng: -79.3832,
    place: "Toronto",
    region: "Canada",
    date: "2021 - Present",
    note: "Studying at the University of Toronto.",
  }
];

export const travelRoutes: TravelRoute[] = [];
