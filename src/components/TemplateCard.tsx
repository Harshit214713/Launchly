'use client';

import Link from 'next/link';
import { Eye, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Template } from '@/types';

// High-fidelity, award-winning visual previews for each template
function TemplatePreviewCanvas({ template }: { template: Template }) {
  const previews: Record<string, React.ReactNode> = {
    // Luxe Store - Horizontal layout with hero banner and 2-column product grid
    'luxe-store': (
      <div className="h-full relative overflow-hidden bg-[#FAFAFA] text-[#1A1A1A] p-4 flex flex-col justify-between select-none">
        {/* Soft coral accent glow */}
        <div className="absolute top-0 right-0 w-56 h-40 bg-[#FF6B6B]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-32 bg-[#FFE4E6]/20 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top navigation bar */}
        <div className="flex items-center justify-between border-b border-black/8 pb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tight">LUXE</span>
            <span className="text-[8px] font-mono text-[#FF6B6B] bg-[#FFE4E6] px-1.5 py-0.5 rounded font-bold">NEW</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border border-black/5 flex items-center justify-center">
              <span className="text-[10px]">🔍</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-white border border-black/5 flex items-center justify-center">
              <span className="text-[10px]">♡</span>
            </div>
            <div className="relative">
              <div className="w-6 h-6 rounded-lg bg-[#FF6B6B] flex items-center justify-center">
                <span className="text-[10px]">🛒</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">3</div>
            </div>
          </div>
        </div>

        {/* Hero banner */}
        <div className="my-auto py-2 relative z-10">
          <div className="bg-gradient-to-r from-[#FFE4E6] to-[#FF6B6B]/20 rounded-xl p-3 mb-3 border border-[#FF6B6B]/20">
            <span className="text-[8px] font-mono text-[#FF6B6B] font-bold uppercase tracking-wider block mb-0.5">Summer Collection 2026</span>
            <h4 className="text-lg font-black tracking-tight text-[#1A1A1A] leading-tight">
              Up to 50% Off Selected Items
            </h4>
          </div>
          
          {/* 2x2 product grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded-xl border border-black/5 shadow-sm relative">
              <div className="absolute top-1.5 right-1.5 bg-[#FF6B6B] text-white text-[7px] font-bold px-1 py-0.5 rounded">-30%</div>
              <div className="h-12 bg-gradient-to-br from-[#FFE4E6] to-[#FF6B6B]/30 rounded-lg mb-1.5 flex items-center justify-center">
                <span className="text-[#FF6B6B] text-lg">👗</span>
              </div>
              <span className="text-[8px] font-semibold block truncate">Silk Maxi Dress</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[7px] font-mono font-bold text-[#FF6B6B]">$129</span>
                <span className="text-[7px] font-mono text-[#8A8A8A] line-through">$185</span>
              </div>
            </div>
            <div className="bg-white p-2 rounded-xl border border-black/5 shadow-sm">
              <div className="h-12 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-lg mb-1.5 flex items-center justify-center">
                <span className="text-white text-lg">👜</span>
              </div>
              <span className="text-[8px] font-semibold block truncate">Leather Tote</span>
              <span className="text-[7px] font-mono font-bold text-[#1A1A1A]">$249</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-black/5 shadow-sm relative">
              <div className="absolute top-1.5 right-1.5 bg-black text-white text-[7px] font-bold px-1 py-0.5 rounded">HOT</div>
              <div className="h-12 bg-gradient-to-br from-[#F5F5F5] to-[#E8E8E8] rounded-lg mb-1.5 flex items-center justify-center">
                <span className="text-[#1A1A1A] text-lg">👠</span>
              </div>
              <span className="text-[8px] font-semibold block truncate">Stiletto Heels</span>
              <span className="text-[7px] font-mono font-bold text-[#1A1A1A]">$189</span>
            </div>
            <div className="bg-[#1A1A1A] text-white p-2 rounded-xl shadow-sm">
              <div className="h-12 bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/10 rounded-lg mb-1.5 flex items-center justify-center border border-white/10">
                <span className="text-white text-lg">💎</span>
              </div>
              <span className="text-[8px] font-semibold block truncate">Gold Necklace</span>
              <span className="text-[7px] font-mono font-bold text-[#FFD700]">$349</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#8A8A8A] mb-2 pb-2 border-t border-black/8 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1A1A1A]">USD $</span>
              <span>|</span>
              <span>EUR €</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>SSL Secure</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#1A1A1A] text-white p-2.5 rounded-xl shadow-lg">
            <div>
              <span className="text-[7px] font-mono text-white/60 block">Total (3 items)</span>
              <span className="text-sm font-mono font-black">$567.00</span>
            </div>
            <button className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-4 py-1.5 rounded-lg text-[9px] font-bold font-mono transition-colors">
              CHECKOUT →
            </button>
          </div>
        </div>
      </div>
    ),

    // Velvet Boutique - Vertical split layout with large featured product
    'velvet-boutique': (
      <div className="h-full relative overflow-hidden bg-[#0A0A0A] text-white p-4 flex flex-col justify-between select-none">
        {/* Gold accent glow */}
        <div className="absolute top-0 right-0 w-48 h-36 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Elegant header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-sm tracking-wide text-[#D4AF37]">VELVET</span>
            <span className="text-[8px] font-mono text-white/60">EST. 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-[10px]">🔍</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-[10px]">♡</span>
            </div>
            <div className="relative">
              <div className="w-6 h-6 rounded-lg bg-[#D4AF37] flex items-center justify-center">
                <span className="text-[10px]">🛒</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[8px] font-bold rounded-full flex items-center justify-center">2</div>
            </div>
          </div>
        </div>

        {/* Large featured product */}
        <div className="my-auto py-2 relative z-10">
          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-xl p-4 mb-3 border border-[#D4AF37]/30 h-28 flex flex-col justify-center items-center">
            <span className="text-[8px] font-mono text-[#D4AF37] font-bold uppercase tracking-wider block mb-1">Featured Collection</span>
            <h4 className="text-xl font-serif font-bold text-white leading-tight text-center">
              Timeless Elegance
            </h4>
            <span className="text-[7px] font-mono text-white/60 mt-1">AUTUMN/WINTER 2026</span>
          </div>
          
          {/* Horizontal product list */}
          <div className="space-y-2">
            <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2 relative">
              <div className="absolute top-1 right-1 bg-[#D4AF37] text-black text-[6px] font-bold px-1 py-0.5 rounded">NEW</div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                <span className="text-white text-sm">👔</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-semibold block truncate text-white">Cashmere Coat</span>
                <span className="text-[7px] font-mono font-bold text-[#D4AF37]">$599</span>
              </div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                <span className="text-white text-sm">👒</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-semibold block truncate text-white">Velvet Hat</span>
                <span className="text-[7px] font-mono font-bold text-[#D4AF37]">$189</span>
              </div>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/10 flex items-center gap-2 relative">
              <div className="absolute top-1 right-1 bg-white text-black text-[6px] font-bold px-1 py-0.5 rounded">SOLD</div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#333] to-[#222] rounded-lg flex items-center justify-center border border-white/10 shrink-0 opacity-60">
                <span className="text-white text-sm">💍</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[8px] font-semibold block truncate text-white/60">Diamond Ring</span>
                <span className="text-[7px] font-mono font-bold text-white/40">$1,299</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-[8px] font-mono text-white/60 mb-2 pb-2 border-t border-white/10 pt-2">
            <span>FREE SHIPPING WORLDWIDE</span>
            <span className="text-[#D4AF37]">♢ PREMIUM</span>
          </div>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <div>
              <span className="text-[7px] font-mono text-white/60 block">Subtotal</span>
              <span className="text-sm font-mono font-black text-[#D4AF37]">$1,448.00</span>
            </div>
            <button className="bg-[#D4AF37] hover:bg-[#C4A030] text-black px-4 py-1.5 rounded-lg text-[9px] font-bold font-mono transition-colors">
              CHECKOUT →
            </button>
          </div>
        </div>
      </div>
    ),

    'agenn-ai': (
      <div className="h-full relative overflow-hidden bg-[#F8FAFC] text-[#0F172A] p-4 flex flex-col justify-between select-none">
        {/* Blue tech glow */}
        <div className="absolute top-0 right-0 w-48 h-36 bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-32 bg-[#3B82F6]/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Tech header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-2.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm tracking-tight text-[#3B82F6]">TECH.HUB</span>
            <span className="text-[8px] font-mono text-[#3B82F6] bg-blue-50 px-1.5 py-0.5 rounded font-bold">DEALS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-white border border-black/5 flex items-center justify-center">
              <span className="text-[10px]">🔍</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-white border border-black/5 flex items-center justify-center">
              <span className="text-[10px]">⚖️</span>
            </div>
            <div className="relative">
              <div className="w-6 h-6 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                <span className="text-[10px]">🛒</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0F172A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">4</div>
            </div>
          </div>
        </div>

        {/* Specs-focused layout */}
        <div className="my-auto py-2 relative z-10">
          <div className="bg-gradient-to-r from-[#3B82F6]/20 to-transparent rounded-xl p-3 mb-3 border border-[#3B82F6]/30">
            <span className="text-[8px] font-mono text-[#3B82F6] font-bold uppercase tracking-wider block mb-0.5">Tech Deals</span>
            <h4 className="text-lg font-bold text-[#0F172A] leading-tight">
              Latest Gadgets & Gear
            </h4>
          </div>
          
          {/* Single large product with specs */}
          <div className="bg-white p-3 rounded-xl border border-black/5 shadow-sm mb-2">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B82F6]/20 to-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#3B82F6] text-2xl">📱</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-semibold">Smartphone Pro</span>
                  <span className="text-[6px] bg-[#3B82F6] text-white px-1.5 py-0.5 rounded font-bold">NEW</span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[6px] text-[#64748B]">
                    <span>•</span>
                  <span>6.7&quot; OLED Display</span>
                  </div>
                  <div className="flex items-center gap-1 text-[6px] text-[#64748B]">
                    <span>•</span>
                    <span>A18 Pro Chip</span>
                  </div>
                  <div className="flex items-center gap-1 text-[6px] text-[#64748B]">
                    <span>•</span>
                    <span>256GB Storage</span>
                  </div>
                </div>
                <span className="text-[7px] font-mono font-bold text-[#3B82F6] block mt-1">$899</span>
              </div>
            </div>
          </div>

          {/* Mini product cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded-lg border border-black/5 text-center">
              <div className="h-8 bg-gradient-to-br from-[#1E293B] to-[#334155] rounded mb-1 flex items-center justify-center">
                <span className="text-white text-sm">💻</span>
              </div>
              <span className="text-[7px] font-semibold block truncate">Laptop</span>
              <span className="text-[6px] font-mono font-bold text-[#0F172A]">$1,299</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-black/5 text-center relative">
              <div className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[5px] font-bold px-1 py-0.5 rounded">-20%</div>
              <div className="h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-1 flex items-center justify-center">
                <span className="text-[#0F172A] text-sm">🎧</span>
              </div>
              <span className="text-[7px] font-semibold block truncate">Headphones</span>
              <span className="text-[6px] font-mono font-bold text-[#3B82F6]">$159</span>
            </div>
            <div className="bg-gradient-to-br from-[#3B82F6]/10 to-transparent p-2 rounded-lg border border-[#3B82F6]/20 text-center">
              <div className="h-8 bg-gradient-to-br from-[#3B82F6]/30 to-transparent rounded mb-1 flex items-center justify-center border border-[#3B82F6]/20">
                <span className="text-[#3B82F6] text-sm">⌚</span>
              </div>
              <span className="text-[7px] font-semibold block truncate text-[#0F172A]">Watch</span>
              <span className="text-[6px] font-mono font-bold text-[#3B82F6]">$349</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#64748B] mb-2 pb-2 border-t border-black/8 pt-2">
            <span>⚡ FAST SHIPPING</span>
            <span className="text-[#3B82F6]">🔧 WARRANTY</span>
          </div>
          <div className="flex items-center justify-between bg-[#0F172A] text-white p-2.5 rounded-xl shadow-lg">
            <div>
              <span className="text-[7px] font-mono text-white/60 block">Total (4 items)</span>
              <span className="text-sm font-mono font-black">$2,706.00</span>
            </div>
            <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-1.5 rounded-lg text-[9px] font-bold font-mono transition-colors">
              CHECKOUT →
            </button>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div className="w-full h-full">
      {previews[template.id] || (
        <div className="h-full flex flex-col justify-between p-5 select-none" style={{ background: template.bgColor || '#0D0B18', color: template.textColor || '#FFFFFF' }}>
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-xs font-bold">{template.name}</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10">{template.category}</span>
          </div>
          <div className="my-auto py-2">
            <h4 className="text-xl font-black leading-tight mb-2">{template.name}</h4>
            <p className="text-xs opacity-75 line-clamp-2">{template.description}</p>
          </div>
          <div className="text-[9px] font-mono opacity-60 pt-2 border-t border-white/10 flex justify-between">
            <span>NEXT.JS 15</span>
            <span>EXPLORE ↗</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onCustomize?: (template: Template) => void;
}

export default function TemplateCard({ template, onCustomize }: TemplateCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden border-[3px] border-ink bg-card shadow-brutal hover:shadow-brutal-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
      {/* Visual preview canvas */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-[#0A0A0C] border-b-[3px] border-ink">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <TemplatePreviewCanvas template={template} />
        </div>

        {/* Neo-brutalist hover actions overlay */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
          <Link
            href={`/templates/${template.id}`}
            className="brutal-press flex items-center gap-1.5 px-4 py-2 bg-card text-ink border-[2.5px] border-ink rounded-xl text-xs font-display font-black shadow-brutal-sm hover:bg-[#faf5ff] dark:hover:bg-[#1f2136] cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={14} />
            <span>Preview</span>
          </Link>

          <Link
            href={`/editor/${template.id}`}
            className="brutal-press flex items-center gap-1.5 px-4 py-2 bg-pink text-black border-[2.5px] border-ink rounded-xl text-xs font-display font-black shadow-brutal-sm hover:bg-yellow cursor-pointer"
            onClick={(e) => {
              if (onCustomize) {
                e.preventDefault();
                onCustomize(template);
              }
            }}
          >
            <span>Edit</span>
            <ArrowRight size={13} className="stroke-[3]" />
          </Link>
        </div>
      </div>

      {/* Neo-brutal card details */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Top row: Name & Badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              href={`/templates/${template.id}`}
              className="font-display font-black text-lg text-ink tracking-tight hover:text-pink transition-colors line-clamp-1"
            >
              {template.name}
            </Link>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end">
              {template.badge && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-yellow text-black border border-ink shadow-2xs">
                  {template.badge}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-mint text-black border-2 border-ink">
                {template.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border-2 border-ink ${
                  template.isPro
                    ? 'bg-yellow text-black'
                    : 'bg-pink text-black'
                }`}
              >
                {template.isPro ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 font-mono">
            {template.description}
          </p>
        </div>

        {/* Bottom row: Review rating and action */}
        <div className="pt-3 border-t-[2px] border-ink/20 flex items-center justify-between font-mono text-[11px] gap-2">
          <div className="flex items-center gap-1 text-ink font-bold shrink-0">
            <span className="text-yellow font-black">★</span>
            <span>{template.rating || '4.99'}</span>
            <span className="text-muted-foreground hidden xs:inline">({template.reviewsCount || '150'})</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/templates/${template.id}`}
              className="inline-flex items-center gap-1 text-xs font-display font-black text-ink hover:text-pink transition-colors"
            >
              <span>View</span>
              <ArrowUpRight size={13} className="stroke-[3]" />
            </Link>
            <Link
              href={`/editor/${template.id}`}
              onClick={(e) => {
                if (onCustomize) {
                  e.preventDefault();
                  onCustomize(template);
                }
              }}
              className="md:hidden brutal-press px-2.5 py-1 bg-pink text-black border-[1.5px] border-ink rounded-lg text-[11px] font-display font-black shadow-2xs hover:bg-yellow"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
