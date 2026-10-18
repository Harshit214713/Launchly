import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand-logo-clean.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
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
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdf2f8] dark:bg-[#0d0d14] text-[#000000] dark:text-[#f5f5f7] font-sans selection:bg-[#111111] selection:text-white dark:selection:bg-white dark:selection:text-black">
        {children}
      </body>
    </html>
  );
}
