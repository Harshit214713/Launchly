'use client';

const ANCHOR_ALIASES: Record<string, string[]> = {
  collection: ['collection', 'best-sellers', 'product-grid', 'products', 'shop'],
  products: ['products', 'collection', 'best-sellers', 'product-grid'],
  shop: ['shop', 'collection', 'best-sellers', 'product-grid'],
  'home-how-it-works': ['home-how-it-works', 'how-it-works', 'steps', 'process'],
  'home-recipes': ['home-recipes', 'recipes', 'recipe'],
  'home-story': ['home-story', 'story', 'about', 'mission'],
};

/** Keep user-entered anchors safe and consistent across editor and published pages. */
export function normalizeAnchorId(value: string) {
  return decodeURIComponent(String(value || ''))
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Resolve an anchor even when a template uses a semantic section id such as
 * `collection` while the document stores its generated id (`home-best-sellers`).
 */
export function findAnchorElement(value: string, root: ParentNode = document): Element | null {
  const requested = normalizeAnchorId(value);
  if (!requested) return null;

  const candidates = [requested, ...(ANCHOR_ALIASES[requested] || [])];
  for (const candidate of candidates) {
    const exact = root.querySelector(`#${CSS.escape(candidate)}, [data-anchor-id="${candidate}"], [data-section-id="${candidate}"]`);
    if (exact) return exact;
  }

  for (const candidate of candidates) {
    const partial = root.querySelector(`[data-section-id*="${candidate}" i], [data-anchor-aliases~="${candidate}"]`);
    if (partial) return partial;
  }

  return null;
}

/** Scroll to a local anchor without throwing when a custom link is stale. */
export function scrollToAnchor(value: string, root: ParentNode = document) {
  const target = findAnchorElement(value, root);
  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  return false;
}

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
    } catch {}

    if (router) {
      router.push('/');
    } else {
      // `replace` avoids leaving a duplicate intermediate entry in the browser history.
      window.location.replace('/');
    }
  }
}
