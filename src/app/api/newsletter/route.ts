import { NextResponse } from 'next/server';
import { addSubscriber, getSubscribersCount } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = rateLimit(`newsletter:${ip}`, 6, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many subscription attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    if (typeof body?.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: true, message: 'Subscription received.' });
    }
    const { email, source, topics } = body;

    if (!email || typeof email !== 'string' || email.length > 254) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSource = typeof source === 'string' ? source.slice(0, 50) : 'frontpage';
    const cleanTopics = Array.isArray(topics)
      ? topics.filter((t: unknown) => typeof t === 'string' && (t as string).trim()).map((t: string) => t.trim().toLowerCase().slice(0, 30))
      : ['general'];

    const result = await addSubscriber(cleanEmail, cleanSource);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    const total = await getSubscribersCount();
    return NextResponse.json({
      ...result,
      topics: cleanTopics.length > 0 ? cleanTopics : ['general'],
      subscribedAt: new Date().toISOString(),
      totalSubscribers: total,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}
