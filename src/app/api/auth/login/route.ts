import { NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const result = verifyUser(email, password);
    if (!result.success || !result.user) {
      return NextResponse.json(result, { status: 401 });
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
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error during login.' },
      { status: 500 }
    );
  }
}
