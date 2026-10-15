'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from 'qrcode';
import { 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft, 
  Loader2, 
  AlertCircle,
  Check,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import BrandWordmark from '@/components/BrandWordmark';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const plan = searchParams.get('plan') || 'pro';
  const billing = searchParams.get('billing') || 'monthly';
  const itemParam = searchParams.get('item');

  const itemName = itemParam || (plan === 'pro' ? `Launchly Pro Creator (${billing === 'yearly' ? 'Annual' : 'Monthly'})` : 'Launchly Pro Creator');
  
  const inrAmount = billing === 'yearly' ? 11999 : 1499;
  const priceDisplay = billing === 'yearly' ? '₹11,999 / year ($159)' : '₹1,499 / month ($19)';

  const [txnId, setTxnId] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const payeeVpa = '7428938113@ptaxis';
  const payeeName = 'VARDAAN SAXENA';
  const note = `Launchly ${itemName}`;

  // Auto-fill amount in UPI apps
  const upiUri = `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&am=${inrAmount}.00&cu=INR&tn=${encodeURIComponent(note)}`;

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 260,
      margin: 1,
      color: {
        dark: '#FFFFFF',
        light: '#0D0D14',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl('/payment-qr.png'));
  }, [upiUri]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanTxn = txnId.trim();
    if (!cleanTxn || cleanTxn.length < 8) {
      setError('Please provide a valid 12-digit UTR or Transaction Reference ID.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email || 'customer@launchly.site',
          planId: plan,
          itemName,
          amount: inrAmount.toString(),
          txnId: cleanTxn,
          billingCycle: billing,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment verification failed.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('launchly_plan', 'pro');
        localStorage.setItem('launchly_pro_active', 'true');
        localStorage.setItem('launchly_payment_txn', cleanTxn);
      }

      setSuccess(true);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to verify transaction. Please verify your reference number.';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0c0c12] text-ink flex flex-col">
      {/* Top Navigation */}
      <header className="border-b-[3px] border-ink bg-card py-3.5 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#0F0F11] overflow-hidden flex items-center justify-center shadow-brutal-sm group-hover:scale-105 transition-transform border-2 border-ink">
            <Image
              src="/brand-logo-clean.png"
              alt="Launchly Emblem"
              width={32}
              height={32}
              className="w-full h-full object-contain p-0.5 rounded-lg"
            />
          </div>
          <BrandWordmark size="md" />
        </Link>

        <Link
          href="/#pricing"
          className="brutal-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-ink bg-card font-mono text-xs font-black uppercase text-ink shadow-brutal-sm hover:bg-neutral-100"
        >
          <ArrowLeft size={13} className="stroke-[3]" />
          <span>Back to Plans</span>
        </Link>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 flex items-center justify-center">
        {!success ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-start">
            {/* Left Column: Plan Summary */}
            <div className="md:col-span-5 rounded-3xl border-[3.5px] border-ink bg-card p-5 sm:p-6 shadow-brutal-lg">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-yellow px-3 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-sm mb-3">
                <Sparkles size={11} />
                ORDER SUMMARY
              </span>

              <h1 className="font-display text-2xl font-black text-ink leading-tight">
                {itemName}
              </h1>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Instant access to production source code export, custom domains, and edge SSR.
              </p>

              <div className="my-4 pb-4 border-b-[2px] border-ink/15">
                <span className="font-mono text-[11px] text-muted-foreground uppercase block">
                  Amount Due (Auto-Filled in UPI)
                </span>
                <span className="font-display text-2xl sm:text-3xl font-black text-ink">
                  {priceDisplay}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {[
                  'Full Next.js 15 App Router source code download',
                  'Commercial & personal project license',
                  'Custom domain connection with auto SSL',
                  'Zero Launchly watermark',
                  'Priority creator support',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-ink bg-pink text-black flex items-center justify-center shrink-0">
                      <Check size={10} className="stroke-[3]" />
                    </span>
                    <span className="text-ink text-[11px] sm:text-xs">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 rounded-2xl border-2 border-ink bg-mint/30 flex items-center gap-2 text-xs font-mono text-ink">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 stroke-[2.5]" />
                <span className="text-[11px]">Instant activation upon UPI transaction verification.</span>
              </div>
            </div>

            {/* Right Column: QR Code & Payment Form */}
            <div className="md:col-span-7 rounded-3xl border-[3.5px] border-ink bg-card p-5 sm:p-6 shadow-brutal-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-3 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-sm mb-2">
                <QrCode size={12} className="stroke-[2.5]" />
                SCAN & PAY VIA THIS QR CODE ONLY
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-black text-ink">
                Scan with UPI
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                Amount is automatically prefilled. Google Pay, PhonePe, Paytm & all banking apps supported.
              </p>

              {/* Dynamic QR Code Container */}
              <div className="mt-4 p-4 rounded-2xl border-2 border-ink bg-white dark:bg-[#12121c] flex flex-col items-center justify-center shadow-brutal-sm text-center">
                <div className="w-44 h-44 sm:w-48 sm:h-48 relative rounded-xl overflow-hidden border-2 border-black bg-white p-2 flex items-center justify-center shadow-inner">
                  {qrDataUrl ? (
                    <Image
                      src={qrDataUrl}
                      alt="Official Payment QR Code with Prefilled Amount"
                      width={192}
                      height={192}
                      unoptimized
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Loader2 size={24} className="animate-spin text-pink" />
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Auto-Fills: {priceDisplay}</span>
                </div>

                {upiUri && (
                  <a
                    href={upiUri}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-black bg-yellow text-black font-mono text-[11px] font-bold shadow-brutal-xs hover:bg-pink transition-colors"
                  >
                    <span>Tap to Pay in UPI App</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {/* Transaction Confirmation Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {error && (
                  <div className="p-2.5 rounded-xl border-2 border-ink bg-red-100 dark:bg-red-950/60 text-xs font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-ink mb-1">
                    12-Digit UTR / Transaction Reference No. <span className="text-pink">*</span>
                  </label>
                  <input
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter 12-digit UTR from your payment app"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border-[2.5px] border-ink bg-background font-mono text-xs sm:text-sm font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-sm"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-ink mb-1">
                    Email Address (for receipt & invoice)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border-[2.5px] border-ink bg-background font-mono text-xs sm:text-sm font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="brutal-press w-full py-3 px-5 rounded-2xl border-[3px] border-ink bg-pink text-black font-display text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>Verifying Payment in Supabase...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} className="stroke-[2.5]" />
                      <span>Verify & Activate Pro</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="max-w-md w-full rounded-3xl border-[3.5px] border-ink bg-card p-6 sm:p-8 shadow-brutal-xl text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl border-[3.5px] border-ink bg-mint text-black flex items-center justify-center mx-auto mb-4 shadow-brutal">
              <CheckCircle2 size={36} className="stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-yellow px-3 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-sm mb-3">
              <Sparkles size={11} />
              PAYMENT VERIFIED
            </div>

            <h2 className="font-display text-2xl font-black text-ink">
              Welcome to Pro!
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Your payment has been verified and registered in Supabase.
            </p>

            <div className="mt-3 inline-block px-3 py-1 rounded-xl border-2 border-ink bg-neutral-100 dark:bg-neutral-800 font-mono text-xs font-black text-ink shadow-brutal-sm">
              Ref: {txnId}
            </div>

            <button
              type="button"
              onClick={() => router.push('/dashboard?payment_success=true')}
              className="brutal-press w-full mt-6 py-3 px-5 rounded-xl border-[3px] border-ink bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enter Launchly Studio</span>
              <ArrowRight size={15} className="stroke-[3]" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-mono text-sm">
        Loading Checkout...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
