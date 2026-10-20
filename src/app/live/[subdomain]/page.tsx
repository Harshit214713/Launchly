import LiveWebsitePage from './LiveSite';
import { getPublishedPageMetadata } from '@/lib/siteSeo';

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }) {
  const { subdomain } = await params;
  return getPublishedPageMetadata(subdomain);
}

export default function Page({ params }: { params: Promise<{ subdomain: string }> }) {
  return <LiveWebsitePage params={params} />;
}
