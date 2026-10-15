'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import QRCode from 'qrcode';
import {
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Check,
  CreditCard,
  Download,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName?: string;
  price?: string;
  planId?: string;
  billingCycle?: 'monthly' | 'yearly';
  onPaymentComplete?: (transactionId: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  itemName = 'Launchly Pro Creator',
  price,
  planId = 'pro',
  billingCycle = 'monthly',
  onPaymentComplete,
}: PaymentModalProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [payerEmail, setPayerEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifyStep, setVerifyStep] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Generate a unique dynamic session order ID for this checkout
  const [orderSessionId] = useState<string>(() => {
    return `ORD_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  });

  // Automatically fetch logged-in user email on mount
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.authenticated && data.user?.email) {
          setPayerEmail(data.user.email);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Calculate prefilled UPI amount based on selected plan
  const getAmountDetails = () => {
    if (price) {
      return { inr: 1499, label: price };
    }
    if (planId === 'pro') {
      if (billingCycle === 'yearly') {
        return { inr: 11999, label: '₹11,999 / yr ($159)' };
      }
      return { inr: 1499, label: '₹1,499 / mo ($19)' };
    }
    if (planId.startsWith('template-')) {
      return { inr: 3999, label: '₹3,999 ($49)' };
    }
    return { inr: 1499, label: '₹1,499' };
  };

  const amountInfo = getAmountDetails();

  const payeeVpa = '7428938113@ptaxis';
  const payeeName = 'VARDAAN SAXENA';
  const note = `Launchly ${itemName} ${orderSessionId}`;

  // Derived UPI URI with prefilled amount and order session ID
  const upiLink = useMemo(() => {
    return `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&am=${amountInfo.inr}.00&cu=INR&tn=${encodeURIComponent(note)}`;
  }, [payeeVpa, payeeName, amountInfo.inr, note]);

  // Generate dynamic QR code encoding the exact amount in UPI protocol
  useEffect(() => {
    if (!isOpen || !upiLink) return;

    QRCode.toDataURL(upiLink, {
      width: 260,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error('QR code generation error:', err);
        setQrDataUrl('/payment-qr.png');
      });
  }, [isOpen, upiLink]);

  // Automated Verification Handler
  const handleAutoVerifyPayment = useCallback(async () => {
    setError('');
    const targetEmail = payerEmail.trim() || 'customer@launchly.site';

    setSubmitting(true);
    setVerifyStep('Connecting to banking reconciliation network...');

    try {
      // Step 1: Check banking status
      setVerifyStep('Reconciling payment with merchant pool...');
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: orderSessionId,
          userEmail: targetEmail,
          planId,
          itemName,
          amount: amountInfo.inr.toString(),
          billingCycle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment not detected yet. Please ensure you completed the UPI transfer and try again.');
      }

      setVerifyStep('Payment confirmed! Activating Pro Creator...');

      // Store purchase status locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('launchly_plan', planId);
        localStorage.setItem('launchly_payment_txn', orderSessionId);
        localStorage.setItem('launchly_pro_active', 'true');
      }

      setSuccess(true);
      if (onPaymentComplete) {
        onPaymentComplete(orderSessionId);
      }

      // Automatically move forward after celebration
      setTimeout(() => {
        onClose();
        router.push('/dashboard?payment_success=true');
      }, 2200);

    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to confirm payment. Please tap "I\'ve Paid" after completing in your app.';
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  }, [payerEmail, orderSessionId, planId, itemName, amountInfo.inr, billingCycle, onPaymentComplete, onClose, router]);

  // Background Auto-Polling: checks payment status every 4 seconds while modal is open
  useEffect(() => {
    if (!isOpen || success || submitting || paymentMethod !== 'upi') return;

    const interval = setInterval(async () => {
      try {
        const queryUrl = `/api/payments/status?sessionId=${encodeURIComponent(orderSessionId)}${
          payerEmail ? `&email=${encodeURIComponent(payerEmail)}` : ''
        }`;
        const res = await fetch(queryUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.verified) {
            handleAutoVerifyPayment();
          }
        }
      } catch {}
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, success, submitting, paymentMethod, orderSessionId, payerEmail, handleAutoVerifyPayment]);

  if (!isOpen) return null;

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = payerEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email id.');
      return;
    }

    if (!cardNumber.trim() || cardNumber.replace(/\s+/g, '').length < 12) {
      setError('Please enter a valid Card Number.');
      return;
    }

    setSubmitting(true);
    setVerifyStep('Authorizing card transaction...');

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: orderSessionId,
          userEmail: cleanEmail,
          planId,
          itemName,
          amount: amountInfo.inr.toString(),
          billingCycle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Payment authorization failed.');
      }

      setVerifyStep('Card authorized! Activating Pro Creator...');

      if (typeof window !== 'undefined') {
        localStorage.setItem('launchly_plan', planId);
        localStorage.setItem('launchly_payment_txn', orderSessionId);
        localStorage.setItem('launchly_pro_active', 'true');
      }

      setSuccess(true);
      if (onPaymentComplete) {
        onPaymentComplete(orderSessionId);
      }

      setTimeout(() => {
        onClose();
        router.push('/dashboard?payment_success=true');
      }, 2200);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Card authorization failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadReceipt = () => {
    const receiptContent = `=========================================
LAUNCHLY STUDIO PRO RECEIPT
=========================================
Plan: ${itemName}
Reference: ${orderSessionId}
Billing Cycle: ${billingCycle.toUpperCase()}
Amount: ${amountInfo.label}
Customer: ${payerEmail || 'Pro Creator'}
Status: VERIFIED & ACTIVE
Date: ${new Date().toUTCString()}
-----------------------------------------
Thank you for building with Launchly!
Visit: https://launchly.site/dashboard
=========================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `launchly-receipt-${orderSessionId.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    onClose();
    router.push('/dashboard?payment_success=true');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] max-h-[94vh] flex flex-col bg-card border-[3.5px] border-black dark:border-[#26283d] rounded-3xl p-4 sm:p-5 shadow-brutal-xl text-ink relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-black/10 dark:border-[#202235] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-pink border border-black inline-block" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white leading-tight">
                Scan to Pay
              </h2>
            </div>
            <p className="font-mono text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
              Amount auto-fills upon scanning in any UPI app.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="brutal-press h-8 w-8 rounded-xl border-2 border-black bg-yellow flex items-center justify-center text-black shadow-brutal-sm hover:bg-pink transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X size={16} className="stroke-[3]" />
          </button>
        </div>

        {!success ? (
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-3 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl border-2 border-black dark:border-[#262638] bg-neutral-100 dark:bg-[#141420]">
              <button
                type="button"
                onClick={() => { setPaymentMethod('upi'); setError(''); }}
                className={`py-1.5 px-3 rounded-lg font-mono text-[11px] font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'bg-yellow text-black border-2 border-black shadow-brutal-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <Smartphone size={13} className="stroke-[2.5]" />
                <span>UPI Auto-Pay</span>
              </button>
              <button
                type="button"
                onClick={() => { setPaymentMethod('card'); setError(''); }}
                className={`py-1.5 px-3 rounded-lg font-mono text-[11px] font-black uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-pink text-black border-2 border-black shadow-brutal-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                }`}
              >
                <CreditCard size={13} className="stroke-[2.5]" />
                <span>Card / Stripe</span>
              </button>
            </div>

            {/* Plan & Amount Summary Bar */}
            <div className="p-3 rounded-xl border-2 border-black dark:border-[#262638] bg-[#faf5ff] dark:bg-[#181824] flex items-center justify-between shadow-brutal-xs">
              <div>
                <span className="font-mono text-[9px] font-black uppercase text-pink block">
                  SELECTED PLAN
                </span>
                <span className="font-display text-xs sm:text-sm font-black text-black dark:text-white truncate block max-w-[180px]">
                  {itemName}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[9px] uppercase font-bold text-neutral-500 dark:text-neutral-400 block">
                  {paymentMethod === 'upi' ? 'AUTO-FILLED AMOUNT' : 'TOTAL (USD)'}
                </span>
                <span className="font-display text-sm sm:text-base font-black text-black dark:text-white">
                  {paymentMethod === 'upi' ? amountInfo.label : (billingCycle === 'yearly' ? '$159 / yr' : '$19 / mo')}
                </span>
              </div>
            </div>

            {paymentMethod === 'upi' ? (
              <>
                {/* Neo-Brutalist Clean QR Code Box */}
                <div className="p-3.5 rounded-2xl border-2 border-black dark:border-[#262638] bg-white dark:bg-[#12121c] flex flex-col items-center justify-center shadow-brutal-sm text-center">
                  <div className="w-38 h-38 sm:w-42 sm:h-42 rounded-xl border-2 border-black bg-white p-2 flex items-center justify-center shadow-inner relative group">
                    {qrDataUrl ? (
                      <Image
                        src={qrDataUrl}
                        alt="UPI Payment QR Code"
                        width={160}
                        height={160}
                        unoptimized
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <Loader2 size={24} className="animate-spin text-pink" />
                      </div>
                    )}
                  </div>

                  {/* Supported UPI Providers List */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>GPay</span>
                    <span>•</span>
                    <span>PhonePe</span>
                    <span>•</span>
                    <span>Paytm</span>
                    <span>•</span>
                    <span>BHIM</span>
                    <span>•</span>
                    <span>Cred</span>
                  </div>

                  {/* Tap to open in UPI App button for mobile */}
                  {upiLink && (
                    <a
                      href={upiLink}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border-2 border-black bg-yellow text-black font-mono text-[11px] font-bold shadow-brutal-xs hover:bg-pink transition-colors"
                    >
                      <Smartphone size={12} className="stroke-[2.5]" />
                      <span>Tap to Pay in UPI App</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* Auto-Verification Live Radar Status Box */}
                <div className="space-y-2.5">
                  {error && (
                    <div className="p-2.5 rounded-xl border-2 border-black bg-red-100 dark:bg-red-950/60 text-[11px] font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 shadow-brutal-xs">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Account Email Information */}
                  {payerEmail ? (
                    <div className="px-3 py-1.5 rounded-xl border border-black/20 dark:border-[#26283d] bg-white dark:bg-[#12121c] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-neutral-500 dark:text-neutral-400">Account:</span>
                      <strong className="text-black dark:text-white truncate max-w-[220px]">{payerEmail}</strong>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="email"
                        value={payerEmail}
                        onChange={(e) => { setPayerEmail(e.target.value); setError(''); }}
                        placeholder="Enter your Email for Pro Receipt"
                        className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow shadow-brutal-xs"
                      />
                    </div>
                  )}

                  {submitting && (
                    <div className="p-2.5 rounded-xl border-2 border-black bg-neutral-100 dark:bg-[#151522] text-xs font-mono font-bold text-black dark:text-white flex items-center justify-center gap-2 shadow-brutal-xs">
                      <Loader2 size={15} className="animate-spin text-pink" />
                      <span>{verifyStep || 'Payment detected! Verifying...'}</span>
                    </div>
                  )}

                  <p className="text-center font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                    Once paid on your phone, wait for auto-detection to advance.
                  </p>
                </div>
              </>
            ) : (
              /* Global Credit / Debit Card Form */
              <form onSubmit={handleCardPayment} className="space-y-3 pt-1 pb-2">
                {error && (
                  <div className="p-2 rounded-lg border-2 border-black bg-red-100 dark:bg-red-950/60 text-[11px] font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 shadow-brutal-xs">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                    Your Email (for Pro access &amp; invoice) <span className="text-pink">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={payerEmail}
                    onChange={(e) => { setPayerEmail(e.target.value); setError(''); }}
                    placeholder="Enter Your email id"
                    className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                    Card Number <span className="text-pink">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                      setCardNumber(formatted);
                      setError('');
                    }}
                    placeholder="Enter your Card Number"
                    maxLength={19}
                    className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                      Expiry (MM/YY) <span className="text-pink">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                        const formatted = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
                        setCardExpiry(formatted);
                        setError('');
                      }}
                      placeholder="MM / YY"
                      maxLength={5}
                      className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                      CVC / CVV <span className="text-pink">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => {
                        setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4));
                        setError('');
                      }}
                      placeholder="CVC"
                      className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink shadow-brutal-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 pb-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="brutal-press w-full py-3 px-4 rounded-xl border-[2.5px] border-black bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-black" />
                        <span>{verifyStep || 'Processing payment...'}</span>
                      </>
                    ) : (
                      <span>Authorize &amp; Upgrade to Pro</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Payment Success Confirmation & Auto Forwarding */
          <div className="py-5 text-center animate-scale-in space-y-3">
            <div className="w-14 h-14 rounded-2xl border-[3px] border-black bg-mint text-black flex items-center justify-center mx-auto shadow-brutal">
              <CheckCircle2 size={32} className="stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-yellow px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs">
              <Sparkles size={10} />
              PAYMENT AUTO-VERIFIED
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
              Pro Tier Activated!
            </h3>
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              Your payment for <strong className="text-black dark:text-white">{itemName}</strong> is verified.
            </p>

            <div className="inline-block px-3 py-1 rounded-xl border-2 border-black bg-neutral-100 dark:bg-neutral-800 font-mono text-xs font-black text-black dark:text-white shadow-brutal-xs">
              Ref: {orderSessionId}
            </div>

            <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <Check size={13} className="stroke-[3]" />
              <span>Redirecting to your Creator Dashboard...</span>
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={downloadReceipt}
                className="brutal-press py-2.5 px-3 rounded-xl border-2 border-black bg-white dark:bg-[#1a1a28] text-black dark:text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 shadow-brutal-sm hover:bg-yellow hover:text-black transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span>Receipt</span>
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="brutal-press py-2.5 px-3 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black flex items-center justify-center gap-1.5 shadow-brutal-sm hover:bg-pink/90 transition-all cursor-pointer"
              >
                <span>Dashboard</span>
                <ArrowRight size={13} className="stroke-[3]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
