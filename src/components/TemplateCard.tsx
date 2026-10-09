'use client';

import Link from 'next/link';
import { Eye, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Template } from '@/types';

// High-fidelity, award-winning visual previews for each template
function TemplatePreviewCanvas({ template }: { template: Template }) {
  const previews: Record<string, React.ReactNode> = {
    'agenn-ai': (
      <div className="h-full relative overflow-hidden bg-[#09090B] text-white p-5 flex flex-col justify-between select-none">
        {/* Ambient laser glow */}
        <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-b from-[#FF5500]/25 via-[#FF8833]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#6366F1]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top micro bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-pulse" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-white/90">AGENN.OS // v4.2</span>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30">
            AUTONOMOUS
          </span>
        </div>

        {/* Center hero headline & prompt */}
        <div className="my-auto py-2 relative z-10">
          <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-[1.05] text-white mb-2.5">
            Reasoning at <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5500] to-[#FFAA00]">hyper-scale.</span>
          </h4>
          <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md flex items-center gap-2">
            <span className="text-[#FF5500] font-mono text-xs">&gt;</span>
            <span className="text-[11px] font-mono text-white/80 truncate">orchestrate multi-agent inference runtime</span>
            <span className="w-1.5 h-3.5 bg-[#FF5500] animate-pulse ml-auto shrink-0" />
          </div>
        </div>

        {/* Bottom Bento Metric Tiles */}
        <div className="grid grid-cols-2 gap-2 relative z-10 pt-2 border-t border-white/10">
          <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
            <span className="text-[8px] font-mono text-white/50 block">STREAMING SPEED</span>
            <span className="text-xs font-mono font-black text-[#FF5500]">4.2M Tokens/s</span>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.04] border border-white/5">
            <span className="text-[8px] font-mono text-white/50 block">ACCURACY BENCHMARK</span>
            <span className="text-xs font-mono font-black text-white">99.98% Zero-Shot</span>
          </div>
        </div>
      </div>
    ),

    'fabrica-studio': (
      <div className="h-full relative overflow-hidden bg-[#FAF9F6] text-[#171717] p-5 flex flex-col justify-between select-none">
        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#171717 1px, transparent 1px), linear-gradient(90deg, #171717 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-2 relative z-10">
          <span className="font-black text-sm tracking-tighter">FABRICA.</span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#FF5500] font-bold">Awwwards SOTD</span>
        </div>

        {/* Hero headline */}
        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#737373] block mb-1">Visual Direction / 2026</span>
          <h4 className="text-2xl sm:text-3xl font-black tracking-[-0.04em] leading-[0.92] text-[#171717] mb-3">
            FORM FOLLOWS<br />EMOTION.
          </h4>
          <div className="flex items-center gap-2">
            <div className="h-6 w-14 rounded-lg bg-[#171717] flex items-center justify-center text-[9px] font-bold text-white">REEL</div>
            <div className="h-6 w-14 rounded-lg bg-[#FF5500] flex items-center justify-center text-[9px] font-bold text-white">WORK</div>
            <div className="h-6 w-14 rounded-lg bg-[#E8E6E0] flex items-center justify-center text-[9px] font-bold text-[#171717]">INDEX</div>
          </div>
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10 relative z-10">
          <span>PARIS • TOKYO • NEW YORK</span>
          <span className="font-bold text-[#171717]">SELECTED ARCHIVE ↗</span>
        </div>
      </div>
    ),

    'chronicle-os': (
      <div className="h-full relative overflow-hidden bg-[#0C0D14] text-white p-5 flex flex-col justify-between select-none">
        {/* Glow */}
        <div className="absolute top-0 left-1/3 w-64 h-32 bg-[#6366F1]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-[#6366F1]" />
            <span className="font-bold text-xs text-white">Chronicle OS</span>
          </div>
          <span className="text-[9px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/80">⌘K Telemetry</span>
        </div>

        {/* Headline */}
        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#6366F1] font-bold uppercase tracking-wider block mb-1">Developer Suite</span>
          <h4 className="text-xl font-black text-white leading-tight mb-2">
            Zero-noise telemetry for modern engineering.
          </h4>
          {/* Animated SVG line chart */}
          <div className="h-10 w-full flex items-end gap-1 pt-1">
            {[24, 45, 32, 68, 52, 85, 64, 92, 78, 100].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-xs bg-gradient-to-t from-[#6366F1]/30 to-[#6366F1]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[9px] font-mono text-white/60 pt-2 border-t border-white/10 relative z-10">
          <span>TRACE LATENCY: 12ms</span>
          <span className="text-[#6366F1] font-bold">100% HEALTHY</span>
        </div>
      </div>
    ),

    'atelier-luxury': (
      <div className="h-full relative overflow-hidden bg-[#F7F5F0] text-[#171717] p-5 flex flex-col justify-between select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <span className="font-serif italic font-bold text-sm tracking-wide">Atelier Maison</span>
          <span className="text-[9px] font-mono tracking-widest text-[#9E7A53] uppercase font-bold">COLLECTION 04</span>
        </div>

        {/* Center editorial */}
        <div className="my-auto py-2 grid grid-cols-2 gap-2.5">
          <div className="bg-[#EFECE4] p-3 rounded-2xl border border-black/5 flex flex-col justify-between h-28">
            <span className="text-[8px] font-mono text-[#8A8A8A] uppercase">01 / ARCHIVE</span>
            <div className="text-xs font-semibold text-[#171717]">Architectural Wool Coat</div>
            <span className="text-xs font-mono font-bold text-[#9E7A53]">$580</span>
          </div>
          <div className="bg-[#171717] text-white p-3 rounded-2xl flex flex-col justify-between h-28 shadow-sm">
            <span className="text-[8px] font-mono text-white/50 uppercase">02 / SCULPTURAL</span>
            <div className="text-xs font-semibold text-white">Calfskin Minimal Tote</div>
            <span className="text-xs font-mono font-bold text-[#E5D7C5]">$420</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10">
          <span>PARIS RUNWAY ARCHIVE</span>
          <span className="font-bold text-[#171717]">EXPLORE LOOKBOOK →</span>
        </div>
      </div>
    ),

    'noora-agency': (
      <div className="h-full relative overflow-hidden bg-[#111113] text-white p-5 flex flex-col justify-between select-none">
        {/* Coral ambient spotlight */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FF4B26]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-black text-sm tracking-tight">NOORA.STUDIO</span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FF4B26] text-white shadow-xs">UNICORN DESIGN</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <h4 className="text-xl sm:text-2xl font-black tracking-tight leading-tight mb-2 text-white">
            We build digital unicorns.
          </h4>
          <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
            Product design & brand architecture for Series A to IPO startups.
          </p>
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[10px] font-mono font-bold text-[#FF4B26]">
              +$1.8B Value Added
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-mono text-white/70">
              42 Unicorn Clients
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>SAN FRANCISCO • LONDON</span>
          <span className="text-[#FF4B26] font-bold">INQUIRE PROJECT ↗</span>
        </div>
      </div>
    ),

    'solstice-protocol': (
      <div className="h-full relative overflow-hidden bg-[#060810] text-white p-5 flex flex-col justify-between select-none">
        {/* Cyan nebula */}
        <div className="absolute top-0 right-1/4 w-52 h-36 bg-[#00F0FF]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
            <span className="font-mono text-xs font-bold text-[#00F0FF]">SOLSTICE // DEX</span>
          </div>
          <span className="text-[9px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded">TVL $520M</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs font-bold text-white/80">ETH / USD PERP</span>
            <span className="text-sm font-mono font-black text-[#00F0FF]">$3,942.50 (+5.8%)</span>
          </div>
          {/* Simulated depth candlestick bar */}
          <div className="h-8 w-full bg-white/[0.04] rounded-lg border border-white/10 p-1 flex items-center gap-1">
            <div className="h-full w-2/3 bg-gradient-to-r from-[#00F0FF]/40 to-[#00F0FF]/80 rounded flex items-center justify-center text-[8px] font-mono font-bold text-black">
              LONG 68%
            </div>
            <div className="h-full w-1/3 bg-rose-500/50 rounded flex items-center justify-center text-[8px] font-mono font-bold text-white">
              SHORT 32%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/60 pt-2 border-t border-white/10 relative z-10">
          <span>ZERO SLIPPAGE</span>
          <span className="text-[#00F0FF] font-bold">AUDIT PASSED ✓</span>
        </div>
      </div>
    ),

    'sora-cinema': (
      <div className="h-full relative overflow-hidden bg-[#050505] text-white p-5 flex flex-col justify-between select-none">
        {/* Cinematic amber glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-[#F59E0B]/18 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-mono text-xs font-bold tracking-widest text-[#F59E0B]">SORA CINEMA</span>
          <span className="text-[9px] font-mono text-white/50">4K DCI ANAMORPHIC</span>
        </div>

        <div className="my-auto text-center py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#F59E0B] tracking-widest uppercase block mb-1">
            CANNES 2026 OFFICIAL SELECTION
          </span>
          <h4 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
            &ldquo;Beyond The Horizon&rdquo;
          </h4>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm">
            <span>▶ Watch Director&apos;s Cut</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>COLOR GRADE SUITE</span>
          <span className="text-[#F59E0B] font-bold">FESTIVAL REEL →</span>
        </div>
      </div>
    ),

    'strata-cloud': (
      <div className="h-full relative overflow-hidden bg-[#0A0D10] text-white p-5 flex flex-col justify-between select-none">
        {/* Emerald glow */}
        <div className="absolute top-0 right-0 w-48 h-32 bg-[#10B981]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-mono text-xs font-bold text-white">STRATA // CLOUD</span>
          </div>
          <span className="text-[9px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded">99.999% SLA</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <h4 className="text-lg font-black text-white leading-tight mb-2">
            Edge Serverless Kubernetes.
          </h4>
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[10px] text-white/80 space-y-1">
            <div className="text-emerald-400">$ strata deploy --global --prod</div>
            <div className="text-white/60">✓ 48 regions online (0.12s)</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/60 pt-2 border-t border-white/10 relative z-10">
          <span>COLD START: 8ms</span>
          <span className="text-[#10B981] font-bold">ALL SYSTEMS GREEN</span>
        </div>
      </div>
    ),

    'elian-minimal': (
      <div className="h-full relative overflow-hidden bg-[#080808] text-white p-5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="font-bold text-sm tracking-tight">ELIAN.</span>
          <span className="text-[9px] font-mono text-white/50">STAFF PRODUCT DESIGNER</span>
        </div>

        <div className="my-auto py-2">
          <span className="text-[9px] font-mono text-[#E2E8F0] tracking-widest uppercase block mb-1">
            PORTFOLIO 2026
          </span>
          <h4 className="text-2xl font-black text-white leading-tight tracking-tight mb-3">
            Interfaces that feel like second nature.
          </h4>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[9px] font-bold text-white block">Apex Fintech OS</span>
              <span className="text-[8px] text-white/50">Core Architecture</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[9px] font-bold text-white block">Spatial Vision 3D</span>
              <span className="text-[8px] text-white/50">Interaction Design</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10">
          <span>BASE: COPENHAGEN</span>
          <span className="text-white font-bold">VIEW CASE STUDIES →</span>
        </div>
      </div>
    ),

    'apex-aero': (
      <div className="h-full relative overflow-hidden bg-[#0B0B0E] text-white p-5 flex flex-col justify-between select-none">
        {/* Racing orange glow */}
        <div className="absolute top-1/3 left-1/3 w-48 h-32 bg-[#FF5500]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-mono text-xs font-bold tracking-widest text-[#FF5500]">APEX // AERO</span>
          <span className="text-[9px] font-mono text-white/60">WIND TUNNEL 04</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <h4 className="text-xl font-black tracking-tight text-white mb-2">
            Computational Velocity.
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[8px] font-mono text-white/50 block">0-100 KM/H</span>
              <span className="text-sm font-mono font-black text-[#FF5500]">1.84s</span>
            </div>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-[8px] font-mono text-white/50 block">DOWNFORCE</span>
              <span className="text-sm font-mono font-black text-white">1,200kg @ 300km/h</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>CARBON COMPOSITE</span>
          <span className="text-[#FF5500] font-bold">SPEC CONFIGURATOR →</span>
        </div>
      </div>
    ),

    'zenith-labs': (
      <div className="h-full relative overflow-hidden bg-[#0A0915] text-white p-5 flex flex-col justify-between select-none">
        {/* Violet glow */}
        <div className="absolute top-0 right-0 w-48 h-36 bg-[#8B5CF6]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-mono text-xs font-bold text-[#8B5CF6]">ZENITH LABS</span>
          <span className="text-[9px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded">LONGEVITY</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <h4 className="text-xl font-black tracking-tight text-white mb-2">
            Precision Longevity Science.
          </h4>
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-mono text-white/50 block">EPIGENETIC CLOCK</span>
              <span className="text-sm font-mono font-black text-[#8B5CF6]">-8.4 Years Bio-Age</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#8B5CF6] flex items-center justify-center font-mono text-[9px] font-bold text-white">
              98%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>BIOMARKER RADAR</span>
          <span className="text-[#8B5CF6] font-bold">CLINICAL SUITE →</span>
        </div>
      </div>
    ),

    'nova-coffee': (
      <div className="h-full relative overflow-hidden bg-[#F9F6F0] text-[#171717] p-5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <span className="font-serif italic font-bold text-sm">Nova Roasters</span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#C2783B] font-bold">HARVEST 2026</span>
        </div>

        <div className="my-auto py-2">
          <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block mb-1">Single Origin Micro-Lot</span>
          <h4 className="text-xl font-serif font-bold text-[#171717] mb-2 leading-tight">
            Ethiopia Yirgacheffe G1
          </h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#EFE8DD] text-[#6E4B28]">Jasmine</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#EFE8DD] text-[#6E4B28]">White Peach</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#EFE8DD] text-[#6E4B28]">Bergamot</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10">
          <span>LIGHT ROAST // 250G</span>
          <span className="font-bold text-[#C2783B]">$22.00 SUBSCRIBE →</span>
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full">
      {previews[template.id] || (
        <div className="h-full flex items-center justify-center p-6" style={{ background: template.bgColor }}>
          <div className="font-black text-2xl tracking-tight" style={{ color: template.textColor }}>
            {template.name}
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
    <div className="template-card group rounded-[26px] overflow-hidden border border-[#E8E6E0] bg-white hover:border-[#FF5500]/50 hover:shadow-[0_20px_50px_-10px_rgba(255,85,0,0.14)] transition-all duration-400 flex flex-col justify-between">
      {/* Full-bleed visual preview canvas */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-[#0A0A0C]">
        <div className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]">
          <TemplatePreviewCanvas template={template} />
        </div>

        {/* Sleek frosted glass hover actions overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <Link
            href={`/templates/${template.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#171717] rounded-full text-xs font-bold hover:bg-[#FAF9F6] transition-all shadow-xl hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={14} />
            <span>Live Preview</span>
          </Link>

          <Link
            href={`/editor/${template.id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF5500] hover:bg-[#E04800] text-white rounded-full text-xs font-bold transition-all shadow-xl shadow-[#FF5500]/30 hover:scale-105"
            onClick={(e) => {
              if (onCustomize) {
                e.preventDefault();
                onCustomize(template);
              }
            }}
          >
            <span>Open in Editor</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Clean, high-end card details */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
        <div>
          {/* Top row: Name & Badges */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link
              href={`/templates/${template.id}`}
              className="font-black text-lg text-[#171717] tracking-tight hover:text-[#FF5500] transition-colors"
            >
              {template.name}
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF9F6] text-[#525252] border border-[#E8E6E0]">
                {template.category}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  template.isPro
                    ? 'bg-[#FF5500]/10 text-[#FF5500] border border-[#FF5500]/25'
                    : 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/25'
                }`}
              >
                {template.isPro ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#666666] leading-relaxed line-clamp-2 mb-4">
            {template.description}
          </p>
        </div>

        {/* Bottom row: Tech tags & action */}
        <div className="pt-3 border-t border-[#E8E6E0]/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A8A8A]">
            <span>Next.js 15</span>
            <span>•</span>
            <span>Tailwind v4</span>
          </div>

          <Link
            href={`/templates/${template.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#171717] group-hover:text-[#FF5500] transition-colors"
          >
            <span>View Template</span>
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
