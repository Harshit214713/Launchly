import { NextResponse } from 'next/server';
import { recordPayment } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      userEmail = 'customer@launchly.site', 
      planId = 'pro', 
      itemName = 'Launchly Pro Creator', 
      amount = '$19', 
      txnId, 
      billingCycle = 'monthly',
      currency = 'USD'
    } = body;

    if (!txnId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID / UTR is required.' },
        { status: 400 }
      );
    }

    const result = await recordPayment(
      userEmail,
      planId,
      itemName,
      amount,
      txnId,
      billingCycle,
      currency
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Payment record error:', error);
    const message = error instanceof Error ? error.message : 'Server error recording payment.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
