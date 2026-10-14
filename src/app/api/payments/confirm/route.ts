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
  } catch (error: any) {
    console.error('Payment record error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Server error recording payment.' },
      { status: 500 }
    );
  }
}
