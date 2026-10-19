import { NextResponse } from 'next/server';
import { Template, TemplateCategory } from '@/types';

interface UnsplashSearchResult {
  id: string;
  description?: string | null;
  alt_description?: string | null;
  color?: string | null;
  urls?: {
    regular?: string;
    small?: string;
  };
}

// Curated high-aesthetic creative design themes with full-stack specifications
const CURATED_AESTHETIC_FULLSTACK_THEMES: Template[] = [
  {
    id: 'neuro-hyperdrive',
    name: 'NeuroDrive Full-Stack OS',
    category: 'AI',
    description: 'Autonomous LLM agent orchestration terminal with streaming vector embeddings, token telemetry, Supabase vector storage, and edge streaming.',
    tags: ['ai', 'full-stack', 'bento', 'dark-glass', 'godly', 'supabase'],
    badge: 'Popular',
    isPro: true,
    previewUrl: '/editor/neuro-hyperdrive',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
    accent: '#00F0FF',
    bgColor: '#060810',
    textColor: '#FFFFFF',
    pages: ['Inference Hub', 'Vector Pipeline', 'Telemetry', 'API Playground', 'Billing'],
    features: ['Live token streaming runtime', 'Supabase Vector pgvector embeddings', 'Edge API route handlers', 'NextAuth / Supabase session sync'],
    rating: 4.99,
    reviewsCount: 342,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/neuro-hyperdrive/source',
    techStack: ['Next.js 15 (App Router)', 'Tailwind CSS v4', 'Supabase pgvector', 'TypeScript', 'Framer Motion']
  },
  
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('apiKey') || process.env.UNSPLASH_ACCESS_KEY;
  const query = searchParams.get('query') || 'minimalist modern website design dark';
  const category = searchParams.get('category');

  // If user provided an external Unsplash API key, fetch live from Unsplash API
  if (apiKey) {
    try {
      const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=12&orientation=landscape&client_id=${encodeURIComponent(apiKey)}`;

      const res = await fetch(unsplashUrl, {
        headers: { 'Accept-Version': 'v1' },
        next: { revalidate: 3600 }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const liveFetchedTemplates: Template[] = data.results.map((photo: UnsplashSearchResult, idx: number) => {
            const rawDesc = photo.description || photo.alt_description || 'Modern full-stack website template';
            const titleWords = rawDesc.split(' ').slice(0, 4).join(' ');
            const capitalizedTitle = titleWords.charAt(0).toUpperCase() + titleWords.slice(1);
            const id = `ext_${photo.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const photoColor = photo.color || '#12121a';
            const category: TemplateCategory = idx % 4 === 0 ? 'AI' : idx % 3 === 0 ? 'SaaS' : idx % 2 === 0 ? 'Agency' : 'Portfolio';

            return {
              id,
              name: capitalizedTitle || `Aesthetic Studio 0${idx + 1}`,
              category,
              description: photo.alt_description ? `${photo.alt_description}. Engineered with Next.js 15 and Supabase for hyper-scale.` : 'High-impact aesthetic full-stack design with responsive Next.js 15 architecture.',
              tags: ['full-stack', 'unsplash-live', 'nextjs15', 'aesthetic', 'modern-ui'],
              badge: idx % 2 === 0 ? 'Popular' : 'New',
              isPro: idx % 3 === 0,
              previewUrl: `/editor/neuro-ai`,
              thumbnail: photo.urls?.regular || photo.urls?.small,
              accent: photoColor !== '#000000' ? photoColor : '#00F0FF',
              bgColor: '#09090F',
              textColor: '#FFFFFF',
              pages: ['Overview', 'Showcase', 'Specs', 'Pricing', 'Docs'],
              features: [
                'Live Unsplash Creative Design imagery',
                'Next.js 15 App Router + Server Actions',
                'Supabase PostgreSQL database connectivity',
                'Pre-configured dark/light mode tokens'
              ],
              rating: 4.98,
              reviewsCount: 150 + idx * 14,
              sourceCodeAvailable: true,
              sourceCodeUrl: `/api/templates/${id}/source`,
              techStack: ['Next.js 15', 'Tailwind v4', 'Supabase', 'TypeScript', 'Unsplash Live API']
            };
          });

          return NextResponse.json({
            success: true,
            source: 'unsplash_api_live',
            total: liveFetchedTemplates.length,
            templates: liveFetchedTemplates
          });
        }
      }
    } catch (err) {
      console.warn('[External Templates API] Failed to fetch from Unsplash:', err);
    }
  }

  // Fallback to our curated ultra-aesthetic full-stack themes with high-res photography
  let themes = [...CURATED_AESTHETIC_FULLSTACK_THEMES];
  if (category && category !== 'All') {
    themes = themes.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    source: 'curated_fullstack_aesthetic_engine',
    total: themes.length,
    templates: themes,
    hasApiKey: Boolean(apiKey),
    tip: 'Provide an Unsplash Access Key via ?apiKey=... or UNSPLASH_ACCESS_KEY env variable to stream live photography directly from Unsplash API.'
  });
}
