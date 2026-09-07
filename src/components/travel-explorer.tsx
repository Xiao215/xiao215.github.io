"use client";

import { useEffect, useRef, useState } from "react";
import { TravelGlobeFallback } from "@/components/travel-globe-fallback";
import { TravelPlaceIndex } from "@/components/travel-place-index";
import { TravelGlobeScene } from "@/lib/globe/scene";
import { travelPlaces, type TravelPlaceId } from "@/lib/travel-data";

const defaultPlaceId: TravelPlaceId = "san-francisco";

export function TravelExplorer() {
  const [selectedId, setSelectedId] = useState<TravelPlaceId>(defaultPlaceId);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
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

  const selectedPlace =
    travelPlaces.find((place) => place.id === selectedId) ?? travelPlaces[0];

  return (
    <section className="min-w-0 space-y-5">
      <div className="relative min-w-0 overflow-hidden rounded-md border border-line/70 bg-surface/70 shadow-[0_24px_90px_rgba(24,24,72,0.35)]">
        <div className="absolute left-5 top-5 z-10 rounded-md border border-line/70 bg-surface-soft/82 px-4 py-3 backdrop-blur">
          <p className="font-mono text-xs uppercase text-accent">
            Selected city
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {selectedPlace.place}
          </p>
        </div>
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
