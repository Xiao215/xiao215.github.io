// Tiny 2D physics for throwable balls: gravity, air drag, walls, a static
// ellipse collider, ball-to-ball impulses, drawing, and grab-and-fling input.
// Units are CSS pixels and seconds.

export type BallKind = "basketball" | "tennis" | "shuttle";

export type Ball = {
  kind: BallKind;
  r: number;
  mass: number;
  restitution: number;
  // Quadratic drag coefficient; the shuttle's is high enough that it falls
  // at a gentle terminal speed and always turns cork-first.
  drag: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  // Shuttle heading (cork direction) in radians.
  heading: number;
  resting: boolean;
};

export type Point = { x: number; y: number };

const gravity = 1700;
// Impacts slower than this settle instead of bouncing, so balls come to rest.
const restSpeed = 150;

const kinds: Record<BallKind, { mass: number; restitution: number; drag: number }> = {
  basketball: { mass: 6, restitution: 0.72, drag: 0.0003 },
  tennis: { mass: 1.2, restitution: 0.82, drag: 0.0005 },
  shuttle: { mass: 0.3, restitution: 0.16, drag: 0.012 },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerpAngle(from: number, to: number, t: number) {
  const delta = ((to - from + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  return from + delta * t;
}

export function createBall(kind: BallKind, r: number): Ball {
  return {
    kind,
    r,
    ...kinds[kind],
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    spin: 0,
    heading: 0.32,
    resting: false,
  };
}

export function integrate(ball: Ball, dt: number, width: number, floorY: number) {
  ball.vy += gravity * dt;
  const drag = Math.min(0.9, ball.drag * Math.hypot(ball.vx, ball.vy) * dt);
  ball.vx -= ball.vx * drag;
  ball.vy -= ball.vy * drag;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  ball.resting = false;

  if (ball.x < ball.r) {
    ball.x = ball.r;
    ball.vx = Math.abs(ball.vx) * ball.restitution;
  } else if (ball.x > width - ball.r) {
    ball.x = width - ball.r;
    ball.vx = -Math.abs(ball.vx) * ball.restitution;
  }

  if (ball.y < ball.r) {
    ball.y = ball.r;
    ball.vy = Math.abs(ball.vy) * ball.restitution;
  }

  if (ball.y > floorY - ball.r) {
    const impact = ball.vy;
    ball.y = floorY - ball.r;

    if (impact > restSpeed) {
      ball.vy = -impact * ball.restitution;
    } else {
      ball.vy = 0;
      ball.resting = true;
    }
  }
}

function resolve(
  ball: Ball,
  nx: number,
  ny: number,
  depth: number,
  restitution: number,
) {
  ball.x += nx * depth;
  ball.y += ny * depth;
  const normalSpeed = ball.vx * nx + ball.vy * ny;

  if (normalSpeed >= 0) {
    return 0;
  }

  const impact = -normalSpeed;

  // A slow landing on top of something: sit on it.
  if (ny < -0.6 && impact < restSpeed) {
    ball.vx -= normalSpeed * nx;
    ball.vy -= normalSpeed * ny;
    ball.resting = true;
    return 0;
  }

  const bounce = Math.sqrt(restitution * ball.restitution);
  ball.vx -= (1 + bounce) * normalSpeed * nx;
  ball.vy -= (1 + bounce) * normalSpeed * ny;
  return impact;
}

// Collide with a static ellipse. Returns the impact speed (0 if no bounce).
export function hitEllipse(
  ball: Ball,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  restitution: number,
) {
  const sx = ball.x - cx;
  const sy = (ball.y - cy) * (rx / ry);
  const distance = Math.hypot(sx, sy);

  if (distance > rx + ball.r * 2 || distance < 1e-6) {
    return 0;
  }

  // Approximate nearest point along the scaled radius, then the true normal.
  const px = cx + (sx / distance) * rx;
  const py = cy + (sy / distance) * ry;
  let nx = (px - cx) / (rx * rx);
  let ny = (py - cy) / (ry * ry);
  const length = Math.hypot(nx, ny);
  nx /= length;
  ny /= length;
  const gap = (ball.x - px) * nx + (ball.y - py) * ny;

  if (gap >= ball.r) {
    return 0;
  }

  return resolve(ball, nx, ny, ball.r - gap, restitution);
}

// Pairwise ball collisions; a held ball behaves as if infinitely heavy.
export function collideBalls(balls: Ball[], held: Ball | null) {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i];
      const b = balls[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const min = a.r + b.r;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq >= min * min || distanceSq === 0) {
        continue;
      }

      const distance = Math.sqrt(distanceSq);
      const nx = dx / distance;
      const ny = dy / distance;
      const invA = a === held ? 0 : 1 / a.mass;
      const invB = b === held ? 0 : 1 / b.mass;
      const invSum = invA + invB;

      if (invSum === 0) {
        continue;
      }

      const overlap = min - distance;
      a.x -= (nx * overlap * invA) / invSum;
      a.y -= (ny * overlap * invA) / invSum;
      b.x += (nx * overlap * invB) / invSum;
      b.y += (ny * overlap * invB) / invSum;

      const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;

      if (closing <= 0) {
        continue;
      }

      const impulse =
        ((1 + Math.min(a.restitution, b.restitution)) * closing) / invSum;
      a.vx -= impulse * invA * nx;
      a.vy -= impulse * invA * ny;
      b.vx += impulse * invB * nx;
      b.vy += impulse * invB * ny;
    }
  }
}

// Rolling friction, spin, and shuttle orientation. Call after collisions.
export function settle(ball: Ball, dt: number) {
  if (ball.resting) {
    ball.vx *= Math.pow(ball.kind === "shuttle" ? 0.02 : 0.3, dt);

    if (Math.abs(ball.vx) < 2) {
      ball.vx = 0;
    }
  }

  if (ball.kind === "shuttle") {
    if (ball.resting) {
      // Lying on its side, cork slightly down.
      const side = Math.cos(ball.heading) >= 0 ? 0.32 : Math.PI - 0.32;
      ball.heading = lerpAngle(ball.heading, side, Math.min(1, dt * 8));
    } else if (Math.hypot(ball.vx, ball.vy) > 25) {
      const flight = Math.atan2(ball.vy, ball.vx);
      ball.heading = lerpAngle(ball.heading, flight, Math.min(1, dt * 7));
    }

    return;
  }

  if (ball.resting) {
    ball.spin = ball.vx / ball.r;
  }

  ball.angle += ball.spin * dt;
}

/* ---------- drawing ---------- */

function drawSphere(
  g: CanvasRenderingContext2D,
  ball: Ball,
  light: string,
  dark: string,
  seam: string,
  seamWidth: number,
  tennis: boolean,
) {
  const r = ball.r;
  g.save();
  g.translate(ball.x, ball.y);
  g.rotate(ball.angle);
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  const shade = g.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  shade.addColorStop(0, light);
  shade.addColorStop(1, dark);
  g.fillStyle = shade;
  g.fill();
  g.clip();
  g.strokeStyle = seam;
  g.lineWidth = Math.max(1.2, r * seamWidth);
  g.lineCap = "round";

  if (!tennis) {
    g.beginPath();
    g.moveTo(-r, 0);
    g.lineTo(r, 0);
    g.moveTo(0, -r);
    g.lineTo(0, r);
    g.stroke();
  }

  const offset = tennis ? 1.25 : 1.35;
  const radius = tennis ? 0.95 : 1;
  const sweep = tennis ? 1 : 1.05;
  g.beginPath();
  g.arc(-r * offset, 0, r * radius, -sweep, sweep);
  g.stroke();
  g.beginPath();
  g.arc(r * offset, 0, r * radius, Math.PI - sweep, Math.PI + sweep);
  g.stroke();
  g.restore();
}

function drawShuttle(g: CanvasRenderingContext2D, ball: Ball) {
  const r = ball.r;
  g.save();
  g.translate(ball.x, ball.y);
  g.rotate(ball.heading);

  // feather skirt
  g.beginPath();
  g.moveTo(-r * 0.3, -r * 0.62);
  g.lineTo(-r * 3.1, -r * 1.55);
  g.lineTo(-r * 3.1, r * 1.55);
  g.lineTo(-r * 0.3, r * 0.62);
  g.closePath();
  g.fillStyle = "rgba(246,237,247,0.94)";
  g.fill();
  g.strokeStyle = "#b9aecb";
  g.lineWidth = 0.9;

  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(-r * 0.3, r * 0.3 * i);
    g.lineTo(-r * 3.1, r * 0.75 * i);
    g.stroke();
  }

  g.strokeStyle = "#d890c0";
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(-r * 1.3, -r * 0.95);
  g.lineTo(-r * 1.3, r * 0.95);
  g.stroke();

  // cork
  g.beginPath();
  g.moveTo(-r * 0.4, -r * 0.7);
  g.lineTo(r * 0.1, -r * 0.7);
  g.arc(r * 0.1, 0, r * 0.7, -Math.PI / 2, Math.PI / 2);
  g.lineTo(-r * 0.4, r * 0.7);
  g.closePath();
  g.fillStyle = "#f0d8c0";
  g.fill();
  g.fillStyle = "#c9a77f";
  g.fillRect(-r * 0.4, -r * 0.7, r * 0.22, r * 1.4);
  g.restore();
}

export function drawBall(g: CanvasRenderingContext2D, ball: Ball) {
  if (ball.kind === "basketball") {
    drawSphere(g, ball, "#f6ae7c", "#c2622f", "rgba(58,28,20,0.8)", 0.07, false);
  } else if (ball.kind === "tennis") {
    drawSphere(g, ball, "#eef59a", "#aebd3c", "rgba(251,251,240,0.92)", 0.13, true);
  } else {
    drawShuttle(g, ball);
  }
}

export function drawShadow(g: CanvasRenderingContext2D, ball: Ball, floorY: number) {
  const nearness = clamp(1 - (floorY - (ball.y + ball.r)) / 320, 0, 1);

  if (nearness <= 0) {
    return;
  }

  g.fillStyle = `rgba(10,10,30,${0.35 * nearness})`;
  g.beginPath();
  g.ellipse(ball.x, floorY + 1, ball.r * (0.5 + 0.5 * nearness), 3.5 * nearness + 1, 0, 0, Math.PI * 2);
  g.fill();
}

// The shuttle's grab area covers its skirt, not just the cork.
function grabCircle(ball: Ball) {
  if (ball.kind === "shuttle") {
    return {
      x: ball.x - Math.cos(ball.heading) * ball.r * 1.3,
      y: ball.y - Math.sin(ball.heading) * ball.r * 1.3,
      r: ball.r * 2.3,
    };
  }

  return { x: ball.x, y: ball.y, r: ball.r + 8 };
}

export function ballAt(balls: Ball[], point: Point) {
  for (let i = balls.length - 1; i >= 0; i--) {
    const circle = grabCircle(balls[i]);

    if (Math.hypot(point.x - circle.x, point.y - circle.y) < circle.r) {
      return balls[i];
    }
  }

  return null;
}

export function drawHoverRing(g: CanvasRenderingContext2D, ball: Ball) {
  const circle = grabCircle(ball);
  g.save();
  g.strokeStyle = "rgba(241,165,216,0.55)";
  g.lineWidth = 1.5;
  g.setLineDash([3, 4]);
  g.beginPath();
  g.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

/* ---------- grab and fling ---------- */

type GrabOptions = {
  balls: Ball[];
  bounds: (ball: Ball) => [minX: number, maxX: number, minY: number, maxY: number];
  onGrab?: (ball: Ball) => void;
  onTap?: (ball: Ball) => void;
  onTapEmpty?: (point: Point) => void;
  cursorAt?: (point: Point) => string;
};

export type GrabState = { held: Ball | null; hovered: Ball | null };

export function attachGrab(element: HTMLElement, options: GrabOptions) {
  const state: GrabState = { held: null, hovered: null };
  let drag: {
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
    startTime: number;
    history: { x: number; y: number; t: number }[];
  } | null = null;

  const local = (event: PointerEvent): Point => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  function onPointerDown(event: PointerEvent) {
    const point = local(event);
    const ball = ballAt(options.balls, point);

    if (!ball) {
      options.onTapEmpty?.(point);
      return;
    }

    const now = performance.now();
    drag = {
      offsetX: ball.x - point.x,
      offsetY: ball.y - point.y,
      startX: point.x,
      startY: point.y,
      startTime: now,
      history: [{ ...point, t: now }],
    };
    state.held = ball;
    ball.vx = 0;
    ball.vy = 0;
    ball.spin = 0;
    options.onGrab?.(ball);
    element.setPointerCapture(event.pointerId);
    element.style.cursor = "grabbing";
    event.preventDefault();
  }

  function onPointerMove(event: PointerEvent) {
    const point = local(event);
    const ball = state.held;

    if (!ball || !drag) {
      state.hovered = ballAt(options.balls, point);
      element.style.cursor = state.hovered ? "grab" : (options.cursorAt?.(point) ?? "");
      return;
    }

    const now = performance.now();
    const [minX, maxX, minY, maxY] = options.bounds(ball);
    ball.x = clamp(point.x + drag.offsetX, minX, maxX);
    ball.y = clamp(point.y + drag.offsetY, minY, maxY);
    drag.history.push({ ...point, t: now });

    // Throw velocity comes from roughly the last 90 ms of movement.
    while (drag.history.length > 2 && now - drag.history[0].t > 90) {
      drag.history.shift();
    }

    const first = drag.history[0];
    const elapsed = Math.max(0.016, (now - first.t) / 1000);
    ball.vx = (point.x - first.x) / elapsed;
    ball.vy = (point.y - first.y) / elapsed;

    if (ball.kind === "shuttle" && Math.hypot(ball.vx, ball.vy) > 40) {
      ball.heading = lerpAngle(ball.heading, Math.atan2(ball.vy, ball.vx), 0.25);
    }
  }

  function onPointerUp(event: PointerEvent) {
    const ball = state.held;

    if (!ball || !drag) {
      return;
    }

    const point = local(event);
    const now = performance.now();
    const moved = Math.hypot(point.x - drag.startX, point.y - drag.startY);

    if (moved < 6 && now - drag.startTime < 350) {
      ball.vx = 0;
      ball.vy = 0;
      options.onTap?.(ball);
    } else {
      // Holding still before letting go drops the ball instead of throwing.
      if (now - drag.history[drag.history.length - 1].t > 60) {
        ball.vx = 0;
        ball.vy = 0;
      }

      const speed = Math.hypot(ball.vx, ball.vy);
      const maxSpeed = 2800;

      if (speed > maxSpeed) {
        ball.vx *= maxSpeed / speed;
        ball.vy *= maxSpeed / speed;
      }

      if (ball.kind !== "shuttle") {
        ball.spin = (ball.vx / ball.r) * 0.6;
      }
    }

    drag = null;
    state.held = null;
    element.style.cursor = "grab";
  }

  function onPointerLeave() {
    if (!state.held) {
      state.hovered = null;
    }
  }

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointercancel", onPointerUp);
  element.addEventListener("pointerleave", onPointerLeave);

  return {
    state,
    detach() {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("pointerleave", onPointerLeave);
    },
  };
}
