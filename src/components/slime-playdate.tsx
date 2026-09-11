"use client";

import { useEffect, useRef, useState } from "react";
import { playNote, unlockAudio } from "@/lib/piano-synth";
import {
  attachGrab,
  clamp,
  collideBalls,
  createBall,
  drawBall,
  drawHoverRing,
  drawShadow,
  hitEllipse,
  integrate,
  settle,
  type BallKind,
  type Point,
} from "@/lib/toy-physics";

const art = {
  body: "/assets/slime/slime_body.png",
  eye: "/assets/slime/slime_eye.png",
  surprisedEye: "/assets/slime/slime_surprised_eye.png",
  pop: "/assets/slime/slime_surprise.png",
  leftWing: "/assets/slime/slime_left_wing.png",
  rightWing: "/assets/slime/slime_right_wing.png",
};

const introCaption = "Throw something at the slime. It doesn't mind.";
const bonkCaptions = [
  "Boing.",
  "Bonk! It's fine, it liked that.",
  "The slime would like to go again.",
  "Direct hit. No slimes were harmed.",
];
const tapCaptions: Record<BallKind, string> = {
  basketball: "Basketball. The heavy one.",
  tennis: "Tennis ball. The bounciest.",
  shuttle: "Shuttlecock. Lots of drag, barely bounces, and it always flips cork-first.",
};

// Same flap rates and pop timing as the corner companion (slime-companion.tsx).
const calmWingFrequency = 1 / 5.2;
const excitedWingFrequency = 1 / 0.62;
const popDuration = 0.78;

export function SlimePlaydate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [bonks, setBonks] = useState(0);
  const [caption, setCaption] = useState(introCaption);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const g = context;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const images = Object.fromEntries(
      Object.entries(art).map(([key, src]) => {
        const image = new Image();
        image.src = src;
        return [key, image];
      }),
    ) as Record<keyof typeof art, HTMLImageElement>;
    const balls = [
      createBall("basketball", 18),
      createBall("tennis", 10),
      createBall("shuttle", 8),
    ];

    let width = 0;
    let height = 0;
    let floorY = 0;
    let ready = false;
    let visible = true;
    let frameId = 0;
    let lastTime = performance.now();
    let clock = 0;
    let bonkCount = 0;
    let surprisedUntil = -1;
    let popAt = -10;
    let squashAt = -10;
    let squashAmount = 0;
    let wingPhase = -Math.PI / 2;
    let wingFrequency = calmWingFrequency;
    let boings: { x: number; y: number; age: number }[] = [];
    // Slime stage box (mirrors the companion's 210:142 stage) and its
    // collision ellipse around the body.
    const slime = { stageWidth: 0, stageHeight: 0, left: 0, top: 0, bodyX: 0, bodyY: 0, bodyWidth: 0, bodyHeight: 0, bottom: 0, cx: 0, cy: 0, rx: 0, ry: 0 };

    function layout() {
      const rect = canvas!.getBoundingClientRect();

      // A hidden or not-yet-laid-out canvas reports 0 × 0; wait for real
      // dimensions before placing the balls, or they all start at x = 0.
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      floorY = height - 40;

      const stageWidth = clamp(width * 0.26, 150, 250);
      const stageHeight = (stageWidth * 142) / 210;
      const stageBottom = floorY + 4 + 0.08 * stageHeight;
      const bodyWidth = 0.72 * stageWidth;
      const bodyHeight = (bodyWidth * 111) / 148;
      const bottom = stageBottom - 0.08 * stageHeight;
      const left = width * 0.64 - stageWidth / 2;
      Object.assign(slime, {
        stageWidth,
        stageHeight,
        left,
        top: stageBottom - stageHeight,
        bodyX: left + 0.16 * stageWidth,
        bodyY: bottom - bodyHeight,
        bodyWidth,
        bodyHeight,
        bottom,
        cx: left + 0.16 * stageWidth + bodyWidth / 2,
        cy: bottom - bodyHeight * 0.46,
        rx: bodyWidth * 0.47,
        ry: bodyHeight * 0.52,
      });

      if (!ready) {
        ready = true;
        place();
      }

      for (const ball of balls) {
        ball.x = clamp(ball.x, ball.r, width - ball.r);
        ball.y = Math.min(ball.y, floorY - ball.r);
      }
    }

    function place() {
      [0.16, 0.26, 0.34].forEach((fraction, index) => {
        const ball = balls[index];
        ball.x = width * fraction;
        ball.y = floorY - ball.r;
        ball.vx = 0;
        ball.vy = 0;
        ball.spin = 0;
      });
      balls[2].heading = 0.32;
    }

    function insideSlime(point: Point) {
      return (
        ready &&
        ((point.x - slime.cx) / slime.rx) ** 2 +
          ((point.y - slime.cy) / slime.ry) ** 2 <
          1
      );
    }

    function surprise(strength: number) {
      surprisedUntil = clock + 0.9;
      popAt = clock;
      squashAt = clock;
      squashAmount = clamp(strength, 0.25, 1);
    }

    function chime(notes: number[]) {
      notes.forEach((midi, index) =>
        playNote(midi, { velocity: 0.4, delay: index * 0.06 }),
      );
    }

    function bonk(ball: (typeof balls)[number], impact: number) {
      bonkCount++;
      setBonks(bonkCount);
      setCaption(bonkCaptions[bonkCount % bonkCaptions.length]);
      surprise(impact / 1200);
      chime([79, 84]);
      boings.push({ x: slime.cx, y: slime.bodyY - 18, age: 0 });

      // Throw balls back; a shuttle is light enough to just settle on top.
      if (ball.kind !== "shuttle") {
        ball.vy = Math.min(ball.vy, -520);
        ball.vx += (Math.sign(ball.x - slime.cx) || -1) * 220;
      }
    }

    const grab = attachGrab(canvas, {
      balls,
      bounds: (ball) => [ball.r, width - ball.r, ball.r, floorY - ball.r],
      onTap: (ball) => setCaption(tapCaptions[ball.kind]),
      onTapEmpty: (point) => {
        if (insideSlime(point)) {
          surprise(0.5);
          chime([76, 79]);
        }
      },
      cursorAt: (point) => (insideSlime(point) ? "pointer" : ""),
    });

    function step(dt: number) {
      clock += dt;

      for (const ball of balls) {
        if (ball === grab.state.held) {
          continue;
        }

        integrate(ball, dt, width, floorY);
        const impact = hitEllipse(ball, slime.cx, slime.cy, slime.rx, slime.ry, 1);

        if (impact > 200) {
          bonk(ball, impact);
        }
      }

      collideBalls(balls, grab.state.held);
      balls.forEach((ball) => settle(ball, dt));

      const targetFrequency =
        clock < surprisedUntil ? excitedWingFrequency : calmWingFrequency;
      wingFrequency += (targetFrequency - wingFrequency) * (1 - Math.exp(-dt * 7));

      if (!reduceMotion) {
        wingPhase += Math.PI * 2 * wingFrequency * dt;
      }
    }

    function drawImage(image: HTMLImageElement, x: number, y: number, w: number, h: number) {
      if (image.complete && image.naturalWidth) {
        g.drawImage(image, x, y, w, h);
      }
    }

    function drawWing(
      image: HTMLImageElement,
      x: number,
      y: number,
      w: number,
      h: number,
      originX: number,
      originY: number,
      angle: number,
    ) {
      g.save();
      g.translate(x + w * originX, y + h * originY);
      g.rotate(angle);
      drawImage(image, -w * originX, -h * originY, w, h);
      g.restore();
    }

    function drawSlime() {
      const { stageWidth: sw, stageHeight: sh, left, top, bottom } = slime;
      const surprised = clock < surprisedUntil;
      const bob = reduceMotion ? 0 : Math.sin((clock / 6.4) * Math.PI * 2) * 3;
      const sinceSquash = clock - squashAt;
      const squash = reduceMotion
        ? 0
        : squashAmount * Math.exp(-6 * sinceSquash) * Math.cos(18 * sinceSquash);

      g.save();
      g.translate(slime.cx, bottom);
      g.scale(1 + squash * 0.12, 1 - squash * 0.14);
      g.translate(-slime.cx, -bottom + bob);

      g.fillStyle = "rgba(10,10,30,0.35)";
      g.beginPath();
      g.ellipse(slime.cx, bottom - bob + 2, slime.bodyWidth * 0.5, 7, 0, 0, Math.PI * 2);
      g.fill();

      drawImage(images.body, slime.bodyX, slime.bodyY, slime.bodyWidth, slime.bodyHeight);

      const angle = (Math.sin(wingPhase) * 10 * Math.PI) / 180;
      const leftWingWidth = 0.3 * sw;
      const rightWingWidth = 0.23 * sw;
      drawWing(images.leftWing, left + 0.01 * sw, top + 0.32 * sh, leftWingWidth, (leftWingWidth * 49) / 51, 0.82, 0.58, angle);
      drawWing(images.rightWing, left + sw * 1.03 - rightWingWidth, top + 0.3 * sh, rightWingWidth, (rightWingWidth * 49) / 32, 0.18, 0.58, -angle);

      // Eyes drift toward whichever ball is closest.
      let nearest = balls[0];
      for (const ball of balls) {
        if (Math.hypot(ball.x - slime.cx, ball.y - slime.cy) < Math.hypot(nearest.x - slime.cx, nearest.y - slime.cy)) {
          nearest = ball;
        }
      }
      const lookX = clamp((nearest.x - slime.cx) / 60, -1, 1) * 4;
      const lookY = clamp((nearest.y - slime.cy) / 60, -1, 1) * 3;

      if (surprised) {
        const w = 0.32 * sw;
        drawImage(images.surprisedEye, left + 0.35 * sw + lookX, top + 0.41 * sh + lookY, w, (w * 39) / 83);
      } else {
        const w = 0.35 * sw;
        drawImage(images.eye, left + 0.36 * sw + lookX, top + 0.38 * sh + lookY, w, (w * 54) / 91);
      }

      // The "!" pop, keyed like the companion's slime-surprise-pop animation.
      const t = (clock - popAt) / popDuration;

      if (t >= 0 && t < 1) {
        const w = 0.31 * sw;
        const h = (w * 59) / 65;
        const scale = t < 0.22 ? 0.55 + 0.53 * (t / 0.22) : t < 0.7 ? 1 : 1 - 0.08 * ((t - 0.7) / 0.3);
        const lift = t < 0.22 ? 5.6 - 8 * (t / 0.22) : t < 0.7 ? -2.4 - 2.4 * ((t - 0.22) / 0.48) : -4.8 - 5.6 * ((t - 0.7) / 0.3);
        g.save();
        g.globalAlpha = t < 0.22 ? t / 0.22 : t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        g.translate(left + 0.27 * sw, top - 0.05 * sh + h / 2 + lift);
        g.scale(scale, scale);
        drawImage(images.pop, -w / 2, -h / 2, w, h);
        g.restore();
      }

      g.restore();
    }

    function draw(dt: number) {
      g.clearRect(0, 0, width, height);

      const wall = g.createLinearGradient(0, 0, 0, floorY);
      wall.addColorStop(0, "#252838");
      wall.addColorStop(1, "#1f2230");
      g.fillStyle = wall;
      g.fillRect(0, 0, width, floorY);

      const floor = g.createLinearGradient(0, floorY, 0, height);
      floor.addColorStop(0, "#2e3246");
      floor.addColorStop(1, "#23263a");
      g.fillStyle = floor;
      g.fillRect(0, floorY, width, height - floorY);
      g.fillStyle = "rgba(241,165,216,0.1)";
      g.beginPath();
      g.ellipse(slime.cx, floorY + 10, slime.bodyWidth * 0.95, 12, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "rgba(0,0,0,0.25)";
      g.fillRect(0, floorY, width, 2);

      balls.forEach((ball) => drawShadow(g, ball, floorY));
      drawSlime();
      balls.forEach((ball) => drawBall(g, ball));

      if (grab.state.hovered && !grab.state.held) {
        drawHoverRing(g, grab.state.hovered);
      }

      boings = boings.filter((boing) => {
        boing.age += dt;

        if (boing.age > 1.4) {
          return false;
        }

        g.save();
        g.globalAlpha = boing.age < 1 ? 1 : 1 - (boing.age - 1) / 0.4;
        g.fillStyle = "#f1a5d8";
        g.font = '600 15px "SFMono-Regular", Consolas, monospace';
        g.textAlign = "center";
        g.fillText("boing!", boing.x, boing.y - boing.age * 26);
        g.restore();
        return true;
      });
    }

    function frame(time: number) {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      if (visible && ready) {
        // Fixed small substeps keep fast throws from tunnelling.
        const steps = Math.max(1, Math.ceil(dt * 240));

        for (let i = 0; i < steps; i++) {
          step(dt / steps);
        }

        draw(dt);
      }

      frameId = requestAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
    });
    intersectionObserver.observe(canvas);
    canvas.addEventListener("pointerdown", unlockAudio);
    resetRef.current = () => {
      if (ready) {
        place();
      }
    };
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointerdown", unlockAudio);
      grab.detach();
      resetRef.current = () => {};
    };
  }, []);

  return (
    <section className="min-w-0 overflow-hidden rounded-md border border-line/70 bg-surface/70 shadow-[0_24px_90px_rgba(24,24,72,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 px-4 py-3 text-sm text-muted">
        <p aria-live="polite" className="min-h-6 flex-1 basis-64">
          {caption}
        </p>
        <span className="font-mono text-xs uppercase text-accent">
          Bonks
          <span className="ml-2 text-foreground tabular-nums">{bonks}</span>
        </span>
        <button
          type="button"
          onClick={() => resetRef.current()}
          className="rounded-md border border-line/80 bg-surface-soft/70 px-3 py-1.5 font-mono text-sm text-foreground/85 transition hover:border-accent-strong hover:text-accent-strong"
        >
          Reset
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="block h-[clamp(360px,46vw,500px)] w-full touch-none"
        aria-label="The slime sitting on the floor next to a basketball, a tennis ball and a shuttlecock. Drag a ball to throw it at the slime."
      />
    </section>
  );
}
