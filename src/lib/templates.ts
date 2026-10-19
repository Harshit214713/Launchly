import { Template, TemplateCategory } from '@/types';

// Category definitions with coming soon status
// Only Ecommerce is currently available, others are marked as coming soon
export const CATEGORIES: TemplateCategory[] = [
  'All',
  'SaaS',
  'AI',
  'Agency',
  'Portfolio',
  'Ecommerce',
  'Web3',
  'Media'
];

// Categories that are marked as coming soon (exclude Ecommerce)
// These categories will display a "SOON" badge and be disabled for selection
export const COMING_SOON_CATEGORIES: TemplateCategory[] = [
  'SaaS',
  'AI',
  'Agency',
  'Portfolio',
  'Web3',
  'Media'
];

// Premium e-commerce templates with modern aesthetics
// Multiple templates available in the Ecommerce category
export const TEMPLATES: Template[] = [
  {
    id: 'velvet-boutique',
    name: 'Velvet Boutique',
    category: 'Ecommerce',
    description: 'High-end fashion boutique template with sophisticated dark theme, elegant typography, and premium product photography showcase. Perfect for luxury fashion brands, jewelry stores, and premium lifestyle products.',
    tags: ['ecommerce', 'fashion', 'luxury', 'dark', 'boutique', 'premium'],
    badge: 'New',
    isPro: true,
    previewUrl: '/templates/velvet-boutique',
    thumbnail: '/templates/velvet-boutique.png',
    accent: '#D4AF37',
    bgColor: '#0A0A0A',
    textColor: '#FFFFFF',
    pages: ['Home', 'Collections', 'Product Details', 'Lookbook', 'Cart', 'Checkout', 'Account', 'About'],
    features: [
      'Immersive product galleries',
      'Lookbook collection pages',
      'Size guide integration',
      'Color variant swatches',
      'Virtual try-on ready',
      'Instagram feed integration',
      'Store locator',
      'Gift card system',
      'Pre-order functionality',
      'Dark mode optimized',
      'Smooth page transitions',
      'Product video support',
      'Custom font pairing',
      'Newsletter signup',
      'Social sharing',
      'Wishlist with sharing'
    ],
    rating: 4.98,
    reviewsCount: 89,
    topReview: {
      author: 'Marcus Williams',
      role: 'Fashion Brand Owner',
      comment: 'The dark theme is absolutely stunning. Our customers love the premium feel and the lookbook feature has increased our engagement by 60%. Worth every penny!'
    },
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/velvet-boutique/source',
    techStack: ['Next.js 15', 'Tailwind v4', 'TypeScript', 'Framer Motion', 'Stripe', 'Supabase', 'React Query', 'Zustand']
  },
];

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'All') return TEMPLATES;
  return TEMPLATES.filter((t) => t.category.toLowerCase() === category.toLowerCase());
}

export function searchTemplates(query: string): Template[] {
  const q = query.toLowerCase();
  return TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
