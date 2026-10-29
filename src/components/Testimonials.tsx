'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Tanisha Mehindritta',
    role: 'UI/UX & Brand Designer',
    category: 'Designers',
    avatar: 'TM',
    avatarBg: 'bg-lilac',
    image: '/testimonials/tanisha.png',
    quote: "Finally a builder that actually respects typography and neo-brutalist aesthetics. Assembled my portfolio in an evening and it felt effortless to tweak every component and color scheme.",
    stars: 5,
    highlight: 'Built in one evening',
  },
  {
    name: 'Divyam Jain',
    role: 'Full-Stack Engineer',
    category: 'Developers',
    avatar: 'DJ',
    avatarBg: 'bg-yellow',
    image: '/testimonials/divyam.png',
    quote: "Exported the source code straight into our hackathon repo. Pure Next.js 15 App Router code with clean Tailwind classes, zero vendor lock-in, and instant edge live previews.",
    stars: 5,
    highlight: 'Clean Next.js 15 export',
  },
  {
    name: 'Parivisha Midha',
    role: 'Creative Director & Creator',
    category: 'Creators',
    avatar: 'PM',
    avatarBg: 'bg-mint',
    image: '/testimonials/parivisha.jpg',
    quote: "I wanted a sleek personal space for my creative work without having to code or settle for generic link-in-bio tools. Launchly was super intuitive and the result looks high-end.",
    stars: 5,
    highlight: 'Zero code required',
  },
  {
    name: 'Gourav Mandal',
    role: 'Software Engineer & Tech Builder',
    category: 'Developers',
    avatar: 'GM',
    avatarBg: 'bg-pink',
    image: '/testimonials/gourav.png',
    quote: "Being able to tweak components on a live canvas and share an instant live subdomain with friends is super slick. The performance and dark aesthetic are top-notch.",
    stars: 5,
    highlight: 'Instant edge preview',
  },
  {
    name: 'Dev Maheshwari',
    role: 'Visual Artist & Photographer',
    category: 'Creators',
    avatar: 'DM',
    avatarBg: 'bg-sky',
    image: '/testimonials/dev.jpg',
    quote: "The photo portfolio layout is stunning. It showcases high-res visuals cleanly with zero lag, and my friends honestly thought I hired a boutique design studio to build it.",
    stars: 5,
    highlight: 'Editorial gallery vibe',
  },
];

const CATEGORIES = ['All', 'Designers', 'Developers', 'Creators'];

export default function Testimonials() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = TESTIMONIALS.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  return (
    <section className="mx-auto w-[min(1200px,calc(100%-32px))] py-8 sm:py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="font-display text-4xl sm:text-5xl font-black text-ink leading-tight">
          Loved by early makers & friends.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          What fellow designers, developers, and creators say after building with Launchly.
        </p>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`brutal-press rounded-xl border-[2.5px] border-ink px-3.5 py-1.5 font-display text-xs font-black uppercase transition-all cursor-pointer ${selectedCategory === cat
                ? 'bg-pink text-black shadow-brutal-sm'
                : 'bg-card text-ink hover:bg-neutral-100 dark:hover:bg-[#1b1c30] shadow-brutal-sm'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Balanced Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {filtered.map((item, idx) => (
          <article
            key={idx}
            className="brutal-press rounded-2xl border-[3px] border-ink bg-card p-6 shadow-brutal hover:shadow-brutal-md transition-all flex flex-col justify-between w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md"
          >
            <div>
              {/* Top Row: 5 Stars & Highlight Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5 shadow-brutal-sm">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} size={12} className="fill-black text-black" />
                  ))}
                </div>

                <span className="inline-block rounded-full border-2 border-ink bg-mint px-2.5 py-0.5 font-mono text-[10px] font-bold text-black">
                  {item.highlight}
                </span>
              </div>

              {/* Quote */}
              <p className="font-mono text-xs sm:text-[13px] leading-relaxed text-ink mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t-[2px] border-ink/15">
              {'image' in item && item.image ? (
                <div className="relative h-11 w-11 rounded-xl border-2 border-ink overflow-hidden shadow-brutal-sm shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className={`h-11 w-11 rounded-xl border-2 border-ink ${item.avatarBg} font-mono font-black text-black flex items-center justify-center text-xs shadow-brutal-sm shrink-0`}
                >
                  {item.avatar}
                </div>
              )}
              <div>
                <h4 className="font-display font-black text-sm text-ink leading-tight">
                  {item.name}
                </h4>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {item.role}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
