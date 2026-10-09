import { NextResponse } from 'next/server';
import { getAllSites } from '@/lib/db';

export async function GET() {
  try {
    const sites = getAllSites();
    return NextResponse.json({
      success: true,
      sites,
      total: sites.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve websites.' },
      { status: 500 }
    );
  }
}
