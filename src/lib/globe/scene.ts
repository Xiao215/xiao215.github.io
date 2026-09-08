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

type Rotation = { x: number; y: number };

export type TravelGlobeSceneOptions = {
  container: HTMLElement;
  selectedId: string;
  onSelect: (place: TravelPlaceEntry) => void;
};

/**
 * Owns the three.js scene for the travel globe: geometry, lighting, pointer
 * handling, and the render loop. The React component only forwards the
 * selected city in and receives marker clicks out.
 *
 * The constructor throws if a WebGL context cannot be created, so callers
 * can fall back to the SVG globe.
 */
export class TravelGlobeScene {
  private readonly container: HTMLElement;
  private readonly onSelect: (place: TravelPlaceEntry) => void;
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
  private readonly drag = { active: false, moved: false, x: 0, y: 0 };
  private targetRotation: Rotation;
  private selectedId: string;
  private frameId = 0;
  private visible = true;

  constructor({ container, selectedId, onSelect }: TravelGlobeSceneOptions) {
    this.container = container;
    this.onSelect = onSelect;
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

    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    this.resize();

    // Only render while the globe is actually on screen.
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? true;
      if (this.visible) {
        this.start();
      }
    });
    this.visibilityObserver.observe(container);
    this.start();
  }

  /** Highlight a city and rotate the globe to face it. */
  setSelected(id: string) {
    if (id === this.selectedId) {
      return;
    }

    this.selectedId = id;
    this.targetRotation = this.rotationFor(id);
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

  private rotationFor(id: string) {
    const place =
      travelPlaces.find((candidate) => candidate.id === id) ?? travelPlaces[0];
    return targetRotationFor(place.lat, place.lng);
  }

  private buildGlobe() {
    const globe = new THREE.Mesh(
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
    globe.renderOrder = 0;
    this.group.add(globe);

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
      marker.userData.placeId = place.id;
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
      const marker = this.markers[index];
      const halo = this.halos[index];

      marker.scale.setScalar(active ? 1.22 : 1);
      marker.material.color.set(active ? colors.markerActive : colors.marker);
      marker.material.emissive.set(
        active ? colors.markerActive : colors.markerGlow,
      );
      marker.material.emissiveIntensity = active ? 0.78 : 0.34;

      halo.scale.setScalar(active ? 1.12 : 1);
      halo.material.color.set(active ? colors.markerActive : colors.marker);
      halo.material.opacity = active ? 0.45 : 0.18;
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

  private readonly onPointerDown = (event: PointerEvent) => {
    event.preventDefault();
    this.drag.active = true;
    this.drag.moved = false;
    this.drag.x = event.clientX;
    this.drag.y = event.clientY;
    this.renderer.domElement.setPointerCapture(event.pointerId);
  };

  private readonly onPointerMove = (event: PointerEvent) => {
    if (!this.drag.active) {
      return;
    }

    event.preventDefault();
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

  private endDrag(event: PointerEvent) {
    this.drag.active = false;

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

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const [hit] = this.raycaster.intersectObjects(this.markers);
    const placeId = hit?.object.userData.placeId;
    const place = travelPlaces.find((candidate) => candidate.id === placeId);

    if (place) {
      this.onSelect(place);
    }
  };

  private start() {
    if (this.frameId === 0 && this.visible) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  private readonly animate = () => {
    this.frameId = 0;

    if (!this.visible) {
      return;
    }

    const target = this.targetRotation;
    const rotation = this.group.rotation;
    rotation.x = THREE.MathUtils.lerp(rotation.x, target.x, 0.08);
    rotation.y = THREE.MathUtils.lerp(rotation.y, target.y, 0.08);

    // A gentle idle sway; skipped for people who prefer reduced motion so the
    // globe can settle and stop rendering.
    const reduced = this.reducedMotion.matches;
    rotation.z = reduced ? 0 : Math.sin(performance.now() * 0.0005) * 0.018;

    this.renderer.render(this.scene, this.camera);

    const settled =
      Math.abs(rotation.x - target.x) < 0.0005 &&
      Math.abs(rotation.y - target.y) < 0.0005;

    if (!settled || !reduced || this.drag.active) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
}
