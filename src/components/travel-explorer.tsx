"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { Position } from "geojson";
import { mesh } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import { travelRoutes, travelPlaces } from "@/lib/travel-data";

type TravelPlace = (typeof travelPlaces)[number];

const globeRadius = 1;
const mapSurfaceRadius = globeRadius * 1.031;
const markerRadius = 0.018;
const worldTopology = worldAtlas as unknown as Topology<{
  countries: GeometryObject;
  land: GeometryObject;
}>;
const countryBorderLines = mesh(
  worldTopology,
  worldTopology.objects.countries,
  (a, b) => a !== b,
).coordinates;
const coastlineLines = mesh(
  worldTopology,
  worldTopology.objects.land,
).coordinates;

function latLngToVector3(lat: number, lng: number, radius = globeRadius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function targetRotationFor(lat: number, lng: number) {
  const point = latLngToVector3(lat, lng).normalize();
  const yRotation = Math.atan2(-point.x, point.z);
  const horizontalDepth = Math.hypot(point.x, point.z);
  const xRotation = Math.atan2(point.y, horizontalDepth);

  return {
    x: THREE.MathUtils.clamp(xRotation, -0.78, 0.78),
    y: yRotation,
  };
}

function makeArc(from: THREE.Vector3, to: THREE.Vector3) {
  const start = from.clone().normalize();
  const end = to.clone().normalize();
  const angle = start.angleTo(end);
  const sinAngle = Math.sin(angle);
  const altitude = THREE.MathUtils.clamp(angle * 0.08, 0.055, 0.18);
  const points = Array.from({ length: 90 }, (_, index) => {
    const t = index / 89;
    const radius = globeRadius * 1.035 + Math.sin(Math.PI * t) * altitude;
    const surfacePoint =
      sinAngle < 0.001
        ? start.clone().lerp(end, t)
        : start
            .clone()
            .multiplyScalar(Math.sin((1 - t) * angle) / sinAngle)
            .add(end.clone().multiplyScalar(Math.sin(t * angle) / sinAngle));

    return surfacePoint.normalize().multiplyScalar(radius);
  });

  return new THREE.CatmullRomCurve3(points);
}

function interpolateOnSphere(
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

function makeSurfacePolyline(
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

function makeFallbackPath(points: readonly Position[]) {
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

function makeCircle(radius: number, segments = 128) {
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

function groupPlacesByRegion(places: readonly TravelPlace[]) {
  return places.reduce<Record<string, Record<string, TravelPlace[]>>>(
    (continents, place) => {
      continents[place.continent] ??= {};
      continents[place.continent][place.country] ??= [];
      continents[place.continent][place.country].push(place);

      return continents;
    },
    {},
  );
}

export function TravelExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const idx = travelPlaces.findIndex((p) => p.id === "san-francisco");
    return idx >= 0 ? idx : 0;
  });
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  const targetRotationRef = useRef(
    targetRotationFor(
      travelPlaces[selectedIndex].lat,
      travelPlaces[selectedIndex].lng,
    ),
  );

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    targetRotationRef.current = targetRotationFor(
      travelPlaces[selectedIndex].lat,
      travelPlaces[selectedIndex].lng,
    );
  }, [selectedIndex]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.25);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      window.setTimeout(() => setWebglUnavailable(true), 0);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.width = "100%";
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const initialRotation = targetRotationRef.current;
    group.rotation.set(initialRotation.x, initialRotation.y, 0);
    scene.add(group);

    const globeGeometry = new THREE.SphereGeometry(globeRadius, 96, 96);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x232733,
      roughness: 0.95,
      metalness: 0.05,
      transparent: true,
      opacity: 0.94,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    group.add(globe);

    const glowGeometry = new THREE.SphereGeometry(globeRadius * 1.02, 96, 96);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xa9a9ef,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x5c526f,
      transparent: true,
      opacity: 0.25,
    });
    const gridGeometries: THREE.BufferGeometry[] = [];

    for (let lat = -60; lat <= 60; lat += 30) {
      const geometry = makeCircle(Math.cos(THREE.MathUtils.degToRad(lat)));
      const line = new THREE.Line(geometry, gridMaterial);
      gridGeometries.push(geometry);
      line.position.y = Math.sin(THREE.MathUtils.degToRad(lat));
      group.add(line);
    }

    for (let lng = 0; lng < 180; lng += 30) {
      const geometry = makeCircle(globeRadius);
      const line = new THREE.Line(geometry, gridMaterial);
      gridGeometries.push(geometry);
      line.rotation.x = Math.PI / 2;
      line.rotation.z = THREE.MathUtils.degToRad(lng);
      group.add(line);
    }

    const coastMaterial = new THREE.LineBasicMaterial({
      color: 0xf0d8c0,
      transparent: true,
      opacity: 0.65,
    });
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xa9a9ef,
      transparent: true,
      opacity: 0.34,
    });
    const landGeometries: THREE.BufferGeometry[] = [];

    coastlineLines.forEach((line) => {
      const geometry = makeSurfacePolyline(line, mapSurfaceRadius);
      const outline = new THREE.Line(geometry, coastMaterial);
      landGeometries.push(geometry);
      group.add(outline);
    });

    countryBorderLines.forEach((line) => {
      const geometry = makeSurfacePolyline(line, globeRadius * 1.033);
      const outline = new THREE.Line(geometry, borderMaterial);
      landGeometries.push(geometry);
      group.add(outline);
    });

    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0xf1a5d8,
      transparent: true,
      opacity: 0.95,
    });
    const arcGeometries: THREE.BufferGeometry[] = [];

    travelRoutes.forEach((route) => {
      const from = latLngToVector3(
        route.from.lat,
        route.from.lng,
        globeRadius * 1.015,
      );
      const to = latLngToVector3(
        route.to.lat,
        route.to.lng,
        globeRadius * 1.015,
      );
      const geometry = new THREE.TubeGeometry(
        makeArc(from, to),
        96,
        0.0055,
        8,
        false,
      );
      const arc = new THREE.Mesh(geometry, arcMaterial);
      arcGeometries.push(geometry);
      group.add(arc);
    });

    const markerMeshes: THREE.Mesh[] = [];
    const markerHaloMeshes: THREE.Mesh[] = [];
    const markerMaterials: THREE.MeshStandardMaterial[] = [];
    const markerHaloMaterials: THREE.MeshBasicMaterial[] = [];
    const markerGeometry = new THREE.SphereGeometry(markerRadius, 20, 20);
    const markerHaloGeometry = new THREE.RingGeometry(0.026, 0.04, 32);

    travelPlaces.forEach((place, index) => {
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: index === selectedIndexRef.current ? 0xf1a5d8 : 0xf0d8c0,
        emissive: index === selectedIndexRef.current ? 0xf1a5d8 : 0xa9a9ef,
        emissiveIntensity: index === selectedIndexRef.current ? 0.75 : 0.36,
        roughness: 0.45,
      });
      markerMaterials.push(markerMaterial);
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      const position = latLngToVector3(place.lat, place.lng, mapSurfaceRadius);
      const normal = position.clone().normalize();
      marker.position.copy(position);
      marker.userData.index = index;
      markerMeshes.push(marker);
      group.add(marker);

      const haloMaterial = new THREE.MeshBasicMaterial({
        color: index === selectedIndexRef.current ? 0xf1a5d8 : 0xf0d8c0,
        transparent: true,
        opacity: index === selectedIndexRef.current ? 0.4 : 0.18,
        side: THREE.DoubleSide,
      });
      markerHaloMaterials.push(haloMaterial);
      const halo = new THREE.Mesh(markerHaloGeometry, haloMaterial);
      halo.position.copy(
        latLngToVector3(place.lat, place.lng, mapSurfaceRadius + 0.002),
      );
      halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      markerHaloMeshes.push(halo);
      group.add(halo);
    });

    const ambient = new THREE.AmbientLight(0xf6edf7, 1.6);
    const key = new THREE.DirectionalLight(0xf1a5d8, 1.2);
    key.position.set(2, 2, 3);
    const fill = new THREE.DirectionalLight(0xa9a9ef, 0.9);
    fill.position.set(-3, -1, 2);
    scene.add(ambient, key, fill);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const drag = {
      active: false,
      moved: false,
      x: 0,
      y: 0,
    };

    function resize() {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const size = Math.max(260, Math.min(rect.width, rect.height || rect.width));
      renderer.setSize(rect.width, size, false);
      renderer.domElement.style.height = `${size}px`;
      camera.aspect = rect.width / size;
      camera.position.z = rect.width < 480 ? 3.75 : 3.25;
      camera.updateProjectionMatrix();
    }

    function setPointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerDown(event: PointerEvent) {
      event.preventDefault();
      drag.active = true;
      drag.moved = false;
      drag.x = event.clientX;
      drag.y = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent) {
      if (!drag.active) {
        return;
      }

      event.preventDefault();
      const deltaX = event.clientX - drag.x;
      const deltaY = event.clientY - drag.y;
      drag.moved = drag.moved || Math.abs(deltaX) + Math.abs(deltaY) > 4;
      drag.x = event.clientX;
      drag.y = event.clientY;
      targetRotationRef.current = {
        x: THREE.MathUtils.clamp(
          targetRotationRef.current.x + deltaY * 0.005,
          -0.95,
          0.95,
        ),
        y: targetRotationRef.current.y + deltaX * 0.005,
      };
    }

    function onPointerUp(event: PointerEvent) {
      event.preventDefault();
      drag.active = false;
      renderer.domElement.releasePointerCapture(event.pointerId);

      if (drag.moved) {
        return;
      }

      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const [hit] = raycaster.intersectObjects(markerMeshes);

      if (hit?.object.userData.index !== undefined) {
        setSelectedIndex(hit.object.userData.index);
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let frameId = 0;

    function animate() {
      const target = targetRotationRef.current;
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, target.x, 0.08);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, target.y, 0.08);
      group.rotation.z = Math.sin(performance.now() * 0.0005) * 0.018;

      markerMeshes.forEach((marker, index) => {
        const active = index === selectedIndexRef.current;
        const material = marker.material as THREE.MeshStandardMaterial;
        marker.scale.setScalar(active ? 1.22 : 1);
        material.color.set(active ? 0xf1a5d8 : 0xf0d8c0);
        material.emissive.set(active ? 0xf1a5d8 : 0xa9a9ef);
        material.emissiveIntensity = active ? 0.78 : 0.34;
      });
      markerHaloMeshes.forEach((halo, index) => {
        const active = index === selectedIndexRef.current;
        const material = halo.material as THREE.MeshBasicMaterial;
        halo.scale.setScalar(active ? 1.12 : 1);
        material.color.set(active ? 0xf1a5d8 : 0xf0d8c0);
        material.opacity = active ? 0.45 : 0.18;
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      gridMaterial.dispose();
      gridGeometries.forEach((geometry) => geometry.dispose());
      coastMaterial.dispose();
      borderMaterial.dispose();
      arcMaterial.dispose();
      arcGeometries.forEach((geometry) => geometry.dispose());
      markerGeometry.dispose();
      markerHaloGeometry.dispose();
      markerMaterials.forEach((material) => material.dispose());
      markerHaloMaterials.forEach((material) => material.dispose());
      landGeometries.forEach((geometry) => geometry.dispose());
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const selectedPlace = travelPlaces[selectedIndex];
  const groupedPlaces = groupPlacesByRegion(travelPlaces);

  return (
    <section className="min-w-0 space-y-5">
      <div className="relative min-w-0 overflow-hidden rounded-md border border-line/70 bg-surface/70 shadow-[0_24px_90px_rgba(24,24,72,0.35)]">
        <div className="absolute left-5 top-5 z-10 rounded-md border border-line/70 bg-surface-soft/82 px-4 py-3 backdrop-blur">
          <p className="font-mono text-xs uppercase text-accent">
            Selected city
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {selectedPlace.place}
          </p>
        </div>
        {webglUnavailable ? (
          <TravelGlobeFallback
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        ) : (
            <div
              ref={containerRef}
              className="min-h-[360px] min-w-0 touch-none cursor-grab active:cursor-grabbing sm:min-h-[540px]"
              aria-label="Interactive travel globe"
            />
        )}
      </div>

      <div className="rounded-md border border-line/70 bg-surface/65 p-5">
        <p className="font-mono text-xs uppercase text-accent-strong">
          City index
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {Object.entries(groupedPlaces).map(([continent, countries]) => (
            <div key={continent}>
              <h3 className="text-lg font-semibold text-foreground">
                {continent}
              </h3>
              <div className="mt-3 space-y-4">
                {Object.entries(countries).map(([country, places]) => (
                  <div key={country}>
                    <p className="font-mono text-xs uppercase text-accent">
                      {country}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {places.map((place) => {
                        const index = travelPlaces.findIndex(
                          (candidate) => candidate.id === place.id,
                        );
                        const active = index === selectedIndex;

                        return (
                          <button
                            key={place.id}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                              active
                                ? "border-accent-strong/80 bg-accent-strong/15 text-foreground"
                                : "border-line/70 bg-surface-soft/55 text-muted hover:border-accent/70 hover:text-foreground"
                            }`}
                          >
                            {place.place}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function projectPoint(lat: number, lng: number) {
  const x = 50 + (lng / 180) * 36;
  const y = 50 - (lat / 90) * 36;

  return { x, y };
}

function TravelGlobeFallback({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-5 py-16 sm:min-h-[520px]">
      <svg
        viewBox="0 0 100 100"
        className="aspect-square w-full max-w-[34rem]"
        role="img"
        aria-label="Travel route globe"
      >
        <defs>
          <radialGradient id="travel-globe-fill" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#313643" />
            <stop offset="65%" stopColor="#232733" />
            <stop offset="100%" stopColor="#181848" />
          </radialGradient>
          <clipPath id="travel-globe-clip">
            <circle cx="50" cy="50" r="38" />
          </clipPath>
          <filter id="travel-globe-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="38"
          fill="url(#travel-globe-fill)"
          stroke="#5c526f"
          strokeWidth="0.5"
        />
        {[32, 42, 50, 58, 68].map((y) => (
          <ellipse
            key={y}
            cx="50"
            cy="50"
            rx="38"
            ry={Math.abs(50 - y)}
            fill="none"
            stroke="#5c526f"
            strokeWidth="0.28"
            opacity="0.6"
          />
        ))}
        {[22, 34, 50, 66, 78].map((x) => (
          <ellipse
            key={x}
            cx="50"
            cy="50"
            rx={Math.abs(50 - x)}
            ry="38"
            fill="none"
            stroke="#5c526f"
            strokeWidth="0.28"
            opacity="0.48"
          />
        ))}

        <g clipPath="url(#travel-globe-clip)">
          {coastlineLines.map((line, index) => {
            const path = makeFallbackPath(line);

            if (!path) {
              return null;
            }

            return (
              <path
                key={`coast-${index}`}
                d={path}
                fill="none"
                stroke="#f0d8c0"
                strokeWidth="0.42"
                opacity="0.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {countryBorderLines.map((line, index) => {
            const path = makeFallbackPath(line);

            if (!path) {
              return null;
            }

            return (
              <path
                key={`border-${index}`}
                d={path}
                fill="none"
                stroke="#a9a9ef"
                strokeWidth="0.24"
                opacity="0.46"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {travelRoutes.map((route) => {
            const from = projectPoint(route.from.lat, route.from.lng);
            const to = projectPoint(route.to.lat, route.to.lng);
            const controlX = (from.x + to.x) / 2;
            const controlY = Math.min(from.y, to.y) - 10;

            return (
              <path
                key={route.id}
                d={`M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`}
                fill="none"
                stroke="#f1a5d8"
                strokeWidth="0.7"
                opacity="0.72"
                strokeLinecap="round"
              />
            );
          })}

          {travelPlaces.map((stop, index) => {
            const point = projectPoint(stop.lat, stop.lng);
            const active = selectedIndex === index;

            return (
              <g key={stop.id}>
                {active ? (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3.6"
                    fill="#f1a5d8"
                    opacity="0.24"
                    filter="url(#travel-globe-glow)"
                  />
                ) : null}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={active ? 1.8 : 1.2}
                  fill={active ? "#f1a5d8" : "#f0d8c0"}
                  stroke="#181848"
                  strokeWidth="0.45"
                  className="cursor-pointer transition"
                  onClick={() => onSelect(index)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
