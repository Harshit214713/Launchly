import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSitesForUser, getAllSites, deleteSite } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedSubdomain = searchParams.get('subdomain');
    const requestedUserId = searchParams.get('userId');
    const showAll = searchParams.get('all') === 'true';

    if (requestedSubdomain) {
      const allSites = await getAllSites();
      const site = allSites.find(s => s.subdomain.toLowerCase() === requestedSubdomain.toLowerCase());
      return NextResponse.json({ success: true, site, found: !!site });
    }

    if (showAll) {
      const sites = await getAllSites();
      return NextResponse.json({ success: true, sites, total: sites.length });
    }

    let userId = requestedUserId;
    if (!userId) {
      const cookieStore = await cookies();
      const userCookie = cookieStore.get('launchly_user');
      if (userCookie?.value) {
        try {
          const u = JSON.parse(userCookie.value);
          if (u?.id) userId = u.id;
        } catch {}
      }
    }

    if (!userId) {
      return NextResponse.json({ success: true, sites: [], total: 0 });
    }

    const sites = await getSitesForUser(userId);
    return NextResponse.json({
      success: true,
      sites,
      total: sites.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve websites.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Site ID is required.' },
        { status: 400 }
      );
    }
    await deleteSite(id);
    return NextResponse.json({ success: true, message: 'Website deleted successfully.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete website.' },
      { status: 500 }
    );
  }
}
