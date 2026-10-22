import { normalizeAnchorId } from './navigation.ts';

type NavigationPage = { id: string; title: string; slug?: string; isHome?: boolean };
type NavigationItem = { target: { type: 'page' | 'url' | 'anchor'; value: string } };

function normalizePagePath(value: string | undefined): string {
  const clean = String(value || '').trim().replace(/^\/+|\/+$/g, '');
  return clean ? `/${clean}` : '/';
}

export function resolveLiveNavigationHref(
  item: NavigationItem,
  pages: NavigationPage[],
  subdomain: string,
  preview: boolean,
): string {
  const previewSuffix = preview ? '?preview=1' : '';
  if (item.target.type === 'url') return item.target.value;
  if (item.target.type === 'anchor') {
    return `/live/${encodeURIComponent(subdomain)}${previewSuffix}#${normalizeAnchorId(item.target.value)}`;
  }

  const requested = item.target.value.replace(/^\/+|\/+$/g, '');
  const page = pages.find((entry) =>
    entry.id === item.target.value
    || entry.id === requested
    || normalizePagePath(entry.slug) === normalizePagePath(requested)
    || entry.title.toLowerCase() === requested.toLowerCase(),
  );
  const pagePath = page?.isHome ? '' : normalizePagePath(page?.slug || requested);
  return `/live/${encodeURIComponent(subdomain)}${pagePath}${previewSuffix}`;
}
