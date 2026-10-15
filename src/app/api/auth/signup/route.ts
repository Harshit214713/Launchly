import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const ip = getClientIp(request);
    const rl = rateLimit(`signup:${ip}`, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many signup attempts. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { name, email, password, plan = 'free' } = await request.json();

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email address is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const result = await createUser(name.trim(), email.trim(), password, plan);
    if (!result.success || !result.user) {
      return NextResponse.json(result, { status: 400 });
    }

    // 2. Generate cryptographically signed session token
    const token = createSessionToken(result.user);

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });

    // 3. Set secure httpOnly cookie
    response.cookies.set('launchly_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Signup error:', error);
    const message = error instanceof Error ? error.message : 'Server error during signup.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
