/**
 * An orthographic globe drawn on a 2D canvas: no 3D library, no WebGL.
 *
 * Everything is a unit sphere that gets rotated, projected and drawn back to
 * front. That buys exact control over two things a generic globe gets wrong —
 * arcs fading as they pass behind the planet, and a terminator that follows the
 * real curve instead of a straight line across the land.
 */
import geometry from "@/lib/globe-geometry.json";
import {
  travelGroundLegs,
  travelPlaceCodes,
  travelPlaces,
  travelRoutes,
} from "@/lib/travel-data";

const DEG = Math.PI / 180;

export type GlobePlace = (typeof travelPlaces)[number];
export type LegKind = "flight" | "ground";

export type GlobeLeg = {
  id: string;
  kind: LegKind;
  fromIndex: number;
  toIndex: number;
  km: number;
  points: Float32Array;
  seed: number;
};

type Vec = [number, number, number];
/** A [lng, lat] pair, as the generated geometry stores them. */
type Point = readonly number[];

export type PointStyle = {
  color: string;
  alpha: number;
  size: number;
  night?: string;
  nightAlpha?: number;
};

export type LineStyle = { color: string; alpha: number; width: number };

export type ArcStyle = {
  color: string;
  activeColor: string;
  width: number;
  alpha: number;
  activeScale?: number;
  dimAlpha?: number;
  glow?: number;
  dash?: number[];
};

export type MarkerStyle = {
  color: string;
  activeColor: string;
  size: number;
  alpha?: number;
  ring?: string;
  lights?: string;
  pulse?: boolean;
  glow?: boolean;
};

export type LabelStyle = {
  font: string;
  activeFont: string;
  color: string;
  activeColor: string;
  background: string;
  activeBackground: string;
  border: string;
  activeBorder: string;
  leader: string;
};

export type GlobeTheme = {
  sphere: [string, string];
  rim?: string;
  shadow?: string;
  atmosphere?: string;
  atmosphereAlpha?: number;
  atmosphereSize?: number;
  graticule?: LineStyle;
  equator?: LineStyle;
  stipple?: PointStyle;
  coast?: LineStyle;
  night?: string;
  nightAlpha?: number;
  arc: ArcStyle;
  ground?: ArcStyle;
  marker: MarkerStyle;
  label?: LabelStyle;
};

export type GlobeOptions = {
  theme: GlobeTheme;
  selected: number;
  fill?: number;
  focus?: boolean;
  daylight?: boolean;
  sprite?: string;
  onSelect?: (place: GlobePlace, index: number, fromCanvas: boolean) => void;
  onHover?: (place: GlobePlace | null) => void;
};

export type TripHooks = {
  onLeg?: (leg: GlobeLeg, index: number) => void;
  onArrive?: (place: GlobePlace, index: number) => void;
  onDone?: () => void;
};

export type GlobeHandle = {
  select: (index: number) => void;
  hoverLeg: (index: number) => void;
  setChapter: (indices: number[] | null) => void;
  setDaylight: (on: boolean) => void;
  playTrip: (legs: number[], hooks?: TripHooks) => void;
  stopTrip: () => void;
  isPlaying: () => boolean;
  destroy: () => void;
};

function toVec(lat: number, lng: number): Vec {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  const sin = Math.sin(phi);
  return [-sin * Math.cos(theta), Math.cos(phi), sin * Math.sin(theta)];
}

function slerp(a: Vec, b: Vec, t: number): Vec {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const angle = Math.acos(dot);
  if (angle < 1e-6) return [a[0], a[1], a[2]];
  const sin = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / sin;
  const wb = Math.sin(t * angle) / sin;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
}

function packPoints(pairs: readonly Point[]) {
  const out = new Float32Array(pairs.length * 3);
  pairs.forEach((pair, index) => {
    const v = toVec(pair[1], pair[0]);
    out[index * 3] = v[0];
    out[index * 3 + 1] = v[1];
    out[index * 3 + 2] = v[2];
  });
  return out;
}

/** Split long segments so a polyline hugs the sphere instead of cutting through it. */
function packLine(coords: readonly Point[]) {
  const points: Vec[] = [];
  for (let i = 0; i < coords.length; i += 1) {
    const a = toVec(coords[i][1], coords[i][0]);
    const next = coords[i + 1];
    if (!next) {
      points.push(a);
      break;
    }
    const b = toVec(next[1], next[0]);
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const steps = Math.max(1, Math.ceil(Math.acos(dot) / 0.035));
    for (let s = 0; s < steps; s += 1) points.push(slerp(a, b, s / steps));
  }
  const out = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    out[i * 3] = p[0];
    out[i * 3 + 1] = p[1];
    out[i * 3 + 2] = p[2];
  });
  return out;
}

function packLines(lines: readonly (readonly Point[])[]) {
  return lines.map(packLine);
}

function ringOfLines(stepDeg: number) {
  const lines: Point[][] = [];
  for (let lat = -60; lat <= 60; lat += stepDeg) {
    const coords: Point[] = [];
    for (let i = 0; i <= 180; i += 1) coords.push([-180 + i * 2, lat]);
    lines.push(coords);
  }
  for (let lng = -180; lng < 180; lng += stepDeg) {
    const coords: Point[] = [];
    for (let i = 0; i <= 90; i += 1) coords.push([lng, -90 + i * 2]);
    lines.push(coords);
  }
  return packLines(lines);
}

export function greatCircleKm(a: GlobePlace, b: GlobePlace) {
  const dLat = (b.lat - a.lat) * DEG;
  const dLng = (b.lng - a.lng) * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * DEG) * Math.cos(b.lat * DEG) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.min(1, Math.sqrt(h))));
}

export function headingBetween(a: GlobePlace, b: GlobePlace) {
  const p1 = a.lat * DEG;
  const p2 = b.lat * DEG;
  const dl = (b.lng - a.lng) * DEG;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  const degrees = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  const compass = "N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW".split(" ");
  return `${Math.round(degrees)}° ${compass[Math.round(degrees / 22.5) % 16]}`;
}

/** Offsets come from longitude: right to the hour nearly everywhere, and no table to keep. */
export function utcOffsetHours(place: GlobePlace) {
  return Math.round(place.lng / 15);
}

export function localTimeAt(place: GlobePlace) {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + utcOffsetHours(place) * 3600000)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

/** The point on the exact opposite side of the planet, and whether anything is there. */
export function antipodeOf(place: GlobePlace) {
  const lat = -place.lat;
  const lng = place.lng > 0 ? place.lng - 180 : place.lng + 180;
  const span = 1.3 / Math.max(0.25, Math.cos((lat * Math.PI) / 180));
  const dots: Point[] = geometry.stipple;
  let land = false;
  for (const dot of dots) {
    if (Math.abs(dot[1] - lat) < 1.3 && Math.abs(dot[0] - lng) < span) {
      land = true;
      break;
    }
  }
  const north = lat >= 0 ? "N" : "S";
  const east = lng >= 0 ? "E" : "W";
  return `${land ? "Land" : "Ocean"} \u00b7 ${Math.abs(lat).toFixed(0)}${north} ${Math.abs(lng).toFixed(0)}${east}`;
}

export function codeFor(place: GlobePlace) {
  return travelPlaceCodes[place.id];
}

const placeIndex = new Map(travelPlaces.map((place, index) => [place.id, index]));

function buildLeg(
  leg: { id: string; from: GlobePlace; to: GlobePlace },
  kind: LegKind,
): GlobeLeg {
  const a = toVec(leg.from.lat, leg.from.lng);
  const b = toVec(leg.to.lat, leg.to.lng);
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const angle = Math.acos(dot);
  const lift =
    kind === "ground"
      ? Math.min(0.02, angle * 0.02)
      : Math.max(0.035, Math.min(0.17, angle * 0.075));
  const count = 64;
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const p = slerp(a, b, t);
    const length = Math.hypot(p[0], p[1], p[2]);
    const scale = (1 + Math.sin(Math.PI * t) * lift) / length;
    points[i * 3] = p[0] * scale;
    points[i * 3 + 1] = p[1] * scale;
    points[i * 3 + 2] = p[2] * scale;
  }
  return {
    id: leg.id,
    kind,
    fromIndex: placeIndex.get(leg.from.id) ?? 0,
    toIndex: placeIndex.get(leg.to.id) ?? 0,
    km: greatCircleKm(leg.from, leg.to),
    points,
    seed: (placeIndex.get(leg.from.id) ?? 0) / travelPlaces.length,
  };
}

export const travelLegs: GlobeLeg[] = [
  ...travelRoutes.map((leg) => buildLeg(leg, "flight")),
  ...travelGroundLegs.map((leg) => buildLeg(leg, "ground")),
];

const shared = {
  stipple: packPoints(geometry.stipple),
  coast: packLines(geometry.coast),
  graticule: ringOfLines(30),
  equator: packLines([
    Array.from({ length: 181 }, (_, i) => [-180 + i * 2, 0] as Point),
  ]),
  markers: packPoints(travelPlaces.map((p) => [p.lng, p.lat] as Point)),
};

export const travelStats = (() => {
  const flights = travelLegs.filter((leg) => leg.kind === "flight");
  const countries = new Set(travelPlaces.map((p) => p.country));
  return {
    cities: travelPlaces.length,
    countries: countries.size,
    flights: flights.length,
    km: flights.reduce((sum, leg) => sum + leg.km, 0),
  };
})();

function rotationFor(lat: number, lng: number) {
  const v = toVec(lat, lng);
  return {
    yaw: Math.atan2(-v[0], v[2]),
    pitch: Math.atan2(v[1], Math.hypot(v[0], v[2])),
  };
}

function rgba(hex: string, alpha: number) {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
  }
  const n = parseInt(value, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Sub-solar point, good to about a degree. */
function sunVector(): Vec {
  const d = new Date();
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 0);
  const today = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const dayOfYear = (today - yearStart) / 86400000;
  const declination = -23.44 * Math.cos(DEG * (360 / 365) * (dayOfYear + 10));
  const hours = d.getUTCHours() + d.getUTCMinutes() / 60;
  return toVec(declination, -15 * (hours - 12));
}

export function createGlobe(
  canvas: HTMLCanvasElement,
  options: GlobeOptions,
): GlobeHandle {
  const context = canvas.getContext("2d");
  if (!context) {
    return {
      select: () => {},
      hoverLeg: () => {},
      setChapter: () => {},
      setDaylight: () => {},
      playTrip: () => {},
      stopTrip: () => {},
      isPlaying: () => false,
      destroy: () => {},
    };
  }
  const ctx = context;
  const theme = options.theme;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let radius = 0;
  let centerX = 0;
  let centerY = 0;

  let selected = options.selected;
  let hovered = -1;
  let activeLeg = -1;
  let chapter: Uint8Array | null = null;
  let daylightOn = options.daylight ?? false;
  let sun = sunVector();
  let sunStamp = 0;
  let trip: { legs: number[]; at: number; t: number; hooks: TripHooks; last: number } | null =
    null;

  let sprite: HTMLImageElement | null = null;
  if (options.sprite) {
    sprite = new Image();
    sprite.src = options.sprite;
  }

  const start = rotationFor(travelPlaces[selected].lat, travelPlaces[selected].lng);
  const rotation = { yaw: start.yaw, pitch: start.pitch };
  const target = { yaw: start.yaw, pitch: start.pitch };
  const projected = new Float32Array(travelPlaces.length * 3);

  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let frameId = 0;
  let dead = false;
  let cosYaw = 1;
  let sinYaw = 0;
  let cosPitch = 1;
  let sinPitch = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    radius = (Math.min(width, height) / 2) * (options.fill ?? 0.9);
    centerX = width / 2;
    centerY = height / 2;
  }

  function project(index: number, source: Float32Array) {
    const x = source[index];
    const y = source[index + 1];
    const z = source[index + 2];
    const x1 = x * cosYaw + z * sinYaw;
    const z1 = -x * sinYaw + z * cosYaw;
    const y2 = y * cosPitch - z1 * sinPitch;
    const z2 = y * sinPitch + z1 * cosPitch;
    return [centerX + x1 * radius, centerY - y2 * radius, z2] as const;
  }

  function drawSphere() {
    if (theme.shadow) {
      const shade = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.85,
        centerX,
        centerY,
        radius * 1.55,
      );
      shade.addColorStop(0, rgba(theme.shadow, 0.5));
      shade.addColorStop(1, rgba(theme.shadow, 0));
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.55, 0, Math.PI * 2);
      ctx.fill();
    }
    const fill = ctx.createRadialGradient(
      centerX - radius * 0.35,
      centerY - radius * 0.4,
      radius * 0.1,
      centerX,
      centerY,
      radius * 1.02,
    );
    fill.addColorStop(0, theme.sphere[0]);
    fill.addColorStop(1, theme.sphere[1]);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    if (theme.rim) {
      ctx.strokeStyle = theme.rim;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawAtmosphere() {
    if (!theme.atmosphere) return;
    const size = radius * (theme.atmosphereSize ?? 1.2);
    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.97,
      centerX,
      centerY,
      size,
    );
    glow.addColorStop(0, rgba(theme.atmosphere, theme.atmosphereAlpha ?? 0.2));
    glow.addColorStop(1, rgba(theme.atmosphere, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * The grid is even on the sphere, so in screen space it crowds toward the limb.
   * Scaling each dot with the globe's size and with how square-on its patch of
   * surface is keeps the ink per square pixel even.
   */
  function drawPoints(source: Float32Array, style: PointStyle) {
    const lit = daylightOn && !!style.night;
    const passes = lit
      ? [
          { color: style.color, alpha: style.alpha, day: true },
          {
            color: style.night as string,
            alpha: style.alpha * (style.nightAlpha ?? 0.6),
            day: false,
          },
        ]
      : [{ color: style.color, alpha: style.alpha, day: true }];
    const zoom = Math.max(0.7, radius / 240);
    const twilight = 0.3;

    for (const pass of passes) {
      ctx.fillStyle = pass.color;
      let blend = 1;
      for (let i = 0; i < source.length; i += 3) {
        if (lit) {
          const facing =
            source[i] * sun[0] + source[i + 1] * sun[1] + source[i + 2] * sun[2];
          if (pass.day ? facing < -twilight : facing > twilight) continue;
          blend = pass.day
            ? Math.min(1, (facing + twilight) / (2 * twilight))
            : Math.min(1, (twilight - facing) / (2 * twilight));
        }
        const p = project(i, source);
        if (p[2] <= 0.04) continue;
        ctx.globalAlpha = pass.alpha * blend * (0.3 + 0.7 * p[2]);
        const size = style.size * zoom * Math.sqrt(p[2]);
        ctx.fillRect(p[0] - size / 2, p[1] - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawLines(lines: Float32Array[], style: LineStyle) {
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalAlpha = style.alpha;
    for (const source of lines) {
      let open = false;
      ctx.beginPath();
      for (let i = 0; i < source.length; i += 3) {
        const p = project(i, source);
        if (p[2] <= 0.01) {
          open = false;
          continue;
        }
        if (open) {
          ctx.lineTo(p[0], p[1]);
        } else {
          ctx.moveTo(p[0], p[1]);
          open = true;
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Sunlight falls off as the cosine of the angle to the sun, so there is no
   * edge on a real globe — only a ramp that happens to steepen near the
   * terminator. Filling a night *region* always leaves a visible seam, however
   * exactly its boundary is drawn, so shade with a radial ramp centred on the
   * anti-solar point instead. It is exact when the sun is behind the globe or
   * side-on, errs toward too little shading elsewhere, and never draws a line.
   */
  function drawNight() {
    if (!daylightOn || !theme.night) return;
    const x1 = sun[0] * cosYaw + sun[2] * sinYaw;
    const z1 = -sun[0] * sinYaw + sun[2] * cosYaw;
    const sx = x1;
    const sy = sun[1] * cosPitch - z1 * sinPitch;
    const sz = sun[1] * sinPitch + z1 * cosPitch;
    const max = theme.nightAlpha ?? 0.3;

    // Where the point directly opposite the sun lands on screen.
    const antiX = centerX - sx * radius;
    const antiY = centerY + sy * radius;
    // With the sun toward the camera the night side shrinks to a crescent.
    const reach = radius * (sz > 0 ? Math.max(0.08, 1 - sz * 0.9) : 1);

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    const ramp = ctx.createRadialGradient(antiX, antiY, 0, antiX, antiY, reach);
    const stops: [number, number][] = [
      [0, 1],
      [0.3, 0.95],
      [0.55, 0.83],
      [0.72, 0.67],
      [0.85, 0.47],
      [0.94, 0.26],
      [1, 0],
    ];
    for (const [at, strength] of stops) {
      ramp.addColorStop(at, rgba(theme.night, max * strength));
    }
    ctx.fillStyle = ramp;
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function legWeight(leg: GlobeLeg) {
    const dim = theme.arc.dimAlpha ?? 0.16;
    if (chapter && (!chapter[leg.fromIndex] || !chapter[leg.toIndex])) return dim * 0.4;
    if (trip) return trip.legs.includes(travelLegs.indexOf(leg)) ? 1 : dim * 0.6;
    if (!options.focus) return activeLeg >= 0 && travelLegs[activeLeg] !== leg ? dim : 1;
    if (activeLeg >= 0) return travelLegs[activeLeg] === leg ? 1 : dim;
    return leg.fromIndex === selected || leg.toIndex === selected ? 1 : dim;
  }

  /**
   * An arc rides above the surface, so part of it clears the limb even when its
   * midpoint is on the far side. Hide only what the sphere actually covers, and
   * fade the rest in four depth bands so one arc still costs one stroke each.
   */
  const DEPTH = [0.12, 0.42, 0.72, 1];

  function drawArcs() {
    const order = travelLegs.map((_, index) => index);
    order.sort((a, b) => legWeight(travelLegs[a]) - legWeight(travelLegs[b]));

    for (const index of order) {
      const leg = travelLegs[index];
      const style = leg.kind === "ground" ? theme.ground : theme.arc;
      if (!style) continue;
      const weight = legWeight(leg);
      const lit = weight > 0.9;
      ctx.lineWidth = lit ? style.width * (style.activeScale ?? 1.5) : style.width;
      ctx.strokeStyle = lit ? style.activeColor : style.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash(style.dash ?? []);
      ctx.shadowBlur = style.glow && lit ? style.glow : 0;
      if (ctx.shadowBlur) ctx.shadowColor = rgba(style.activeColor, 0.85);

      let open = false;
      let band = -1;
      let hasPrevious = false;
      let previousX = 0;
      let previousY = 0;
      for (let i = 0; i < leg.points.length; i += 3) {
        const p = project(i, leg.points);
        const rx = (p[0] - centerX) / radius;
        const ry = (p[1] - centerY) / radius;
        if (p[2] < 0 && rx * rx + ry * ry < 1) {
          if (open) {
            ctx.stroke();
            open = false;
          }
          hasPrevious = false;
          continue;
        }
        const next = p[2] > 0.55 ? 3 : p[2] > 0.22 ? 2 : p[2] > 0 ? 1 : 0;
        if (!open || next !== band) {
          if (open) ctx.stroke();
          band = next;
          ctx.globalAlpha = Math.min(1, style.alpha * weight * DEPTH[band]);
          ctx.beginPath();
          if (hasPrevious) ctx.moveTo(previousX, previousY);
          else ctx.moveTo(p[0], p[1]);
          ctx.lineTo(p[0], p[1]);
          open = true;
        } else {
          ctx.lineTo(p[0], p[1]);
        }
        previousX = p[0];
        previousY = p[1];
        hasPrevious = true;
      }
      if (open) ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }

  function drawMarkers(now: number) {
    const style = theme.marker;
    for (let i = 0; i < travelPlaces.length; i += 1) {
      const p = project(i * 3, shared.markers);
      projected[i * 3] = p[0];
      projected[i * 3 + 1] = p[1];
      projected[i * 3 + 2] = p[2];
      if (p[2] <= 0.02) continue;

      const active = i === selected;
      const warm = i === hovered;
      const muted = chapter ? !chapter[i] : false;
      const depth = 0.35 + 0.65 * p[2];
      const dark =
        !muted &&
        daylightOn &&
        shared.markers[i * 3] * sun[0] +
          shared.markers[i * 3 + 1] * sun[1] +
          shared.markers[i * 3 + 2] * sun[2] <
          0;
      const size = (active ? style.size * 1.5 : style.size) * (0.7 + 0.3 * p[2]);

      if (active && style.pulse && !reduceMotion) {
        const phase = (now % 2200) / 2200;
        ctx.globalAlpha = (1 - phase) * 0.5;
        ctx.strokeStyle = style.activeColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(p[0], p[1], size + phase * 22, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (active || warm) {
        ctx.globalAlpha = active ? 0.42 : 0.26;
        ctx.fillStyle = active ? style.activeColor : style.color;
        ctx.beginPath();
        ctx.arc(p[0], p[1], size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      const tone = active
        ? style.activeColor
        : dark && style.lights
          ? style.lights
          : style.color;
      ctx.globalAlpha =
        (active ? 1 : depth * (style.alpha ?? 1) * (dark ? 1 : 0.9)) * (muted ? 0.22 : 1);
      ctx.fillStyle = tone;
      if (style.glow || dark) {
        ctx.shadowColor = rgba(tone, 0.95);
        ctx.shadowBlur = active ? 14 : dark ? 9 : 6;
      }
      ctx.beginPath();
      ctx.arc(p[0], p[1], size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (style.ring) {
        ctx.globalAlpha = (active ? 0.95 : depth * 0.45) * (muted ? 0.3 : 1);
        ctx.strokeStyle = style.ring;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p[0], p[1], size + 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawLabel(index: number, emphatic: boolean) {
    const style = theme.label;
    if (!style) return;
    const x = projected[index * 3];
    const y = projected[index * 3 + 1];
    if (projected[index * 3 + 2] <= 0.05) return;
    const text = travelPlaces[index].place;
    ctx.font = emphatic ? style.activeFont : style.font;
    const textWidth = ctx.measureText(text).width;
    const padX = 9;
    const padY = 6;
    const boxWidth = textWidth + padX * 2;
    const boxHeight = 14 + padY * 2;
    const toRight = x < width - textWidth - 60;
    const boxX = toRight ? x + 14 : x - 14 - boxWidth;
    const boxY = y - 22 - (14 + padY);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = rgba(style.leader, emphatic ? 0.6 : 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (toRight ? 10 : -10), y - 16);
    ctx.lineTo(toRight ? boxX : boxX + boxWidth, y - 16);
    ctx.stroke();

    ctx.fillStyle = emphatic ? style.activeBackground : style.background;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 7);
    ctx.fill();
    ctx.strokeStyle = emphatic ? style.activeBorder : style.border;
    ctx.stroke();

    ctx.fillStyle = emphatic ? style.activeColor : style.color;
    ctx.textBaseline = "middle";
    ctx.fillText(text, boxX + padX, boxY + boxHeight / 2 + 0.5);
  }

  function sampleLeg(leg: GlobeLeg, t: number): Vec {
    const last = leg.points.length / 3 - 1;
    const f = Math.max(0, Math.min(last, t * last));
    const i = Math.floor(f);
    const j = Math.min(last, i + 1);
    const m = f - i;
    return [
      leg.points[i * 3] * (1 - m) + leg.points[j * 3] * m,
      leg.points[i * 3 + 1] * (1 - m) + leg.points[j * 3 + 1] * m,
      leg.points[i * 3 + 2] * (1 - m) + leg.points[j * 3 + 2] * m,
    ];
  }

  function aimAt(v: Vec) {
    const yaw = Math.atan2(-v[0], v[2]);
    const twoPi = Math.PI * 2;
    const delta = (((yaw - target.yaw + Math.PI) % twoPi) + twoPi) % twoPi - Math.PI;
    target.yaw += delta;
    target.pitch = Math.max(
      -0.8,
      Math.min(0.8, Math.atan2(v[1], Math.hypot(v[0], v[2]))),
    );
  }

  function stepTrip(now: number) {
    if (!trip) return;
    const leg = travelLegs[trip.legs[trip.at]];
    const delta = Math.min(64, now - trip.last);
    trip.last = now;
    trip.t += delta / Math.max(1600, Math.min(4600, 1200 + leg.km * 0.22));

    if (trip.t >= 1) {
      selected = leg.toIndex;
      trip.hooks.onArrive?.(travelPlaces[leg.toIndex], leg.toIndex);
      trip.at += 1;
      trip.t = 0;
      if (trip.at >= trip.legs.length) {
        const done = trip.hooks.onDone;
        trip = null;
        aimAt([
          shared.markers[selected * 3],
          shared.markers[selected * 3 + 1],
          shared.markers[selected * 3 + 2],
        ]);
        done?.();
        return;
      }
      trip.hooks.onLeg?.(travelLegs[trip.legs[trip.at]], trip.at);
    }
    aimAt(sampleLeg(travelLegs[trip.legs[trip.at]], trip.t));
  }

  function drawSprite(now: number) {
    if (!trip || !sprite || !sprite.complete || !sprite.naturalWidth) return;
    const v = sampleLeg(travelLegs[trip.legs[trip.at]], trip.t);
    const x1 = v[0] * cosYaw + v[2] * sinYaw;
    const z1 = -v[0] * sinYaw + v[2] * cosYaw;
    const y2 = v[1] * cosPitch - z1 * sinPitch;
    const screenX = centerX + x1 * radius;
    const screenY = centerY - y2 * radius;
    const spriteHeight = Math.max(30, radius * 0.15);
    const spriteWidth = (spriteHeight * sprite.naturalWidth) / sprite.naturalHeight;
    const bob = reduceMotion ? 0 : Math.sin(now / 260) * 2.5;

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = rgba(theme.arc.activeColor, 0.5);
    ctx.filter = "blur(6px)";
    ctx.beginPath();
    ctx.arc(screenX, screenY + 2, spriteHeight * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.drawImage(
      sprite,
      screenX - spriteWidth / 2,
      screenY - spriteHeight + bob,
      spriteWidth,
      spriteHeight,
    );
  }

  function frame(now: number) {
    if (dead) return;
    if (now - sunStamp > 30000) {
      sun = sunVector();
      sunStamp = now;
    }
    if (trip) stepTrip(now);

    rotation.yaw += (target.yaw - rotation.yaw) * 0.09;
    rotation.pitch += (target.pitch - rotation.pitch) * 0.09;
    cosYaw = Math.cos(rotation.yaw);
    sinYaw = Math.sin(rotation.yaw);
    cosPitch = Math.cos(rotation.pitch);
    sinPitch = Math.sin(rotation.pitch);

    ctx.clearRect(0, 0, width, height);
    drawAtmosphere();
    drawSphere();
    if (theme.graticule) drawLines(shared.graticule, theme.graticule);
    if (theme.stipple) drawPoints(shared.stipple, theme.stipple);
    if (theme.coast) drawLines(shared.coast, theme.coast);
    if (theme.equator) drawLines(shared.equator, theme.equator);
    drawNight();
    drawArcs();
    drawMarkers(now);
    drawSprite(now);
    if (hovered >= 0 && hovered !== selected) drawLabel(hovered, false);
    drawLabel(selected, true);
    frameId = requestAnimationFrame(frame);
  }

  function nearestMarker(x: number, y: number) {
    let best = -1;
    let bestDistance = 17 * 17;
    for (let i = 0; i < travelPlaces.length; i += 1) {
      if (projected[i * 3 + 2] <= 0.04) continue;
      const dx = projected[i * 3] - x;
      const dy = projected[i * 3 + 1] - y;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  }

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    moved = false;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    if (!dragging) {
      const hit = nearestMarker(event.clientX - rect.left, event.clientY - rect.top);
      if (hit !== hovered) {
        hovered = hit;
        canvas.style.cursor = hit >= 0 ? "pointer" : "grab";
        options.onHover?.(hit >= 0 ? travelPlaces[hit] : null);
      }
      return;
    }
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
    lastX = event.clientX;
    lastY = event.clientY;
    target.yaw += dx * 0.006;
    target.pitch = Math.max(-1.05, Math.min(1.05, target.pitch + dy * 0.006));
  }

  function onPointerUp(event: PointerEvent) {
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    dragging = false;
    if (moved) return;
    const rect = canvas.getBoundingClientRect();
    const hit = nearestMarker(event.clientX - rect.left, event.clientY - rect.top);
    if (hit >= 0) {
      handle.select(hit);
      options.onSelect?.(travelPlaces[hit], hit, true);
    }
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  frameId = requestAnimationFrame(frame);

  const handle: GlobeHandle = {
    select(index) {
      trip = null;
      selected = index;
      activeLeg = -1;
      const next = rotationFor(travelPlaces[index].lat, travelPlaces[index].lng);
      const twoPi = Math.PI * 2;
      const delta =
        (((next.yaw - target.yaw + Math.PI) % twoPi) + twoPi) % twoPi - Math.PI;
      target.yaw += delta;
      target.pitch = Math.max(-0.85, Math.min(0.85, next.pitch));
    },
    hoverLeg(index) {
      activeLeg = index;
    },
    setChapter(indices) {
      if (!indices) {
        chapter = null;
        return;
      }
      const mask = new Uint8Array(travelPlaces.length);
      indices.forEach((i) => {
        mask[i] = 1;
      });
      chapter = mask;
    },
    setDaylight(on) {
      daylightOn = on;
    },
    playTrip(legs, hooks) {
      if (!legs.length) return;
      trip = { legs, at: 0, t: 0, hooks: hooks ?? {}, last: performance.now() };
      activeLeg = -1;
      selected = travelLegs[legs[0]].fromIndex;
      trip.hooks.onLeg?.(travelLegs[legs[0]], 0);
    },
    stopTrip() {
      if (!trip) return;
      const hooks = trip.hooks;
      trip = null;
      hooks.onDone?.();
    },
    isPlaying() {
      return trip !== null;
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    },
  };

  return handle;
}
