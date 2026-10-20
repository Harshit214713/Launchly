'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import BrandWordmark from './BrandWordmark';

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
            <div className="h-10 w-10 rounded-xl border-[2.5px] border-ink bg-white dark:bg-[#151726] p-1.5 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6 shrink-0">
              <Image
                src="/brand-logo-clean.png"
                alt="Launchly"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <BrandWordmark size="md" />
          </Link>

          {/* Navigation Links - Single clean row with proper spacing */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 font-mono text-xs font-bold uppercase tracking-wider text-ink">
            <Link href="/templates" className="hover:text-pink transition-colors">
              Templates
            </Link>
            <a
              href="/"
              onClick={(e) => handleScrollSection(e, 'live-workspace')}
              className="hover:text-pink transition-colors cursor-pointer"
            >
              Live Studio
            </a>
            <a
              href="/"
              onClick={(e) => handleScrollSection(e, 'how-it-works')}
              className="hover:text-pink transition-colors cursor-pointer"
            >
              How it works
            </a>
            <a
              href="/"
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
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/simplyvardaan/Launchly"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="brutal-press h-8 w-8 rounded-xl border-2 border-ink bg-card flex items-center justify-center text-ink shadow-brutal-sm hover:bg-neutral-100 dark:hover:bg-[#202030] cursor-pointer transition-colors"
                title="GitHub Repository"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Meta */}
        <div className="flex items-center justify-center text-center font-mono text-xs text-muted-foreground pt-4">
          <p>© 2026 Launchly, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
