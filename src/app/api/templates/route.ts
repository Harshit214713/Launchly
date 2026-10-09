import { NextResponse } from 'next/server';
import { TEMPLATES, CATEGORIES } from '@/lib/templates';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const pro = searchParams.get('pro');

  let results = [...TEMPLATES];

  if (category && category !== 'All') {
    results = results.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (pro !== null && pro !== undefined && pro !== '') {
    results = results.filter((t) => t.isPro === (pro === 'true'));
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    categories: CATEGORIES,
    templates: results,
  });
}
