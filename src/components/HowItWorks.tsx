'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Sliders, Globe, Palette, Sparkles } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    badge: 'Step 1',
    badgeBg: 'bg-yellow',
    title: 'Pick a curated template',
    description: 'Browse our collection of production-ready Next.js 15 designs. Filter by niche: SaaS, Creative Agency, Minimal Portfolio, or Store.',
    cta: 'Explore templates',
    href: '/templates',
  },
  {
    number: '02',
    badge: 'Step 2',
    badgeBg: 'bg-pink',
    title: 'Customize every pixel',
    description: 'Swap headlines, reorder sections, test responsive breakpoints, and preview dark mode in real-time with zero boilerplate.',
    cta: 'Try visual studio',
    href: '/editor/saas-launch',
  },
  {
    number: '03',
    badge: 'Step 3',
    badgeBg: 'bg-mint',
    title: 'Publish or export code',
    description: 'Go live on a free Launchly edge subdomain, connect your own domain, or download the complete Next.js 15 source code.',
    cta: 'Start building free',
    href: '/signup',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="mx-auto w-[min(1200px,calc(100%-32px))] py-10 sm:py-12">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <span className="inline-flex items-center rounded-full border-[3px] border-ink bg-card px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink shadow-brutal">
          Workflow
        </span>
        <h2 className="mt-4 font-display text-4xl font-black leading-[1.05] sm:text-5xl text-ink">
          How Launchly works in 3 steps.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          From blank idea to published, production-grade website in less time than it takes to brew a cup of coffee.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, idx) => (
          <div
            key={step.number}
            onClick={() => setActiveStep(idx)}
            className={`brutal-press rounded-2xl border-[3px] border-ink bg-card p-6 sm:p-7 shadow-brutal hover:shadow-brutal-md transition-all cursor-pointer flex flex-col justify-between ${
              activeStep === idx ? 'ring-2 ring-ink ring-offset-2' : ''
            }`}
          >
            <div>
              {/* Top Row: Big Step Number & Badge */}
              <div className="flex items-center justify-between pb-4 border-b-[2px] border-ink/20">
                <span className="font-mono text-3xl sm:text-4xl font-black text-ink">
                  {step.number}
                </span>
                <span
                  className={`inline-block rounded-full border-[2.5px] border-ink ${step.badgeBg} px-3 py-0.5 font-mono text-[11px] font-black uppercase text-black shadow-brutal-sm`}
                >
                  {step.badge}
                </span>
              </div>

              {/* Step Title & Description */}
              <h3 className="mt-5 font-display text-xl font-black text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>

            {/* Action Link */}
            <div className="mt-8 pt-4 border-t-[2px] border-ink/10">
              <Link
                href={step.href}
                className="inline-flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wider text-ink hover:text-pink transition-colors"
              >
                <span>{step.cta}</span>
                <ArrowUpRight size={14} className="stroke-[3]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
