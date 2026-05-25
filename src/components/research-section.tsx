import { research } from "@/lib/site-data";

export function ResearchSection() {
  return (
    <section
      id="research"
      className="grid gap-8 border-t border-line/70 py-14 md:grid-cols-[0.8fr_1.2fr]"
    >
      <div>
        <h2 className="text-2xl font-semibold text-accent-strong">Research</h2>
        <p className="mt-3 max-w-sm leading-7 text-muted">
          Publications and research work.
        </p>
      </div>

      <div className="space-y-4">
        {research.map((paper) => (
          <article
            key={paper.href}
            className="rounded-md border border-line/70 bg-surface/75 p-5 shadow-[0_12px_34px_rgba(24,24,72,0.18)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-accent-strong/50 bg-accent-strong px-3 py-1 text-sm font-semibold text-background">
                {paper.venue}
              </span>
              <span className="font-mono text-sm uppercase text-accent">
                {paper.detail}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-semibold leading-8 text-foreground">
              {paper.title}
            </h3>
            <p className="mt-3 leading-7 text-muted">{paper.authors}</p>
            <p className="mt-4 leading-7 text-foreground/90">{paper.summary}</p>

            <p className="mt-4 text-sm text-muted">
              <span className="font-medium text-accent">Topics:</span>{" "}
              {paper.tags.join(" / ")}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
              <a
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-accent/40 px-4 py-2 text-foreground transition hover:border-accent-strong hover:text-accent-strong"
              >
                arXiv
              </a>
              <a
                href={paper.pdfHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-accent/40 px-4 py-2 text-foreground transition hover:border-accent-strong hover:text-accent-strong"
              >
                PDF
              </a>
              {paper.codeHref ? (
                <a
                  href={paper.codeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-accent/40 px-4 py-2 text-foreground transition hover:border-accent-strong hover:text-accent-strong"
                >
                  Code
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
