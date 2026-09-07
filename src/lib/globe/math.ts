import * as THREE from "three";
import type { Position } from "geojson";

export const globeRadius = 1;
export const landSurfaceRadius = globeRadius * 1.008;
export const mapSurfaceRadius = landSurfaceRadius;
export const markerRadius = 0.018;
export const routeSurfaceRadius = mapSurfaceRadius + markerRadius * 0.65;

export function latLngToVector3(lat: number, lng: number, radius = globeRadius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Group rotation that brings the given point to face the camera. */
export function targetRotationFor(lat: number, lng: number) {
  const point = latLngToVector3(lat, lng).normalize();
  const yRotation = Math.atan2(-point.x, point.z);
  const horizontalDepth = Math.hypot(point.x, point.z);
  const xRotation = Math.atan2(point.y, horizontalDepth);

  return {
    x: THREE.MathUtils.clamp(xRotation, -0.78, 0.78),
    y: yRotation,
  };
}

/** Spherical linear interpolation between two unit vectors. */
export function interpolateOnSphere(
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number,
) {
  const angle = start.angleTo(end);
  const sinAngle = Math.sin(angle);

  if (sinAngle < 0.001) {
    return start.clone().lerp(end, t).normalize();
  }

  return start
    .clone()
    .multiplyScalar(Math.sin((1 - t) * angle) / sinAngle)
    .add(end.clone().multiplyScalar(Math.sin(t * angle) / sinAngle))
    .normalize();
}

/** Great-circle arc between two surface points, lifted off the surface. */
export function makeArc(
  from: THREE.Vector3,
  to: THREE.Vector3,
  baseRadius = routeSurfaceRadius,
) {
  const start = from.clone().normalize();
  const end = to.clone().normalize();
  const angle = start.angleTo(end);
  const altitude = THREE.MathUtils.clamp(angle * 0.08, 0.055, 0.18);
  const points = Array.from({ length: 90 }, (_, index) => {
    const t = index / 89;
    const radius = baseRadius + Math.sin(Math.PI * t) * altitude;

    return interpolateOnSphere(start, end, t).multiplyScalar(radius);
  });

  return new THREE.CatmullRomCurve3(points);
}

/** Polyline of [lng, lat] positions draped over the sphere. */
export function makeSurfacePolyline(
  points: readonly Position[],
  radius = globeRadius * 1.028,
) {
  const linePoints: THREE.Vector3[] = [];

  points.forEach((point, index) => {
    const next = points[index + 1];
    const start = latLngToVector3(point[1], point[0]).normalize();

    if (!next) {
      linePoints.push(start.multiplyScalar(radius));
      return;
    }

    const end = latLngToVector3(next[1], next[0]).normalize();
    const segments = Math.max(4, Math.ceil(start.angleTo(end) / 0.08));

    for (let segment = 0; segment < segments; segment += 1) {
      linePoints.push(
        interpolateOnSphere(start, end, segment / segments).multiplyScalar(
          radius,
        ),
      );
    }
  });

  return new THREE.BufferGeometry().setFromPoints(linePoints);
}

/** Flat circle in the XZ plane, used for latitude and longitude grid lines. */
export function makeCircle(radius: number, segments = 128) {
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    );
  });

  return new THREE.BufferGeometry().setFromPoints(points);
}
