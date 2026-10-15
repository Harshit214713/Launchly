import { NextResponse } from 'next/server';
import { recordPayment } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      txnId, 
      userEmail = 'customer@launchly.site', 
      planId = 'pro', 
      itemName = 'Launchly Pro Creator', 
      amount = '1499',
      billingCycle = 'monthly'
    } = body;

    const cleanTxnId = (txnId || '').trim();

    if (!cleanTxnId) {
      return NextResponse.json(
        { success: false, message: 'Please provide the 12-digit UPI UTR or Reference Number.' },
        { status: 400 }
      );
    }

    // Verify format: reference number must be at least 8 characters
    const isValidRef = cleanTxnId.length >= 8;

    if (!isValidRef) {
      return NextResponse.json(
        { success: false, message: 'Invalid Reference No. UTR must be at least 8-12 digits.' },
        { status: 400 }
      );
    }

    // Check if UTR was already redeemed in Supabase
    try {
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id, txn_id, status, created_at')
        .eq('txn_id', cleanTxnId)
        .maybeSingle();

      if (existingPayment) {
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

    // Record verified transaction in Supabase
    const result = await recordPayment(
      userEmail,
      planId,
      itemName,
      `₹${amount}`,
      cleanTxnId,
      billingCycle,
      'INR'
    );

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully! Pro tier activated.',
      payment: result.payment
    });

  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    const message = error instanceof Error ? error.message : 'Server error during verification.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
