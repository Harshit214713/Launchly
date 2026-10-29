import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { saveDraftSite } from '@/lib/db';
import { getSitesForUser } from '@/lib/db';
import type { SiteDocument } from '@/lib/siteDocument';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('launchly_session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session?.id) return NextResponse.json({ success: false, message: 'Sign in to load this draft.' }, { status: 401 });
    const subdomain = new URL(request.url).searchParams.get('subdomain')?.toLowerCase();
    if (!subdomain) return NextResponse.json({ success: false, message: 'A site address is required.' }, { status: 400 });
    const site = (await getSitesForUser(session.id)).find((entry) => entry.subdomain.toLowerCase() === subdomain);
    if (!site) return NextResponse.json({ success: true, document: null });
    const siteData = site.siteData || {};
    const draft = siteData.draftDocument && typeof siteData.draftDocument === 'object' ? siteData.draftDocument : siteData;
    return NextResponse.json({ success: true, document: draft });
  } catch (error) {
    console.error('Draft load error:', error);
    return NextResponse.json({ success: false, message: 'We could not load this draft.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('launchly_session')?.value;
    const session = token ? verifySessionToken(token) : null;
    if (!session?.id) return NextResponse.json({ success: false, message: 'Sign in to save this draft.' }, { status: 401 });
    const body = await request.json() as { document?: SiteDocument };
    const document = body.document;
    if (!document || ![1, 2, 3, 4].includes(document.version) || !document.templateId || !document.name || !Array.isArray(document.pages) || document.pages.length === 0) {
      return NextResponse.json({ success: false, message: 'The site document is incomplete or has an unsupported version.' }, { status: 400 });
    }
    const result = await saveDraftSite(document.templateId, document.name, document.settings.subdomain, session.id, document as unknown as Record<string, unknown>);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error('Draft save error:', error);
    return NextResponse.json({ success: false, message: 'We could not save this draft. It remains available in this browser.' }, { status: 500 });
  }
}
