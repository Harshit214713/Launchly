'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-transparent text-black dark:text-white flex flex-col justify-center items-center pt-8 sm:pt-12 md:pt-14 pb-12 sm:pb-16 min-h-[calc(100vh-100px)]">
      {/* Background ambient lighting blurs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden">
        <div className="absolute -left-20 top-14 h-[340px] w-[340px] rounded-full bg-pink/20 blur-3xl" />
        <div className="absolute -right-20 top-24 h-[300px] w-[300px] rounded-full bg-lilac/25 blur-3xl" />
        <div className="absolute left-1/3 top-[280px] h-[260px] w-[260px] rounded-full bg-yellow/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex flex-col items-center w-[min(1220px,calc(100%-24px))] text-center px-4 mt-2 sm:mt-3">
        {/* Main Headline - Bold, high-impact visible text in both Light & Dark modes */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[86px] xl:text-[90px] font-black leading-[1.06] sm:leading-[1.03] tracking-[-0.03em] max-w-5xl text-black dark:text-white">
          Build websites <br />
          without{' '}
          <span className="relative inline-block">
            <span className="relative z-10 italic text-black dark:text-white">context switching.</span>
            <span aria-hidden="true" className="select-none pointer-events-none absolute inset-x-0 bottom-1 sm:bottom-2 -z-0 h-3.5 sm:h-5 rounded-md bg-pink/60 dark:bg-pink/40" />
          </span>
        </h1>

        {/* Supporting description - Crisp solid readable text */}
        <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-sm sm:text-lg md:text-xl font-medium leading-relaxed text-neutral-800 dark:text-neutral-200">
          Discover world-class templates, customize every pixel visually, and{' '}
          <span className="font-bold text-black dark:text-white underline decoration-yellow decoration-4 underline-offset-4">
            publish live to your custom domain
          </span>{' '}
          in minutes. No coding required.
        </p>

        {/* Primary CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <Link
            href="/templates"
            className="brutal-press group inline-flex min-h-12 sm:min-h-13 items-center justify-center gap-2.5 rounded-2xl border-[3px] border-black dark:border-[#222230] bg-pink px-7 sm:px-8 font-display text-sm sm:text-base font-black text-black shadow-brutal dark:shadow-[4px_4px_0px_#000000] hover:bg-pink/90"
          >
            <span>Start building free</span>
            <ArrowUpRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <a
            href="#live-workspace"
            className="brutal-press inline-flex min-h-12 sm:min-h-13 items-center justify-center gap-2 rounded-2xl border-[3px] border-black dark:border-[#222230] bg-white dark:bg-[#161622] px-6 sm:px-7 font-display text-sm sm:text-base font-black text-black dark:text-white shadow-brutal dark:shadow-[4px_4px_0px_#000000] hover:bg-neutral-50 dark:hover:bg-[#1f1f2e]"
          >
            <span>Live Studio</span>
          </a>
        </div>

        {/* Social Proof */}
        <div className="mt-5 flex items-center justify-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          <div className="flex -space-x-1.5">
            <div className="h-6.5 w-6.5 rounded-full border-2 border-black bg-mint shadow-xs flex items-center justify-center text-[9px] font-black text-black">
              M
            </div>
            <div className="h-6.5 w-6.5 rounded-full border-2 border-black bg-yellow shadow-xs flex items-center justify-center text-[9px] font-black text-black">
              K
            </div>
            <div className="h-6.5 w-6.5 rounded-full border-2 border-black bg-pink shadow-xs flex items-center justify-center text-[9px] font-black text-black">
              S
            </div>
            <div className="h-6.5 w-6.5 rounded-full border-2 border-black bg-lilac shadow-xs flex items-center justify-center text-[9px] font-black text-black">
              V
            </div>
          </div>
          <span>Joined by 2,400+ makers & founders</span>
        </div>
      </div>
    </section>
  );
}
