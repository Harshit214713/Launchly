import { NextResponse } from 'next/server';
import { publishSite } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { templateId, name, subdomain } = await request.json();

    if (!templateId || !subdomain) {
      return NextResponse.json(
        { success: false, message: 'Template ID and subdomain are required.' },
        { status: 400 }
      );
    }

    const result = publishSite(templateId, name, subdomain);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal error deploying website.' },
      { status: 500 }
    );
  }
}
