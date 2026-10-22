'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import TemplateCard from './TemplateCard';
import { TEMPLATES } from '@/lib/templates';
import type { Template } from '@/types';

export default function TemplatesSection() {
  const router = useRouter();
  const customize = (template: Template) => router.push(`/editor/${template.id}`);
  return (
    <section id="templates" className="scroll-mt-20 bg-background px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-pink">Ecommerce starters</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-ink sm:text-5xl">Find your starting point.</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Two complete storefronts, ready for your brand and products.</p>
          </div>
          <Link href="/templates" className="inline-flex items-center gap-2 font-display text-sm font-black text-ink hover:text-pink">
            View both templates <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {TEMPLATES.map((template) => <TemplateCard key={template.id} template={template} onCustomize={customize}/>)}
        </div>
      </div>
    </section>
  );
}
