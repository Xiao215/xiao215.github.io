"use client";

import { useState } from "react";
import { work } from "@/lib/site-data";

export function ExperienceList() {
  const [expanded, setExpanded] = useState(false);
  const visibleWork = expanded ? work : work.slice(0, 3);

  return (
    <div>
      <div className="relative">
        <div className="absolute bottom-4 left-[0.44rem] top-3 w-px bg-line/70" />
        <div className="space-y-5">
          {visibleWork.map((item, index) => (
            <article
              key={`${item.organization}-${item.role}-${item.date}`}
              className="relative grid grid-cols-[1.05rem_1fr] gap-4"
            >
              <span
                className={`relative z-10 mt-2 size-3 rounded-full border ${
                  index < 2
                    ? "border-accent-strong bg-accent-strong shadow-[0_0_0_5px_rgba(241,165,216,0.12)]"
                    : "border-accent bg-surface shadow-[0_0_0_5px_rgba(169,169,239,0.1)]"
                }`}
              />
              <div className="border-b border-line/45 pb-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase text-accent">
                      {index < 2 ? "Current" : "Experience"}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {item.organization}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.role}
                    </p>
                  </div>
                  <time className="rounded-full border border-accent/30 px-3 py-1 font-mono text-xs text-accent-strong">
                    {item.date}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="mt-4 cursor-pointer rounded-md border border-accent/40 bg-surface-soft px-4 py-2 text-sm font-medium text-foreground shadow-[0_8px_24px_rgba(24,24,72,0.14)] transition hover:-translate-y-0.5 hover:border-accent-strong hover:bg-surface hover:text-accent-strong hover:shadow-[0_14px_32px_rgba(24,24,72,0.22)]"
      >
        {expanded ? "Show fewer roles" : "Show all experience"}
      </button>
    </div>
  );
}
