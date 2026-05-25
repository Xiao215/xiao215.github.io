import Image from "next/image";
import { ContactButtons } from "@/components/contact-buttons";
import { ExperienceList } from "@/components/experience-list";
import { FloatingPaimon } from "@/components/floating-paimon";
import { ResearchSection } from "@/components/research-section";
import { SiteNav } from "@/components/site-nav";
import { TerminalCard } from "@/components/terminal-card";
import { focus } from "@/lib/site-data";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%_-_3rem)] max-w-6xl flex-col py-8 sm:w-[calc(100%_-_5rem)] lg:w-[calc(100%_-_6rem)]">
      <SiteNav />

      <section
        id="top"
        className="grid flex-1 items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24"
      >
        <div>
          <p className="mb-5 font-mono text-sm uppercase text-accent-strong">
            2^127-1
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Xiao Zhang
          </h1>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-muted">
            <p>
              I am a software engineer at Google Cloud and a research
              collaborator at Vector Institute. I earned my bachelor&apos;s
              degree from the University of Toronto Engineering Science program,
              majoring in Machine Intelligence, and I continue to work with{" "}
              <a
                href="https://zhijing-jin.com/home/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-strong underline"
              >
                Prof. Zhijing Jin
              </a>
              .
            </p>
            <p>
              My research interests lie in multi-agent systems,
              interpretability, and understanding how and why AI and LLM agents
              behave in particular ways. Currently, I am working on evaluating
              Gmail AI agent quality at Google and building cooperative
              mechanisms for LLM agents.
            </p>
          </div>
          <ContactButtons />
          {/* <TerminalCard /> */}
        </div>

        <div className="justify-self-center md:justify-self-end">
          <div className="relative">
            <Image
              src="/assets/photos/pfp.jpeg"
              alt="Portrait of Xiao Zhang"
              width={420}
              height={420}
              priority
              className="aspect-square w-72 rounded-md border border-accent/35 object-cover shadow-[0_24px_90px_rgba(24,24,72,0.42)] sm:w-96"
            />
            <FloatingPaimon />
          </div>
        </div>
      </section>

      <section
        id="work"
        className="grid gap-8 border-t border-line/70 py-14 md:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <h2 className="text-2xl font-semibold text-accent-strong">
            Experience
          </h2>
          <p className="mt-3 max-w-sm leading-7 text-muted">
            My career journey.
          </p>
        </div>
        <ExperienceList />
      </section>

      <ResearchSection />

      <footer
        id="contact"
        className="flex flex-col gap-4 border-t border-line/70 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"
      >
        <p>(c) 2026 Xiao Zhang</p>
        <a
          href="mailto:xiaozhang20030215@gmail.com"
          className="hover:text-accent-strong"
        >
          xiaozhang20030215@gmail.com
        </a>
      </footer>
    </main>
  );
}
