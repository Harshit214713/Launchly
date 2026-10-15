'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Check, 
  Share2, 
  Edit3, 
  ArrowUpRight, 
  Star, 
  ChevronDown,
  Sparkles
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

  // Template matching: match by subdomain or template id
  const template: Template = 
    TEMPLATES.find(t => t.id === subdomain.toLowerCase()) ||
    TEMPLATES.find(t => t.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === subdomain.toLowerCase()) ||
    TEMPLATES[0];

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

  const [featuresContent, setFeaturesContent] = useState([
    { 
      title: template.features[0] || 'Deterministic Edge', 
      desc: 'Global sub-millisecond propagation with zero cold starts across 300+ edge nodes.' 
    },
    { 
      title: template.features[1] || 'Neural Reasoning', 
      desc: 'Integrated multi-agent execution pipeline with instant structured telemetry.' 
    },
    { 
      title: template.features[2] || 'Zero Friction', 
      desc: 'Production-ready Next.js 15 App Router architecture with full TypeScript safety.' 
    },
  ]);

  const [testimonialsContent, setTestimonialsContent] = useState([
    { 
      quote: 'Shipped our client flagship in less than 3 hours. The aesthetic level is completely unmatched.', 
      name: 'Tanisha Mehindritta', 
      role: 'Lead Product Designer' 
    },
    { 
      quote: 'The cleanest Next.js export in the industry. Saved our startup weeks of frontend scaffolding.', 
      name: 'Divyam Jain', 
      role: 'Founding Engineer' 
    }
  ]);

  const [ctaContent, setCtaContent] = useState({
    title: `Start building with ${template.name}.`,
    desc: 'Export full production Next.js source code anytime. Zero lock-in.',
    buttonText: 'Claim Workspace →',
  });

  // Load custom saved data from localStorage or API
  useEffect(() => {
    // 1. Check localStorage first for instant fidelity with Editor changes
    if (typeof window !== 'undefined') {
      try {
        const saved = 
          localStorage.getItem(`launchly_site_${subdomain.toLowerCase()}`) ||
          localStorage.getItem(`launchly_site_${template.id}`);

        if (saved) {
          const parsed = JSON.parse(saved);
          requestAnimationFrame(() => {
            if (parsed.siteName) setSiteTitle(parsed.siteName);
            if (parsed.theme) setTheme(parsed.theme);
            if (parsed.heroContent) setHeroContent(parsed.heroContent);
            if (parsed.featuresContent) setFeaturesContent(parsed.featuresContent);
            if (parsed.testimonialsContent) setTestimonialsContent(parsed.testimonialsContent);
            if (parsed.ctaContent) setCtaContent(parsed.ctaContent);
          });
          return;
        }
      } catch {}
    }

    // 2. Fetch from API database
    fetch(`/api/sites?subdomain=${encodeURIComponent(subdomain)}`)
      .then(res => res.json())
      .then(data => {
        if (data.site) {
          const s = data.site;
          if (s.name) setSiteTitle(s.name);
          if (s.site_data || s.siteData) {
            const sd = s.site_data || s.siteData;
            if (sd.theme) setTheme(sd.theme);
            if (sd.heroContent) setHeroContent(sd.heroContent);
            if (sd.featuresContent) setFeaturesContent(sd.featuresContent);
            if (sd.testimonialsContent) setTestimonialsContent(sd.testimonialsContent);
            if (sd.ctaContent) setCtaContent(sd.ctaContent);
          }
        }
      })
      .catch(() => {});
  }, [subdomain, template.id]);

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
      <main className="flex-1 pt-12 sm:pt-13">
        {/* Navigation Block */}
        <nav className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-4 border-b-2 border-black/10 bg-white/90 backdrop-blur-md sticky top-12 z-40">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: theme.primaryColor }}
              className="w-8 h-8 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-display font-black text-sm text-black"
            >
              {siteTitle.charAt(0)}
            </div>
            <span className="font-display font-black text-base sm:text-lg text-ink tracking-tight">
              {siteTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 font-mono text-xs font-bold text-neutral-700">
            {['Home', 'Features', 'Showcase', 'Pricing'].map(item => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="hover:text-black hover:underline cursor-pointer transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          <button
            type="button"
            style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
            className="px-4 py-2 rounded-xl border-2 border-black font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            Get Started
          </button>
        </nav>

        {/* Hero Block — Rich Ambient Lighting, Vibrant Neo-Brutalist Badges, Crisp Typography */}
        <section
          id="home"
          className="py-16 sm:py-28 px-4 sm:px-12 text-center relative overflow-hidden"
          style={{ background: theme.bgColor, color: theme.textColor }}
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
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-6 sm:px-8 py-3 rounded-xl border-2 border-black font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{heroContent.ctaPrimary}</span>
                <ArrowUpRight size={15} className="stroke-[3]" />
              </button>
              <button
                type="button"
                style={{ borderRadius: theme.borderRadius }}
                className="px-5 sm:px-7 py-3 rounded-xl border-2 border-current bg-white/10 hover:bg-white/20 font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-xs"
              >
                {heroContent.ctaSecondary}
              </button>
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

        {/* Features Block */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-12 bg-white text-black border-y-2 border-black/10">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-black/20 bg-[#FAF9F6] font-mono text-[10px] font-bold uppercase text-neutral-600">
              <Sparkles size={11} className="text-pink" />
              <span>Core Architecture</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
              Engineered for hyper-scale precision.
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
        <section id="showcase" className="py-16 sm:py-24 px-4 sm:px-12 bg-[#FFFDF8] text-black">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="font-display text-2xl sm:text-4xl font-black tracking-tight">
              Trusted by world-class teams.
            </h2>
            <p className="font-mono text-xs text-neutral-500">
              Verified production deployments powered by Launchly Edge
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
        <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-12 bg-black text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-lg mx-auto space-y-3.5">
            <h2 className="font-display text-2xl sm:text-4xl font-black">
              {ctaContent.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400">
              {ctaContent.desc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-6 sm:px-8 py-3 rounded-xl border-2 border-white font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#FFFFFF] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              >
                {ctaContent.buttonText}
              </button>
            </div>
          </div>
        </section>

        {/* Branded Footer Block */}
        <footer className="py-8 px-4 sm:px-12 border-t-2 border-black/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-600">
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
    </div>
  );
}
