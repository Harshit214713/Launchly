import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TemplatesPageContent from './TemplatesPageContent';

export const metadata: Metadata = {
  title: 'Ecommerce Templates — Launchly',
  description: 'Choose a complete ecommerce storefront and customize it in the Launchly visual editor.',
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
