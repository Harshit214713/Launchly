'use client';

import { useState } from 'react';
import { MessageSquareHeart, Send, CheckCircle2 } from 'lucide-react';

const TAGS = ['Template Idea', 'Feature Bug', 'UX Polish', 'General'];

export default function FeedbackWidget() {
  const [selectedTag, setSelectedTag] = useState('Template Idea');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedTag,
          rating,
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Failed to submit feedback. Please try again.');
      }
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-[min(760px,calc(100%-32px))] pb-24">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center rounded-full border-[3px] border-ink bg-mint px-4 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-ink shadow-brutal">
          You → Makers
        </span>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl font-black text-ink leading-tight">
          Got a template idea, bug, or beef? Send it.
        </h2>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          No account needed. Goes straight to the engineering team.
        </p>
      </div>

      <div className="rounded-2xl border-[3px] border-ink bg-card p-6 sm:p-7 shadow-brutal-md">
        <header className="flex items-center gap-3 pb-4 border-b-[2px] border-ink/15">
          <span className="grid h-11 w-11 place-items-center rounded-xl border-[3px] border-ink bg-lilac text-ink shadow-brutal">
            <MessageSquareHeart className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-lg font-black uppercase tracking-wide text-ink">
              Send Maker Feedback
            </h3>
            <p className="font-mono text-[11px] text-muted-foreground">
              What template should we add next? What broke? Tell us directly.
            </p>
          </div>
        </header>

        {sent ? (
          <div className="py-10 text-center space-y-2 animate-in fade-in">
            <div className="h-12 w-12 rounded-full border-2 border-ink bg-mint text-black flex items-center justify-center mx-auto shadow-brutal-sm">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-display font-black text-lg text-ink">Thank you, legend!</h4>
            <p className="font-mono text-xs text-muted-foreground">
              Your feedback went straight to our radar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
            {/* Tag Selection */}
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                Category
              </span>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-full border-[2.5px] border-ink px-3.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-brutal-sm ${
                      selectedTag === tag
                        ? 'bg-pink text-black'
                        : 'bg-background text-foreground hover:bg-neutral-100'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Range */}
            <label className="flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>Vibe rating</span>
                <span className="text-pink font-black text-xs">({rating}/5)</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="accent-pink cursor-pointer"
              />
            </label>

            {/* Message Textarea */}
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Your message
              </span>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you want to build, what template style is missing, or what felt clunky…"
                className="w-full resize-none rounded-xl border-[3px] border-ink bg-background p-3.5 font-mono text-xs sm:text-sm text-foreground shadow-brutal outline-none focus:ring-4 focus:ring-pink/40"
              />
            </label>

            {error && (
              <p className="font-mono text-xs text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
                {error}
              </p>
            )}

            {/* Submit Row */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="font-mono text-[10px] text-muted-foreground">
                Sending anonymously · Instant delivery
              </span>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="brutal-press inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-pink px-5 py-2.5 font-display text-xs sm:text-sm font-black text-black shadow-brutal disabled:opacity-50 cursor-pointer"
              >
                <Send size={15} />
                <span>{loading ? 'Sending…' : 'Send feedback'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
