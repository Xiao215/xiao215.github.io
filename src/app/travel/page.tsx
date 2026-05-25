import { SiteNav } from "@/components/site-nav";
import { TravelExplorer } from "@/components/travel-explorer";

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
        </div>

        <TravelExplorer />
      </section>
    </main>
  );
}
