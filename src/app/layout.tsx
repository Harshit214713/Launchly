import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Launchly — Websites, templates, visual editor and code on one screen",
  description: "Browse curated templates, customize every pixel visually, and export clean Next.js 15 source code — all without context switching.",
  keywords: ["website builder", "templates", "no-code", "publish website", "SaaS", "neo-brutalism", "Next.js 15"],
  openGraph: {
    title: "Launchly — Build without context switching",
    description: "Templates, visual editor, live preview, and Next.js 15 source code on one gamified maker workspace.",
    type: "website",
  },
  icons: {
    icon: "/brand-logo-clean.png",
    shortcut: "/brand-logo-clean.png",
    apple: "/brand-logo-clean.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${orbitron.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#faf8f5] dark:bg-[#0a0b12] text-[#111111] dark:text-[#f4f4f8] font-sans selection:bg-[#111111] selection:text-white dark:selection:bg-white dark:selection:text-black">
        {children}
      </body>
    </html>
  );
}
