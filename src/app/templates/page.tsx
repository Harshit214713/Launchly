import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplatesPageContent from './TemplatesPageContent';

export const metadata: Metadata = {
  title: 'Templates — Launchly',
  description: 'Browse 50+ professionally designed website templates. Filter by category and customize to match your brand.',
};

export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-500">Loading catalog...</div>}>
          <TemplatesPageContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
