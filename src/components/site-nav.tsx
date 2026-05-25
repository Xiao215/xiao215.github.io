"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Resume", href: "/resume" },
  { label: "Travel", href: "/travel" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-4 z-40 rounded-md border border-line/60 bg-surface-soft/72 px-4 py-3 text-sm shadow-[0_18px_60px_rgba(24,24,72,0.18)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="group flex w-fit items-center gap-2 font-semibold text-foreground"
        >
          <Image
            src="/assets/logo/webicon.svg"
            alt=""
            width={22}
            height={22}
            className="size-5.5 transition duration-300 group-hover:rotate-12 group-hover:scale-110"
            priority
          />
          <span className="relative">
            Xiao&apos;s Tea Pot
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent-strong transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>

        <div className="flex items-center gap-1 text-muted">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded px-3 py-2 transition duration-300 ${
                  active
                    ? "text-foreground"
                    : "hover:-translate-y-0.5 hover:text-foreground"
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute inset-x-3 bottom-1 h-px origin-left bg-accent-strong transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
                <span
                  className={`absolute inset-0 -z-10 rounded bg-surface/0 transition duration-300 ${
                    active
                      ? "bg-surface/70"
                      : "group-hover:bg-surface/45"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
