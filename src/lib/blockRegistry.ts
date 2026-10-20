export type BlockCategory = 'structure' | 'content' | 'business' | 'media';
export type BlockDefinition = {
  type: string;
  label: string;
  category: BlockCategory;
  description: string;
  defaultContent: Record<string, unknown>;
  defaultStyle: Record<string, unknown>;
};

const items = {
  gallery: [
    { title: 'Everyday Essential', desc: 'Premium materials · Made with care', price: '$68', image: '' },
    { title: 'Signature Piece', desc: 'A favorite, thoughtfully made', price: '$124', image: '' },
    { title: 'The New Classic', desc: 'Designed for every day', price: '$92', image: '' },
  ],
  pricing: [
    { title: 'Starter', price: '$9', interval: '/month', description: 'For getting started', features: ['Core features', 'Email support'], highlighted: false },
    { title: 'Growth', price: '$29', interval: '/month', description: 'For growing teams', features: ['Everything in Starter', 'Priority support', 'Advanced tools'], highlighted: true },
    { title: 'Scale', price: '$79', interval: '/month', description: 'For established teams', features: ['Everything in Growth', 'Dedicated support'], highlighted: false },
  ],
};

const definitions: Array<Omit<BlockDefinition, 'defaultStyle'>> = [
  { type: 'nav', label: 'Navigation', category: 'structure', description: 'Site logo and page links', defaultContent: { cta: 'Get started' } },
  { type: 'hero', label: 'Hero', category: 'content', description: 'Headline, introduction, and actions', defaultContent: { badge: 'WELCOME', title: 'A better way to get started', description: 'Tell visitors what makes your business worth choosing.', ctaPrimary: 'Get started', ctaSecondary: 'Learn more', stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '' } },
  { type: 'features', label: 'Features', category: 'content', description: 'A grid of benefits or services', defaultContent: { heading: 'Made for the way you work', items: [{ title: 'Thoughtful design', desc: 'Every detail is built around what matters to you.' }, { title: 'Simple to use', desc: 'Get started quickly, with help when you need it.' }, { title: 'Made to grow', desc: 'A flexible foundation for what comes next.' }] } },
  { type: 'gallery', label: 'Product gallery', category: 'media', description: 'Showcase products, projects, or images', defaultContent: { heading: 'Featured collection', description: 'Explore a few customer favorites.', items: items.gallery } },
  { type: 'pricing', label: 'Pricing', category: 'business', description: 'Compare plans and features', defaultContent: { heading: 'Simple, transparent pricing', description: 'Choose the plan that fits your needs.', items: items.pricing } },
  { type: 'contact', label: 'Contact form', category: 'business', description: 'Let visitors send a message', defaultContent: { heading: 'Get in touch', description: 'Send a message and we will get back to you.', submitLabel: 'Send message', successMessage: 'Thanks for your message.' } },
  { type: 'testimonials', label: 'Testimonials', category: 'content', description: 'Customer quotes and reviews', defaultContent: { heading: 'Trusted by our customers', items: [{ quote: 'The team made the whole process easy.', name: 'Alex Morgan', role: 'Customer' }, { quote: 'Thoughtful quality and genuinely helpful service.', name: 'Jamie Lee', role: 'Customer' }] } },
  { type: 'cta', label: 'Call to action', category: 'business', description: 'Invite visitors to take the next step', defaultContent: { title: 'Ready to get started?', desc: 'Tell us what you are looking for.', buttonText: 'Get started' } },
  { type: 'footer', label: 'Footer', category: 'structure', description: 'Business details and useful links', defaultContent: { copyright: 'All rights reserved.', links: ['Privacy', 'Terms', 'Contact'] } },
  { type: 'stats', label: 'Stats', category: 'content', description: 'Highlight business results', defaultContent: { heading: 'Results that speak for themselves', items: [{ value: '2,400+', label: 'Happy customers' }, { value: '98%', label: 'Satisfaction' }, { value: '12 yrs', label: 'Experience' }] } },
  { type: 'faq', label: 'FAQ', category: 'content', description: 'Answer common questions', defaultContent: { heading: 'Frequently asked questions', items: [{ question: 'How do I get started?', answer: 'Contact our team and we will help you choose the right option.' }, { question: 'Can I change my plan?', answer: 'Yes. You can update your plan whenever your needs change.' }, { question: 'How can I reach support?', answer: 'Send a message through the contact page and we will respond.' }] } },
  { type: 'team', label: 'Team', category: 'content', description: 'Introduce the people behind your business', defaultContent: { heading: 'Meet the team', items: [{ name: 'Alex Morgan', role: 'Founder', bio: 'Building thoughtful customer experiences.' }, { name: 'Jamie Lee', role: 'Design lead', bio: 'Turning big ideas into simple products.' }] } },
  { type: 'steps', label: 'Steps', category: 'content', description: 'Explain a process in a few steps', defaultContent: { heading: 'How it works', items: [{ title: 'Tell us what you need', desc: 'Share your goals and priorities.' }, { title: 'Choose your approach', desc: 'We will recommend a path that fits.' }, { title: 'Get started', desc: 'Move forward with support at every step.' }] } },
  { type: 'newsletter', label: 'Newsletter', category: 'business', description: 'Collect email subscribers', defaultContent: { heading: 'Stay in the loop', description: 'Get occasional updates and useful ideas.', submitLabel: 'Subscribe' } },
  { type: 'rich-text', label: 'Rich text', category: 'content', description: 'Add a text section', defaultContent: { heading: 'A little about us', body: 'Use this space to share your story, explain your approach, or answer a question your visitors may have.' } },
  { type: 'image-text', label: 'Image and text', category: 'media', description: 'Pair a photo with a story', defaultContent: { heading: 'Made with intention', body: 'Share the story behind your work and what makes it different.', image: '' } },
  { type: 'divider', label: 'Divider', category: 'structure', description: 'Create visual separation between sections', defaultContent: { label: '' } },
  { type: 'announcement', label: 'Announcement bar', category: 'business', description: 'Share a timely announcement', defaultContent: { text: 'A little something new. Explore what is coming next.', linkLabel: 'Learn more' } },
  { type: 'anchor', label: 'Anchor point', category: 'structure', description: 'Create a target for on-page links', defaultContent: { heading: 'Anchor point', description: 'Set its ID in section properties.' } },
  { type: 'breadcrumbs', label: 'Breadcrumbs', category: 'structure', description: 'Show the current page path', defaultContent: { heading: 'Breadcrumbs' } },
  { type: 'services', label: 'Services', category: 'business', description: 'List your services', defaultContent: { heading: 'Our services', items: [{ title: 'Consulting', desc: 'Practical guidance for your next step.' }, { title: 'Design', desc: 'Thoughtful solutions shaped around your needs.' }, { title: 'Support', desc: 'Help from a team that knows your work.' }] } },
  { type: 'logo-cloud', label: 'Logo cloud', category: 'media', description: 'Show partner and client logos', defaultContent: { heading: 'Trusted by', items: [{ title: 'Partner one', image: '' }, { title: 'Partner two', image: '' }, { title: 'Partner three', image: '' }] } },
  { type: 'not-found', label: '404 page', category: 'content', description: 'Add a custom not-found section', defaultContent: { heading: 'Page not found', description: 'The page you are looking for may have moved or no longer exists.', buttonText: 'Back home' } },
];

export const blockRegistry: Record<string, BlockDefinition> = Object.fromEntries(definitions.map((block) => [block.type, { ...block, defaultStyle: {} }]));

export function getBlockDefinition(type: string): BlockDefinition {
  return blockRegistry[type] || { type, label: type.replace(/-/g, ' '), category: 'content', description: 'Content section', defaultContent: {}, defaultStyle: {} };
}
