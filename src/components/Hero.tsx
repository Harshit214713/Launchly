'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient lighting - Warm Aesthetic Sunset Orange */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#FF5500]/15 via-[#FF8833]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-[#FF5500]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-[#6366F1]/6 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto my-auto">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.94] text-[#171717] mb-6">
          Your ideas deserve{' '}
          <span className="relative inline-block">
            <span className="relative z-10">a website.</span>
            {/* Animated Sunset Orange underline */}
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="8"
              viewBox="0 0 300 8"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 5 Q 75 1, 150 5 T 300 5"
                stroke="#FF5500"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Supporting description */}
        <p className="text-lg sm:text-xl text-[#525252] max-w-2xl mx-auto leading-relaxed mb-8">
          Discover world-class templates, customize every pixel visually, and publish live to your custom domain in minutes. No coding required.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-semibold bg-[#FF5500] hover:bg-[#E04800] text-white shadow-lg shadow-[#FF5500]/25 transition-all group"
          >
            <span>Explore all templates</span>
            <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/editor/saas-launch"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-medium bg-white text-[#171717] border border-[#E8E6E0] hover:border-[#FF5500]/40 hover:bg-[#FAF9F6] transition-all shadow-xs"
          >
            <span>Open in Visual Editor</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
