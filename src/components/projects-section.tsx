import Image from "next/image";
import { projects } from "@/lib/site-data";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="grid gap-8 border-t border-line/70 py-14 md:grid-cols-[0.8fr_1.2fr]"
    >
      <div>
        <h2 className="text-2xl font-semibold text-accent-strong">Projects</h2>
        <p className="mt-3 max-w-sm leading-7 text-muted">
          Things I build for myself, then keep using.
        </p>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="grid gap-4 rounded-md border border-line/70 bg-surface/75 p-4 shadow-[0_12px_34px_rgba(24,24,72,0.18)] transition duration-300 hover:border-accent/50 sm:grid-cols-[12rem_1fr] sm:gap-5"
          >
            <a
              href={project.links[0].href}
              target="_blank"
              rel="noopener noreferrer"
              className="block self-start overflow-hidden rounded border border-line/70 bg-surface-soft transition duration-300 hover:border-accent-strong"
            >
              <Image
                src={project.image.src}
                alt={project.image.alt}
                width={project.image.width}
                height={project.image.height}
                className="block h-auto w-full"
              />
            </a>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-accent-strong/50 bg-accent-strong px-2 py-0.5 text-xs font-semibold text-background">
                  {project.status}
                </span>
                <span className="font-mono text-xs uppercase text-accent">
                  {project.date}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {project.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted">
                {project.tagline}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/85">
                {project.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-accent/40 px-3 py-1.5 text-foreground transition hover:border-accent-strong hover:text-accent-strong"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
