import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';
import { createSessionToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Rate limiting (brute force protection: 10 attempts per minute per IP)
    const ip = getClientIp(request);
    const rl = rateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const result = await verifyUser(String(email).trim(), String(password));
    if (!result.success || !result.user) {
      return NextResponse.json(result, { status: 401 });
    }

    // 2. Generate signed session token
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
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during login.' },
      { status: 500 }
    );
  }
}
