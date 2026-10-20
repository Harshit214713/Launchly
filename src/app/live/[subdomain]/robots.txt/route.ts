import { NextRequest, NextResponse } from 'next/server';
import { getAllSites } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  const site = (await getAllSites()).find((entry) => entry.status === 'live' && entry.subdomain.toLowerCase() === subdomain.toLowerCase());
  if (!site) return new NextResponse('Not found', { status: 404 });
  const host = request.headers.get('host') || new URL(request.url).host;
  return new NextResponse(`User-agent: *\nAllow: /\nDisallow: /404\nSitemap: https://${host}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' } });
}
