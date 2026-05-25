"use client";

import Image from "next/image";
import { useState } from "react";
import { PaimonHi } from "@/components/floating-paimon";
import { SiteNav } from "@/components/site-nav";
import { resumes } from "@/lib/site-data";

export default function ResumePage() {
  const [selectedSlug, setSelectedSlug] = useState(resumes[0].slug);
  const selectedResume =
    resumes.find((resume) => resume.slug === selectedSlug) ?? resumes[0];

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
          <Image
            src="/assets/paimon/paimon-hi.png"
            alt=""
            width={262}
            height={394}
            priority
            aria-hidden="true"
            className="relative z-10 block w-24 shrink-0 opacity-85 sm:w-28 md:hidden"
          />

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
                className={`cursor-pointer rounded px-4 py-2 text-sm font-medium transition ${
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
