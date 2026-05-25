"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { travelRoutes, travelStops } from "@/lib/travel-data";

const globeRadius = 1;

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
  return {
    x: THREE.MathUtils.degToRad(THREE.MathUtils.clamp(-lat * 0.55, -42, 42)),
    y: THREE.MathUtils.degToRad(lng + 18),
  };
}

function makeArc(from: THREE.Vector3, to: THREE.Vector3) {
  const midpoint = from.clone().add(to).normalize().multiplyScalar(1.42);
  const curve = new THREE.QuadraticBezierCurve3(from, midpoint, to);

  return new THREE.BufferGeometry().setFromPoints(curve.getPoints(72));
}

function makeCircle(radius: number, segments = 128) {
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
  });

  return new THREE.BufferGeometry().setFromPoints(points);
}

export function TravelExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(travelStops.length - 1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  const targetRotationRef = useRef(
    targetRotationFor(travelStops[selectedIndex].lat, travelStops[selectedIndex].lng),
  );

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    targetRotationRef.current = targetRotationFor(
      travelStops[selectedIndex].lat,
      travelStops[selectedIndex].lng,
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

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const initialRotation = targetRotationRef.current;
    group.rotation.set(initialRotation.x, initialRotation.y, 0);
    scene.add(group);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius, 96, 96),
      new THREE.MeshStandardMaterial({
        color: 0x232733,
        roughness: 0.95,
        metalness: 0.05,
        transparent: true,
        opacity: 0.96,
      }),
    );
    group.add(globe);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 1.02, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0xa9a9ef,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      }),
    );
    group.add(glow);

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x5c526f,
      transparent: true,
      opacity: 0.46,
    });

    for (let lat = -60; lat <= 60; lat += 30) {
      const line = new THREE.Line(makeCircle(Math.cos(THREE.MathUtils.degToRad(lat))), gridMaterial);
      line.position.y = Math.sin(THREE.MathUtils.degToRad(lat));
      group.add(line);
    }

    for (let lng = 0; lng < 180; lng += 30) {
      const line = new THREE.Line(makeCircle(globeRadius), gridMaterial);
      line.rotation.x = Math.PI / 2;
      line.rotation.z = THREE.MathUtils.degToRad(lng);
      group.add(line);
    }

    const arcMaterial = new THREE.LineBasicMaterial({
      color: 0xf1a5d8,
      transparent: true,
      opacity: 0.72,
    });

    travelRoutes.forEach((route) => {
      const from = latLngToVector3(route.from.lat, route.from.lng, globeRadius * 1.015);
      const to = latLngToVector3(route.to.lat, route.to.lng, globeRadius * 1.015);
      group.add(new THREE.Line(makeArc(from, to), arcMaterial));
    });

    const markerMeshes: THREE.Mesh[] = [];
    const markerGeometry = new THREE.SphereGeometry(0.026, 24, 24);

    travelStops.forEach((stop, index) => {
      const marker = new THREE.Mesh(
        markerGeometry,
        new THREE.MeshStandardMaterial({
          color: index === selectedIndexRef.current ? 0xf1a5d8 : 0xf0d8c0,
          emissive: index === selectedIndexRef.current ? 0xf1a5d8 : 0xa9a9ef,
          emissiveIntensity: index === selectedIndexRef.current ? 0.75 : 0.36,
          roughness: 0.45,
        }),
      );
      marker.position.copy(latLngToVector3(stop.lat, stop.lng, globeRadius * 1.06));
      marker.userData.index = index;
      markerMeshes.push(marker);
      group.add(marker);
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
      const rect = container.getBoundingClientRect();
      const size = Math.max(260, Math.min(rect.width, rect.height || rect.width));
      renderer.setSize(rect.width, size, false);
      camera.aspect = rect.width / size;
      camera.updateProjectionMatrix();
    }

    function setPointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onPointerDown(event: PointerEvent) {
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

      const deltaX = event.clientX - drag.x;
      const deltaY = event.clientY - drag.y;
      drag.moved = drag.moved || Math.abs(deltaX) + Math.abs(deltaY) > 4;
      drag.x = event.clientX;
      drag.y = event.clientY;
      targetRotationRef.current = {
        x: THREE.MathUtils.clamp(targetRotationRef.current.x + deltaY * 0.005, -0.95, 0.95),
        y: targetRotationRef.current.y + deltaX * 0.005,
      };
    }

    function onPointerUp(event: PointerEvent) {
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
        marker.scale.setScalar(active ? 1.72 : 1);
        material.color.set(active ? 0xf1a5d8 : 0xf0d8c0);
        material.emissive.set(active ? 0xf1a5d8 : 0xa9a9ef);
        material.emissiveIntensity = active ? 0.78 : 0.34;
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
      markerGeometry.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  const selectedStop = travelStops[selectedIndex];

  return (
    <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
      <div className="relative overflow-hidden rounded-md border border-line/70 bg-surface/70 shadow-[0_24px_90px_rgba(24,24,72,0.35)]">
        <div className="absolute left-5 top-5 z-10 rounded-md border border-line/70 bg-surface-soft/82 px-4 py-3 backdrop-blur">
          <p className="font-mono text-xs uppercase text-accent">Focused stop</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {selectedStop.place}
          </p>
          <p className="text-sm text-muted">{selectedStop.date}</p>
        </div>
        <div
          ref={containerRef}
          className="min-h-[360px] cursor-grab active:cursor-grabbing sm:min-h-[520px]"
          aria-label="Interactive travel globe"
        />
      </div>

      <div>
        <div className="mb-5 rounded-md border border-line/70 bg-surface/65 p-5">
          <p className="font-mono text-xs uppercase text-accent-strong">
            Travel history
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            {selectedStop.place}, {selectedStop.region}
          </h2>
          <p className="mt-3 leading-7 text-muted">{selectedStop.note}</p>
        </div>

        <ol className="relative space-y-4">
          <div className="absolute bottom-5 left-[0.44rem] top-5 w-px bg-line/70" />
          {travelStops.map((stop, index) => {
            const active = index === selectedIndex;

            return (
              <li
                key={stop.id}
                className="relative grid grid-cols-[1.05rem_1fr] gap-4"
              >
                <span
                  className={`relative z-10 mt-5 size-3 rounded-full border ${
                    active
                      ? "border-accent-strong bg-accent-strong shadow-[0_0_0_6px_rgba(241,165,216,0.15)]"
                      : "border-accent bg-surface"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full rounded-md border p-4 text-left transition ${
                    active
                      ? "border-accent-strong/70 bg-surface text-foreground shadow-[0_16px_44px_rgba(24,24,72,0.22)]"
                      : "border-line/60 bg-surface-soft/55 text-muted hover:border-accent/60 hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-xs uppercase text-accent">
                    {stop.date}
                  </span>
                  <span className="mt-1 block text-lg font-semibold">
                    {stop.place}
                  </span>
                  <span className="mt-1 block text-sm">{stop.region}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
