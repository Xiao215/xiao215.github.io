"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { resumes } from "@/lib/site-data";

export function ResumePicker() {
  const [selectedSlug, setSelectedSlug] = useState(resumes[0].slug);
  const selectedResume =
    resumes.find((resume) => resume.slug === selectedSlug) ?? resumes[0];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div
          role="tablist"
          aria-label="Resume version"
          className="inline-flex rounded-md border border-line/70 bg-surface-soft p-1"
        >
          {resumes.map((resume) => {
            const active = resume.slug === selectedSlug;

            return (
              <button
                key={resume.slug}
                type="button"
                role="tab"
                aria-selected={active}
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
        <a
          href={selectedResume.viewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-accent/40 px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent-strong hover:text-accent-strong"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Open in new tab
        </a>
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
    </>
  );
}
