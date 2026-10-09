'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X } from 'lucide-react';
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
    <section id="templates" className="pt-6 sm:pt-10 pb-20 sm:pb-28 px-4 sm:px-6 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#171717] mb-4">
            Find your starting point.
          </h2>
          <p className="text-base sm:text-lg text-[#525252] max-w-lg mx-auto">
            Professionally designed, fully responsive websites for whatever you&rsquo;re building.
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#E8E6E0] shadow-sm mb-10 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search by name, style, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF9F6] border border-[#E8E6E0] rounded-2xl text-xs sm:text-sm text-[#171717] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/15 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#FF5500] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide shrink-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-[#FAF9F6] text-[#525252] hover:text-[#FF5500] hover:bg-[#F0EEE9]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Plan filter */}
          <div className="shrink-0">
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as 'all' | 'free' | 'pro')}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#FAF9F6] border border-[#E8E6E0] rounded-xl text-xs font-semibold text-[#525252] focus:outline-none focus:border-[#FF5500] cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="free">Free Only</option>
              <option value="pro">Pro Only</option>
            </select>
          </div>
        </div>

        {/* Results Count & Clear Button */}
        {(searchQuery || activeCategory !== 'All' || filterPlan !== 'all') && (
          <div className="flex items-center justify-between text-xs text-[#737373] mb-6">
            <span>
              Showing <strong className="text-black">{filteredTemplates.length}</strong> matching template{filteredTemplates.length !== 1 ? 's' : ''}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setFilterPlan('all');
              }}
              className="text-[#FF5500] font-semibold hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Template Cards Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCustomize={handleCustomize}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E6E0] p-8">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-bold text-lg text-[#171717] mb-1">No templates found</h3>
            <p className="text-xs sm:text-sm text-[#8A8A8A] mb-4">
              Try adjusting your search terms or filter settings
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
                setFilterPlan('all');
              }}
              className="px-5 py-2.5 rounded-full bg-[#171717] text-white text-xs font-bold hover:bg-[#FF5500] transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* View full gallery CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-[#171717] border border-[#E8E6E0] hover:border-[#FF5500]/40 hover:text-[#FF5500] hover:bg-[#FAF9F6] transition-all shadow-xs group"
          >
            <span>Explore All 12+ Templates in Gallery</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
