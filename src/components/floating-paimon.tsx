import Image from "next/image";

type Point = readonly [number, number];

const floatingBodySrc = "/assets/paimon/floating/body.png";
const floatingWingSrc = "/assets/paimon/floating/wing.png";
const hiSrc = "/assets/paimon/waving/paimon.png";
const confusedSrc = "/assets/paimon/confused/paimon.png";
const paimonStars = [
  {
    points: [
      [14, 32],
      [62, 22],
    ],
    flexPoints: [
      [14, 30],
      [62, 24],
    ],
    duration: "3.1s",
    begin: "0s",
  },
  {
    points: [
      [12, 32],
      [36, 18],
      [64, 27],
    ],
    flexPoints: [
      [12, 30],
      [37, 21],
      [64, 25],
    ],
    duration: "3.7s",
    begin: "-0.8s",
  },
  {
    points: [
      [12, 25],
      [37, 34],
      [64, 22],
    ],
    flexPoints: [
      [12, 27],
      [38, 32],
      [64, 24],
    ],
    duration: "3.4s",
    begin: "-0.35s",
  },
  {
    points: [
      [12, 22],
      [28, 34],
      [46, 19],
      [64, 28],
    ],
    flexPoints: [
      [12, 24],
      [29, 32],
      [45, 21],
      [64, 26],
    ],
    duration: "3.9s",
    begin: "-1.9s",
  },
] satisfies {
  points: Point[];
  flexPoints: Point[];
  duration: string;
  begin: string;
}[];

function toStarPath(points: Point[]) {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")}`;
}

function PaimonStars() {
  return (
    <>
      {paimonStars.map((star, index) => {
        const path = toStarPath(star.points);
        const flexPath = toStarPath(star.flexPoints);
        const pathValues = `${path}; ${flexPath}; ${path}`;
        const timing = {
          dur: star.duration,
          begin: star.begin,
          repeatCount: "indefinite",
          calcMode: "spline",
          keyTimes: "0;0.5;1",
          keySplines: "0.45 0 0.55 1;0.45 0 0.55 1",
        };

        return (
          <span
            key={path}
            className={`confused-paimon__star confused-paimon__star--${
              index + 1
            }`}
          >
            <svg
              viewBox="0 0 76 54"
              role="presentation"
              focusable="false"
              className="confused-paimon__star-svg"
            >
              <path d={path} className="confused-paimon__star-aura">
                <animate attributeName="d" values={pathValues} {...timing} />
              </path>
              <path d={path} className="confused-paimon__star-core">
                <animate attributeName="d" values={pathValues} {...timing} />
              </path>
              <path
                d={path}
                pathLength={100}
                className="confused-paimon__star-shine"
              >
                <animate attributeName="d" values={pathValues} {...timing} />
              </path>
              {star.points.map(([x, y], pointIndex) => {
                const [flexX, flexY] = star.flexPoints[pointIndex];
                const cxValues = `${x}; ${flexX}; ${x}`;
                const cyValues = `${y}; ${flexY}; ${y}`;

                return (
                  <g key={`${x}-${y}-${pointIndex}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5.4"
                      className="confused-paimon__node-aura"
                    >
                      <animate attributeName="cx" values={cxValues} {...timing} />
                      <animate attributeName="cy" values={cyValues} {...timing} />
                    </circle>
                    <circle
                      cx={x}
                      cy={y}
                      r="2.7"
                      className="confused-paimon__node-core"
                    >
                      <animate attributeName="cx" values={cxValues} {...timing} />
                      <animate attributeName="cy" values={cyValues} {...timing} />
                    </circle>
                    <circle
                      cx={x - 0.8}
                      cy={y - 0.8}
                      r="0.85"
                      className="confused-paimon__node-shine"
                    >
                      <animate
                        attributeName="cx"
                        values={`${x - 0.8}; ${flexX - 0.8}; ${x - 0.8}`}
                        {...timing}
                      />
                      <animate
                        attributeName="cy"
                        values={`${y - 0.8}; ${flexY - 0.8}; ${y - 0.8}`}
                        {...timing}
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>
          </span>
        );
      })}
    </>
  );
}

export function PaimonHi({
  className = "",
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={`paimon-hi ${inline ? "paimon-hi--inline" : ""} ${className}`}
      aria-hidden="true"
    >
      <div className="paimon-hi__stage">
        <Image
          src={hiSrc}
          alt=""
          width={262}
          height={394}
          className="paimon-hi__image"
          priority
        />
        <PaimonStars />
      </div>
    </div>
  );
}

export function FloatingPaimon() {
  return (
    <div className="floating-paimon" aria-hidden="true">
      <div className="floating-paimon__stage">
        <Image
          src={floatingWingSrc}
          alt=""
          width={188}
          height={145}
          className="floating-paimon__wing"
          priority
        />
        <Image
          src={floatingBodySrc}
          alt=""
          width={321}
          height={477}
          className="floating-paimon__body"
          priority
        />
        <PaimonStars />
      </div>
    </div>
  );
}

export function ConfusedPaimon({ className = "" }: { className?: string }) {
  return (
    <div className={`confused-paimon ${className}`} aria-hidden="true">
      <div className="confused-paimon__stage">
        <Image
          src={confusedSrc}
          alt=""
          width={264}
          height={367}
          className="confused-paimon__body"
          priority
        />
        <PaimonStars />
      </div>
    </div>
  );
}
