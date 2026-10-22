import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    source: 'blank-canvas',
    total: 0,
    templates: [],
  });
}
