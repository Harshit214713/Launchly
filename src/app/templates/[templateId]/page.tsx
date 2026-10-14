'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
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
  ExternalLink,
  Lock,
  Layers
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
  const [activeSection, setActiveSection] = useState('home');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white flex flex-col select-none">
      {/* Top Floating Control Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#161619] border-b border-white/10 flex items-center justify-between z-30 shrink-0 gap-3">
        {/* Left: Back and Template Metadata */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/templates"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Templates</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{template.name}</span>
              <span className="text-[10px] font-semibold text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                {template.category}
              </span>
              {template.isPro && (
                <span className="text-[10px] font-bold text-[#6366F1] bg-[#6366F1]/15 border border-[#6366F1]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={9} /> Pro
                </span>
              )}
              {template.rating && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/25 px-2 py-0.5 rounded-full">
                  ★ {template.rating} ({template.reviewsCount} reviews)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-black/50 border border-white/10 p-1 rounded-full shadow-inner">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              device === 'desktop' ? 'bg-white/20 text-white shadow-xs' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              device === 'tablet' ? 'bg-white/20 text-white shadow-xs' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              device === 'mobile' ? 'bg-white/20 text-white shadow-xs' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right: Color Accent Picker + Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Palette Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-full">
            <Palette size={12} className="text-white/40 mr-1" />
            {COLOR_PALETTES.map((pal, idx) => (
              <button
                key={pal.name}
                type="button"
                onClick={() => setActivePalette(idx)}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  activePalette === idx ? 'scale-125 border-white ring-1 ring-white/40' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: pal.color || template.accent }}
                title={`Accent: ${pal.name}`}
              />
            ))}
          </div>

          {/* Export Code Modal Trigger */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Source Code</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            title="Copy preview link"
          >
            {copied ? <Check size={13} className="text-[#22C55E]" /> : <Share2 size={13} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Primary Action: Customize in Editor */}
          <Link
            href={`/editor/${template.id}`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#FF5500] hover:bg-[#E04800] text-white shadow-sm hover:shadow-[#FF5500]/25 transition-all group"
          >
            <Sparkles size={13} />
            <span>Customize</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Main Preview Sandbox Container */}
      <div className="flex-1 overflow-auto bg-[#0A0A0C] p-2 sm:p-6 flex items-center justify-center">
        <div
          key={refreshKey}
          className="h-full min-h-[640px] max-h-[88vh] bg-white rounded-2xl shadow-[0_32px_90px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col border border-white/10 transition-all duration-300"
          style={{ width: deviceWidths[device] }}
        >
          {/* Simulated macOS Browser Chrome */}
          <div className="bg-[#F5F4F0] border-b border-[#E8E6E0] px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
            </div>

            {/* Address bar with lock and refresh */}
            <div className="flex items-center gap-2 bg-white px-4 py-1 rounded-full border border-[#E8E6E0] text-[11px] font-mono text-[#525252] shadow-2xs max-w-sm w-full justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <Lock size={10} className="text-[#22C55E]" />
                <span className="truncate">https://{template.id}.launchly.site</span>
              </div>
              <button
                type="button"
                onClick={() => setRefreshKey((k) => k + 1)}
                className="hover:text-black cursor-pointer text-[#8A8A8A]"
                title="Reload preview"
              >
                <RefreshCw size={11} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#8A8A8A] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              <span className="hidden sm:inline">Live Preview</span>
            </div>
          </div>

          {/* Fully Interactive Simulated Template Website */}
          <div 
            className="flex-1 overflow-y-auto select-text scroll-smooth"
            style={{ backgroundColor: template.bgColor, color: template.textColor }}
          >
            {/* Template Internal Navigation */}
            <nav className="sticky top-0 z-20 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between border-b border-black/5 bg-white/70">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                  style={{ backgroundColor: currentAccent }}
                >
                  {template.name.charAt(0)}
                </div>
                <span className="font-bold text-base tracking-tight text-[#171717]">
                  {template.name}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-[#525252]">
                {template.pages.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActiveSection(p.toLowerCase())}
                    className={`hover:text-black transition-colors capitalize cursor-pointer ${
                      activeSection === p.toLowerCase() ? 'text-black font-bold' : ''
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <Link
                href={`/editor/${template.id}`}
                className="text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-transform hover:scale-105"
                style={{ backgroundColor: currentAccent, color: '#171717' }}
              >
                Use Template
              </Link>
            </nav>

            {/* Template Hero Section */}
            <section className="px-6 sm:px-12 py-16 sm:py-24 text-center max-w-4xl mx-auto">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-2xs"
                style={{ backgroundColor: `${currentAccent}22`, color: currentAccent }}
              >
                <Sparkles size={12} />
                <span>Award-winning {template.category} layout</span>
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] mb-5 leading-[1.08] text-[#171717]">
                {template.description}
              </h2>

              <p className="text-sm sm:text-base opacity-75 max-w-xl mx-auto mb-8 leading-relaxed text-[#525252]">
                Customizable typography, responsive flex grids, SEO metadata, and zero-configuration global edge publishing.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/editor/${template.id}`}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:scale-103"
                  style={{ backgroundColor: currentAccent, color: '#171717' }}
                >
                  Customize in Studio
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveSection('features')}
                  className="px-5 py-3 rounded-full text-xs sm:text-sm font-medium border border-black/15 hover:border-black/30 transition-colors cursor-pointer text-[#171717]"
                >
                  Explore Features
                </button>
              </div>
            </section>

            {/* Template Key Highlights Grid */}
            <section className="px-6 sm:px-12 py-12 bg-black/[0.02] border-t border-black/5">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">
                    Template Specifications
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mt-1">
                    Everything you need to launch
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {template.features.map((feat) => (
                    <div 
                      key={feat} 
                      className="p-4 rounded-2xl bg-white border border-black/5 shadow-xs hover:border-black/15 transition-all text-left"
                    >
                      <CheckCircle2 size={18} className="mb-2.5" style={{ color: currentAccent }} />
                      <p className="text-xs font-bold text-[#171717]">{feat}</p>
                      <p className="text-[11px] text-[#737373] mt-1">
                        Fully responsive with modular React components.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Category-Specific Mock Interactive Section */}
            <section className="px-6 sm:px-12 py-16 max-w-4xl mx-auto text-left">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-black/10 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">
                      Interactive Demo Block
                    </span>
                    <h4 className="text-xl font-bold text-[#171717] mt-0.5">
                      Ready to customize with your content
                    </h4>
                  </div>
                  <Link
                    href={`/editor/${template.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:underline"
                  >
                    Open in Visual Editor <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6E0]">
                    <div className="text-xs font-bold text-[#171717]">Page Speed</div>
                    <div className="text-xl font-black mt-1" style={{ color: currentAccent }}>
                      99/100
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">Instant TTFB on Vercel & Netlify.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6E0]">
                    <div className="text-xs font-bold text-[#171717]">Responsive</div>
                    <div className="text-xl font-black mt-1 text-[#171717]">
                      100% Flex
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">Tailored for mobile, tablet, and desktop.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6E0]">
                    <div className="text-xs font-bold text-[#171717]">SEO Ready</div>
                    <div className="text-xl font-black mt-1 text-[#171717]">
                      Clean Markup
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">OpenGraph, metadata & semantic HTML.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Template Bottom Footer */}
            <footer className="px-6 py-10 border-t border-black/5 text-center text-xs text-[#8A8A8A] bg-white">
              <div className="flex items-center justify-center gap-2 mb-2 font-bold text-[#171717]">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#161619] border border-white/10 rounded-2xl p-6 shadow-2xl text-white animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF5500]/15 text-[#FF5500] flex items-center justify-center mb-4">
              <Download size={20} />
            </div>

            <h3 className="text-lg font-bold mb-1">Download Source Code</h3>
            <p className="text-xs text-white/70 mb-5 leading-relaxed">
              Export the production-ready Next.js 15, TailwindCSS, and TypeScript project for &ldquo;{template.name}&rdquo;. Zero vendor lock-in.
            </p>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Framework:</span>
                <span className="font-mono text-white font-semibold">Next.js 15 (App Router)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Styling:</span>
                <span className="font-mono text-white font-semibold">Tailwind CSS v4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">License:</span>
                <span className="font-mono text-[#FF5500] font-semibold">Commercial & Personal</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowExportModal(false);
                  setShowPaymentModal(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-[#FF5500] text-white hover:bg-[#E04800] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Pay & Download Source Code ($49)</span>
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href={`/editor/${template.id}`}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-medium text-center bg-white/10 hover:bg-white/15 text-white transition-colors"
                >
                  Edit in Studio First
                </Link>
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="py-2 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 transition-colors cursor-pointer"
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
