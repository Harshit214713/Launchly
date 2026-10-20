import { NextRequest, NextResponse } from 'next/server';
import { getAllSites } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const site = (await getAllSites()).find((entry) => entry.status === 'live' && entry.subdomain.toLowerCase() === subdomain.toLowerCase());
  if (!site) return new NextResponse('Not found', { status: 404 });
  const data = site.siteData || {};
  const document = (data.document && typeof data.document === 'object' ? data.document : data) as { pages?: Array<{ slug: string; seo?: { noindex?: boolean } }> };
  const origin = new URL(request.url).origin;
  const urls = (document.pages || [{ slug: '/' }]).filter((page) => !page.seo?.noindex).map((page) => `<url><loc>${origin}${page.slug === '/' ? '' : page.slug}</loc></url>`).join('');
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' } });
}
