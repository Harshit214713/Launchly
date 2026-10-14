import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { findUserByEmail } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('launchly_user');

  if (!userCookie?.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const cachedUser = JSON.parse(userCookie.value);
    if (cachedUser?.email) {
      const freshUser = await findUserByEmail(cachedUser.email);
      if (freshUser) {
        const { passwordHash, ...safeUser } = freshUser;
        return NextResponse.json({ authenticated: true, user: safeUser });
      }
    }
    return NextResponse.json({ authenticated: true, user: cachedUser });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
