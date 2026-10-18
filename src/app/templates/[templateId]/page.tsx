'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowUpRight,
  Monitor, 
  Tablet, 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Share2,
  Download,
  Check,
  RefreshCw,
  Palette,
  Lock,
  X,
  Play,
  Terminal,
  Code2,
  Copy
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { notFound } from 'next/navigation';
import PaymentModal from '@/components/PaymentModal';

const COLOR_PALETTES = [
  { name: 'Original', color: '' },
  { name: 'Orange', color: '#FF5500' },
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Sunset', color: '#FF7733' },
  { name: 'Emerald', color: '#10B981' },
];

export default function TemplatePreviewPage({ 
  params 
}: { 
  params: Promise<{ templateId: string }> 
}) {
  const { templateId } = use(params);
  const template = TEMPLATES.find((t) => t.id === templateId);

  if (!template) {
    notFound();
  }

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [activePalette, setActivePalette] = useState(0);
  const [activeSection, setActiveSection] = useState(template.pages[0]?.toLowerCase() || 'overview');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Interactive playground states
  const [promptInput, setPromptInput] = useState('orchestrate multi-agent inference runtime with real-time prompt telemetry');
  const [isRunningPrompt, setIsRunningPrompt] = useState(false);
  const [tokensCount, setTokensCount] = useState(4200000);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [codeCopied, setCodeCopied] = useState(false);

  // Live token ticker animation when prompt runs
  useEffect(() => {
    if (!isRunningPrompt) return;
    const interval = setInterval(() => {
      setTokensCount((prev) => prev + Math.floor(Math.random() * 85000 + 15000));
    }, 180);
    const timeout = setTimeout(() => {
      setIsRunningPrompt(false);
      clearInterval(interval);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isRunningPrompt]);

  const currentAccent = COLOR_PALETTES[activePalette].color || template.accent;

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '390px',
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDarkTemplate = 
    template.bgColor.toLowerCase().startsWith('#0') || 
    template.bgColor.toLowerCase().startsWith('#1') || 
    template.textColor === '#FFFFFF';

  return (
    <div className="min-h-screen bg-background text-ink flex flex-col select-none overflow-x-hidden">
      {/* Top Floating Control Bar - Perfectly Aligned, No Overflow on 1366px or Mobile */}
      <header className="bg-card border-b-[2.5px] border-ink z-30 shrink-0 shadow-xs">
        <div className="w-full px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Back button & Template info */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/templates"
              className="brutal-press flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-display font-black uppercase tracking-wider text-black bg-yellow border-2 border-ink shadow-brutal-xs shrink-0"
            >
              <ArrowLeft size={13} className="stroke-[2.5]" />
              <span className="hidden sm:inline">Templates</span>
            </Link>
            
            <div className="h-4 w-[1.5px] bg-ink/20 hidden md:block shrink-0" />
            
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="font-display text-xs sm:text-sm font-black text-ink truncate max-w-[130px] sm:max-w-[180px]">
                {template.name}
              </span>
              <span className="font-mono text-[9px] font-black uppercase text-black bg-mint border border-ink px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                {template.category}
              </span>
              {template.isPro ? (
                <span className="font-mono text-[9px] font-black uppercase text-black bg-yellow border border-ink px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs shrink-0">
                  <Sparkles size={9} /> PRO
                </span>
              ) : (
                <span className="font-mono text-[9px] font-black uppercase text-black bg-pink border border-ink px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                  FREE
                </span>
              )}
            </div>
          </div>

          {/* Center: Device Viewport Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-background border-2 border-ink p-1 rounded-xl shadow-brutal-xs shrink-0">
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-display text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  device === d 
                    ? 'bg-pink text-black border border-ink shadow-2xs' 
                    : 'text-muted-foreground hover:text-ink'
                }`}
                title={`Switch to ${d} preview`}
              >
                {d === 'desktop' && <Monitor size={12} />}
                {d === 'tablet' && <Tablet size={12} />}
                {d === 'mobile' && <Smartphone size={12} />}
                <span className="capitalize">{d}</span>
              </button>
            ))}
          </div>

          {/* Right: Palette & Actions (Compact, fits comfortably on 1366px screen) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Color Palette Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-background border-2 border-ink px-2 py-1 rounded-xl shadow-brutal-xs">
              <Palette size={11} className="text-muted-foreground mr-0.5" />
              {COLOR_PALETTES.map((pal, idx) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => setActivePalette(idx)}
                  className={`w-3.5 h-3.5 rounded-full border-2 transition-transform cursor-pointer ${
                    activePalette === idx ? 'scale-125 border-ink ring-1 ring-ink' : 'border-black/30 hover:scale-110'
                  }`}
                  style={{ backgroundColor: pal.color || template.accent }}
                  title={`Accent: ${pal.name}`}
                />
              ))}
            </div>

            {/* Source Code Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="hidden xl:flex brutal-press items-center gap-1 px-2.5 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider text-black bg-mint border-2 border-ink shadow-brutal-xs cursor-pointer"
            >
              <Download size={12} />
              <span>Source Code</span>
            </button>

            {/* Share Link */}
            <button
              type="button"
              onClick={handleShare}
              className="brutal-press flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-display text-xs font-black uppercase tracking-wider text-ink bg-card border-2 border-ink shadow-brutal-xs cursor-pointer"
              title="Copy preview link"
            >
              {copied ? <Check size={12} className="text-green-600 stroke-[3]" /> : <Share2 size={12} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Primary Action: Customize */}
            <Link
              href={`/editor/${template.id}`}
              className="brutal-press flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider bg-pink text-black border-2 border-ink shadow-brutal-xs hover:bg-yellow transition-all group shrink-0"
            >
              <Sparkles size={12} />
              <span>Customize</span>
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Preview Sandbox Canvas - Warm Brutalist Studio Canvas */}
      <div 
        className="flex-1 overflow-auto bg-[#f6f3eb] dark:bg-[#0c0d15] p-3 sm:p-6 lg:p-8 flex items-center justify-center relative min-h-[640px]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'rgba(0, 0, 0, 0.08)'
        }}
      >
        <div
          key={refreshKey}
          className="h-full min-h-[600px] max-h-[86vh] bg-card rounded-2xl shadow-brutal-lg overflow-hidden flex flex-col border-[3px] border-black dark:border-[#2a2a3a] transition-all duration-300"
          style={{ width: deviceWidths[device] }}
        >
          {/* Simulated macOS Browser Window Chrome */}
          <div className={`border-b-2 px-4 py-2.5 flex items-center justify-between shrink-0 ${
            isDarkTemplate 
              ? 'bg-[#141522] border-black/40 text-white' 
              : 'bg-[#eeece4] border-black/15 text-black'
          }`}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-black/30" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/30" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41] border border-black/30" />
            </div>

            {/* Domain Address Bar */}
            <div className={`flex items-center gap-2 px-3.5 py-1 rounded-lg text-xs font-mono shadow-inner max-w-sm w-full justify-between border ${
              isDarkTemplate 
                ? 'bg-[#0b0b12] border-white/10 text-neutral-300' 
                : 'bg-white border-black/10 text-neutral-700'
            }`}>
              <div className="flex items-center gap-1.5 truncate">
                <Lock size={11} className="text-green-500 shrink-0" />
                <span className="truncate">https://{template.id}.launchly.site</span>
              </div>
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                className="hover:text-pink cursor-pointer text-neutral-400 shrink-0 transition-colors"
                title="Reload preview"
              >
                <RefreshCw size={11} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              <span className="hidden sm:inline">Live Preview</span>
            </div>
          </div>

          {/* Interactive Simulated Website (Rich, Layered & Aesthetic - NOT a flat black void) */}
          <div 
            className="flex-1 overflow-y-auto select-text scroll-smooth no-scrollbar relative"
            style={{ 
              backgroundColor: isDarkTemplate ? '#0e0f17' : (template.bgColor || '#FAF9F6'),
              color: isDarkTemplate ? '#FFFFFF' : '#171717'
            }}
          >
            {/* Ambient Lighting Gradient for Dark Aesthetic Themes */}
            {isDarkTemplate && (
              <>
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[320px] rounded-full blur-[110px] opacity-20 pointer-events-none transition-all duration-500"
                  style={{ backgroundColor: currentAccent }}
                />
                <div className="absolute top-60 -right-20 w-[350px] h-[350px] rounded-full blur-[120px] bg-indigo-500/10 pointer-events-none" />
              </>
            )}

            {/* Template Navigation Bar */}
            <nav 
              className={`sticky top-0 z-20 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between border-b ${
                isDarkTemplate
                  ? 'bg-[#12131e]/90 border-white/10 text-white shadow-xs'
                  : 'bg-white/90 border-black/10 text-[#171717] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                  style={{ backgroundColor: currentAccent }}
                >
                  {template.name.charAt(0)}
                </div>
                <span className={`font-bold text-base tracking-tight ${isDarkTemplate ? 'text-white' : 'text-[#171717]'}`}>
                  {template.name}
                </span>
              </div>

              {/* Interactive Tab Links */}
              <div className={`hidden sm:flex items-center gap-5 text-xs font-semibold ${
                isDarkTemplate ? 'text-neutral-300' : 'text-[#525252]'
              }`}>
                {template.pages.map((p) => {
                  const key = p.toLowerCase();
                  const isActive = activeSection === key;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setActiveSection(key)}
                      className={`transition-all capitalize cursor-pointer py-1 border-b-2 ${
                        isActive 
                          ? (isDarkTemplate ? 'text-white border-white font-bold' : 'text-black border-black font-bold') 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <Link
                href={`/editor/${template.id}`}
                className="text-xs font-bold px-4 py-2 rounded-full shadow-xs transition-transform hover:scale-105"
                style={{ backgroundColor: currentAccent, color: isDarkTemplate ? '#FFFFFF' : '#171717' }}
              >
                Use Template
              </Link>
            </nav>

            {/* DYNAMIC INTERACTIVE SECTION CONTENT */}

            {/* SECTION 1: OVERVIEW */}
            {activeSection === template.pages[0]?.toLowerCase() && (
              <div className="relative z-10">
                {/* Hero Section */}
                <section className="px-6 sm:px-12 pt-14 pb-12 sm:pt-18 sm:pb-16 text-center max-w-4xl mx-auto">
                  <div
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-black font-mono text-[11px] sm:text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000] mb-5"
                    style={{ backgroundColor: currentAccent }}
                  >
                    <span>{template.category.toUpperCase()}{' // '}{template.badge?.toUpperCase() || 'POPULAR'}</span>
                  </div>

                  <h1 className={`font-display text-4xl sm:text-6xl font-black tracking-tight mb-4 leading-[1.08] ${
                    isDarkTemplate ? 'text-white' : 'text-[#171717]'
                  }`}>
                    {template.name}
                  </h1>

                  <p className={`font-mono text-xs sm:text-base opacity-80 max-w-xl mx-auto mb-8 leading-relaxed ${
                    isDarkTemplate ? 'text-neutral-300' : 'text-[#525252]'
                  }`}>
                    {template.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href={`/editor/${template.id}`}
                      className="px-6 sm:px-8 py-3 rounded-xl border-2 border-black font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#000] hover:scale-103 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                      style={{ backgroundColor: currentAccent }}
                    >
                      <span>Customize in Studio</span>
                      <ArrowUpRight size={14} className="stroke-[3]" />
                    </Link>
                    <Link
                      href={`/live/${template.id}`}
                      target="_blank"
                      className={`px-5 sm:px-7 py-3 rounded-xl border-2 font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-xs ${
                        isDarkTemplate 
                          ? 'border-white/30 text-white hover:border-white bg-white/10' 
                          : 'border-black/30 text-black hover:border-black bg-black/5'
                      }`}
                    >
                      Live Website View
                    </Link>
                  </div>
                </section>

                {/* Interactive Live Playground Console */}
                <section className="px-6 sm:px-12 pb-14 max-w-3xl mx-auto text-left">
                  <div className={`p-5 rounded-2xl border shadow-lg backdrop-blur-md ${
                    isDarkTemplate 
                      ? 'bg-[#151624]/90 border-white/15' 
                      : 'bg-white border-black/15'
                  }`}>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} style={{ color: currentAccent }} />
                        <span className={`text-xs font-mono font-bold ${isDarkTemplate ? 'text-white' : 'text-black'}`}>
                          Live Runtime Playground
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        STREAMING ACTIVE
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        placeholder="Type an inference prompt or query..."
                        className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-mono focus:outline-none ${
                          isDarkTemplate 
                            ? 'bg-[#0b0b14] border-white/15 text-white placeholder:text-neutral-500' 
                            : 'bg-[#fafafa] border-black/10 text-black placeholder:text-neutral-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setIsRunningPrompt(true)}
                        disabled={isRunningPrompt}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: currentAccent, color: isDarkTemplate ? '#FFFFFF' : '#171717' }}
                      >
                        <Play size={12} className={isRunningPrompt ? "animate-spin" : ""} />
                        <span>{isRunningPrompt ? 'Executing...' : 'Run Prompt'}</span>
                      </button>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono opacity-75">
                      <span>Inference Speed: {(tokensCount / 1000000).toFixed(2)}M Tokens/s</span>
                      <span>P99 TTFB: 12ms</span>
                    </div>
                  </div>
                </section>

                {/* Key Highlights Grid */}
                <section className={`px-6 sm:px-12 py-12 border-t ${
                  isDarkTemplate ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/5'
                }`}>
                  <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${
                        isDarkTemplate ? 'text-neutral-400' : 'text-[#8A8A8A]'
                      }`}>
                        Template Specifications
                      </span>
                      <h3 className={`text-xl sm:text-2xl font-bold mt-1 ${
                        isDarkTemplate ? 'text-white' : 'text-[#171717]'
                      }`}>
                        Everything you need to launch
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {template.features.map((feat) => (
                        <div 
                          key={feat} 
                          className={`p-4 rounded-2xl border shadow-xs transition-all text-left ${
                            isDarkTemplate 
                              ? 'bg-[#181928] border-white/10 hover:border-white/25' 
                              : 'bg-white border-black/10 hover:border-black/20'
                          }`}
                        >
                          <CheckCircle2 size={18} className="mb-2.5" style={{ color: currentAccent }} />
                          <p className={`text-xs font-bold ${isDarkTemplate ? 'text-white' : 'text-[#171717]'}`}>
                            {feat}
                          </p>
                          <p className={`text-[11px] mt-1 ${isDarkTemplate ? 'text-neutral-400' : 'text-[#737373]'}`}>
                            Fully responsive with modular React components.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* SECTION 2: PRICING */}
            {activeSection.includes('pricing') && (
              <section className="px-6 sm:px-12 py-16 max-w-4xl mx-auto text-center relative z-10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: currentAccent }}>
                  Flexible Plans
                </span>
                <h3 className={`text-3xl font-black mt-1 mb-4 ${isDarkTemplate ? 'text-white' : 'text-black'}`}>
                  Simple, Transparent Pricing
                </h3>

                {/* Billing toggle */}
                <div className="inline-flex items-center gap-2 p-1 rounded-full border border-white/10 bg-black/20 mb-10 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-white text-black' : 'text-neutral-400'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                      billingCycle === 'annual' ? 'bg-white text-black' : 'text-neutral-400'
                    }`}
                  >
                    Annual (Save 20%)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {[
                    { name: 'Starter', price: billingCycle === 'monthly' ? '$19' : '$15', desc: 'Ideal for early-stage builders' },
                    { name: 'Professional', price: billingCycle === 'monthly' ? '$49' : '$39', desc: 'High-throughput scaling teams', popular: true },
                    { name: 'Enterprise', price: billingCycle === 'monthly' ? '$199' : '$159', desc: 'Dedicated cluster with SLA' },
                  ].map((tier) => (
                    <div
                      key={tier.name}
                      className={`p-6 rounded-2xl border transition-all ${
                        tier.popular
                          ? (isDarkTemplate ? 'bg-[#1b1d2e] border-white/30 ring-2 ring-white/20' : 'bg-white border-black ring-2 ring-black/20')
                          : (isDarkTemplate ? 'bg-[#141522] border-white/10' : 'bg-white border-black/10')
                      }`}
                    >
                      {tier.popular && (
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-pink text-black inline-block mb-3">
                          MOST POPULAR
                        </span>
                      )}
                      <h4 className={`text-lg font-bold ${isDarkTemplate ? 'text-white' : 'text-black'}`}>{tier.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 mb-4">{tier.desc}</p>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className={`text-3xl font-black ${isDarkTemplate ? 'text-white' : 'text-black'}`}>{tier.price}</span>
                        <span className="text-xs text-neutral-400">/month</span>
                      </div>
                      <Link
                        href={`/editor/${template.id}`}
                        className="block w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all hover:scale-102"
                        style={{ backgroundColor: tier.popular ? currentAccent : 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
                      >
                        Choose {tier.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: SPECS / RUNTIME / DOCS */}
            {activeSection !== template.pages[0]?.toLowerCase() && !activeSection.includes('pricing') && (
              <section className="px-6 sm:px-12 py-16 max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-10">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider capitalize" style={{ color: currentAccent }}>
                    {activeSection} View
                  </span>
                  <h3 className={`text-3xl font-black mt-1 capitalize ${isDarkTemplate ? 'text-white' : 'text-black'}`}>
                    {template.name}{' // '}{activeSection}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 max-w-lg mx-auto">
                    Interactive modular architecture. Click any item to explore simulated telemetry.
                  </p>
                </div>

                <div className={`rounded-2xl border p-6 font-mono text-xs shadow-lg ${
                  isDarkTemplate ? 'bg-[#12131e] border-white/15 text-neutral-300' : 'bg-[#f8f8f8] border-black/10 text-black'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="font-bold flex items-center gap-2">
                      <Code2 size={14} style={{ color: currentAccent }} />
                      <span>{template.id}-client.ts</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(`import { ${template.name.replace(/\s+/g, '')}Client } from '@launchly/templates';\n\nconst client = new ${template.name.replace(/\s+/g, '')}Client({\n  apiKey: process.env.API_KEY,\n  streaming: true,\n});`);
                        setCodeCopied(true);
                        setTimeout(() => setCodeCopied(false), 2000);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                    >
                      <Copy size={11} />
                      <span>{codeCopied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  <pre className="overflow-x-auto leading-relaxed">
{`import { ${template.name.replace(/\s+/g, '')}Client } from '@launchly/templates';

// Initialize ${template.name} high-speed edge client
const client = new ${template.name.replace(/\s+/g, '')}Client({
  apiKey: process.env.LAUNCHLY_API_KEY,
  streaming: true,
  latencyMode: 'zero-shot'
});

export async function handleInference(prompt: string) {
  const response = await client.execute({
    prompt,
    maxTokens: 4096,
    temperature: 0.7
  });
  return response.stream();
}`}
                  </pre>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href={`/editor/${template.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all"
                    style={{ backgroundColor: currentAccent, color: isDarkTemplate ? '#FFFFFF' : '#171717' }}
                  >
                    <Sparkles size={13} />
                    <span>Open in Visual Editor</span>
                  </Link>
                </div>
              </section>
            )}

            {/* Template Bottom Footer */}
            <footer className={`px-6 py-10 border-t text-center text-xs relative z-10 ${
              isDarkTemplate 
                ? 'bg-[#0a0b12] border-white/10 text-neutral-400' 
                : 'bg-white border-black/5 text-[#8A8A8A]'
            }`}>
              <div className={`flex items-center justify-center gap-2 mb-2 font-bold ${
                isDarkTemplate ? 'text-white' : 'text-[#171717]'
              }`}>
                <span>{template.name}</span>
                <span>•</span>
                <span>Powered by Launchly Studio</span>
              </div>
              <p>© {new Date().getFullYear()} All rights reserved. Customize this site freely.</p>
            </footer>
          </div>
        </div>
      </div>

      {/* Code Export & Download Modal */}
      {showExportModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-md bg-card border-[3.5px] border-ink rounded-3xl p-6 shadow-brutal-lg text-ink space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-yellow border-2 border-ink text-black flex items-center justify-center shadow-brutal-xs">
                  <Download size={16} className="stroke-[2.5]" />
                </div>
                <h3 className="text-base font-display font-black text-ink">Download Source Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="brutal-press h-8 w-8 rounded-xl border-2 border-ink bg-card text-ink flex items-center justify-center cursor-pointer shadow-brutal-xs"
              >
                <X size={15} className="stroke-[2.5]" />
              </button>
            </div>

            <p className="text-xs font-mono text-muted-foreground leading-relaxed">
              Export the production-ready Next.js 15, TailwindCSS, and TypeScript project for &ldquo;{template.name}&rdquo;. Zero vendor lock-in.
            </p>

            <div className="p-3.5 rounded-2xl bg-background border-2 border-ink space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Framework:</span>
                <span className="font-bold text-ink">Next.js 15 (App Router)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Styling:</span>
                <span className="font-bold text-ink">Tailwind CSS v4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">License:</span>
                <span className="font-bold text-pink">Commercial & Personal</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  setShowPaymentModal(true);
                }}
                className="brutal-press w-full py-2.5 px-4 rounded-xl font-display text-xs font-black uppercase tracking-wider text-black bg-pink border-2 border-ink shadow-brutal-xs hover:bg-yellow transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={14} className="stroke-[2.5]" />
                <span>Pay & Download Source Code ($49)</span>
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href={`/editor/${template.id}`}
                  className="brutal-press flex-1 py-2 px-3 rounded-xl font-display text-xs font-black uppercase text-center bg-card border-2 border-ink text-ink shadow-brutal-xs hover:bg-neutral-100 dark:hover:bg-[#1a1a26]"
                >
                  Edit in Studio First
                </Link>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="brutal-press py-2 px-4 rounded-xl font-display text-xs font-black uppercase bg-background border-2 border-ink text-muted-foreground hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official QR Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        itemName={`${template.name} Source Code`}
        price="$49"
        planId={`template-${template.id}`}
      />
    </div>
  );
}
