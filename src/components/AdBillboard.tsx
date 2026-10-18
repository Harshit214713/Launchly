'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface AdSlide {
  id: string;
  imageSrc: string;
  imageAlt?: string;
  brandTag?: string;
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaHref: string;
}

const DEFAULT_SLIDES: AdSlide[] = [
  {
    id: 'campaign-1',
    imageSrc: '/campaign-model.jpg',
    imageAlt: 'Elena Vance — Creator Spotlight',
    brandTag: 'CREATOR SPOTLIGHT · ELENA',
    headline: 'PLAYFUL DESIGN.\nSERIOUS IMPACT.',
    subheadline: 'Crafting vibrant digital experiences without friction. Discover the collection curated by Elena.',
    ctaText: 'Explore Collection',
    ctaHref: '/templates',
  },
  {
    id: 'campaign-2',
    imageSrc: '/campaign-model.jpg',
    imageAlt: 'Launchly Campaign with Elena',
    brandTag: 'OFFICIAL CAMPAIGN',
    headline: 'FREEDOM TO CREATE.\nNO CODE BOUNDARIES.',
    subheadline: 'Zero brand watermarks, custom domain edge publishing, and 50+ award-winning aesthetic templates.',
    ctaText: 'Start Building Free',
    ctaHref: '/#pricing',
  },
];

interface AdBillboardProps {
  slides?: AdSlide[];
  autoPlayInterval?: number;
  className?: string;
}

export default function AdBillboard({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 6500,
  className = '',
}: AdBillboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlayInterval || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentIndex];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border-[2.5px] border-black dark:border-[#26283d] bg-black text-white shadow-brutal select-none ${className}`}
    >
      {/* Billboard container with 16:9 / 21:9 responsive commercial ratio */}
      <div className="relative aspect-16/10 sm:aspect-16/9 md:aspect-21/9 min-h-[320px] sm:min-h-[380px] md:min-h-[420px] w-full">
        {/* Real Commercial Background Image */}
        <Image
          src={activeSlide.imageSrc}
          alt={activeSlide.imageAlt || 'Commercial Campaign'}
          fill
          priority
          className="object-cover object-[center_35%] md:object-[75%_35%] transition-all duration-700"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />

        {/* Lenskart-style subtle ambient gradient: dark vignette on the left for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent sm:from-black/85 sm:via-black/30 sm:to-transparent" />

        {/* Overlay Content with generous safe gutters (px-14 sm:px-20) so arrows NEVER overlap text */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between py-6 sm:py-8 md:py-10 px-12 sm:px-16 md:px-20">
          {/* Top Brand Watermark (matching Lenskart brand header) */}
          <div className="flex items-center gap-2">
            <span className="font-display text-sm sm:text-base font-black tracking-widest text-white uppercase drop-shadow">
              LAUNCHLY
            </span>
            <span className="text-white/60 font-mono text-xs">/</span>
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider text-yellow uppercase drop-shadow">
              {activeSlide.brandTag}
            </span>
          </div>

          {/* Center Commercial Text Block - Clean typography with plenty of margin */}
          <div className="max-w-lg sm:max-w-xl space-y-2 sm:space-y-3.5 my-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-md whitespace-pre-line">
              {activeSlide.headline}
            </h2>

            {activeSlide.subheadline && (
              <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-200 font-medium leading-relaxed drop-shadow max-w-md line-clamp-2 sm:line-clamp-none">
                {activeSlide.subheadline}
              </p>
            )}

            <div className="pt-2 sm:pt-3">
              <Link
                href={activeSlide.ctaHref}
                className="brutal-press inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 sm:px-7 py-2.5 sm:py-3 font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal-sm hover:bg-yellow transition-colors cursor-pointer"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight size={15} className="stroke-[3]" />
              </Link>
            </div>
          </div>

          {/* Bottom Pagination Dots (cleanly centered like Lenskart) */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 bg-white shadow-xs'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel Arrow Controls (Small, sleek circular chevrons pinned safely to the edges) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-sm shadow transition-all hover:scale-110 hover:bg-black/80 cursor-pointer"
            >
              <ChevronLeft size={18} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-sm shadow transition-all hover:scale-110 hover:bg-black/80 cursor-pointer"
            >
              <ChevronRight size={18} className="stroke-[2.5]" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
