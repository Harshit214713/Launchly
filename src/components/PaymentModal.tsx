'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  ExternalLink,
  Smartphone
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
  price = '$19',
  planId = 'pro',
  billingCycle = 'monthly',
  onPaymentComplete,
}: PaymentModalProps) {
  const router = useRouter();
  const [txnId, setTxnId] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [upiLink, setUpiLink] = useState<string>('');

  // Calculate prefilled UPI amount based on selected plan
  const getAmountDetails = () => {
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

  // Generate dynamic QR code encoding the exact amount in UPI protocol
  useEffect(() => {
    if (!isOpen) return;

    const payeeVpa = '7428938113@ptaxis';
    const payeeName = 'VARDAAN SAXENA';
    const note = `Launchly ${itemName} (${billingCycle})`;
    
    // Standard UPI URI with prefilled amount
    const upiUri = `upi://pay?pa=${payeeVpa}&pn=${encodeURIComponent(payeeName)}&am=${amountInfo.inr}.00&cu=INR&tn=${encodeURIComponent(note)}`;
    setUpiLink(upiUri);

    QRCode.toDataURL(upiUri, {
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
  }, [isOpen, itemName, billingCycle, amountInfo.inr]);

  if (!isOpen) return null;

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanTxn = txnId.trim();
    if (!cleanTxn) {
      setError('Please enter your 12-digit UPI UTR or Reference Number.');
      return;
    }

    if (cleanTxn.length < 8) {
      setError('Reference number is too short. Please provide a valid UTR.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txnId: cleanTxn,
          userEmail: payerEmail || 'customer@launchly.site',
          planId,
          itemName,
          amount: amountInfo.inr.toString(),
          billingCycle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Verification failed. Check your UTR.');
      }

      // Store purchase status locally
      if (typeof window !== 'undefined') {
        localStorage.setItem('launchly_plan', planId);
        localStorage.setItem('launchly_payment_txn', cleanTxn);
        localStorage.setItem('launchly_pro_active', 'true');
      }

      setSuccess(true);
      if (onPaymentComplete) {
        onPaymentComplete(cleanTxn);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to verify payment. Please double-check your UTR.');
    } finally {
      setSubmitting(false);
    }
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
        className="w-full max-w-[420px] max-h-[94vh] flex flex-col bg-card border-[3.5px] border-black dark:border-[#222232] rounded-3xl p-4 sm:p-5 shadow-brutal-xl text-ink relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-black/10 dark:border-[#222232] shrink-0">
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
                  AUTO-FILLED AMOUNT
                </span>
                <span className="font-display text-sm sm:text-base font-black text-black dark:text-white">
                  {amountInfo.label}
                </span>
              </div>
            </div>

            {/* Neo-Brutalist Clean QR Code Box */}
            <div className="p-3.5 rounded-2xl border-2 border-black dark:border-[#262638] bg-white dark:bg-[#12121c] flex flex-col items-center justify-center shadow-brutal-sm text-center">
              <div className="w-38 h-38 sm:w-42 sm:h-42 rounded-xl border-2 border-black bg-white p-2 flex items-center justify-center shadow-inner">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Loader2 size={24} className="animate-spin text-pink" />
                  </div>
                )}
              </div>

              {/* Supported UPI Providers List */}
              <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap font-mono text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
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
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border-2 border-black bg-yellow text-black font-mono text-[10px] font-bold shadow-brutal-xs hover:bg-pink transition-colors"
                >
                  <Smartphone size={11} className="stroke-[2.5]" />
                  <span>Tap to open in UPI App</span>
                  <ExternalLink size={10} />
                </a>
              )}
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyPayment} className="space-y-2.5 pt-0.5">
              {error && (
                <div className="p-2 rounded-lg border-2 border-black bg-red-100 dark:bg-red-950/60 text-[11px] font-mono font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 shadow-brutal-xs">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                  12-Digit UTR / Transaction Reference ID <span className="text-pink">*</span>
                </label>
                <input
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="e.g. 428190348123 (from UPI receipt)"
                  required
                  className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow shadow-brutal-xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-black uppercase tracking-wider text-black dark:text-white mb-1">
                  Your Email (for Pro access & receipt)
                </label>
                <input
                  type="email"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3 py-2 rounded-xl border-2 border-black dark:border-[#262638] bg-background font-mono text-xs font-bold text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow shadow-brutal-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="brutal-press w-full py-2.5 px-4 rounded-xl border-[2.5px] border-black bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-black" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="stroke-[2.5]" />
                    <span>Verify & Activate Pro</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Payment Success Confirmation */
          <div className="py-5 text-center animate-scale-in space-y-3">
            <div className="w-14 h-14 rounded-2xl border-[3px] border-black bg-mint text-black flex items-center justify-center mx-auto shadow-brutal">
              <CheckCircle2 size={32} className="stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-yellow px-2.5 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-brutal-xs">
              <Sparkles size={10} />
              PAYMENT VERIFIED
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
              Pro Tier Activated!
            </h3>
            <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
              Your payment for <strong className="text-black dark:text-white">{itemName}</strong> is verified.
            </p>

            <div className="inline-block px-3 py-1 rounded-xl border-2 border-black bg-neutral-100 dark:bg-neutral-800 font-mono text-xs font-black text-black dark:text-white shadow-brutal-xs">
              Ref: {txnId}
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="brutal-press w-full mt-3 py-2.5 px-4 rounded-xl border-[2.5px] border-black bg-pink text-black font-display text-xs sm:text-sm font-black uppercase tracking-wider shadow-brutal hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Studio Dashboard</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
