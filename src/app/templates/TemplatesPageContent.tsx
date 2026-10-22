'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Grid3X3, LayoutList, X } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { CATEGORIES, getTemplatesByCategory, searchTemplates } from '@/lib/templates';
import { Template } from '@/types';
import Link from 'next/link';

export default function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategory = searchParams.get('category');
  const urlQuery = searchParams.get('q');

  const [activeCategory, setActiveCategory] = useState(urlCategory || 'All');
  const [searchQuery, setSearchQuery] = useState(urlQuery || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // URL search parameters are external state; sync them after navigation.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (urlCategory) {
      setActiveCategory(urlCategory);
    }
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [urlCategory, urlQuery]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Instant URL sync on state change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeCategory && activeCategory !== 'All') {
      params.set('category', activeCategory);
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    const newQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (newQuery !== currentQuery) {
      router.replace(newQuery ? `/templates?${newQuery}` : '/templates', { scroll: false });
    }
  }, [activeCategory, searchQuery, router, searchParams]);

  const displayedTemplates = searchQuery
      ? searchTemplates(searchQuery)
      : getTemplatesByCategory(activeCategory);

  const handleCustomize = (template: Template) => {
    router.push(`/editor/${template.id}`);
  };

  return (
    <>
      {/* Neo-Brutal Hero */}
      <div className="bg-[#fdf2f8] dark:bg-[#0c0d16] border-b-[3px] border-ink py-14 sm:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-ink mb-4">
              Two storefronts. Every detail ready to customize.
            </h1>
            <p className="text-base sm:text-lg font-mono text-muted-foreground">
              Choose a complete ecommerce starting point for fresh local groceries or modern technology. Customize the products, pages, and brand in Launchly Studio.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar (Scrolls with page so only navbar stays visible) */}
      <div className="relative bg-card/95 border-b-[3px] border-ink px-4 sm:px-6 py-3.5 space-y-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
            <input
              type="text"
              placeholder="Search ecommerce templates…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveCategory('All');
              }}
              className="w-full pl-10 pr-9 py-2.5 bg-background border-[2.5px] border-ink rounded-xl font-mono text-xs sm:text-sm font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink hover:text-pink cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* View controls */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <div className="flex items-center border-[2.5px] border-ink rounded-xl p-1 bg-background shadow-brutal-xs">
              {[
                { icon: Grid3X3, mode: 'grid' as const },
                { icon: LayoutList, mode: 'list' as const },
              ].map(({ icon: Icon, mode }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === mode ? 'bg-yellow text-black font-black' : 'text-muted-foreground hover:text-ink'
                  }`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Bar - wraps cleanly, no scrollbar */}
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 no-scrollbar">
          {CATEGORIES.map((cat) => {
            return (
              <button
                key={cat}
                onClick={() => { 
                  setActiveCategory(cat); 
                  setSearchQuery('');
                }}
                className={`brutal-press px-3.5 py-1.5 rounded-xl text-xs font-display font-black uppercase whitespace-nowrap transition-all shrink-0 cursor-pointer border-[2.5px] border-ink shadow-brutal-xs relative ${
                  activeCategory === cat
                    ? 'bg-pink text-black'
                    : 'bg-card text-ink hover:bg-neutral-100 dark:hover:bg-[#1b1b28]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-8 sm:py-10 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Stats row */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[2px] border-ink/20">
            <div className="font-mono text-xs font-bold text-muted-foreground flex items-center gap-2">
              <span>
                Showing <span className="text-ink font-black">{displayedTemplates.length}</span> ecommerce templates
              </span>
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="ml-3 text-pink underline cursor-pointer hover:text-pink/80 font-bold"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {displayedTemplates.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'
                : 'flex flex-col gap-4'
            }>
              {displayedTemplates.map((template: Template) => (
                viewMode === 'grid' ? (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onCustomize={handleCustomize}
                  />
                ) : (
                  <TemplateListItem key={template.id} template={template} onCustomize={handleCustomize} />
                )
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 text-center bg-card rounded-3xl border-[3px] border-ink p-8 shadow-brutal max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-display font-black text-2xl text-ink mb-2">No templates found</h3>
              <p className="font-mono text-xs text-muted-foreground mb-6">
                Try adjusting your search query or reset the filters.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="brutal-press px-6 py-2.5 rounded-xl border-[2.5px] border-ink bg-pink font-display text-xs font-black text-black shadow-brutal cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TemplateListItem({ template, onCustomize }: { template: Template; onCustomize: (t: Template) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 bg-card rounded-2xl border-[3px] border-ink p-5 shadow-brutal hover:shadow-brutal-md transition-all group">
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-16 rounded-xl border-2 border-ink flex flex-col items-center justify-center font-mono font-bold text-xs text-white overflow-hidden relative p-1.5 shadow-2xs"
          style={{ background: template.bgColor || '#07080E' }}
        >
          <div 
            className="w-7 h-7 rounded-md flex items-center justify-center font-display font-black text-sm text-black shadow-xs mb-1"
            style={{ backgroundColor: template.accent || '#00F0FF' }}
          >
            {template.name.charAt(0)}
          </div>
          <span className="text-[8px] font-mono uppercase tracking-wider text-neutral-300 font-bold truncate max-w-[80px]">
            {template.category}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-display font-black text-lg text-ink group-hover:text-pink transition-colors">
              {template.name}
            </h4>
            <span
              className={`rounded-full border-2 border-ink px-2 py-0.2 font-mono text-[10px] font-bold ${
                template.isPro ? 'bg-pink text-black' : 'bg-mint text-black'
              }`}
            >
              {template.isPro ? 'Pro' : 'Free'}
            </span>
          </div>
          <p className="font-mono text-xs text-muted-foreground mt-1 line-clamp-1">
            {template.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/editor/${template.id}`}
          className="brutal-press rounded-xl border-2 border-ink bg-card px-4 py-2 font-display text-xs font-bold text-ink shadow-brutal-sm"
        >
          Preview
        </Link>
        <button
          onClick={() => onCustomize(template)}
          className="brutal-press rounded-xl border-2 border-ink bg-pink px-4 py-2 font-display text-xs font-black text-black shadow-brutal-sm cursor-pointer"
        >
          Open in Editor
        </button>
      </div>
    </div>
  );
}
