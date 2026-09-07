import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { TravelExplorer } from "@/components/travel-explorer";
import { travelStats } from "@/lib/travel-data";

export const metadata: Metadata = {
  title: "Travel",
  description: "An interactive globe of the cities and routes Xiao Zhang has travelled.",
  openGraph: { title: "Travel", url: "/travel/" },
};

export default function TravelPage() {
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%_-_3rem)] max-w-6xl flex-col py-8 sm:w-[calc(100%_-_5rem)] lg:w-[calc(100%_-_6rem)]">
      <SiteNav />

      <section className="py-12 sm:py-16">
        <div className="mb-8 max-w-3xl">
          <p className="font-mono text-sm uppercase text-accent-strong">
            Travel map
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Places I have been.
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted">
            A small interactive map of cities and routes, not a full timeline.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase text-accent">
            <span>
              <span className="text-foreground">{travelStats.cities}</span>{" "}
              cities
            </span>
            <span>
              <span className="text-foreground">{travelStats.countries}</span>{" "}
              countries
            </span>
            <span>
              <span className="text-foreground">{travelStats.continents}</span>{" "}
              continents
            </span>
            <span>
              <span className="text-foreground">{travelStats.routes}</span>{" "}
              routes
            </span>
          </p>
        </div>

        <TravelExplorer />
      </section>
    </main>
  );
}
