import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { publishSite } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { templateId, name, subdomain, siteData } = await request.json();

    if (!templateId || !subdomain) {
      return NextResponse.json(
        { success: false, message: 'Template ID and subdomain are required.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('launchly_user');
    let userId: string | undefined = undefined;
    if (userCookie?.value) {
      try {
        const u = JSON.parse(userCookie.value);
        if (u?.id) userId = u.id;
      } catch {}
    }

    const result = await publishSite(templateId, name, subdomain, userId, siteData);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal error deploying website.' },
      { status: 500 }
    );
  }
}
