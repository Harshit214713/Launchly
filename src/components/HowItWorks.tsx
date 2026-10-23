'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    badge: 'Step 1',
    badgeBg: 'bg-yellow',
    title: 'Choose a starting point',
    description: 'Preview a storefront template or open a blank site to begin with your own content.',
    cta: 'Explore templates',
    href: '/templates',
  },
  {
    number: '02',
    badge: 'Step 2',
    badgeBg: 'bg-pink',
    title: 'Customize every pixel',
    description: 'Edit copy, arrange sections, and check desktop, tablet, and mobile layouts in the visual editor.',
    cta: 'Try visual studio',
    href: '/editor/fresh-crate',
  },
  {
    number: '03',
    badge: 'Step 3',
    badgeBg: 'bg-mint',
    title: 'Publish or export code',
    description: 'Publish to a Launchly URL or export the site source to continue developing in your own environment.',
    cta: 'Start building free',
    href: '/signup',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="scroll-mt-20 mx-auto w-[min(1200px,calc(100%-32px))] py-10 sm:py-12">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <h2 className="font-display text-4xl font-black leading-[1.05] sm:text-5xl text-ink">
          How Launchly works in 3 steps.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Move from a first draft to a site you can preview, publish, or continue building with exported source.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, idx) => (
          <article
            key={step.number}
            className={`rounded-2xl border-[3px] border-ink bg-card p-6 sm:p-7 shadow-brutal transition-shadow hover:shadow-brutal-md ${
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
                onClick={() => setActiveStep(idx)}
                className="inline-flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-wider text-ink hover:text-pink transition-colors"
              >
                <span>{step.cta}</span>
                <ArrowUpRight size={14} className="stroke-[3]" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
