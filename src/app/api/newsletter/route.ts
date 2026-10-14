import { NextResponse } from 'next/server';
import { addSubscriber, getSubscribersCount } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = await addSubscriber(email, source);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    const total = await getSubscribersCount();
    return NextResponse.json({
      ...result,
      totalSubscribers: total,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}
