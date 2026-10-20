'use client';

/**
 * Smoothly scrolls to a target section on the home page without exposing
 * unsightly '#' hashes in the browser address bar.
 */
export function scrollToSection(
  targetId: string,
  router?: { push: (url: string) => void },
  pathname?: string
) {
  if (typeof window === 'undefined') return;

  const currentPath = pathname || window.location.pathname;

  if (currentPath === '/') {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Purge any lingering hash from the address bar immediately
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } else {
    // Stash intended section in session storage and navigate cleanly to '/'
    try {
      sessionStorage.setItem('launchly_scroll_target', targetId);
    } catch (_) {}

    if (router) {
      router.push('/');
    } else {
      window.location.href = '/';
    }
  }
}
