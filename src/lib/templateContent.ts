import { makeSection, type Section } from '@/lib/siteDocument';

type StoreProduct = { name: string; category: string; price: number; detail: string };
export type StorefrontPageSeed = { id: string; slug: string; title: string; description: string; isHome: boolean; showInMenu: boolean; seoTitle: string; noindex: boolean; sections: Section[] };

const freshCopy: Record<string, { title: string; description: string; detail: string }> = {
  home: { title: 'Good food starts close to home.', description: 'Seasonal produce, pantry favorites, and honest food from farms that are part of your neighborhood.', detail: 'Picked nearby. Packed with care. At your door when it suits you.' },
  shop: { title: 'Shop this week’s harvest', description: 'Browse produce picked for flavor, freshness, and the season we are in.', detail: 'Choose a crate, add your staples, then select a delivery window at checkout.' },
  'product-details': { title: 'Meet the Market Morning Crate', description: 'A colorful, flexible box of farm-picked vegetables for easy meals all week.', detail: 'Every crate is packed to order. Swap an item you do not need and add a note for your picker.' },
  offers: { title: 'Good things, gathered together', description: 'Seasonal bundles and smart weekly picks make it easier to fill the kitchen.', detail: 'Bundle pricing is shown upfront. No membership or recurring order required.' },
  recipes: { title: 'Recipes for what is in season', description: 'Simple, flexible ideas that start with what the farms are harvesting now.', detail: 'Each recipe includes a short ingredient list and an option to add the whole basket.' },
  'recipe-detail': { title: 'A bright bowl for busy evenings', description: 'A flexible seasonal recipe built around greens, tomatoes, grains, and a lemony dressing.', detail: 'Prep in 15 minutes, cook in 20, and make the dressing ahead for an even quicker dinner.' },
  blog: { title: 'Notes from the neighborhood', description: 'Meet the growers, learn what is in season, and find small ways to waste less food.', detail: 'Practical stories from the people who grow, pack, and cook with your weekly crate.' },
  'blog-post': { title: 'Why the best produce follows the seasons', description: 'A field note on choosing ingredients at their natural peak and making them go further.', detail: 'Seasonal buying connects your table with local growing rhythms and helps reduce long-distance storage.' },
  cart: { title: 'Your crate', description: 'Review your picks before choosing a delivery window.', detail: 'You can adjust quantities or keep browsing before you check out.' },
  checkout: { title: 'A fresh delivery is nearly yours', description: 'Add your delivery details and choose a time that works for your home.', detail: 'We will confirm your order and delivery window before anything is charged.' },
  'order-confirmation': { title: 'Your order is in good hands', description: 'Thanks for choosing local. We are getting your fresh picks ready.', detail: 'Keep your confirmation handy. We will send a packing and delivery update next.' },
  'order-tracking': { title: 'Follow your crate home', description: 'See the simple steps between farm harvest and your front door.', detail: 'Tracking updates appear as your order is packed, dispatched, and delivered.' },
  account: { title: 'Your kitchen, your preferences', description: 'Keep delivery details, saved addresses, and favorite staples together.', detail: 'A local demo account page is ready to customize for your store.' },
  wishlist: { title: 'Your saved market list', description: 'Keep seasonal finds and everyday favorites close for next time.', detail: 'Saved items stay here while you plan your next crate.' },
  about: { title: 'A shorter journey from field to table', description: 'Fresh Crate connects nearby growers with households looking for food with a clear origin.', detail: 'We work with small farms, bakeries, and makers who care about healthy soil and careful handling.' },
  contact: { title: 'Talk to a real person', description: 'Need help with a crate, an ingredient, or a delivery? Send us a note.', detail: 'Our neighborhood team usually replies within one working day.' },
  faq: { title: 'Good questions, clear answers', description: 'Learn how ordering, delivery, substitutions, and seasonal availability work.', detail: 'If you need help with a specific order, the contact page is always open.' },
  'delivery-areas': { title: 'Freshness, close to home', description: 'Check whether your neighborhood is inside our current delivery area.', detail: 'We add nearby routes as local farms and packing partners come on board.' },
  'privacy-terms': { title: 'Clear terms for a thoughtful service', description: 'How we handle account details, order information, and delivery preferences.', detail: 'This starter page is sample policy copy. Replace it with reviewed terms for your business.' },
  '404': { title: 'We could not find that page', description: 'The market may have moved this link. Let us get you back to something fresh.', detail: 'Return home or browse the current harvest.' },
};

const voltCopy: Record<string, { title: string; description: string; detail: string }> = {
  home: { title: 'Gear that earns its place.', description: 'Tested essentials for sharper setups, smoother sessions, and better everyday work.', detail: 'Honest specs. Clear comparisons. Drops worth setting a reminder for.' },
  shop: { title: 'Find your next essential', description: 'Browse audio, desk gear, displays, and accessories by the details that matter.', detail: 'Compare performance and fit before you add a product to your setup.' },
  'product-details': { title: 'Pulse ANC Headphones', description: 'Focused listening with adaptive noise control, balanced sound, and all-day comfort.', detail: 'Choose your finish, review the specifications, and check stock before ordering.' },
  compare: { title: 'Compare the details', description: 'Put the specs side by side and choose the gear that fits your setup.', detail: 'Start with battery life, connection type, dimensions, and the features you will actually use.' },
  deals: { title: 'Current drops and sharp deals', description: 'Limited releases and considered bundles, with clear prices and stock notes.', detail: 'Drop windows and stock are sample content in this template.' },
  bundles: { title: 'Build a setup that works together', description: 'Pair the essentials for a desk, studio, or travel kit in one considered bundle.', detail: 'Choose a starting point, then swap pieces to fit your workflow.' },
  cart: { title: 'Your gear bag', description: 'Review your selected gear before you move to checkout.', detail: 'You can update quantities or return to the shop without losing your list.' },
  checkout: { title: 'Secure your setup', description: 'Add delivery details and review your order before placing it.', detail: 'This template demonstrates a checkout flow. Connect a payment provider before taking payments.' },
  'order-confirmation': { title: 'Order received. Nice choice.', description: 'Your order summary and next steps will appear here after checkout.', detail: 'We will share dispatch and delivery updates as soon as your order moves.' },
  'order-tracking': { title: 'Track your delivery', description: 'Follow your order from confirmation to your setup.', detail: 'Tracking events update as the parcel is prepared, shipped, and delivered.' },
  account: { title: 'Your Launchpad', description: 'Keep your orders, saved gear, and account details in one place.', detail: 'This sample dashboard is ready to connect to your customer account system.' },
  wishlist: { title: 'Saved for your next setup', description: 'Keep interesting gear here while you compare and plan.', detail: 'Saved items make it easy to revisit a drop before it closes.' },
  support: { title: 'Help from people who know the gear', description: 'Get setup advice, warranty guidance, or a hand with an order.', detail: 'Share your model and order number so our support team can get straight to it.' },
  blog: { title: 'Signal / Notes', description: 'Guides, setup ideas, and practical explainers from the Volt Gear team.', detail: 'Read the details behind new releases and learn how to get more from your kit.' },
  'blog-post': { title: 'Build a cleaner desk setup', description: 'A practical guide to choosing a dock, display, and input devices that work together.', detail: 'Start with your daily workflow, then choose the ports, refresh rate, and ergonomics you need.' },
  about: { title: 'Technology should feel useful', description: 'Volt Gear curates everyday electronics around thoughtful design and clear performance.', detail: 'We test the details, explain the tradeoffs, and keep the product story straightforward.' },
  contact: { title: 'Get in touch with Volt Gear', description: 'Questions about a product, an order, or a compatible setup? Send us a message.', detail: 'Include the product name and your device model for the quickest answer.' },
  'store-locator': { title: 'Try the setup in person', description: 'Find a demo partner or pickup point near you.', detail: 'Store locations are sample content; add your verified retail partners before publishing.' },
  'privacy-terms': { title: 'Your information, handled clearly', description: 'Review how account, order, and support information is used.', detail: 'This starter policy page needs your business-specific legal review before launch.' },
  '404': { title: 'Signal lost', description: 'That page is no longer available. Let’s get you back to the latest gear.', detail: 'Return home or browse the current collection.' },
  components: { title: 'The Volt Gear component bench', description: 'A style guide for the store’s cards, badges, specs, and interaction patterns.', detail: 'Use these components consistently across product, support, and editorial pages.' },
};

const freshRecipes = [
  { title: 'Green market bowl', description: 'Spinach, tomatoes, grains, lemon, and a handful of toasted seeds.', price: '25 min · Easy' },
  { title: 'Carrot and herb fritters', description: 'Rainbow carrots, fresh herbs, yogurt, and a crisp pan-fried finish.', price: '35 min · Family favorite' },
  { title: 'Strawberry breakfast toast', description: 'Country sourdough, ripe berries, and whipped honey ricotta.', price: '10 min · No fuss' },
];
const voltArticles = [
  { title: 'The practical guide to USB-C docks', description: 'Check display bandwidth, charging, ports, and compatibility before buying.', price: '6 min read' },
  { title: 'Mechanical switches, explained', description: 'A clear guide to sound, travel, actuation, and hot-swap boards.', price: '8 min read' },
  { title: 'Set up a better video call', description: 'A microphone, light, and camera setup that stays simple and reliable.', price: '5 min read' },
];

function section(id: string, type: string, name: string, content: Record<string, unknown>): Section {
  return makeSection(type, id, name, {}, content);
}

function pageSections(id: string, title: string, description: string, detail: string, products: StoreProduct[], isFresh: boolean): Section[] {
  const items = isFresh ? freshRecipes : voltArticles;
  const collection = products.slice(0, 6).map((product) => ({ title: product.name, name: product.name, description: product.detail, category: product.category, price: `₹${product.price.toLocaleString('en-IN')}`, src: '', alt: product.name }));
  const contentSections: Section[] = [];
  if (id === 'home') {
    contentSections.push(
      section('home-announcement', 'announcement', isFresh ? 'A note from the market' : 'The next drop is almost here', { text: isFresh ? 'Order by Thursday for a weekend delivery slot.' : 'Join the list for early access to the next limited drop.', linkLabel: isFresh ? 'See delivery areas' : 'Explore the drop' }),
      section('home-categories', 'category-tiles', isFresh ? 'Shop by the market' : 'Explore the lineup', { heading: isFresh ? 'Something good for every table' : 'Find your corner of the setup', items: [...new Set(products.map((product) => product.category))].slice(0, 4).map((category) => ({ title: category, description: isFresh ? `Seasonal ${category.toLowerCase()} chosen for this week.` : `Explore tested ${category.toLowerCase()} for your setup.` })) }),
      section('home-best-sellers', 'product-grid', isFresh ? 'Best of this week' : 'Featured gear', { heading: isFresh ? 'A fresh place to start' : 'Gear worth a closer look', description: detail, items: collection.slice(0, 4) }),
      section('home-how-it-works', 'steps', isFresh ? 'From farm to front door' : 'Choose, compare, make it yours', { heading: isFresh ? 'Your market in three easy steps' : 'A better way to build your setup', items: isFresh ? [{ title: 'Pick your crate', desc: 'Start with seasonal produce and add the staples you love.' }, { title: 'Choose a delivery slot', desc: 'Select a local delivery window that fits your week.' }, { title: 'Enjoy what is fresh', desc: 'We pack close to delivery and bring your order to the door.' }] : [{ title: 'Start with a need', desc: 'Choose audio, desk gear, display, or a small upgrade.' }, { title: 'Compare the specs', desc: 'Check compatibility and the features you will use.' }, { title: 'Build your setup', desc: 'Add the right pieces and follow the next drop.' }] }),
      section('home-story', 'image-text', isFresh ? 'A shorter route to good food' : 'Small details make a better setup', { heading: isFresh ? 'Grown nearby, packed with care' : 'Curated for everyday performance', body: isFresh ? 'We partner with nearby farms, makers, and bakers to bring seasonal food to your table with fewer steps and a clear sense of where it came from.' : 'We focus on gear that earns its place: tested basics, useful specifications, and honest guidance for a setup that works better every day.', image: '' }),
    );
    if (isFresh) contentSections.push(section('home-recipes', 'gallery', 'Recipes from the market', { heading: 'A few ideas for the week', description: 'Flexible recipes built around the ingredients arriving now.', items: freshRecipes }));
    contentSections.push(section('home-local-check', 'delivery-checker', isFresh ? 'Check your delivery area' : 'Check your local stock', { heading: isFresh ? 'Is your neighborhood on our route?' : 'Find a nearby demo partner', description: isFresh ? 'Enter your postal code at checkout to see available routes and delivery windows.' : 'Contact the team with your location and we will help you find a place to try the gear.' }));
  } else if (id === 'shop' || id === 'offers' || id === 'deals' || id === 'product-details') {
    contentSections.push(section(`${id}-collection`, 'product-grid', id === 'offers' || id === 'deals' ? 'Featured picks' : 'Shop the collection', { heading: id === 'product-details' ? title : 'Chosen for this week', description: detail, items: id === 'product-details' ? collection.concat(products.slice(6).map((product) => ({ title: product.name, name: product.name, description: product.detail, category: product.category, price: `₹${product.price.toLocaleString('en-IN')}`, src: '', alt: product.name }))) : id === 'offers' || id === 'deals' ? collection.slice(-3).concat(collection.slice(0, 3)) : collection }));
  } else if (id === 'recipes' || id === 'blog') {
    contentSections.push(section(`${id}-stories`, 'gallery', isFresh ? 'From the market kitchen' : 'Field notes and guides', { heading: isFresh ? 'Cook with what is in season' : 'Read the latest notes', description: detail, items }));
  } else if (id === 'recipe-detail' || id === 'blog-post') {
    contentSections.push(section(`${id}-article`, 'rich-text', isFresh ? 'Make it your own' : 'Start with your setup', { heading: isFresh ? 'A little prep goes a long way' : 'The details that matter', body: `${detail}\n\n${description}\n\n${isFresh ? 'Wash and prepare the ingredients, keep the dressing separate, and finish with fresh herbs just before serving.' : 'Check compatibility with your current devices, leave room for future upgrades, and choose the features that support your daily workflow.'}` }));
  } else if (id === 'faq' || id === 'support') {
    contentSections.push(section(`${id}-answers`, 'faq', isFresh ? 'Ordering, answered' : 'Support, answered', { heading: 'Frequently asked questions', items: isFresh ? [{ question: 'When are orders packed?', answer: 'We pack orders close to delivery so produce spends less time in storage.' }, { question: 'Can I change a crate?', answer: 'Yes. Swap an item or add a note before the order cutoff shown at checkout.' }, { question: 'What if something is missing?', answer: 'Send our team your order number and we will make it right.' }] : [{ question: 'How do I check compatibility?', answer: 'Compare the listed ports, operating systems, and power requirements with your devices.' }, { question: 'How do I start a warranty request?', answer: 'Send the product model and order number through the support form.' }, { question: 'Can I update an order?', answer: 'Contact support as soon as possible and include the order reference.' }] }));
  } else if (id === 'contact') {
    contentSections.push(section(`${id}-form`, 'contact', 'Send us a note', { heading: 'How can we help?', description, submitLabel: 'Send message', successMessage: 'Thanks — your message is on its way.' }));
  } else if (id === 'delivery-areas' || id === 'store-locator') {
    contentSections.push(section(`${id}-locations`, 'rich-text', isFresh ? 'Check your delivery route' : 'Demo and pickup partners', { heading: isFresh ? 'Growing our local routes' : 'Find a local demo', body: isFresh ? 'Enter your postal code at checkout to see available delivery windows. We currently serve neighborhoods within our farm partners’ daily routes and add new areas as capacity grows.' : 'Visit a demo partner to try products in person. Contact our team before traveling to confirm stock and opening hours.' }));
  } else if (id === 'cart' || id === 'checkout' || id === 'account' || id === 'wishlist' || id === 'compare' || id === 'bundles' || id === 'order-tracking' || id === 'order-confirmation') {
    contentSections.push(section(`${id}-guide`, 'steps', id === 'checkout' ? 'A clear checkout' : 'Your next steps', { heading: id === 'order-tracking' ? 'Order progress' : id === 'order-confirmation' ? 'What happens next' : 'Simple, from here', items: isFresh ? [{ title: 'Review your picks', desc: 'Check quantities and add a note for your picker.' }, { title: 'Choose a delivery window', desc: 'Select a slot that works for your household.' }, { title: 'Get your update', desc: 'Follow packing and delivery from your order page.' }] : [{ title: 'Review your gear', desc: 'Check the model, finish, and quantity.' }, { title: 'Confirm your details', desc: 'Add the right delivery and contact information.' }, { title: 'Follow the order', desc: 'Check dispatch and delivery updates in your account.' }] }));
  } else if (id === 'components') {
    contentSections.push(section(`${id}-patterns`, 'features', 'Reusable shop patterns', { heading: 'A consistent system', items: [{ title: 'Product cards', desc: 'Price, availability, and a direct action in one scan.' }, { title: 'Spec chips', desc: 'Compact facts that help shoppers compare.' }, { title: 'Deal badges', desc: 'Use clear labels for limited stock and promotions.' }] }));
  } else if (id === '404') {
    contentSections.push(section(`${id}-home`, 'not-found', 'Back to the shop', { heading: 'Nothing on this route', description: 'The page might have moved, but the current collection is ready to explore.', buttonText: 'Back home' }));
  } else if (id === 'privacy-terms') {
    contentSections.push(section(`${id}-policy`, 'rich-text', 'Privacy and terms', { heading: 'How this starter site is organized', body: 'Explain the information you collect, why you use it, how long it is kept, and how customers can request access or deletion. Add your shipping, returns, warranty, and cancellation terms here. Replace this starter copy with policies reviewed for your business and location.' }));
  } else if (id === 'about') {
    contentSections.push(section(`${id}-story`, 'image-text', isFresh ? 'Good food, grown nearby' : 'Useful technology, chosen carefully', { heading: isFresh ? 'A neighborhood market with a shorter route' : 'A smaller, better-curated gear shelf', body: description, image: '' }));
  } else {
    contentSections.push(section(`${id}-highlights`, 'features', 'A few details to know', { heading: 'Made to make the next step simple', items: [{ title: isFresh ? 'Picked with care' : 'Specs you can compare', desc: detail }, { title: 'Clear choices', desc: 'Helpful information is easy to find before you decide.' }, { title: 'Support when you need it', desc: 'Reach the team with a specific question and get a useful answer.' }] }));
  }

  const announcement = id === 'home' ? contentSections.filter((entry) => entry.type === 'announcement') : [];
  return [
    ...announcement,
    section(`${id}-hero`, 'hero', title, { badge: isFresh ? 'FRESH CRATE / LOCAL MARKET' : 'VOLT GEAR / FIELD TESTED', title, heading: title, description, ctaPrimary: id === '404' ? 'Go to home' : isFresh ? 'Shop the harvest' : 'Browse the drop', ctaSecondary: isFresh ? 'How delivery works' : 'Compare gear' }),
    ...contentSections.filter((entry) => entry.type !== 'announcement'),
    section(`${id}-why`, 'features', isFresh ? 'Good from the ground up' : 'Built around useful details', { heading: isFresh ? 'A better weekly market' : 'Choose with confidence', items: isFresh ? [{ title: 'Know your grower', desc: 'See where seasonal picks come from and how they are handled.' }, { title: 'Flexible by design', desc: 'Build a crate around the meals and routines you already have.' }, { title: 'Closer delivery', desc: 'Local routes keep the journey short and the produce fresh.' }] : [{ title: 'Useful specifications', desc: 'Compare the facts that change how a product fits your setup.' }, { title: 'Tested picks', desc: 'Every selection has a clear reason to be here.' }, { title: 'Human support', desc: 'Get help from a team that can talk through the details.' }] }),
    section(`${id}-proof`, 'testimonials', isFresh ? 'Good food travels by word of mouth' : 'From people who use the gear', { heading: isFresh ? 'Notes from local tables' : 'Setup feedback', items: isFresh ? [{ quote: 'The greens arrive crisp, and choosing a delivery slot is refreshingly easy.', name: 'Maya R.', role: 'Weekly customer' }, { quote: 'I like knowing which farm packed our crate. The seasonal swaps keep dinner interesting.', name: 'Aarav K.', role: 'Neighborhood customer' }] : [{ quote: 'The comparison details helped me choose a dock that actually works with my displays.', name: 'Nico P.', role: 'Creator' }, { quote: 'A focused collection with enough detail to buy confidently.', name: 'Sam T.', role: 'Customer' }] }),
    section(`${id}-faq`, 'faq', 'Before you decide', { heading: isFresh ? 'A few market questions' : 'A few gear questions', items: [{ question: isFresh ? 'Can I change my order?' : 'How do I check compatibility?', answer: isFresh ? 'Yes, make updates before the order cutoff listed for your delivery.' : 'Review the specifications and contact support with your device model if you need help.' }, { question: 'How can I get help?', answer: 'Use the contact page and share the details of what you are trying to do.' }] }),
    section(`${id}-newsletter`, 'newsletter', 'Keep in the loop', { heading: isFresh ? 'A little good news from the market' : 'Get the next drop note', description: isFresh ? 'Seasonal picks, recipes, and delivery updates in one occasional email.' : 'New releases, useful guides, and limited drop reminders. No noise.', submitLabel: 'Sign me up', successMessage: 'You are on the list.' }),
    section(`${id}-cta`, 'cta', 'Ready for the next step?', { title: isFresh ? 'Bring the market closer.' : 'Build a setup that fits.', desc: isFresh ? 'Choose what looks good and we will take care of the short journey home.' : 'Browse the latest gear and compare the details that matter to you.', buttonText: isFresh ? 'Shop this week' : 'Explore the drop' }),
  ];
}

export function createStorefrontPages(templateId: string, pageNames: string[], products: StoreProduct[] = []): StorefrontPageSeed[] {
  const isFresh = templateId === 'fresh-crate';
  const copy = isFresh ? freshCopy : voltCopy;
  const pages = pageNames.map((title, index) => {
    const id = index === 0 ? 'home' : title.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const pageCopy = copy[id] || { title, description: `Explore ${title.toLowerCase()} at ${isFresh ? 'Fresh Crate' : 'Volt Gear'}.`, detail: 'Helpful details, clear next steps, and support when you need it.' };
    return {
      id, slug: id === 'home' ? '/' : `/${id}`, title: pageCopy.title, description: pageCopy.description,
      isHome: id === 'home', showInMenu: !['home', 'product-details', 'recipe-detail', 'blog-post', 'order-confirmation', '404', 'privacy-terms'].includes(id),
      seoTitle: `${pageCopy.title} | ${isFresh ? 'Fresh Crate' : 'Volt Gear'}`, noindex: id === '404',
      sections: id === 'home'
        ? [section('home-navigation', 'nav', 'Header navigation', { cta: isFresh ? 'Shop the harvest' : 'Shop the drop' }), ...pageSections(id, pageCopy.title, pageCopy.description, pageCopy.detail, products, isFresh), section('home-footer', 'footer', 'Store footer', { copyright: `© ${isFresh ? 'Fresh Crate' : 'Volt Gear'}`, links: ['Shop', 'About', 'Contact', 'Privacy & Terms'] })]
        : pageSections(id, pageCopy.title, pageCopy.description, pageCopy.detail, products, isFresh),
    };
  });
  const productPages = products.map((product) => {
    const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `product-${productSlug}`;
    const description = `${product.detail} ${isFresh ? 'Sourced for this week’s market and packed close to delivery.' : 'Selected for dependable everyday performance and a clean setup.'}`;
    const sections = [
      section(`${id}-hero`, 'hero', product.name, { badge: product.category.toUpperCase(), title: product.name, heading: product.name, description, ctaPrimary: 'Add to bag', ctaSecondary: 'View delivery details' }),
      section(`${id}-overview`, 'rich-text', 'Product overview', { heading: 'The details', body: `${product.detail}\n\n${isFresh ? 'Harvest and availability can vary slightly with the season. Your order is packed to keep this item fresh for the route.' : 'Review the specifications and compatibility notes before ordering. Product information is provided to make comparing options simple.'}\n\nPrice: ₹${product.price.toLocaleString('en-IN')}\nCategory: ${product.category}` }),
      section(`${id}-highlights`, 'features', 'Why it belongs in your basket', { heading: isFresh ? 'A fresh pick for the week' : 'Made to work in your setup', items: [{ title: product.category, desc: product.detail }, { title: isFresh ? 'Seasonal quality' : 'Clear product details', desc: isFresh ? 'Availability is confirmed when your order is packed.' : 'Key information is easy to review before checkout.' }, { title: 'Helpful support', desc: 'Contact our team if you need guidance before ordering.' }] }),
      section(`${id}-purchase`, 'product-grid', 'You may also like', { heading: 'Pair it with another favorite', items: products.filter((entry) => entry.name !== product.name).slice(0, 4).map((entry) => ({ title: entry.name, name: entry.name, description: entry.detail, price: `₹${entry.price.toLocaleString('en-IN')}`, category: entry.category })) }),
      section(`${id}-faq`, 'faq', 'Product questions', { heading: 'Before you add it', items: [{ question: isFresh ? 'When is this packed?' : 'How do I check compatibility?', answer: isFresh ? 'We confirm seasonal availability while packing your order close to delivery.' : 'Compare the specifications on this page with the devices and accessories you already use.' }, { question: 'Need a hand?', answer: 'Send the product name to our support team and we will help you choose.' }] }),
      section(`${id}-newsletter`, 'newsletter', 'Stay in the loop', { heading: isFresh ? 'Get the next market list' : 'Hear about the next drop', description: isFresh ? 'Receive a short note when seasonal picks and delivery slots are updated.' : 'Get release notes and useful setup guides in your inbox.', submitLabel: 'Sign me up' }),
    ];
    return { id, slug: `/products/${productSlug}`, title: product.name, description, isHome: false, showInMenu: false, seoTitle: `${product.name} | ${isFresh ? 'Fresh Crate' : 'Volt Gear'}`, noindex: false, sections } satisfies StorefrontPageSeed;
  });
  return [...pages, ...productPages];
}
