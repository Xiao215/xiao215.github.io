import * as THREE from "three";
import type { Position } from "geojson";
import {
  coastlineLines,
  countryBorderLines,
  landPolygons,
} from "@/components/travel-globe-data";
import {
  landSurfaceRadius,
  latLngToVector3,
  makeSurfacePolyline,
  mapSurfaceRadius,
} from "@/lib/globe/math";

type SurfacePoint = {
  lat: number;
  lng: number;
};

function unwrapRing(ring: readonly Position[]) {
  const openRing =
    ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.slice(0, -1)
      : ring;

  if (openRing.length < 3) {
    return [];
  }

  const [firstPoint, ...restPoints] = openRing;
  const points: SurfacePoint[] = [{ lng: firstPoint[0], lat: firstPoint[1] }];
  let previousLng = firstPoint[0];

  restPoints.forEach((point) => {
    let lng = point[0];

    while (lng - previousLng > 180) lng -= 360;
    while (previousLng - lng > 180) lng += 360;

    points.push({ lng, lat: point[1] });
    previousLng = lng;
  });

  return points;
}

function getLngCenter(points: readonly SurfacePoint[]) {
  const longitudes = points.map((point) => point.lng);

  return (Math.min(...longitudes) + Math.max(...longitudes)) / 2;
}

function getLngSpan(points: readonly SurfacePoint[]) {
  const longitudes = points.map((point) => point.lng);

  return Math.max(...longitudes) - Math.min(...longitudes);
}

function isSouthPolarRing(points: readonly SurfacePoint[]) {
  const latitudes = points.map((point) => point.lat);

  return getLngSpan(points) > 340 && Math.min(...latitudes) < -80;
}

function closeSouthPolarRing(points: readonly SurfacePoint[]) {
  return [
    ...points,
    { lat: -90, lng: points[points.length - 1].lng },
    { lat: -90, lng: points[0].lng },
  ];
}

function alignRingLongitude(
  points: readonly SurfacePoint[],
  targetCenter: number,
) {
  const ringCenter = getLngCenter(points);
  let offset = 0;

  while (ringCenter + offset - targetCenter > 180) offset -= 360;
  while (targetCenter - (ringCenter + offset) > 180) offset += 360;

  return points.map((point) => ({
    lat: point.lat,
    lng: point.lng + offset,
  }));
}

/**
 * Push a triangle onto `positions`, subdividing long edges first so the flat
 * triangulation hugs the sphere instead of cutting through it.
 */
function addSurfaceTriangle(
  positions: number[],
  first: SurfacePoint,
  second: SurfacePoint,
  third: SurfacePoint,
  radius: number,
) {
  const maxSegment = 6;
  const edges = [
    { a: first, b: second, c: third },
    { a: second, b: third, c: first },
    { a: third, b: first, c: second },
  ].map((edge) => ({
    ...edge,
    length: Math.hypot(edge.a.lng - edge.b.lng, edge.a.lat - edge.b.lat),
  }));
  const longestEdge = edges.reduce((longest, edge) =>
    edge.length > longest.length ? edge : longest,
  );

  if (longestEdge.length > maxSegment) {
    const midpoint = {
      lat: (longestEdge.a.lat + longestEdge.b.lat) / 2,
      lng: (longestEdge.a.lng + longestEdge.b.lng) / 2,
    };

    addSurfaceTriangle(positions, longestEdge.a, midpoint, longestEdge.c, radius);
    addSurfaceTriangle(positions, midpoint, longestEdge.b, longestEdge.c, radius);
    return;
  }

  [first, second, third].forEach((point) => {
    const vertex = latLngToVector3(point.lat, point.lng, radius);
    positions.push(vertex.x, vertex.y, vertex.z);
  });
}

function buildLandFillGeometry() {
  const radius = landSurfaceRadius;
  const positions: number[] = [];

  landPolygons.forEach((polygon) => {
    const [rawOuterRing, ...rawHoleRings] = polygon;

    if (!rawOuterRing) {
      return;
    }

    const outerRing = unwrapRing(rawOuterRing);

    if (outerRing.length < 3) {
      return;
    }

    const contourRing = isSouthPolarRing(outerRing)
      ? closeSouthPolarRing(outerRing)
      : outerRing;
    const outerCenter = getLngCenter(contourRing);
    const holeRings = rawHoleRings
      .map(unwrapRing)
      .filter((ring) => ring.length >= 3)
      .map((ring) => alignRingLongitude(ring, outerCenter));
    const vertices = [...contourRing, ...holeRings.flat()];
    const contour = contourRing.map(
      (point) => new THREE.Vector2(point.lng, point.lat),
    );
    const holes = holeRings.map((ring) =>
      ring.map((point) => new THREE.Vector2(point.lng, point.lat)),
    );
    const triangles = THREE.ShapeUtils.triangulateShape(contour, holes);

    triangles.forEach(([firstIndex, secondIndex, thirdIndex]) => {
      addSurfaceTriangle(
        positions,
        vertices[firstIndex],
        vertices[secondIndex],
        vertices[thirdIndex],
        radius,
      );
    });
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.computeVertexNormals();

  return geometry;
}

// The world map never changes, so its geometries are built once per page
// load and shared by every globe instance. They are intentionally never
// disposed: rebuilding the land triangulation on each visit to the travel
// page was the most expensive part of mounting the globe.
let landFillGeometry: THREE.BufferGeometry | undefined;
let coastGeometries: THREE.BufferGeometry[] | undefined;
let borderGeometries: THREE.BufferGeometry[] | undefined;

export function getLandFillGeometry() {
  landFillGeometry ??= buildLandFillGeometry();
  return landFillGeometry;
}

export function getCoastGeometries() {
  coastGeometries ??= coastlineLines.map((line) =>
    makeSurfacePolyline(line, mapSurfaceRadius),
  );
  return coastGeometries;
}

export function getBorderGeometries() {
  borderGeometries ??= countryBorderLines.map((line) =>
    makeSurfacePolyline(line, mapSurfaceRadius),
  );
  return borderGeometries;
}
