"use client";

import { useEffect, useState } from "react";

const pages = [".", "|-- xiao215.tsx", "|-- resume.tsx", "`-- contact.tsx"];
const phrases = [
  "Welcome to Xiao's Tea Pot!",
  "I am a software engineer.",
  "I am a math enthusiast.",
  "I am a weeb.",
];

function formatLoginTime() {
  return new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function TerminalCard() {
  const [loginTime, setLoginTime] = useState("loading session...");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoginTime(formatLoginTime());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const doneTyping = !deleting && characterCount === phrase.length;
    const doneDeleting = deleting && characterCount === 0;
    const delay = doneTyping ? 1600 : deleting ? 32 : 58;

    const timeout = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }

      if (doneDeleting) {
        setDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }

      setCharacterCount((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [characterCount, deleting, phraseIndex]);

  const typedText = phrases[phraseIndex].slice(0, characterCount);

  return (
    <section
      aria-label="Xiao's terminal"
      className="mt-9 overflow-hidden rounded-lg border border-line/80 bg-black/88 font-mono text-sm shadow-[0_24px_70px_rgba(24,24,72,0.32)]"
    >
      <div className="grid h-8 grid-cols-[auto_1fr_auto] items-center border-b border-white/10 bg-[#e6e8eb] px-3 text-[#181848]">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#ffbd2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-center text-xs font-semibold">Xiao&apos;s Terminal</p>
        <span className="w-12" />
      </div>

      <div className="space-y-1 px-4 py-4 text-[#c678dd]">
        <p>Last login: {loginTime} on ttys000</p>
        <p>
          <span>xiao215-MacBook-Pro:</span>
          <span className="text-accent">~&nbsp;</span>
          <span className="text-foreground">cd Portfolio</span>
        </p>
        <p>
          <span>xiao215-MacBook-Pro:</span>
          <span className="text-accent">Portfolio&nbsp;</span>
          <span className="text-foreground">tree</span>
        </p>
        <div className="space-y-1 text-[#e06c75]">
          {pages.map((page) => (
            <p key={page}>{page}</p>
          ))}
        </div>
        <p className="flex flex-wrap">
          <span>xiao215-MacBook-Pro:</span>
          <span className="text-accent">Portfolio&nbsp;</span>
          <span className="text-foreground">
            {typedText}
            <span className="terminal-cursor" />
          </span>
        </p>
      </div>
    </section>
  );
}
