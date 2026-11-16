"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  antipodeOf,
  codeFor,
  createGlobe,
  headingBetween,
  localTimeAt,
  travelLegs,
  travelStats,
  utcOffsetHours,
  type GlobeHandle,
  type GlobeLeg,
  type GlobeTheme,
} from "@/lib/globe-canvas";
import { travelPlaces } from "@/lib/travel-data";

const THEME: GlobeTheme = {
  shadow: "#181848",
  sphere: ["#2b3042", "#1b1e2a"],
  rim: "rgba(169,169,239,0.3)",
  atmosphere: "#a9a9ef",
  atmosphereAlpha: 0.17,
  atmosphereSize: 1.16,
  graticule: { color: "#5c526f", alpha: 0.26, width: 1 },
  equator: { color: "#f1a5d8", alpha: 0.2, width: 1 },
  stipple: {
    color: "#a8a2bd",
    alpha: 0.7,
    size: 1.7,
    night: "#9b95b8",
    nightAlpha: 0.94,
  },
  coast: { color: "#f0d8c0", alpha: 0.5, width: 1 },
  night: "#070a1c",
  nightAlpha: 0.3,
  arc: {
    color: "#a9a9ef",
    activeColor: "#f1a5d8",
    width: 0.85,
    activeScale: 1.45,
    alpha: 0.95,
    dimAlpha: 0.26,
    glow: 3.5,
  },
  ground: {
    color: "#f0d8c0",
    activeColor: "#ffeed8",
    width: 1,
    activeScale: 1.55,
    alpha: 0.72,
    dimAlpha: 0.22,
    dash: [2, 2.6],
  },
  marker: {
    color: "#f0d8c0",
    activeColor: "#f1a5d8",
    lights: "#ffc98a",
    size: 2.6,
    alpha: 0.85,
    ring: "rgba(240,216,192,0.5)",
    pulse: true,
    glow: true,
  },
  label: {
    font: "600 12px Arial, sans-serif",
    activeFont: "600 14px Arial, sans-serif",
    color: "#c9bed8",
    activeColor: "#181848",
    background: "rgba(24,26,36,0.88)",
    activeBackground: "#f1a5d8",
    border: "rgba(92,82,111,0.8)",
    activeBorder: "#f1a5d8",
    leader: "#f1a5d8",
  },
};

const HUB_IDS = ["fuzhou", "toronto", "san-francisco"];
const START = Math.max(
  0,
  travelPlaces.findIndex((place) => place.id === "san-francisco"),
);

/** A trip is a run of legs that hand off city to city, which is how the data already reads. */
const trips: number[][] = (() => {
  const out: number[][] = [];
  let chain: number[] = [];
  travelLegs.forEach((leg, index) => {
    const last = chain.length ? travelLegs[chain[chain.length - 1]] : null;
    if (last && last.toIndex === leg.fromIndex) {
      chain.push(index);
      return;
    }
    if (chain.length > 1) out.push(chain);
    chain = [index];
  });
  if (chain.length > 1) out.push(chain);
  return out;
})();

/** Chapters fall out of the route graph: a city belongs to whichever hub it is fewest legs from. */
const chapters = (() => {
  const adjacency: number[][] = travelPlaces.map(() => []);
  travelLegs.forEach((leg) => {
    adjacency[leg.fromIndex].push(leg.toIndex);
    adjacency[leg.toIndex].push(leg.fromIndex);
  });
  const owner = new Map<number, number>();
  const best = new Map<number, number>();
  const hubs = HUB_IDS.map((id) =>
    travelPlaces.findIndex((place) => place.id === id),
  ).filter((index) => index >= 0);

  hubs.forEach((hub) => {
    const queue: [number, number][] = [[hub, 0]];
    const seen = new Set<number>();
    while (queue.length) {
      const step = queue.shift();
      if (!step) break;
      const [node, distance] = step;
      if (seen.has(node)) continue;
      seen.add(node);
      const current = best.get(node);
      if (current === undefined || distance < current) {
        best.set(node, distance);
        owner.set(node, hub);
      }
      adjacency[node].forEach((next) => queue.push([next, distance + 1]));
    }
  });

  return hubs.map((hub) => ({
    hub,
    members: travelPlaces.map((_, index) => index).filter((index) => owner.get(index) === hub),
  }));
})();

const ranks = (() => {
  const table = new Map<string, { rank: number; total: number }>();
  (["flight", "ground"] as const).forEach((kind) => {
    const legs = travelLegs.filter((leg) => leg.kind === kind).sort((a, b) => b.km - a.km);
    legs.forEach((leg, index) => table.set(leg.id, { rank: index + 1, total: legs.length }));
  });
  return table;
})();

const facts = (() => {
  const ends = new Map<number, number>();
  travelLegs.forEach((leg) => {
    if (leg.kind === "ground") return;
    ends.set(leg.fromIndex, (ends.get(leg.fromIndex) ?? 0) + 1);
    ends.set(leg.toIndex, (ends.get(leg.toIndex) ?? 0) + 1);
  });
  let hub = 0;
  ends.forEach((count, index) => {
    if (count > (ends.get(hub) ?? 0)) hub = index;
  });
  const south = travelPlaces.reduce((lowest, place) =>
    place.lat < lowest.lat ? place : lowest,
  );
  return { hub, hubCount: ends.get(hub) ?? 0, south };
})();

function number(value: number) {
  return value.toLocaleString("en-US");
}

function clockShift(from: number, to: number) {
  const hours = utcOffsetHours(travelPlaces[to]) - utcOffsetHours(travelPlaces[from]);
  if (hours === 0) return "Same clock";
  return `${hours > 0 ? "+" : "−"}${Math.abs(hours)}h`;
}

function legsTouching(index: number) {
  return travelLegs
    .filter((leg) => leg.fromIndex === index || leg.toIndex === index)
    .sort((a, b) => {
      if ((a.kind === "ground") !== (b.kind === "ground")) {
        return a.kind === "ground" ? 1 : -1;
      }
      return b.km - a.km;
    });
}

function barcodeFor(id: string) {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash ^ id.charCodeAt(i)) >>> 0;
    hash = (hash * 16777619) >>> 0;
  }
  return Array.from({ length: 12 }, (_, i) => ({
    width: ((hash >> i) & 1) + 1,
    faint: ((hash >> (i + 3)) & 1) === 0,
  }));
}

export function TravelExplorer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const globeRef = useRef<GlobeHandle | null>(null);

  const [selected, setSelected] = useState(START);
  const [ticket, setTicket] = useState<GlobeLeg | null>(() => legsTouching(START)[0] ?? null);
  // The ticket reads as arriving at the city you have selected, except during a
  // replay, where it follows the leg's own direction.
  const [ticketTo, setTicketTo] = useState(START);
  const [chapter, setChapter] = useState(-1);
  const [tripIndex, setTripIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [legLabel, setLegLabel] = useState("");
  const [query, setQuery] = useState("");
  const [daylight, setDaylight] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [, setClockTick] = useState(0);

  const place = travelPlaces[selected];
  const connections = useMemo(() => legsTouching(selected), [selected]);
  const flightCount = connections.filter((leg) => leg.kind !== "ground").length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const globe = createGlobe(canvas, {
      theme: THEME,
      selected: START,
      fill: 0.88,
      focus: true,
      daylight: true,
      sprite: "/assets/paimon/waving/paimon.png",
      // Clicking the globe cancels a replay, and the state setters are stable,
      // so this closure never goes stale.
      onSelect: (_place, index) => {
        setSelected(index);
        setTicket(legsTouching(index)[0] ?? null);
        setTicketTo(index);
        setPlaying(false);
        setLegLabel("");
      },
    });
    globeRef.current = globe;
    setMounted(true);
    return () => {
      globe.destroy();
      globeRef.current = null;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setClockTick((tick) => tick + 1), 20000);
    return () => window.clearInterval(timer);
  }, []);

  function goTo(index: number, leg?: GlobeLeg) {
    globeRef.current?.select(index);
    setSelected(index);
    setTicket(leg ?? legsTouching(index)[0] ?? null);
    setTicketTo(index);
    if (playing) {
      setPlaying(false);
      setLegLabel("");
    }
  }

  function playTrip(index: number) {
    const globe = globeRef.current;
    if (!globe) return;
    setTripIndex(index);
    setPlaying(true);
    globe.playTrip(trips[index], {
      onLeg: (leg, step) => {
        setSelected(leg.fromIndex);
        setTicket(leg);
        setTicketTo(leg.toIndex);
        setLegLabel(
          `Leg ${step + 1}/${trips[index].length} · ${travelPlaces[leg.fromIndex].place} → ` +
            `${travelPlaces[leg.toIndex].place} · ${number(leg.km)} km`,
        );
      },
      onArrive: (_arrived, index) => setSelected(index),
      onDone: () => {
        setPlaying(false);
        setLegLabel("");
      },
    });
  }

  function toggleDaylight() {
    const next = !daylight;
    setDaylight(next);
    globeRef.current?.setDaylight(next);
  }

  function pickChapter(index: number) {
    setChapter(index);
    globeRef.current?.setChapter(index < 0 ? null : chapters[index].members);
    if (index >= 0) goTo(chapters[index].hub);
  }

  function shuffle() {
    let next = selected;
    while (next === selected) next = Math.floor(Math.random() * travelPlaces.length);
    goTo(next);
  }

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const groups = new Map<string, { place: (typeof travelPlaces)[number]; index: number }[]>();
    travelPlaces.forEach((item, index) => {
      if (needle && !`${item.place} ${item.country}`.toLowerCase().includes(needle)) return;
      const list = groups.get(item.continent) ?? [];
      list.push({ place: item, index });
      groups.set(item.continent, list);
    });
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [query]);

  const arrivalIndex = ticket
    ? ticket.fromIndex === ticketTo || ticket.toIndex === ticketTo
      ? ticketTo
      : ticket.toIndex
    : -1;
  const toPlace = ticket ? travelPlaces[arrivalIndex] : null;
  const fromPlace = ticket
    ? travelPlaces[ticket.fromIndex === arrivalIndex ? ticket.toIndex : ticket.fromIndex]
    : null;
  const ticketRank = ticket ? ranks.get(ticket.id) : undefined;
  const ground = ticket?.kind === "ground";

  return (
    <section className="min-w-0 space-y-4">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="globe-card">
          <div className="globe-card__bar">
            <div>
              <p className="font-mono text-xs uppercase text-accent-strong">Travel map</p>
              <div className="globe-chapters" role="group" aria-label="Chapters">
                <button
                  type="button"
                  aria-current={chapter < 0}
                  aria-label={`All, ${travelPlaces.length} cities`}
                  onClick={() => pickChapter(-1)}
                >
                  All<small>{travelPlaces.length}</small>
                </button>
                {chapters.map((entry, index) => (
                  <button
                    key={entry.hub}
                    type="button"
                    aria-current={chapter === index}
                    aria-label={`${travelPlaces[entry.hub].place}, ${entry.members.length} cities`}
                    onClick={() => pickChapter(index)}
                  >
                    {travelPlaces[entry.hub].place}
                    <small>{entry.members.length}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="globe-tools">
              <button type="button" className="globe-ghost" onClick={shuffle}>
                Take me somewhere
              </button>
              <button
                type="button"
                className="globe-ghost"
                aria-pressed={daylight}
                onClick={toggleDaylight}
              >
                Day &amp; night
              </button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="globe-canvas"
            aria-label="Interactive travel globe"
          />

          <div className="globe-player">
            <button
              type="button"
              className="globe-player__play"
              onClick={() => {
                if (playing) globeRef.current?.stopTrip();
                else playTrip(tripIndex);
              }}
            >
              <span aria-hidden="true" className="text-[9px]">
                {playing ? "■" : "▶"}
              </span>
              {playing ? "Stop" : "Replay this trip"}
            </button>
            {playing ? (
              <span className="globe-player__now">{legLabel}</span>
            ) : (
              <div className="globe-player__trips">
                {trips.map((legs, index) => {
                  const first = travelPlaces[travelLegs[legs[0]].fromIndex].place;
                  const last = travelPlaces[travelLegs[legs[legs.length - 1]].toIndex].place;
                  const km = legs.reduce((sum, leg) => sum + travelLegs[leg].km, 0);
                  const name = first === last ? `${first} loop` : `${first} to ${last}`;
                  return (
                    <button
                      key={legs[0]}
                      type="button"
                      aria-current={tripIndex === index}
                      aria-label={`${name}, ${legs.length} legs, ${number(km)} km`}
                      onClick={() => playTrip(index)}
                    >
                      {name} · {legs.length} legs
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <aside className="travel-rail">
          {ticket && fromPlace && toPlace ? (
            <div className={`ticket${ground ? " ticket--ground" : ""}`}>
              <div className="ticket__main">
                <div className="ticket__brand">
                  <span>Xiao&apos;s Tea Pot</span>
                  <b>{ground ? "Rail ticket" : "Boarding pass"}</b>
                </div>
                <div className="ticket__route">
                  <div>
                    <b>{codeFor(fromPlace)}</b>
                    <span>{fromPlace.place}</span>
                  </div>
                  <div className="ticket__glyph" aria-hidden="true">
                    {ground ? "─●─" : "✈"}
                  </div>
                  <div>
                    <b>{codeFor(toPlace)}</b>
                    <span>{toPlace.place}</span>
                  </div>
                </div>
                <dl className="ticket__meta">
                  <div>
                    <dt>Distance</dt>
                    <dd>{number(ticket.km)} km</dd>
                  </div>
                  <div>
                    <dt>Heading</dt>
                    <dd>{headingBetween(fromPlace, toPlace)}</dd>
                  </div>
                  <div>
                    <dt>Clocks move</dt>
                    <dd>{clockShift(travelPlaces.indexOf(fromPlace), arrivalIndex)}</dd>
                  </div>
                </dl>
              </div>
              <div className="ticket__stub">
                <small>Longest</small>
                <span className="ticket__rank">#{ticketRank?.rank ?? 1}</span>
                <small>of {ticketRank?.total ?? 0}</small>
                <div className="ticket__bars" aria-hidden="true">
                  {barcodeFor(ticket.id).map((bar, index) => (
                    <i
                      key={index}
                      style={{ width: `${bar.width}px`, opacity: bar.faint ? 0.55 : 1 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="travel-card">
            <p className="font-mono text-xs uppercase text-accent-strong">Selected</p>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{place.place}</h3>
            <p className="text-sm text-muted">
              {place.country} · {place.continent}
            </p>
            <dl className="travel-meta">
              <div>
                <dt>Coordinates</dt>
                <dd>
                  {Math.abs(place.lat).toFixed(1)}&deg;{place.lat >= 0 ? "N" : "S"}{" "}
                  {Math.abs(place.lng).toFixed(1)}&deg;{place.lng >= 0 ? "E" : "W"}
                </dd>
              </div>
              <div>
                <dt>Time there now</dt>
                <dd>{mounted ? localTimeAt(place) : "—"}</dd>
              </div>
              <div>
                <dt>Flights</dt>
                <dd>{flightCount}</dd>
              </div>
              <div>
                <dt>Other side</dt>
                <dd>{antipodeOf(place)}</dd>
              </div>
            </dl>
          </div>

          <div className="travel-card">
            <p className="font-mono text-xs uppercase text-accent-strong">Flights from here</p>
            <div className="travel-legs">
              {connections.map((leg) => {
                const otherIndex = leg.fromIndex === selected ? leg.toIndex : leg.fromIndex;
                return (
                  <button
                    key={leg.id}
                    type="button"
                    onClick={() => goTo(otherIndex, leg)}
                  >
                    <span>
                      {travelPlaces[otherIndex].place}
                      {leg.kind === "ground" ? <i>land</i> : null}
                    </span>
                    <span className="km">{number(leg.km)} km</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="travel-card">
            <label>
              <span className="sr-only">Find a city</span>
              <input
                type="search"
                className="travel-search"
                placeholder="Find a city"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="travel-index">
              {grouped.map(([continent, items]) => (
                <div key={continent}>
                  <h4>{continent}</h4>
                  {items.map(({ place: item, index }) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-current={index === selected}
                      onClick={() => goTo(index)}
                    >
                      <span>{item.place}</span>
                      <small>{item.country}</small>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="travel-facts">
        <p>
          <b>{number(travelStats.km)} km</b> of flights, or{" "}
          <b>{(travelStats.km / 40075).toFixed(1)}</b> laps of the equator.
        </p>
        <p>
          <b>{travelPlaces[facts.hub].place}</b> is the hub. <b>{facts.hubCount}</b> of the{" "}
          {travelStats.flights} flights start or end there.
        </p>
        <p>
          {facts.south.lat >= 0 ? (
            <>
              Every city is north of the equator. The closest is{" "}
              <b>{facts.south.place}</b>, at <b>{facts.south.lat.toFixed(1)}&deg; N</b>.
            </>
          ) : (
            <>
              The furthest south is <b>{facts.south.place}</b>, at{" "}
              <b>{Math.abs(facts.south.lat).toFixed(1)}&deg; S</b>.
            </>
          )}
        </p>
      </div>
    </section>
  );
}
