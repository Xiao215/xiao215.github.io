import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Resume", href: "/resume" },
  { label: "Travel", href: "/travel" },
];

export function SiteNav() {
  return (
    <nav className="flex flex-col gap-3 border border-line/70 bg-surface-soft/80 px-4 py-4 text-sm shadow-[0_18px_60px_rgba(24,24,72,0.22)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:rounded-md sm:px-5">
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold text-foreground"
      >
        <Image
          src="/assets/logo/webicon.svg"
          alt=""
          width={24}
          height={24}
          className="size-6"
          priority
        />
        <span>Xiao&apos;s Tea Pot</span>
      </Link>
      <div className="flex gap-4 text-muted sm:gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            className="transition hover:text-accent-strong"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
