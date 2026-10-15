'use client';

import { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, Check, Layers, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const PRESET_STYLES = [
  { id: 'saas', name: 'SaaS Platform', color: '#f472b6', tag: 'High-Conversion' },
  { id: 'agency', name: 'Creative Agency', color: '#ffd600', tag: 'Brutalist Vibe' },
  { id: 'portfolio', name: 'Developer Portfolio', color: '#7bd7c1', tag: 'Minimalist' },
  { id: 'store', name: 'Merch Store', color: '#ddd6fe', tag: 'E-commerce' },
];

export default function HighlightDemo() {
  const [selectedStyle, setSelectedStyle] = useState(PRESET_STYLES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelect = (style: typeof PRESET_STYLES[0]) => {
    setIsGenerating(true);
    setSelectedStyle(style);
    setTimeout(() => setIsGenerating(false), 400);
  };

  return (
    <section className="mx-auto w-[min(1200px,calc(100%-24px))] pb-16">
      <div className="relative overflow-hidden rounded-3xl border-[3px] border-ink bg-card p-6 shadow-brutal md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] items-center">
          {/* Left Details */}
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-mint px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-brutal">
              <Sparkles size={12} className="stroke-[3]" />
              Live interactive preview
            </span>

            <h3 className="mt-4 font-display text-3xl font-black text-ink md:text-4xl leading-tight">
              Pick your niche → Launchly builds the layout.
            </h3>
            <p className="mt-2 text-base text-muted-foreground leading-relaxed">
              Click any website style below to see how our engine generates production-ready layouts with instant responsive components.
            </p>

            {/* Interactive Selector Chips */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PRESET_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelect(style)}
                  style={{
                    backgroundColor: selectedStyle.id === style.id ? style.color : 'transparent',
                  }}
                  className={`brutal-press inline-flex items-center gap-2 rounded-xl border-[2.5px] border-ink px-3.5 py-2 font-display text-xs font-bold text-black shadow-brutal-sm cursor-pointer transition-all ${
                    selectedStyle.id === style.id ? 'scale-105' : 'bg-card hover:bg-neutral-100'
                  }`}
                >
                  <span>{style.name}</span>
                  <span className="text-[10px] font-mono opacity-80">({style.tag})</span>
                </button>
              ))}
            </div>

            {/* Hint message */}
            <div className="mt-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-pink">
              <span className="h-2 w-2 animate-pulse rounded-full bg-pink" />
              <span>Click a style to switch layout preview</span>
            </div>
          </div>

          {/* Right Live Mini Card Output */}
          <div className="relative">
            <div
              className={`rounded-2xl border-[3px] border-ink bg-[#fdf2f8] dark:bg-[#111119] p-6 shadow-brutal transition-all duration-300 ${
                isGenerating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b-[2px] border-ink">
                <div className="flex items-center gap-2">
                  <span
                    style={{ backgroundColor: selectedStyle.color }}
                    className="h-3.5 w-3.5 rounded-full border border-ink"
                  />
                  <span className="font-mono text-xs font-bold uppercase text-ink">
                    {selectedStyle.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-black uppercase rounded-md border border-ink bg-white px-2 py-0.5 text-black">
                  Next.js 15
                </span>
              </div>

              {/* Card Canvas preview */}
              <div className="my-5 rounded-xl border-[2px] border-ink bg-card p-5 text-center shadow-brutal-sm">
                <span
                  style={{ backgroundColor: selectedStyle.color }}
                  className="inline-block rounded-full border border-ink px-3 py-0.5 font-mono text-[10px] font-bold uppercase text-black mb-2"
                >
                  Curated Template
                </span>
                <h4 className="font-display text-xl font-black text-ink">
                  {selectedStyle.id === 'saas' && 'SaaS Next-Gen Analytics'}
                  {selectedStyle.id === 'agency' && 'Avant-Garde Design Studio'}
                  {selectedStyle.id === 'portfolio' && 'Fullstack Engineer Portfolio'}
                  {selectedStyle.id === 'store' && 'Retro Drop Limited Merch'}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  Fully wired with modern responsive design, dark mode, TypeScript, and clean modular React components.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Link
                    href={`/templates`}
                    style={{ backgroundColor: selectedStyle.color }}
                    className="brutal-press inline-flex items-center gap-1.5 rounded-lg border-[2px] border-ink px-3 py-1.5 font-display text-xs font-black text-black shadow-brutal-sm"
                  >
                    <span>Use Template</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Mini Status */}
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Production Ready</span>
                <span className="text-mint font-bold">✓ 100% Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
