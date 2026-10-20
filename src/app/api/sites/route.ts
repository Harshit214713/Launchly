import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSitesForUser, getAllSites, deleteSite } from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('launchly_session');
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedSubdomain = searchParams.get('subdomain');
    const requestedUserId = searchParams.get('userId');

    // 1. Public lookup for published site by subdomain
    if (requestedSubdomain) {
      const allSites = await getAllSites();
      const site = allSites.find(s => s.status === 'live' && s.subdomain.toLowerCase() === requestedSubdomain.toLowerCase());
      return NextResponse.json({ success: true, site, found: !!site });
    }

    // 2. Fetch authenticated session
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to view websites.', sites: [], total: 0 },
        { status: 401 }
      );
    }

    // 3. Prevent IDOR: users cannot snoop on other users' sites
    const targetUserId = session.id;
    if (requestedUserId && requestedUserId !== session.id) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. You cannot view websites belonging to another user.' },
        { status: 403 }
      );
    }

    const sites = await getSitesForUser(targetUserId);
    return NextResponse.json({
      success: true,
      sites,
      total: sites.length,
    });
  } catch (err: unknown) {
    console.error('Error in /api/sites GET:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve websites.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. You must be signed in to delete websites.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Site ID is required.' },
        { status: 400 }
      );
    }

    // Delete with strict ownership verification
    const result = await deleteSite(id, session.id);
    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json({ success: true, message: 'Website deleted successfully.' });
  } catch (err: unknown) {
    console.error('Error in /api/sites DELETE:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to delete website.' },
      { status: 500 }
    );
  }
}
