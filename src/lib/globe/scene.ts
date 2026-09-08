import * as THREE from "three";
import {
  getBorderGeometries,
  getCoastGeometries,
  getLandFillGeometry,
} from "@/lib/globe/land";
import {
  globeRadius,
  latLngToVector3,
  makeArc,
  makeCircle,
  mapSurfaceRadius,
  markerRadius,
  routeSurfaceRadius,
  targetRotationFor,
} from "@/lib/globe/math";
import {
  travelPlaces,
  travelRoutes,
  type TravelPlaceEntry,
  type TravelPlaceId,
} from "@/lib/travel-data";

const colors = {
  globe: 0x232733,
  land: 0x777466,
  glow: 0xa9a9ef,
  grid: 0x5c526f,
  coast: 0xf0d8c0,
  border: 0x8fa2d8,
  route: 0xf1a5d8,
  marker: 0xf0d8c0,
  markerActive: 0xf1a5d8,
  markerGlow: 0xa9a9ef,
} as const;

/** Seconds without interaction before the globe starts drifting. */
const idleDelay = 5;
/** Radians per second of idle drift (one turn every ~80s). */
const idleSpeed = 0.08;
const hitRadius = 0.045;

type Rotation = { x: number; y: number };

export type HoverInfo = {
  place: TravelPlaceEntry;
  /** Pointer position relative to the globe container. */
  x: number;
  y: number;
};

export type TravelGlobeSceneOptions = {
  container: HTMLElement;
  selectedId: TravelPlaceId;
  onSelect: (place: TravelPlaceEntry) => void;
  onHover?: (info: HoverInfo | null) => void;
};

/**
 * Owns the three.js scene for the travel globe: geometry, lighting, pointer
 * handling, and the render loop. The React component only forwards the
 * selected city in and receives marker clicks and hovers out.
 *
 * The constructor throws if a WebGL context cannot be created, so callers
 * can fall back to the SVG globe.
 */
export class TravelGlobeScene {
  private readonly container: HTMLElement;
  private readonly onSelect: (place: TravelPlaceEntry) => void;
  private readonly onHover?: (info: HoverInfo | null) => void;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private readonly group = new THREE.Group();
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly resizeObserver: ResizeObserver;
  private readonly visibilityObserver: IntersectionObserver;
  private readonly reducedMotion: MediaQueryList;
  private readonly disposables: { dispose: () => void }[] = [];
  private readonly markers: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshStandardMaterial
  >[] = [];
  private readonly halos: THREE.Mesh<
    THREE.RingGeometry,
    THREE.MeshBasicMaterial
  >[] = [];
  /** Invisible, larger spheres that make markers easy to hover and click. */
  private readonly hitTargets: THREE.Mesh[] = [];
  private readonly drag = { active: false, moved: false, x: 0, y: 0 };
  private globe!: THREE.Mesh;
  private targetRotation: Rotation;
  private selectedId: TravelPlaceId;
  private hoveredId: TravelPlaceId | null = null;
  private lastInteraction = performance.now();
  private lastFrame = performance.now();
  private frameId = 0;
  private visible = true;

  constructor({
    container,
    selectedId,
    onSelect,
    onHover,
  }: TravelGlobeSceneOptions) {
    this.container = container;
    this.onSelect = onSelect;
    this.onHover = onHover;
    this.selectedId = selectedId;
    this.targetRotation = this.rotationFor(selectedId);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Throws when WebGL is unavailable; the caller handles that.
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.style.width = "100%";
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 3.25);
    this.group.rotation.set(this.targetRotation.x, this.targetRotation.y, 0);
    this.scene.add(this.group);

    this.buildGlobe();
    this.buildGrid();
    this.buildMap();
    this.buildRoutes();
    this.buildMarkers();
    this.buildLights();
    this.applySelection();

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointermove", this.onPointerMove);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointercancel", this.onPointerCancel);
    canvas.addEventListener("pointerleave", this.onPointerLeave);

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    this.resize();

    // Only render while the globe is actually on screen.
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? true;
      if (this.visible) {
        this.lastFrame = performance.now();
        this.start();
      }
    });
    this.visibilityObserver.observe(container);
    this.start();
  }

  /** Highlight a city, fly there along known routes, and face it. */
  setSelected(id: TravelPlaceId) {
    if (id === this.selectedId) {
      return;
    }

    this.selectedId = id;
    this.targetRotation = this.rotationFor(id);
    this.lastInteraction = performance.now();
    this.applySelection();
    this.start();
  }

  dispose() {
    cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();

    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointercancel", this.onPointerCancel);
    canvas.removeEventListener("pointerleave", this.onPointerLeave);

    this.disposables.forEach((item) => item.dispose());
    this.renderer.dispose();

    if (canvas.parentNode === this.container) {
      this.container.removeChild(canvas);
    }
  }

  private track<T extends { dispose: () => void }>(item: T) {
    this.disposables.push(item);
    return item;
  }

  private placeFor(id: TravelPlaceId) {
    return (
      travelPlaces.find((candidate) => candidate.id === id) ?? travelPlaces[0]
    );
  }

  private rotationFor(id: TravelPlaceId) {
    const place = this.placeFor(id);
    return targetRotationFor(place.lat, place.lng);
  }

  private buildGlobe() {
    this.globe = new THREE.Mesh(
      this.track(new THREE.SphereGeometry(globeRadius, 96, 96)),
      this.track(
        new THREE.MeshStandardMaterial({
          color: colors.globe,
          roughness: 0.95,
          metalness: 0.05,
          transparent: true,
          opacity: 0.94,
        }),
      ),
    );
    this.globe.renderOrder = 0;
    this.group.add(this.globe);

    const glow = new THREE.Mesh(
      this.track(new THREE.SphereGeometry(globeRadius * 1.02, 96, 96)),
      this.track(
        new THREE.MeshBasicMaterial({
          color: colors.glow,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide,
        }),
      ),
    );
    this.group.add(glow);
  }

  private buildGrid() {
    const material = this.track(
      new THREE.LineBasicMaterial({
        color: colors.grid,
        transparent: true,
        opacity: 0.25,
      }),
    );

    for (let lat = -60; lat <= 60; lat += 30) {
      const line = new THREE.Line(
        this.track(makeCircle(Math.cos(THREE.MathUtils.degToRad(lat)))),
        material,
      );
      line.position.y = Math.sin(THREE.MathUtils.degToRad(lat));
      this.group.add(line);
    }

    // Every meridian is the same circle, rotated.
    const meridian = this.track(makeCircle(globeRadius));

    for (let lng = 0; lng < 180; lng += 30) {
      const line = new THREE.Line(meridian, material);
      line.rotation.x = Math.PI / 2;
      line.rotation.z = THREE.MathUtils.degToRad(lng);
      this.group.add(line);
    }
  }

  private buildMap() {
    // Map geometries are shared module-level caches; only materials are ours.
    const landFill = new THREE.Mesh(
      getLandFillGeometry(),
      this.track(
        new THREE.MeshBasicMaterial({
          color: colors.land,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        }),
      ),
    );
    landFill.renderOrder = 1;
    this.group.add(landFill);

    const coastMaterial = this.track(
      new THREE.LineBasicMaterial({
        color: colors.coast,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
      }),
    );
    const borderMaterial = this.track(
      new THREE.LineBasicMaterial({
        color: colors.border,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      }),
    );

    getCoastGeometries().forEach((geometry) => {
      const line = new THREE.Line(geometry, coastMaterial);
      line.renderOrder = 2;
      this.group.add(line);
    });
    getBorderGeometries().forEach((geometry) => {
      const line = new THREE.Line(geometry, borderMaterial);
      line.renderOrder = 2;
      this.group.add(line);
    });
  }

  private buildRoutes() {
    const material = this.track(
      new THREE.MeshBasicMaterial({
        color: colors.route,
        transparent: true,
        opacity: 0.95,
      }),
    );

    travelRoutes.forEach((route) => {
      const from = latLngToVector3(
        route.from.lat,
        route.from.lng,
        routeSurfaceRadius,
      );
      const to = latLngToVector3(route.to.lat, route.to.lng, routeSurfaceRadius);
      const arc = new THREE.Mesh(
        this.track(
          new THREE.TubeGeometry(
            makeArc(from, to, routeSurfaceRadius),
            96,
            0.0055,
            8,
            false,
          ),
        ),
        material,
      );
      arc.renderOrder = 3;
      this.group.add(arc);
    });
  }

  private buildMarkers() {
    const markerGeometry = this.track(
      new THREE.SphereGeometry(markerRadius, 20, 20),
    );
    const haloGeometry = this.track(new THREE.RingGeometry(0.026, 0.04, 32));
    const hitGeometry = this.track(new THREE.SphereGeometry(hitRadius, 8, 8));
    const hitMaterial = this.track(new THREE.MeshBasicMaterial());
    const up = new THREE.Vector3(0, 0, 1);

    travelPlaces.forEach((place) => {
      const position = latLngToVector3(place.lat, place.lng, mapSurfaceRadius);
      const normal = position.clone().normalize();

      const marker = new THREE.Mesh(
        markerGeometry,
        this.track(new THREE.MeshStandardMaterial({ roughness: 0.45 })),
      );
      marker.position.copy(position);
      marker.renderOrder = 4;
      this.markers.push(marker);
      this.group.add(marker);

      const halo = new THREE.Mesh(
        haloGeometry,
        this.track(
          new THREE.MeshBasicMaterial({
            transparent: true,
            side: THREE.DoubleSide,
          }),
        ),
      );
      halo.position.copy(
        latLngToVector3(place.lat, place.lng, mapSurfaceRadius + 0.002),
      );
      halo.quaternion.setFromUnitVectors(up, normal);
      halo.renderOrder = 4;
      this.halos.push(halo);
      this.group.add(halo);

      const hit = new THREE.Mesh(hitGeometry, hitMaterial);
      hit.position.copy(position);
      hit.visible = false;
      hit.userData.placeId = place.id;
      this.hitTargets.push(hit);
      this.group.add(hit);
    });
  }

  private buildLights() {
    const ambient = new THREE.AmbientLight(0xf6edf7, 1.6);
    const key = new THREE.DirectionalLight(colors.route, 1.2);
    key.position.set(2, 2, 3);
    const fill = new THREE.DirectionalLight(colors.glow, 0.9);
    fill.position.set(-3, -1, 2);
    this.scene.add(ambient, key, fill);
  }

  /** Marker styling only changes on selection, so do it once, not per frame. */
  private applySelection() {
    travelPlaces.forEach((place, index) => {
      const active = place.id === this.selectedId;
      const hovered = place.id === this.hoveredId;
      const marker = this.markers[index];
      const halo = this.halos[index];

      marker.scale.setScalar(active ? 1.22 : hovered ? 1.12 : 1);
      marker.material.color.set(active ? colors.markerActive : colors.marker);
      marker.material.emissive.set(
        active ? colors.markerActive : colors.markerGlow,
      );
      marker.material.emissiveIntensity = active ? 0.78 : hovered ? 0.55 : 0.34;

      halo.scale.setScalar(active ? 1.12 : hovered ? 1.06 : 1);
      halo.material.color.set(active ? colors.markerActive : colors.marker);
      halo.material.opacity = active ? 0.45 : hovered ? 0.32 : 0.18;
    });
  }

  private readonly resize = () => {
    const rect = this.container.getBoundingClientRect();
    const size = Math.max(260, Math.min(rect.width, rect.height || rect.width));

    this.renderer.setSize(rect.width, size, false);
    this.renderer.domElement.style.height = `${size}px`;
    this.camera.aspect = rect.width / size;
    this.camera.position.z = rect.width < 480 ? 3.75 : 3.25;
    this.camera.updateProjectionMatrix();
    this.start();
  };

  private pickPlace(event: PointerEvent) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    // Include the globe so markers on the far side cannot be picked.
    const [hit] = this.raycaster.intersectObjects([
      ...this.hitTargets,
      this.globe,
    ]);
    const placeId = hit?.object.userData.placeId as TravelPlaceId | undefined;

    return placeId ? this.placeFor(placeId) : null;
  }

  private setHovered(place: TravelPlaceEntry | null, event: PointerEvent) {
    const id = place?.id ?? null;
    this.renderer.domElement.style.cursor = place ? "pointer" : "";

    if (place && this.onHover) {
      const rect = this.container.getBoundingClientRect();
      this.onHover({
        place,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    } else if (!place && this.hoveredId !== null) {
      this.onHover?.(null);
    }

    if (id !== this.hoveredId) {
      this.hoveredId = id;
      this.applySelection();
      this.start();
    }
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    this.lastInteraction = performance.now();
    this.drag.active = true;
    this.drag.moved = false;
    this.drag.x = event.clientX;
    this.drag.y = event.clientY;
    this.renderer.domElement.setPointerCapture(event.pointerId);
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    if (!this.drag.active) {
      if (event.pointerType !== "touch") {
        this.lastInteraction = performance.now();
        this.setHovered(this.pickPlace(event), event);
      }
      return;
    }

    event.preventDefault();
    this.lastInteraction = performance.now();
    const deltaX = event.clientX - this.drag.x;
    const deltaY = event.clientY - this.drag.y;
    this.drag.moved =
      this.drag.moved || Math.abs(deltaX) + Math.abs(deltaY) > 4;
    this.drag.x = event.clientX;
    this.drag.y = event.clientY;
    this.targetRotation = {
      x: THREE.MathUtils.clamp(
        this.targetRotation.x + deltaY * 0.005,
        -0.95,
        0.95,
      ),
      y: this.targetRotation.y + deltaX * 0.005,
    };
    this.start();
  };

  private readonly onPointerLeave = (event: PointerEvent) => {
    this.setHovered(null, event);
  };

  private endDrag(event: PointerEvent) {
    this.drag.active = false;
    this.lastInteraction = performance.now();

    if (this.renderer.domElement.hasPointerCapture(event.pointerId)) {
      this.renderer.domElement.releasePointerCapture(event.pointerId);
    }
  }

  private readonly onPointerCancel = (event: PointerEvent) => {
    this.endDrag(event);
    this.drag.moved = true;
  };

  private readonly onPointerUp = (event: PointerEvent) => {
    event.preventDefault();
    this.endDrag(event);

    if (this.drag.moved) {
      return;
    }

    const place = this.pickPlace(event);

    if (place) {
      this.onSelect(place);
    }
  };

  private start() {
    if (this.frameId === 0 && this.visible) {
      this.lastFrame = performance.now();
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  private readonly animate = () => {
    this.frameId = 0;

    if (!this.visible) {
      return;
    }

    const now = performance.now();
    const delta = Math.min((now - this.lastFrame) / 1000, 0.05);
    this.lastFrame = now;
    const reduced = this.reducedMotion.matches;

    // Idle drift: after a quiet spell, keep the globe slowly turning until
    // the visitor touches it or picks a city again.
    const idle =
      !reduced &&
      !this.drag.active &&
      this.hoveredId === null &&
      now - this.lastInteraction > idleDelay * 1000;

    if (idle) {
      this.targetRotation.y += idleSpeed * delta;
    }

    const target = this.targetRotation;
    const rotation = this.group.rotation;
    rotation.x = THREE.MathUtils.lerp(rotation.x, target.x, 0.08);
    rotation.y = THREE.MathUtils.lerp(rotation.y, target.y, 0.08);

    // A gentle sway; skipped for people who prefer reduced motion so the
    // globe can settle and stop rendering.
    rotation.z = reduced ? 0 : Math.sin(now * 0.0005) * 0.018;

    this.renderer.render(this.scene, this.camera);

    const settled =
      Math.abs(rotation.x - target.x) < 0.0005 &&
      Math.abs(rotation.y - target.y) < 0.0005;

    if (!settled || !reduced || this.drag.active) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
}
