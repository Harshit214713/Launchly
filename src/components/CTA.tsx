'use client';

import { useState } from 'react';
import { MessageSquareHeart, Send, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['IDEA', 'BUG', 'UX POLISH', 'HOT TAKE'];

const RATING_VIBES: Record<number, string> = {
  1: '1/5 — Needs work',
  2: '2/5 — Getting warm',
  3: '3/5 — Pretty slick',
  4: '4/5 — Excellent',
  5: '5/5 — Flawless, top tier',
};

export default function CTA() {
  const [category, setCategory] = useState('IDEA');
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Anonymous [${category}] (Rating: ${rating}/5)`,
          email: 'feedback@launchly.site',
          message: message.trim(),
        }),
      });
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 4500);
    }
  };

  return (
    <section className="mx-auto w-[min(1000px,calc(100%-32px))] pt-4 sm:pt-6 pb-12 sm:pb-16">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center rounded-full border-[2.5px] border-black dark:border-white bg-mint px-4 py-1 font-mono text-xs font-black uppercase tracking-wider text-black shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff]">
          DEV DIRECT // ZERO BS
        </span>

        <h2 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight">
          Got a wild idea, found a bug, or have a hot take?
        </h2>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          No signups. No ticket queues. Delivered straight to the maker&apos;s screen.
        </p>
      </div>

      {/* Main Feedback Box */}
      <div className="mt-8 mx-auto max-w-2xl rounded-3xl sm:rounded-[28px] border-[3.5px] border-black dark:border-white/30 bg-white dark:bg-[#121218] p-6 sm:p-8 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff]">
        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b-[2px] border-black/10 dark:border-white/10">
          <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-black bg-lilac flex items-center justify-center text-black shadow-xs">
            <MessageSquareHeart size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-black uppercase tracking-wider text-ink leading-tight">
              DISPATCH FEEDBACK
            </h3>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Roast the UI, suggest new features, or tell us what made you smile.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="py-10 text-center space-y-3 animate-in fade-in">
            <div className="h-12 w-12 rounded-full border-2 border-black bg-mint text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <CheckCircle2 size={24} className="stroke-[2.5]" />
            </div>
            <h4 className="font-display text-lg font-black text-ink">
              Transmission received
            </h4>
            <p className="font-mono text-xs text-muted-foreground">
              Your note just landed on the dev board. Thanks for helping make Launchly better.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-2 font-mono text-xs font-bold text-pink underline cursor-pointer"
            >
              Dispatch another thought
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Category selection pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`brutal-press rounded-full border-2 border-black dark:border-white/30 px-4 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-pink text-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ffffff]'
                      : 'bg-white dark:bg-[#1a1a24] text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Experience Rating Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  VIBE CHECK: <span className="text-ink font-black">{RATING_VIBES[rating] || `${rating}/5`}</span>
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer border-[1.5px] border-black bg-neutral-200 dark:bg-neutral-800 accent-pink"
                  style={{
                    background: `linear-gradient(to right, #f472b6 0%, #f472b6 ${
                      ((rating - 1) / 4) * 100
                    }%, #e5e7eb ${((rating - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                THE RAW TRUTH // YOUR THOUGHTS
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Roast our animations, request your dream template, or describe the feature that would make Launchly your default builder..."
                className="w-full rounded-2xl border-[2.5px] border-black dark:border-white/30 bg-white dark:bg-[#0c0c10] p-4 font-mono text-xs sm:text-[13px] text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink/50 shadow-inner resize-y min-h-[110px]"
                required
              />
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <span className="font-mono text-[11px] text-muted-foreground self-start sm:self-center">
                100% Anonymous • Direct to Developer
              </span>

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="brutal-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-[2.5px] border-black dark:border-white bg-pink hover:bg-pink/90 text-black px-6 py-2.5 font-display text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <Send size={14} className="stroke-[2.5]" />
                <span>{loading ? 'Transmitting…' : 'Dispatch Feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
