'use client';

import { use, useState, useEffect } from 'react';
import type { ElementType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Check, 
  Share2, 
  Edit3, 
  ArrowUpRight, 
  Star, 
  ChevronDown,
  Menu,
  X
  , Heart, Sparkles, Camera, CheckCircle2
} from 'lucide-react';
import { ALL_TEMPLATES, getTemplateById, TEMPLATES } from '@/lib/templates';
import { loadEditorDraft } from '@/lib/editorPersistence';
import { Template } from '@/types';
import type { Column, SiteElement } from '@/lib/siteDocument';
import SiteForm from '@/components/SiteForm';
import ImageCarousel from '@/components/ImageCarousel';
import { getAnimationClass, resolveButtonHref, type ButtonTarget } from '@/lib/elementActions';

type LivePageSection = { id: string; type: string; name: string; content?: Record<string, unknown>; style?: Record<string, unknown>; columns?: Column[]; hidden?: Partial<Record<'desktop' | 'tablet' | 'mobile', boolean>>; anchorId?: string };
type LivePage = { id: string; title: string; description: string; slug?: string; isHome?: boolean; showInMenu?: boolean; oldSlugs?: string[]; sections?: LivePageSection[] };
type LiveMenuItem = { id: string; label: string; target: { type: 'page' | 'url' | 'anchor'; value: string }; newTab?: boolean; children?: LiveMenuItem[] };

function LiveTreeElement({ element, pages, subdomain }: { element: SiteElement; pages: LivePage[]; subdomain: string }) {
  const style: React.CSSProperties = { color: element.style.color, backgroundColor: element.style.backgroundColor, fontFamily: element.style.fontFamily, fontSize: element.style.fontSize, fontWeight: element.style.fontWeight, textAlign: element.style.textAlign, borderRadius: element.style.borderRadius, width: element.style.width ? `${element.style.width}%` : undefined, maxWidth: element.style.maxWidth, marginLeft: element.style.textAlign === 'center' || element.style.textAlign === 'right' ? 'auto' : undefined, marginRight: element.style.textAlign === 'center' || element.style.textAlign === 'left' ? 'auto' : undefined, position: element.style.position, top: element.style.top, right: element.style.right, bottom: element.style.bottom, left: element.style.left, zIndex: element.style.zIndex };
  const text = String(element.content.text || element.content.title || '');
  switch (element.type) {
    case 'heading': { const Heading = `h${Math.max(1, Math.min(6, Number(element.content.level) || 2))}` as ElementType; return <Heading style={style} className="text-3xl font-black">{text || 'Heading'}</Heading>; }
    case 'text': return <p style={style} className="whitespace-pre-wrap leading-relaxed">{text}</p>;
    case 'button': { const target = String(element.content.linkTarget || 'url') as ButtonTarget; const value = String(element.content.linkValue || element.content.href || ''); const href = resolveButtonHref(target, value, pages, `/live/${subdomain}`); return <a href={href} download={target === 'download' ? String(element.content.downloadName || '') || undefined : undefined} target={element.content.newTab ? '_blank' : undefined} rel={element.content.newTab ? 'noreferrer' : undefined} aria-label={String(element.content.ariaLabel || '') || undefined} style={style} className="inline-flex rounded-xl px-5 py-3 font-bold">{text || 'Button'}</a>; }
    case 'form': return <SiteForm id={element.id} content={element.content} style={style} />;
    case 'image': return typeof element.content.src === 'string' && element.content.src ? <Image src={element.content.src} alt={String(element.content.alt || '')} width={1200} height={900} unoptimized className="w-full rounded-xl object-cover" /> : null;
    case 'icon': return typeof element.content.src === 'string' && element.content.src ? <Image src={element.content.src} alt={String(element.content.alt || '')} width={256} height={256} unoptimized style={style} className="h-12 w-12 object-contain" /> : <span aria-hidden="true" style={style} className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">✦</span>;
    case 'video': return typeof element.content.src === 'string' && element.content.src ? <video controls src={element.content.src} className="w-full rounded-xl" /> : null;
    case 'divider': return <hr style={{ borderColor: element.style.borderColor || '#111', borderWidth: element.style.borderWidth || 1 }} />;
    case 'spacer': return <div style={{ height: Number(element.content.height || 48) }} />;
    case 'list': return <ul style={style} className="list-inside list-disc space-y-1">{(Array.isArray(element.content.items) ? element.content.items : []).map((item, index) => <li key={index}>{String(item)}</li>)}</ul>;
    case 'card': return <article style={style} className="rounded-xl border p-5"><h3 className="font-bold">{String(element.content.title || 'Card title')}</h3><p className="mt-2">{String(element.content.description || '')}</p></article>;
    case 'gallery': return <ImageCarousel images={(Array.isArray(element.content.images) ? element.content.images : []).filter((src): src is string => typeof src === 'string')} carousel={Boolean(element.content.carousel)} autoplay={Boolean(element.content.autoplay)} intervalMs={Number(element.content.intervalMs) || 4000} className="w-full" />;
    case 'quote': return <blockquote style={style} className="border-l-4 border-pink py-2 pl-4 text-xl italic">“{text || 'A memorable quote.'}”{Boolean(element.content.attribution) && <cite className="mt-2 block text-sm not-italic">— {String(element.content.attribution)}</cite>}</blockquote>;
    case 'badge': return <span style={style} className="inline-flex rounded-full border border-black/20 bg-yellow px-3 py-1 font-mono text-xs font-bold">{text || 'Badge'}</span>;
    case 'numbered-list': return <ol style={style} className="list-inside list-decimal space-y-1">{(Array.isArray(element.content.items) ? element.content.items : []).map((item, index) => <li key={index}>{String(item)}</li>)}</ol>;
    case 'image-caption': return typeof element.content.src === 'string' && element.content.src ? <figure><Image src={element.content.src} alt={String(element.content.alt || '')} width={1200} height={900} unoptimized className="w-full rounded-xl object-cover"/><figcaption className="mt-2 text-sm opacity-75">{String(element.content.caption || '')}</figcaption></figure> : null;
    case 'anchor': return <span id={element.anchorId || String(element.content.id || '')} className="sr-only">Anchor</span>;
    case 'accordion': return <div className="divide-y divide-black/15">{(Array.isArray(element.content.items) ? element.content.items as Array<Record<string, unknown>> : []).map((item, index) => <details key={index} className="py-3"><summary className="cursor-pointer font-bold">{String(item.title || `Question ${index + 1}`)}</summary><p className="mt-2 text-sm opacity-75">{String(item.description || '')}</p></details>)}</div>;
    case 'tabs': return <LiveTabs items={Array.isArray(element.content.items) ? element.content.items as Array<Record<string, unknown>> : []}/>;
    case 'social-links': return <div className="flex flex-wrap gap-3">{(Array.isArray(element.content.items) ? element.content.items as Array<Record<string, unknown>> : []).map((item, index) => <a key={index} href={String(item.url || '#')} className="font-bold underline">{String(item.title || `Social ${index + 1}`)}</a>)}</div>;
    case 'block': {
      const kind = `${String(element.content.blockType || '')} ${String(element.content.title || '')}`.toLowerCase();
      const items = Array.isArray(element.content.items) ? element.content.items as Array<Record<string, unknown>> : [];
      const heading = String(element.content.title || element.content.blockType || 'Content block');
      if (kind.includes('faq') || kind.includes('accordion')) return <section style={style} className="mx-auto max-w-3xl py-4"><h2 className="mb-5 text-2xl font-black">{heading}</h2><div className="divide-y divide-black/15 border-y border-black/15">{items.map((item,index) => <details key={index} className="group py-4" open={index === 0}><summary className="cursor-pointer list-none font-bold">{String(item.title || `Question ${index + 1}`)}<span aria-hidden="true" className="float-right group-open:rotate-45">＋</span></summary><p className="mt-3 leading-relaxed opacity-75">{String(item.description || item.answer || '')}</p></details>)}</div></section>;
      if (kind.includes('pricing') || kind.includes('plan comparison')) return <section style={style} className="py-5"><h2 className="text-center text-2xl font-black">{heading}</h2>{Boolean(element.content.description) && <p className="mx-auto mt-2 max-w-2xl text-center opacity-75">{String(element.content.description)}</p>}<div className="mt-6 grid gap-4 md:grid-cols-3">{items.map((item,index) => <article key={index} className={`rounded-2xl border-2 p-5 ${item.highlighted ? 'border-black bg-yellow shadow-[4px_4px_0_#000]' : 'border-black/15 bg-white text-black'}`}><h3 className="text-lg font-black">{String(item.title || `Plan ${index + 1}`)}</h3><p className="mt-3 text-3xl font-black">{String(item.price || 'Contact us')}<small className="ml-1 text-xs font-normal">{String(item.interval || '')}</small></p><p className="mt-2 text-sm opacity-75">{String(item.description || '')}</p><ul className="mt-4 space-y-2 text-sm">{(Array.isArray(item.features) ? item.features : []).map((feature,featureIndex) => <li key={featureIndex}>✓ {String(feature)}</li>)}</ul><a href={String(item.href || '#contact')} className="mt-5 inline-flex rounded-lg border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black">{String(item.buttonText || 'Choose plan')}</a></article>)}</div></section>;
      if (kind.includes('testimonial') || kind.includes('review')) return <section style={style} className="py-5"><h2 className="text-center text-2xl font-black">{heading}</h2><div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((item,index) => <figure key={index} className="rounded-2xl border-2 border-black/15 bg-white p-5 text-black"><div aria-label={`${Number(item.rating || 5)} out of 5 stars`} className="text-lg text-amber-500">{'★'.repeat(Math.max(1, Math.min(5, Number(item.rating || 5))))}</div><blockquote className="mt-3 leading-relaxed">“{String(item.quote || item.description || item.desc || '')}”</blockquote><figcaption className="mt-4 border-t border-black/10 pt-3"><strong>{String(item.name || item.title || `Customer ${index + 1}`)}</strong>{Boolean(item.role) && <span className="ml-2 text-sm text-neutral-500">{String(item.role)}</span>}</figcaption></figure>)}</div></section>;
      if (kind.includes('stat') || kind.includes('counter') || kind.includes('kpi')) return <section style={style} className="py-5"><h2 className="text-center text-2xl font-black">{heading}</h2><div className="mt-6 grid gap-4 sm:grid-cols-3">{items.map((item,index) => <article key={index} className="rounded-2xl border-2 border-black/15 bg-white p-5 text-center text-black"><p className="text-3xl font-black text-pink-600">{String(item.value || item.number || '0')}</p><p className="mt-1 font-mono text-xs uppercase tracking-wide text-neutral-500">{String(item.label || item.title || `Result ${index + 1}`)}</p></article>)}</div></section>;
      if (kind.includes('timeline') || kind.includes('steps') || kind.includes('process')) return <section style={style} className="py-5"><h2 className="text-2xl font-black">{heading}</h2><ol className="mt-5 space-y-4 border-l-2 border-pink pl-5">{items.map((item,index) => <li key={index} className="relative rounded-xl border border-black/10 bg-white p-4 text-black before:absolute before:-left-[1.65rem] before:top-5 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-black before:bg-yellow"><span className="font-mono text-[10px] font-bold uppercase text-neutral-500">{String(item.date || `Step ${index + 1}`)}</span><h3 className="mt-1 font-bold">{String(item.title || item.name || 'Milestone')}</h3><p className="mt-1 text-sm text-neutral-600">{String(item.description || item.desc || '')}</p></li>)}</ol></section>;
      return <article style={style} className="overflow-hidden rounded-2xl border-2 border-black/15 bg-white text-black"><header className="border-b border-black/10 px-5 py-4"><h2 className="text-lg font-black">{heading}</h2>{Boolean(element.content.description) && <p className="mt-1 text-sm text-neutral-600">{String(element.content.description)}</p>}</header>{items.length > 0 && <div className="grid gap-3 p-4 sm:grid-cols-2">{items.map((item,index) => <article key={index} className="rounded-xl border border-black/10 bg-neutral-50 p-3"><h3 className="font-bold">{String(item.title || item.name || `Item ${index + 1}`)}</h3><p className="mt-1 text-sm leading-relaxed text-neutral-600">{String(item.description || item.desc || item.quote || '')}</p>{typeof item.value === 'number' && <p className="mt-2 font-mono text-lg font-black">{item.value}{item.value <= 100 ? '%' : ''}</p>}</article>)}</div>}</article>;
    }
    case 'form': return <form className="grid max-w-xl gap-3" onSubmit={(event) => event.preventDefault()}><input required placeholder="Your name" className="rounded-lg border px-3 py-2" /><input required type="email" placeholder="Email address" className="rounded-lg border px-3 py-2" /><textarea required rows={4} placeholder="Message" className="rounded-lg border px-3 py-2" /><button style={style} className="rounded-lg bg-yellow px-4 py-2 font-bold">{text || 'Send message'}</button></form>;
    default: return <div style={style} className="rounded-xl border border-black/10 p-4">{String(element.content.description || element.content.blockType || text || '')}</div>;
  }
}

function LiveTabs({ items }: { items: Array<Record<string, unknown>> }) {
  const [active, setActive] = useState(0);
  return <div><div role="tablist" className="flex flex-wrap gap-2">{items.map((item, index) => <button key={index} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`rounded-lg border border-black px-3 py-1.5 text-sm font-bold ${active === index ? 'bg-yellow text-black' : 'bg-white text-black'}`}>{String(item.title || `Tab ${index + 1}`)}</button>)}</div><div role="tabpanel" className="mt-3 rounded-lg bg-neutral-100/70 p-3 text-sm">{String(items[active]?.description || 'Tab content')}</div></div>;
}

function StoreCatalog({
  products,
  pages,
  subdomain,
  accent,
  isVolt,
  onAdd,
}: {
  products: Array<{ name: string; price: number; category: string; detail: string }>;
  pages: LivePage[];
  subdomain: string;
  accent: string;
  isVolt: boolean;
  onAdd: (product: { name: string; price: number; category: string; detail: string }) => void;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(products.map((product) => product.category))];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = products.filter((product) => (category === 'All' || product.category === category)
    && (!normalizedQuery || `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(normalizedQuery)));
  const surface = isVolt ? 'border-white/10 bg-[#171B25] text-white' : 'border-[#1F2A1B]/10 bg-white text-[#1F2A1B]';
  const muted = isVolt ? 'text-white/55' : 'text-[#65705D]';
  return <div className="mt-6">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
      <label className={`flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-4 py-3 ${surface}`}>
        <span aria-hidden="true" className={muted}>⌕</span>
        <span className="sr-only">Search products</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" className={`min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-50 ${isVolt ? 'text-white' : 'text-[#1F2A1B]'}`} />
      </label>
      <label className={`rounded-xl border px-4 py-3 text-sm ${surface}`}>
        <span className="sr-only">Filter by category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className={`w-full bg-transparent outline-none ${isVolt ? 'text-white' : 'text-[#1F2A1B]'}`}>
          {categories.map((item) => <option key={item} value={item} className="bg-white text-black">{item === 'All' ? 'All categories' : item}</option>)}
        </select>
      </label>
    </div>
    <p className={`mb-4 font-mono text-xs ${muted}`} aria-live="polite">Showing {filtered.length} of {products.length} products</p>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product, index) => {
      const page = pages.find((entry) => entry.title === product.name);
      const href = page ? `/live/${subdomain}${page.slug || ''}` : '#';
      return <article key={product.name} className={`overflow-hidden rounded-2xl border transition-transform duration-300 hover:-translate-y-1 ${surface} ${isVolt ? 'shadow-[0_14px_36px_rgba(0,0,0,.3)]' : 'shadow-[0_12px_35px_rgba(31,42,27,.08)]'}`}>
        <a href={href} aria-label={`View ${product.name}`} className={`relative flex h-52 items-center justify-center overflow-hidden ${isVolt ? 'bg-[#202532]' : 'bg-[#E8F0DF]'}`}>
          <span aria-hidden="true" className={`absolute h-36 w-36 rounded-full blur-2xl ${isVolt ? 'bg-[#7C5CFF]/25' : 'bg-[#F4A93B]/25'}`} />
          <span className={`relative font-display text-6xl font-black ${isVolt ? 'text-[#C6FF3D]/80' : 'text-[#3FA34D]/60'}`}>{String(index + 1).padStart(2, '0')}</span>
        </a>
        <div className="p-5"><span className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>{product.category}</span><a href={href} className="mt-1 block rounded-sm font-display text-lg font-black outline-offset-2 focus-visible:outline focus-visible:outline-2" style={{ outlineColor: accent }}>{product.name}</a><p className={`mt-1 font-mono text-xs ${muted}`}>{product.detail}</p><div className="mt-5 flex items-center justify-between"><span className="font-display font-black">₹{product.price.toLocaleString('en-IN')}</span><button type="button" onClick={() => onAdd(product)} className={`rounded-full px-4 py-2 font-mono text-[10px] font-black transition-transform hover:scale-105 ${isVolt ? 'border border-[#C6FF3D] text-[#C6FF3D]' : 'border border-[#3FA34D]/30 text-[#286A32]'}`}>{isVolt ? 'Add to setup' : 'Add to crate'}</button></div></div>
      </article>;
    })}</div> : <div className={`rounded-2xl border border-dashed p-10 text-center ${surface}`}><h3 className="font-display text-xl font-black">No matching products</h3><p className={`mt-2 text-sm ${muted}`}>Try another search or category.</p><button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="mt-4 rounded-full px-4 py-2 font-bold text-black" style={{ backgroundColor: accent }}>Clear filters</button></div>}
  </div>;
}

function LiveTree({ columns, pages, subdomain }: { columns: Column[]; pages: LivePage[]; subdomain: string }) {
  return <div className="grid grid-cols-12 gap-4">{columns.map((column) => <div key={column.id} className="min-w-0 space-y-4" style={{ gridColumn: `span ${column.width.desktop || 12} / span ${column.width.desktop || 12}`, backgroundColor: column.style.backgroundColor }}>{column.elements.filter((element) => !element.hidden?.desktop).map((element) => <div key={element.id} className={getAnimationClass(element.style.animation)}><LiveTreeElement element={element} pages={pages} subdomain={subdomain} /></div>)}</div>)}</div>;
}

export default function LiveWebsitePage({
  params
}: {
  params: Promise<{ subdomain: string; slug?: string[] }>;
}) {
  const { subdomain, slug } = use(params);
  const routeSlug = slug?.join('/') || '';
  const [copied, setCopied] = useState(false);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);
  const [siteSections, setSiteSections] = useState<LivePageSection[]>([
    { id: 'nav', name: 'Navigation', type: 'nav' },
    { id: 'hero', name: 'Hero', type: 'hero' },
    { id: 'gallery', name: 'Featured Products', type: 'gallery' },
    { id: 'features', name: 'Features', type: 'features' },
    { id: 'testimonials', name: 'Testimonials', type: 'testimonials' },
    { id: 'cta', name: 'Call to Action', type: 'cta' },
    { id: 'footer', name: 'Footer', type: 'footer' },
  ]);
  const [sectionSpacing, setSectionSpacing] = useState<Record<string, { top: number; bottom: number; left: number; right: number }>>({});
  const [canvasElements, setCanvasElements] = useState<Array<{ id: string; type: 'image' | 'icon'; name: string; src?: string; icon?: string; x: number; y: number; width: number; height: number }>>([]);
  const [sitePages, setSitePages] = useState<LivePage[]>([]);
  const [siteMenu, setSiteMenu] = useState<LiveMenuItem[]>([]);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [assetUrl, setAssetUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [customCss, setCustomCss] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [watermarkRequired, setWatermarkRequired] = useState(false);
  const [previewWatermarkVisible, setPreviewWatermarkVisible] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<Array<{ name: string; price: number; category: string; detail: string; quantity: number }>>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);
  const [formMessages, setFormMessages] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`launchly_cart_${subdomain}`) || '[]') as Array<{ name: string; price: number; category: string; detail: string; quantity: number }>;
      if (Array.isArray(saved)) {
        const validItems = saved.filter((item) => item && typeof item.name === 'string' && Number.isFinite(item.price) && Number.isFinite(item.quantity) && item.quantity > 0);
        setCartItems(validItems);
        setCartCount(validItems.reduce((total, item) => total + item.quantity, 0));
      }
    } catch { /* Start with an empty bag when stored data is unavailable. */ }
    setCartReady(true);
  }, [subdomain]);
  useEffect(() => {
    if (!cartReady) return;
    try { localStorage.setItem(`launchly_cart_${subdomain}`, JSON.stringify(cartItems)); } catch { /* The bag still works for this page view when storage is unavailable. */ }
  }, [cartItems, cartReady, subdomain]);
  useEffect(() => {
    if (!cartOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setCartOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [cartOpen]);
  const addToBag = (product: { name: string; price: number; category: string; detail: string }) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.name === product.name);
      return existing ? current.map((item) => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
    });
    setCartCount((count) => count + 1);
  };
  const updateBagQuantity = (name: string, change: number) => {
    setCartItems((current) => current.flatMap((item) => item.name === name ? (item.quantity + change > 0 ? [{ ...item, quantity: item.quantity + change }] : []) : [item]));
    setCartCount((count) => Math.max(0, count + change));
  };
  const bagSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const sectionOrder = (type: string) => Math.max(0, siteSections.findIndex((section) => section.type === type));
  const sectionVisible = (type: string) => siteSections.some((section) => section.type === type);
  const sectionName = (type: string, fallback: string) => siteSections.find((section) => section.type === type)?.name || fallback;
  const sectionPadding = (type: string) => {
    const spacing = sectionSpacing[siteSections.find((section) => section.type === type)?.id || ''];
    return spacing ? { paddingTop: `${spacing.top}px`, paddingBottom: `${spacing.bottom}px`, paddingLeft: `${spacing.left}px`, paddingRight: `${spacing.right}px` } : {};
  };
  const renderHomeExtras = () => siteSections
    .filter((section) => !['nav', 'hero', 'gallery', 'features', 'testimonials', 'cta', 'footer'].includes(section.type) && !section.hidden?.desktop)
    .map((section) => {
      const content = section.content || {};
      const heading = [content.heading, content.title, section.name].find((value): value is string => typeof value === 'string' && value.length > 0) || section.type.replace(/[-_]/g, ' ');
      const description = [content.description, content.desc, content.subtitle].find((value): value is string => typeof value === 'string') || '';
      const items = Array.isArray(content.items) ? content.items.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null) : [];
      return <section key={section.id} id={section.anchorId || section.id} className="px-5 py-12 sm:px-12" style={{ order: sectionOrder(section.type), display: sectionVisible(section.type) ? undefined : 'none', backgroundColor: typeof section.style?.backgroundColor === 'string' ? section.style.backgroundColor : undefined, color: theme.textColor, ...sectionPadding(section.type) }}><div className="mx-auto max-w-5xl"><h2 className="text-2xl font-black sm:text-4xl">{heading}</h2>{description && <p className="mt-3 max-w-3xl leading-relaxed opacity-75">{description}</p>}
        {section.type === 'custom' ? <LiveTree columns={section.columns || []} pages={sitePages} subdomain={subdomain} />
          : section.type === 'logo-cloud' ? <div className="mt-6 flex flex-wrap items-center justify-center gap-5">{items.map((item, index) => <div key={index} className="flex h-20 min-w-32 items-center justify-center rounded-xl border border-black/10 bg-white px-5">{typeof item.image === 'string' && item.image ? <Image src={item.image} alt={String(item.title || 'Partner logo')} width={180} height={72} unoptimized className="max-h-12 w-auto object-contain"/> : <span className="font-bold text-neutral-500">{String(item.title || `Partner ${index + 1}`)}</span>}</div>)}</div>
          : section.type === 'breadcrumbs' ? <nav aria-label="Breadcrumb" className="mt-5 flex items-center gap-2 font-mono text-xs"><a href={`/live/${subdomain}`} className="underline">Home</a><span aria-hidden="true">/</span><span>{String(content.currentPage || section.name)}</span></nav>
          : section.type === 'not-found' ? <div className="mt-6 rounded-xl border border-black/10 bg-white p-6 text-center"><p className="text-6xl font-black" style={{ color: theme.primaryColor }}>404</p><p className="mt-2 opacity-75">{description}</p><a href={`/live/${subdomain}`} className="mt-5 inline-flex rounded-lg px-4 py-2 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>{String(content.buttonText || 'Back home')}</a></div>
          : section.type === 'contact' ? <form className="mt-6 grid max-w-2xl gap-3" onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setFormMessages((current) => ({ ...current, [section.id]: 'Sending…' })); try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), message: data.get('message'), category: `Site contact: ${siteTitle}`, website: data.get('website') }) }); const result = await response.json() as { success?: boolean; message?: string }; if (!response.ok || !result.success) throw new Error(result.message || 'Could not send your message.'); form.reset(); setFormMessages((current) => ({ ...current, [section.id]: String(content.successMessage || 'Thanks for your message.') })); } catch (error) { setFormMessages((current) => ({ ...current, [section.id]: error instanceof Error ? error.message : 'Could not send your message.' })); } }}><input name="name" required maxLength={80} autoComplete="name" placeholder="Name" className="rounded-lg border border-black/20 px-3 py-2.5 text-black"/><input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="Email" className="rounded-lg border border-black/20 px-3 py-2.5 text-black"/><textarea name="message" required maxLength={3000} rows={5} placeholder="Message" className="rounded-lg border border-black/20 px-3 py-2.5 text-black"/><label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave empty<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="justify-self-start rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>{String(content.submitLabel || 'Send message')}</button><p role="status" aria-live="polite" className="text-sm">{formMessages[section.id] || ''}</p></form>
          : section.type === 'newsletter' ? <form className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setFormMessages((current) => ({ ...current, [section.id]: 'Subscribing…' })); try { const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), source: `site:${subdomain}`, website: data.get('website') }) }); const result = await response.json() as { success?: boolean; message?: string }; if (!response.ok || !result.success) throw new Error(result.message || 'Could not subscribe.'); form.reset(); setFormMessages((current) => ({ ...current, [section.id]: String(content.successMessage || 'You are subscribed. Thank you!') })); } catch (error) { setFormMessages((current) => ({ ...current, [section.id]: error instanceof Error ? error.message : 'Could not subscribe.' })); } }}><input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="Email address" className="min-w-0 flex-1 rounded-lg border border-black/20 px-3 py-2.5 text-black"/><label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave empty<input name="website" tabIndex={-1} autoComplete="off"/></label><button className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>{String(content.submitLabel || 'Subscribe')}</button><p role="status" aria-live="polite" className="self-center text-sm">{formMessages[section.id] || ''}</p></form>
          : section.type === 'faq' ? <div className="mt-6 divide-y divide-black/10">{items.map((item, index) => <details key={index} className="py-4"><summary className="cursor-pointer font-bold">{String(item.question || item.title || `Question ${index + 1}`)}</summary><p className="mt-2 leading-relaxed opacity-75">{String(item.answer || item.description || '')}</p></details>)}</div>
          : section.type === 'gallery' || section.type === 'product-grid' ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className="overflow-hidden rounded-xl border border-black/10 bg-white text-black"><div className="flex aspect-[4/3] items-center justify-center bg-neutral-100">{typeof item.src === 'string' && item.src ? <Image src={item.src} alt={String(item.alt || item.title || '')} width={640} height={480} unoptimized className="h-full w-full object-cover"/> : <span className="text-4xl font-black text-neutral-300">0{index + 1}</span>}</div><div className="p-4"><h3 className="font-bold">{String(item.title || item.name || `Item ${index + 1}`)}</h3>{typeof item.description === 'string' && <p className="mt-1 text-sm opacity-75">{item.description}</p>}{typeof item.price === 'string' && <p className="mt-3 font-bold">{item.price}</p>}</div></article>)}</div>
          : items.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className="rounded-xl border border-black/10 bg-white/80 p-5 text-black"><h3 className="font-bold">{String(item.title || item.name || item.question || `Item ${index + 1}`)}</h3>{typeof item.description === 'string' && <p className="mt-2 text-sm leading-relaxed">{item.description}</p>}{typeof item.answer === 'string' && <p className="mt-2 text-sm leading-relaxed">{item.answer}</p>}{typeof item.quote === 'string' && <blockquote className="mt-2 text-sm leading-relaxed">“{item.quote}”</blockquote>}</article>)}</div>
          : typeof content.body === 'string' ? <p className="mt-5 whitespace-pre-wrap leading-relaxed">{content.body}</p> : null}</div></section>;
    });

  // Template matching: match by subdomain or template id
  const template: Template = 
    getTemplateById(subdomain.toLowerCase()) ||
    ALL_TEMPLATES.find(t => t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === subdomain.toLowerCase()) ||
    TEMPLATES[0];
  const isFreshCrate = template.id === 'fresh-crate';
  const isVoltGear = template.id === 'volt-gear';
  const isBrandedStore = isFreshCrate || isVoltGear;
  const storeProducts = template.products || [];
  const productNames = storeProducts.map((product) => product.name);
  const liveNavigation: LiveMenuItem[] = siteMenu.length ? siteMenu : sitePages.length ? sitePages.filter((page) => !page.isHome && page.showInMenu !== false).map((page) => ({ id: page.id, label: page.title, target: { type: 'page', value: page.id } })) : template.pages.slice(1).map((title) => { const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-'); return { id, label: title, target: { type: 'page' as const, value: id } }; });
  const primaryNavigation = liveNavigation.slice(0, 4);
  const overflowNavigation = liveNavigation.slice(4);
  const navigationHref = (item: LiveMenuItem) => {
    if (item.target.type === 'url') return item.target.value;
    if (item.target.type === 'anchor') return `#${item.target.value.replace(/^#/, '')}`;
    const page = sitePages.find((entry) => entry.id === item.target.value);
    return page?.isHome ? `/live/${subdomain}` : `/live/${subdomain}${page?.slug || `/${item.target.value}`}`;
  };
  useEffect(() => {
    const requestedPage = new URLSearchParams(window.location.search).get('page');
    if (requestedPage) setActivePage(requestedPage);
  }, []);
  useEffect(() => {
    if (!routeSlug || !sitePages.length) return;
    const path = `/${routeSlug.replace(/^\/+|\/+$/g, '')}`;
    const page = sitePages.find((entry) => entry.slug === path || entry.id === routeSlug.split('/').at(-1));
    const renamedPage = sitePages.find((entry) => entry.oldSlugs?.includes(path));
    if (renamedPage?.slug) {
      window.history.replaceState(null, '', `/live/${subdomain}${renamedPage.slug}`);
      setActivePage(renamedPage.id);
      return;
    }
    const notFoundPage = sitePages.find((entry) => entry.slug === '/404' || entry.id === '404' || entry.title.toLowerCase() === '404');
    setActivePage(page?.id || notFoundPage?.id || '404');
  }, [routeSlug, sitePages, subdomain]);

  // Theme & content state (will be populated from localStorage or API or template defaults)
  const [siteTitle, setSiteTitle] = useState(template.name);
  const [theme, setTheme] = useState({
    primaryColor: template.accent || '#FF5500',
    bgColor: template.bgColor || '#09090B',
    textColor: template.textColor || '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
  });

  const getCategoryDefaults = (t: Template) => {
    const isAi = t.category.toLowerCase().includes('ai');
    const isAgency = t.category.toLowerCase().includes('agency');
    const isEcommerce = t.category.toLowerCase().includes('ecom');
    const isPortfolio = t.category.toLowerCase().includes('port');
    const isWeb3 = t.category.toLowerCase().includes('web3');

    return {
      ctaPrimary: isAgency || isPortfolio ? 'Explore Showcase' : isEcommerce ? 'Shop Collection' : isWeb3 ? 'Connect Ecosystem' : 'Launch Experience',
      ctaSecondary: 'Documentation',
      stat1Label: isAi ? 'RUNTIME VELOCITY' : isAgency ? 'AWWWARDS HONORED' : isEcommerce ? 'CHECKOUT SPEED' : isPortfolio ? 'CLIENT IMPACT' : isWeb3 ? 'TOTAL TVL LOCKED' : 'EDGE PROPAGATION',
      stat1Value: isAi ? '4.2M Tokens/s' : isAgency ? '14 Trophy Wins' : isEcommerce ? '0.4s Instant' : isPortfolio ? '$48M ARR Added' : isWeb3 ? '$1.2B On-Chain' : '< 12ms latency',
      stat2Label: isAi ? 'ZERO-SHOT BENCHMARK' : isAgency ? 'RETENTION RATE' : isEcommerce ? 'CONVERSION LIFT' : isPortfolio ? 'DELIVERY CADENCE' : isWeb3 ? 'CONSENSUS SPEED' : 'SYSTEM UPTIME',
      stat2Value: isAi ? '99.98% SLA' : isAgency ? '98.4% Client NPS' : isEcommerce ? '+34.2% Lift' : isPortfolio ? '2x Faster' : isWeb3 ? '65,000 TPS' : '99.999% SLA',
    };
  };

  const catDefaults = getCategoryDefaults(template);

  const [heroContent, setHeroContent] = useState({
    badge: `${template.category.toUpperCase()} // ${template.badge?.toUpperCase() || 'POPULAR'}`,
    title: template.name,
    description: template.description,
    ctaPrimary: catDefaults.ctaPrimary,
    ctaSecondary: catDefaults.ctaSecondary,
    stat1Label: catDefaults.stat1Label,
    stat1Value: catDefaults.stat1Value,
    stat2Label: catDefaults.stat2Label,
    stat2Value: catDefaults.stat2Value,
  });

  const [featuresContent, setFeaturesContent] = useState(template.features.map((title) => ({
    title,
    desc: `${title} is thoughtfully integrated into the ${template.name} shopping experience.`,
  })));

  const [testimonialsContent, setTestimonialsContent] = useState([
    { 
      quote: template.topReview?.comment || `${template.name} made our shopping experience feel special.`,
      name: template.topReview?.author || 'Alex Morgan',
      role: template.topReview?.role || 'Store owner'
    },
    { 
      quote: `The quality and care behind ${template.name} keep us coming back.`,
      name: 'Jamie Lee',
      role: 'Returning customer'
    }
  ]);

  const [ctaContent, setCtaContent] = useState({
    title: `Find your next favorite at ${template.name}.`,
    desc: 'Explore the collection, discover something special, and make it yours.',
    buttonText: 'Shop the collection →',
  });

  // Load custom saved data from localStorage or API
  useEffect(() => {
    const previewRequested = new URLSearchParams(window.location.search).get('preview') === '1';
    const applySite = (site: Record<string, unknown>) => {
      const name = site.name;
      const data = (site.site_data || site.siteData) as Record<string, unknown> | undefined;
      if (typeof name === 'string') setSiteTitle(name);
      if (!data) return;
      const nestedDocument = data.document && typeof data.document === 'object' ? data.document as Record<string, unknown> : [1, 2, 3].includes(Number(data.version)) ? data : null;
      if (nestedDocument) {
        if (nestedDocument.name) setSiteTitle(String(nestedDocument.name));
        const siteSettings = nestedDocument.settings as { customCss?: unknown } | undefined;
        if (typeof siteSettings?.customCss === 'string') setCustomCss(siteSettings.customCss);
        if (nestedDocument.theme) setTheme(nestedDocument.theme as typeof theme);
        const content = nestedDocument.content as Record<string, unknown> | undefined;
        if (content?.hero) setHeroContent(content.hero as typeof heroContent);
        if (content?.features) setFeaturesContent(content.features as typeof featuresContent);
        if (content?.testimonials) setTestimonialsContent(content.testimonials as typeof testimonialsContent);
        if (content?.cta) setCtaContent(content.cta as typeof ctaContent);
        const pages = Array.isArray(nestedDocument.pages) ? nestedDocument.pages as Array<{ id: string; title: string; slug: string; isHome: boolean; showInMenu?: boolean; oldSlugs?: string[]; seo?: { description?: string }; sections?: LivePageSection[]; elements?: typeof canvasElements }> : [];
        const homePage = pages.find((page) => page.isHome) || pages[0];
        if (homePage?.sections?.length) setSiteSections(homePage.sections);
        if (homePage?.elements) setCanvasElements(homePage.elements);
        if (pages.length) setSitePages(pages.map((page) => ({ id: page.isHome ? 'home' : page.id, title: page.title, description: page.seo?.description || '', slug: page.slug, isHome: page.isHome, showInMenu: page.showInMenu !== false, oldSlugs: page.oldSlugs || [], sections: page.sections || [] })));
        if (Array.isArray(nestedDocument.menu)) setSiteMenu(nestedDocument.menu as LiveMenuItem[]);
        const assets = Array.isArray(nestedDocument.assets) ? nestedDocument.assets as Array<{ role: string; src: string }> : [];
        if (assets.length) {
          setAssetUrl(assets.find((asset) => asset.role === 'product')?.src || '');
          setLogoUrl(assets.find((asset) => asset.role === 'logo')?.src || '');
          setFaviconUrl(assets.find((asset) => asset.role === 'favicon')?.src || '');
        }
      }
      if (data.theme) setTheme(data.theme as typeof theme);
      if (data.heroContent) setHeroContent(data.heroContent as typeof heroContent);
      if (data.featuresContent) setFeaturesContent(data.featuresContent as typeof featuresContent);
      if (data.testimonialsContent) setTestimonialsContent(data.testimonialsContent as typeof testimonialsContent);
      if (data.ctaContent) setCtaContent(data.ctaContent as typeof ctaContent);
      if (Array.isArray(data.sections) && data.sections.length) setSiteSections(data.sections as typeof siteSections);
      if (data.sectionSpacing) setSectionSpacing(data.sectionSpacing as typeof sectionSpacing);
      if (Array.isArray(data.canvasElements)) setCanvasElements(data.canvasElements as typeof canvasElements);
      if (Array.isArray(data.sitePages)) setSitePages(data.sitePages as typeof sitePages);
      if (typeof data.assetUrl === 'string') setAssetUrl(data.assetUrl);
      if (typeof data.logoUrl === 'string') setLogoUrl(data.logoUrl);
      if (typeof data.faviconUrl === 'string') setFaviconUrl(data.faviconUrl);
      // Older published sites default to a visible mark; the server controls new publish flags.
      setWatermarkRequired(typeof data.watermarkRequired === 'boolean' ? data.watermarkRequired : true);
    };
    const applyLocalDraft = () => {
      let foundLocalDraft = false;
      try {
        const saved = localStorage.getItem(`launchly_site_${subdomain.toLowerCase()}`) || localStorage.getItem(`launchly_site_${template.id}`);
        if (!saved) throw new Error('No legacy local draft');
        const draft = JSON.parse(saved);
        foundLocalDraft = true;
        if (draft.siteName) setSiteTitle(draft.siteName);
        if (draft.theme) setTheme(draft.theme);
        if (draft.heroContent) setHeroContent(draft.heroContent);
        if (draft.featuresContent) setFeaturesContent(draft.featuresContent);
        if (draft.testimonialsContent) setTestimonialsContent(draft.testimonialsContent);
        if (draft.ctaContent) setCtaContent(draft.ctaContent);
        if (draft.sections?.length) setSiteSections(draft.sections);
        if (draft.sectionSpacing) setSectionSpacing(draft.sectionSpacing);
        if (Array.isArray(draft.canvasElements)) setCanvasElements(draft.canvasElements as typeof canvasElements);
        if (Array.isArray(draft.sitePages)) setSitePages(draft.sitePages as typeof sitePages);
        if (draft.assetUrl) setAssetUrl(draft.assetUrl);
        if (draft.logoUrl) setLogoUrl(draft.logoUrl);
        if (draft.faviconUrl) setFaviconUrl(draft.faviconUrl);
      } catch { /* Ignore a malformed local draft and render template defaults. */ }
      if (!foundLocalDraft) void loadEditorDraft(template.id).then((draft) => {
        if (draft && typeof draft === 'object') applySite({ name: template.name, site_data: { document: draft } });
      });
    };

    fetch(`/api/sites?subdomain=${encodeURIComponent(subdomain)}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.site) {
          setIsPreview(false);
          applySite(result.site);
          return;
        }
        if (previewRequested) {
          setIsPreview(true);
          applyLocalDraft();
          fetch('/api/auth/me').then((response) => response.json()).then((auth) => setWatermarkRequired(auth?.user?.plan !== 'pro')).catch(() => setWatermarkRequired(true));
        }
      })
      .catch(() => {
        // Fail closed: an unavailable publish lookup must not enable hiding a published watermark.
        setIsPreview(false);
        setWatermarkRequired(true);
      });
  }, [subdomain, template.id, template.name]);

  useEffect(() => {
    if (!faviconUrl) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = faviconUrl;
  }, [faviconUrl]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col antialiased selection:bg-pink selection:text-black"
      style={{ fontFamily: theme.fontFamily }}
    >
      {customCss && <style>{customCss}</style>}
      {/* Floating Edge Deployment Live Topbar */}
      <div className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${bannerCollapsed ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="bg-[#0F0F11]/95 backdrop-blur-xl border-b-[2.5px] border-black px-4 py-2.5 text-white flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-pink border border-black text-black flex items-center justify-center font-black text-xs shadow-2xs group-hover:scale-105 transition-transform">
                L
              </div>
              <span className="font-display font-black text-xs tracking-tight text-white group-hover:text-pink transition-colors hidden sm:inline">
                LAUNCHLY
              </span>
            </Link>

            <div className="h-3.5 w-px bg-white/20" />

            {/* Live Subdomain Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
              <span className="text-pink font-bold">{subdomain}</span>
              <span className="text-white/70">.launchly.site</span>
              <span className="ml-1 px-1.5 py-0.2 bg-mint text-black rounded text-[9px] font-black uppercase">
                PRO HOSTED
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors cursor-pointer"
              title="Copy live link"
            >
              {copied ? <Check size={12} className="text-mint stroke-[3]" /> : <Share2 size={12} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <Link
              href={`/editor/${template.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink hover:bg-yellow text-black border border-black text-xs font-black transition-colors shadow-2xs"
            >
              <Edit3 size={11} className="stroke-[2.5]" />
              <span>Edit Site</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/70 transition-colors"
            >
              <ArrowLeft size={12} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            <button
              onClick={() => setBannerCollapsed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
              title="Hide top bar"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Re-open Button if topbar collapsed */}
      {bannerCollapsed && (
        <button
          onClick={() => setBannerCollapsed(false)}
          className="fixed top-2 right-4 z-50 bg-[#121214] text-white border border-white/20 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-mint animate-ping" />
          <span>Launchly Bar</span>
        </button>
      )}

      {/* ACTUAL LIVE WEBSITE SURFACE — 100% Identical to Editor Preview Canvas */}
      <main id="top" className={`relative flex flex-col flex-1 pt-12 sm:pt-13 ${isFreshCrate ? 'bg-[#FFF8EC] text-[#1F2A1B]' : isVoltGear ? 'bg-[#0B0D12] text-[#F5F7FA]' : ''}`}>
        {/* Navigation Block */}
        <nav style={{ order: sectionOrder('nav'), display: sectionVisible('nav') ? undefined : 'none', ...sectionPadding('nav') }} className={`sticky top-12 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur-md sm:px-10 sm:py-4 ${isVoltGear ? 'border-white/10 bg-[#0B0D12]/90' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#FFF8EC]/90' : 'border-black/10 border-b-2 bg-white/90'}`}>
          <a href={`/live/${subdomain}`} aria-label={`Go to ${siteTitle} home page`} title={`Go to ${siteTitle} home page`} className="flex items-center gap-2.5 rounded-lg outline-offset-4 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black">
            {logoUrl ? <Image src={logoUrl} alt={`${siteTitle} logo`} width={36} height={36} unoptimized className="h-9 w-9 rounded-lg object-contain" /> : <div
              style={{ backgroundColor: theme.primaryColor }}
              className="w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-display font-black text-sm text-black"
            >
              {siteTitle.charAt(0)}
            </div>}
            <span className={`font-display text-base font-black tracking-tight sm:text-lg ${isVoltGear ? 'text-white' : isFreshCrate ? 'text-[#1F2A1B]' : 'text-ink'}`}>
              {siteTitle}
            </span>
          </a>

          <div className={`hidden items-center gap-6 font-mono text-xs font-bold sm:flex ${isVoltGear ? 'text-white/70' : isFreshCrate ? 'text-[#53604C]' : 'text-neutral-700'}`}>
            {primaryNavigation.map(item => (
              <a
                key={item.id}
                href={navigationHref(item)}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noreferrer' : undefined}
                className={`cursor-pointer transition-colors hover:underline ${isVoltGear ? 'hover:text-[#C6FF3D]' : 'hover:text-black'}`}
              >
                {item.label}
              </a>
            ))}
            {overflowNavigation.length > 0 && <details className="group relative py-2">
              <summary className={`flex cursor-pointer list-none items-center gap-1 ${isVoltGear ? 'hover:text-[#C6FF3D]' : 'hover:text-black'}`}>More <ChevronDown size={13} className="transition-transform group-open:rotate-180" /></summary>
              <div className={`absolute right-0 top-full z-50 mt-3 grid max-h-[70vh] min-w-56 gap-1 overflow-y-auto rounded-xl border p-2 shadow-xl ${isVoltGear ? 'border-white/10 bg-[#151923] text-white' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#FFF8EC] text-[#1F2A1B]' : 'border-black/10 bg-white text-black'}`}>
                {overflowNavigation.map((item) => <a key={item.id} href={navigationHref(item)} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined} className="rounded-lg px-3 py-2 hover:bg-black/5">{item.label}</a>)}
              </div>
            </details>}
          </div>

          <button type="button" aria-label={mobileNavigationOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNavigationOpen} onClick={() => setMobileNavigationOpen((open) => !open)} className={`rounded-lg border p-2 sm:hidden ${isVoltGear ? 'border-white/20 text-white' : 'border-black/20'}`}>
            {mobileNavigationOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {template.category === 'Ecommerce' ? <button type="button" aria-label={`Open shopping bag, ${cartCount} items`} aria-haspopup="dialog" aria-expanded={cartOpen} onClick={() => setCartOpen(true)} style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }} className="rounded-full border-2 border-black px-4 py-2 font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] hover:scale-103">Bag{cartCount > 0 ? ` (${cartCount})` : ''}</button> : <a href="#collection" style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }} className="px-4 py-2 rounded-xl border-2 border-black font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all">Get Started</a>}
        </nav>
        {mobileNavigationOpen && <nav aria-label="Mobile navigation" className={`sticky top-12 z-40 border-b px-5 py-4 sm:hidden ${isVoltGear ? 'border-white/10 bg-[#0B0D12] text-white' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#FFF8EC] text-[#1F2A1B]' : 'border-black/10 bg-white'}`}><div className="flex flex-col gap-4 font-mono text-sm font-bold">{liveNavigation.map((item) => <a key={item.id} href={navigationHref(item)} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined} onClick={() => setMobileNavigationOpen(false)}>{item.label}</a>)}</div></nav>}
        {cartOpen && <div className="fixed inset-0 z-[70] flex justify-end bg-black/45" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}><section role="dialog" aria-modal="true" aria-labelledby="bag-title" className="flex h-full w-full max-w-md flex-col p-5 shadow-2xl sm:p-7" style={{ backgroundColor: template.id === 'volt-gear' ? '#151923' : '#FFFFFF', color: template.id === 'volt-gear' ? '#F5F7FA' : '#111111' }}><div className="flex items-center justify-between border-b border-black/10 pb-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">{siteTitle}</p><h2 id="bag-title" className="mt-1 text-2xl font-black">Your bag <span className="text-sm font-semibold text-neutral-500">({cartCount})</span></h2></div><button type="button" autoFocus onClick={() => setCartOpen(false)} aria-label="Close shopping bag" className="rounded-full border-2 border-black p-2 hover:bg-neutral-100"><X size={18}/></button></div><div className="min-h-0 flex-1 overflow-y-auto py-4">{cartItems.length ? <ul className="space-y-4">{cartItems.map((item) => <li key={item.name} className="flex items-start justify-between gap-4 border-b border-black/10 pb-4"><div className="min-w-0"><p className="font-bold">{item.name}</p><p className="mt-1 text-xs text-neutral-500">{item.category} · ₹{item.price.toLocaleString('en-IN')}</p><div className="mt-3 inline-flex items-center rounded-lg border border-black/20"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateBagQuantity(item.name, -1)} className="px-3 py-1.5">−</button><span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateBagQuantity(item.name, 1)} className="px-3 py-1.5">+</button></div></div><strong className="whitespace-nowrap">₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></li>)}</ul> : <div className="flex h-full flex-col items-center justify-center text-center"><span aria-hidden="true" className="text-4xl">{template.id === 'fresh-crate' ? '🥬' : '✦'}</span><h3 className="mt-3 text-lg font-bold">Your bag is waiting</h3><p className="mt-1 max-w-xs text-sm text-neutral-600">Add a few favorites and they will show up here.</p><button type="button" onClick={() => { setCartOpen(false); setActivePage('shop'); }} className="mt-5 rounded-lg border-2 border-black px-4 py-2 font-bold">Browse the shop</button></div>}</div>{cartItems.length > 0 && <div className="border-t border-black/10 pt-4"><div className="flex justify-between text-sm"><span>Subtotal</span><strong>₹{bagSubtotal.toLocaleString('en-IN')}</strong></div><p className="mt-1 text-xs text-neutral-500">Delivery and taxes are calculated at checkout.</p><button type="button" onClick={() => { setCartOpen(false); setActivePage(sitePages.find((page) => /checkout/i.test(page.title))?.id || 'checkout'); }} className="mt-4 w-full rounded-xl border-2 border-black px-4 py-3 font-bold text-black shadow-[3px_3px_0_#000]" style={{ backgroundColor: theme.primaryColor }}>Continue to checkout</button><button type="button" onClick={() => setCartOpen(false)} className="mt-3 w-full py-2 text-sm font-semibold underline underline-offset-4">Continue shopping</button></div>}</section></div>}

        {activePage === 'home' ? <>

        {/* Hero Block — Rich Ambient Lighting, Vibrant Neo-Brutalist Badges, Crisp Typography */}
        <section
          id="home"
          className={`relative overflow-hidden px-4 py-16 sm:px-12 sm:py-28 ${isBrandedStore ? 'grid items-center gap-10 text-left md:grid-cols-2 lg:gap-16' : 'text-center'}`}
          style={{ order: sectionOrder('hero'), display: sectionVisible('hero') ? undefined : 'none', background: theme.bgColor, color: theme.textColor, ...sectionPadding('hero') }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className={`pointer-events-none absolute top-0 h-[min(80vw,34rem)] w-[min(80vw,34rem)] rounded-full blur-[110px] opacity-25 ${isBrandedStore ? 'right-[-8rem] left-auto' : 'left-1/2 -translate-x-1/2'}`}
            style={{ backgroundColor: theme.primaryColor }}
          />
          {isFreshCrate && <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full border-[28px] border-[#F4A93B]/15" />}
          {isVoltGear && <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.12] [background-image:radial-gradient(#C6FF3D_1px,transparent_1px)] [background-size:22px_22px]" />}

          <div className={`relative z-10 space-y-4 sm:space-y-5 ${isBrandedStore ? 'max-w-2xl text-left' : 'mx-auto max-w-3xl'}`}>
            {/* Category / Status Pill */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-black px-3.5 py-1.5 font-mono text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_#000] sm:text-xs"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <span>{heroContent.badge}</span>
            </div>

            {/* Headline Title */}
            <h1 
              className={`font-display font-black tracking-tight leading-[1.02] ${isFreshCrate ? 'text-4xl sm:text-6xl lg:text-7xl' : isVoltGear ? 'text-4xl sm:text-6xl lg:text-7xl' : 'text-3xl sm:text-6xl'}`}
              style={{ color: theme.textColor }}
            >
              {heroContent.title}
            </h1>

            {/* Description Subtitle */}
            <p 
              className={`font-mono text-xs leading-relaxed opacity-80 sm:text-base ${isBrandedStore ? 'max-w-xl' : 'mx-auto max-w-xl'}`}
              style={{ color: theme.textColor }}
            >
              {heroContent.description}
            </p>

            {/* Action Buttons */}
            <div className={`flex flex-wrap gap-3 pt-3 ${isBrandedStore ? 'justify-start' : 'justify-center'}`}>
              <a
                href="#collection"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className={`flex items-center gap-2 rounded-xl border-2 border-black px-6 py-3 font-display text-xs font-black text-black shadow-[3px_3px_0px_#000] transition-transform hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 sm:px-8 sm:text-sm ${isVoltGear ? 'shadow-[3px_3px_0_#7C5CFF]' : ''}`}
              >
                <span>{heroContent.ctaPrimary}</span>
                <ArrowUpRight size={15} className="stroke-[3]" />
              </a>
              <a
                href="#features"
                style={{ borderRadius: theme.borderRadius }}
                className={`rounded-xl border-2 border-current px-5 py-3 font-mono text-xs font-bold backdrop-blur-xs transition-all hover:bg-white/20 sm:px-7 sm:text-sm ${isFreshCrate ? 'bg-white/70' : 'bg-white/10'}`}
              >
                {heroContent.ctaSecondary}
              </a>
            </div>

            {/* Live Telemetry Radar Pills */}
            <div className={`grid max-w-lg grid-cols-2 gap-3 pt-6 text-left sm:pt-8 ${isBrandedStore ? '' : 'mx-auto'}`}>
              <div className={`rounded-xl border border-current/20 p-3.5 backdrop-blur-sm sm:p-4 ${isFreshCrate ? 'bg-white/65' : 'bg-white/5'}`}>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">
                  {heroContent.stat1Label}
                </span>
                <span className="font-display text-base sm:text-xl font-black">{heroContent.stat1Value}</span>
              </div>
              <div className={`rounded-xl border border-current/20 p-3.5 backdrop-blur-sm sm:p-4 ${isFreshCrate ? 'bg-white/65' : 'bg-white/5'}`}>
                <span className="font-mono text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">
                  {heroContent.stat2Label}
                </span>
                <span className="font-display text-base sm:text-xl font-black">{heroContent.stat2Value}</span>
              </div>
            </div>
          </div>
          {isBrandedStore && <div aria-label={isFreshCrate ? 'Fresh Crate seasonal produce illustration' : 'Volt Gear product launch illustration'} className={`relative z-10 mx-auto flex aspect-square w-full max-w-[31rem] items-center justify-center overflow-hidden rounded-[2.25rem] border ${isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#F3E9D7]' : 'border-white/15 bg-[#151923]'}`}>
            {isFreshCrate ? <>
              <div aria-hidden="true" className="absolute -right-8 -top-10 h-56 w-56 rounded-full bg-[#F4A93B]/35 blur-sm" />
              <div aria-hidden="true" className="absolute -bottom-14 -left-14 h-64 w-64 rounded-full bg-[#3FA34D]/25" />
              <div aria-hidden="true" className="absolute inset-7 rounded-full border border-[#1F2A1B]/10" />
              <div className="relative grid w-[74%] grid-cols-2 gap-3 rounded-3xl border border-white/80 bg-white/75 p-4 shadow-[0_28px_70px_rgba(31,42,27,.14)] backdrop-blur-sm sm:p-6">
                {['Garden greens', 'Sun-ripened fruit', 'Bakery mornings', 'Farm favorites'].map((label, index) => <div key={label} className={`flex aspect-square flex-col justify-between rounded-2xl p-3 sm:p-4 ${index % 2 ? 'bg-[#FFF8EC]' : 'bg-[#E7F2DF]'}`}><span aria-hidden="true" className={`block h-12 w-12 rounded-full ${index === 0 ? 'bg-[#3FA34D]' : index === 1 ? 'bg-[#F4A93B]' : index === 2 ? 'bg-[#D99C72]' : 'bg-[#8ABF57]'}`} /><span className="text-xs font-bold text-[#1F2A1B] sm:text-sm">{label}</span></div>)}
                <div className="absolute -bottom-4 -right-3 rounded-full border border-[#1F2A1B]/10 bg-white px-4 py-2 font-mono text-[10px] font-bold text-[#1F2A1B] shadow-lg">Picked fresh, delivered today</div>
              </div>
            </> : <>
              <div aria-hidden="true" className="absolute h-[72%] w-[72%] rounded-full border border-[#C6FF3D]/20" />
              <div aria-hidden="true" className="absolute h-[54%] w-[54%] rounded-full border border-[#7C5CFF]/50 shadow-[0_0_90px_rgba(124,92,255,.25)]" />
              <div aria-hidden="true" className="absolute right-10 top-12 h-20 w-20 rounded-full bg-[#C6FF3D]/15 blur-xl" />
              <div className="relative flex h-[58%] w-[58%] items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#252A36] to-[#101218] shadow-[0_30px_90px_rgba(0,0,0,.55)]">
                <div aria-hidden="true" className="absolute inset-5 rounded-full border-[14px] border-[#C6FF3D] shadow-[0_0_35px_rgba(198,255,61,.16)]" />
                <span className="relative z-10 font-mono text-xs font-black uppercase tracking-[.35em] text-white/80">V / 01</span>
                <span className="absolute -bottom-5 right-[-1rem] rounded-xl border border-white/15 bg-[#1C202B] px-4 py-3 font-mono text-[10px] text-white shadow-xl"><strong className="block text-[#C6FF3D]">BUILT FOR THE DROP</strong>Precision audio · 40h battery</span>
              </div>
            </>}
          </div>}
        </section>

        <section id="collection" style={{ order: sectionOrder('gallery'), display: sectionVisible('gallery') ? undefined : 'none', ...sectionPadding('gallery') }} className={`px-4 py-14 sm:px-12 ${isVoltGear ? 'bg-[#10131A] text-white' : isFreshCrate ? 'bg-[#F3E9D7] text-[#1F2A1B]' : 'bg-[#FAF9F6] text-black'}`}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8"><p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: theme.primaryColor }}>Curated for you</p><h2 className="font-display text-2xl sm:text-3xl font-black mt-1">{sectionName('gallery', 'Featured pieces')}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productNames.map((name, index) => (
                <article key={name} className={`overflow-hidden rounded-2xl border shadow-[0_12px_35px_rgba(0,0,0,.08)] transition-transform duration-300 hover:-translate-y-1 ${isVoltGear ? 'border-white/10 bg-[#171B25] shadow-[0_14px_36px_rgba(0,0,0,.3)]' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-white' : 'border-black/20 bg-white shadow-[4px_4px_0px_#000]'}`}>
                  <div className={`relative flex h-48 items-center justify-center overflow-hidden ${isVoltGear ? 'bg-[#202532]' : isFreshCrate ? 'bg-[#E8F0DF]' : ''}`} style={{ background: isBrandedStore ? undefined : `linear-gradient(135deg, ${theme.primaryColor}55, ${theme.primaryColor}15)` }}>
                    <span aria-hidden="true" className={`absolute h-36 w-36 rounded-full blur-2xl ${isVoltGear ? 'bg-[#7C5CFF]/25' : isFreshCrate ? 'bg-[#F4A93B]/25' : 'bg-transparent'}`} />
                    {assetUrl ? <>
                      {/* User-supplied assets may be arbitrary URLs or local data URLs. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl} alt={name} className="h-full w-full object-cover" />
                    </> : <span className={`relative font-display text-6xl font-black ${isVoltGear ? 'text-[#C6FF3D]/80' : isFreshCrate ? 'text-[#3FA34D]/60' : 'opacity-50'}`}>{String(index + 1).padStart(2, '0')}</span>}
                  </div>
                  <div className="p-5"><span className={`font-mono text-[9px] uppercase tracking-wider ${isVoltGear ? 'text-white/45' : 'text-neutral-500'}`}>{storeProducts[index]?.category}</span><h3 className="mt-1 font-display text-lg font-black">{name}</h3><p className={`mt-1 font-mono text-xs ${isVoltGear ? 'text-white/55' : 'text-neutral-500'}`}>{storeProducts[index]?.detail}</p><div className="mt-5 flex items-center justify-between"><span className="font-display font-black">₹{storeProducts[index]?.price.toLocaleString('en-IN')}</span><button type="button" onClick={() => { const product = storeProducts[index]; if (product) addToBag(product); }} className={`rounded-full px-4 py-2 font-mono text-[10px] font-black transition-transform hover:scale-105 ${isVoltGear ? 'border border-[#C6FF3D] text-[#C6FF3D]' : 'border border-[#3FA34D]/30 text-[#286A32]'}`} style={{ backgroundColor: isVoltGear ? 'transparent' : '#EDF6E8' }}>Add to bag</button></div></div>
                </article>
              ))}
            </div>
            <p className="text-right mt-4 font-mono text-xs font-bold">Shopping bag: {cartCount} item{cartCount === 1 ? '' : 's'}</p>
          </div>
        </section>

        {/* Features Block */}
        <section id="features" style={{ order: sectionOrder('features'), display: sectionVisible('features') ? undefined : 'none', ...sectionPadding('features') }} className={`border-y px-4 py-16 sm:px-12 sm:py-24 ${isVoltGear ? 'border-white/10 bg-[#0B0D12] text-white' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#FFF8EC] text-[#1F2A1B]' : 'border-black/10 bg-white text-black'}`}>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-black/20 bg-[#FAF9F6] font-mono text-[10px] font-bold uppercase text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-pink inline-block animate-pulse" />
              <span>Considered details</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
              {sectionName('features', 'Made for the way you live.')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {featuresContent.map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 transition-transform hover:-translate-y-1 sm:p-6 ${isVoltGear ? 'border-white/10 bg-[#151923] shadow-[0_14px_35px_rgba(0,0,0,.25)]' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-white shadow-[0_14px_35px_rgba(31,42,27,.07)]' : 'border-2 border-black bg-[#FAF9F6] shadow-[4px_4px_0px_#000]'}`}
              >
                <div
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center font-mono font-black text-xs text-black mb-3 shadow-[1.5px_1.5px_0px_#000]"
                >
                  0{i + 1}
                </div>
                <h3 className={`mb-1.5 font-display text-base font-black sm:text-lg ${isVoltGear ? 'text-white' : 'text-[#1F2A1B]'}`}>
                  {f.title}
                </h3>
                <p className={`font-mono text-xs leading-relaxed sm:text-sm ${isVoltGear ? 'text-white/60' : 'text-neutral-600'}`}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Block */}
        <section id="showcase" style={{ order: sectionOrder('testimonials'), display: sectionVisible('testimonials') ? undefined : 'none', ...sectionPadding('testimonials') }} className={`px-4 py-16 sm:px-12 sm:py-24 ${isVoltGear ? 'bg-[#10131A] text-white' : isFreshCrate ? 'bg-[#F3E9D7] text-[#1F2A1B]' : 'bg-[#FFFDF8] text-black'}`}>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
              {sectionName('testimonials', 'Loved by our customers.')}
            </h2>
            <p className="font-mono text-xs text-neutral-500">
              Thoughtful quality and personal service, every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {testimonialsContent.map((item, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col justify-between rounded-2xl border p-5 sm:p-7 ${isVoltGear ? 'border-white/10 bg-[#171B25] shadow-[0_14px_35px_rgba(0,0,0,.3)]' : isFreshCrate ? 'border-white/80 bg-white shadow-[0_12px_30px_rgba(31,42,27,.08)]' : 'border-2 border-black bg-white shadow-[4px_4px_0px_#000]'}`}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow text-black stroke-[1.5]" />
                  ))}
                </div>
                <p className={`mb-5 font-mono text-xs leading-relaxed sm:text-sm ${isVoltGear ? 'text-white/80' : 'text-neutral-800'}`}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-black/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-black bg-lilac flex items-center justify-center font-mono font-bold text-xs text-black">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`font-display text-xs font-black sm:text-sm ${isVoltGear ? 'text-white' : 'text-black'}`}>{item.name}</h4>
                    <p className="font-mono text-[10px] sm:text-[11px] text-neutral-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Block */}
        <section id="pricing" style={{ order: sectionOrder('cta'), display: sectionVisible('cta') ? undefined : 'none', ...sectionPadding('cta') }} className={`relative overflow-hidden px-4 py-16 text-center sm:px-12 sm:py-24 ${isFreshCrate ? 'bg-[#3FA34D] text-white' : isVoltGear ? 'bg-[#151923] text-white' : 'bg-black text-white'}`}>
          <div aria-hidden="true" className={`pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[32px] ${isVoltGear ? 'border-[#7C5CFF]/20' : 'border-white/10'}`} />
          <div className="relative z-10 max-w-lg mx-auto space-y-3.5">
            <h2 className="font-display text-2xl sm:text-4xl font-black">
              {ctaContent.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400">
              {ctaContent.desc}
            </p>
            <div className="pt-2">
              <a
                href="#collection"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className={`inline-block rounded-xl border-2 px-6 py-3 font-display text-xs font-black text-black transition-transform hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 sm:px-8 sm:text-sm ${isFreshCrate ? 'border-[#1F2A1B] shadow-[3px_3px_0_#1F2A1B]' : 'border-white shadow-[3px_3px_0_#FFFFFF]'}`}
              >
                {ctaContent.buttonText}
              </a>
            </div>
          </div>
        </section>

        {renderHomeExtras()}

        {/* Branded Footer Block */}
        <footer style={{ order: sectionOrder('footer'), display: sectionVisible('footer') ? undefined : 'none', ...sectionPadding('footer') }} className={`flex flex-col items-center justify-between gap-4 border-t px-4 py-8 font-mono text-xs sm:flex-row sm:px-12 ${isVoltGear ? 'border-white/10 bg-[#0B0D12] text-white/55' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-[#FFF8EC] text-[#65705D]' : 'border-black/10 bg-white text-neutral-600'}`}>
          <div className={`flex items-center gap-2 font-bold ${isVoltGear ? 'text-white' : 'text-black'}`}>
            <span>{siteTitle}</span>
            <span>•</span>
            <span className="text-[10px] text-neutral-400">Deployed live on Launchly Edge</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-black cursor-pointer">Privacy</span>
            <span className="hover:text-black cursor-pointer">Terms</span>
            <span className="hover:text-black cursor-pointer">Security</span>
          </div>
        </footer>
        </> : <section className={`min-h-[70vh] px-5 py-14 sm:px-12 ${isVoltGear ? 'bg-[#0B0D12] text-white' : isFreshCrate ? 'bg-[#FFF8EC] text-[#1F2A1B]' : 'bg-[#FAF9F6] text-black'}`}>
          {(() => { const page = sitePages.find((entry) => entry.id === activePage); const title = page?.title || activePage.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()); const activeProduct = storeProducts.find((product) => product.name === page?.title);
            return <div className="mx-auto max-w-6xl"><p className="font-mono text-xs font-bold uppercase tracking-[.2em]" style={{ color: theme.primaryColor }}>{siteTitle}</p><h1 className="mt-3 text-4xl font-black sm:text-6xl">{activePage === '404' ? 'Page not found' : title}</h1><p className={`mt-4 max-w-2xl text-base leading-relaxed ${isVoltGear ? 'text-white/65' : 'text-neutral-600'}`}>{activePage === '404' ? 'The page you requested could not be found.' : page?.description || `Welcome to ${title} at ${siteTitle}.`}</p>
              {activeProduct && <div className={`mt-8 grid gap-8 rounded-3xl border p-5 sm:p-8 md:grid-cols-2 ${isVoltGear ? 'border-white/10 bg-[#151923]' : 'border-[#1F2A1B]/10 bg-white'}`}>
                <div className={`relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl ${isVoltGear ? 'bg-[#202532]' : 'bg-[#E8F0DF]'}`}><span aria-hidden="true" className={`absolute h-48 w-48 rounded-full blur-3xl ${isVoltGear ? 'bg-[#7C5CFF]/30' : 'bg-[#F4A93B]/30'}`} /><span className={`relative font-display text-8xl font-black ${isVoltGear ? 'text-[#C6FF3D]/80' : 'text-[#3FA34D]/60'}`}>{activeProduct.name.slice(0, 1)}</span></div>
                <div className="flex flex-col justify-center"><p className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: theme.primaryColor }}>{activeProduct.category}</p><h2 className="mt-2 font-display text-3xl font-black">{activeProduct.name}</h2><p className={`mt-3 leading-relaxed ${isVoltGear ? 'text-white/65' : 'text-neutral-600'}`}>{activeProduct.detail}</p><strong className="mt-6 text-2xl">₹{activeProduct.price.toLocaleString('en-IN')}</strong><p className={`mt-2 text-xs ${isVoltGear ? 'text-white/45' : 'text-neutral-500'}`}>{isFreshCrate ? 'Seasonal availability is confirmed while packing.' : 'Check compatibility and specifications before ordering.'}</p><button type="button" onClick={() => addToBag(activeProduct)} className="mt-5 self-start rounded-full px-6 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>Add to {isFreshCrate ? 'crate' : 'bag'}</button></div>
              </div>}
              {page?.sections?.filter((section) => !['nav', 'footer'].includes(section.type) && !(activePage === 'shop' && section.type === 'product-grid') && !section.hidden?.desktop).map((section) => {
                const content = section.content || {};
                const heading = [content.heading, content.title, section.name].find((value): value is string => typeof value === 'string' && value.length > 0) || section.type.replace(/[-_]/g, ' ');
                const description = [content.description, content.desc, content.subtitle].find((value): value is string => typeof value === 'string') || '';
                const items = Array.isArray(content.items) ? content.items.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null) : [];
                return <section key={section.id} id={section.anchorId || section.id} className={`mt-10 rounded-2xl border p-6 shadow-sm sm:p-9 ${isVoltGear ? 'border-white/10 bg-[#151923]' : isFreshCrate ? 'border-[#1F2A1B]/10 bg-white' : 'border-black/10 bg-white'} ${getAnimationClass(typeof section.style?.animation === 'string' ? section.style.animation : undefined)}`}>
                  <h2 className="text-2xl font-black sm:text-3xl">{heading}</h2>
                  {description && <p className="mt-3 max-w-3xl leading-relaxed text-neutral-600">{description}</p>}
                  {section.type === 'custom' ? <LiveTree columns={section.columns || []} pages={sitePages} subdomain={subdomain} /> : section.type === 'contact' ? <form className="mt-6 grid max-w-2xl gap-3" onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setFormMessages((current) => ({ ...current, [section.id]: 'Sending…' })); try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: data.get('name'), email: data.get('email'), message: data.get('message'), category: `Site contact: ${siteTitle}`, website: data.get('website') }) }); const result = await response.json() as { success?: boolean; message?: string }; if (!response.ok || !result.success) throw new Error(result.message || 'Could not send your message.'); form.reset(); setFormMessages((current) => ({ ...current, [section.id]: String(content.successMessage || 'Thanks for your message. We will be in touch soon.') })); } catch (error) { setFormMessages((current) => ({ ...current, [section.id]: error instanceof Error ? error.message : 'Could not send your message. Please try again.' })); } }}><label className="grid gap-1 text-sm font-semibold">Name<input name="name" required maxLength={80} autoComplete="name" className="rounded-lg border border-black/20 px-3 py-2.5 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Email<input name="email" required type="email" maxLength={254} autoComplete="email" className="rounded-lg border border-black/20 px-3 py-2.5 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Message<textarea name="message" required maxLength={3000} rows={5} className="rounded-lg border border-black/20 px-3 py-2.5 font-normal" /></label><label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label><button type="submit" className="justify-self-start rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>{String(content.submitLabel || 'Send message')}</button><p role="status" aria-live="polite" className="text-sm text-neutral-600">{formMessages[section.id] || ''}</p></form>
                    : section.type === 'newsletter' ? <form className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row" onSubmit={async (event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); setFormMessages((current) => ({ ...current, [section.id]: 'Subscribing…' })); try { const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), source: `site:${subdomain}`, website: data.get('website') }) }); const result = await response.json() as { success?: boolean; message?: string }; if (!response.ok || !result.success) throw new Error(result.message || 'Could not subscribe.'); form.reset(); setFormMessages((current) => ({ ...current, [section.id]: String(content.successMessage || 'You are subscribed. Thank you!') })); } catch (error) { setFormMessages((current) => ({ ...current, [section.id]: error instanceof Error ? error.message : 'Could not subscribe. Please try again.' })); } }}><label className="sr-only" htmlFor={`newsletter-${section.id}`}>Email address</label><input id={`newsletter-${section.id}`} name="email" required type="email" maxLength={254} autoComplete="email" placeholder="Email address" className="min-w-0 flex-1 rounded-lg border border-black/20 px-3 py-2.5" /><label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label><button type="submit" className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>{String(content.submitLabel || 'Subscribe')}</button><p role="status" aria-live="polite" className="self-center text-sm text-neutral-600">{formMessages[section.id] || ''}</p></form>
                    : section.type === 'faq' ? <div className="mt-6 divide-y divide-black/10">{items.map((item, index) => <details key={index} className="py-4"><summary className="cursor-pointer font-bold">{String(item.question || item.title || `Question ${index + 1}`)}</summary><p className="mt-2 leading-relaxed text-neutral-600">{String(item.answer || item.description || '')}</p></details>)}</div>
                    : section.type === 'gallery' || section.type === 'product-grid' ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className="overflow-hidden rounded-xl border border-black/10"><div className="flex aspect-[4/3] items-center justify-center bg-neutral-100">{typeof item.src === 'string' && item.src ? <Image src={item.src} alt={String(item.alt || item.title || '')} width={640} height={480} unoptimized className="h-full w-full object-cover" /> : <span className="text-4xl font-black text-neutral-300">0{index + 1}</span>}</div><div className="p-4"><h3 className="font-bold">{String(item.title || item.name || `Item ${index + 1}`)}</h3>{typeof item.description === 'string' && <p className="mt-1 text-sm text-neutral-600">{item.description}</p>}{typeof item.price === 'string' && <p className="mt-3 font-bold">{item.price}</p>}{section.type === 'product-grid' && <button type="button" onClick={() => { const product = storeProducts.find((entry) => entry.name === String(item.name || item.title || '')); if (product) addToBag(product); }} className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ backgroundColor: theme.primaryColor }}>Add to bag</button>}</div></article>)}</div>
                    : items.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className={`rounded-xl border p-5 ${isVoltGear ? 'border-white/10 bg-[#1B202C]' : 'border-black/10 bg-neutral-50'}`}><h3 className="font-bold">{String(item.title || item.name || item.question || `Item ${index + 1}`)}</h3>{typeof item.description === 'string' && <p className={`mt-2 text-sm leading-relaxed ${isVoltGear ? 'text-white/60' : 'text-neutral-600'}`}>{item.description}</p>}{typeof item.answer === 'string' && <p className={`mt-2 text-sm leading-relaxed ${isVoltGear ? 'text-white/60' : 'text-neutral-600'}`}>{item.answer}</p>}{typeof item.quote === 'string' && <blockquote className={`mt-2 text-sm leading-relaxed ${isVoltGear ? 'text-white/60' : 'text-neutral-600'}`}>“{item.quote}”</blockquote>}{typeof item.price === 'string' && <p className="mt-3 font-bold">{item.price}</p>}</article>)}</div>
                    : typeof content.body === 'string' ? <p className="mt-5 whitespace-pre-wrap leading-relaxed text-neutral-700">{content.body}</p> : <p className="mt-5 text-sm text-neutral-500">{description || `Explore ${heading}.`}</p>}
                </section>;
              })}
              {activePage === 'shop' && <StoreCatalog products={storeProducts} pages={sitePages} subdomain={subdomain} accent={theme.primaryColor} isVolt={isVoltGear} onAdd={addToBag} />}
              {/(shop|collection|store)/i.test(title) && !page?.sections?.some((section) => section.type === 'product-grid') && <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{storeProducts.map((product, index) => <article key={product.name} className="overflow-hidden rounded-2xl border border-black/10 bg-white"><div className="flex h-56 items-center justify-center bg-neutral-100">{assetUrl ? <Image src={assetUrl} alt={product.name} width={640} height={640} unoptimized className="h-full w-full object-cover" /> : <span className="text-5xl font-black">0{index + 1}</span>}</div><div className="p-5"><span className="font-mono text-[10px] uppercase text-neutral-500">{product.category}</span><h2 className="font-bold">{product.name}</h2><p className="mt-2 text-sm text-neutral-600">{product.detail}</p><div className="mt-4 flex items-center justify-between"><strong>₹{product.price.toLocaleString('en-IN')}</strong><button type="button" onClick={() => addToBag(product)} className="rounded-lg px-4 py-2 text-sm font-bold" style={{ backgroundColor: theme.primaryColor }}>Add to bag</button></div></div></article>)}</div>}
              {/cart/i.test(title) && <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6"><h2 className="text-2xl font-bold">Your bag</h2>{cartItems.length ? <ul className="mt-4 divide-y divide-black/10">{cartItems.map((item) => <li key={item.name} className="flex items-center justify-between gap-3 py-3"><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></li>)}</ul> : <p className="mt-2 text-neutral-600">Your bag is empty.</p>}<p className="mt-3 font-bold">Subtotal ₹{bagSubtotal.toLocaleString('en-IN')}</p><button type="button" onClick={() => setCartOpen(true)} className="mt-5 inline-flex rounded-lg px-5 py-3 font-bold" style={{ backgroundColor: theme.primaryColor }}>Review bag</button><button type="button" onClick={() => setActivePage(sitePages.find((entry) => /checkout/i.test(entry.title))?.id || 'checkout')} className="ml-3 mt-5 inline-flex rounded-lg border border-black px-5 py-3 font-bold">Continue to checkout</button></div>}
              {/checkout/i.test(title) && <div className={`mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]`}><form className={`grid gap-4 rounded-2xl border p-6 ${isVoltGear ? 'border-white/10 bg-[#151923]' : 'border-[#1F2A1B]/10 bg-white'}`} onSubmit={(event) => { event.preventDefault(); setFormMessages((current) => ({ ...current, checkout: 'Checkout preview complete. Connect a payment provider to accept orders.' })); }}><div><h2 className="text-xl font-bold">Delivery details</h2><p className={`mt-1 text-sm ${isVoltGear ? 'text-white/55' : 'text-neutral-600'}`}>This is a preview checkout. No payment will be collected.</p></div><label className="grid gap-1 text-sm font-semibold">Email address<input required type="email" autoComplete="email" className="rounded-lg border border-black/20 bg-white px-4 py-3 font-normal text-black"/></label><label className="grid gap-1 text-sm font-semibold">Full name<input required autoComplete="name" className="rounded-lg border border-black/20 bg-white px-4 py-3 font-normal text-black"/></label><label className="grid gap-1 text-sm font-semibold">Delivery address<input required autoComplete="street-address" className="rounded-lg border border-black/20 bg-white px-4 py-3 font-normal text-black"/></label>{isFreshCrate && <label className="grid gap-1 text-sm font-semibold">Delivery window<select className="rounded-lg border border-black/20 bg-white px-4 py-3 font-normal text-black"><option>Saturday · 9:00–12:00</option><option>Saturday · 12:00–15:00</option><option>Sunday · 9:00–12:00</option></select></label>}<button className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: theme.primaryColor }}>Review order</button><p role="status" aria-live="polite" className="text-sm">{formMessages.checkout || ''}</p></form><aside className={`h-fit rounded-2xl border p-6 ${isVoltGear ? 'border-white/10 bg-[#151923]' : 'border-[#1F2A1B]/10 bg-white'}`}><h2 className="text-lg font-bold">Order summary</h2>{cartItems.length ? <ul className="mt-4 divide-y divide-current/10">{cartItems.map((item) => <li key={item.name} className="flex justify-between gap-3 py-3 text-sm"><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></li>)}</ul> : <p className={`mt-3 text-sm ${isVoltGear ? 'text-white/55' : 'text-neutral-600'}`}>Your bag is empty. Add a product before checkout.</p>}<div className="mt-4 flex justify-between border-t border-current/10 pt-4"><span>Subtotal</span><strong>₹{bagSubtotal.toLocaleString('en-IN')}</strong></div><p className={`mt-2 text-xs ${isVoltGear ? 'text-white/45' : 'text-neutral-500'}`}>Shipping and taxes are calculated after delivery details.</p></aside></div>}
              {/(shop|collection|store|cart|checkout)/i.test(title) || <div className="mt-10 rounded-2xl border border-black/10 bg-white p-6 sm:p-10"><h2 className="text-2xl font-bold">Discover {siteTitle}</h2><p className="mt-3 leading-relaxed text-neutral-600">{heroContent.description}</p><a href={`/live/${subdomain}?page=collection`} className="mt-6 inline-flex rounded-lg px-5 py-3 font-bold" style={{ backgroundColor: theme.primaryColor }}>Explore collection</a></div>}
            </div>;
          })()}
        </section>}
        <div className="pointer-events-none absolute inset-0 z-30" aria-label="Custom site elements">{canvasElements.map((item) => {
          const IconComponent = ({ Star, Heart, Sparkles, Camera, CheckCircle2, ArrowUpRight } as Record<string, typeof Star>)[item.icon || 'Star'] || Star;
          return <div key={item.id} className="absolute pointer-events-auto" style={{ left: item.x, top: item.y + 48, width: item.width, height: item.height }}>{item.src ? <Image src={item.src} alt={item.name} width={item.width} height={item.height} unoptimized className={`h-full w-full ${item.type === 'image' ? 'rounded-lg object-cover' : 'object-contain'}`} /> : item.type === 'image' ? null : <div className="flex h-full w-full items-center justify-center"><IconComponent size={Math.min(item.width, item.height) * .65} /></div>}</div>;
        })}</div>
      </main>
      {watermarkRequired && (!isPreview || previewWatermarkVisible) && <div className="fixed bottom-3 right-3 z-[60] inline-flex items-center gap-1 rounded-full border border-black/20 bg-white/90 py-1.5 pl-2.5 pr-1.5 text-[11px] font-semibold text-neutral-800 shadow-lg backdrop-blur">
        <a href="https://launchly.site" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2" aria-label="Made with Launchly">
          <Image src="/brand-logo-clean.png" alt="" width={20} height={20} className="h-5 w-5 rounded-full object-contain" /> Made with Launchly
        </a>
        {isPreview && <button type="button" onClick={() => setPreviewWatermarkVisible(false)} aria-label="Hide preview watermark" title="Hide preview watermark" className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 hover:bg-black/10 hover:text-black">×</button>}
      </div>}
    </div>
  );
}
