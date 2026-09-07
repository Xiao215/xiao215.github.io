import type { Metadata } from "next";
import { PaimonHi } from "@/components/floating-paimon";
import { ResumePicker } from "@/components/resume-picker";
import { SiteNav } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Resume",
  description: "Software and machine learning resumes for Xiao Zhang.",
  openGraph: { title: "Resume", url: "/resume/" },
};

export default function ResumePage() {
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%_-_3rem)] max-w-6xl flex-col py-8 sm:w-[calc(100%_-_5rem)] lg:w-[calc(100%_-_6rem)]">
      <SiteNav />

      <section className="py-12 sm:py-16">
        <div className="relative mb-8 flex items-center justify-between gap-4 overflow-hidden rounded-md border border-line/70 bg-surface/70 p-5 shadow-[0_18px_60px_rgba(24,24,72,0.2)] sm:p-8 md:items-end md:pr-44">
          <div className="relative z-10 min-w-0 flex-1">
            <p className="font-mono text-sm uppercase text-accent-strong">
              Resume
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Resume.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
              Select a version to preview.
            </p>
          </div>
          <PaimonHi />
        </div>

        <ResumePicker />
      </section>
    </main>
  );
}
