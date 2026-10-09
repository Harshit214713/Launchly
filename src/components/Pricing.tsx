'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  Plus,
  Minus,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

const FREE_FEATURES = [
  'Access to curated free templates',
  'Visual website customizer',
  'Publish on Launchly edge subdomain',
  'Automated SSL certificate',
  'Responsive desktop, tablet & mobile preview',
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
  'Production build export with TypeScript & Tailwind v4',
];

const FAQS = [
  {
    q: 'Can I download the actual Next.js source code?',
    a: 'Yes! On the Pro plan, you can download clean, fully documented Next.js 15, React 19, Tailwind CSS v4, and TypeScript code that you can deploy to Vercel, Netlify, or any VPS.'
  },
  {
    q: 'Do I need any coding or design experience to build?',
    a: 'Not at all. Launchly is built for creators, marketers, and founders. You customize typography, colors, sections, and images visually with live real-time responsive previews.'
  },
  {
    q: 'How does custom domain connection work?',
    a: 'On Pro, you simply add an A or CNAME record with your DNS registrar (Cloudflare, GoDaddy, Namecheap). Launchly automatically provisions an SSL certificate within minutes.'
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes. There are zero contracts or lock-in. If you cancel, your published websites stay live through the end of your billing cycle.'
  },
  {
    q: 'Are the templates commercially licensed?',
    a: 'Yes! All templates and source code downloads include commercial rights for client work, personal projects, and startups.'
  }
];

export default function Pricing() {
  const router = useRouter();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const monthlyPrice = 19;
  const yearlyPrice = Math.floor(monthlyPrice * 12 * 0.7);

  const handleSelectPlan = (plan: 'free' | 'pro') => {
    router.push(plan === 'pro' ? '/signup?plan=pro' : '/signup');
  };

  return (
    <section id="pricing" className="mx-auto w-[min(1200px,calc(100%-32px))] py-8 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-yellow px-4 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-black shadow-brutal mb-4">
          <Zap size={13} className="fill-black" />
          Transparent Pricing
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-ink leading-tight">
          Ship fast, pay fair.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          Start for free, upgrade when you want custom domains and source code export.
        </p>

        {/* Neo-brutalist Billing Toggle */}
        <div className="mt-8 inline-flex items-center rounded-2xl border-[3px] border-ink bg-card p-1.5 shadow-brutal">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-black transition-all cursor-pointer ${
              billing === 'monthly'
                ? 'bg-pink text-black shadow-brutal-sm'
                : 'text-muted-foreground hover:text-black'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('yearly')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs sm:text-sm font-black transition-all cursor-pointer ${
              billing === 'yearly'
                ? 'bg-pink text-black shadow-brutal-sm'
                : 'text-muted-foreground hover:text-black'
            }`}
          >
            <span>Yearly</span>
            <span className="rounded-md border border-ink bg-mint px-2 py-0.5 font-mono text-[10px] font-black text-black">
              Save 30%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Card */}
        <div className="rounded-3xl border-[4px] border-ink bg-card p-8 sm:p-10 shadow-brutal-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-muted-foreground">
                Starter Tier
              </span>
              <span className="rounded-full border-2 border-ink bg-[#fdf2f8] px-3 py-0.5 font-mono text-[11px] font-bold text-black">
                Free Forever
              </span>
            </div>

            <h3 className="mt-3 font-display text-3xl font-black text-ink">Free Plan</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Perfect for exploring templates and launching test landing pages.
            </p>

            <div className="my-6 pb-6 border-b-[2.5px] border-ink/20">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl sm:text-6xl font-black text-ink">$0</span>
                <span className="font-mono text-sm text-muted-foreground">/ month</span>
              </div>
            </div>

            <ul className="space-y-3.5 mb-8">
              {FREE_FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-mono text-ink">
                  <span className="h-5 w-5 shrink-0 rounded-full border-2 border-ink bg-mint text-black flex items-center justify-center">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('free')}
            className="brutal-press w-full rounded-2xl border-[3px] border-ink bg-card py-4 font-display text-base font-black text-ink shadow-brutal hover:bg-neutral-100 cursor-pointer"
          >
            Start Free
          </button>
        </div>

        {/* Pro Card */}
        <div className="rounded-3xl border-[4px] border-ink bg-card p-8 sm:p-10 shadow-brutal-xl relative flex flex-col justify-between ring-2 ring-pink/40">
          {/* Popular Choice Floating Pill */}
          <div className="absolute -top-4 right-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border-[2.5px] border-ink bg-yellow px-4 py-1 font-mono text-[11px] font-black uppercase text-black shadow-brutal-sm">
              <Sparkles size={12} />
              POPULAR CHOICE
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-pink">
                Production Tier
              </span>
              <span className="rounded-full border-2 border-ink bg-pink px-3 py-0.5 font-mono text-[11px] font-black text-black">
                Full Power
              </span>
            </div>

            <h3 className="mt-3 font-display text-3xl font-black text-ink">Pro Creator</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              For ambitious founders, agencies, and businesses ready to launch.
            </p>

            <div className="my-6 pb-6 border-b-[2.5px] border-ink/20">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-5xl sm:text-6xl font-black text-ink">
                  ${billing === 'monthly' ? monthlyPrice : Math.round(yearlyPrice / 12)}
                </span>
                <span className="font-mono text-sm text-muted-foreground">/ month</span>
              </div>
              {billing === 'yearly' && (
                <span className="font-mono text-xs text-mint font-bold mt-1 block">
                  Billed annually (${yearlyPrice}/yr)
                </span>
              )}
            </div>

            <ul className="space-y-3.5 mb-8">
              {PRO_FEATURES.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-mono text-ink">
                  <span className="h-5 w-5 shrink-0 rounded-full border-2 border-ink bg-pink text-black flex items-center justify-center">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                  <span className={idx < 2 ? 'font-bold' : ''}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('pro')}
            className="brutal-press w-full rounded-2xl border-[3px] border-ink bg-pink py-4 font-display text-base font-black text-black shadow-brutal hover:bg-pink/90 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Upgrade to Pro</span>
            <ArrowUpRight size={18} className="stroke-[3]" />
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-card px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink shadow-brutal mb-3">
            <HelpCircle size={13} />
            Got Questions?
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-black text-ink">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-[3px] border-ink bg-card shadow-brutal overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-display text-base sm:text-lg font-black text-ink cursor-pointer hover:bg-neutral-100 dark:hover:bg-[#1e1e2c] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="h-8 w-8 rounded-xl border-2 border-ink bg-yellow flex items-center justify-center text-black shrink-0 ml-4 shadow-brutal-sm">
                  {openFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-mono text-muted-foreground leading-relaxed border-t-[2px] border-ink/15">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
