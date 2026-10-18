import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan = 'pro', billing = 'monthly', templateId } = body;

    const price = plan === 'pro' 
      ? (billing === 'yearly' ? 159 : 19)
      : (templateId ? 49 : 0);

    // Simulate instant secure checkout session creation
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return NextResponse.json({
      success: true,
      sessionId,
      plan,
      billing,
      amount: price,
      currency: 'USD',
      templateId,
      checkoutUrl: `/checkout?plan=${plan}&billing=${billing}&session_id=${sessionId}`,
      message: `Please scan the official QR code to complete payment for Launchly ${plan.toUpperCase()} (${billing}).`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to initiate checkout.' },
      { status: 500 }
    );
  }
}
