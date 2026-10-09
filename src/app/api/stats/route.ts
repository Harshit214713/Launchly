import { NextResponse } from 'next/server';
import { getSubscribersCount, getAllSites } from '@/lib/db';
import { TEMPLATES } from '@/lib/templates';

export async function GET() {
  const sites = getAllSites();
  const totalViews = sites.reduce((sum, s) => sum + s.views, 0);

  return NextResponse.json({
    success: true,
    stats: {
      activeCreators: getSubscribersCount() + 10000,
      templatesCount: TEMPLATES.length,
      publishedWebsites: sites.length + 3420,
      totalViews: totalViews + 128400,
      uptime: '99.99%',
      avgPageSpeed: 99,
    },
  });
}
