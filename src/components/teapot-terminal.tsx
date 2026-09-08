"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Line = { id: number; kind: "input" | "output" | "error"; text: string };

const rooms = {
  home: "/",
  resume: "/resume/",
  travel: "/travel/",
} as const;

const teapot = String.raw`
        (  )   (   )  )
         ) (   )  (  (
         ( )  (    ) )
         _____________
        <_____________> ___
        |             |/ _ \
        |               | | |
        |               |_| |
     ___|             |\___/
    /    \___________/    \
    \_____________________/`;

const welcome = [
  "Xiao's Tea Pot — lost-and-found shell",
  'type "help" to see what the kettle can do.',
];

function run(input: string, navigate: (path: string) => void) {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const arg = args.join(" ");

  switch (command) {
    case "":
      return [];
    case "help":
      return [
        "commands:",
        "  ls              list the rooms",
        "  cd <room>       walk to home, resume, or travel",
        "  cat README.md   read the house notes",
        "  brew tea        brew a pot",
        "  brew route      keep looking for this page",
        "  pwd, whoami, echo, date, clear",
      ];
    case "ls":
      return ["home/  resume/  travel/  README.md  teapot.txt"];
    case "pwd":
      return ["/lost/somewhere"];
    case "whoami":
      return ["guest (a very welcome one)"];
    case "date":
      return [new Date().toString()];
    case "echo":
      return [arg];
    case "cat": {
      if (arg === "README.md") {
        return [
          "# Xiao's Tea Pot",
          "A personal website with three rooms: home, resume, and travel.",
          "Everything else is a hallway that leads back here.",
        ];
      }
      if (arg === "teapot.txt") {
        return teapot.split("\n");
      }
      return { error: `cat: ${arg || "file"}: no such file` };
    }
    case "cd": {
      const target = (arg || "home").replace(/^~\/?|\/$/g, "") || "home";
      const room = target === ".." ? "home" : target;

      if (room in rooms) {
        navigate(rooms[room as keyof typeof rooms]);
        return [`steeping a fresh pot and walking to ${room}…`];
      }
      return { error: `cd: no such room: ${target}` };
    }
    case "brew": {
      if (arg === "tea") {
        return [...teapot.split("\n"), "", "tea is ready. take a sip, then cd home."];
      }
      if (arg.startsWith("route")) {
        const address = arg.replace(/^route\s*(--address)?\s*/, "") || "unknown";
        return {
          error: `brew: no route to "${address}". the kettle only knows home, resume, travel.`,
        };
      }
      return { error: `brew: unknown blend "${arg || ""}". try "brew tea".` };
    }
    case "sudo":
      return { error: "nice try. the teapot has no root, only leaves." };
    case "exit":
    case "logout":
      return ["there is no exit, only home. try: cd home"];
    default:
      return {
        error: `teapot: command not found: ${command} (try "help")`,
      };
  }
}

export function TeapotTerminal() {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>(() =>
    welcome.map((text, id) => ({ id, kind: "output", text })),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const nextId = useRef(welcome.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [lines]);

  const push = (kind: Line["kind"], texts: string[]) => {
    setLines((current) => [
      ...current,
      ...texts.map((text) => ({ id: nextId.current++, kind, text })),
    ]);
  };

  const submit = () => {
    const command = input;
    setInput("");
    setHistoryIndex(null);

    if (command.trim() === "clear") {
      setLines([]);
      return;
    }

    push("input", [command]);

    if (command.trim()) {
      setHistory((current) => [...current, command]);
    }

    const result = run(command, (path) => {
      window.setTimeout(() => router.push(path), 700);
    });

    if (Array.isArray(result)) {
      push("output", result);
    } else {
      push("error", [result.error]);
    }
  };

  const recall = (direction: -1 | 1) => {
    if (history.length === 0) {
      return;
    }

    const base = historyIndex ?? history.length;
    const next = Math.min(Math.max(base + direction, 0), history.length);
    setHistoryIndex(next === history.length ? null : next);
    setInput(next === history.length ? "" : history[next]);
  };

  return (
    <div
      className="min-w-0 rounded-md border border-accent/30 bg-surface-soft/85 p-4 backdrop-blur"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-3 flex gap-2" aria-hidden="true">
        <span className="size-2 rounded-full bg-accent-strong" />
        <span className="size-2 rounded-full bg-accent-warm" />
        <span className="size-2 rounded-full bg-accent" />
      </div>

      <div
        ref={scrollRef}
        className="max-h-56 overflow-y-auto font-mono text-sm leading-6"
        aria-live="polite"
      >
        {lines.map((line) => (
          <pre
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.kind === "input"
                ? "text-accent-warm"
                : line.kind === "error"
                  ? "text-accent-strong"
                  : "text-muted"
            }`}
          >
            {line.kind === "input" ? `$ ${line.text}` : line.text}
          </pre>
        ))}
      </div>

      <form
        className="mt-2 flex items-center gap-2 font-mono text-sm"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor="teapot-terminal-input" className="text-accent-warm">
          guest@teapot:~$
        </label>
        <input
          ref={inputRef}
          id="teapot-terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              recall(-1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              recall(1);
            }
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="ls"
          aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-foreground caret-accent-strong outline-none placeholder:text-muted/50"
        />
      </form>
    </div>
  );
}
