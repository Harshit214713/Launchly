'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, Check, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, plan: 'free' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Left decorative brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121214] flex-col justify-between p-12 relative overflow-hidden text-white border-r border-[#171717]/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#FF5500]/18 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-[#FF8833]/10 rounded-full blur-3xl" />
        </div>

        {/* Brand logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#0F0F11] overflow-hidden flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-white/10">
              <Image
                src="/logo-icon.png"
                alt="Launchly Emblem"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <Image
              src="/logo-text-white.png"
              alt="LAUNCHLY"
              width={744}
              height={66}
              className="h-4 w-auto object-contain"
            />
            <span className="sr-only">LAUNCHLY</span>
          </Link>
        </div>

        {/* Value proposition */}
        <div className="relative z-10 max-w-md">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5500] mb-2 block">
            Start Free Today
          </span>
          <h2 className="text-4xl font-black leading-tight mb-4">
            Publish your first live website in 5 minutes.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-8">
            Create an account to save visual editor drafts, deploy instantly on fast global edge networks, and export code on demand.
          </p>

          <div className="space-y-3">
            {[
              'Free to start with no credit card required',
              'Access to all curated aesthetic templates',
              'Visual editor with real-time mobile previews',
              'Free automated SSL and edge subdomain',
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3 text-xs text-white/80">
                <div className="w-4 h-4 rounded-full bg-[#FF5500]/20 border border-[#FF5500]/40 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-[#FF5500]" />
                </div>
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-white/40">
          © 2026 Launchly, Inc. Built for ambitious creators worldwide.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-[#171717] tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-[#737373]">
              Free forever. No credit card required.
            </p>
          </div>

          {/* Error / Success message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>Account created successfully! Launching studio...</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E0] text-sm text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E0] text-sm text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E6E0] text-sm text-[#171717] placeholder-[#8A8A8A] focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#FF5500] cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FF5500] hover:bg-[#E04800] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#737373] mt-8">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#FF5500] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
