import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { SiGooglescholar } from "react-icons/si";
import { contactLinks } from "@/lib/site-data";

const iconClassName = "size-4 shrink-0";

function ContactIcon({ label }: { label: string }) {
  if (label === "GitHub") {
    return <FaGithub className={iconClassName} aria-hidden="true" />;
  }

  if (label === "LinkedIn") {
    return <FaLinkedinIn className={iconClassName} aria-hidden="true" />;
  }

  if (label === "Scholar") {
    return <SiGooglescholar className={iconClassName} aria-hidden="true" />;
  }

  return <Mail className={iconClassName} aria-hidden="true" strokeWidth={2} />;
}

export function ContactButtons() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {contactLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-accent/35 bg-surface/80 px-4 text-sm font-medium text-foreground shadow-[0_10px_30px_rgba(24,24,72,0.18)] transition hover:border-accent-strong hover:bg-surface hover:text-accent-strong"
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          <ContactIcon label={link.label} />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
