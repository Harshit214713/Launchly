import type { Metadata } from "next";
import CleanUrlManager from "@/components/CleanUrlManager";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";

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
    creator: "@simplyvardaan_",
    site: "@simplyvardaan_",
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
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#faf8f5] dark:bg-[#0a0b12] text-[#111111] dark:text-[#f4f4f8] font-sans selection:bg-[#111111] selection:text-white dark:selection:bg-white dark:selection:text-black">
        <ThemeInitializer />
        <CleanUrlManager />
        {children}
      </body>
    </html>
  );
}
