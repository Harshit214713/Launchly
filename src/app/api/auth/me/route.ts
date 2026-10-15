import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { findUserByEmail } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('launchly_session');

  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // Cryptographically verify HMAC signature and expiration
  const session = verifySessionToken(sessionCookie.value);
  if (!session || !session.email) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const freshUser = await findUserByEmail(session.email);
    if (freshUser) {
      const { id, name, email, plan, createdAt, avatar } = freshUser;
      return NextResponse.json({
        authenticated: true,
        user: { id, name, email, plan, createdAt, avatar },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        name: session.name,
        email: session.email,
        plan: session.plan,
        createdAt: session.createdAt,
        avatar: session.avatar,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
