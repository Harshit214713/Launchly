import { NextResponse } from 'next/server';
import { addContactMessage } from '@/lib/db';
import { sendFeedbackEmail } from '@/lib/mailer';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Rate limiting: Max 5 messages per 3 minutes per IP to prevent mail bombing
    const ip = getClientIp(request);
    const rl = rateLimit(`contact:${ip}`, 5, 3 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, message: 'Too many messages sent. Please wait a few minutes before submitting again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message, category, rating } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message content cannot be empty.' },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { success: false, message: 'Message exceeds maximum allowed length of 3000 characters.' },
        { status: 400 }
      );
    }

    const cleanCategory = String(category || 'IDEA').slice(0, 30);
    const cleanRating = typeof rating === 'number' ? Math.min(5, Math.max(1, rating)) : 4;
    const cleanEmail = (email && typeof email === 'string' && email.trim()) || 'anonymous@launchly.site';
    const cleanName = (name && typeof name === 'string' && name.trim().slice(0, 80)) || `User [${cleanCategory}]`;

    // 1. Save to database
    const dbResult = await addContactMessage(cleanName, cleanEmail, message.trim());

    // 2. Dispatch email notification to admin
    const emailResult = await sendFeedbackEmail({
      category: cleanCategory,
      rating: cleanRating,
      message: message.trim(),
      senderEmail: cleanEmail,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback received and dispatched successfully.',
      savedToDb: dbResult.success,
      emailDelivered: emailResult.success,
      deliveryMethod: emailResult.method,
    });
  } catch (error: unknown) {
    console.error('Feedback dispatch error:', error);
    const message = error instanceof Error ? error.message : 'Internal error processing request.';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
