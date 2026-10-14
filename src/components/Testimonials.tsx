'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Tanisha Mehindritta',
    role: 'Product & Brand Designer',
    category: 'Designers',
    avatar: 'TM',
    avatarBg: 'bg-lilac',
    image: '/testimonials/tanisha.png',
    quote: "I launched my client's portfolio in under an hour. The templates are gorgeous and the editor is a dream to use. I've recommended Launchly to every designer in my network.",
    stars: 5,
    highlight: 'Launched in < 1 hour',
  },
  {
    name: 'Divyam Jain',
    role: 'Founding Engineer',
    category: 'Founders',
    avatar: 'DJ',
    avatarBg: 'bg-yellow',
    image: '/testimonials/divyam.png',
    quote: "We went from idea to live product page in a single afternoon. The SaaS template was exactly what we needed, and the source code export saved us 3 weeks of dev time.",
    stars: 5,
    highlight: 'Saved 3 weeks of dev time',
  },
  {
    name: 'Parivisha Midha',
    role: 'Creative Director & Creator',
    category: 'Creators',
    avatar: 'PM',
    avatarBg: 'bg-mint',
    image: '/testimonials/parivisha.jpg',
    quote: "Completely non-technical but always wanted a beautiful website. Launchly made it possible without touching a single line of code. The results look high-end and super fast.",
    stars: 5,
    highlight: 'Zero code required',
  },
  {
    name: 'Gourav Mandal',
    role: 'Full-Stack Developer & Agency Lead',
    category: 'Agencies',
    avatar: 'GM',
    avatarBg: 'bg-pink',
    image: '/testimonials/gourav.png',
    quote: "We use Launchly to rapidly prototype client websites before handing off the source code. It has dramatically accelerated our pipeline and clients love the live previews.",
    stars: 5,
    highlight: 'Agency workflow 3x faster',
  },
  {
    name: 'Samiksha Jhunjhunwala',
    role: 'Photographer & Visual Artist',
    category: 'Creators',
    avatar: 'SJ',
    avatarBg: 'bg-sky',
    image: '/testimonials/samiksha.png',
    quote: "The photo portfolio template is breathtaking. My clients consistently ask what agency built my site — they always assume it was custom coded from scratch.",
    stars: 5,
    highlight: 'Looks custom built',
  },
  {
    name: 'Daniel Brooks',
    role: 'E-commerce Entrepreneur',
    category: 'Founders',
    avatar: 'DB',
    avatarBg: 'bg-yellow',
    quote: "Setup my drop page in 20 minutes, connected my Stripe and custom domain. Already made $14k in pre-orders. Launchly is an absolute unfair advantage.",
    stars: 5,
    highlight: '$14k in pre-orders',
  },
];

const CATEGORIES = ['All', 'Founders', 'Designers', 'Agencies', 'Creators'];

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
          Joined by thousands of happy makers.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          See what founders, designers, and creators say after shipping with Launchly.
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
                : 'bg-card text-ink hover:bg-neutral-100 shadow-brutal-sm'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials 3-Column Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => (
          <article
            key={idx}
            className="brutal-press rounded-2xl border-[3px] border-ink bg-card p-6 shadow-brutal hover:shadow-brutal-md transition-all flex flex-col justify-between"
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
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-11 w-11 rounded-xl border-2 border-ink object-cover shadow-brutal-sm shrink-0"
                />
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
