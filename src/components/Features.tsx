'use client';

import { 
  Laptop, 
  Code2, 
  Layers, 
  Sparkles, 
  Zap, 
  Globe
} from 'lucide-react';

const FEATURES = [
  {
    icon: Laptop,
    bg: 'bg-pink',
    title: 'Visual + Code on one screen',
    description: 'Keep your live website canvas, layout controls, and runnable Next.js code in one unified, focused workspace.',
  },
  {
    icon: Code2,
    bg: 'bg-yellow',
    title: 'Clean Next.js 15 Export',
    description: 'Download 100% clean, documented source code with App Router, TypeScript, and Tailwind CSS v4. No lock-in ever.',
  },
  {
    icon: Zap,
    bg: 'bg-mint',
    title: 'Zero Context Switching',
    description: 'Stop jumping between Figma, code editors, and hosting dashboards. Customize, test, and deploy in one tab.',
  },
  {
    icon: Layers,
    bg: 'bg-lilac',
    title: '12+ Production Templates',
    description: 'Crafted for SaaS founders, creative agencies, freelance portfolios, and modern e-commerce stores.',
  },
  {
    icon: Globe,
    bg: 'bg-sky',
    title: 'Instant Custom Domains',
    description: 'Connect your personal domain with automated SSL certificates, Edge SSR, and global CDN caching in seconds.',
  },
  {
    icon: Sparkles,
    bg: 'bg-pink',
    title: 'Light + Dark Modes Built-in',
    description: 'Every single template and section is fully wired with harmonious light and dark palettes out of the box.',
  },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto w-[min(1200px,calc(100%-32px))] py-20">
      {/* Header */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full border-[3px] border-ink bg-card px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink shadow-brutal">
          Features
        </span>
        <h2 className="mt-4 font-display text-4xl font-black leading-[1.05] sm:text-5xl text-ink">
          The whole launch loop, one screen.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Everything you need to design, inspect, polish, and deploy your dream website without touching messy boilerplate.
        </p>
      </div>

      {/* 3-Column Neo-Brutalist Grid */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <article
              key={idx}
              className="brutal-press rounded-2xl border-[3px] border-ink bg-card p-6 shadow-brutal hover:shadow-brutal-md transition-all"
            >
              {/* Chunky Icon Container */}
              <span
                className={`inline-grid h-12 w-12 place-items-center rounded-xl border-[3px] border-ink shadow-brutal ${feature.bg} text-black`}
              >
                <Icon size={22} className="stroke-[2.5]" />
              </span>

              {/* Title & Description */}
              <h3 className="mt-5 font-display text-lg font-black text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
