import { getAllSites } from './db';

type PageSeo = { title?: string; description?: string; ogImage?: string; noindex?: boolean };
type DocumentPage = { id: string; slug: string; isHome: boolean; oldSlugs?: string[]; seo?: PageSeo };

export async function hasPublishedPage(subdomain: string, slug: string) {
  const site = (await getAllSites()).find((entry) => entry.status === 'live' && entry.subdomain.toLowerCase() === subdomain.toLowerCase());
  if (!site) return false;
  const data = site.siteData || {};
  const document = (data.document && typeof data.document === 'object' ? data.document : data) as { pages?: DocumentPage[] };
  const path = `/${slug.replace(/^\/+|\/+$/g, '')}`;
  return Boolean(document.pages?.some((page) => page.slug === path || page.oldSlugs?.includes(path)) || document.pages?.some((page) => page.slug === '/404' || page.id === '404' || page.seo?.title === '404'));
}

export async function getPublishedSlugRedirect(subdomain: string, slug: string) {
  const site = (await getAllSites()).find((entry) => entry.status === 'live' && entry.subdomain.toLowerCase() === subdomain.toLowerCase());
  if (!site) return null;
  const data = site.siteData || {};
  const document = (data.document && typeof data.document === 'object' ? data.document : data) as { pages?: DocumentPage[] };
  const path = `/${slug.replace(/^\/+|\/+$/g, '')}`;
  return document.pages?.find((page) => page.oldSlugs?.includes(path))?.slug || null;
}

export async function getPublishedPageMetadata(subdomain: string, slug = '') {
  const site = (await getAllSites()).find((entry) => entry.status === 'live' && entry.subdomain.toLowerCase() === subdomain.toLowerCase());
  if (!site) return { title: 'Website not found', robots: { index: false, follow: false } };
  const data = site.siteData || {};
  const document = (data.document && typeof data.document === 'object' ? data.document : data) as { pages?: DocumentPage[]; assets?: Array<{ role: string; src: string }> };
  const path = slug ? `/${slug.replace(/^\/+|\/+$/g, '')}` : '/';
  const matchedPage = document.pages?.find((entry) => entry.slug === path || (!slug && entry.isHome));
  const page = matchedPage || (slug ? document.pages?.find((entry) => entry.slug === '/404' || entry.id === '404' || entry.seo?.title === '404') : undefined);
  const title = page?.seo?.title || site.name;
  const description = page?.seo?.description || '';
  const favicon = document.assets?.find((asset) => asset.role === 'favicon')?.src;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: slug ? Boolean(matchedPage && !matchedPage.seo?.noindex) : !page?.seo?.noindex, follow: true },
    ...(favicon ? { icons: { icon: favicon } } : {}),
    openGraph: { title, description, type: 'website' as const, ...(page?.seo?.ogImage ? { images: [page.seo.ogImage] } : {}) },
  };
}
