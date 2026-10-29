import { extraCatalogItems } from './editorCatalogExtras.ts';

export type EditorPlan = 'free' | 'pro';
export type EditorPaletteCategory = 'layout' | 'text' | 'buttons' | 'media' | 'navigation' | 'parts' | 'forms' | 'interactive';
export type EditorCatalogItem = { id: string; label: string; description: string; category: EditorPaletteCategory; plan: EditorPlan };

const free = (category: EditorPaletteCategory, entries: Array<[string, string, string]>): EditorCatalogItem[] => entries.map(([id, label, description]) => ({ id, label, description, category, plan: 'free' }));
const pro = (category: EditorPaletteCategory, entries: Array<[string, string, string]>): EditorCatalogItem[] => entries.map(([id, label, description]) => ({ id: `pro:${id}`, label, description, category, plan: 'pro' }));

const editorCatalogCore: EditorCatalogItem[] = [
  ...free('layout', [
    ['layout:section', 'Section', 'Add a full-width section.'], ['layout:columns-1', 'Container', 'Add a single-column content container.'],
    ['layout:columns-2', '2-column row', 'Add a responsive two-column row.'], ['layout:columns-3', '3-column row', 'Add a responsive three-column row.'], ['layout:columns-4', '4-column row', 'Add a responsive four-column row.'],
    ['basic:spacer', 'Spacer', 'Add vertical space.'], ['basic:divider', 'Divider', 'Separate content with a rule.'], ['free:anchor', 'Anchor point', 'Add a named target for in-page links.'],
  ]),
  ...free('text', [
    ['basic:heading', 'Heading H1–H6', 'Add a heading and choose its level in properties.'], ['basic:text', 'Paragraph', 'Add editable body text.'], ['basic:rich-text', 'Rich text', 'Add formatted text content.'],
    ['free:quote', 'Quote', 'Add a styled quotation.'], ['basic:list', 'Bullet list', 'Add an editable list.'], ['free:numbered-list', 'Numbered list', 'Add a numbered list.'], ['free:badge', 'Badge / tag', 'Add a compact label.'],
  ]),
  ...free('buttons', [
    ['basic:button', 'Button', 'Add a button with URL, page, anchor, email, or phone action.'], ['free:text-link', 'Text link', 'Add a text link.'], ['free:social-links', 'Social links', 'Add social profile links.'],
  ]),
  ...free('media', [
    ['basic:image', 'Image', 'Add an image with alt text.'], ['free:image-caption', 'Image with caption', 'Add an image and editable caption.'], ['basic:icon', 'Icon', 'Add a decorative icon.'], ['free:icon-box', 'Icon box', 'Add an icon with a title and description.'], ['free:logo', 'Logo', 'Add a logo image.'], ['basic:gallery', 'Basic gallery', 'Add an image grid with a lightbox.'],
  ]),
  ...free('navigation', [
    ['free:navbar', 'Navbar', 'Add a basic responsive navigation bar.'], ['free:mobile-menu', 'Mobile menu', 'Add a responsive page menu.'], ['free:footer-menu', 'Footer menu', 'Add footer navigation links.'], ['free:breadcrumbs', 'Breadcrumbs', 'Show the page path.'],
  ]),
  ...free('parts', [
    ['hero', 'Hero', 'Headline, intro, and actions.'], ['features', 'Features', 'Grid or list of benefits.'], ['steps', 'Steps / how it works', 'Explain a process step by step.'], ['stats', 'Stats / counters', 'Highlight business results.'], ['testimonials', 'Testimonials', 'Show customer quotes.'], ['faq', 'FAQ accordion', 'Answer common questions.'], ['cta', 'CTA banner', 'Invite visitors to take action.'], ['team', 'Team', 'Introduce your team.'], ['pricing', 'Simple pricing table', 'Display pricing plans.'], ['contact', 'Contact section', 'Basic contact form section.'], ['newsletter', 'Newsletter signup', 'Collect newsletter signups.'], ['announcement', 'Announcement bar', 'Share a short announcement.'], ['image-text', 'About / image and text', 'Pair an image with your story.'], ['rich-text', 'Rich text section', 'Add a content section.'],
    ['free:services', 'Services', 'List services and descriptions.'], ['free:logo-cloud', 'Logo cloud', 'Show partner or client logos.'], ['free:not-found', '404 page', 'Add a custom not-found page section.'],
  ]),
  ...free('forms', [
    ['basic:form', 'Contact form', 'Collect name, email, and message details.'], ['free:newsletter-form', 'Newsletter form', 'Collect email signups.'],
  ]),
  ...free('interactive', [
    ['free:accordion', 'Accordion', 'Expandable content rows.'], ['free:tabs', 'Tabs', 'Switch between simple content panels.'], ['free:scroll-fade', 'Scroll animation · Fade', 'Fade this section in as visitors scroll.'], ['free:scroll-slide', 'Scroll animation · Slide', 'Slide this section in as visitors scroll.'],
  ]),
  ...pro('layout', [
    ['sticky-container', 'Sticky / overlay container', 'Keep a container fixed while scrolling.'], ['tabs-container', 'Tabs container', 'Group content into connected tabs.'], ['grouped-sections', 'Grouped sections', 'Manage multiple sections as one reusable group.'], ['global-block', 'Reusable / global block', 'Reuse synced content across pages.'],
  ]),
  ...pro('text', [
    ['typewriter', 'Typewriter text', 'Animate text as it appears.'], ['marquee', 'Marquee / ticker', 'Scroll text continuously.'], ['counter', 'Animated counter', 'Count up to a value.'], ['code', 'Code block', 'Show formatted code.'], ['table', 'Table', 'Add a structured data table.'], ['rich-embed', 'Rich content with embeds', 'Combine text and supported embeds.'],
  ]),
  ...pro('buttons', [
    ['button-group', 'Button group', 'Arrange related actions together.'], ['floating-action', 'Floating action button', 'Keep a primary action visible.'], ['download-button', 'Download button', 'Link to a downloadable file.'], ['back-to-top', 'Back to top', 'Add a scroll-to-top control.'],
  ]),
  ...pro('media', [
    ['carousel-gallery', 'Carousel gallery', 'Image carousel with autoplay, arrows, and dots.'], ['masonry-gallery', 'Masonry gallery', 'Arrange images in a masonry layout.'], ['before-after', 'Before / after slider', 'Compare two images with a draggable divider.'], ['background-video', 'Background video', 'Use a video behind section content.'], ['audio-player', 'Audio player', 'Embed an audio track.'], ['lottie', 'Lottie animation', 'Play a Lottie animation.'], ['svg-upload', 'SVG image', 'Upload a vector image.'], ['stock-photos', 'Stock photo picker', 'Browse and insert stock images.'], ['image-editing', 'Image crop and focal point', 'Crop and position image subjects.'], ['logo-carousel', 'Logo carousel', 'Scroll a row of brand logos.'], ['avatar-group', 'Avatar group', 'Show a group of profile images.'], ['youtube-vimeo', 'Video embed', 'Embed YouTube or Vimeo.'], ['google-map', 'Google Map', 'Embed a map.'],
  ]),
  ...pro('navigation', [
    ['mega-menu', 'Mega menu', 'Build a multi-column dropdown menu.'], ['transparent-navbar', 'Transparent navbar', 'Overlay navigation on hero content.'], ['sidebar-menu', 'Sidebar menu', 'Add persistent side navigation.'], ['pagination', 'Pagination', 'Navigate large content lists.'], ['table-of-contents', 'Table of contents', 'Link to headings on the page.'], ['language-switcher', 'Language switcher', 'Switch between localized pages.'],
  ]),
  ...pro('parts', [
    ['video-hero', 'Hero with video background', 'Add a video background to a hero.'], ['testimonial-carousel', 'Testimonial carousel', 'Rotate customer reviews.'], ['review-breakdown', 'Reviews with ratings', 'Show a star rating breakdown.'], ['pricing-toggle', 'Pricing with billing toggle', 'Switch monthly and yearly prices.'], ['comparison-table', 'Pricing comparison', 'Compare plan features.'], ['timeline', 'Timeline', 'Show milestones in sequence.'], ['portfolio-grid', 'Portfolio grid', 'Showcase selected projects.'], ['case-study', 'Case study', 'Tell a detailed customer story.'], ['project-detail', 'Project detail', 'Add a project page layout.'], ['popup', 'Popup / modal', 'Open a custom dialog.'], ['cookie-banner', 'Cookie banner', 'Show cookie preferences.'], ['countdown', 'Countdown timer', 'Count down to an event.'], ['progress-bar', 'Progress bar', 'Show completion or progress.'], ['newsletter-popup', 'Newsletter popup', 'Prompt visitors to subscribe.'], ['exit-popup', 'Exit-intent popup', 'Show an offer when visitors leave.'], ['html-block', 'Sandboxed HTML', 'Embed isolated custom HTML.'],
  ]),
  ...pro('forms', [
    ['advanced-form', 'Advanced form builder', 'Select, radio, checkbox, date, file, rating, and hidden fields.'], ['multi-step-form', 'Multi-step form', 'Split a long form into steps.'], ['booking-form', 'Booking / appointment form', 'Collect availability and booking details.'], ['survey', 'Survey / quiz', 'Build a scored or branching survey.'], ['auth-form', 'Login / signup form', 'Add account access forms.'], ['search-bar', 'Search bar', 'Search site content.'], ['form-inbox', 'Submissions inbox', 'Review submissions and export CSV.'],
  ]),
  ...pro('parts', [
    ['product-card', 'Product card', 'Show price, stock, and add-to-cart.'], ['product-grid', 'Product grid', 'Browse products in a grid.'], ['product-slider', 'Product slider', 'Scroll through products.'], ['featured-product', 'Featured product', 'Highlight one product.'], ['product-detail', 'Product detail', 'Variants, quantity, gallery, and cart actions.'], ['category-tiles', 'Category tiles', 'Link to product categories.'], ['product-filters', 'Filter and sort controls', 'Filter, sort, and search products.'], ['mini-cart', 'Mini cart', 'Show the current cart summary.'], ['cart-drawer', 'Cart drawer', 'Open the shopping cart in a side drawer.'], ['cart-modal', 'Cart modal', 'Open the shopping cart in a modal dialog.'], ['cart-button', 'Cart button', 'Add a button that opens the cart.'], ['cart-page', 'Cart page', 'Review cart items.'], ['checkout', 'Checkout form', 'Collect shipping and payment details.'], ['wishlist', 'Wishlist', 'Save products for later.'], ['compare-products', 'Compare products', 'Compare selected products.'], ['related-products', 'Related products', 'Recommend similar products.'], ['recently-viewed', 'Recently viewed', 'Show browsing history.'], ['stock-indicator', 'Stock indicator', 'Show inventory status.'], ['sale-badge', 'Sale badge', 'Highlight a discounted price.'], ['size-guide', 'Size guide', 'Explain product sizing.'], ['gift-card', 'Gift card', 'Offer digital gift cards.'], ['subscriptions', 'Subscription plans', 'Sell recurring plans.'], ['delivery-slots', 'Delivery slot picker', 'Choose a delivery window.'], ['bundle-builder', 'Bundle builder', 'Let customers assemble a bundle.'], ['blog-grid', 'Blog post grid', 'List articles by category.'], ['blog-card', 'Featured blog post', 'Highlight an article.'], ['blog-detail', 'Blog post detail', 'Show a complete article.'], ['author-box', 'Author box', 'Add author information.'], ['blog-categories', 'Blog categories and tags', 'Browse posts by topic.'], ['related-posts', 'Related posts', 'Recommend more articles.'], ['comments', 'Comments', 'Collect and display comments.'], ['share-buttons', 'Share buttons', 'Share the current page.'], ['rss', 'RSS link', 'Link to the site feed.'], ['social-feed', 'Social feed', 'Embed Instagram or X posts.'], ['calendly', 'Calendly / Typeform embed', 'Embed a booking or form service.'], ['payments', 'Stripe / PayPal button', 'Add a hosted payment action.'], ['iframe', 'Custom iframe', 'Embed an external page.'], ['chat-widget', 'Chat widget', 'Add a support chat launcher.'], ['analytics', 'Analytics scripts', 'Configure analytics and pixel scripts.'],
  ]),
  ...pro('interactive', [
    ['tooltip', 'Tooltip', 'Show contextual helper text.'], ['modal', 'Modal', 'Open interactive dialog content.'], ['parallax', 'Parallax background', 'Move the background at a different scroll speed.'], ['hover-effects', 'Advanced hover effects', 'Animate element states on hover.'], ['toggle', 'Toggle switch', 'Switch between paired content states.'], ['deep-link-tabs', 'Deep-link tabs', 'Link directly to a selected tab.'],
  ]),
];

const describeCatalogItem = (label: string, category: EditorPaletteCategory): string => {
  const normalized = label.toLowerCase();
  if (/hero/.test(normalized)) return 'Build a hero section with a clear headline, supporting message, and strong call-to-action.';
  if (/tab|tabs|feature/.test(normalized)) return 'Group related content into clear tabs or benefit panels with concise labels.';
  if (/pricing|plan|subscription/.test(normalized)) return 'Show pricing options, compare plans, and guide visitors toward the right tier.';
  if (/faq|help|knowledge|glossary/.test(normalized)) return 'Answer common questions in a clear, scannable format that helps visitors decide quickly.';
  if (/timeline|roadmap|milestone|process/.test(normalized)) return 'Explain a step-by-step journey or rollout with dates, milestones, and clear progress.';
  if (/testimonial|review|quote|founder|ceo|speaker|author|bio/.test(normalized)) return 'Highlight a trusted perspective or personal story with a readable quote and attribution.';
  if (/gallery|grid|logo|carousel|image/.test(normalized)) return 'Arrange images, product shots, or brand visuals into an editorial, scannable showcase.';
  if (/newsletter|form|contact|demo|signup|booking|calendly|typeform/.test(normalized)) return 'Collect leads or inquiry details with a straightforward conversion-focused form.';
  if (/navigation|menu|breadcrumb|table of contents/.test(normalized)) return 'Add navigational structure that helps visitors move through the page with confidence.';
  if (/button|chat|share|download|copy/.test(normalized)) return 'Add a user action that guides visitors toward the next meaningful step.';
  if (/calendar|event/.test(normalized)) return 'Display time-based information in an easy-to-scan format for bookings, launches, or updates.';
  if (/compare|comparison|rank|leaderboard/.test(normalized)) return 'Compare options in a sharp, structured layout that makes differences easy to understand.';
  if (/partner|integrations|awards|resource/.test(normalized)) return 'Present trust signals, references, or supporting content in a polished proof section.';
  switch (category) {
    case 'layout': return 'Add this layout block, then adjust its content, spacing, and responsive style in the inspector.';
    case 'text': return 'Add editable text and tune its typography, alignment, and color in the inspector.';
    case 'buttons': return 'Add an action control and choose its page, anchor, contact, download, or URL destination.';
    case 'media': return 'Add media content, upload or link assets, and set accessible labels and display options.';
    case 'navigation': return 'Add a navigation element and configure its links and presentation in the inspector.';
    case 'parts': return 'Add this editable section pattern and customize its content, imagery, actions, and style.';
    case 'forms': return 'Add a form block, configure its fields and validation, then choose where submissions are sent.';
    case 'interactive': return 'Add an interactive element and configure its content, trigger, and behavior in the inspector.';
  }
};

export const editorCatalog: EditorCatalogItem[] = [
  ...editorCatalogCore,
  ...extraCatalogItems.filter((extra) => !editorCatalogCore.some((item) => item.label.toLocaleLowerCase() === extra.label.toLocaleLowerCase())),
].map((item) => {
  const label = item.label.charAt(0).toUpperCase() + item.label.slice(1);
  const placeholderDescription = /^Add widget:/i.test(item.description);
  return {
    ...item,
    label,
    description: placeholderDescription ? describeCatalogItem(item.label, item.category) : item.description,
    plan: item.id.startsWith('pro:') ? 'pro' as const : item.plan,
  };
});

export const paletteCategories: Array<{ id: EditorPaletteCategory; label: string }> = [
  { id: 'layout', label: 'Layout' }, { id: 'text', label: 'Text' }, { id: 'buttons', label: 'Buttons' }, { id: 'media', label: 'Media' },
  { id: 'navigation', label: 'Navigation' }, { id: 'parts', label: 'Parts' }, { id: 'forms', label: 'Forms' }, { id: 'interactive', label: 'Interactive' },
];

export function getEditorCatalogItem(id: string) { return editorCatalog.find((item) => item.id === id); }
