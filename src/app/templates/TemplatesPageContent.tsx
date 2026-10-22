'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Grid3X3, LayoutList, Search, X } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { CATEGORIES, TEMPLATES } from '@/lib/templates';
import type { Template } from '@/types';

export default function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const requestedCategory = searchParams.get('category') || 'All';
  const activeCategory = CATEGORIES.includes(requestedCategory as (typeof CATEGORIES)[number]) ? requestedCategory : 'All';
  const searchQuery = searchParams.get('q') || '';

  const updateFilters = (category: string, query: string) => {
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (query.trim()) params.set('q', query.trim());
    const nextUrl = params.size ? `/templates?${params}` : '/templates';
    router.replace(nextUrl, { scroll: false });
  };

  const displayedTemplates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TEMPLATES.filter((template) => {
      const matchesCategory = activeCategory === 'All' || template.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesQuery = !query || [template.name, template.description, ...template.tags].some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const customize = (template: Template) => router.push(`/editor/${template.id}`);

  return (
    <>
      <header className="border-b-[3px] border-ink bg-[#fdf2f8] px-6 py-14 dark:bg-[#0c0d16] sm:py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-3xl font-display text-4xl font-black tracking-tight text-ink sm:text-6xl">
            Two storefronts. Every detail ready to customize.
          </h1>
          <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose a complete ecommerce starting point for fresh local groceries or modern technology. Customize products, pages, and branding in Launchly Studio.
          </p>
        </div>
      </header>
      <section className="min-h-[55vh] bg-background px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 border-b-[2px] border-ink/20 pb-4 md:flex-row md:items-center md:justify-between">
            <label className="relative min-w-0 flex-1 md:max-w-lg">
              <span className="sr-only">Search ecommerce templates</span>
              <Search size={16} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
              <input value={searchQuery} onChange={(event) => updateFilters(activeCategory, event.target.value)} placeholder="Search ecommerce templates…" className="w-full rounded-xl border-2 border-ink bg-card py-3 pl-10 pr-10 font-mono text-sm text-ink shadow-brutal-xs outline-none focus-visible:ring-2 focus-visible:ring-pink" />
              {searchQuery && <button type="button" aria-label="Clear search" onClick={() => updateFilters(activeCategory, '')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink hover:text-pink"><X size={16}/></button>}
            </label>
            <div role="group" aria-label="Template display mode" className="flex self-end rounded-xl border-2 border-ink bg-card p-1 shadow-brutal-xs md:self-auto">
              <button type="button" aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')} className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-yellow text-black' : 'text-muted-foreground'}`}><Grid3X3 size={16}/></button>
              <button type="button" aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')} className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-yellow text-black' : 'text-muted-foreground'}`}><LayoutList size={16}/></button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 py-4" role="group" aria-label="Filter by category">
            {CATEGORIES.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => updateFilters(category, searchQuery)} className={`rounded-lg border-2 border-ink px-3 py-2 font-mono text-xs font-bold uppercase shadow-brutal-xs ${activeCategory === category ? 'bg-pink text-black' : 'bg-card text-ink hover:bg-yellow'}`}>{category}</button>)}
          </div>
          <p className="mb-5 font-mono text-xs font-bold text-muted-foreground" aria-live="polite">
            Showing {displayedTemplates.length} ecommerce templates
            {(searchQuery || activeCategory !== 'All') && <button type="button" onClick={() => updateFilters('All', '')} className="ml-3 text-pink underline">Clear filters</button>}
          </p>
          {displayedTemplates.length ? <div className={viewMode === 'grid' ? 'grid gap-7 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-5'}>
            {displayedTemplates.map((template) => <TemplateCard key={template.id} template={template} onCustomize={customize} />)}
          </div> : <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-ink/30 p-10 text-center">
            <Search className="mx-auto mb-4 text-muted-foreground" size={34}/>
            <h2 className="font-display text-xl font-black text-ink">No matching templates</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or clear the filters.</p>
            <button type="button" onClick={() => updateFilters('All', '')} className="mt-5 rounded-lg border-2 border-ink bg-pink px-4 py-2 font-bold text-black">Clear filters</button>
          </div>}
        </div>
      </section>
    </>
  );
}
