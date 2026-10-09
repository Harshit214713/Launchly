'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Freelance Designer',
    category: 'Designers',
    avatar: 'SC',
    avatarColor: '#6366F1',
    quote: "I launched my client's portfolio in under an hour. The templates are gorgeous and the editor is a dream to use. I've recommended Launchly to every designer in my network.",
    stars: 5,
    highlight: 'Launched in < 1 hour',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Startup Founder',
    category: 'Founders',
    avatar: 'MR',
    avatarColor: '#FF5500',
    quote: "We went from idea to live product page in a single afternoon. The SaaS template was exactly what we needed, and the source code export saved us 3 weeks of dev time.",
    stars: 5,
    highlight: 'Saved 3 weeks of dev time',
  },
  {
    name: 'Priya Patel',
    role: 'Content Creator',
    category: 'Creators',
    avatar: 'PP',
    avatarColor: '#22C55E',
    quote: "Completely non-technical but always wanted a beautiful newsletter blog. Launchly made it possible without touching a single line of code. The results look high-end.",
    stars: 5,
    highlight: 'Zero code required',
  },
  {
    name: 'James Whitfield',
    role: 'Agency Owner',
    category: 'Agencies',
    avatar: 'JW',
    avatarColor: '#F59E0B',
    quote: "We use Launchly to rapidly prototype client websites before handing off the source code. It has dramatically accelerated our agency pipeline and clients love the live previews.",
    stars: 5,
    highlight: 'Agency workflow 3x faster',
  },
  {
    name: 'Aiko Tanaka',
    role: 'Photographer',
    category: 'Creators',
    avatar: 'AT',
    avatarColor: '#8B5CF6',
    quote: "The photo portfolio template is breathtaking. My clients consistently ask what agency built my site — they always assume it was custom coded from scratch.",
    stars: 5,
    highlight: 'Looks custom built',
  },
  {
    name: 'Daniel Brooks',
    role: 'E-commerce Entrepreneur',
    category: 'Founders',
    avatar: 'DB',
    avatarColor: '#EC4899',
    quote: "Set up my fashion brand store in a day. The ecommerce template is beautifully tailored and the checkout flow is as sleek as high-end luxury platforms.",
    stars: 5,
    highlight: 'Live in 1 day',
  },
];

const CATEGORIES = ['All', 'Founders', 'Designers', 'Agencies', 'Creators'];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = activeTab === 'All'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === activeTab);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[#FAF9F6] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E6E0] text-xs sm:text-sm text-[#525252] mb-4 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />
            <span>Customer Love</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-[#171717] mb-4">
            Loved by 14,000+ creators.
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {TESTIMONIALS.slice(0, 5).map((t) => (
                <div
                  key={t.name}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-xs"
                  style={{ background: t.avatarColor }}
                >
                  {t.avatar[0]}
                </div>
              ))}
            </div>
            <div className="text-xs sm:text-sm text-[#525252]">
              <span className="font-bold text-[#171717]">4.95 / 5.0</span> from verified builders worldwide
            </div>
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === cat
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6E0] text-[#525252] hover:text-[#FF5500] hover:bg-[#FAF9F6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Testimonials Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E6E0] hover:border-[#FF5500]/30 hover:shadow-lg hover:shadow-[#FF5500]/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top star rating + micro highlight pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} size={14} className="fill-[#FF5500] text-[#FF5500]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#FF5500] bg-[#FF5500]/10 border border-[#FF5500]/25 px-2 py-0.5 rounded-full truncate">
                    {item.highlight}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#404040] leading-relaxed mb-6 font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E8E6E0]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs shrink-0"
                  style={{ backgroundColor: item.avatarColor }}
                >
                  {item.avatar}
                </div>
                <div className="truncate">
                  <h4 className="text-xs sm:text-sm font-bold text-[#171717] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#8A8A8A] truncate">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
