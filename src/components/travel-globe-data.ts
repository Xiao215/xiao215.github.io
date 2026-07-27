import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
  Position,
} from "geojson";
import { feature, mesh } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";

const worldTopology = worldAtlas as unknown as Topology<{
  countries: GeometryObject;
  land: GeometryObject;
}>;

export const countryBorderLines = mesh(
  worldTopology,
  worldTopology.objects.countries,
  (a, b) => a !== b,
).coordinates as Position[][];

export const coastlineLines = mesh(
  worldTopology,
  worldTopology.objects.land,
).coordinates as Position[][];

const landGeoJson = feature(worldTopology, worldTopology.objects.land) as
  | Feature<Polygon | MultiPolygon>
  | FeatureCollection<Polygon | MultiPolygon>;
const landFeatures =
  landGeoJson.type === "FeatureCollection"
    ? landGeoJson.features
    : [landGeoJson];

export const landPolygons = landFeatures.flatMap((landFeature) =>
  landFeature.geometry.type === "Polygon"
    ? [landFeature.geometry.coordinates]
    : landFeature.geometry.coordinates,
);

export function projectPoint(lat: number, lng: number) {
  const x = 50 + (lng / 180) * 36;
  const y = 50 - (lat / 90) * 36;

  return { x, y };
}

export function makeFallbackPath(points: readonly Position[]) {
  const [firstPoint, ...restPoints] = points;

  if (!firstPoint) {
    return "";
  }

  const start = projectPoint(firstPoint[1], firstPoint[0]);

  return restPoints.reduce((currentPath, point) => {
    const projected = projectPoint(point[1], point[0]);

    return `${currentPath} L ${projected.x} ${projected.y}`;
  }, `M ${start.x} ${start.y}`);
}

export function makeFallbackPolygonPath(polygon: readonly Position[][]) {
  return polygon
    .map((ring) => {
      const [firstPoint, ...restPoints] = ring;

      if (!firstPoint) {
        return "";
      }

      const start = projectPoint(firstPoint[1], firstPoint[0]);
      const path = restPoints.reduce((currentPath, point) => {
        const projected = projectPoint(point[1], point[0]);

        return `${currentPath} L ${projected.x} ${projected.y}`;
      }, `M ${start.x} ${start.y}`);

      return `${path} Z`;
    })
    .join(" ");
}
