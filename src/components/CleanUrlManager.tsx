'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { scrollToSection } from '@/lib/navigation';

export default function CleanUrlManager() {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Clean hash immediately on mount or navigation & handle scroll targets
  useEffect(() => {
    // If a hash exists in the URL (e.g. user typed /#how-it-works or followed an external link), clean it
    if (window.location.hash) {
      const targetId = window.location.hash.replace(/^#/, '');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);

      if (targetId) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 60);
        });
      }
    }

    // If an inter-page navigation set a scroll target (e.g. from /dashboard to /)
    if (pathname === '/') {
      try {
        const storedTarget = sessionStorage.getItem('launchly_scroll_target');
        if (storedTarget) {
          sessionStorage.removeItem('launchly_scroll_target');
          setTimeout(() => {
            const el = document.getElementById(storedTarget);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      } catch (_) {}
    }

    // Hashchange listener to prevent browser from keeping hashes in the address bar
    const handleHashChange = () => {
      if (window.location.hash) {
        const targetId = window.location.hash.replace(/^#/, '');
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        if (targetId) {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  // 2. Global click interceptor for any anchor tags with href="#..." or href="/#..."
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Matches #section or /#section
      if (href.startsWith('#') || href.startsWith('/#')) {
        const targetId = href.replace(/^(\/)?#/, '');
        if (targetId) {
          e.preventDefault();
          scrollToSection(targetId, router, pathname);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => document.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [pathname, router]);

  return null;
}
