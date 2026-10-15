import { NextResponse } from 'next/server';
import { addContactMessage } from '@/lib/db';
import { sendFeedbackEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, category, rating } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Message content cannot be empty.' },
        { status: 400 }
      );
    }

    const cleanCategory = category || 'IDEA';
    const cleanRating = typeof rating === 'number' ? rating : 4;
    const cleanEmail = (email && email.trim()) || 'anonymous@launchly.site';
    const senderName = name || `User [${cleanCategory}] (${cleanRating}/5 Stars)`;

    // 1. Save to Supabase contact_messages table
    const dbResult = await addContactMessage(senderName, cleanEmail, message.trim());

    // 2. Dispatch real email directly to admin's Gmail: vardaansaxena096@gmail.com
    const emailResult = await sendFeedbackEmail({
      category: cleanCategory,
      rating: cleanRating,
      message: message.trim(),
      senderEmail: cleanEmail,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback received and dispatched to admin.',
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
