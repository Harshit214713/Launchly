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
  ArrowUpRight 
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) setUser(d.user);
      })
      .catch(() => {});
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
    if (pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      }
    } else {
      router.push(`/#${targetId}`);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-black dark:border-[#222232] bg-[#fdf2f8]/95 dark:bg-[#0b0b12]/95 backdrop-blur-md shadow-sm dark:shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Brand Logo & Title - Using 1st pic as logo icon & 2nd ss as wordmark */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-xl border-[2.5px] border-black dark:border-[#222232] bg-white dark:bg-[#161622] p-1.5 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0">
            <Image
              src="/brand-logo-clean.png"
              alt="Launchly"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <Image
                src="/brand-name-light.png"
                alt="LAUNCHLY"
                width={132}
                height={20}
                className="block dark:hidden h-[18px] sm:h-5 w-auto object-contain"
                priority
              />
              <Image
                src="/brand-name-dark.png"
                alt="LAUNCHLY"
                width={132}
                height={20}
                className="hidden dark:block h-[18px] sm:h-5 w-auto object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block font-mono text-[9px] font-black tracking-[0.16em] text-neutral-600 dark:text-neutral-400 uppercase mt-0.5">
              VISUAL WEB STUDIO
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/templates"
            className="brutal-press h-10 inline-flex items-center rounded-xl border-[2.5px] border-black bg-white px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-yellow transition-colors"
          >
            Templates
          </Link>
          <a
            href="#live-workspace"
            onClick={(e) => handleScrollTo(e, 'live-workspace')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-[2.5px] border-black bg-white px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-mint transition-colors"
          >
            Live Studio
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-[2.5px] border-black bg-white px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-lilac transition-colors"
          >
            How it works
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, 'pricing')}
            className="brutal-press h-10 inline-flex items-center rounded-xl border-[2.5px] border-black bg-white px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-pink transition-colors"
          >
            Pricing
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* GitHub Repo Link (Desktop & Tablet) */}
          <a
            href="https://github.com/simplyvardaan/Launchly"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Launchly GitHub Repository"
            className="brutal-press hidden sm:flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-[2.5px] border-black bg-white dark:bg-[#161622] text-black shadow-brutal-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer p-1.5"
            title="Star Launchly on GitHub"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub"
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </a>

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="brutal-press flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-[2.5px] border-black bg-yellow text-black shadow-brutal-sm cursor-pointer"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User Session or Auth Buttons */}
          {user ? (
            <Link
              href="/dashboard"
              className="brutal-press h-9 sm:h-10 flex items-center gap-2 rounded-xl border-[2.5px] border-black bg-white px-3 sm:px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm"
            >
              <span className="h-6 w-6 rounded-full border-2 border-black bg-mint text-black text-[10px] font-black flex items-center justify-center">
                {user.avatar || user.name.charAt(0)}
              </span>
              <span className="hidden sm:inline">Studio</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="brutal-press hidden md:inline-flex h-10 items-center rounded-xl border-[2.5px] border-black bg-white px-4 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm hover:bg-neutral-50"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="brutal-press hidden sm:inline-flex h-9 sm:h-10 items-center gap-1.5 rounded-xl border-[2.5px] border-black bg-pink px-3.5 sm:px-5 font-display text-xs sm:text-sm font-black text-black shadow-brutal-sm"
              >
                <span>Start free</span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden brutal-press flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border-[2.5px] border-black bg-white text-black shadow-brutal-sm cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t-[3px] border-black dark:border-[#222232] bg-white dark:bg-[#0d0d14] p-4 space-y-2 animate-in fade-in">
          <Link
            href="/templates"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl border-[2px] border-black bg-[#fdf2f8] px-4 py-2.5 font-display text-sm font-black text-black shadow-brutal-sm"
          >
            Browse Templates
          </Link>
          <a
            href="#live-workspace"
            onClick={(e) => handleScrollTo(e, 'live-workspace')}
            className="block rounded-xl border-[2px] border-black bg-mint/20 px-4 py-2.5 font-display text-sm font-black text-black shadow-brutal-sm"
          >
            Try Live Studio
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="block rounded-xl border-[2px] border-black bg-lilac/30 px-4 py-2.5 font-display text-sm font-black text-black shadow-brutal-sm"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, 'pricing')}
            className="block rounded-xl border-[2px] border-black bg-yellow/30 px-4 py-2.5 font-display text-sm font-black text-black shadow-brutal-sm"
          >
            Pricing & Plans
          </a>
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="text-center rounded-xl border-[2px] border-black bg-white py-2 font-display text-sm font-black text-black shadow-brutal-sm"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center rounded-xl border-[2px] border-black bg-pink py-2 font-display text-sm font-black text-black shadow-brutal-sm"
            >
              Start Free
            </Link>
          </div>
          <a
            href="https://github.com/simplyvardaan/Launchly"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl border-[2px] border-black bg-white dark:bg-[#161622] px-4 py-2 font-display text-xs font-black text-black dark:text-white shadow-brutal-sm hover:bg-neutral-50"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub"
              width={16}
              height={16}
              className="w-4 h-4 object-contain"
            />
            <span>Star Launchly on GitHub</span>
          </a>
        </div>
      )}
    </header>
  );
}
