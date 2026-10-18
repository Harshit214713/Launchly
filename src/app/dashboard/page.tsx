'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Globe, Edit3, Eye, Copy, Trash2, MoreHorizontal,
  TrendingUp, Clock, LayoutTemplate, ChevronRight,
  Settings, LogOut, Search, Check, Menu, X,
  Sun, Moon, ArrowRight, ArrowUpRight, Layers, ShieldCheck, User as UserIcon,
  Loader2, ExternalLink, Mail, Zap, CheckCircle2, Crown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/templates';
import { cn, formatDate } from '@/lib/utils';
import BrandWordmark from '@/components/BrandWordmark';

interface WebsiteItem {
  id: string;
  name: string;
  templateId: string;
  status: 'published' | 'live' | 'draft';
  subdomain: string;
  updatedAt: string;
  createdAt: string;
  views: number;
}

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  plan?: 'free' | 'pro';
  createdAt?: string;
  avatar?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [greetingTime, setGreetingTime] = useState('Welcome');

  // Compute time of day greeting
  useEffect(() => {
    const hours = new Date().getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
    requestAnimationFrame(() => setGreetingTime(greeting));
  }, []);

  // Sync theme with document class
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    if (isDarkMode) {
      requestAnimationFrame(() => setIsDark(true));
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Fetch real-time user & personalized websites from Supabase API
  useEffect(() => {
    let mounted = true;

    async function loadPersonalizedData() {
      setLoading(true);

      let currentUser: UserProfile | null = null;

      // 1. Fetch genuine user session
      try {
        const userRes = await fetch('/api/auth/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (mounted && userData.authenticated && userData.user) {
            currentUser = userData.user;
            setUser(currentUser);
          }
        }
      } catch (err) {
        console.error('[Dashboard] User session fetch error:', err);
      }

      // 2. Fetch genuine database websites belonging to this account
      try {
        const url = currentUser?.id ? `/api/sites?userId=${encodeURIComponent(currentUser.id)}` : '/api/sites';
        const sitesRes = await fetch(url);
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          if (mounted && sitesData.success && Array.isArray(sitesData.sites)) {
            const realSites: WebsiteItem[] = sitesData.sites.map((s: Record<string, unknown>) => ({
              id: String(s.id),
              name: String(s.name || 'Untitled Site'),
              templateId: String(s.templateId || 'neuro-ai'),
              status: (s.status === 'published' || s.status === 'live' || s.status === 'draft') ? s.status : 'live',
              subdomain: String(s.subdomain || ''),
              updatedAt: String(s.updatedAt || s.createdAt || new Date().toISOString()),
              createdAt: String(s.createdAt || new Date().toISOString()),
              views: typeof s.views === 'number' ? s.views : 1,
            }));
            setWebsites(realSites);
          }
        }
      } catch (err) {
        console.error('[Dashboard] Sites fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPersonalizedData();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredWebsites = websites.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.subdomain.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyUrl = (id: string, subdomain: string) => {
    const liveUrl = typeof window !== 'undefined' ? `${window.location.origin}/live/${subdomain}` : `/live/${subdomain}`;
    navigator.clipboard?.writeText(liveUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard?.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyUserId = () => {
    const idToCopy = user?.id || 'usr_launchly';
    navigator.clipboard?.writeText(idToCopy);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/sites?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWebsites(prev => prev.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error('[Dashboard] Failed to delete site:', err);
    } finally {
      setDeletingId(null);
      setOpenMenu(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('[Dashboard] Logout error:', err);
    }
    router.push('/login');
  };

  // Real-time account calculations
  const totalSites = websites.length;
  const liveDeployments = websites.filter(w => w.status === 'live' || w.status === 'published').length;
  const totalViews = websites.reduce((acc, w) => acc + (w.views || 0), 0);
  const isPro = user?.plan === 'pro';
  const siteLimit = isPro ? 999 : 3;
  const usagePercentage = Math.min(100, Math.round((totalSites / siteLimit) * 100));

  return (
    <div className="min-h-screen bg-background dark:bg-[#09090f] text-ink flex flex-col lg:flex-row transition-colors">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Account Settings / Profile Modal - Fully Interactive & Responsive */}
      {profileModalOpen && user && (
        <div 
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            className="w-full max-w-[460px] max-h-[92vh] overflow-y-auto rounded-3xl border-[3px] sm:border-[3.5px] border-black dark:border-[#26283d] bg-[#faf8f5] dark:bg-[#0e0f18] p-4 sm:p-6 shadow-brutal-xl text-ink space-y-3.5 sm:space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Modal Header with Live Node Status */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b-2 border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500 border border-black"></span>
                </span>
                <h3 className="font-display text-base sm:text-lg font-black text-black dark:text-white uppercase tracking-tight">
                  Maker Identity
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="brutal-press h-8 w-8 rounded-xl border-2 border-black bg-yellow hover:bg-yellow/90 text-black flex items-center justify-center shadow-brutal-xs hover:rotate-90 transition-all cursor-pointer"
                title="Close"
              >
                <X size={15} className="stroke-[3]" />
              </button>
            </div>

            {/* Identity Card */}
            <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] shadow-brutal-sm space-y-3">
              {/* User Avatar + Identity Row */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with Pro Crown Badge */}
                <div className="relative shrink-0">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border-2 sm:border-[2.5px] border-black dark:border-[#26283d] bg-mint text-black font-display font-black text-xl sm:text-2xl flex items-center justify-center shadow-brutal-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {isPro ? (
                    <div 
                      className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border border-black bg-yellow text-black flex items-center justify-center shadow-xs"
                      title="Pro Builder"
                    >
                      <Crown size={10} className="stroke-[3]" />
                    </div>
                  ) : (
                    <div 
                      className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border border-black bg-pink text-black flex items-center justify-center shadow-xs"
                      title="Free Creator"
                    >
                      <Zap size={10} className="stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Name, Tier Badge & Email */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-display text-sm sm:text-base font-black text-black dark:text-white truncate max-w-[150px] sm:max-w-none">
                      {user.name}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-black font-mono text-[9px] font-black uppercase tracking-wider shadow-xs shrink-0",
                      isPro ? "bg-yellow text-black" : "bg-pink text-black"
                    )}>
                      {isPro ? <Crown size={9} className="stroke-[3]" /> : <Zap size={9} className="stroke-[3]" />}
                      <span>{isPro ? 'PRO TIER' : 'FREE TIER'}</span>
                    </span>
                  </div>

                  {/* Interactive Copy Email Pill */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="mt-1 group inline-flex max-w-full items-center gap-1.5 px-2 py-1 rounded-lg border border-black/20 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30] hover:bg-yellow hover:text-black hover:border-black font-mono text-[10px] sm:text-[11px] text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer text-left overflow-hidden w-full"
                    title="Click to copy email"
                  >
                    <Mail size={11} className="shrink-0" />
                    <span className="truncate min-w-0 flex-1">{user.email}</span>
                    {copiedEmail ? (
                      <span className="text-emerald-600 font-black text-[9px] flex items-center gap-0.5 shrink-0 pl-1">
                        <Check size={10} className="stroke-[3]" /> Copied!
                      </span>
                    ) : (
                      <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </button>
                </div>
              </div>

              {/* 3-Column Metrics Grid */}
              <div className="pt-2.5 border-t border-black/10 dark:border-white/10 grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                <div className="p-1.5 sm:p-2 rounded-xl border border-black/15 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30]">
                  <span className="font-mono text-[9px] uppercase font-bold text-neutral-500 block leading-tight">
                    Sites
                  </span>
                  <span className="font-display text-xs sm:text-sm font-black text-black dark:text-white mt-0.5 block truncate">
                    {totalSites} {isPro ? '· ∞' : '/ 3'}
                  </span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-xl border border-black/15 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30]">
                  <span className="font-mono text-[9px] uppercase font-bold text-neutral-500 block leading-tight">
                    Published
                  </span>
                  <span className="font-display text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
                    {liveDeployments} Live
                  </span>
                </div>

                <div className="p-1.5 sm:p-2 rounded-xl border border-black/15 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30]">
                  <span className="font-mono text-[9px] uppercase font-bold text-neutral-500 block leading-tight">
                    Joined
                  </span>
                  <span className="font-display text-[10px] sm:text-xs font-black text-black dark:text-white truncate block mt-0.5">
                    {user.createdAt ? formatDate(user.createdAt) : '2026'}
                  </span>
                </div>
              </div>

              {/* Interactive Quick Utilities (Copy ID + Theme Switch) */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="flex-1 brutal-press flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-black/20 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30] hover:bg-yellow hover:text-black font-mono text-[10px] transition-all cursor-pointer"
                  title="Click to copy account ID"
                >
                  <span className="text-neutral-500 truncate mr-1">
                    ID // {user.id ? user.id.slice(0, 10) + '...' : 'LNCH-7701'}
                  </span>
                  {copiedUserId ? (
                    <span className="text-emerald-600 font-black flex items-center gap-0.5 shrink-0">
                      <Check size={10} className="stroke-[3]" /> Copied!
                    </span>
                  ) : (
                    <span className="text-neutral-400 group-hover:text-black flex items-center gap-1 shrink-0">
                      <Copy size={10} />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="brutal-press flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-black/20 dark:border-white/15 bg-neutral-50 dark:bg-[#1a1c30] hover:bg-mint hover:text-black font-mono text-[10px] font-bold transition-all cursor-pointer shrink-0 text-black dark:text-white"
                  title="Toggle Light / Dark mode"
                >
                  {isDark ? <Sun size={11} className="text-yellow-500" /> : <Moon size={11} className="text-indigo-500" />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </button>
              </div>
            </div>

            {/* Pro Privileges Active or Upgrade Banner */}
            {isPro ? (
              <div className="relative z-10 p-3 sm:p-3.5 rounded-2xl border-2 border-black dark:border-[#26283d] bg-[#fbf7ee] dark:bg-[#17161b] shadow-brutal-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-display text-[11px] sm:text-xs font-black uppercase text-black dark:text-yellow">
                    <ShieldCheck size={13} className="stroke-[2.5] text-amber-500" />
                    <span>Pro Privileges Active</span>
                  </div>
                  <span className="font-mono text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Unlimited Edge Sites</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Source Code Downloads</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Custom Domain Routing</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Instant Turbopack Engine</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 p-3.5 sm:p-4 rounded-2xl border-2 border-black dark:border-[#26283d] bg-yellow text-black shadow-brutal-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-display text-xs font-black uppercase">
                    <ArrowUpRight size={14} className="stroke-[2.5]" />
                    <span>Upgrade to Pro Builder</span>
                  </div>
                  <span className="font-mono text-[8px] font-black uppercase bg-black text-white px-1.5 py-0.5 rounded-md">
                    UNLOCK ALL
                  </span>
                </div>
                <p className="font-mono text-[10px] leading-snug mb-2.5">
                  Deploy unlimited websites, hook up custom domains, and download complete source code.
                </p>
                <Link
                  href="/#pricing"
                  className="brutal-press inline-flex items-center justify-center gap-1.5 w-full text-center py-2 px-3 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs hover:bg-pink/90 transition-all"
                >
                  <span>Claim Pro Membership</span>
                  <ArrowRight size={12} className="stroke-[3]" />
                </Link>
              </div>
            )}

            {/* Bottom Modal Actions */}
            <div className="relative z-10 flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="brutal-press py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-xl border-2 border-black bg-white dark:bg-[#1a1b2e] hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white text-xs font-mono font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-brutal-xs text-neutral-700 dark:text-neutral-300"
              >
                <LogOut size={13} className="stroke-[2.5]" />
                <span>Sign Out</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="brutal-press py-2 sm:py-2.5 px-5 sm:px-6 rounded-xl border-2 border-black bg-yellow hover:bg-yellow/90 text-black font-display text-xs font-black uppercase cursor-pointer shadow-brutal-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar - Neo-Brutalist Launchly Theme */}
      <aside className={cn(
        "w-72 bg-card dark:bg-[#0d0d14] border-r-[3px] border-black dark:border-[#222232] flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-transform duration-200",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b-[2.5px] border-black dark:border-[#222232] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl border-2 border-black dark:border-[#222232] bg-yellow p-1 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0">
              <Image
                src="/brand-logo-clean.png"
                alt="Launchly Emblem"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <BrandWordmark size="sm" />
              <span className="font-mono text-[9px] font-black uppercase tracking-widest text-pink mt-0.5">
                DASHBOARD
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-black dark:border-[#222232] bg-background hover:bg-pink text-ink transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>


        {/* Navigation Menu */}
        <nav className="flex-1 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1.5">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-[#222232] bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs"
            >
              <LayoutTemplate size={16} className="stroke-[2.5]" />
              <span>Your Websites</span>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 border-transparent hover:border-black dark:hover:border-[#262638] text-neutral-700 dark:text-neutral-300 hover:bg-[#faf5ff] dark:hover:bg-[#181824] font-display text-xs font-black uppercase tracking-wider transition-all"
            >
              <Globe size={16} />
              <span>Templates</span>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 border-transparent hover:border-black dark:hover:border-[#262638] text-neutral-700 dark:text-neutral-300 hover:bg-[#faf5ff] dark:hover:bg-[#181824] font-display text-xs font-black uppercase tracking-wider transition-all"
            >
              <Edit3 size={16} />
              <span>Studio Editor</span>
            </Link>

            <button
              type="button"
              onClick={() => setProfileModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 border-transparent hover:border-black dark:hover:border-[#262638] text-neutral-700 dark:text-neutral-300 hover:bg-[#faf5ff] dark:hover:bg-[#181824] font-display text-xs font-black uppercase tracking-wider transition-all text-left cursor-pointer"
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Pro Upgrade for free users only */}
          {!isPro && (
            <div className="my-4 p-3.5 rounded-2xl border-2 border-black dark:border-[#262638] bg-yellow dark:bg-[#1c1c28] shadow-brutal-xs text-black dark:text-white">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] font-black uppercase text-black dark:text-yellow">
                  Free Tier Quota
                </span>
                <span className="font-mono text-[10px] font-bold">
                  {totalSites}/3 Sites
                </span>
              </div>
              
              {/* Visual Progress Bar */}
              <div className="h-2 rounded-full border border-black bg-white dark:bg-black overflow-hidden mb-3">
                <div 
                  className="h-full bg-pink transition-all" 
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <Link
                href="/#pricing"
                className="brutal-press w-full inline-flex items-center justify-center py-2 px-3 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs hover:bg-pink/90 transition-all"
              >
                <ArrowUpRight size={13} className="mr-1 stroke-[2.5]" />
                Upgrade to Pro
              </Link>
            </div>
          )}
        </nav>

        {/* Real-time User Profile Bottom Dock */}
        <div className="p-3.5 border-t-[2.5px] border-black dark:border-[#222232] bg-background dark:bg-[#0c0c14]">
          {user ? (
            <div className="flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer flex-1"
                title="View Account Profile"
              >
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-xl border-2 border-black dark:border-[#262638] bg-mint text-black font-display font-black text-sm flex items-center justify-center shadow-brutal-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {isPro && (
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-yellow border border-black flex items-center justify-center text-[7px] text-black">
                      <Crown size={8} className="stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-xs font-black text-black dark:text-white truncate">
                      {user.name}
                    </span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-md font-mono text-[9px] font-black uppercase border border-black shrink-0 leading-none",
                      isPro ? "bg-yellow text-black" : "bg-pink text-black"
                    )}>
                      {isPro ? "PRO" : "FREE"}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-neutral-500 break-all leading-tight mt-0.5 select-text">
                    {user.email}
                  </div>
                </div>
              </button>
              <button
                onClick={handleLogout}
                title="Sign out of account"
                className="brutal-press p-2 rounded-xl border-2 border-black dark:border-[#262638] bg-card hover:bg-red-400 text-ink transition-colors cursor-pointer shrink-0"
              >
                <LogOut size={13} className="stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-lg border-2 border-black dark:border-[#262638] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-ink shrink-0">
                  <UserIcon size={14} />
                </div>
                <div className="font-mono text-xs font-bold text-neutral-500 truncate">
                  Guest Session
                </div>
              </div>
              <Link
                href="/login"
                className="brutal-press px-2.5 py-1.5 rounded-lg border-2 border-black bg-yellow text-black font-display text-[10px] font-black uppercase tracking-wider shadow-brutal-xs"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 ml-0 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <header className="bg-card dark:bg-[#0d0d14] border-b-[3px] border-black dark:border-[#222232] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30 gap-3">
          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden brutal-press p-2 rounded-xl border-2 border-black dark:border-[#262638] bg-yellow text-black shrink-0 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={18} className="stroke-[2.5]" />
            </button>
            
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder={user ? `Search ${user.name.split(' ')[0]}'s websites...` : "Search your websites..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background dark:bg-[#12121c] rounded-xl text-xs sm:text-sm font-mono font-bold text-black dark:text-white placeholder:text-neutral-400 border-2 border-black dark:border-[#262638] focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">

            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="brutal-press h-9 w-9 rounded-xl border-2 border-black dark:border-[#262638] bg-yellow text-black flex items-center justify-center shadow-brutal-xs cursor-pointer shrink-0"
              aria-label="Toggle color theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Create Website CTA Button */}
            <Link
              href="/templates"
              className="brutal-press inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl border-2 border-black bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all shrink-0 cursor-pointer"
            >
              <Plus size={15} className="stroke-[3]" />
              <span className="hidden sm:inline">New Website</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {/* Unauthenticated Guest Notice Banner */}
          {!user && !loading && (
            <div className="mb-6 p-4 rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-yellow dark:bg-[#1a1a26] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-brutal">
              <div>
                <div className="font-display text-sm font-black text-black dark:text-white uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  <span>Guest Session Active</span>
                </div>
                <div className="font-mono text-xs text-neutral-800 dark:text-neutral-300 mt-0.5">
                  Sign in to your registered account to manage your saved websites, view analytics, and export source code.
                </div>
              </div>
              <Link
                href="/login"
                className="brutal-press px-4 py-2 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs shrink-0 self-start sm:self-auto"
              >
                Sign In Now →
              </Link>
            </div>
          )}

          {/* Header Title Greeting - Fully Personalized for the logged-in user */}
          <div className="mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white tracking-tight">
                {user ? `${greetingTime}, ${user.name}!` : 'Your Web Projects'}
              </h1>

              <p className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Manage your edge deployments, customize in Studio, and monitor live visitor counts.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/templates"
                className="brutal-press inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-card text-ink font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs hover:bg-neutral-100 dark:hover:bg-[#1a1a26]"
              >
                <Layers size={14} />
                <span>Templates</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Strip - 100% Real-time database metrics for this user */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-card dark:bg-[#12121a] p-4 sm:p-5 shadow-brutal">
              <div className="font-mono text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                {user ? `${user.name.split(' ')[0]}'s Sites` : 'Total Active Sites'}
              </div>
              <div className="font-display text-3xl font-black text-black dark:text-white">
                {loading ? <Loader2 size={24} className="animate-spin text-pink" /> : totalSites}
              </div>
              <span className="font-mono text-[10px] text-neutral-500 mt-1 block">
                {isPro ? 'Unlimited projects allowed' : `${totalSites} of 3 free sites used`}
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-card dark:bg-[#12121a] p-4 sm:p-5 shadow-brutal">
              <div className="font-mono text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                Live Deployments
              </div>
              <div className="font-display text-3xl font-black text-black dark:text-white">
                {loading ? <Loader2 size={24} className="animate-spin text-mint" /> : liveDeployments}
              </div>
              <span className="font-mono text-[10px] text-neutral-500 mt-1 block">
                Live on *.launchly.site
              </span>
            </div>

            <div className="rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-card dark:bg-[#12121a] p-4 sm:p-5 shadow-brutal">
              <div className="font-mono text-[11px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                Total Page Visits
              </div>
              <div className="font-display text-3xl font-black text-black dark:text-white">
                {loading ? <Loader2 size={24} className="animate-spin text-pink" /> : totalViews.toLocaleString()}
              </div>
              <span className="font-mono text-[10px] text-neutral-500 mt-1 block">
                Aggregated across your sites
              </span>
            </div>
          </div>

          {/* Real Websites Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
                {user ? `${user.name.split(' ')[0]}'s Published Websites` : 'Your Published Websites'}
              </h2>
              {websites.length > 0 && (
                <span className="font-mono text-xs text-neutral-500">
                  Showing {filteredWebsites.length} of {websites.length}
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-black/20 dark:border-[#262638]">
                <Loader2 size={36} className="animate-spin text-pink mb-3" />
                <span className="font-mono text-xs font-bold text-neutral-500">
                  Fetching your real-time websites from Supabase...
                </span>
              </div>
            ) : websites.length === 0 ? (
              /* Neo-Brutalist Personalized Empty State */
              <div className="rounded-3xl border-[3.5px] border-black dark:border-[#262638] bg-card dark:bg-[#12121a] p-6 sm:p-10 shadow-brutal-lg text-center relative overflow-hidden">
                <div className="max-w-xl mx-auto space-y-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-black dark:text-white tracking-tight">
                    {user 
                      ? `${user.name.split(' ')[0]}, you haven't launched any websites yet!` 
                      : 'You haven\'t launched any websites yet'}
                  </h3>

                  <p className="font-mono text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Pick a template from the gallery below. Customize the copy, colors, and components in the Studio editor, then launch directly to your custom <span className="font-bold text-pink">.launchly.site</span> subdomain.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/templates"
                      className="brutal-press inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border-[3px] border-black bg-pink text-black font-display text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all cursor-pointer"
                    >
                      <Plus size={18} className="stroke-[3]" />
                      <span>Create Your First Website</span>
                      <ArrowRight size={16} className="stroke-[3]" />
                    </Link>
                  </div>

                  {/* 3-Step Simple Guide */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 text-left border-t-2 border-black/10 dark:border-[#262638]/60 mt-6">
                    <div className="p-3.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background dark:bg-[#181824] shadow-brutal-xs">
                      <span className="font-mono text-xs font-black text-pink block mb-1">01 / CHOOSE</span>
                      <span className="font-display text-xs font-black text-black dark:text-white block">Pick a Template</span>
                      <span className="font-mono text-[10px] text-neutral-500">12+ responsive templates ready to deploy.</span>
                    </div>

                    <div className="p-3.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background dark:bg-[#181824] shadow-brutal-xs">
                      <span className="font-mono text-xs font-black text-yellow block mb-1">02 / TWEAK</span>
                      <span className="font-display text-xs font-black text-black dark:text-white block">Edit in Studio</span>
                      <span className="font-mono text-[10px] text-neutral-500">Visual editor + live Next.js hot reload.</span>
                    </div>

                    <div className="p-3.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background dark:bg-[#181824] shadow-brutal-xs">
                      <span className="font-mono text-xs font-black text-mint block mb-1">03 / SHIP</span>
                      <span className="font-display text-xs font-black text-black dark:text-white block">Instant Edge URL</span>
                      <span className="font-mono text-[10px] text-neutral-500">Free SSL, global CDN, zero configuration.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : filteredWebsites.length === 0 ? (
              <div className="py-12 text-center rounded-2xl border-2 border-dashed border-black/20 dark:border-[#262638] p-6">
                <span className="font-mono text-xs font-bold text-neutral-500 block">
                  No websites matching &ldquo;{search}&rdquo;
                </span>
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-xs font-bold text-pink hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              </div>
            ) : (
              /* Real Websites Grid */
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {/* Create New Website Card */}
                <Link
                  href="/templates"
                  className="border-[2.5px] border-dashed border-black/30 dark:border-[#262638] hover:border-black dark:hover:border-white rounded-3xl p-6 flex flex-col items-center justify-center gap-3 transition-all group bg-background/50 dark:bg-[#12121a]/50 hover:bg-yellow/10 min-h-60 text-center"
                >
                  <div className="h-12 w-12 rounded-2xl border-2 border-black dark:border-[#262638] bg-yellow text-black flex items-center justify-center group-hover:bg-pink transition-all shadow-brutal-xs">
                    <Plus size={22} className="stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-black text-black dark:text-white uppercase tracking-wider group-hover:text-pink transition-colors">
                      + Create Another Website
                    </div>
                    <div className="font-mono text-[11px] text-neutral-500 mt-0.5">
                      Choose from 12+ templates
                    </div>
                  </div>
                </Link>

                {filteredWebsites.map((website) => {
                  const template = TEMPLATES.find(t => t.id === website.templateId) || TEMPLATES[0];

                  return (
                    <div
                      key={website.id}
                      className="bg-card dark:bg-[#12121a] rounded-3xl border-[2.5px] border-black dark:border-[#262638] overflow-hidden shadow-brutal hover:shadow-brutal-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Visual Banner Preview */}
                        <div
                          className="h-36 relative overflow-hidden flex flex-col justify-between p-4 border-b-2 border-black dark:border-[#262638]"
                          style={{ backgroundColor: template.bgColor || '#09090f' }}
                        >
                          <div className="flex items-center justify-between relative z-10">
                            <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-black/40 bg-white/20 text-white backdrop-blur-xs">
                              {template.category}
                            </span>

                            <span className={cn(
                              'px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase flex items-center gap-1.5 border border-black/30 shadow-2xs',
                              website.status === 'published' || website.status === 'live'
                                ? 'bg-mint text-black'
                                : 'bg-yellow text-black'
                            )}>
                              <span className={cn(
                                'w-1.5 h-1.5 rounded-full',
                                website.status === 'published' || website.status === 'live'
                                  ? 'bg-black animate-pulse'
                                  : 'bg-black'
                              )} />
                              {website.status === 'published' || website.status === 'live' ? 'LIVE' : 'DRAFT'}
                            </span>
                          </div>

                          <div className="my-auto relative z-10">
                            <div className="font-display font-black text-lg text-white tracking-tight drop-shadow-sm truncate">
                              {website.name}
                            </div>
                            <div className="font-mono text-[11px] text-white/80 truncate">
                              {website.subdomain}.launchly.site
                            </div>
                          </div>

                          {/* Hover Quick Action Buttons */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-xs z-20">
                            <Link
                              href={`/editor/${website.templateId}`}
                              className="brutal-press px-3 py-1.5 rounded-xl border-2 border-black bg-white text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs flex items-center gap-1"
                            >
                              <Edit3 size={12} />
                              <span>Studio</span>
                            </Link>

                            <Link
                              href={`/live/${website.subdomain}`}
                              target="_blank"
                              className="brutal-press px-3 py-1.5 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs flex items-center gap-1"
                            >
                              <Eye size={12} />
                              <span>Live Site</span>
                            </Link>
                          </div>
                        </div>

                        {/* Card Info Details */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0">
                              <h3 className="font-display font-black text-base text-black dark:text-white tracking-tight truncate">
                                {website.name}
                              </h3>
                              <button
                                onClick={() => handleCopyUrl(website.id, website.subdomain)}
                                className="font-mono text-xs text-neutral-500 hover:text-pink flex items-center gap-1 transition-colors mt-0.5 cursor-pointer"
                                title="Click to copy live URL"
                              >
                                <span className="truncate">{website.subdomain}.launchly.site</span>
                                {copiedId === website.id ? (
                                  <Check size={12} className="text-mint stroke-[3]" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>
                            </div>

                            {/* Options Dropdown Menu */}
                            <div className="relative shrink-0">
                              <button
                                onClick={() => setOpenMenu(openMenu === website.id ? null : website.id)}
                                className="p-1.5 rounded-lg border border-black/10 dark:border-[#262638] hover:bg-neutral-100 dark:hover:bg-[#1a1a26] text-neutral-500 hover:text-ink transition-colors cursor-pointer"
                                aria-label="Website actions menu"
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {openMenu === website.id && (
                                <div className="absolute right-0 top-8 bg-card dark:bg-[#161622] border-2 border-black dark:border-[#262638] rounded-2xl shadow-brutal z-30 py-1.5 min-w-44">
                                  <Link
                                    href={`/editor/${website.templateId}`}
                                    className="flex items-center gap-2.5 px-3.5 py-2 font-mono text-xs font-bold text-ink hover:bg-pink hover:text-black transition-colors"
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    <Edit3 size={13} />
                                    <span>Edit in Studio</span>
                                  </Link>

                                  <Link
                                    href={`/live/${website.subdomain}`}
                                    target="_blank"
                                    className="flex items-center gap-2.5 px-3.5 py-2 font-mono text-xs font-bold text-ink hover:bg-pink hover:text-black transition-colors"
                                    onClick={() => setOpenMenu(null)}
                                  >
                                    <ExternalLink size={13} />
                                    <span>Visit Live Site</span>
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleCopyUrl(website.id, website.subdomain);
                                      setOpenMenu(null);
                                    }}
                                    className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 font-mono text-xs font-bold text-ink hover:bg-yellow hover:text-black transition-colors cursor-pointer"
                                  >
                                    <Copy size={13} />
                                    <span>Copy URL</span>
                                  </button>

                                  <div className="my-1 border-t border-black/10 dark:border-[#262638]" />

                                  <button
                                    type="button"
                                    disabled={deletingId === website.id}
                                    onClick={() => handleDelete(website.id)}
                                    className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 font-mono text-xs font-bold text-red-600 hover:bg-red-500 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    {deletingId === website.id ? (
                                      <Loader2 size={13} className="animate-spin" />
                                    ) : (
                                      <Trash2 size={13} />
                                    )}
                                    <span>Delete Site</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Strip with real metadata */}
                      <div className="px-4 sm:px-5 py-2.5 border-t-2 border-black/10 dark:border-[#262638] flex items-center justify-between font-mono text-xs text-neutral-500 bg-background/50 dark:bg-[#0c0c14]">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          <span>{formatDate(website.updatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-bold text-black dark:text-white">
                          <TrendingUp size={12} className="text-pink stroke-[2.5]" />
                          <span>{website.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Discover New Templates Shelf */}
          <div className="pt-6 border-t-2 border-black/10 dark:border-[#262638]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 mb-4">
              <div className="min-w-0">
                <h2 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
                  Explore Templates
                </h2>
                <p className="font-mono text-xs text-neutral-500 mt-0.5">
                  Ready to customize and deploy live in your visual studio workspace.
                </p>
              </div>
              <Link 
                href="/templates" 
                className="font-mono text-xs font-black uppercase text-pink hover:underline inline-flex items-center gap-1 shrink-0 whitespace-nowrap self-start sm:self-auto"
              >
                <span>View all ({TEMPLATES.length})</span>
                <ChevronRight size={14} className="shrink-0" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TEMPLATES.slice(0, 4).map((tmpl) => {
                const isDark = tmpl.bgColor?.startsWith('#0') || tmpl.bgColor?.startsWith('#1') || tmpl.textColor === '#FFFFFF';

                return (
                  <Link
                    key={tmpl.id}
                    href={`/editor/${tmpl.id}`}
                    className="group rounded-2xl overflow-hidden border-2 border-black dark:border-[#262638] hover:shadow-brutal-sm transition-all bg-card flex flex-col justify-between hover:-translate-y-0.5"
                  >
                    <div 
                      className="h-32 relative flex flex-col justify-between p-3.5 border-b-2 border-black dark:border-[#262638] overflow-hidden" 
                      style={{ 
                        backgroundColor: isDark ? '#0e0f17' : (tmpl.bgColor || '#FAF9F6'),
                      }}
                    >
                      {/* Ambient Accent Glow for Dark Templates */}
                      {isDark && (
                        <div 
                          className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none"
                          style={{ backgroundColor: tmpl.accent || '#FF5500' }}
                        />
                      )}

                      {/* Top micro badges */}
                      <div className="flex items-center justify-between relative z-10">
                        <span 
                          className="font-mono text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-black/30 bg-white/20 dark:bg-black/40 backdrop-blur-xs"
                          style={{ color: isDark ? '#FFFFFF' : '#171717' }}
                        >
                          {tmpl.category}
                        </span>
                        <span className={cn(
                          "font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-black shadow-2xs",
                          tmpl.isPro ? "bg-yellow text-black" : "bg-mint text-black"
                        )}>
                          {tmpl.isPro ? "PRO" : "FREE"}
                        </span>
                      </div>

                      {/* Center headline */}
                      <div className="my-auto relative z-10 py-1">
                        <div 
                          className="font-display font-black text-sm tracking-tight leading-tight line-clamp-1"
                          style={{ color: isDark ? '#FFFFFF' : '#171717' }}
                        >
                          {tmpl.name}
                        </div>
                        <div 
                          className="font-mono text-[10px] opacity-70 line-clamp-1 mt-0.5"
                          style={{ color: isDark ? '#E2E8F0' : '#525252' }}
                        >
                          {tmpl.tags?.slice(0, 2).map(t => `#${t}`).join(' ')}
                        </div>
                      </div>

                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 backdrop-blur-2xs">
                        <span className="brutal-press bg-pink text-black text-[11px] font-display font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-black shadow-brutal-xs flex items-center gap-1">
                          Use Template →
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-card dark:bg-[#12121a] flex items-center justify-between gap-2 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-black text-xs text-black dark:text-white truncate" title={tmpl.name}>
                          {tmpl.name}
                        </div>
                        <div className="font-mono text-[9px] sm:text-[10px] text-pink font-bold uppercase truncate mt-0.5">
                          {tmpl.category}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-neutral-400 group-hover:text-pink transition-colors shrink-0 whitespace-nowrap pl-1">
                        Launch ↗
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
