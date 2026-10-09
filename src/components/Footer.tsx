'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { GitBranch, ArrowUpRight } from 'lucide-react';

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
      sessionStorage.setItem('launchly_scroll_target', sectionId);
      router.push('/');
    }
  };

  return (
    <footer className="bg-white border-t border-[#E8E6E0] py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand mark & copyright */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#0F0F11] overflow-hidden flex items-center justify-center shadow-2xs group-hover:shadow-[0_0_12px_rgba(255,85,0,0.35)] transition-all">
              <Image
                src="/logo-icon.png"
                alt="Launchly Emblem"
                width={28}
                height={28}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <Image
              src="/logo-text-dark.png"
              alt="LAUNCHLY"
              width={744}
              height={66}
              className="h-3.5 w-auto object-contain"
            />
            <span className="sr-only">LAUNCHLY</span>
          </Link>
          <span className="text-xs text-[#8A8A8A]">© 2026 Launchly, Inc.</span>
        </div>

        {/* Compact Clean Navigation Links without # fragments or extensions */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#525252]">
          <Link href="/templates" className="hover:text-[#FF5500] transition-colors">
            Templates
          </Link>
          <a
            href="/#how-it-works"
            onClick={(e) => handleScrollSection(e, 'how-it-works')}
            className="hover:text-[#FF5500] transition-colors cursor-pointer"
          >
            How it works
          </a>
          <a
            href="/#pricing"
            onClick={(e) => handleScrollSection(e, 'pricing')}
            className="hover:text-[#FF5500] transition-colors cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="/#faq"
            onClick={(e) => handleScrollSection(e, 'faq')}
            className="hover:text-[#FF5500] transition-colors cursor-pointer"
          >
            FAQ
          </a>
          <Link href="/dashboard" className="hover:text-[#FF5500] transition-colors flex items-center gap-0.5">
            <span>Studio</span>
            <ArrowUpRight size={11} className="text-[#8A8A8A]" />
          </Link>
        </nav>

        {/* Status dot and socials */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#737373]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
            <span>Edge Ready</span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="https://twitter.com/launchly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E8E6E0] flex items-center justify-center text-[#525252] hover:text-[#FF5500] hover:border-[#FF5500]/30 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com/launchly"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-7 h-7 rounded-lg bg-[#FAF9F6] border border-[#E8E6E0] flex items-center justify-center text-[#525252] hover:text-[#FF5500] hover:border-[#FF5500]/30 transition-colors"
            >
              <GitBranch size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
