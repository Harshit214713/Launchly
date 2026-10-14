import { NextResponse } from 'next/server';
import { createUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, plan = 'free' } = await request.json();

    const result = await createUser(name, email, password, plan);
    if (!result.success || !result.user) {
      return NextResponse.json(result, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });

    // Set auth cookie
    response.cookies.set('launchly_user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error during signup.' },
      { status: 500 }
    );
  }
}
