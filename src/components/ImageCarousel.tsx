'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = { images: string[]; autoplay?: boolean; intervalMs?: number; carousel?: boolean; className?: string; preview?: boolean };

export default function ImageCarousel({ images, autoplay = false, intervalMs = 4000, carousel = true, className = '', preview = false }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const safeImages = images.filter((src) => typeof src === 'string' && src.trim());
  const activeIndex = safeImages.length ? index % safeImages.length : 0;
  useEffect(() => {
    if (!carousel || !autoplay || paused || safeImages.length < 2 || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % safeImages.length), Math.max(1500, Math.min(20000, intervalMs)));
    return () => window.clearInterval(timer);
  }, [carousel, autoplay, paused, safeImages.length, intervalMs]);
  const move = (amount: number) => setIndex((current) => (current + amount + safeImages.length) % safeImages.length);
  if (!safeImages.length) return <div className={`flex min-h-36 items-center justify-center rounded-xl border-2 border-dashed border-black/25 bg-neutral-50 font-mono text-xs text-neutral-500 ${className}`}>Add image URLs to show the gallery</div>;
  if (!carousel) return <>
    <div className={`grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`}>{safeImages.map((src, imageIndex) => <button key={`${src}-${imageIndex}`} type="button" onClick={() => setLightboxIndex(imageIndex)} aria-label={`Open gallery image ${imageIndex + 1}`} className="overflow-hidden rounded-lg bg-neutral-100"><Image src={src} alt={`Gallery image ${imageIndex + 1} of ${safeImages.length}`} width={600} height={450} unoptimized className="aspect-[4/3] w-full object-cover transition-transform duration-200 hover:scale-105" /></button>)}</div>
    {lightboxIndex !== null && <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Image gallery" onClick={() => setLightboxIndex(null)}><button type="button" aria-label="Close gallery" onClick={() => setLightboxIndex(null)} className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 font-bold text-black">×</button><button type="button" aria-label="Previous image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + safeImages.length) % safeImages.length); }} className="absolute left-4 rounded-full bg-white/90 px-4 py-2 text-xl font-bold text-black">‹</button><Image src={safeImages[lightboxIndex]} alt={`Gallery image ${lightboxIndex + 1} of ${safeImages.length}`} width={1600} height={1200} unoptimized className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain" onClick={(event) => event.stopPropagation()} /><button type="button" aria-label="Next image" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % safeImages.length); }} className="absolute right-4 rounded-full bg-white/90 px-4 py-2 text-xl font-bold text-black">›</button></div>}
  </>;
  return <div className={`group relative overflow-hidden rounded-xl ${className}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="relative aspect-[4/3] w-full bg-neutral-100">
      {safeImages.map((src, imageIndex) => <Image key={`${src}-${imageIndex}`} src={src} alt={`Gallery image ${imageIndex + 1} of ${safeImages.length}`} fill unoptimized sizes="(max-width: 768px) 100vw, 800px" className={`object-cover transition-opacity duration-500 ${imageIndex === activeIndex ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'}`} />)}
    </div>
    {safeImages.length > 1 && <>
      <button type="button" aria-label="Previous image" onClick={() => move(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 px-3 py-2 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">‹</button>
      <button type="button" aria-label="Next image" onClick={() => move(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 px-3 py-2 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">›</button>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2 py-1">{safeImages.map((_, dotIndex) => <button key={dotIndex} type="button" aria-label={`Show image ${dotIndex + 1}`} aria-current={dotIndex === activeIndex} onClick={() => setIndex(dotIndex)} className={`h-2 w-2 rounded-full ${dotIndex === activeIndex ? 'bg-white' : 'bg-white/50'}`} />)}</div>
      {autoplay && <button type="button" aria-label={paused ? 'Resume gallery autoplay' : 'Pause gallery autoplay'} onClick={() => setPaused((current) => !current)} className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white">{paused ? '▶' : 'Ⅱ'}</button>}
    </>}
    {preview && autoplay && <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 font-mono text-[9px] text-white">AUTO · pauses on hover</span>}
  </div>;
}
