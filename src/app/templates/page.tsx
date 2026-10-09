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
    <main>
      <Navbar />
      <div className="pt-16">
        <TemplatesPageContent />
      </div>
      <Footer />
    </main>
  );
}
