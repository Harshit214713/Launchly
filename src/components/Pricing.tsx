'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Globe, 
  Loader2, 
  Plus,
  Minus,
  ShieldCheck,
  Zap
} from 'lucide-react';

const FREE_FEATURES = [
  'Access to curated free templates',
  'Visual website customizer',
  'Publish on Launchly edge subdomain',
  'Automated SSL certificate',
  'Mobile, tablet & desktop preview',
  'Basic visitor analytics',
  'Community support access',
];

const PRO_FEATURES = [
  'Everything included in Free',
  'Full source code download (Next.js 15 App Router)',
  'Access to all Pro templates & designs',
  'Custom domain mapping (e.g. yourbrand.com)',
  'Zero Launchly brand watermarks',
  'Priority 24/7 engineering support',
  'Edge SSR & global CDN caching',
  'Production build export with TypeScript',
];

const FAQS = [
  {
    q: 'Can I download the actual source code?',
    a: 'Yes! On the Pro plan or through a single template export, you receive clean, fully documented Next.js 15, React, Tailwind CSS v4, and TypeScript source code that you can self-host on Vercel, Netlify, AWS, or any server.'
  },
  {
    q: 'Do I need any coding or design experience to build?',
    a: 'Not at all. Launchly is designed specifically so anyone can customize typography, colors, sections, and images visually with live real-time responsive previews.'
  },
  {
    q: 'How does custom domain connection work?',
    a: 'On the Pro plan, you can connect your own domain (e.g. www.yourcompany.com). Simply add an A or CNAME record in your DNS provider, and Launchly automatically provisions an SSL certificate within minutes.'
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. There are zero contracts or cancellation fees. If you cancel, your published websites remain active through the end of your billing cycle.'
  },
  {
    q: 'Are the templates commercially licensed?',
    a: 'Yes! All templates and source code downloads include commercial rights for client work, personal projects, and startups.'
  }
];

export default function Pricing() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const monthlyPrice = 19;
  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.7);

  const handleSelectPlan = async (plan: 'free' | 'pro') => {
    setLoadingPlan(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      });
      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        router.push(data.checkoutUrl);
      } else {
        router.push(plan === 'pro' ? '/signup?plan=pro' : '/signup');
      }
    } catch {
      router.push(plan === 'pro' ? '/signup?plan=pro' : '/signup');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E6E0] text-xs font-semibold text-[#525252] mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
            <span>Transparent Plans</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#171717] mb-4">
            Start free, upgrade<br className="hidden sm:inline" /> when you need code.
          </h2>
          <p className="text-base sm:text-lg text-[#525252] max-w-xl mx-auto mb-8">
            Build and launch visually without spending a dime. Unlock full source code ownership whenever you are ready.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center p-1 bg-white rounded-full border border-[#E8E6E0] shadow-2xs">
            {(['monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBilling(period)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  billing === period
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-[#6B6B6B] hover:text-[#171717]'
                }`}
              >
                <span>{period.charAt(0).toUpperCase() + period.slice(1)}</span>
                {period === 'yearly' && (
                  <span className="ml-1.5 text-[10px] font-bold text-white bg-[#FF5500] px-2 py-0.5 rounded-full">
                    30% OFF
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-20 items-stretch">
          {/* Free plan */}
          <div className="rounded-3xl p-7 sm:p-10 border border-[#E8E6E0] bg-white flex flex-col justify-between hover:border-black/20 hover:shadow-xl transition-all duration-300">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs font-mono font-bold text-[#8A8A8A] uppercase tracking-wider mb-1 block">
                    Free Tier
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-[#171717]">$0</span>
                    <span className="text-[#8A8A8A] text-xs sm:text-sm">/ month</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A] mt-1">Unlimited draft projects & subdomain hosting</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FAF9F6] border border-[#E8E6E0] flex items-center justify-center shadow-2xs">
                  <Globe size={20} className="text-[#525252]" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('free')}
                disabled={loadingPlan === 'free'}
                className="w-full py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#FAF9F6] text-[#171717] border border-[#E8E6E0] hover:bg-[#F0EEE9] hover:border-black/20 transition-all flex items-center justify-center gap-2 mb-8 cursor-pointer disabled:opacity-75"
              >
                {loadingPlan === 'free' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <>
                    <span>Start Free Today</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A] block mb-3">
                  What is included:
                </span>
                {FREE_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-xs sm:text-sm text-[#525252]">
                    <div className="w-4 h-4 rounded-full bg-[#FAF9F6] border border-[#E8E6E0] flex items-center justify-center shrink-0">
                      <Check size={10} className="text-[#525252]" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-[#E8E6E0] flex items-center gap-2 text-[11px] text-[#737373]">
              <ShieldCheck size={14} className="text-[#22C55E]" />
              <span>Zero credit card required to get started</span>
            </div>
          </div>

          {/* Pro plan */}
          <div className="rounded-3xl p-7 sm:p-10 bg-[#171717] text-white flex flex-col justify-between relative overflow-hidden shadow-2xl border border-white/10 group">
            {/* Ambient Lighting - Sunset Orange */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
                      Pro Plan
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#FF5500] text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                      FULL OWNERSHIP
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white">
                      ${billing === 'monthly' ? monthlyPrice : Math.floor(yearlyPrice / 12)}
                    </span>
                    <span className="text-white/60 text-xs sm:text-sm">/ month</span>
                  </div>
                  {billing === 'yearly' && (
                    <p className="text-xs text-[#FF5500] font-semibold mt-1">
                      ${yearlyPrice} billed annually (Save $69/year)
                    </p>
                  )}
                </div>
                <div className="w-11 h-11 rounded-2xl bg-[#FF5500]/15 border border-[#FF5500]/30 flex items-center justify-center shadow-xs">
                  <Sparkles size={20} className="text-[#FF5500]" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPlan('pro')}
                disabled={loadingPlan === 'pro'}
                className="w-full py-3.5 px-4 rounded-full text-xs sm:text-sm font-bold bg-[#FF5500] hover:bg-[#E04800] text-white transition-all shadow-lg shadow-[#FF5500]/25 flex items-center justify-center gap-2 mb-8 cursor-pointer disabled:opacity-75"
              >
                {loadingPlan === 'pro' ? (
                  <Loader2 size={15} className="animate-spin text-white" />
                ) : (
                  <>
                    <span>Unlock Pro & Download Code</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/60 block mb-3">
                  Everything in Free, plus:
                </span>
                {PRO_FEATURES.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                    <div className="w-4 h-4 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-[#FF5500]" />
                    </div>
                    <span className={feature.includes('source code') ? 'font-bold text-[#FF5500]' : ''}>
                      {feature}
                    </span>
                    {feature.includes('source code') && (
                      <Download size={13} className="text-[#FF5500] ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-white/60 relative z-10">
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-[#FF5500]" />
                Instant activation
              </span>
              <span>Cancel online anytime</span>
            </div>
          </div>
        </div>

        {/* Aesthetic FAQ Section */}
        <div id="faq" className="pt-16 border-t border-[#E8E6E0]">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8A8A8A] block mb-2">
              Common Questions
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#171717] tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#FF5500]/30 shadow-sm'
                      : 'bg-white/70 border-[#E8E6E0] hover:bg-white hover:border-[#171717]/15'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#171717]">{faq.q}</span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isOpen ? 'bg-[#FF5500] text-white' : 'bg-[#FAF9F6] text-[#737373]'
                      }`}
                    >
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-black/5 bg-[#FAF9F6]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
