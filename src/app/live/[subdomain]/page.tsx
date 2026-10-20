'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Check, 
  Share2, 
  Edit3, 
  ArrowUpRight, 
  Star, 
  ChevronDown
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { Template } from '@/types';

export default function LiveWebsitePage({
  params
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const [copied, setCopied] = useState(false);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);
  const [siteSections, setSiteSections] = useState([
    { id: 'nav', name: 'Navigation', type: 'nav' },
    { id: 'hero', name: 'Hero', type: 'hero' },
    { id: 'gallery', name: 'Featured Products', type: 'gallery' },
    { id: 'features', name: 'Features', type: 'features' },
    { id: 'testimonials', name: 'Testimonials', type: 'testimonials' },
    { id: 'cta', name: 'Call to Action', type: 'cta' },
    { id: 'footer', name: 'Footer', type: 'footer' },
  ]);
  const [assetUrl, setAssetUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [watermarkRequired, setWatermarkRequired] = useState(false);
  const [previewWatermarkVisible, setPreviewWatermarkVisible] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const sectionOrder = (type: string) => Math.max(0, siteSections.findIndex((section) => section.type === type));
  const sectionVisible = (type: string) => siteSections.some((section) => section.type === type);
  const sectionName = (type: string, fallback: string) => siteSections.find((section) => section.type === type)?.name || fallback;

  // Template matching: match by subdomain or template id
  const template: Template = 
    TEMPLATES.find(t => t.id === subdomain.toLowerCase()) ||
    TEMPLATES.find(t => t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === subdomain.toLowerCase()) ||
    TEMPLATES[0];
  const productNames = template.id === 'velvet-boutique'
    ? ['The Cashmere Coat', 'Velvet Evening Bag', 'Heirloom Gold Cuff']
    : ['Silk Column Dress', 'The Everyday Tote', 'Sculpted Gold Hoops'];

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
      if (data.theme) setTheme(data.theme as typeof theme);
      if (data.heroContent) setHeroContent(data.heroContent as typeof heroContent);
      if (data.featuresContent) setFeaturesContent(data.featuresContent as typeof featuresContent);
      if (data.testimonialsContent) setTestimonialsContent(data.testimonialsContent as typeof testimonialsContent);
      if (data.ctaContent) setCtaContent(data.ctaContent as typeof ctaContent);
      if (Array.isArray(data.sections) && data.sections.length) setSiteSections(data.sections as typeof siteSections);
      if (typeof data.assetUrl === 'string') setAssetUrl(data.assetUrl);
      if (typeof data.logoUrl === 'string') setLogoUrl(data.logoUrl);
      if (typeof data.faviconUrl === 'string') setFaviconUrl(data.faviconUrl);
      // Older published sites default to a visible mark; the server controls new publish flags.
      setWatermarkRequired(typeof data.watermarkRequired === 'boolean' ? data.watermarkRequired : true);
    };
    const applyLocalDraft = () => {
      try {
        const saved = localStorage.getItem(`launchly_site_${subdomain.toLowerCase()}`) || localStorage.getItem(`launchly_site_${template.id}`);
        if (!saved) return;
        const draft = JSON.parse(saved);
        if (draft.siteName) setSiteTitle(draft.siteName);
        if (draft.theme) setTheme(draft.theme);
        if (draft.heroContent) setHeroContent(draft.heroContent);
        if (draft.featuresContent) setFeaturesContent(draft.featuresContent);
        if (draft.testimonialsContent) setTestimonialsContent(draft.testimonialsContent);
        if (draft.ctaContent) setCtaContent(draft.ctaContent);
        if (draft.sections?.length) setSiteSections(draft.sections);
        if (draft.assetUrl) setAssetUrl(draft.assetUrl);
        if (draft.logoUrl) setLogoUrl(draft.logoUrl);
        if (draft.faviconUrl) setFaviconUrl(draft.faviconUrl);
      } catch { /* Ignore a malformed local draft and render template defaults. */ }
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
  }, [subdomain, template.id]);

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
      <main className="flex flex-col flex-1 pt-12 sm:pt-13">
        {/* Navigation Block */}
        <nav style={{ order: sectionOrder('nav'), display: sectionVisible('nav') ? undefined : 'none' }} className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-4 border-b-2 border-black/10 bg-white/90 backdrop-blur-md sticky top-12 z-40">
          <div className="flex items-center gap-2.5">
            {logoUrl ? <Image src={logoUrl} alt={`${siteTitle} logo`} width={36} height={36} unoptimized className="h-9 w-9 rounded-lg object-contain" /> : <div
              style={{ backgroundColor: theme.primaryColor }}
              className="w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-display font-black text-sm text-black"
            >
              {siteTitle.charAt(0)}
            </div>}
            <span className="font-display font-black text-base sm:text-lg text-ink tracking-tight">
              {siteTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 font-mono text-xs font-bold text-neutral-700">
            {['Home', 'Collection', 'Features', 'Showcase'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="hover:text-black hover:underline cursor-pointer transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <a
            href="#collection"
            style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
            className="px-4 py-2 rounded-xl border-2 border-black font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            Get Started
          </a>
        </nav>

        {/* Hero Block — Rich Ambient Lighting, Vibrant Neo-Brutalist Badges, Crisp Typography */}
        <section
          id="home"
          className="py-16 sm:py-28 px-4 sm:px-12 text-center relative overflow-hidden"
          style={{ order: sectionOrder('hero'), display: sectionVisible('hero') ? undefined : 'none', background: theme.bgColor, color: theme.textColor }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25 pointer-events-none"
            style={{ backgroundColor: theme.primaryColor }}
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
            {/* Category / Status Pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-black font-mono text-[11px] sm:text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000]"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <span>{heroContent.badge}</span>
            </div>

            {/* Headline Title */}
            <h1 
              className="font-display text-3xl sm:text-6xl font-black tracking-tight leading-[1.08]"
              style={{ color: theme.textColor }}
            >
              {heroContent.title}
            </h1>

            {/* Description Subtitle */}
            <p 
              className="font-mono text-xs sm:text-base opacity-80 max-w-xl mx-auto leading-relaxed"
              style={{ color: theme.textColor }}
            >
              {heroContent.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#collection"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-6 sm:px-8 py-3 rounded-xl border-2 border-black font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>{heroContent.ctaPrimary}</span>
                <ArrowUpRight size={15} className="stroke-[3]" />
              </a>
              <a
                href="#features"
                style={{ borderRadius: theme.borderRadius }}
                className="px-5 sm:px-7 py-3 rounded-xl border-2 border-current bg-white/10 hover:bg-white/20 font-mono text-xs sm:text-sm font-bold transition-all backdrop-blur-xs"
              >
                {heroContent.ctaSecondary}
              </a>
            </div>

            {/* Live Telemetry Radar Pills */}
            <div className="pt-6 sm:pt-8 grid grid-cols-2 gap-3 max-w-lg mx-auto text-left">
              <div className="rounded-xl border border-current/20 bg-white/5 p-3.5 sm:p-4 backdrop-blur-sm">
                <span className="font-mono text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">
                  {heroContent.stat1Label}
                </span>
                <span className="font-display text-base sm:text-xl font-black">{heroContent.stat1Value}</span>
              </div>
              <div className="rounded-xl border border-current/20 bg-white/5 p-3.5 sm:p-4 backdrop-blur-sm">
                <span className="font-mono text-[9px] sm:text-[10px] font-bold opacity-60 block uppercase">
                  {heroContent.stat2Label}
                </span>
                <span className="font-display text-base sm:text-xl font-black">{heroContent.stat2Value}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="collection" style={{ order: sectionOrder('gallery'), display: sectionVisible('gallery') ? undefined : 'none' }} className="py-14 px-4 sm:px-12 bg-[#FAF9F6] text-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8"><p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: theme.primaryColor }}>Curated for you</p><h2 className="font-display text-2xl sm:text-3xl font-black mt-1">{sectionName('gallery', 'Featured pieces')}</h2></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {productNames.map((name, index) => (
                <article key={name} className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000]">
                  <div className="h-40 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}55, ${theme.primaryColor}15)` }}>
                    {assetUrl ? <>
                      {/* User-supplied assets may be arbitrary URLs or local data URLs. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetUrl} alt={name} className="h-full w-full object-cover" />
                    </> : <span className="font-display text-5xl font-black opacity-50">0{index + 1}</span>}
                  </div>
                  <div className="p-4"><h3 className="font-display font-black">{name}</h3><p className="font-mono text-xs text-neutral-500 mt-1">Premium materials · Made with care</p><div className="flex items-center justify-between mt-4"><span className="font-display font-black">${[189, 128, 78][index]}.00</span><button type="button" onClick={() => setCartCount((count) => count + 1)} className="rounded-lg border-2 border-black px-3 py-1.5 font-mono text-[10px] font-black" style={{ backgroundColor: theme.primaryColor }}>Add to bag</button></div></div>
                </article>
              ))}
            </div>
            <p className="text-right mt-4 font-mono text-xs font-bold">Shopping bag: {cartCount} item{cartCount === 1 ? '' : 's'}</p>
          </div>
        </section>

        {/* Features Block */}
        <section id="features" style={{ order: sectionOrder('features'), display: sectionVisible('features') ? undefined : 'none' }} className="py-16 sm:py-24 px-4 sm:px-12 bg-white text-black border-y-2 border-black/10">
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
                className="p-5 sm:p-6 rounded-2xl border-2 border-black bg-[#FAF9F6] shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition-transform"
              >
                <div
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center font-mono font-black text-xs text-black mb-3 shadow-[1.5px_1.5px_0px_#000]"
                >
                  0{i + 1}
                </div>
                <h3 className="font-display font-black text-base sm:text-lg mb-1.5 text-black">
                  {f.title}
                </h3>
                <p className="font-mono text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Block */}
        <section id="showcase" style={{ order: sectionOrder('testimonials'), display: sectionVisible('testimonials') ? undefined : 'none' }} className="py-16 sm:py-24 px-4 sm:px-12 bg-[#FFFDF8] text-black">
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
                className="p-5 sm:p-7 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_#000] flex flex-col justify-between"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow text-black stroke-[1.5]" />
                  ))}
                </div>
                <p className="font-mono text-xs sm:text-sm leading-relaxed mb-5 text-neutral-800">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-black/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-black bg-lilac flex items-center justify-center font-mono font-bold text-xs text-black">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-xs sm:text-sm text-black">{item.name}</h4>
                    <p className="font-mono text-[10px] sm:text-[11px] text-neutral-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Block */}
        <section id="pricing" style={{ order: sectionOrder('cta'), display: sectionVisible('cta') ? undefined : 'none' }} className="py-16 sm:py-24 px-4 sm:px-12 bg-black text-white text-center relative overflow-hidden">
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
                className="inline-block px-6 sm:px-8 py-3 rounded-xl border-2 border-white font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#FFFFFF] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                {ctaContent.buttonText}
              </a>
            </div>
          </div>
        </section>

        {/* Branded Footer Block */}
        <footer style={{ order: sectionOrder('footer'), display: sectionVisible('footer') ? undefined : 'none' }} className="py-8 px-4 sm:px-12 border-t-2 border-black/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-600">
          <div className="flex items-center gap-2 font-bold text-black">
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
      </main>
      {watermarkRequired && (!isPreview || previewWatermarkVisible) && <a href="https://launchly.site" target="_blank" rel="noreferrer" className="fixed bottom-3 right-3 z-[60] inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/90 px-3 py-2 text-[11px] font-semibold text-neutral-800 shadow-lg backdrop-blur" aria-label="Made with Launchly">
        <Image src="/brand-logo-clean.png" alt="" width={20} height={20} className="h-5 w-5 rounded-full object-contain" /> Made with Launchly
      </a>}
      {isPreview && watermarkRequired && <button type="button" onClick={() => setPreviewWatermarkVisible((visible) => !visible)} className="fixed bottom-3 left-3 z-[60] rounded-full border border-black/20 bg-white/90 px-3 py-2 text-[11px] font-semibold text-neutral-700 shadow-lg">{previewWatermarkVisible ? 'Hide preview watermark' : 'Show preview watermark'}</button>}
    </div>
  );
}
