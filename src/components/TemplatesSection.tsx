'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { CATEGORIES, TEMPLATES } from '@/lib/templates';
import type { Template } from '@/types';

export default function TemplatesSection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const displayedTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((template) => template.category === activeCategory);
  const customize = (template: Template) => router.push(`/editor/${template.id}`);
  return (
    <section id="templates" className="scroll-mt-20 bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-pink">Website templates</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-5xl">Find your starting point.</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Browse a starting point, preview the details, and customize it for your project.</p>
          </div>
          <Link href="/templates" className="inline-flex items-center gap-2 font-display text-sm font-black text-ink hover:text-pink">
            View all templates <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="mb-6 rounded-2xl border-2 border-ink bg-card p-3 shadow-brutal-xs sm:p-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter templates by category">
            <span className="mr-1 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category</span>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg border-2 border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase transition-colors ${
                  activeCategory === category
                    ? 'bg-pink text-black shadow-brutal-xs'
                    : 'bg-card text-ink hover:bg-yellow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {displayedTemplates.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {displayedTemplates.map((template) => <TemplateCard key={template.id} template={template} onCustomize={customize}/>)}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-ink/30 px-6 py-10 text-center">
            <h3 className="font-display text-lg font-black text-ink">No {activeCategory} templates yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Choose another category to explore the available starters.</p>
            <button type="button" onClick={() => setActiveCategory('All')} className="mt-4 rounded-lg border-2 border-ink bg-yellow px-4 py-2 font-mono text-xs font-bold uppercase text-black">
              Show all templates
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
