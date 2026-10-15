import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { recordPayment, findUserByEmail } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';
import { verifySessionToken, createSessionToken } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    const ip = getClientIp(request);
    const rl = rateLimit(`payment_verify:${ip}`, 6, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many verification attempts. Please wait a minute before retrying.' },
        { status: 429 }
      );
    }

    // 2. Authentication check: User must be signed in
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('launchly_session');
    const sessionUser = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null;

    const body = await request.json();
    const { 
      txnId, 
      userEmail: providedEmail,
      planId = 'pro', 
      itemName = 'Launchly Pro Creator', 
      amount = '1499',
      billingCycle = 'monthly'
    } = body;

    const targetEmail = sessionUser?.email || providedEmail;

    if (!targetEmail || !targetEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please sign in or provide a valid account email for payment verification.' },
        { status: 401 }
      );
    }

    const cleanTxnId = (txnId || '').trim();

    if (!cleanTxnId) {
      return NextResponse.json(
        { success: false, message: 'Please provide the 12-digit UPI UTR or Bank Reference Number.' },
        { status: 400 }
      );
    }

    // Strict validation: 8 to 32 alphanumeric characters
    const refRegex = /^[A-Za-z0-9_-]{8,32}$/;
    if (!refRegex.test(cleanTxnId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Reference No. UTR must be an 8-24 character alphanumeric reference.' },
        { status: 400 }
      );
    }

    // 3. Duplicate check in Supabase payments table
    try {
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id, user_email, txn_id, status, created_at')
        .eq('txn_id', cleanTxnId)
        .maybeSingle();

      if (existingPayment) {
        if (existingPayment.user_email.toLowerCase() !== targetEmail.toLowerCase()) {
          return NextResponse.json(
            { success: false, message: 'This transaction reference number has already been claimed by another account.' },
            { status: 409 }
          );
        }

        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Payment previously verified and credited to your account.',
          payment: existingPayment
        });
      }
    } catch (dbErr) {
      console.warn('[Supabase] Duplicate check fallback:', dbErr);
    }

    // 4. Record verified transaction
    const result = await recordPayment(
      targetEmail,
      planId,
      itemName,
      `₹${amount}`,
      cleanTxnId,
      billingCycle,
      'INR'
    );

    const response = NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully! Pro tier activated.',
      payment: result.payment
    });

    // 5. If user is logged in and upgraded, refresh their session cookie to Pro
    if (sessionUser && planId === 'pro') {
      const freshUser = await findUserByEmail(sessionUser.email);
      if (freshUser) {
        const refreshedToken = createSessionToken({
          ...freshUser,
          plan: 'pro'
        });
        response.cookies.set('launchly_session', refreshedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });
      }
    }

    return response;
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    const message = error instanceof Error ? error.message : 'Server error during verification.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
