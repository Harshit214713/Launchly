'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Grid3X3, LayoutList, Loader2, Globe, X } from 'lucide-react';
import TemplateCard from '@/components/TemplateCard';
import { CATEGORIES, getTemplatesByCategory, searchTemplates, COMING_SOON_CATEGORIES } from '@/lib/templates';
import { TemplateCategory } from '@/types';
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
  const [showPro, setShowPro] = useState<boolean | null>(null);

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

  // External Creative API state
  const [activeTab, setActiveTab] = useState<'curated' | 'external'>('curated');
  const [externalTemplates, setExternalTemplates] = useState<Template[]>([]);
  const [loadingExternal, setLoadingExternal] = useState(false);
  const [savedKey, setSavedKey] = useState('');

  // Load API key from localStorage if present
  useEffect(() => {
    const stored = localStorage.getItem('launchly_unsplash_key');
    if (stored) {
      requestAnimationFrame(() => {
        setSavedKey(stored);
      });
    }
  }, []);

  // Fetch external aesthetic templates when tab is active or query changes
  useEffect(() => {
    if (activeTab !== 'external') return;

    let mounted = true;
    requestAnimationFrame(() => setLoadingExternal(true));

    const queryParam = searchQuery || (activeCategory !== 'All' ? `${activeCategory} modern website design` : 'minimalist website design');
    const url = `/api/templates/external?query=${encodeURIComponent(queryParam)}${savedKey ? `&apiKey=${encodeURIComponent(savedKey)}` : ''}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.templates)) {
          setExternalTemplates(data.templates);
        }
      })
      .catch((err) => {
        console.error('[Templates] Error fetching external templates:', err);
      })
      .finally(() => {
        if (mounted) setLoadingExternal(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, searchQuery, activeCategory, savedKey]);

  const displayedTemplates = (() => {
    if (activeTab === 'external') {
      let temps = [...externalTemplates];
      if (showPro !== null) {
        temps = temps.filter(t => t.isPro === showPro);
      }
      return temps;
    }

    let templates = searchQuery
      ? searchTemplates(searchQuery)
      : getTemplatesByCategory(activeCategory);

    if (showPro !== null) {
      templates = templates.filter((t: Template) => t.isPro === showPro);
    }

    return templates;
  })();

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
              Aesthetic Full-Stack Themes.
            </h1>
            <p className="text-base sm:text-lg font-mono text-muted-foreground">
              Production-ready Next.js 15 full-stack architectures. Supabase database, Stripe billing, and award-winning aesthetic designs.
            </p>

            {/* Stream Selector Tab Bar */}
            <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl border-[2.5px] border-ink bg-card shadow-brutal-sm gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('curated')}
                className={`brutal-press px-4 py-2 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'curated'
                    ? 'bg-pink text-black border-2 border-ink shadow-brutal-xs'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                Curated Full-Stack Designs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('external')}
                className={`brutal-press px-4 py-2 rounded-xl font-display text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'external'
                    ? 'bg-yellow text-black border-2 border-ink shadow-brutal-xs'
                    : 'text-muted-foreground hover:text-ink'
                }`}
              >
                <Globe size={14} />
                <span>Live Creative Feed (API)</span>
              </button>
            </div>
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
              placeholder={activeTab === 'external' ? "Search creative design themes via API…" : "Search templates by niche or keyword…"}
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

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 shrink-0 justify-end">
            <select
              value={showPro === null ? 'all' : showPro ? 'pro' : 'free'}
              className="h-10 px-3 bg-background border-[2.5px] border-ink rounded-xl font-mono text-xs font-bold text-ink focus:outline-none cursor-pointer shadow-brutal-xs"
              onChange={(e) => setShowPro(e.target.value === 'all' ? null : e.target.value === 'pro')}
            >
              <option value="all">All tiers</option>
              <option value="free">Free only</option>
              <option value="pro">Pro only</option>
            </select>

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
                Showing <span className="text-ink font-black">{displayedTemplates.length}</span> {activeTab === 'external' ? 'creative API' : 'curated'} templates
              </span>
              {activeTab === 'external' && (
                <span className="px-2 py-0.5 rounded-full border border-black bg-mint text-black font-mono text-[9px] font-black uppercase">
                  {savedKey ? 'LIVE API KEY CONNECTED' : 'CURATED CREATIVE FEED'}
                </span>
              )}
              {(searchQuery || activeCategory !== 'All' || showPro !== null) && (
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); setShowPro(null); }}
                  className="ml-3 text-pink underline cursor-pointer hover:text-pink/80 font-bold"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {loadingExternal ? (
            <div className="flex flex-col items-center justify-center py-28 text-center bg-card rounded-3xl border-[3px] border-ink p-8 shadow-brutal max-w-md mx-auto">
              <Loader2 className="h-10 w-10 text-pink animate-spin mb-4" />
              <h3 className="font-display font-black text-xl text-ink mb-1">Fetching Creative Design Feed...</h3>
              <p className="font-mono text-xs text-muted-foreground">
                Streaming high-aesthetic design themes from Creative API.
              </p>
            </div>
          ) : COMING_SOON_CATEGORIES.includes(activeCategory as TemplateCategory) && !searchQuery ? (
            // Show Coming Soon message in template area for non-Ecommerce categories
            <div className="flex flex-col items-center justify-center py-28 text-center bg-card rounded-3xl border-[3px] border-ink p-8 shadow-brutal max-w-lg mx-auto">
              <div className="text-6xl mb-6">🚧</div>
              <h3 className="font-display font-black text-3xl text-ink mb-3">Coming Soon!</h3>
              <p className="font-mono text-sm text-muted-foreground mb-6 max-w-md">
                The <span className="text-pink font-black">{activeCategory}</span> category is under development. We&apos;re working hard to bring you amazing templates in this category.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => { 
                    setActiveCategory('All'); 
                    setSearchQuery('');
                    router.replace('/templates', { scroll: false });
                  }}
                  className="brutal-press px-6 py-3 rounded-xl border-[2.5px] border-ink bg-pink font-display text-xs font-black text-black shadow-brutal cursor-pointer"
                >
                  Browse All Templates
                </button>
                <button
                  onClick={() => { 
                    setActiveCategory('Ecommerce'); 
                    setSearchQuery('');
                    router.replace('/templates?category=Ecommerce', { scroll: false });
                  }}
                  className="brutal-press px-6 py-3 rounded-xl border-[2.5px] border-ink bg-yellow font-display text-xs font-black text-black shadow-brutal cursor-pointer"
                >
                  View Ecommerce Templates
                </button>
              </div>
            </div>
          ) : displayedTemplates.length > 0 ? (
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
