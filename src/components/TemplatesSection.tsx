'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X, Filter } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { TEMPLATES, CATEGORIES } from '@/lib/templates';
import { Template } from '@/types';

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'pro'>('all');

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory =
      activeCategory === 'All' || template.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlan =
      filterPlan === 'all' ||
      (filterPlan === 'pro' && template.isPro) ||
      (filterPlan === 'free' && !template.isPro);

    return matchesCategory && matchesSearch && matchesPlan;
  });

  const handleCustomize = (template: Template) => {
    window.location.href = `/editor/${template.id}`;
  };

  return (
    <section id="templates" className="pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-6 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-ink mb-3">
            Find your starting point.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
            Production-ready Next.js 15 designs crafted for speed, aesthetics, and high conversion.
          </p>
        </div>

        {/* Neo-brutalist Search & Filters Bar */}
        <div className="bg-card rounded-2xl p-4 sm:p-5 border-[3px] border-ink shadow-brutal mb-8 flex flex-col gap-3 sm:gap-4">
          {/* Top Row: Search Input + Plan Tier Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink pointer-events-none" />
              <input
                type="text"
                placeholder="Search templates by name, style, or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 sm:py-3 bg-[#fdf2f8] dark:bg-[#171720] border-[2.5px] border-ink rounded-xl text-xs sm:text-sm font-mono font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink transition-all shadow-brutal-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink hover:text-pink cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Plan filter */}
            <div className="shrink-0">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value as 'all' | 'free' | 'pro')}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-[#fdf2f8] dark:bg-[#171720] border-[2.5px] border-ink rounded-xl text-xs sm:text-sm font-mono font-bold text-ink focus:outline-none cursor-pointer shadow-brutal-sm"
              >
                <option value="all">All Tiers (Free & Pro)</option>
                <option value="free">Free Templates</option>
                <option value="pro">Pro Designs</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category tabs (Wrapped, clean spacing, no clipping) */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t-[2px] border-ink/10 dark:border-[#222232]">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-muted-foreground mr-1 hidden md:inline">
              CATEGORY:
            </span>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`brutal-press px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-display font-black uppercase whitespace-nowrap transition-all cursor-pointer border-[2.5px] border-ink ${
                  activeCategory === category
                    ? 'bg-pink text-black shadow-brutal-sm'
                    : 'bg-card text-ink hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-brutal-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCustomize={handleCustomize}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border-[3px] border-ink p-8 shadow-brutal max-w-md mx-auto">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-display text-xl font-black text-ink mb-2">No templates found</h3>
            <p className="font-mono text-xs text-muted-foreground mb-6">
              Try adjusting your search terms or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setFilterPlan('all');
              }}
              className="brutal-press px-5 py-2.5 rounded-xl border-[2.5px] border-ink bg-pink font-display text-xs font-black text-black shadow-brutal cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
