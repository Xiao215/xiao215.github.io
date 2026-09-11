import type { Metadata, Viewport } from "next";
import { SakuraFall } from "@/components/sakura-fall";
import { SiteSlimeCompanion } from "@/components/slime-companion";
import "./globals.css";

export const siteUrl = "https://xiao215.github.io";
const siteName = "Xiao's Tea Pot";
const siteDescription =
  "Xiao Zhang is a software engineer at Google Cloud and a research collaborator at Vector Institute working on LLM agents.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/logo/webicon.svg",
    shortcut: "/assets/logo/webicon.svg",
    apple: "/assets/logo/logo.png",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    type: "website",
    url: "/",
    images: [
      {
        url: "/assets/photos/pfp.webp",
        width: 420,
        height: 420,
        alt: "Portrait of Xiao Zhang",
      },
    ],
  },
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  themeColor: "#282C34",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <SakuraFall />
        <div className="relative z-10">{children}</div>
        <SiteSlimeCompanion />
      </body>
    </html>
  );
}
