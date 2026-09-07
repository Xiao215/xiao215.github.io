"use client";

import { useEffect, useRef, useState } from "react";
import { TravelGlobeFallback } from "@/components/travel-globe-fallback";
import { TravelPlaceIndex } from "@/components/travel-place-index";
import { TravelGlobeScene, type HoverInfo } from "@/lib/globe/scene";
import { travelPlaces, type TravelPlaceId } from "@/lib/travel-data";

const defaultPlaceId: TravelPlaceId = "san-francisco";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function TravelExplorer() {
  const [selectedId, setSelectedId] = useState<TravelPlaceId>(defaultPlaceId);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<TravelGlobeScene | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let scene: TravelGlobeScene;

    try {
      scene = new TravelGlobeScene({
        container,
        selectedId: defaultPlaceId,
        onSelect: (place) => setSelectedId(place.id),
        onHover: setHover,
      });
    } catch {
      // No WebGL context; swap in the static SVG globe. Deferred to a
      // microtask so the effect body itself does not set state.
      queueMicrotask(() => setWebglUnavailable(true));
      return;
    }

    sceneRef.current = scene;

    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.setSelected(selectedId);
  }, [selectedId]);

  // Left/right arrows step through the cities in index order.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key !== "ArrowLeft" && event.key !== "ArrowRight") ||
        isTypingTarget(event.target) ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      event.preventDefault();
      const step = event.key === "ArrowRight" ? 1 : -1;
      setSelectedId((current) => {
        const index = travelPlaces.findIndex((place) => place.id === current);
        const next =
          (index + step + travelPlaces.length) % travelPlaces.length;
        return travelPlaces[next].id;
      });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const selectedPlace =
    travelPlaces.find((place) => place.id === selectedId) ?? travelPlaces[0];

  return (
    <section className="min-w-0 space-y-5">
      <div className="relative min-w-0 overflow-hidden rounded-md border border-line/70 bg-surface/70 shadow-[0_24px_90px_rgba(24,24,72,0.35)]">
        <div className="absolute left-4 top-4 z-10 max-w-[min(20rem,calc(100%-2rem))] rounded-md border border-line/70 bg-surface-soft/85 px-4 py-3 backdrop-blur sm:left-5 sm:top-5">
          <p className="font-mono text-xs uppercase text-accent">
            Selected city
          </p>
          <p className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
            {selectedPlace.place}
          </p>
          <p className="text-xs text-muted">
            {selectedPlace.country} · {selectedPlace.continent}
          </p>
          <p className="mt-1.5 hidden font-mono text-[0.65rem] uppercase text-muted/80 sm:block">
            ← → to hop between cities
          </p>
        </div>

        {hover ? (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)] whitespace-nowrap rounded border border-accent-strong/60 bg-surface-soft/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-[0_8px_24px_rgba(24,24,72,0.35)]"
            style={{ left: hover.x, top: hover.y }}
          >
            {hover.place.place}
            <span className="ml-1.5 text-muted">{hover.place.country}</span>
          </div>
        ) : null}

        {webglUnavailable ? (
          <TravelGlobeFallback
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <div
            ref={containerRef}
            className="min-h-[360px] min-w-0 touch-none cursor-grab active:cursor-grabbing sm:min-h-[540px]"
            role="img"
            aria-label="Interactive travel globe"
          />
        )}
      </div>

      <TravelPlaceIndex selectedId={selectedId} onSelect={setSelectedId} />
    </section>
  );
}
