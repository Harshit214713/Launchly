'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Sun,
  Moon,
  Mail,
  Lock,
  User,
  Palette,
  CheckCircle2
} from 'lucide-react';
import BrandWordmark from '@/components/BrandWordmark';

const PREVIEW_THEMES = [
  { name: 'Pink', bg: '#f472b6', text: '#000000', label: 'Candy' },
  { name: 'Yellow', bg: '#ffd600', text: '#000000', label: 'Volt' },
  { name: 'Mint', bg: '#7bd7c1', text: '#000000', label: 'Mint' },
  { name: 'Lilac', bg: '#ddd6fe', text: '#000000', label: 'Lilac' },
];

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeTheme, setActiveTheme] = useState(PREVIEW_THEMES[0]);
  const [previewTab, setPreviewTab] = useState<'ui' | 'code'>('ui');
  const [previewHeadline, setPreviewHeadline] = useState('Next-Gen Web Studio');
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      requestAnimationFrame(() => setIsDark(true));
    }
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'signup' || params.get('tab') === 'signup') {
        requestAnimationFrame(() => setAuthMode('signup'));
      }
    }
  }, []);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const pwdStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your email id.');
      return;
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const bodyPayload = authMode === 'login' 
        ? { email: cleanEmail, password } 
        : { name: name.trim(), email: cleanEmail, password, plan: 'free' };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        setError(data.message || (authMode === 'login' ? 'Invalid email or password.' : 'Signup failed. Please try again.'));
      }
    } catch {
      setError('Network connection error. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8fc] dark:bg-[#09090f] text-ink flex flex-col justify-between relative overflow-hidden select-none">

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full border-b-[3px] border-black dark:border-[#222232] bg-card/90 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl border-[2.5px] border-black dark:border-[#222232] bg-white dark:bg-[#161622] p-1 shadow-brutal-sm flex items-center justify-center transition-transform group-hover:rotate-6">
            <Image
              src="/brand-logo-clean.png"
              alt="Launchly Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <BrandWordmark size="md" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="brutal-press h-8 w-8 sm:h-9 sm:w-9 rounded-xl border-2 border-black dark:border-[#222232] bg-yellow text-black flex items-center justify-center shadow-brutal-sm cursor-pointer"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link
            href="/"
            className="brutal-press inline-flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl border-2 border-black dark:border-[#222232] bg-card font-display text-xs font-black uppercase tracking-wider text-ink shadow-brutal-sm hover:bg-neutral-100 dark:hover:bg-[#1a1a26] transition-colors"
          >
            <ArrowLeft size={13} className="stroke-[3]" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 my-auto">
        <div className="w-full max-w-[440px] md:max-w-4xl rounded-3xl border-[3.5px] border-black dark:border-[#222232] bg-card shadow-[8px_8px_0px_#000000] overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Visual Interactive Canvas (Desktop Showcase) */}
          <div className="hidden md:flex md:col-span-5 bg-[#faf5ff] dark:bg-[#12121c] p-6 sm:p-8 flex-col justify-between border-b-[3px] md:border-b-0 md:border-r-[3.5px] border-black dark:border-[#222232] relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              {/* Bold Aesthetic Headlines */}
              <div>
                <h2 className="font-display text-3xl font-black text-black dark:text-white leading-[1.08] tracking-tight">
                  Design visually. <br />
                  <span className="text-pink">Ship instantly.</span>
                </h2>
                <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                  Your creative cloud workspace with real-time Next.js hot-reloading.
                </p>
              </div>

              {/* Aesthetic Interactive Studio Preview Card */}
              <div className="rounded-2xl border-[2.5px] border-black dark:border-[#262638] bg-white dark:bg-[#0c0c12] p-3.5 shadow-brutal-sm text-black dark:text-white space-y-3">
                {/* Browser Titlebar */}
                <div className="flex items-center justify-between border-b border-black/10 dark:border-[#222232] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444] border border-black/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] border border-black/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] border border-black/20" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                    launchly.site/preview
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('ui')}
                      className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                        previewTab === 'ui' ? 'bg-pink text-black' : 'text-neutral-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      UI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('code')}
                      className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                        previewTab === 'code' ? 'bg-pink text-black' : 'text-neutral-400 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      TSX
                    </button>
                  </div>
                </div>

                {previewTab === 'ui' ? (
                  /* Mini UI Canvas */
                  <div 
                    style={{ borderColor: activeTheme.bg }}
                    className="rounded-xl border-2 p-3 bg-[#fdfaf8] dark:bg-[#161622] transition-colors flex flex-col justify-center items-center text-center space-y-2"
                  >
                    <div 
                      style={{ backgroundColor: activeTheme.bg }}
                      className="px-2 py-0.5 rounded-full border border-black font-mono text-[9px] font-black uppercase text-black shadow-xs"
                    >
                      Live Component
                    </div>
                    {/* Live editable preview title */}
                    <input
                      type="text"
                      value={previewHeadline}
                      onChange={(e) => setPreviewHeadline(e.target.value)}
                      className="w-full text-center font-display text-sm font-black text-black dark:text-white bg-transparent border-b border-dashed border-black/20 dark:border-[#262638] focus:outline-none"
                      title="Type to tweak preview live"
                    />
                    <button
                      type="button"
                      style={{ backgroundColor: activeTheme.bg }}
                      className="px-3.5 py-1 rounded-lg border-2 border-black font-display text-[10px] font-black text-black shadow-brutal-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={10} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  /* Mini Code Canvas */
                  <div className="rounded-xl border border-black/20 dark:border-[#262638] bg-[#06060a] p-3 font-mono text-[10px] text-neutral-300 leading-relaxed overflow-hidden">
                    <span className="text-[#c4b5fd]">export default function</span> Hero() &#123;<br />
                    &nbsp;&nbsp;<span className="text-[#7dd3fc]">return</span> (<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#f472b6]">Section</span> theme=&quot;<span className="text-yellow">{activeTheme.name.toLowerCase()}</span>&quot;&gt;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#f472b6]">h1</span>&gt;{previewHeadline}&lt;/<span className="text-[#f472b6]">h1</span>&gt;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#f472b6]">Section</span>&gt;<br />
                    &nbsp;&nbsp;);<br />
                    &#125;
                  </div>
                )}

                {/* Theme Palette Swatches */}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                    <Palette size={11} />
                    <span>Theme:</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {PREVIEW_THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setActiveTheme(theme)}
                        style={{ backgroundColor: theme.bg }}
                        className={`h-5 w-5 rounded-md border border-black transition-transform cursor-pointer ${
                          activeTheme.name === theme.name ? 'scale-125 ring-2 ring-black dark:ring-white shadow-xs' : 'hover:scale-110'
                        }`}
                        title={theme.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column (Responsive on Mobile & Desktop) */}
          <div className="md:col-span-7 p-4 sm:p-7 md:p-10 flex flex-col justify-center bg-card">
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center gap-2 mb-5 p-1 rounded-2xl border-2 border-black dark:border-[#262638] bg-[#faf5ff] dark:bg-[#181824] shadow-brutal-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-pink text-black border-2 border-black shadow-brutal-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); }}
                className={`flex-1 py-2 rounded-xl font-display text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-pink text-black border-2 border-black shadow-brutal-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-5">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-black dark:text-white">
                {authMode === 'login' ? 'Welcome back to Studio' : 'Create your creator account'}
              </h1>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                {authMode === 'login'
                  ? 'Enter your verified credentials to load your workspace.'
                  : 'Get started free with instant access to aesthetic templates.'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2.5 rounded-xl border-2 border-black bg-red-100 dark:bg-red-950/60 text-xs font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-2 shadow-brutal-xs">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-2.5 rounded-xl border-2 border-black bg-mint text-xs font-mono font-black text-black flex items-center gap-2 shadow-brutal-xs animate-scale-in">
                <CheckCircle2 size={15} className="stroke-[3]" />
                <span>Authentication successful! Launching workspace...</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                    Full Name <span className="text-pink">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs sm:text-sm font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                    />
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                  Email Address <span className="text-pink">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your Email Id"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs sm:text-sm font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs transition-all"
                  />
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white">
                    Password <span className="text-pink">*</span>
                  </label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setError('Password reset instructions will be sent to your registered email id.')}
                      className="font-mono text-[10px] text-pink hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs sm:text-sm font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                  />
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength visual meter */}
                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex">
                      <div 
                        className={`h-full transition-all ${
                          pwdStrength <= 1 ? 'w-1/4 bg-red-500' : pwdStrength === 2 ? 'w-2/4 bg-amber-500' : pwdStrength === 3 ? 'w-3/4 bg-yellow' : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className="font-mono text-[9px] uppercase font-bold text-neutral-500">
                      {pwdStrength <= 1 ? 'Weak' : pwdStrength <= 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button with tactile neo-brutalist interaction */}
              <button
                type="submit"
                disabled={loading || success}
                className="brutal-press w-full mt-2 py-3 px-4 rounded-xl border-[2.5px] border-black bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[46px]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>{authMode === 'login' ? 'Authenticating with Supabase...' : 'Creating Account in Supabase...'}</span>
                  </>
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Studio' : 'Create Free Account'}</span>
                    <ArrowRight size={15} className="stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-3.5 border-t-2 border-black/10 dark:border-[#222232] text-center font-mono text-xs text-neutral-600 dark:text-neutral-400">
              {authMode === 'login' ? (
                <p>
                  Don&rsquo;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setError(''); }}
                    className="font-bold text-pink underline cursor-pointer"
                  >
                    Create an account free
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setError(''); }}
                    className="font-bold text-pink underline cursor-pointer"
                  >
                    Sign in to your account
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-3.5 text-center font-mono text-xs text-neutral-500">
        © 2026 Launchly, Inc. All rights reserved.
      </footer>
    </div>
  );
}
