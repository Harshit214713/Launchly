import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { publishSite } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`publish:${ip}`, 15, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many publish requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const { templateId, name, subdomain, siteData } = await request.json();

    if (!templateId || !subdomain) {
      return NextResponse.json(
        { success: false, message: 'Template ID and subdomain are required.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('launchly_session');
    let userId: string | undefined = undefined;

    if (sessionCookie?.value) {
      const session = verifySessionToken(sessionCookie.value);
      if (session?.id) {
        userId = session.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Please sign in or create an account to publish and claim this website subdomain.' },
        { status: 401 }
      );
    }

    const result = await publishSite(templateId, name, subdomain, userId, siteData);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error('Publish error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal error deploying website.' },
      { status: 500 }
    );
  }
}
