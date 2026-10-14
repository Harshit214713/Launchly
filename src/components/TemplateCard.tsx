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
    ),

    'prism-studio': (
      <div className="h-full relative overflow-hidden bg-[#0D0B18] text-white p-5 flex flex-col justify-between select-none">
        {/* Violet ambient glow */}
        <div className="absolute top-0 right-0 w-56 h-40 bg-[#A855F7]/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
            <span className="font-mono text-xs font-bold text-white">PRISM.3D // WEBGL</span>
          </div>
          <span className="text-[9px] font-mono bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 px-2 py-0.5 rounded-full font-bold">
            60 FPS SPATIAL
          </span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#A855F7] uppercase tracking-wider block mb-1">Procedural Shader Engine</span>
          <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
            Render at the speed of thought.
          </h4>
          <div className="flex items-center gap-1.5">
            <div className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[10px] font-mono text-white/90">
              PBR Raytracing
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-purple-300">
              Subdivision Nodes
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/60 pt-2 border-t border-white/10 relative z-10">
          <span>REAL-TIME SHADER GRAPH</span>
          <span className="text-[#A855F7] font-bold">EXPORT SPLINE ↗</span>
        </div>
      </div>
    ),

    'monolith-db': (
      <div className="h-full relative overflow-hidden bg-[#0B0E14] text-white p-5 flex flex-col justify-between select-none">
        {/* Blue tech glow */}
        <div className="absolute top-1/3 left-1/4 w-48 h-32 bg-[#3B82F6]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-[#3B82F6]" />
            <span className="font-mono text-xs font-bold text-white">MONOLITH // SQL</span>
          </div>
          <span className="text-[9px] font-mono bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded font-bold">
            ACID REPLICATED
          </span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] mb-2 text-neutral-300">
            <span className="text-blue-400">SELECT</span> * <span className="text-blue-400">FROM</span> cluster.nodes <span className="text-blue-400">WHERE</span> latency &lt; <span className="text-yellow">1ms</span>;
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/70">
            <span>TPS: 450,000/s</span>
            <span className="text-blue-400 font-bold">99.999% SLA</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>DISTRIBUTED HTAP</span>
          <span className="text-[#3B82F6] font-bold">CONNECT CLUSTER →</span>
        </div>
      </div>
    ),

    'vortex-games': (
      <div className="h-full relative overflow-hidden bg-[#0B0813] text-white p-5 flex flex-col justify-between select-none">
        <div className="absolute top-0 right-0 w-64 h-40 bg-[#EC4899]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-mono text-xs font-bold tracking-widest text-[#EC4899]">VORTEX // UE5</span>
          <span className="text-[9px] font-mono bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold">
            4K 144HZ
          </span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#EC4899] uppercase tracking-wider block mb-1">Cyberpunk Action RPG</span>
          <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
            Hyper-reality awaits in Neo-Shinjuku.
          </h4>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-mono font-bold text-white">
              Watch Trailer ▶
            </span>
            <span className="text-[10px] font-mono text-white/50">Early Beta Access</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>RAYTRACED AUDIO</span>
          <span className="text-[#EC4899] font-bold">PLAY DEMO ↗</span>
        </div>
      </div>
    ),

    'kinfolk-arch': (
      <div className="h-full relative overflow-hidden bg-[#F6F4EE] text-[#171717] p-5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <span className="font-serif font-bold text-sm tracking-widest">KINFOLK ARCHITECTS</span>
          <span className="text-[9px] font-mono uppercase text-[#737373] tracking-widest">KYOTO / 2026</span>
        </div>

        <div className="my-auto py-2">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#8A8A8A] block mb-1">Residential Monograph</span>
          <h4 className="text-2xl font-serif font-bold text-[#171717] leading-tight mb-2">
            Simplicity as Sanctuary.
          </h4>
          <p className="text-[11px] text-[#737373] leading-relaxed line-clamp-2">
            Wabi-sabi timber residences integrated with seasonal alpine light.
          </p>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10">
          <span>SELECTED BLUEPRINTS</span>
          <span className="font-bold text-[#171717]">VIEW MONOGRAPH →</span>
        </div>
      </div>
    ),

    'kuro-omakase': (
      <div className="h-full relative overflow-hidden bg-[#0C0A09] text-white p-5 flex flex-col justify-between select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-[#D97706]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-serif font-bold text-sm text-[#D97706] tracking-wide">KURO // 伝統</span>
          <span className="text-[9px] font-mono text-neutral-400">MICHELIN ★★</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#D97706] uppercase tracking-widest block mb-1">18-Course Omakase</span>
          <h4 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight mb-2">
            The Poetry of Seasonal Seafood.
          </h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Wild Bluefin</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Hokkaido Uni</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Wagyu A5</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>PRIVATE SALON</span>
          <span className="text-[#D97706] font-bold">RESERVE TABLE ↗</span>
        </div>
      </div>
    ),

    'valkyrie-audio': (
      <div className="h-full relative overflow-hidden bg-[#090D12] text-white p-5 flex flex-col justify-between select-none">
        <div className="absolute top-0 right-1/4 w-52 h-32 bg-[#06B6D4]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-mono text-xs font-bold text-[#06B6D4]">VALKYRIE // DSP</span>
          <span className="text-[9px] font-mono bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded font-bold">96kHz / 32-BIT</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <h4 className="text-xl font-black text-white leading-tight mb-2">
            Analog Ladder Resonance.
          </h4>
          {/* Oscilloscope wave visual */}
          <div className="h-8 w-full bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-1 flex items-center justify-center">
            <svg viewBox="0 0 100 20" className="w-full h-full stroke-cyan-400 fill-none stroke-[1.5]">
              <path d="M 0,10 Q 12,0 25,10 T 50,10 T 75,10 T 100,10" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>MODULAR SYNTHESIS</span>
          <span className="text-[#06B6D4] font-bold">SAMPLE PATCHES →</span>
        </div>
      </div>
    ),

    'pulse-rollup': (
      <div className="h-full relative overflow-hidden bg-[#070E08] text-white p-5 flex flex-col justify-between select-none">
        <div className="absolute top-0 left-1/3 w-48 h-32 bg-[#84CC16]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
            <span className="font-mono text-xs font-bold text-[#84CC16]">PULSE // ZK</span>
          </div>
          <span className="text-[9px] font-mono text-[#84CC16] bg-lime-500/15 px-2 py-0.5 rounded font-bold">120K TPS</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-lime-400 uppercase tracking-widest block mb-1">Zero-Knowledge Rollup</span>
          <h4 className="text-xl font-black text-white leading-tight mb-2">
            Instant Finality. Zero Gas Friction.
          </h4>
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/70">
            <span>Avg Fee: &lt;$0.001</span>
            <span>•</span>
            <span className="text-[#84CC16]">Proof Time: 1.2s</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>ETHEREUM L2</span>
          <span className="text-[#84CC16] font-bold">OPEN BRIDGE ↗</span>
        </div>
      </div>
    ),

    'hyperion-vc': (
      <div className="h-full relative overflow-hidden bg-[#0F0A0D] text-white p-5 flex flex-col justify-between select-none">
        <div className="absolute top-0 right-0 w-48 h-36 bg-[#E11D48]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-2 relative z-10">
          <span className="font-bold text-xs tracking-wider text-white">HYPERION CAPITAL</span>
          <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">$650M FUND III</span>
        </div>

        <div className="my-auto py-2 relative z-10">
          <span className="text-[9px] font-mono text-[#E11D48] uppercase tracking-widest block mb-1">Deeptech & Frontier AI</span>
          <h4 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
            Backing the improbable builders.
          </h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Quantum</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Humanoids</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono text-neutral-300">Fusion</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-white/50 pt-2 border-t border-white/10 relative z-10">
          <span>PORTFOLIO ORBIT</span>
          <span className="text-[#E11D48] font-bold">PITCH PARTNERS →</span>
        </div>
      </div>
    ),

    'lumina-saas': (
      <div className="h-full relative overflow-hidden bg-[#FAFAF9] text-[#171717] p-5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-[#6366F1]" />
            <span className="font-bold text-xs">Lumina Workspace</span>
          </div>
          <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">AI NATIVE</span>
        </div>

        <div className="my-auto py-2">
          <span className="text-[9px] font-mono uppercase text-[#6366F1] font-bold block mb-1">Connected Knowledge Graph</span>
          <h4 className="text-xl font-bold text-[#171717] leading-tight mb-2">
            Where product squads think together.
          </h4>
          <div className="p-2 rounded-xl bg-white border border-black/10 text-[10px] font-mono text-[#525252] flex items-center justify-between shadow-2xs">
            <span>[[Q3 Strategy Roadmap]] → [[Agent Inference]]</span>
            <span className="text-[#6366F1] font-bold">⌘K</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10">
          <span>BIDIRECTIONAL BACKLINKS</span>
          <span className="font-bold text-[#6366F1]">TRY WORKSPACE →</span>
        </div>
      </div>
    ),

    'zeno-store': (
      <div className="h-full relative overflow-hidden bg-[#F5F3EF] text-[#171717] p-5 flex flex-col justify-between select-none">
        <div className="flex items-center justify-between border-b border-black/10 pb-2">
          <span className="font-serif italic font-bold text-sm tracking-wide">Zeno Objects</span>
          <span className="text-[9px] font-mono text-[#92400E] font-bold uppercase">ARCHIVE 08</span>
        </div>

        <div className="my-auto py-2 grid grid-cols-2 gap-2">
          <div className="bg-white p-2.5 rounded-xl border border-black/5 flex flex-col justify-between h-26">
            <span className="text-[8px] font-mono text-[#8A8A8A]">01 // CERAMICS</span>
            <div className="text-xs font-semibold text-[#171717]">Vase No. 42</div>
            <span className="text-xs font-mono font-bold text-[#92400E]">$185</span>
          </div>
          <div className="bg-[#1C1917] text-white p-2.5 rounded-xl flex flex-col justify-between h-26">
            <span className="text-[8px] font-mono text-white/50">02 // OAK CHAIR</span>
            <div className="text-xs font-semibold text-white">Nordic Stool</div>
            <span className="text-xs font-mono font-bold text-[#F5F3EF]">$340</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-[#8A8A8A] pt-2 border-t border-black/10">
          <span>COPENHAGEN DESIGN</span>
          <span className="font-bold text-[#171717]">BAG (2 ITEMS) →</span>
        </div>
      </div>
    )
  };

  if (template.thumbnail && template.thumbnail.startsWith('http')) {
    return (
      <div className="h-full relative overflow-hidden bg-[#0A0A0E] select-none group">
        <img
          src={template.thumbnail}
          alt={template.name}
          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full border border-black bg-pink text-black font-mono text-[9px] font-black uppercase shadow-xs">
              ✦ FULL-STACK
            </span>
            <span className="font-mono text-[9px] font-black uppercase text-white px-2 py-0.5 rounded-md bg-black/70 border border-white/20 backdrop-blur-xs">
              {template.category}
            </span>
          </div>

          <div>
            <div className="font-display font-black text-lg text-white tracking-tight drop-shadow-md">
              {template.name}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {template.techStack?.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[9px] font-mono font-bold text-white/90 bg-black/50 px-2 py-0.5 rounded-md border border-white/15 backdrop-blur-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
            className="brutal-press flex items-center gap-1.5 px-4 py-2 bg-card text-ink border-[2.5px] border-ink rounded-xl text-xs font-display font-black shadow-brutal-sm hover:bg-[#faf5ff] cursor-pointer"
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

            <div className="flex items-center gap-1.5 shrink-0">
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
        <div className="pt-3 border-t-[2px] border-ink/20 flex items-center justify-between font-mono text-[11px]">
          <div className="flex items-center gap-1 text-ink font-bold">
            <span className="text-yellow font-black">★</span>
            <span>{template.rating || '4.99'}</span>
            <span className="text-muted-foreground">({template.reviewsCount || '150'})</span>
          </div>

          <Link
            href={`/templates/${template.id}`}
            className="inline-flex items-center gap-1 text-xs font-display font-black text-ink hover:text-pink transition-colors"
          >
            <span>View Template</span>
            <ArrowUpRight size={13} className="stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
