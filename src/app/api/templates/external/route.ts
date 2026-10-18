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
  {
    id: 'kroma-studio-bento',
    name: 'Kroma Kinetic Studio',
    category: 'Agency',
    description: 'Awwwards-honored brutalist creative direction agency with kinetic SVG typography, WebGL mouse distortions, and Sanity CMS case studies.',
    tags: ['agency', 'full-stack', 'brutalist', 'motion', 'awwwards'],
    badge: 'New',
    isPro: false,
    previewUrl: '/editor/kroma-studio-bento',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    accent: '#FF3366',
    bgColor: '#0A0A0E',
    textColor: '#FFFFFF',
    pages: ['Selected Works', 'Manifesto', 'Client Rosters', 'Interactive Reels', 'Inquiries'],
    features: ['Kinetic layout engine', 'Framer motion drag canvas', 'Full-stack inquiry dispatch API', 'Real-time Resend email alerts'],
    rating: 4.98,
    reviewsCount: 289,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/kroma-studio-bento/source',
    techStack: ['Next.js 15', 'Tailwind v4', 'Geist Font', 'Resend Email API', 'TypeScript']
  },
  {
    id: 'vault-defi-terminal',
    name: 'VaultX Perpetual DEX',
    category: 'Web3',
    description: 'Institutional-grade decentralized liquidity protocol with real-time TradingView candlestick charts, wallet connect, and zero slippage.',
    tags: ['web3', 'full-stack', 'defi', 'trading', 'dark'],
    badge: 'Pro',
    isPro: true,
    previewUrl: '/editor/vault-defi-terminal',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=85',
    accent: '#00E599',
    bgColor: '#080A10',
    textColor: '#FFFFFF',
    pages: ['Trading Terminal', 'Liquidity Pools', 'Staking Vaults', 'Audits', 'Docs'],
    features: ['Real-time orderbook depth chart', 'Wagmi / Viem Web3 wallet connectors', 'Server-sent event price streaming', 'Audited smart contracts'],
    rating: 4.99,
    reviewsCount: 412,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/vault-defi-terminal/source',
    techStack: ['Next.js 15', 'Tailwind CSS', 'Wagmi / Viem', 'SVG TradingView', 'TypeScript']
  },
  {
    id: 'strata-monolith-saas',
    name: 'Strata Monolith Cloud',
    category: 'SaaS',
    description: 'Linear & Raycast-inspired developer telemetry suite with sub-millisecond edge metrics, live incident radar, and Stripe recurring subscriptions.',
    tags: ['saas', 'full-stack', 'linear-style', 'minimal', 'bento'],
    badge: 'Popular',
    isPro: false,
    previewUrl: '/editor/strata-monolith-saas',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
    accent: '#FFE500',
    bgColor: '#09090F',
    textColor: '#FFFFFF',
    pages: ['Clusters', 'Edge Maps', 'Logs Explorer', 'Stripe Billing', 'API Tokens'],
    features: ['Global interactive SVG latency radar', 'Stripe billing portal webhook listener', 'Command bar (Cmd+K)', 'Supabase row-level security'],
    rating: 4.99,
    reviewsCount: 520,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/strata-monolith-saas/source',
    techStack: ['Next.js 15', 'Stripe Subscriptions', 'Prisma Database', 'Tailwind v4', 'TypeScript']
  },
  {
    id: 'atelier-archival',
    name: 'Atelier Maison Luxury Store',
    category: 'Ecommerce',
    description: 'Minimalist high-fashion archival lookbook & concept boutique with Apple Pay slide-out cart, currency switchers, and inventory database.',
    tags: ['ecommerce', 'full-stack', 'luxury', 'fashion', 'editorial'],
    badge: 'Pro',
    isPro: true,
    previewUrl: '/editor/atelier-archival',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    accent: '#C4B5FD',
    bgColor: '#0F0E13',
    textColor: '#FFFFFF',
    pages: ['Lookbook 26', 'Archival Bags', 'Runway Objects', 'Cart Drawer', 'Checkout'],
    features: ['Stripe Checkout & UPI integration', 'Slide-out responsive shopping drawer', 'Dynamic stock inventory API', 'High-res image zooms'],
    rating: 4.97,
    reviewsCount: 215,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/atelier-archival/source',
    techStack: ['Next.js 15', 'Stripe Checkout', 'Tailwind v4', 'PostgreSQL', 'TypeScript']
  },
  {
    id: 'sora-cinema-4k',
    name: 'Sora Cinematic Showreel',
    category: 'Media',
    description: 'Anamorphic 4K cinematic spatial video production platform with ambient glow lighting, film festival ribbons, and direct studio booking.',
    tags: ['media', 'full-stack', 'cinema', 'video', 'showreel'],
    badge: 'Popular',
    isPro: false,
    previewUrl: '/editor/sora-cinema-4k',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
    accent: '#FFAA00',
    bgColor: '#050508',
    textColor: '#FFFFFF',
    pages: ['Showreels', 'Feature Films', 'Color Suite', 'Directors', 'Book Session'],
    features: ['2.39:1 anamorphic custom player', 'Live booking scheduler API with Cal.com', 'Color grade before/after slider', 'Ultra-fast HLS streaming'],
    rating: 4.99,
    reviewsCount: 310,
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/sora-cinema-4k/source',
    techStack: ['Next.js 15', 'HLS Video Engine', 'Cal.com Embed', 'Tailwind v4', 'TypeScript']
  }
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
