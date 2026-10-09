'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Globe, Edit3, Eye, Copy, Trash2, MoreHorizontal,
  TrendingUp, Clock, FileText, LayoutTemplate, ChevronRight,
  Bell, Settings, LogOut, Search, Sparkles, Check
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { cn, formatDate } from '@/lib/utils';

interface WebsiteItem {
  id: string;
  name: string;
  templateId: string;
  status: 'published' | 'draft';
  subdomain: string;
  updatedAt: string;
  createdAt: string;
  views: number;
}

const INITIAL_WEBSITES: WebsiteItem[] = [
  {
    id: 'w1',
    name: 'NeuroAI Studio',
    templateId: 'neuro-ai',
    status: 'published',
    subdomain: 'neuro-ai',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    views: 14280,
  },
  {
    id: 'w2',
    name: 'Kroma Creative Studio',
    templateId: 'kroma-studio',
    status: 'published',
    subdomain: 'kroma-studio',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    views: 8940,
  },
  {
    id: 'w3',
    name: 'Chronicle Dev Radar',
    templateId: 'chronicle-os',
    status: 'draft',
    subdomain: 'chronicle-os',
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    views: 0,
  },
];

export default function Dashboard() {
  const [websites, setWebsites] = useState<WebsiteItem[]>(INITIAL_WEBSITES);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setTimeOfDay('morning');
    else if (h < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Fetch user profile
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.authenticated && d.user) setUser(d.user);
      })
      .catch(() => {});

    // Fetch live sites
    fetch('/api/sites')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.sites && d.sites.length > 0) {
          const mapped: WebsiteItem[] = d.sites.map((s: { id: string; name: string; templateId: string; subdomain: string; updatedAt: string; createdAt: string; views: number }) => ({
            id: s.id,
            name: s.name,
            templateId: s.templateId,
            status: 'published' as const,
            subdomain: s.subdomain,
            updatedAt: s.updatedAt || new Date().toISOString(),
            createdAt: s.createdAt || new Date().toISOString(),
            views: s.views || 120,
          }));
          setWebsites(prev => {
            const ids = new Set(prev.map(p => p.id));
            const newOnes = mapped.filter(m => !ids.has(m.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  const filteredWebsites = websites.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (id: string, subdomain: string) => {
    navigator.clipboard?.writeText(`https://${subdomain}.launchly.site`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (id: string) => {
    setWebsites(prev => prev.filter(w => w.id !== id));
    setOpenMenu(null);
  };

  const greeting = `Good ${timeOfDay}${user ? `, ${user.name.split(' ')[0]}` : ''}.`;

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Sidebar - Pure White & Subtle Border with Orange Accents */}
      <aside className="w-64 bg-white border-r border-[#E8E6E0] flex flex-col fixed left-0 top-0 bottom-0 z-40">
        {/* Brand Logo */}
        <div className="p-5 border-b border-[#E8E6E0]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#0F0F11] overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-[0_0_16px_rgba(255,85,0,0.4)] transition-all">
              <Image
                src="/brand-logo-clean.png"
                alt="Launchly Emblem"
                width={32}
                height={32}
                className="w-full h-full object-contain p-0.5 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/brand-name-light.png"
                alt="LAUNCHLY"
                width={130}
                height={20}
                className="h-3.5 w-auto object-contain"
              />
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#FF5500]/10 text-[#FF5500]">
                STUDIO
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-1">
            {[
              { icon: LayoutTemplate, label: 'Websites', href: '/dashboard', active: true },
              { icon: Globe, label: 'Templates', href: '/templates' },
              { icon: TrendingUp, label: 'Analytics', href: '/dashboard' },
              { icon: FileText, label: 'Domains', href: '/dashboard' },
              { icon: Settings, label: 'Settings', href: '/dashboard' },
            ].map(({ icon: Icon, label, href, active }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#525252] hover:bg-[#FAF9F6] hover:text-[#171717]'
                )}
              >
                <Icon size={16} className={active ? 'text-[#FF5500]' : ''} />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Upgrade to Pro Card */}
          <div className="p-4 bg-gradient-to-br from-[#FFF5F0] to-[#FAF9F6] border border-[#FF5500]/20 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5500] mb-1">
              <Sparkles size={13} />
              <span>Launchly Pro Plan</span>
            </div>
            <div className="text-xs text-[#737373] mb-3 leading-relaxed">
              Unlock full source code export & custom domains with zero watermarks.
            </div>
            <Link 
              href="/#pricing" 
              className="w-full inline-flex items-center justify-center py-2 px-3 rounded-xl text-xs font-bold bg-[#FF5500] hover:bg-[#E04800] text-white transition-all shadow-sm hover:shadow-md hover:shadow-[#FF5500]/25"
            >
              Upgrade to Pro
            </Link>
          </div>
        </nav>

        {/* User Session */}
        <div className="p-4 border-t border-[#E8E6E0]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FAF9F6] transition-all group">
            <div className="w-8 h-8 rounded-full bg-[#FF5500] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {user?.avatar || (user ? user.name.charAt(0) : 'J')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#171717] truncate">
                {user ? user.name : 'Vardaan Demo'}
              </div>
              <div className="text-xs text-[#8A8A8A] truncate font-mono">
                {user ? user.email : 'demo@launchly.site'}
              </div>
            </div>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              title="Sign out"
              className="p-1 rounded-lg hover:bg-gray-100 text-[#ACACAC] hover:text-[#171717] transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E8E6E0] px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ACACAC]" />
            <input
              type="text"
              placeholder="Search your websites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#FAF9F6] rounded-xl text-sm text-[#171717] placeholder:text-[#ACACAC] border border-[#E8E6E0] focus:outline-none focus:border-[#FF5500] focus:bg-white w-72 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="p-2.5 rounded-xl hover:bg-[#FAF9F6] text-[#525252] border border-[#E8E6E0] transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF5500]" />
            </button>

            <Link 
              href="/templates" 
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FF5500] hover:bg-[#E04800] text-white transition-all shadow-sm hover:shadow-md hover:shadow-[#FF5500]/25"
            >
              <Plus size={15} />
              <span>Create New Website</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Body Content */}
        <div className="flex-1 p-8 max-w-7xl">
          {/* Greeting Hero */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#171717] tracking-tight mb-1">
              {greeting}
            </h1>
            <p className="text-sm text-[#737373]">
              Manage your live edge deployments, edit drafts in the studio, and monitor visitor analytics.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { label: 'Active Websites', value: websites.length, icon: LayoutTemplate, color: '#171717', bg: '#FFF5F0' },
              { label: 'Live Deployments', value: websites.filter(w => w.status === 'published').length, icon: Globe, color: '#FF5500', bg: '#FFF2EB' },
              { label: 'Total Page Views', value: websites.reduce((a, w) => a + (w.views || 0), 0).toLocaleString(), icon: TrendingUp, color: '#FF5500', bg: '#FFF2EB' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-[#E8E6E0] shadow-2xs hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">{label}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#171717] tracking-tight">{value}</div>
              </div>
            ))}
          </div>

          {/* Websites Grid */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#171717] tracking-tight">Your Websites</h2>
              <Link href="/templates" className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1">
                Browse gallery <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Dashed Create Website Card */}
              <Link
                href="/templates"
                className="border-2 border-dashed border-[#E8E6E0] hover:border-[#FF5500]/50 hover:bg-[#FFF5F0]/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 transition-all group min-h-60"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] group-hover:bg-[#FF5500] group-hover:text-white flex items-center justify-center transition-all shadow-2xs text-[#8A8A8A]">
                  <Plus size={22} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-[#171717] group-hover:text-[#FF5500] transition-colors">
                    Create New Website
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5">Pick from 12+ award-winning templates</div>
                </div>
              </Link>

              {filteredWebsites.map((website) => {
                const template = TEMPLATES.find(t => t.id === website.templateId) || TEMPLATES[0];
                return (
                  <div
                    key={website.id}
                    className="bg-white rounded-3xl border border-[#E8E6E0] overflow-hidden hover:border-[#FF5500]/30 hover:shadow-xl hover:shadow-[#FF5500]/5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Visual Header / Canvas preview */}
                      <div
                        className="h-36 relative overflow-hidden flex flex-col justify-between p-4"
                        style={{ backgroundColor: template.bgColor || '#0A0A0C' }}
                      >
                        <div className="flex items-center justify-between relative z-10">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                            {template.category}
                          </span>

                          <span className={cn(
                            'px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-2xs',
                            website.status === 'published'
                              ? 'bg-[#22C55E] text-white'
                              : 'bg-white/30 text-white'
                          )}>
                            <span className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              website.status === 'published' ? 'bg-white animate-pulse' : 'bg-gray-300'
                            )} />
                            {website.status === 'published' ? 'LIVE' : 'DRAFT'}
                          </span>
                        </div>

                        <div className="my-auto relative z-10">
                          <div className="font-black text-lg text-white tracking-tight drop-shadow-sm">
                            {website.name}
                          </div>
                          <div className="text-xs text-white/70 font-mono">
                            {website.subdomain}.launchly.site
                          </div>
                        </div>

                        {/* Hover Overlay with Live actions */}
                        <div className="absolute inset-0 bg-[#171717]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-xs z-20">
                          <Link
                            href={`/editor/${website.templateId}`}
                            className="px-3 py-1.5 bg-white text-[#171717] rounded-xl text-xs font-bold hover:bg-[#FAF9F6] transition-colors shadow-lg flex items-center gap-1"
                          >
                            <Edit3 size={12} />
                            Edit
                          </Link>
                          {website.status === 'published' && (
                            <Link
                              href={`/live/${website.subdomain}`}
                              target="_blank"
                              className="px-3 py-1.5 bg-[#FF5500] text-white rounded-xl text-xs font-bold hover:bg-[#E04800] transition-colors shadow-lg flex items-center gap-1"
                            >
                              <Eye size={12} />
                              Visit Live Site
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-base text-[#171717] tracking-tight mb-0.5">
                              {website.name}
                            </h3>
                            <button
                              onClick={() => handleCopyUrl(website.id, website.subdomain)}
                              className="text-xs font-mono text-[#737373] hover:text-[#FF5500] flex items-center gap-1 transition-colors"
                              title="Click to copy live URL"
                            >
                              <span>{website.subdomain}.launchly.site</span>
                              {copiedId === website.id ? (
                                <Check size={11} className="text-[#22C55E]" />
                              ) : (
                                <Copy size={11} className="text-[#ACACAC]" />
                              )}
                            </button>
                          </div>

                          {/* Menu Dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenu(openMenu === website.id ? null : website.id)}
                              className="p-1.5 rounded-lg hover:bg-[#FAF9F6] text-[#8A8A8A] hover:text-[#171717] transition-colors cursor-pointer"
                            >
                              <MoreHorizontal size={16} />
                            </button>

                            {openMenu === website.id && (
                              <div className="absolute right-0 top-8 bg-white border border-[#E8E6E0] rounded-2xl shadow-xl z-30 py-1.5 min-w-44 animate-scale-in">
                                <Link
                                  href={`/editor/${website.templateId}`}
                                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#525252] hover:bg-[#FAF9F6] hover:text-[#171717]"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Edit3 size={13} className="text-[#8A8A8A]" />
                                  Edit in Studio
                                </Link>
                                <Link
                                  href={`/live/${website.subdomain}`}
                                  target="_blank"
                                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#525252] hover:bg-[#FAF9F6] hover:text-[#171717]"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  <Eye size={13} className="text-[#8A8A8A]" />
                                  Visit Live Site
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopyUrl(website.id, website.subdomain);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#525252] hover:bg-[#FAF9F6] hover:text-[#171717]"
                                >
                                  <Copy size={13} className="text-[#8A8A8A]" />
                                  Copy Domain
                                </button>
                                <div className="my-1 border-t border-[#E8E6E0]" />
                                <button
                                  type="button"
                                  onClick={() => handleDelete(website.id)}
                                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={13} />
                                  Delete Website
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 py-3 border-t border-[#E8E6E0] flex items-center justify-between text-xs text-[#8A8A8A] bg-[#FAF9F6]/50">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        <span>{formatDate(website.updatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-[#171717]">
                        <TrendingUp size={12} className="text-[#FF5500]" />
                        <span>{website.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discover New Templates Dock */}
          <div className="pt-6 border-t border-[#E8E6E0]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#171717] tracking-tight">Discover New Templates</h2>
              <Link href="/templates" className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1">
                View all templates <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEMPLATES.slice(0, 4).map((tmpl) => (
                <Link
                  key={tmpl.id}
                  href={`/editor/${tmpl.id}`}
                  className="group rounded-2xl overflow-hidden border border-[#E8E6E0] hover:border-[#FF5500]/40 hover:shadow-lg transition-all bg-white flex flex-col justify-between"
                >
                  <div className="h-28 relative flex items-center justify-center p-3" style={{ backgroundColor: tmpl.bgColor }}>
                    <div className="font-bold text-xs text-center text-white/70">
                      {tmpl.name}
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#FF5500] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        Use Template →
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white">
                    <div className="text-xs font-bold text-[#171717] truncate">{tmpl.name}</div>
                    <div className="text-[10px] text-[#8A8A8A]">{tmpl.category}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
