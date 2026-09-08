import {
  coastlineLines,
  countryBorderLines,
  landPolygons,
  makeFallbackPath,
  makeFallbackPolygonPath,
  projectPoint,
} from "@/components/travel-globe-data";
import {
  travelPlaces,
  travelRoutes,
  type TravelPlaceId,
} from "@/lib/travel-data";

export function TravelGlobeFallback({
  selectedId,
  onSelect,
}: {
  selectedId: TravelPlaceId;
  onSelect: (id: TravelPlaceId) => void;
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
          {landPolygons.map((polygon, index) => {
            const path = makeFallbackPolygonPath(polygon);

            if (!path) {
              return null;
            }

            return (
              <path
                key={`land-${index}`}
                d={path}
                fill="#7c8476"
                opacity="0.58"
                fillRule="evenodd"
              />
            );
          })}

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
                stroke="#8fa2d8"
                strokeWidth="0.24"
                opacity="0.68"
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

          {travelPlaces.map((stop) => {
            const point = projectPoint(stop.lat, stop.lng);
            const active = selectedId === stop.id;

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
                  onClick={() => onSelect(stop.id)}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
