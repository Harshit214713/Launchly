'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  ExternalLink, 
  Edit3, 
  ArrowLeft, 
  Check, 
  Share2, 
  Lock, 
  Sparkles, 
  CheckCircle2,
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
  const [siteData, setSiteData] = useState<{
    name: string;
    templateId: string;
    subdomain: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [bannerCollapsed, setBannerCollapsed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // Check API or localStorage for published site records
    fetch('/api/sites')
      .then((r) => r.json())
      .then((data) => {
        if (data.sites) {
          const match = data.sites.find((s: { subdomain: string }) => s.subdomain.toLowerCase() === subdomain.toLowerCase());
          if (match) {
            setSiteData(match);
            return;
          }
        }
        // Fallback matching against templates
        const tmpl = TEMPLATES.find(t => t.id === subdomain) || TEMPLATES[0];
        setSiteData({
          name: tmpl.name,
          templateId: tmpl.id,
          subdomain,
        });
      })
      .catch(() => {
        const tmpl = TEMPLATES.find(t => t.id === subdomain) || TEMPLATES[0];
        setSiteData({
          name: tmpl.name,
          templateId: tmpl.id,
          subdomain,
        });
      });
  }, [subdomain]);

  const template: Template = TEMPLATES.find(t => t.id === siteData?.templateId) || TEMPLATES[0];
  const accent = template.accent || '#FF5500';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: `live_${subdomain}` }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Floating Edge Deployment Live Topbar */}
      <div className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ${bannerCollapsed ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="bg-[#121214]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 text-white flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-lg bg-[#FF5500] text-white flex items-center justify-center font-black text-xs shadow-xs">
                ⚡
              </div>
              <span className="font-bold text-xs tracking-tight text-white group-hover:text-[#FF5500] transition-colors hidden sm:inline">
                Launchly Live
              </span>
            </Link>

            <div className="h-3.5 w-px bg-white/15" />

            {/* Live Subdomain Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono">
              <Lock size={10} className="text-[#22C55E]" />
              <span className="text-[#FF5500] font-bold">{subdomain}</span>
              <span className="text-white/60">.launchly.site</span>
              <span className="ml-1 px-1.5 py-0.2 bg-[#22C55E]/20 text-[#22C55E] rounded text-[9px] font-bold">
                ONLINE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 transition-colors"
              title="Copy live link"
            >
              {copied ? <Check size={12} className="text-[#22C55E]" /> : <Share2 size={12} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <Link
              href={`/editor/${template.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF5500] hover:bg-[#E04800] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Edit3 size={11} />
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
              className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
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
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
          <span>Launchly Bar</span>
        </button>
      )}

      {/* Actual Live Website Surface */}
      <main 
        className="flex-1 pt-12"
        style={{ backgroundColor: template.bgColor, color: template.textColor }}
      >
        {/* Navigation Bar */}
        <header className="border-b border-black/5 bg-white/80 backdrop-blur-md sticky top-12 z-40 px-6 sm:px-12 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs"
                style={{ backgroundColor: accent }}
              >
                {template.name.charAt(0)}
              </div>
              <span className="font-bold text-lg tracking-tight text-[#171717]">
                {siteData?.name || template.name}
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#525252]">
              {template.pages.map((page) => (
                <span key={page} className="hover:text-black cursor-pointer transition-colors">
                  {page}
                </span>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button 
                className="px-4 py-2 rounded-full text-xs font-bold text-white shadow-xs transition-transform hover:scale-105"
                style={{ backgroundColor: accent }}
              >
                Get Started
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 sm:px-12 py-20 sm:py-32 text-center max-w-4xl mx-auto">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 shadow-2xs"
            style={{ backgroundColor: `${accent}18`, color: accent }}
          >
            <Sparkles size={13} />
            <span>Official Live Website // {template.category}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.03em] leading-[1.02] mb-6 text-[#171717]">
            {template.description}
          </h1>

          <p className="text-base sm:text-xl text-[#525252] max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to our live digital hub. Seamless experience deployed globally on edge network infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white shadow-lg transition-all hover:scale-103"
              style={{ backgroundColor: accent }}
            >
              Explore Products
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold bg-white border border-black/15 text-[#171717] hover:bg-[#F5F4F0] transition-colors"
            >
              Contact Team
            </button>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {template.features.map((feat, idx) => (
              <div 
                key={feat}
                className="p-5 rounded-2xl bg-white border border-black/5 shadow-xs hover:border-black/15 transition-all"
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs mb-3"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  {idx + 1}
                </div>
                <h3 className="font-bold text-sm text-[#171717] mb-1">{feat}</h3>
                <p className="text-xs text-[#737373] leading-relaxed">
                  Engineered with production-grade components and sub-second latency.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Live Interactive Newsletter Section */}
        <section className="px-6 sm:px-12 py-16 bg-[#F5F4F0] border-y border-black/5 text-center">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-black text-[#171717] mb-2">
              Stay updated with {siteData?.name || template.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#737373] mb-6">
              Subscribe to get product announcements, release notes, and exclusive insights.
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 size={16} />
                <span>Thank you! Your email is registered with this live deployment.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E6E0] text-sm text-[#171717] outline-none focus:border-[#FF5500]"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-transform hover:scale-102"
                  style={{ backgroundColor: accent }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 sm:px-12 py-12 text-center text-xs text-[#8A8A8A] bg-white">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold text-[#171717]">
              <span>{siteData?.name || template.name}</span>
              <span>•</span>
              <span className="font-normal text-[#8A8A8A]">Deployed live at {subdomain}.launchly.site</span>
            </div>
            <div className="flex items-center gap-4 text-[#525252]">
              <Link href="/" className="hover:text-black">
                Powered by Launchly Studio
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
