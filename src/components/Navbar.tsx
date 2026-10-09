'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Sparkles, 
  Compass, 
  Layers, 
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLinkItem {
  label: string;
  sectionId?: string;
  href: string;
  badge?: string;
  icon: typeof Compass;
}

const NAV_LINKS: NavLinkItem[] = [
  { href: '/templates', label: 'Templates', badge: '12+', icon: Compass },
  { href: '/#how-it-works', sectionId: 'how-it-works', label: 'How it Works', icon: Zap },
  { href: '/#pricing', sectionId: 'pricing', label: 'Pricing', icon: Sparkles },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  // Clean URL handler: scrolls to target without leaving #fragment or .html in address bar
  useEffect(() => {
    // If URL contains a hash, strip it cleanly
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
      window.history.replaceState(null, '', window.location.pathname);
    }

    const pending = sessionStorage.getItem('launchly_scroll_target');
    if (pending) {
      sessionStorage.removeItem('launchly_scroll_target');
      setTimeout(() => {
        const el = document.getElementById(pending);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
        window.history.replaceState(null, '', '/');
      }, 150);
    }
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLinkItem) => {
    if (link.sectionId) {
      e.preventDefault();
      if (pathname === '/') {
        const el = document.getElementById(link.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // Ensure address bar stays purely localhost:3000 without #fragment
          window.history.replaceState(null, '', '/');
        }
      } else {
        sessionStorage.setItem('launchly_scroll_target', link.sectionId);
        router.push('/');
      }
      setMobileOpen(false);
    }
  };

  // Scroll listener for sticky contraction & auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > 120) {
        setVisible(currentY < lastScrollY.current);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating Island Navigation Container */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none px-3 sm:px-6 pt-3 sm:pt-4',
          visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        )}
      >
        <div
          className={cn(
            'pointer-events-auto max-w-5xl mx-auto transition-all duration-300 relative',
            scrolled
              ? 'bg-[#FAF9F6]/90 backdrop-blur-xl border border-[#171717]/10 shadow-[0_12px_36px_-6px_rgba(255,85,0,0.06),0_2px_8px_rgba(0,0,0,0.04)] px-3.5 sm:px-4 py-2 rounded-2xl sm:rounded-full'
              : 'bg-[#FAF9F6]/75 backdrop-blur-md border border-[#E8E6E0]/95 shadow-[0_4px_24px_-2px_rgba(0,0,0,0.03)] px-4 sm:px-5 py-2.5 rounded-2xl sm:rounded-full'
          )}
        >
          {/* Subtle top edge specular highlight */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/20 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Brand Logo & Live Status Capsule */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                {/* Official Launchly Logo & Wordmark matching photo */}
                <div className="w-8 h-8 rounded-xl bg-[#0F0F11] flex items-center justify-center p-0.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,85,0,0.5)] overflow-hidden border border-black/10">
                  <Image
                    src="/logo-icon.png"
                    alt="Launchly Emblem"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-lg"
                    priority
                  />
                </div>

                <div className="flex items-center pl-0.5">
                  <Image
                    src="/logo-text-dark.png"
                    alt="LAUNCHLY"
                    width={744}
                    height={66}
                    className="h-3.5 sm:h-4 w-auto object-contain transition-opacity group-hover:opacity-90"
                    priority
                  />
                  <span className="sr-only">LAUNCHLY</span>
                </div>
              </Link>
            </div>

            {/* Desktop Pill Center Navigation with Clean Scrolling */}
            <nav className="hidden md:flex items-center bg-[#171717]/[0.03] border border-[#171717]/[0.05] p-1 rounded-full shadow-inner">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="group relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-[13px] font-medium text-[#525252] hover:text-[#171717] rounded-full hover:bg-white hover:shadow-xs transition-all duration-200"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="bg-[#FF5500] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-black/5 shadow-xs group-hover:scale-105 transition-transform">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions: Login, & Start Free CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* User Session Action */}
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 pl-2 pr-3.5 py-1 rounded-full bg-[#171717] text-white text-xs font-semibold hover:bg-[#262626] transition-colors shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF5500] text-white text-[10px] font-black flex items-center justify-center">
                    {user.avatar || user.name.charAt(0)}
                  </span>
                  <span className="truncate max-w-[90px]">{user.name.split(' ')[0]}</span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:inline-block text-xs sm:text-[13px] font-medium text-[#525252] hover:text-[#171717] px-2.5 py-1.5 rounded-full hover:bg-[#171717]/[0.04] transition-colors"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/signup"
                    className="group relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-semibold bg-[#FF5500] hover:bg-[#E04800] text-white overflow-hidden shadow-xs hover:shadow-md hover:shadow-[#FF5500]/25 transition-all duration-200 active:scale-95"
                  >
                    <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    <span>Start free</span>
                    <ArrowUpRight
                      size={14}
                      className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                    />
                  </Link>
                </>
              )}

              {/* Mobile hamburger button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 text-[#525252] hover:text-[#171717] rounded-full hover:bg-[#171717]/[0.05] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Card */}
        {mobileOpen && (
          <div className="pointer-events-auto md:hidden max-w-5xl mx-auto mt-2 p-3 bg-[#FAF9F6]/95 backdrop-blur-2xl border border-[#171717]/10 rounded-2xl shadow-xl space-y-1 animate-scale-in">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-[#262626] hover:text-black rounded-xl hover:bg-white hover:shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className="text-[#8A8A8A]" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-[#FF5500] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#E8E6E0] grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-[#171717] bg-white border border-[#E8E6E0] rounded-xl hover:bg-[#F5F4F0] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#FF5500] hover:bg-[#E04800] rounded-xl transition-colors shadow-xs"
              >
                Start free
              </Link>
            </div>
          </div>
        )}
      </header>

    </>
  );
}
