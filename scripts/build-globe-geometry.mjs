/**
 * Builds src/lib/globe-geometry.json from world-atlas.
 *
 * Run with `npm run globe-geometry`. The output is committed, so the browser
 * never parses topojson or runs 13k point-in-polygon tests on load — it only
 * reads plain arrays of coordinates.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature, mesh } from "topojson-client";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const topology = JSON.parse(
  fs.readFileSync(
    path.join(root, "node_modules/world-atlas/countries-110m.json"),
    "utf8",
  ),
);

/** 0.1 degrees is about 11 km: finer than one pixel at any globe size we draw. */
const round = (n) => Math.round(n * 10) / 10;
const simplify = (lines) =>
  lines.map((line) => line.map(([lng, lat]) => [round(lng), round(lat)]));

const coast = simplify(mesh(topology, topology.objects.land).coordinates);
const borders = simplify(
  mesh(topology, topology.objects.countries, (a, b) => a !== b).coordinates,
);

const landFeature = feature(topology, topology.objects.land);
const geometries =
  landFeature.type === "FeatureCollection" ? landFeature.features : [landFeature];
const polygons = geometries.flatMap((item) =>
  item.geometry.type === "Polygon"
    ? [item.geometry.coordinates]
    : item.geometry.coordinates,
);

/**
 * Rings that cross the antimeridian arrive with a +179 -> -179 jump, which makes
 * their bounding box the whole planet and the crossing test meaningless — that
 * is what used to scatter land dots across the Indian Ocean (Fiji), the Bering
 * Sea (Chukotka) and Baffin Bay (Wrangel Island). Unwrap each ring first, then
 * test a point at each of its three possible longitudes.
 */
function unwrapRing(ring) {
  const out = [[ring[0][0], ring[0][1]]];
  let previous = ring[0][0];
  for (let i = 1; i < ring.length; i += 1) {
    let lng = ring[i][0];
    while (lng - previous > 180) lng -= 360;
    while (previous - lng > 180) lng += 360;
    out.push([lng, ring[i][1]]);
    previous = lng;
  }
  return out;
}

function centerLng(ring) {
  let low = Infinity;
  let high = -Infinity;
  for (const [lng] of ring) {
    if (lng < low) low = lng;
    if (lng > high) high = lng;
  }
  return (low + high) / 2;
}

function alignRing(ring, center) {
  let offset = 0;
  const middle = centerLng(ring);
  while (middle + offset - center > 180) offset -= 360;
  while (center - (middle + offset) > 180) offset += 360;
  return offset ? ring.map(([lng, lat]) => [lng + offset, lat]) : ring;
}

const prepared = polygons.map((rings) => {
  const outer = unwrapRing(rings[0]);
  const center = centerLng(outer);
  const holes = rings.slice(1).map((ring) => alignRing(unwrapRing(ring), center));
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const [lng, lat] of outer) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return { outer, holes, minLng, maxLng, minLat, maxLat };
});

function inRing(ring, lng, lat) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lngI, latI] = ring[i];
    const [lngJ, latJ] = ring[j];
    if (
      (latI > lat) !== (latJ > lat) &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI
    ) {
      inside = !inside;
    }
  }
  return inside;
}

const SHIFTS = [0, -360, 360];

function isLand(lng, lat) {
  for (const polygon of prepared) {
    if (lat < polygon.minLat || lat > polygon.maxLat) continue;
    for (const shift of SHIFTS) {
      const x = lng + shift;
      if (x < polygon.minLng || x > polygon.maxLng) continue;
      if (!inRing(polygon.outer, x, lat)) continue;
      let inHole = false;
      for (const hole of polygon.holes) {
        if (inRing(hole, x, lat)) {
          inHole = true;
          break;
        }
      }
      if (!inHole) return true;
    }
  }
  return false;
}

/** Longitude step widens with latitude so the dots stay evenly spread on the sphere. */
function sampleLand(step) {
  const points = [];
  for (let lat = -84; lat <= 84; lat += step) {
    const lngStep = step / Math.max(Math.cos((lat * Math.PI) / 180), 0.15);
    for (let lng = -180; lng < 180; lng += lngStep) {
      if (isLand(lng, lat)) points.push([round(lng), round(lat)]);
    }
  }
  return points;
}

const stipple = sampleLand(0.95);
const output = { coast, borders, stipple };
const file = path.join(root, "src/lib/globe-geometry.json");
fs.writeFileSync(file, JSON.stringify(output));

console.log(
  `globe-geometry.json · ${coast.length} coast lines · ${borders.length} borders · ` +
    `${stipple.length} land dots · ${(fs.statSync(file).size / 1024).toFixed(0)}KB`,
);
