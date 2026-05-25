"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const bodySrc = "/assets/slime/slime_body.png";
const eyeSrc = "/assets/slime/slime_eye.png";
const surpriseSrc = "/assets/slime/slime_surprise.png";
const surprisedEyeSrc = "/assets/slime/slime_surprised_eye.png";
const leftWingSrc = "/assets/slime/slime_left_wing.png";
const rightWingSrc = "/assets/slime/slime_right_wing.png";
const calmWingFrequency = 1 / 5.2;
const excitedWingFrequency = 1 / 0.62;

export function SlimeCompanion({ className = "" }: { className?: string }) {
  const slimeRef = useRef<HTMLButtonElement>(null);
  const targetFrequencyRef = useRef(calmWingFrequency);
  const [surprised, setSurprised] = useState(false);
  const [surpriseKey, setSurpriseKey] = useState(0);
  const [showSurprise, setShowSurprise] = useState(false);
  const eye = surprised
    ? { src: surprisedEyeSrc, width: 83, height: 39 }
    : { src: eyeSrc, width: 91, height: 54 };

  useEffect(() => {
    if (!showSurprise) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowSurprise(false);
    }, 780);

    return () => window.clearTimeout(timeout);
  }, [showSurprise, surpriseKey]);

  useEffect(() => {
    const slime = slimeRef.current;

    if (!slime) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    let frame = 0;
    let frequency = targetFrequencyRef.current;
    let lastTime = performance.now();
    let phase = -Math.PI / 2;

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      frequency +=
        (targetFrequencyRef.current - frequency) * (1 - Math.exp(-delta * 7));
      phase += Math.PI * 2 * frequency * delta;

      const wave = Math.sin(phase);
      const flapProgress = (wave + 1) / 2;
      const angle = wave * 10;

      slime.style.setProperty("--slime-left-wing-angle", `${angle}deg`);
      slime.style.setProperty("--slime-right-wing-angle", `${-angle}deg`);
      slime.style.setProperty(
        "--slime-left-wing-x",
        `${-0.08 * flapProgress}rem`,
      );
      slime.style.setProperty(
        "--slime-right-wing-x",
        `${0.08 * flapProgress}rem`,
      );
      slime.style.setProperty(
        "--slime-wing-y",
        `${-0.08 * flapProgress}rem`,
      );

      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const surpriseSlime = () => {
    targetFrequencyRef.current = excitedWingFrequency;
    setSurprised(true);
  };

  const calmSlime = () => {
    targetFrequencyRef.current = calmWingFrequency;
    setSurprised(false);
  };

  return (
    <button
      ref={slimeRef}
      type="button"
      className={`slime-companion ${
        surprised ? "slime-companion--surprised" : ""
      } ${className}`}
      aria-label="Surprise the slime"
      onClick={() => {
        surpriseSlime();
        setShowSurprise(true);
        setSurpriseKey((current) => current + 1);
      }}
      onPointerEnter={surpriseSlime}
      onPointerLeave={calmSlime}
    >
      <div className="slime-companion__stage">
        {showSurprise ? (
          <Image
            key={surpriseKey}
            src={surpriseSrc}
            alt=""
            width={65}
            height={59}
            className="slime-companion__pop"
          />
        ) : null}
        <Image
          src={leftWingSrc}
          alt=""
          width={51}
          height={49}
          className="slime-companion__wing slime-companion__wing--left"
        />
        <Image
          src={rightWingSrc}
          alt=""
          width={32}
          height={49}
          className="slime-companion__wing slime-companion__wing--right"
        />
        <Image
          src={bodySrc}
          alt=""
          width={148}
          height={111}
          className="slime-companion__body"
        />
        <Image
          key={eye.src}
          src={eye.src}
          alt=""
          width={eye.width}
          height={eye.height}
          className={`slime-companion__eyes ${
            surprised
              ? "slime-companion__eyes--surprised"
              : "slime-companion__eyes--normal"
          }`}
        />
      </div>
    </button>
  );
}
