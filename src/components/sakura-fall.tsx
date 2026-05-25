"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

const sakuraImages = [
  "/assets/decoration/sakura1.png",
  "/assets/decoration/sakura2.png",
  "/assets/decoration/sakura3.png",
  "/assets/decoration/sakura4.png",
];

type Petal = {
  id: number;
  src: string;
  size: string;
  startX: string;
  drift: string;
  duration: string;
  delay: string;
  opacity: string;
  rotation: string;
};

type PetalStyle = CSSProperties & {
  "--start-x": string;
  "--drift": string;
  "--rotation": string;
  "--duration": string;
  "--delay": string;
};

function randomUnit(seed: number) {
  const value = Math.sin(seed * 999.91) * 10000;
  return value - Math.floor(value);
}

function randomBetween(seed: number, min: number, max: number) {
  return randomUnit(seed) * (max - min) + min;
}

function fixed(seed: number, min: number, max: number, decimals = 2) {
  return randomBetween(seed, min, max).toFixed(decimals);
}

const petals: Petal[] = Array.from({ length: 24 }, (_, id) => ({
  id,
  src: sakuraImages[id % sakuraImages.length],
  size: fixed(id + 1, 18, 42),
  startX: fixed(id + 11, -8, 108),
  drift: fixed(id + 21, -18, 22),
  duration: fixed(id + 31, 13, 28),
  delay: fixed(id + 41, -28, 0),
  opacity: fixed(id + 51, 0.24, 0.58, 3),
  rotation: fixed(id + 61, -180, 180),
}));

export function SakuraFall() {
  return (
    <div aria-hidden="true" className="sakura-layer">
      {petals.map((petal) => {
        const style: PetalStyle = {
          "--start-x": `${petal.startX}vw`,
          "--drift": `${petal.drift}vw`,
          "--rotation": `${petal.rotation}deg`,
          "--duration": `${petal.duration}s`,
          "--delay": `${petal.delay}s`,
          opacity: petal.opacity,
          width: `${petal.size}px`,
          height: `${petal.size}px`,
        };

        return (
          <Image
            key={petal.id}
            src={petal.src}
            alt=""
            width={48}
            height={48}
            className="sakura-petal"
            style={style}
          />
        );
      })}
    </div>
  );
}
