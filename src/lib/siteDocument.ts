export type Device = 'desktop' | 'tablet' | 'mobile';
export type PageTarget = { type: 'page' | 'url' | 'anchor'; value: string };
export type MenuItem = { id: string; label: string; target: PageTarget; newTab: boolean; children?: MenuItem[] };
export type SectionStyle = {
  padding?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  accentColor?: string;
  borderRadius?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'underline' | 'none';
  animation?: string;
  highlightColor?: string;
  overrides?: Partial<Record<Device, Record<string, string | number>>>;
};
// Section blocks are template-defined; their nested item arrays can contain structured objects.
export type SectionContent = Record<string, unknown>;
export type ElementType = 'heading' | 'text' | 'button' | 'image' | 'video' | 'icon' | 'spacer' | 'divider' | 'form' | 'card' | 'gallery' | 'html' | 'list' | 'block' | 'quote' | 'badge' | 'numbered-list' | 'image-caption' | 'accordion' | 'tabs' | 'social-links' | 'anchor';
export type Responsive<T> = Partial<Record<Device, T>>;
export type ElementStyle = {
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  padding?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  margin?: Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shadow?: string;
  maxWidth?: number;
  width?: number;
  position?: 'static' | 'relative' | 'absolute' | 'sticky';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;
  visibility?: Responsive<boolean>;
  animation?: string;
  customClass?: string;
};
export type ElementPosition = { x: number; y: number; width: number; height: number; rotation: number; zIndex: number };
export type ElementInteraction = { id: string; trigger: 'click' | 'hover' | 'scroll-into-view'; action: 'navigate' | 'scroll-to' | 'open-modal' | 'toggle' | 'copy' | 'play-video' | 'add-to-cart'; target?: string; value?: string; durationMs?: number; delayMs?: number; easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' };
export type SiteElement = { id: string; type: ElementType; name?: string; content: SectionContent; style: ElementStyle; responsive?: Partial<Record<Device, Partial<ElementStyle>>>; position?: Responsive<ElementPosition>; interactions?: ElementInteraction[]; animation?: { entrance?: string; hover?: string; durationMs?: number; delayMs?: number }; hidden?: Responsive<boolean>; locked?: boolean; anchorId?: string; customClass?: string };
export type Column = { id: string; width: Responsive<number>; style: ElementStyle; elements: SiteElement[]; hidden?: Responsive<boolean> };
export type Section = {
  id: string;
  type: string;
  name: string;
  content: SectionContent;
  style: SectionStyle;
  columns?: Column[];
  hidden: Record<Device, boolean>;
  anchorId?: string;
  customClass?: string;
  locked: boolean;
  layoutMode?: 'flow' | 'free';
};
export type CollectionFieldType = 'text' | 'rich-text' | 'image' | 'gallery' | 'number' | 'price' | 'date' | 'boolean' | 'select' | 'reference' | 'url';
export type ContentCollection = { id: string; name: string; fields: Array<{ id: string; name: string; type: CollectionFieldType; required?: boolean; options?: string[] }>; records: Array<{ id: string; values: Record<string, unknown> }> };
export type SitePage = {
  id: string;
  slug: string;
  title: string;
  isHome: boolean;
  showInMenu: boolean;
  seo: { title: string; description: string; ogImage: string; noindex: boolean };
  sections: Section[];
  elements: Array<{ id: string; type: 'image' | 'icon'; name: string; src?: string; icon?: string; x: number; y: number; width: number; height: number }>;
  useSharedHeader: boolean;
  useSharedFooter: boolean;
  oldSlugs: string[];
};
export type Theme = {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
  headingFont: string;
  radius: string;
  buttonStyle: 'solid' | 'outline' | 'pill';
  spacingScale: number;
  darkMode: boolean;
  borderRadius: string;
};
export type SiteAsset = { id: string; name: string; role: 'logo' | 'favicon' | 'product' | 'image' | 'icon'; src: string; alt: string; sizeBytes?: number; width?: number; height?: number; folder?: string };
export type SiteDocument = {
  version: 3;
  id: string;
  name: string;
  templateId: string;
  theme: Theme;
  header: { sticky: boolean; mobileMenu: boolean };
  footer: { enabled: boolean };
  menu: MenuItem[];
  pages: SitePage[];
  assets: SiteAsset[];
  collections: ContentCollection[];
  settings: { subdomain: string; status: 'draft' | 'published'; customCss: string };
  content: {
    hero: Record<string, string>;
    features: Array<{ title: string; desc: string }>;
    testimonials: Array<{ quote: string; name: string; role: string }>;
    cta: { title: string; desc: string; buttonText: string };
  };
};

export type LegacySiteData = {
  siteName?: string;
  name?: string;
  templateId?: string;
  theme?: Partial<Theme>;
  sections?: Array<{ id?: string; name?: string; type?: string }>;
  sectionSpacing?: Record<string, { top?: number; right?: number; bottom?: number; left?: number }>;
  heroContent?: Record<string, string>;
  featuresContent?: Array<{ title: string; desc: string }>;
  testimonialsContent?: Array<{ quote: string; name: string; role: string }>;
  ctaContent?: { title: string; desc: string; buttonText: string };
  assetUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  canvasElements?: SitePage['elements'];
  sitePages?: Array<{ id?: string; title?: string; description?: string }>;
};

const fallbackHero = { badge: 'WELCOME', title: 'Welcome', description: 'A thoughtful experience built with Launchly.', ctaPrimary: 'Get started', ctaSecondary: 'Learn more', stat1Label: '', stat1Value: '', stat2Label: '', stat2Value: '' };
const emptyFeatures: Array<{ title: string; desc: string }> = [];
const emptyTestimonials: Array<{ quote: string; name: string; role: string }> = [];
const defaultCta = { title: 'Ready to get started?', desc: 'Explore what we have made for you.', buttonText: 'Get started' };
const ids = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'page';

export function makeSection(type: string, id: string, name?: string, style: SectionStyle = {}, content: SectionContent = {}): Section {
  return {
    id,
    type,
    name: name || type.charAt(0).toUpperCase() + type.slice(1),
    content,
    style,
    columns: [{ id: `${id}-column-1`, width: { desktop: 12, tablet: 12, mobile: 12 }, style: {}, elements: [{ id: `${id}-block`, type: 'block', content: { blockType: type, ...structuredClone(content) }, style: {} }] }],
    hidden: { desktop: false, tablet: false, mobile: false },
    locked: false,
    layoutMode: 'flow',
  };
}

function normalizeSection(section: Section): Section {
  const columns = structuredClone(section.columns?.length ? section.columns : makeSection(section.type, section.id, section.name, section.style, section.content).columns || []);
  const primaryColumn = columns[0];
  const blockElement = primaryColumn?.elements.find((element) => element.type === 'block');
  if (blockElement) blockElement.content = { blockType: section.type, ...structuredClone(section.content) };
  return { ...section, layoutMode: section.layoutMode || 'flow', columns };
}

function normalizeDocument(document: SiteDocument): SiteDocument {
  return {
    ...document,
    version: 3,
    collections: document.collections || [],
    pages: document.pages.map((page) => ({ ...page, sections: page.sections.map(normalizeSection) })),
  };
}

export function createSiteDocument(input: {
  id: string; name: string; templateId: string; theme: Partial<Theme>; sections: Array<{ id: string; name: string; type: string; content?: SectionContent; style?: SectionStyle; columns?: Column[]; hidden?: Partial<Record<Device, boolean>>; locked?: boolean; anchorId?: string; customClass?: string }>;
  hero: Record<string, string>; features: Array<{ title: string; desc: string }>;
  testimonials: Array<{ quote: string; name: string; role: string }>;
  cta: { title: string; desc: string; buttonText: string };
  sectionSpacing?: Record<string, { top?: number; right?: number; bottom?: number; left?: number }>;
  elements?: SitePage['elements'];
  pages?: Array<{ id: string; title: string; description: string; slug?: string; isHome?: boolean; showInMenu?: boolean; noindex?: boolean; ogImage?: string; seoTitle?: string; useSharedHeader?: boolean; useSharedFooter?: boolean; oldSlugs?: string[]; sections?: Section[] }>;
  assetUrl?: string; logoUrl?: string; faviconUrl?: string;
  assets?: SiteAsset[];
}): SiteDocument {
  const primaryColor = input.theme.primaryColor || '#FF5588';
  const theme: Theme = { primaryColor, secondaryColor: '#111111', bgColor: input.theme.bgColor || '#FFFFFF', surfaceColor: '#FFFFFF', textColor: input.theme.textColor || '#111111', mutedColor: '#737373', fontFamily: input.theme.fontFamily || 'Inter, sans-serif', headingFont: input.theme.fontFamily || 'Inter, sans-serif', radius: input.theme.borderRadius || '16px', borderRadius: input.theme.borderRadius || '16px', buttonStyle: 'solid', spacingScale: 1, darkMode: false, ...input.theme };
  const sections = input.sections.map((entry) => {
    const spacing = input.sectionSpacing?.[entry.id];
    const style: SectionStyle = { ...entry.style, ...(spacing ? { padding: { top: spacing.top || 0, right: spacing.right || 0, bottom: spacing.bottom || 0, left: spacing.left || 0 } } : {}) };
    const defaultContent: SectionContent = entry.type === 'hero' ? input.hero : entry.type === 'features' ? { items: input.features } : entry.type === 'testimonials' ? { items: input.testimonials } : entry.type === 'cta' ? input.cta : {};
    const section = makeSection(entry.type, entry.id, entry.name, style, entry.content && Object.keys(entry.content).length ? entry.content : defaultContent);
    return { ...normalizeSection({ ...section, columns: entry.columns ? structuredClone(entry.columns) : section.columns }), hidden: { ...section.hidden, ...entry.hidden }, locked: entry.locked ?? section.locked, anchorId: entry.anchorId, customClass: entry.customClass };
  });
  const homeMeta = input.pages?.find((page) => page.isHome || page.id === 'home');
  const home: SitePage = { id: 'home', slug: '/', title: homeMeta?.title || 'Home', isHome: true, showInMenu: false, seo: { title: homeMeta?.seoTitle || input.name, description: homeMeta?.description || input.hero.description || '', ogImage: homeMeta?.ogImage || '', noindex: homeMeta?.noindex || false }, sections, elements: input.elements || [], useSharedHeader: true, useSharedFooter: true, oldSlugs: homeMeta?.oldSlugs || [] };
  const additionalPages = (input.pages || []).filter((page) => page.id !== 'home').map((page) => {
    const slug = ids(page.id || page.title);
    const pageSlug = page.slug?.replace(/^\/+/, '') || slug;
    return { id: page.id, slug: `/${pageSlug}`, title: page.title, isHome: false, showInMenu: page.showInMenu !== false, seo: { title: page.seoTitle || page.title, description: page.description, ogImage: page.ogImage || '', noindex: page.noindex || false }, sections: page.sections?.length ? page.sections : [makeSection('hero', `${page.id}-hero`, 'Hero', {}, { title: page.title, description: page.description })], elements: [], useSharedHeader: page.useSharedHeader !== false, useSharedFooter: page.useSharedFooter !== false, oldSlugs: page.oldSlugs || [] } satisfies SitePage;
  });
  const assets: SiteAsset[] = (input.assets || []).filter((asset) => asset.role === 'image' || asset.role === 'icon');
  for (const [role, src] of [['product', input.assetUrl], ['logo', input.logoUrl], ['favicon', input.faviconUrl]] as const) if (src) assets.push({ id: `${role}-asset`, name: role, role, src, alt: role === 'logo' ? `${input.name} logo` : '' });
  return {
    version: 3, id: input.id, name: input.name, templateId: input.templateId, theme,
    header: { sticky: true, mobileMenu: true }, footer: { enabled: true },
    menu: additionalPages.filter((page) => page.showInMenu).map((page) => ({ id: `menu-${page.id}`, label: page.title, target: { type: 'page' as const, value: page.id }, newTab: false })), pages: [home, ...additionalPages], assets, collections: [], settings: { subdomain: ids(input.name), status: 'draft', customCss: '' },
    content: { hero: input.hero, features: input.features, testimonials: input.testimonials, cta: input.cta },
  };
}

export function migrateSiteDocument(raw: unknown, defaults: SiteDocument): SiteDocument {
  if (!raw || typeof raw !== 'object') return defaults;
  const data = raw as LegacySiteData & { document?: unknown; version?: number };
  if (data.document && typeof data.document === 'object' && [1, 2, 3].includes((data.document as { version?: number }).version || 0)) return normalizeDocument(data.document as SiteDocument);
  if ([1, 2, 3].includes(data.version || 0) && Array.isArray((raw as SiteDocument).pages) && (raw as SiteDocument).theme) return normalizeDocument(raw as SiteDocument);
  const doc = structuredClone(defaults);
  doc.name = data.siteName || data.name || doc.name;
  doc.templateId = data.templateId || doc.templateId;
  if (data.theme) doc.theme = { ...doc.theme, ...data.theme, radius: data.theme.borderRadius || doc.theme.radius };
  if (data.sections?.length) {
    doc.pages[0].sections = data.sections.map((item, index) => {
      const section = makeSection(item.type || 'rich-text', item.id || `section-${index + 1}`, item.name);
      const spacing = data.sectionSpacing?.[section.id];
      if (spacing) section.style.padding = { top: spacing.top || 0, right: spacing.right || 0, bottom: spacing.bottom || 0, left: spacing.left || 0 };
      return section;
    });
  }
  doc.content = {
    hero: { ...fallbackHero, ...data.heroContent },
    features: data.featuresContent || emptyFeatures,
    testimonials: data.testimonialsContent || emptyTestimonials,
    cta: { ...defaultCta, ...data.ctaContent },
  };
  doc.assets = [];
  for (const [role, src] of [['product', data.assetUrl], ['logo', data.logoUrl], ['favicon', data.faviconUrl]] as const) if (src) doc.assets.push({ id: `${role}-asset`, name: role, role, src, alt: role === 'logo' ? `${doc.name} logo` : '' });
  doc.pages[0].elements = data.canvasElements || [];
  if (data.sitePages?.length) {
    const home = data.sitePages.find((page) => page.id === 'home' || page.title?.toLowerCase() === 'home');
    if (home) {
      doc.pages[0].title = home.title || 'Home';
      doc.pages[0].seo.description = home.description || doc.pages[0].seo.description;
    }
    for (const legacyPage of data.sitePages) {
      if (legacyPage === home) continue;
      const slug = ids(legacyPage.id || legacyPage.title || 'page');
      if (doc.pages.some((page) => page.slug === `/${slug}`)) continue;
      doc.pages.push({ id: slug, slug: `/${slug}`, title: legacyPage.title || slug, isHome: false, showInMenu: true, seo: { title: legacyPage.title || slug, description: legacyPage.description || '', ogImage: '', noindex: false }, sections: [makeSection('hero', `${slug}-hero`, 'Hero', {}, { title: legacyPage.title || slug, description: legacyPage.description || '' })], elements: [], useSharedHeader: true, useSharedFooter: true, oldSlugs: [] });
    }
  }
  if (data.sitePages?.length && doc.pages.length > 1) doc.menu = doc.pages.filter((page) => !page.isHome && page.showInMenu).map((page) => ({ id: `menu-${page.id}`, label: page.title, target: { type: 'page', value: page.id }, newTab: false }));
  return doc;
}

/** Merge the current editor controls into the canonical document without dropping page-level metadata. */
export function mergeEditorProjection(current: SiteDocument, projection: SiteDocument, activePageId = 'home'): SiteDocument {
  const pages = projection.pages.map((page) => {
    const existing = current.pages.find((candidate) => candidate.id === page.id || (candidate.isHome && page.isHome));
    if (!existing) return page;
    const sections = page.id === activePageId
      ? page.sections.map((section) => {
        const previous = existing.sections.find((candidate) => candidate.id === section.id);
        return previous ? { ...previous, ...section } : section;
      })
      : existing.sections;
    return { ...existing, ...page, slug: existing.isHome ? '/' : page.slug, sections, elements: page.id === activePageId ? page.elements : existing.elements };
  });
  const pageIds = new Set(pages.map((page) => page.id));
  const pageById = new Map(pages.map((page) => [page.id, page]));
  const existingMenu = current.menu
    .filter((item) => item.target.type !== 'page' || (pageIds.has(item.target.value) && pageById.get(item.target.value)?.showInMenu))
    .map((item) => item.target.type === 'page'
      ? { ...item, label: pageById.get(item.target.value)?.title || item.label }
      : item);
  const menuTargets = new Set(existingMenu.filter((item) => item.target.type === 'page').map((item) => item.target.value));
  const menu = [...existingMenu, ...projection.menu.filter((item) => item.target.type !== 'page' || !menuTargets.has(item.target.value))];
  return {
    ...current,
    ...projection,
    header: current.header,
    footer: current.footer,
    settings: { ...current.settings, ...projection.settings, status: current.settings.status },
    menu,
    pages,
  };
}
