import Navbar from '@/components/Navbar';
import MarqueeTicker from '@/components/MarqueeTicker';
import Hero from '@/components/Hero';
import LiveWorkspaceSection from '@/components/LiveWorkspaceSection';
import HowItWorks from '@/components/HowItWorks';
import TemplatesSection from '@/components/TemplatesSection';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <MarqueeTicker />
        <Hero />
        <LiveWorkspaceSection />
        <HowItWorks />
        <TemplatesSection />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
