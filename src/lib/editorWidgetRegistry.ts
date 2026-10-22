import { editorCatalog, type EditorCatalogItem } from './editorCatalog.ts';

export type EditorWidgetKind =
  | 'hero'
  | 'metrics'
  | 'testimonials'
  | 'faq'
  | 'timeline'
  | 'pricing'
  | 'gallery'
  | 'navigation'
  | 'form'
  | 'commerce'
  | 'editorial'
  | 'people'
  | 'embed'
  | 'table'
  | 'actions'
  | 'interactive'
  | 'layout'
  | 'cards';

export type EditorWidgetDefinition = EditorCatalogItem & {
  kind: EditorWidgetKind;
};

const classifyWidget = (item: EditorCatalogItem): EditorWidgetKind => {
  const label = `${item.id} ${item.label}`.toLowerCase().replace(/[-_]/g, ' ');
  if (item.category === 'layout') return 'layout';
  if (item.category === 'navigation' || /navigation|navbar|menu|breadcrumbs|sitemap|table of contents/.test(label)) return 'navigation';
  if (item.category === 'forms' || /form|booking|appointment|survey|quiz|signup|login|newsletter|contact|demo request/.test(label)) return 'form';
  if (/pricing|plan comparison|subscription/.test(label)) return 'pricing';
  if (/testimonial|review|rating/.test(label)) return 'testimonials';
  if (/faq|accordion|knowledge base|help center/.test(label)) return 'faq';
  if (/timeline|roadmap|milestone|process|steps|changelog/.test(label)) return 'timeline';
  if (/stat|counter|metric|kpi|progress|skill bar/.test(label)) return 'metrics';
  if (/before after/.test(label)) return 'interactive';
  if (/gallery|carousel|slider|masonry|logo wall|logo cloud|avatar group/.test(label)) return 'gallery';
  if (/product|shop|store|catalog|cart|checkout|wishlist|gift card|bundle|delivery slot/.test(label)) return 'commerce';
  if (/blog|article|news|post|resource|story|portfolio|project|case study|author|press|comments|rss/.test(label)) return 'editorial';
  if (/team|people|staff|member|advisor|speaker|founder|ceo/.test(label)) return 'people';
  if (/map|embed|iframe|video|audio|podcast|lottie|calendar|social feed|calendly|typeform/.test(label)) return 'embed';
  if (/table|comparison/.test(label)) return 'table';
  if (item.category === 'buttons' || /button|action|download|share|back to top/.test(label)) return 'actions';
  if (item.category === 'interactive' || /modal|popup|cookie|consent|countdown|toggle|tab|tooltip|parallax|scroll|sticky|hover|animation|confetti|fireworks|starfield/.test(label)) return 'interactive';
  if (/hero|banner|splash|intro|announcement|call to action|cta/.test(label)) return 'hero';
  return 'cards';
};

const defaultItems = (kind: EditorWidgetKind, label: string): Array<Record<string, unknown>> => {
  switch (kind) {
    case 'metrics':
      return [
        { title: 'Projects completed', value: '120+' },
        { title: 'Customer satisfaction', value: '98%' },
        { title: 'Years of experience', value: '8' },
      ];
    case 'testimonials':
      return [
        { title: 'A happy customer', name: 'Jordan Lee', role: 'Customer', quote: 'The team made the whole experience clear and enjoyable.', rating: 5 },
        { title: 'A valued partner', name: 'Taylor Morgan', role: 'Partner', quote: 'Thoughtful work, excellent communication, and a great result.', rating: 5 },
      ];
    case 'faq':
      return [
        { title: 'How does it work?', description: 'Get started in a few simple steps. Contact us if you need help.' },
        { title: 'How can I learn more?', description: 'Send us a message and our team will be happy to help.' },
      ];
    case 'timeline':
      return [
        { title: 'Discover', date: 'Step 1', description: 'Share your goals and the outcome you want to achieve.' },
        { title: 'Create', date: 'Step 2', description: 'Shape the plan, review the details, and make it yours.' },
        { title: 'Launch', date: 'Step 3', description: 'Put your work into the world and keep improving.' },
      ];
    case 'pricing':
      return [
        { title: 'Starter', price: '$19', interval: '/ month', description: 'A simple place to begin.', features: ['Core features', 'Email support'] },
        { title: 'Growth', price: '$49', interval: '/ month', description: 'More room to grow.', features: ['Everything in Starter', 'Priority support', 'Advanced tools'], highlighted: true },
        { title: 'Custom', price: 'Let’s talk', interval: '', description: 'A plan shaped around your needs.', features: ['Flexible scope', 'Dedicated guidance'] },
      ];
    case 'gallery':
      return [
        { title: 'First highlight', description: 'Add an image URL and describe what visitors should notice.', image: '', alt: 'First gallery item' },
        { title: 'Second highlight', description: 'Show another detail, project, or product.', image: '', alt: 'Second gallery item' },
        { title: 'Third highlight', description: 'Complete the collection with one more visual.', image: '', alt: 'Third gallery item' },
      ];
    case 'navigation':
      return [
        { title: 'Home', href: '/' },
        { title: 'About', href: '#about' },
        { title: 'Contact', href: '#contact' },
      ];
    case 'form':
      return [
        { title: 'Name', name: 'name', type: 'text', required: true },
        { title: 'Email', name: 'email', type: 'email', required: true },
        { title: 'Message', name: 'message', type: 'textarea', required: true },
      ];
    case 'commerce':
      return [
        { title: 'Everyday essential', category: 'Featured', price: '$29', description: 'A considered pick, chosen for everyday use.', image: '', href: '#item-1' },
        { title: 'Customer favorite', category: 'Popular', price: '$49', description: 'A dependable choice with thoughtful details.', image: '', href: '#item-2' },
        { title: 'New arrival', category: 'New', price: '$39', description: 'A fresh addition to explore.', image: '', href: '#item-3' },
      ];
    case 'editorial':
      return [
        { title: 'A useful guide to getting started', category: 'Guide', description: 'Share a practical idea visitors can put to use today.', image: '', author: 'Editorial team', date: 'New' },
        { title: 'What we learned along the way', category: 'Story', description: 'Tell a short story and invite readers to explore.', image: '', author: 'Editorial team', date: 'Featured' },
      ];
    case 'people':
      return [
        { title: 'Alex Morgan', role: 'Creative director', description: 'Brings strategy and craft together to make useful work.', image: '', alt: 'Portrait of Alex Morgan' },
        { title: 'Jamie Lee', role: 'Project lead', description: 'Keeps every detail moving with care and clarity.', image: '', alt: 'Portrait of Jamie Lee' },
        { title: 'Sam Rivera', role: 'Design partner', description: 'Turns thoughtful ideas into welcoming experiences.', image: '', alt: 'Portrait of Sam Rivera' },
      ];
    case 'embed':
      return [{ title: 'Embedded content', description: 'Paste a secure HTTPS URL in the inspector to configure this embed.', url: '' }];
    case 'table':
      return [
        { title: 'Option A', description: 'Add the key details here.', status: 'Included' },
        { title: 'Option B', description: 'Compare another option.', status: 'Available' },
      ];
    case 'actions':
      return [
        { title: 'Get started', href: '#contact' },
        { title: 'Learn more', href: '#about' },
      ];
    case 'interactive':
      return [
        { title: 'First option', description: 'Add the details visitors need to make a choice.' },
        { title: 'Second option', description: 'Offer a second path or supporting detail.' },
      ];
    case 'layout':
      return [];
    case 'hero':
    case 'cards':
      return [
        { title: 'A thoughtful first highlight', description: `Use this ${label.toLowerCase()} to explain a key benefit or idea.` },
        { title: 'A helpful next step', description: 'Add supporting details, an image, or a link for visitors.' },
        { title: 'Made to work for you', description: 'Customize this item or add more from the inspector.' },
      ];
  }
};

export function getEditorWidgetDefinition(id: string): EditorWidgetDefinition | undefined {
  return widgetsById.get(id);
}

export function createEditorWidgetContent(id: string): Record<string, unknown> | undefined {
  const widget = getEditorWidgetDefinition(id);
  if (!widget) return undefined;
  const content: Record<string, unknown> = {
    blockType: widget.id,
    widgetKind: widget.kind,
    title: widget.label,
    description: widget.description,
    items: defaultItems(widget.kind, widget.label),
  };
  if (widget.kind === 'hero') {
    content.eyebrow = 'A better way forward';
    content.buttonText = 'Get started';
    content.href = '#contact';
  }
  if (widget.kind === 'form') {
    const newsletter = /newsletter|subscribe/i.test(widget.label);
    content.endpoint = newsletter ? 'newsletter' : 'contact';
    content.items = newsletter
      ? [{ title: 'Email', name: 'email', type: 'email', required: true }]
      : defaultItems(widget.kind, widget.label);
    content.submitLabel = newsletter ? 'Subscribe' : 'Send message';
    content.successMessage = 'Thanks. Your response has been received.';
  }
  if (widget.kind === 'gallery') {
    content.columns = 3;
    content.autoplay = /carousel|slider/i.test(widget.label);
    content.intervalMs = 4000;
  }
  if (widget.kind === 'interactive' && /countdown/i.test(widget.label)) content.seconds = 3600;
  if (widget.kind === 'interactive' && /before.?after/i.test(widget.label)) {
    content.beforeImage = '';
    content.afterImage = '';
    content.position = 50;
  }
  return content;
}

export function getEditorWidgetDefinitions(): EditorWidgetDefinition[] {
  return [...widgetsById.values()];
}

const widgetsById = new Map(editorCatalog.map((item) => [item.id, { ...item, kind: classifyWidget(item) }]));
