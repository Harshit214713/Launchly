'use client';

import { useState } from 'react';
import { MessageSquareHeart, Send, CheckCircle2, Loader2 } from 'lucide-react';

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
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          rating,
          name: 'Launchly website feedback',
          email: userEmail.trim() || undefined,
          message: message.trim(),
        }),
      });
      const result = await response.json().catch(() => ({})) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'We could not send your feedback. Please try again.');
      }
      setSent(true);
      setMessage('');
      setUserEmail('');
      window.setTimeout(() => setSent(false), 5000);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We could not send your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-[min(1000px,calc(100%-32px))] pt-4 sm:pt-6 pb-12 sm:pb-16">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-ink leading-tight">
          Help us make Launchly better.
        </h2>
      </div>

      {/* Main Feedback Box */}
      <div className="mt-8 mx-auto max-w-2xl rounded-3xl sm:rounded-[28px] border-[3.5px] border-black dark:border-[#26283d] bg-white dark:bg-[#131424] p-6 sm:p-8 shadow-brutal-lg">
        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b-[2px] border-black/10 dark:border-[#202235]">
          <div className="h-10 w-10 shrink-0 rounded-xl border-2 border-black bg-lilac flex items-center justify-center text-black shadow-xs">
            <MessageSquareHeart size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-black uppercase tracking-wider text-ink leading-tight">
              SHARE FEEDBACK
            </h3>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Send a product idea, report an issue, or share what could work better.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="py-10 text-center space-y-3 animate-in fade-in">
            <div className="h-12 w-12 rounded-full border-2 border-black bg-mint text-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <CheckCircle2 size={24} className="stroke-[2.5]" />
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-black bg-yellow px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black">
              <CheckCircle2 size={11} className="stroke-[2.5]" />
              FEEDBACK RECEIVED
            </div>
            <h4 className="font-display text-lg font-black text-ink">
              Thank you for taking the time to share feedback.
            </h4>
            <p className="font-mono text-xs text-muted-foreground max-w-md mx-auto">
              Your submission was accepted. We appreciate your help improving Launchly.
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
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Category selection pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`brutal-press rounded-full border-2 border-black dark:border-[#26283d] px-4 py-1.5 font-mono text-xs font-black uppercase transition-all cursor-pointer ${category === cat
                      ? 'bg-pink text-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white dark:bg-[#18192a] text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-[#202238]'
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
                    background: `linear-gradient(to right, #f472b6 0%, #f472b6 ${((rating - 1) / 4) * 100
                      }%, #e5e7eb ${((rating - 1) / 4) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Optional Email / Handle Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <span className="font-mono text-[9px] text-neutral-400">Leave blank to stay anonymous</span>
              </div>
              <input
                type="email"
                maxLength={254}
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border-2 border-black dark:border-[#26283d] bg-[#faf8f5] dark:bg-[#151726] px-3.5 py-2 font-mono text-xs text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink/50 shadow-xs"
              />
            </div>

            {/* Message Area */}
            <div>
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                YOUR MESSAGE <span className="text-pink">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you were trying to do and how we could improve the experience."
                className="w-full rounded-2xl border-[2.5px] border-black dark:border-[#26283d] bg-[#faf8f5] dark:bg-[#151726] p-4 font-mono text-xs sm:text-[13px] text-ink placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink/50 shadow-inner resize-y min-h-[110px]"
                required
              />
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-1">
              {error && <p role="alert" className="w-full text-sm font-semibold text-red-700 dark:text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="brutal-press w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-pink hover:bg-pink/90 text-black px-6 py-2.5 font-display text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000000] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-black" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <Send size={14} className="stroke-[2.5]" />
                    <span>Send feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
