'use client';

import { useState } from 'react';
import { Search, Grid3X3, LayoutList, Sparkles, X, ArrowUpRight } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { TEMPLATES, CATEGORIES, getTemplatesByCategory, searchTemplates } from '@/lib/templates';
import { Template } from '@/types';
import Link from 'next/link';

export default function TemplatesPageContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPro, setShowPro] = useState<boolean | null>(null);

  const filteredTemplates = (() => {
    let templates = searchQuery
      ? searchTemplates(searchQuery)
      : getTemplatesByCategory(activeCategory);

    if (showPro !== null) {
      templates = templates.filter(t => t.isPro === showPro);
    }

    return templates;
  })();

  const handleCustomize = (template: Template) => {
    window.location.href = `/editor/${template.id}`;
  };

  return (
    <>
      {/* Neo-Brutal Hero */}
      <div className="bg-[#fdf2f8] dark:bg-[#0b0b12] border-b-[3px] border-ink py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow border-[2.5px] border-ink font-mono text-xs font-black uppercase text-black mb-5 shadow-brutal-sm">
              <Sparkles size={13} />
              {TEMPLATES.length}+ Production Designs
            </div>
            <h1 className="text-5xl sm:text-6xl font-black font-display tracking-tight text-ink mb-4">
              Find your starting point.
            </h1>
            <p className="text-lg font-mono text-muted-foreground">
              Production-ready websites for every industry. Pick one, tweak visually, export clean Next.js 15 code.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur border-b-[3px] border-ink px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink" />
              <input
                type="text"
                placeholder="Search templates by niche or keyword…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setActiveCategory('All');
                }}
                className="w-full pl-10 pr-9 py-2.5 bg-background border-[2.5px] border-ink rounded-xl font-mono text-xs sm:text-sm font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-sm"
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

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto flex-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                  className={`brutal-press px-4 py-2 rounded-xl text-xs font-display font-black uppercase whitespace-nowrap transition-all flex-shrink-0 cursor-pointer border-[2.5px] border-ink ${
                    activeCategory === cat && !searchQuery
                      ? 'bg-pink text-black shadow-brutal-sm'
                      : 'bg-card text-ink hover:bg-neutral-100 shadow-brutal-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                className="px-3 py-2 bg-background border-[2.5px] border-ink rounded-xl font-mono text-xs font-bold text-ink focus:outline-none cursor-pointer shadow-brutal-sm"
                onChange={(e) => setShowPro(e.target.value === 'all' ? null : e.target.value === 'pro')}
              >
                <option value="all">All tiers</option>
                <option value="free">Free only</option>
                <option value="pro">Pro only</option>
              </select>

              <div className="flex items-center border-[2.5px] border-ink rounded-xl p-0.5 bg-card shadow-brutal-sm">
                {[
                  { icon: Grid3X3, mode: 'grid' as const },
                  { icon: LayoutList, mode: 'list' as const },
                ].map(({ icon: Icon, mode }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === mode ? 'bg-yellow text-black' : 'text-muted-foreground hover:text-ink'
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-12 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Stats row */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b-[2px] border-ink/20">
            <div className="font-mono text-xs font-bold text-muted-foreground">
              Showing <span className="text-ink font-black">{filteredTemplates.length}</span> templates
              {(searchQuery || activeCategory !== 'All' || showPro !== null) && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowPro(null); }}
                  className="ml-3 text-pink underline cursor-pointer hover:text-pink/80 font-bold"
                >
                  Clear filters
                </button>
              )}
            </div>
            <Link
              href="/signup"
              className="font-mono text-xs font-bold text-ink hover:text-pink transition-colors inline-flex items-center gap-1"
            >
              <span>Request a template</span>
              <ArrowUpRight size={13} className="stroke-[3]" />
            </Link>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'
                : 'flex flex-col gap-4'
            }>
              {filteredTemplates.map((template) => (
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
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowPro(null); }}
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
          className="w-24 h-16 rounded-xl border-2 border-ink flex items-center justify-center font-mono font-bold text-xs text-white"
          style={{ background: template.bgColor || '#171720' }}
        >
          {template.category}
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
          href={`/templates/${template.id}`}
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
