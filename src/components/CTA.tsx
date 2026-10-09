'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'cta_banner' }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.message || "You're in! Check your inbox for your VIP launch link.",
        });
        setEmail('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Something went wrong. Please try again.',
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error. Please check your connection.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#171717] rounded-3xl p-6 sm:p-12 md:p-14 text-center relative overflow-hidden shadow-2xl border border-white/5">
          {/* Background ambient lighting - Radiant Sunset Orange */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#FF5500]/22 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-60 h-32 bg-[#FF8833]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5500]/15 border border-[#FF5500]/30 text-xs sm:text-sm font-semibold text-[#FF5500] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
              <span>Launch your website in under 5 minutes</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.03em] text-white mb-4 leading-[1.05]">
              Dream it.<br className="sm:hidden" /> Build it.<br className="sm:hidden" /> Launch it.
            </h2>

            <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed">
              Join thousands of founders, designers, and creators who launch production-ready websites with zero code.
            </p>

            {/* Interactive Backend-Supported Email Form */}
            <div className="max-w-md mx-auto mb-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-full bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#FF5500] focus:bg-white/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 rounded-full bg-[#FF5500] hover:bg-[#E04800] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5500]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-white" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Building Free</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Status Message */}
              {status && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 animate-fade-in ${
                    status.type === 'success'
                      ? 'bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30'
                      : 'bg-red-500/15 text-red-300 border border-red-500/30'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 size={14} /> : null}
                  <span>{status.message}</span>
                </div>
              )}
            </div>

            {/* Direct Links */}
            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-white/60">
              <Link href="/templates" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                Explore 12+ live templates →
              </Link>
              <span>•</span>
              <Link href="/signup" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                Create account directly
              </Link>
            </div>

            {/* Features check row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/10 text-xs text-white/50">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF5500] font-bold">✓</span>
                <span>Free forever tier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF5500] font-bold">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF5500] font-bold">✓</span>
                <span>Custom domain ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF5500] font-bold">✓</span>
                <span>Clean Next.js export</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
