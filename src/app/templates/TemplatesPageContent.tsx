'use client';

import { useState } from 'react';
import { Search, Grid3X3, LayoutList } from 'lucide-react';
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
      {/* Hero */}
      <div className="bg-[#FAF9F6] border-b border-[#E8E6E0] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6E0] text-sm text-[#525252] mb-5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
              {TEMPLATES.length}+ templates
            </div>
            <h1 className="text-5xl font-bold tracking-[-0.03em] text-[#171717] mb-4">
              Find your starting point.
            </h1>
            <p className="text-lg text-[#525252]">
              Professionally designed websites for every industry and style. Pick one, make it yours, go live.
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-[#E8E6E0] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ACACAC]" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) setActiveCategory('All');
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F5F4F0] border border-transparent rounded-xl text-sm text-[#171717] placeholder:text-[#ACACAC] focus:outline-none focus:border-[#FF5500] focus:bg-white focus:ring-2 focus:ring-[#FF5500]/20 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto flex-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                    activeCategory === cat && !searchQuery
                      ? 'bg-[#171717] text-white'
                      : 'text-[#525252] hover:text-[#FF5500] hover:bg-[#F5F4F0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                className="px-3 py-2 bg-[#F5F4F0] border border-transparent rounded-xl text-sm text-[#525252] focus:outline-none focus:border-[#FF5500] transition-all cursor-pointer"
                onChange={(e) => setShowPro(e.target.value === 'all' ? null : e.target.value === 'pro')}
              >
                <option value="all">All plans</option>
                <option value="free">Free only</option>
                <option value="pro">Pro only</option>
              </select>

              <div className="flex items-center bg-[#F5F4F0] rounded-xl p-1">
                {[
                  { icon: Grid3X3, mode: 'grid' as const },
                  { icon: LayoutList, mode: 'list' as const },
                ].map(({ icon: Icon, mode }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === mode ? 'bg-white shadow-sm text-[#FF5500]' : 'text-[#ACACAC]'}`}
                  >
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-10 bg-[#FAF9F6] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Stats row */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-sm text-[#8A8A8A]">
              <span className="font-semibold text-[#171717]">{filteredTemplates.length}</span> templates
              {(searchQuery || activeCategory !== 'All') && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowPro(null); }}
                  className="ml-3 text-[#FF5500] hover:underline cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>
            <Link href="/signup" className="text-sm font-medium text-[#525252] hover:text-[#FF5500] transition-colors">
              Request a template →
            </Link>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
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
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-semibold text-xl text-[#171717] mb-2">No templates found</h3>
              <p className="text-[#8A8A8A] mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowPro(null); }}
                className="btn-outline text-sm py-2.5 px-6"
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
    <div className="flex items-center gap-6 bg-white rounded-2xl border border-[#E8E6E0] p-4 hover:border-[#FF5500]/30 hover:shadow-md transition-all group">
      <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#E8E6E0]"
           style={{ background: template.bgColor }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="font-bold text-xs" style={{ color: template.textColor, opacity: 0.6 }}>{template.name}</div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-[#171717]">{template.name}</h3>
          {template.badge && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              template.badge === 'Popular' ? 'bg-[#FF5500] text-white' : 'bg-[#171717] text-white'
            }`}>{template.badge}</span>
          )}
          {template.isPro && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#6366F1] text-white">Pro</span>
          )}
        </div>
        <p className="text-sm text-[#6B6B6B] mb-2">{template.description}</p>
        <div className="flex items-center gap-1.5">
          {template.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-[#8A8A8A] px-2 py-0.5 bg-[#F5F4F0] rounded-full">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/templates/${template.id}`}
          className="px-3.5 py-2 border border-[#E8E6E0] bg-white rounded-xl text-xs font-semibold hover:border-black/30 hover:bg-[#F5F4F0] text-[#171717] transition-colors"
        >
          Preview
        </Link>
        <button
          onClick={() => onCustomize(template)}
          className="px-3.5 py-2 bg-[#171717] hover:bg-[#FF5500] text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Customize
        </button>
      </div>
    </div>
  );
}
