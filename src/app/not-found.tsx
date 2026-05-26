import Link from "next/link";
import { ArrowLeft, Compass, FileText, Home, Map } from "lucide-react";
import { ConfusedPaimon } from "@/components/floating-paimon";
import { SiteNav } from "@/components/site-nav";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col overflow-hidden px-6 py-8 sm:px-10 lg:px-12">
      <SiteNav />

      <section className="grid min-w-0 flex-1 items-center justify-items-start gap-10 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-20">
        <div className="min-w-0 max-w-[21rem] sm:max-w-2xl">
          <p className="font-mono text-sm uppercase text-accent-strong">
            404 / wrong address
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            This path steeped off the map.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            The address you tried does not point to a real room in Xiao&apos;s
            Tea Pot. The kettle is warm, but this doorway is imaginary.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-strong px-4 py-3 text-sm font-semibold text-background transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(241,165,216,0.26)] sm:justify-start"
            >
              <Home className="size-4" aria-hidden="true" />
              Back home
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line/70 bg-surface-soft/75 px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent-strong/70 sm:justify-start"
            >
              <FileText className="size-4" aria-hidden="true" />
              Resume
            </Link>
            <Link
              href="/travel"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-line/70 bg-surface-soft/75 px-4 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-accent-strong/70 sm:justify-start"
            >
              <Map className="size-4" aria-hidden="true" />
              Travel
            </Link>
          </div>
        </div>

        <div className="relative min-h-[24rem] w-full max-w-[21rem] min-w-0 overflow-hidden rounded-md border border-line/70 bg-surface/60 p-5 shadow-[0_24px_90px_rgba(24,24,72,0.34)] sm:max-w-none sm:min-h-[30rem] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(240,216,192,0.22),transparent_15rem),radial-gradient(circle_at_78%_72%,rgba(169,169,239,0.24),transparent_17rem)]" />
          <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-accent/30" />
          <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-accent-warm/30" />

          <div className="relative z-10 flex h-full min-h-[20rem] flex-col justify-between sm:min-h-[26rem]">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-md border border-line/70 bg-surface-soft/75 px-3 py-2 font-mono text-xs uppercase text-muted">
                <Compass className="size-4 text-accent-strong" aria-hidden="true" />
                route finder
              </div>
              <p className="hidden font-mono text-8xl font-semibold leading-none text-accent-strong/30 sm:block">
                404
              </p>
            </div>

            <div className="relative mt-8 grid min-w-0 gap-5 sm:grid-cols-[1fr_9rem] sm:items-end">
              <div className="min-w-0 rounded-md border border-accent/30 bg-surface-soft/85 p-4 backdrop-blur">
                <div className="mb-4 flex gap-2" aria-hidden="true">
                  <span className="size-2 rounded-full bg-accent-strong" />
                  <span className="size-2 rounded-full bg-accent-warm" />
                  <span className="size-2 rounded-full bg-accent" />
                </div>
                <p className="break-words font-mono text-sm text-accent-warm">
                  brew route --address unknown
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  No matching page was found. The nearest stable portals are
                  home, resume, and travel.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong hover:text-foreground"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Return to the teapot
                </Link>
              </div>

              <ConfusedPaimon className="mx-auto w-32 sm:w-40" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
