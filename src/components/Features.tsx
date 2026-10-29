'use client';

import { 
  Laptop, 
  Code2, 
  Layers, 
  Moon, 
  Zap, 
  Globe
} from 'lucide-react';

const FEATURES = [
  {
    icon: Laptop,
    bg: 'bg-pink',
    title: 'Visual + Code on one screen',
    description: 'Edit page content and layout in the visual workspace, then preview responsive breakpoints as you work.',
  },
  {
    icon: Code2,
    bg: 'bg-yellow',
    title: 'Next.js 16 source export',
    description: 'Export an editable project built with the App Router, TypeScript, and Tailwind CSS v4.',
  },
  {
    icon: Zap,
    bg: 'bg-mint',
    title: 'One focused workspace',
    description: 'Customize pages, preview devices, manage assets, and prepare your site for publishing from one editor.',
  },
  {
    icon: Layers,
    bg: 'bg-lilac',
    title: 'Ecommerce starters',
    description: 'Begin with grocery and technology storefronts, then replace the sample copy and products with your own.',
  },
  {
    icon: Globe,
    bg: 'bg-sky',
    title: 'Publish or export',
    description: 'Preview your work, publish to a Launchly URL, or export the source project for your own deployment workflow.',
  },
  {
    icon: Moon,
    bg: 'bg-pink',
    title: 'Customizable visual style',
    description: 'Adjust colors, typography, spacing, and component styles to bring the starter closer to your brand.',
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
          A practical set of tools to design, preview, and export a website without starting from an empty project.
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
