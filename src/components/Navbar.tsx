'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowUpRight,
  LayoutGrid,
  Sliders,
  CreditCard,
  ChevronRight,
  Star,
  Layers
} from 'lucide-react';
import BrandWordmark from './BrandWordmark';
import { scrollToSection } from '@/lib/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [githubStars, setGithubStars] = useState<number>(5);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      requestAnimationFrame(() => setIsDark(true));
    }
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) setUser(d.user);
      })
      .catch(() => { });

    // Fetch live stars from GitHub repository
    fetch('https://api.github.com/repos/simplyvardaan/Launchly')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.stargazers_count === 'number') {
          setGithubStars(data.stargazers_count);
        }
      })
      .catch(() => { });
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    scrollToSection(targetId, router, pathname);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-[2.5px] border-black dark:border-[#26283d] bg-[#FAF8F5]/90 dark:bg-[#0A0B12]/90 backdrop-blur-md shadow-xs dark:shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-colors">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 py-0.5">
          <div className="h-10 w-10 rounded-xl border-[2.5px] border-black dark:border-[#26283d] bg-white dark:bg-[#151726] p-1.5 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0">
            <Image
              src="/brand-logo-clean.png"
              alt="Launchly"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <BrandWordmark size="md" />
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/templates"
            className="brutal-press h-10 inline-flex items-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-yellow hover:text-black dark:hover:bg-yellow dark:hover:text-black dark:hover:border-black transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, 'live-workspace')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-mint hover:text-black dark:hover:bg-mint dark:hover:text-black dark:hover:border-black transition-colors cursor-pointer"
          >
            Live Studio
          </Link>
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-lilac hover:text-black dark:hover:bg-lilac dark:hover:text-black dark:hover:border-black transition-colors cursor-pointer"
          >
            How it works
          </Link>
          <Link
            href="/"
            onClick={(e) => handleScrollTo(e, 'pricing')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-pink hover:text-black dark:hover:bg-pink dark:hover:text-black dark:hover:border-black transition-colors cursor-pointer"
          >
            Pricing
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="brutal-press flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black dark:border-[#26283d] bg-yellow dark:bg-[#1C1C2A] text-black dark:text-yellow shadow-brutal-sm cursor-pointer transition-colors"
          >
            {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* User Session or Auth Buttons */}
          {user ? (
            <Link
              href="/dashboard"
              className="brutal-press h-10 flex items-center gap-2 rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-3 sm:px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-neutral-50 dark:hover:bg-[#202030] transition-colors"
            >
              <span className="h-6 w-6 rounded-full border border-black bg-mint text-black text-[10px] font-black flex items-center justify-center">
                {user.avatar || user.name.charAt(0)}
              </span>
              <span className="hidden sm:inline">Studio</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="brutal-press hidden md:inline-flex h-10 items-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-4 font-display text-xs sm:text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-neutral-50 dark:hover:bg-[#202030] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="brutal-press hidden sm:inline-flex h-10 items-center gap-1.5 rounded-xl border-2 border-black dark:border-[#26283d] bg-pink px-4 sm:px-5 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-pink/90 transition-colors"
              >
                <span>Start free</span>
                <ArrowUpRight className="h-4 w-4 stroke-[3]" />
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden brutal-press flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] text-black dark:text-[#F4F4F8] shadow-brutal-sm cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={19} className="stroke-[2.5]" /> : <Menu size={19} className="stroke-[2.5]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-black dark:border-[#26283d] bg-[#FAF8F5] dark:bg-[#0c0d16] p-3.5 sm:p-5 animate-in slide-in-from-top-2 fade-in duration-200 transition-colors shadow-2xl">
          <div className="max-w-md mx-auto space-y-2">
            {/* Nav Card 1: Templates */}
            <Link
              href="/templates"
              onClick={() => setMobileOpen(false)}
              className="brutal-press flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#141524] shadow-brutal-sm hover:border-pink dark:hover:border-pink/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl border-2 border-black bg-yellow text-black flex items-center justify-center shadow-brutal-xs shrink-0 group-hover:rotate-6 transition-transform">
                  <LayoutGrid size={18} />
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-sm text-black dark:text-[#F4F4F8]">
                    Browse Templates
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    25+ production-ready SaaS starters
                  </span>
                </div>
              </div>
              <ChevronRight size={17} className="text-neutral-400 group-hover:text-pink group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            {/* Nav Card 2: Live Studio */}
            <Link
              href="/"
              onClick={(e) => handleScrollTo(e, 'live-workspace')}
              className="brutal-press flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#141524] shadow-brutal-sm hover:border-mint dark:hover:border-mint/70 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl border-2 border-black bg-mint text-black flex items-center justify-center shadow-brutal-xs shrink-0 group-hover:rotate-6 transition-transform">
                  <Sliders size={18} />
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-sm text-black dark:text-[#F4F4F8]">
                    Try Live Studio
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    Interactive code sandbox &amp; live preview
                  </span>
                </div>
              </div>
              <ChevronRight size={17} className="text-neutral-400 group-hover:text-mint group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            {/* Nav Card 3: How It Works */}
            <Link
              href="/"
              onClick={(e) => handleScrollTo(e, 'how-it-works')}
              className="brutal-press flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#141524] shadow-brutal-sm hover:border-lilac dark:hover:border-lilac/70 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl border-2 border-black bg-lilac text-black flex items-center justify-center shadow-brutal-xs shrink-0 group-hover:rotate-6 transition-transform">
                  <Layers size={18} />
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-sm text-black dark:text-[#F4F4F8]">
                    How It Works
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    3 simple steps from concept to launch
                  </span>
                </div>
              </div>
              <ChevronRight size={17} className="text-neutral-400 group-hover:text-lilac group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            {/* Nav Card 4: Pricing */}
            <Link
              href="/"
              onClick={(e) => handleScrollTo(e, 'pricing')}
              className="brutal-press flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#141524] shadow-brutal-sm hover:border-pink dark:hover:border-pink/70 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-xl border-2 border-black bg-pink text-black flex items-center justify-center shadow-brutal-xs shrink-0 group-hover:rotate-6 transition-transform">
                  <CreditCard size={18} />
                </span>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-sm text-black dark:text-[#F4F4F8]">
                    Pricing &amp; Plans
                  </span>
                  <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                    Free starter &amp; lifetime commercial access
                  </span>
                </div>
              </div>
              <ChevronRight size={17} className="text-neutral-400 group-hover:text-pink group-hover:translate-x-1 transition-all shrink-0" />
            </Link>

            {/* Account / Action Buttons */}
            {user ? (
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="brutal-press w-full h-11 rounded-xl border-2 border-black dark:border-[#26283d] bg-mint text-black font-display text-sm font-black uppercase tracking-wider shadow-brutal-sm flex items-center justify-center gap-2"
                >
                  <span>Open Studio Dashboard</span>
                  <ArrowUpRight size={16} className="stroke-[3]" />
                </Link>
              </div>
            ) : (
              <div className="pt-2 grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="brutal-press h-11 rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#151726] font-display text-sm font-black text-black dark:text-[#F4F4F8] shadow-brutal-sm hover:bg-neutral-50 dark:hover:bg-[#1f2136] flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="brutal-press h-11 rounded-xl border-2 border-black dark:border-[#26283d] bg-pink hover:bg-yellow font-display text-sm font-black text-black shadow-brutal-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Start Free</span>
                  <ArrowUpRight size={15} className="stroke-[3]" />
                </Link>
              </div>
            )}

            {/* GitHub Community Pill */}
            <a
              href="https://github.com/simplyvardaan/Launchly"
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-press flex items-center justify-between rounded-xl border-2 border-black dark:border-[#26283d] bg-white dark:bg-[#141524] px-3.5 py-2.5 font-display text-xs font-black text-black dark:text-white shadow-brutal-xs hover:border-black dark:hover:border-neutral-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/github-logo.png"
                  alt="GitHub"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain dark:invert"
                />
                <span>Star Launchly on GitHub</span>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow/20 dark:bg-yellow/15 text-neutral-800 dark:text-yellow border border-yellow/50">
                <Star size={10} className="fill-current text-yellow-500 dark:text-yellow" />
                <span>{githubStars}</span>
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
