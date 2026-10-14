'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { GitBranch, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleScrollSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', '/');
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <footer className="bg-card border-t-[3px] border-ink py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Tier */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-ink/10 dark:border-[#222232]">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-10 w-10 rounded-xl border-[2.5px] border-ink bg-white dark:bg-[#161622] p-1.5 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0">
              <Image
                src="/brand-logo-clean.png"
                alt="Launchly"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center">
                <Image
                  src="/brand-name-light.png"
                  alt="LAUNCHLY"
                  width={132}
                  height={20}
                  className="block dark:hidden h-5 w-auto object-contain"
                />
                <Image
                  src="/brand-name-dark.png"
                  alt="LAUNCHLY"
                  width={132}
                  height={20}
                  className="hidden dark:block h-5 w-auto object-contain"
                />
              </div>
              <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-muted-foreground uppercase mt-0.5">
                VISUAL WEB STUDIO
              </span>
            </div>
          </Link>

          {/* Navigation Links - Single clean row with proper spacing */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-mono text-xs font-bold uppercase tracking-wider text-ink">
            <Link href="/templates" className="hover:text-pink transition-colors">
              Templates
            </Link>
            <a
              href="#live-workspace"
              onClick={(e) => handleScrollSection(e, 'live-workspace')}
              className="hover:text-pink transition-colors cursor-pointer"
            >
              Live Studio
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScrollSection(e, 'how-it-works')}
              className="hover:text-pink transition-colors cursor-pointer"
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleScrollSection(e, 'pricing')}
              className="hover:text-pink transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <Link href="/dashboard" className="hover:text-pink transition-colors inline-flex items-center gap-1">
              <span>Studio</span>
              <ArrowUpRight size={12} className="stroke-[3]" />
            </Link>
          </nav>

          {/* Status & Socials */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <a
                href="https://twitter.com/launchly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="brutal-press h-8 w-8 rounded-xl border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm hover:bg-yellow cursor-pointer"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com/simplyvardaan/Launchly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="brutal-press h-8 w-8 rounded-xl border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm hover:bg-neutral-100 cursor-pointer p-1.5 overflow-hidden"
              >
                <Image
                  src="/github-logo.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-mono text-xs text-muted-foreground">
          <p>© 2026 Launchly, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
