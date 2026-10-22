import type { Template, TemplateCategory } from '@/types';

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

const starterTemplate = ({
  id,
  name,
  category,
  description,
  accent,
  bgColor,
  textColor,
  pages,
  features,
  tags,
}: {
  id: string;
  name: string;
  category: Exclude<TemplateCategory, 'All' | 'Ecommerce'>;
  description: string;
  accent: string;
  bgColor: string;
  textColor: string;
  pages: string[];
  features: string[];
  tags: string[];
}): Template => ({
  id,
  name,
  category,
  description,
  tags: [category.toLowerCase(), ...tags],
  badge: 'New',
  isPro: false,
  previewUrl: `/templates/${id}`,
  thumbnail: `/templates/${id}.svg`,
  accent,
  bgColor,
  textColor,
  pages,
  features,
  rating: 4.8,
  reviewsCount: 0,
  sourceCodeAvailable: true,
  sourceCodeUrl: `/api/templates/${id}/source`,
  techStack: ['Next.js 16', 'Tailwind v4', 'TypeScript', 'Zustand'],
});

const STARTER_TEMPLATES: Template[] = [
  starterTemplate({
    id: 'orbit-workspace',
    name: 'Orbit Workspace',
    category: 'SaaS',
    description: 'A polished product site for a team workspace, with clear feature storytelling, plan comparisons, and a focused signup path.',
    accent: '#7C5CFC',
    bgColor: '#F7F5FF',
    textColor: '#211A3C',
    pages: ['Home', 'Features', 'Pricing', 'Contact'],
    features: ['Product-led hero and signup call to action', 'Feature overview and customer proof', 'Plan comparison and FAQ starter content', 'Responsive navigation and footer'],
    tags: ['software', 'product', 'startup'],
  }),
  starterTemplate({
    id: 'promptforge',
    name: 'PromptForge',
    category: 'AI',
    description: 'A confident launch page for an AI product, with space for demos, model capabilities, trust signals, and conversion-focused calls to action.',
    accent: '#00C9A7',
    bgColor: '#071A1B',
    textColor: '#F1FFFC',
    pages: ['Home', 'Product', 'Pricing', 'Contact'],
    features: ['AI product introduction and demo call to action', 'Capability cards and workflow steps', 'Trust, privacy, and testimonial sections', 'Pricing and contact page starters'],
    tags: ['artificial intelligence', 'machine learning', 'product'],
  }),
  starterTemplate({
    id: 'goodside-studio',
    name: 'Goodside Studio',
    category: 'Agency',
    description: 'A welcoming agency site to present services, selected work, a practical process, and a straightforward way to start a project.',
    accent: '#FF6B4A',
    bgColor: '#FFF7F1',
    textColor: '#291B16',
    pages: ['Home', 'Services', 'Work', 'Contact'],
    features: ['Agency positioning and inquiry call to action', 'Service and process highlights', 'Selected-work and testimonial sections', 'Contact page starter with clear next steps'],
    tags: ['creative', 'studio', 'services'],
  }),
  starterTemplate({
    id: 'mira-chen',
    name: 'Mira Chen',
    category: 'Portfolio',
    description: 'A clean personal portfolio for presenting a short biography, selected projects, services, and contact details.',
    accent: '#F4C542',
    bgColor: '#FAF9F4',
    textColor: '#22231F',
    pages: ['Home', 'Projects', 'About', 'Contact'],
    features: ['Personal introduction and portfolio hero', 'Project and case-study content areas', 'About and services sections', 'Contact page starter'],
    tags: ['personal', 'designer', 'creative'],
  }),
  starterTemplate({
    id: 'openledger',
    name: 'OpenLedger',
    category: 'Web3',
    description: 'A transparent landing page for a Web3 product or community, with room for product principles, ecosystem highlights, and updates.',
    accent: '#8DF0C8',
    bgColor: '#101A19',
    textColor: '#F2FFF9',
    pages: ['Home', 'Protocol', 'Community', 'Contact'],
    features: ['Protocol introduction and community call to action', 'Ecosystem and product principle cards', 'Roadmap and community proof sections', 'Contact and update signup starters'],
    tags: ['blockchain', 'crypto', 'community'],
  }),
  starterTemplate({
    id: 'signal-daily',
    name: 'Signal Daily',
    category: 'Media',
    description: 'An editorial-style publication site for introducing a publication, featuring stories, building readership, and collecting newsletter signups.',
    accent: '#E6483D',
    bgColor: '#FFF8F2',
    textColor: '#241C19',
    pages: ['Home', 'Stories', 'About', 'Subscribe'],
    features: ['Editorial introduction and featured-story area', 'Topic and publication highlights', 'Reader testimonials and newsletter signup', 'About and subscription page starters'],
    tags: ['publication', 'newsletter', 'editorial'],
  }),
];

// The ecommerce catalog is intentionally focused on these two complete starter stores.
export const TEMPLATES: Template[] = [
  {
    id: 'fresh-crate',
    name: 'Fresh Crate',
    category: 'Ecommerce',
    description: 'A friendly neighborhood grocer for just-picked produce, pantry staples, and quick local delivery. Browse seasonal crates, choose a delivery slot, and bring the farm closer to home.',
    tags: ['ecommerce', 'grocery', 'organic', 'local delivery', 'fresh food', 'farm to table'],
    badge: 'New',
    isPro: false,
    previewUrl: '/templates/fresh-crate',
    thumbnail: '/templates/fresh-crate.svg',
    accent: '#3FA34D',
    bgColor: '#FFF8EC',
    textColor: '#1F2A1B',
    pages: ['Home'],
    features: ['Single-page farm-to-door storefront starter', 'Twelve sample grocery products', 'Seasonal product grid with add-to-bag actions', 'Freshness and origin storytelling', 'Combo baskets and weekly offers', 'Delivery area and ordering information', 'Customer testimonials and common questions', 'Newsletter and contact sections', 'Responsive shared navigation and footer', 'Add and customize more pages in the editor'],
    rating: 4.9,
    reviewsCount: 126,
    products: [
      { name: 'Market Morning Crate', category: 'Seasonal crate', price: 1499, detail: 'A bright mix of farm-picked vegetables for the week.' },
      { name: 'Heirloom Tomato Box', category: 'Vegetables', price: 349, detail: 'Sun-ripened tomatoes from small partner farms.' },
      { name: 'Baby Spinach', category: 'Greens', price: 129, detail: 'Tender leaves washed and packed the same morning.' },
      { name: 'Rainbow Carrots', category: 'Vegetables', price: 179, detail: 'Sweet, colorful carrots with their greens attached.' },
      { name: 'Avocado Duo', category: 'Fruit', price: 219, detail: 'Creamy avocados selected for a ready-soon ripeness.' },
      { name: 'Strawberry Punnet', category: 'Fruit', price: 249, detail: 'Small-batch berries picked at peak sweetness.' },
      { name: 'Country Sourdough', category: 'Bakery', price: 189, detail: 'Slow-fermented loaf baked fresh before delivery.' },
      { name: 'Farmhouse Eggs', category: 'Dairy & eggs', price: 159, detail: 'A dozen free-range eggs from nearby farms.' },
      { name: 'Raw Forest Honey', category: 'Pantry', price: 399, detail: 'Unfiltered honey with a delicate floral finish.' },
      { name: 'Cold-Pressed Apple Juice', category: 'Drinks', price: 229, detail: 'Crisp orchard apples, pressed without added sugar.' },
      { name: 'Weekly Pantry Basket', category: 'Combo baskets', price: 1299, detail: 'Everyday staples paired with seasonal produce.' },
      { name: 'Green Goodness Bundle', category: 'Combo baskets', price: 899, detail: 'A generous bundle of greens, herbs, and citrus.' },
    ],
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/fresh-crate/source',
    techStack: ['Next.js 16', 'Tailwind v4', 'TypeScript', 'Zustand'],
  },
  {
    id: 'volt-gear',
    name: 'Volt Gear',
    category: 'Ecommerce',
    description: 'A high-contrast drop shop for audio, gaming, and everyday technology. Compare detailed specs, build a setup bundle, and follow each limited release from launch to delivery.',
    tags: ['ecommerce', 'electronics', 'gadgets', 'audio', 'gaming', 'technology'],
    badge: 'New',
    isPro: false,
    previewUrl: '/templates/volt-gear',
    thumbnail: '/templates/volt-gear.svg',
    accent: '#C6FF3D',
    bgColor: '#0B0D12',
    textColor: '#F5F7FA',
    pages: ['Home'],
    features: ['Single-page drop-style ecommerce starter', 'Twelve sample technology products', 'High-contrast product grid with add-to-bag actions', 'Clear product specifications and categories', 'Limited-drop campaign storytelling', 'Setup bundle and comparison highlights', 'Customer reviews and support information', 'Newsletter and contact sections', 'Responsive shared navigation and footer', 'Add and customize more pages in the editor'],
    rating: 4.9,
    reviewsCount: 98,
    products: [
      { name: 'Pulse ANC Headphones', category: 'Audio', price: 12999, detail: 'Adaptive noise cancellation with 40-hour battery life.' },
      { name: 'Volt Mechanical Keyboard', category: 'Desk setup', price: 7499, detail: 'Hot-swappable switches in a compact aluminum frame.' },
      { name: 'Arc Wireless Mouse', category: 'Desk setup', price: 3999, detail: 'A low-latency sensor with a sculpted ergonomic shell.' },
      { name: 'Nova 27 Gaming Monitor', category: 'Displays', price: 28999, detail: 'QHD resolution, vivid color, and a smooth 165Hz panel.' },
      { name: 'Orbit Portable Speaker', category: 'Audio', price: 5999, detail: 'Room-filling sound in a rugged, travel-ready body.' },
      { name: 'Flux USB-C Dock', category: 'Accessories', price: 6499, detail: 'One cable for displays, power, storage, and peripherals.' },
      { name: 'Core 65W Charger', category: 'Power', price: 2499, detail: 'Compact GaN charging for laptops, phones, and tablets.' },
      { name: 'Echo Studio Microphone', category: 'Creator gear', price: 8999, detail: 'Clear USB audio with a tap-to-mute control.' },
      { name: 'Stride Fitness Watch', category: 'Wearables', price: 11999, detail: 'Training metrics, GPS, and a week of battery life.' },
      { name: 'Prism Smart Light Bar', category: 'Lighting', price: 3499, detail: 'A desk-ready light bar with adjustable color temperature.' },
      { name: 'Travel Tech Kit', category: 'Bundles', price: 9999, detail: 'A charger, cable set, and compact hub for the road.' },
      { name: 'Creator Desk Bundle', category: 'Bundles', price: 42999, detail: 'Keyboard, microphone, dock, and lighting for a clean setup.' },
    ],
    sourceCodeAvailable: true,
    sourceCodeUrl: '/api/templates/volt-gear/source',
    techStack: ['Next.js 16', 'Tailwind v4', 'TypeScript', 'Zustand'],
  },
  ...STARTER_TEMPLATES,
];

export const ALL_TEMPLATES: Template[] = [...TEMPLATES];

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'All') return TEMPLATES;
  return TEMPLATES.filter((t: Template) => t.category.toLowerCase() === category.toLowerCase());
}

export function searchTemplates(query: string): Template[] {
  const q = query.toLowerCase();
  return TEMPLATES.filter(
    (t: Template) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getTemplateById(id: string): Template | undefined {
  return ALL_TEMPLATES.find((t) => t.id === id);
}
