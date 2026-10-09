import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('launchly_user');

  if (!userCookie?.value) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(userCookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
