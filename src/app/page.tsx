import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import TemplatesSection from '@/components/TemplatesSection';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <main className="flex-1 overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <TemplatesSection />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
