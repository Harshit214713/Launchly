import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Launchly — Dream it. Build it. Launch it.",
  description: "Discover beautiful website templates, customize them visually, and publish your website in minutes. No coding required.",
  keywords: ["website builder", "templates", "no-code", "publish website", "SaaS"],
  openGraph: {
    title: "Launchly — Dream it. Build it. Launch it.",
    description: "Discover beautiful website templates, customize them visually, and publish your website in minutes.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#171717]">
        {children}
      </body>
    </html>
  );
}
