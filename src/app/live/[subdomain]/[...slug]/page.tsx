import LiveWebsitePage from '../LiveSite';
import { getPublishedPageMetadata, getPublishedSlugRedirect, hasPublishedPage } from '@/lib/siteSeo';
import { notFound, permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string; slug: string[] }> }) {
  const { subdomain, slug } = await params;
  return getPublishedPageMetadata(subdomain, slug.join('/'));
}

export default async function LiveSiteRoute({ params }: { params: Promise<{ subdomain: string; slug: string[] }> }) {
  const routeParams = await params;
  const newSlug = await getPublishedSlugRedirect(routeParams.subdomain, routeParams.slug.join('/'));
  if (newSlug) {
    const host = (await headers()).get('host') || '';
    const customHost = host.endsWith('.launchly.site') || host.includes('.localhost');
    permanentRedirect(customHost ? newSlug : `/live/${routeParams.subdomain}${newSlug}`);
  }
  if (!await hasPublishedPage(routeParams.subdomain, routeParams.slug.join('/'))) notFound();
  return <LiveWebsitePage params={Promise.resolve(routeParams)} />;
}
