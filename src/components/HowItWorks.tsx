'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Sliders, Sparkles, Check } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Pick a template',
    badge: 'Step 1',
    description: 'Browse our curated gallery of modern, production-ready website templates. Filter by category (SaaS, Agency, Portfolio, Store) or search your specific niche.',
    cta: 'Browse all templates',
    href: '/templates',
  },
  {
    number: '02',
    title: 'Make it yours',
    badge: 'Step 2',
    description: 'Customize visually with zero code. Swap headlines, tweak layouts, change colors, and upload your brand assets in real-time.',
    cta: 'Try visual editor',
    href: '/editor/saas-launch',
  },
  {
    number: '03',
    title: 'Publish & launch',
    badge: 'Step 3',
    description: 'Publish live in one click to a free Launchly subdomain or hook up your custom domain. Ready to export? Download the Next.js source code anytime.',
    cta: 'Claim your domain',
    href: '/signup',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dynamically highlight the 3 boxes in sequence as the user scrolls down or up
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile vertical stack: highlight the box closest to viewport center
        let closestIdx = 0;
        let minDistance = Infinity;
        const viewportCenter = windowHeight / 2;

        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - viewportCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });
        setActiveStep(closestIdx);
      } else {
        // Desktop horizontal grid: progress through steps based on scroll through the section
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const triggerStart = windowHeight * 0.75;
        const triggerEnd = windowHeight * 0.25;

        if (rect.top <= triggerStart && rect.bottom >= triggerEnd) {
          const totalScrollable = rect.height + (triggerStart - triggerEnd);
          const currentScroll = triggerStart - rect.top;
          const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));

          if (progress < 0.38) {
            setActiveStep(0);
          } else if (progress < 0.72) {
            setActiveStep(1);
          } else {
            setActiveStep(2);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="pt-16 sm:pt-24 pb-10 sm:pb-14 px-4 sm:px-6 bg-[#FAF9F6] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#FF5500]/6 via-[#FF8833]/3 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header (Clean, without the 2nd ss pill) */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#171717] mb-4">
            From idea to live site<br className="hidden sm:inline" /> in three simple steps.
          </h2>
          <p className="text-base sm:text-lg text-[#525252] max-w-lg mx-auto">
            No design degree or coding required. Launchly handles the infrastructure so you can ship today.
          </p>
        </div>

        {/* Step Cards with Aesthetic Micro-UI Previews & Dynamic Scroll Highlight */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <div
                key={step.number}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => setActiveStep(i)}
                onMouseEnter={() => setActiveStep(i)}
                className={`relative rounded-[28px] p-7 sm:p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-b from-white via-[#FFFBF8] to-[#FFF5ED] border-2 border-[#FF5500] shadow-[0_24px_60px_-12px_rgba(255,85,0,0.22)] -translate-y-2'
                    : 'bg-white/90 backdrop-blur-sm border border-[#E8E6E0] shadow-sm hover:border-[#FF5500]/40 hover:shadow-xl hover:shadow-[#FF5500]/6 hover:-translate-y-1'
                }`}
              >
                {/* Ambient top spotlight on active card */}
                {isActive && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#FF5500]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="relative z-10">
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 ${
                          isActive
                            ? 'bg-gradient-to-br from-[#FF6A1A] to-[#FF5500] text-white shadow-lg shadow-[#FF5500]/40 scale-110'
                            : 'bg-[#F2F0EB] text-[#737373]'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#8A8A8A]">
                        {step.badge}
                      </span>
                    </div>

                    {/* Active pulse beacon */}
                    {isActive ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF5500]/10 border border-[#FF5500]/25 text-[10px] font-bold text-[#FF5500]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5500]" />
                        </span>
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-[#C7C5BF]">{step.number}</span>
                    )}
                  </div>

                  <h3 className="font-bold text-xl sm:text-2xl text-[#171717] mb-2 tracking-[-0.02em]">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#525252] leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Aesthetic Micro-graphic Visual Feature for Each Step */}
                  {i === 0 && (
                    <div className="my-5 p-3.5 rounded-2xl bg-[#F6F5F0] border border-[#E8E6E0] shadow-inner space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5500] text-white shadow-xs">SaaS</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-[#737373] border border-[#E8E6E0]">Agency</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-[#737373] border border-[#E8E6E0]">Store</span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-[#8A8A8A]">12+ Templates</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E6E0] shadow-2xs space-y-2">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F57]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFBD2E]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#28CA41]" />
                        </div>
                        <div className="h-2 w-3/4 bg-[#171717] rounded-full" />
                        <div className="h-1.5 w-1/2 bg-[#FF5500]/50 rounded-full" />
                        <div className="grid grid-cols-3 gap-1 pt-0.5">
                          <div className="h-6 rounded-md bg-[#FAF9F6] border border-[#E8E6E0]" />
                          <div className="h-6 rounded-md bg-[#FAF9F6] border border-[#E8E6E0]" />
                          <div className="h-6 rounded-md bg-[#FF5500]/10 border border-[#FF5500]/30" />
                        </div>
                      </div>
                    </div>
                  )}

                  {i === 1 && (
                    <div className="my-5 p-3.5 rounded-2xl bg-[#F6F5F0] border border-[#E8E6E0] shadow-inner space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Sliders size={12} className="text-[#FF5500]" />
                        <span className="text-[11px] font-bold text-[#171717]">Visual Studio</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E6E0] shadow-2xs space-y-2">
                        <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-1.5">
                          <span className="text-[11px] font-semibold text-[#171717]">Brand Palette:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#FF5500] ring-2 ring-[#FF5500]/40 shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#171717]" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#6366F1]" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#22C55E]" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium text-[#737373]">Live Canvas:</span>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#E8E6E0] text-[10px] font-bold text-[#171717]">
                            <span>Hero Text</span>
                            <span className="w-1.5 h-3 bg-[#FF5500] animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {i === 2 && (
                    <div className="my-5 p-3.5 rounded-2xl bg-[#F6F5F0] border border-[#E8E6E0] shadow-inner space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-[#22C55E]" />
                        <span className="text-[11px] font-bold text-[#171717]">Global Edge</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-[#E8E6E0] shadow-2xs">
                        <div className="flex items-center gap-1.5 bg-[#FAF9F6] px-2.5 py-1.5 rounded-lg border border-[#E8E6E0] text-[10px] font-mono text-[#171717]">
                          <span className="text-[#22C55E]">🔒</span>
                          <span className="truncate">startup.launchly.site</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Action Button */}
                <div className="relative z-10 pt-4 border-t border-[#E8E6E0]/80 flex items-center justify-between">
                  <Link
                    href={step.href}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#FF5500] hover:bg-[#E04800] text-white shadow-md shadow-[#FF5500]/25'
                        : 'bg-[#F2F0EB] text-[#171717] hover:bg-[#FF5500] hover:text-white'
                    }`}
                  >
                    <span>{step.cta}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className={`text-xs font-mono font-bold transition-colors ${
                    isActive ? 'text-[#FF5500]' : 'text-[#ACACAC]'
                  }`}>
                    {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
