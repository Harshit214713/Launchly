import { NextResponse } from 'next/server';
import { addContactMessage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    const result = addContactMessage(name, email, message);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal error processing request.' },
      { status: 500 }
    );
  }
}
