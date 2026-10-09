'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Zap, 
  Paintbrush, 
  Globe, 
  Code, 
  Shield, 
  Sparkles,
  MousePointerClick,
  CheckCircle2,
  Sliders,
  ExternalLink
} from 'lucide-react';

const CATEGORIES = ['All', 'Visual Design', 'Performance', 'Hosting & Code'];

const FEATURES = [
  {
    icon: Sparkles,
    category: 'Visual Design',
    title: 'Award-Winning Templates',
    description: '12+ professionally designed starting points across SaaS, AI, Creative Agencies, and E-commerce. Never start with a blank screen.',
    color: '#FF5500',
    stats: '12+ Styles',
  },
  {
    icon: Paintbrush,
    category: 'Visual Design',
    title: 'WYSIWYG Visual Customizer',
    description: 'Click to edit any text, replace images, adjust typography pairings, and modify brand colors with real-time responsive previews.',
    color: '#6366F1',
    stats: 'Zero Code',
  },
  {
    icon: Globe,
    category: 'Hosting & Code',
    title: 'Instant Edge Publishing',
    description: 'Publish your website live in 1-click on a fast Launchly subdomain or map your own custom domain with automated SSL.',
    color: '#22C55E',
    stats: 'Sub-second DNS',
  },
  {
    icon: Zap,
    category: 'Performance',
    title: '100/100 Lighthouse Performance',
    description: 'Automated image optimization, minified bundles, and modern CSS ensure instant First Contentful Paint on mobile and desktop.',
    color: '#F59E0B',
    stats: '99+ PageSpeed',
  },
  {
    icon: Code,
    category: 'Hosting & Code',
    title: 'Production Source Code Export',
    description: 'Upgrade to Pro and download the clean Next.js 15, Tailwind CSS, and TypeScript repository. Zero platform lock-in.',
    color: '#FF5E3A',
    stats: 'Next.js 15',
  },
  {
    icon: Shield,
    category: 'Hosting & Code',
    title: 'Enterprise-Grade Security',
    description: 'Automated TLS encryption, global DDoS mitigation, and 99.99% uptime SLA included automatically across all published sites.',
    color: '#8B5CF6',
    stats: '99.99% SLA',
  },
];

export default function Features() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? FEATURES
    : FEATURES.filter((f) => f.category === activeCategory);

  return (
    <section id="features" className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E6E0] text-xs sm:text-sm text-[#525252] mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#171717] mb-4">
            Engineered for speed,<br className="hidden sm:inline" /> design, and ownership.
          </h2>
          <p className="text-base sm:text-lg text-[#525252] max-w-xl mx-auto">
            From the first visual adjustment to custom domain deployment — Launchly eliminates the friction of website creation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6E0] text-[#525252] hover:text-[#171717] hover:bg-[#F5F4F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E6E0] hover:border-black/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-2xs"
                      style={{ background: `${feature.color}18` }}
                    >
                      <Icon size={22} style={{ color: feature.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#737373] bg-[#FAF9F6] border border-[#E8E6E0] px-2.5 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-[#171717] mb-2 tracking-[-0.01em]">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E6E0] flex items-center justify-between text-xs font-semibold text-[#171717]">
                  <span className="text-[#8A8A8A] text-[11px] font-normal">{feature.category}</span>
                  <Link
                    href="/templates"
                    className="inline-flex items-center gap-1 group-hover:text-black transition-colors"
                  >
                    <span>Explore</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast Action */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold bg-[#171717] hover:bg-[#FF5500] text-white shadow-sm hover:shadow-lg hover:shadow-[#FF5500]/20 transition-all group"
          >
            <span>Start Building for Free</span>
            <ArrowRight size={16} className="text-[#FF5500] group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
}
