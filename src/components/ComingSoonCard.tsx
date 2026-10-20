'use client';

import { useState } from 'react';
import { Sparkles, ShoppingBag, Grid3X3, CheckCircle2, Bell, Cpu, Layers } from 'lucide-react';

interface ComingSoonCardProps {
  category: string;
  onBrowseAll: () => void;
  onExploreEcommerce: () => void;
  className?: string;
}

export default function ComingSoonCard({
  category,
  onBrowseAll,
  onExploreEcommerce,
  className = '',
}: ComingSoonCardProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <div className={`relative max-w-xl mx-auto my-4 sm:my-8 w-full ${className}`}>
      {/* Ambient Cyber Glow Backdrop (Adapts to Light & Dark Mode) */}
      <div 
        className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-pink/30 via-yellow/20 to-mint/30 blur-2xl opacity-60 dark:opacity-40 -z-10 transition-opacity" 
        aria-hidden="true" 
      />

      {/* Main Neo-Brutalist Card */}
      <div className="relative bg-card text-card-foreground rounded-3xl border-[3px] border-ink p-6 sm:p-10 shadow-brutal-lg overflow-hidden text-center flex flex-col items-center">
        
        {/* Subtle Architectural Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(var(--ink)_1.25px,transparent_1.25px)] [background-size:18px_18px] opacity-[0.07] dark:opacity-[0.09] pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Top Telemetry Header Strip */}
        <div className="w-full flex items-center justify-between pb-6 mb-6 border-b-[2px] border-ink/15 dark:border-[#222538] relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-ink bg-yellow text-black font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-brutal-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
            </span>
            <span>DESIGN LAB SPRINT</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Cpu size={13} className="text-pink stroke-[2.5]" />
            <span>DROP // V2.0</span>
          </div>
        </div>

        {/* Hero Visual Icon Badge (Layers + Sparkles) */}
        <div className="relative my-2 sm:my-3 group cursor-default">
          {/* Angled Backdrop Plate */}
          <div className="absolute -inset-2 rounded-2xl bg-pink -rotate-6 border-[2.5px] border-ink shadow-brutal-xs transition-transform group-hover:-rotate-12 duration-300" />
          
          {/* Main Floating Badge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-[3px] border-ink bg-yellow flex items-center justify-center text-black shadow-brutal transition-transform group-hover:scale-105 duration-300">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 fill-black stroke-black transition-transform group-hover:rotate-12 duration-300" />
          </div>

          {/* Floated Status Tag */}
          <div className="absolute -bottom-2.5 -right-3 px-2.5 py-0.5 rounded-full border-2 border-ink bg-mint text-black font-mono text-[9px] sm:text-[10px] font-black uppercase shadow-brutal-xs tracking-wider">
            IN THE LAB
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight mt-6 mb-3 relative z-10">
          Coming Soon!
        </h3>

        {/* Aesthetic Description with Dynamic Category Highlight */}
        <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6 relative z-10">
          The{' '}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border-2 border-ink bg-pink text-black font-black font-mono text-xs shadow-brutal-xs mx-0.5 align-baseline">
            <Layers size={12} className="stroke-[3]" />
            {category}
          </span>{' '}
          category is under active development. We're engineering high-aesthetic, production-ready full-stack templates for this release.
        </p>

        {/* Telemetry Progress & Perks Box */}
        <div className="w-full max-w-md bg-[#fdf2f8]/70 dark:bg-[#151726] border-[2px] border-ink rounded-2xl p-4 sm:p-5 mb-6 shadow-brutal-xs relative z-10 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-ink mb-2">
            <span className="flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              Build Status
            </span>
            <span className="text-pink font-black uppercase">85% Complete</span>
          </div>

          {/* Progress Bar with Neo-Brutalist Border */}
          <div className="w-full h-3 rounded-full border-[2px] border-ink bg-card overflow-hidden p-0.5 shadow-2xs">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-yellow via-pink to-mint border-r-2 border-ink w-[85%] transition-all duration-1000" 
            />
          </div>

          {/* Architecture Badges */}
          <div className="mt-3.5 pt-3 border-t border-ink/10 dark:border-white/10 flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
            <span className="px-2 py-0.5 rounded-md border border-ink/20 dark:border-white/10 bg-card font-mono text-[9px] font-bold text-muted-foreground">
              ⚡ Next.js 15 App Router
            </span>
            <span className="px-2 py-0.5 rounded-md border border-ink/20 dark:border-white/10 bg-card font-mono text-[9px] font-bold text-muted-foreground">
              💳 Stripe & Supabase
            </span>
            <span className="px-2 py-0.5 rounded-md border border-ink/20 dark:border-white/10 bg-card font-mono text-[9px] font-bold text-muted-foreground">
              🎨 Award-Winning UX
            </span>
          </div>
        </div>

        {/* Interactive VIP Drop Alert */}
        <div className="w-full max-w-md mb-6 relative z-10">
          {!isSubscribed ? (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter email for drop alert..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-[2px] border-ink bg-background font-mono text-xs font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                />
              </div>
              <button
                type="submit"
                className="brutal-press px-4 py-2.5 rounded-xl border-[2px] border-ink bg-mint text-black font-display text-xs font-black uppercase tracking-wider shadow-brutal-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Bell size={13} className="stroke-[2.5]" />
                <span>Get Drop Alert</span>
              </button>
            </form>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl border-[2px] border-ink bg-mint/20 dark:bg-mint/15 text-ink font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-brutal-xs">
              <CheckCircle2 size={16} className="text-mint shrink-0 stroke-[2.5]" />
              <span>You're on the VIP drop list for {category}!</span>
            </div>
          )}
        </div>

        {/* Action Buttons (Themed & Responsive) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto relative z-10">
          <button
            type="button"
            onClick={onBrowseAll}
            className="brutal-press w-full sm:w-auto px-6 py-3 rounded-xl border-[2.5px] border-ink bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Grid3X3 size={16} className="stroke-[2.5]" />
            <span>Browse All Templates</span>
          </button>
          
          <button
            type="button"
            onClick={onExploreEcommerce}
            className="brutal-press w-full sm:w-auto px-6 py-3 rounded-xl border-[2.5px] border-ink bg-yellow text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShoppingBag size={16} className="stroke-[2.5]" />
            <span>View Ecommerce Templates</span>
          </button>
        </div>

      </div>
    </div>
  );
}
