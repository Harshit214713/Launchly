import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId')?.trim();
    const emailParam = searchParams.get('email')?.trim();

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('launchly_session');
    const sessionUser = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null;

    const targetEmail = sessionUser?.email || emailParam;

    if (!sessionId && !targetEmail) {
      return NextResponse.json(
        { success: false, verified: false, message: 'Session ID or email required.' },
        { status: 400 }
      );
    }

    // 1. Check if payment exists by transaction ID / session ID
    if (sessionId) {
      const { data: payment } = await supabaseAdmin
        .from('payments')
        .select('id, user_email, plan_id, txn_id, status, created_at')
        .eq('txn_id', sessionId)
        .maybeSingle();

      if (payment && payment.status === 'verified') {
        return NextResponse.json({
          success: true,
          verified: true,
          payment,
          message: 'Payment confirmed and verified.',
        });
      }
    }

    // 2. Check if user already has an active verified pro plan
    if (targetEmail) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('id, email, plan')
        .eq('email', targetEmail.toLowerCase())
        .maybeSingle();

      if (user && user.plan === 'pro') {
        return NextResponse.json({
          success: true,
          verified: true,
          isPro: true,
          message: 'User account is already active with Pro tier.',
        });
      }
    }

    return NextResponse.json({
      success: true,
      verified: false,
      status: 'awaiting_payment',
      message: 'Listening for incoming bank confirmation...',
    });
  } catch (err: unknown) {
    console.error('Payment status check error:', err);
    return NextResponse.json(
      { success: false, verified: false, message: 'Status check error.' },
      { status: 500 }
    );
  }
}
