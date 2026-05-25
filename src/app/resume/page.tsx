"use client";

import { useState } from "react";
import { PaimonHi } from "@/components/floating-paimon";
import { SiteNav } from "@/components/site-nav";
import { resumes } from "@/lib/site-data";

export default function ResumePage() {
  const [selectedSlug, setSelectedSlug] = useState(resumes[0].slug);
  const selectedResume =
    resumes.find((resume) => resume.slug === selectedSlug) ?? resumes[0];

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
      <SiteNav />

      <section className="py-12 sm:py-16">
        <div className="relative mb-8 flex flex-col gap-6 overflow-hidden rounded-md border border-line/70 bg-surface/70 p-5 shadow-[0_18px_60px_rgba(24,24,72,0.2)] md:flex-row md:items-end md:justify-between md:pr-44">
          <div className="relative z-10">
            <p className="font-mono text-sm uppercase text-accent-strong">
              Resume
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              Role-specific resume versions.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
              Switch between software and machine learning versions, then open
              the selected file in Google Drive if you need the full viewer.
            </p>
          </div>

          <a
            href={selectedResume.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex shrink-0 rounded-md border border-accent-pink/40 bg-surface-soft px-4 py-2 text-sm font-medium text-accent-strong transition hover:border-accent-strong"
          >
            Open {selectedResume.name} resume
          </a>
          <PaimonHi />
        </div>

        <div className="mb-5 inline-flex rounded-md border border-line/70 bg-surface-soft p-1">
          {resumes.map((resume) => {
            const active = resume.slug === selectedSlug;

            return (
              <button
                key={resume.slug}
                type="button"
                onClick={() => setSelectedSlug(resume.slug)}
                className={`rounded px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-accent-strong text-background"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {resume.name}
              </button>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-md border border-accent/30 bg-surface-soft p-2 shadow-[0_24px_90px_rgba(24,24,72,0.42)]">
          <iframe
            key={selectedResume.slug}
            src={selectedResume.href}
            className="min-h-[720px] w-full rounded-sm bg-white"
            allow="autoplay"
            title={`${selectedResume.name} resume`}
          />
        </div>
      </section>
    </main>
  );
}
