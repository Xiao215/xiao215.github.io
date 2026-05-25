import type { Metadata, Viewport } from "next";
import { SakuraFall } from "@/components/sakura-fall";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xiao's Tea Pot",
  description:
    "Welcome to Xiao's Tea Pot, the personal website for Xiao Zhang.",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/logo/webicon.svg",
    shortcut: "/assets/logo/webicon.svg",
    apple: "/assets/logo/logo.png",
  },
  openGraph: {
    title: "Xiao's Tea Pot",
    description: "Welcome to Xiao's Tea Pot.",
    siteName: "Xiao's Tea Pot",
    type: "website",
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
      </body>
    </html>
  );
}
