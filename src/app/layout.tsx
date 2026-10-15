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
  title: "Launchly — Craft, Customize & Launch Without Limits",
  description: "Curated aesthetic templates, real-time visual canvas, and instant production export. Design freely, build faster, and ship your vision to the world.",
  keywords: [
    "website builder",
    "curated templates",
    "visual editor",
    "creative studio",
    "publish website",
    "neo-brutalism",
    "web design",
    "modern web",
    "maker workspace",
  ],
  openGraph: {
    title: "Launchly — The Visual Studio for Modern Web Builders",
    description: "Curated aesthetic templates, live visual editing, and instant edge deployment. Build without friction in a playground crafted for creators.",
    type: "website",
    siteName: "Launchly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Launchly — The Visual Studio for Modern Web Builders",
    description: "Curated aesthetic templates, live visual editing, and instant edge deployment. Build without friction in a playground crafted for creators.",
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
