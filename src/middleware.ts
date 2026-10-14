import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Exclude API routes, Next.js internal assets, and static files
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check for custom subdomain e.g. agenn-ai.launchly.site or agenn-ai.localhost:3000
  const isCustomSubdomain =
    (host.includes('.launchly.site') && !host.startsWith('www.') && !host.startsWith('launchly.site')) ||
    (host.includes('.localhost') && !host.startsWith('www.'));

  if (isCustomSubdomain) {
    const subdomain = host.split('.')[0]?.toLowerCase();
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'launchly' && subdomain !== 'www') {
      // If user is accessing the root or a subpath of their hosted site, rewrite to /live/[subdomain]
      if (!url.pathname.startsWith('/live/')) {
        url.pathname = `/live/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
