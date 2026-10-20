'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X, Star, Camera, Heart, ShieldCheck } from 'lucide-react';

interface PromoBannerProps {
  imageSrc?: string;
  imageAlt?: string;
  modelName?: string;
  modelTitle?: string;
  tagline?: string;
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  onDismiss?: () => void;
}

export default function PromoBanner({
  imageSrc = '/campaign-model.jpg',
  imageAlt = 'Official Launchly Campaign Model',
  modelName = 'Elena Vance',
  modelTitle = 'Launchly Muse · SS26 Digital Campaign',
  tagline = 'OFFICIAL 2026 CAMPAIGN EDITORIAL',
  headline = 'Create without limits. Launch like an icon.',
  description = 'From visual canvas to global deployment — crafted for the next generation of digital tastemakers, founders, and creative directors.',
  ctaText = 'Explore Her Curated Templates',
  ctaHref = '/templates?category=Portfolio',
  onDismiss,
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border-[3.5px] border-ink bg-[#fffdfa] dark:bg-[#11121d] p-6 sm:p-8 lg:p-10 shadow-brutal-lg transition-all">
      {/* Editorial Decorative Background Elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-pink/25 blur-3xl dark:bg-pink/15" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-yellow/30 blur-3xl dark:bg-yellow/15" />

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleClose}
        className="brutal-press absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-background text-ink shadow-brutal-xs hover:bg-neutral-100 dark:hover:bg-[#1b1c2b] cursor-pointer"
        aria-label="Dismiss campaign ad"
      >
        <X size={16} className="stroke-[2.5]" />
      </button>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Column: High-Fashion Tech Editorial Copy */}
        <div className="flex-1 space-y-4 sm:space-y-5 text-left">
          {/* Campaign Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-yellow px-3 py-1 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-black shadow-brutal-xs">
              <Star size={12} className="fill-black" />
              <span>{tagline}</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-mint px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-brutal-xs">
              <ShieldCheck size={12} />
              <span>VERIFIED ICON</span>
            </span>
          </div>

          {/* Campaign Big Title */}
          <div className="space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-ink leading-[1.08]">
              {headline}
            </h2>
            <p className="font-mono text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          {/* Model Quote / Spotlight Callout */}
          <div className="rounded-2xl border-[2.5px] border-ink bg-background/80 dark:bg-[#161726]/80 p-4 shadow-brutal-xs flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl border-2 border-ink bg-pink text-black flex items-center justify-center shrink-0 shadow-brutal-xs">
              <Heart size={16} className="fill-black" />
            </div>
            <div>
              <p className="font-display font-black text-xs sm:text-sm text-ink italic">
                “Building my digital presence felt like directing an editorial cover story. Launchly gives you complete creative freedom.”
              </p>
              <span className="font-mono text-[10px] sm:text-xs font-bold text-pink block mt-1">
                — {modelName}
              </span>
            </div>
          </div>

          {/* CTA & Stats Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={ctaHref}
              className="brutal-press inline-flex items-center gap-2 rounded-xl border-[2.5px] border-ink bg-pink px-6 py-3 font-display text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-brutal hover:bg-pink/90 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight size={16} className="stroke-[3]" />
            </Link>

            <Link
              href="/templates"
              className="brutal-press inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-ink bg-card px-4 py-3 font-display text-xs font-black uppercase text-ink shadow-brutal-xs hover:bg-neutral-100 dark:hover:bg-[#1b1c2b]"
            >
              <span>See Her Picks</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Commercial Model Portrait Billboard */}
        <div className="w-full sm:w-80 md:w-88 lg:w-96 shrink-0">
          <div className="relative aspect-3/4 w-full rounded-3xl border-[3.5px] border-ink bg-card p-3 shadow-brutal-lg overflow-hidden group">
            {imageSrc ? (
              /* When you send the photo of your friend, it will seamlessly render here */
              <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-ink">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 384px"
                />

                {/* Editorial Top Sticker */}
                <div className="absolute top-3 left-3 rounded-xl border-2 border-ink bg-yellow px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-brutal-xs">
                  CAMPAIGN FACE
                </div>

                {/* Model Name Card at Bottom */}
                <div className="absolute bottom-3 inset-x-3 rounded-xl border-2 border-ink bg-card/95 backdrop-blur-md p-3 shadow-brutal-xs text-ink">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-black text-sm text-ink leading-tight">
                        {modelName}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {modelTitle}
                      </p>
                    </div>
                    <span className="h-2.5 w-2.5 rounded-full bg-mint border border-black animate-ping" />
                  </div>
                </div>
              </div>
            ) : (
              /* High-impact Model Placeholder Billboard */
              <div className="relative h-full w-full rounded-2xl border-2 border-dashed border-ink/40 bg-gradient-to-b from-pink/20 via-yellow/15 to-mint/20 dark:from-pink/15 dark:via-yellow/10 dark:to-mint/10 flex flex-col items-center justify-between p-6 text-center">
                {/* Floating Magazine Label */}
                <div className="w-full flex items-center justify-between">
                  <span className="rounded-xl border-2 border-ink bg-pink px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs">
                    MODEL SPOTLIGHT
                  </span>
                  <span className="font-mono text-[10px] font-black tracking-widest text-ink/70 uppercase">
                    EDITORIAL
                  </span>
                </div>

                {/* Center Camera & Portrait Icon */}
                <div className="flex flex-col items-center my-auto">
                  <div className="relative mb-3">
                    <div className="h-20 w-20 rounded-3xl border-[3px] border-ink bg-white dark:bg-[#1a1b28] flex items-center justify-center shadow-brutal transition-transform group-hover:rotate-6">
                      <Camera size={34} className="text-pink stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg text-ink">
                    Ad Model Forecast
                  </h3>
                  <p className="font-mono text-xs text-muted-foreground mt-1 max-w-[220px] leading-snug">
                    Your friend’s campaign photo will be showcased right here as the face of Launchly.
                  </p>
                </div>

                {/* Bottom Placeholder Badge */}
                <div className="w-full rounded-xl border-2 border-ink bg-background/90 p-2.5 shadow-brutal-xs">
                  <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] font-black text-ink uppercase">
                    <span className="h-2 w-2 rounded-full bg-yellow border border-black animate-pulse" />
                    <span>Portrait Frame Ready for Photo</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
