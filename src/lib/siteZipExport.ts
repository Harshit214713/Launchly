import JSZip from 'jszip';
import type { SiteDocument } from '@/lib/siteDocument';

export async function exportSiteDocumentZip(document: SiteDocument): Promise<Blob> {
  const zip = new JSZip();
  const folderName = document.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'launchly-site';
  const root = zip.folder(folderName) || zip;
  const data = structuredClone(document);
  let imageIndex = 0;
  const localize = (value: unknown): unknown => {
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      const match = value.match(/^data:image\/(png|jpe?g|webp|gif|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,(.+)$/i);
      if (!match) return '';
      const extension = match[1].toLowerCase().replace('jpeg', 'jpg').replace('svg+xml', 'svg').replace('x-icon', 'ico').replace('vnd.microsoft.icon', 'ico');
      const path = `/assets/media-${++imageIndex}.${extension}`;
      root.file(`public${path}`, match[2], { base64: true });
      return path;
    }
    if (Array.isArray(value)) return value.map(localize);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, localize(child)]));
    return value;
  };
  const siteData = localize(data) as SiteDocument;
  root.file('src/site-data.json', JSON.stringify(siteData, null, 2));
  root.file('package.json', JSON.stringify({ name: folderName, version: '1.0.0', private: true, scripts: { dev: 'next dev', build: 'next build', start: 'next start' }, dependencies: { next: '^16.4.0', react: '^19.0.0', 'react-dom': '^19.0.0' }, devDependencies: { '@tailwindcss/turbopack': '^4.0.0', tailwindcss: '^4.0.0', typescript: '^5.7.0', '@types/node': '^22.0.0', '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0' } }, null, 2));
  root.file('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2017', lib: ['dom', 'dom.iterable', 'esnext'], strict: true, noEmit: true, esModuleInterop: true, module: 'esnext', moduleResolution: 'bundler', resolveJsonModule: true, isolatedModules: true, jsx: 'preserve', plugins: [{ name: 'next' }], paths: { '@/*': ['./src/*'] } }, include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'], exclude: ['node_modules'] }, null, 2));
  root.file('next-env.d.ts', '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n');
  root.file('next.config.ts', `import type { NextConfig } from 'next';\nconst config: NextConfig = { turbopack: { rules: { '*.css': { loaders: ['@tailwindcss/turbopack'], as: '*.css' } } } };\nexport default config;\n`);
  root.file('src/app/globals.css', `@import "tailwindcss";\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; }\nbody { margin: 0; background: ${siteData.theme.bgColor}; color: ${siteData.theme.textColor}; font-family: ${siteData.theme.fontFamily}; }\na { color: inherit; }\n`);

  root.file('src/components/SiteRenderer.tsx', `'use client';
import { useState } from 'react';
import Link from 'next/link';
import siteJson from '@/site-data.json';
type Section = { id: string; type: string; name: string; content: Record<string, unknown>; style: { backgroundColor?: string; accentColor?: string; borderRadius?: string; textAlign?: 'left'|'center'|'right' }; hidden: { desktop: boolean }; anchorId?: string };
type Page = { id: string; slug: string; title: string; isHome: boolean; seo: { title: string; description: string; noindex: boolean }; sections: Section[] };
type Site = { name: string; theme: { primaryColor: string; bgColor: string; surfaceColor: string; textColor: string; fontFamily: string; radius: string }; menu: Array<{ id: string; label: string; newTab: boolean; target: { type: 'page'|'url'|'anchor'; value: string } }>; pages: Page[]; assets: Array<{ role: string; src: string; alt: string }> };
const site = siteJson as Site;
const getText = (value: unknown, fallback = '') => typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
export default function SiteRenderer({ pageId }: { pageId: string }) {
  const page = site.pages.find((entry) => entry.id === pageId) || site.pages[0];
  const [cart, setCart] = useState(0);
  if (!page) return <main className="p-12 text-center">Page not found</main>;
  const menuHref = (item: Site['menu'][number]) => item.target.type === 'url' ? item.target.value : item.target.type === 'anchor' ? '#' + item.target.value.replace(/^#/, '') : site.pages.find((entry) => entry.id === item.target.value)?.slug || '/';
  return <main className="min-h-screen" style={{ backgroundColor: site.theme.bgColor, color: site.theme.textColor, fontFamily: site.theme.fontFamily }}>
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-white/95 px-5 py-4 text-black"><Link href="/" className="flex items-center gap-2 font-black">{site.assets.find((asset) => asset.role === 'logo')?.src && <img src={site.assets.find((asset) => asset.role === 'logo')?.src} alt="" className="h-8 w-8 object-contain"/>}{site.name}</Link><nav className="flex flex-wrap gap-4 text-sm font-semibold">{site.menu.map((item) => <a key={item.id} href={menuHref(item)} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>)}</nav><Link href="/cart" className="text-sm font-bold">Bag ({cart})</Link></header>
    <div className="mx-auto max-w-6xl px-4 py-10"><p className="text-xs font-bold uppercase tracking-widest" style={{ color: site.theme.primaryColor }}>{site.name}</p><h1 className="mt-2 text-4xl font-black sm:text-6xl">{page.title}</h1>{page.seo.description && <p className="mt-4 max-w-3xl text-lg opacity-75">{page.seo.description}</p>}
      {page.sections.filter((section) => !['nav', 'footer'].includes(section.type) && !section.hidden.desktop).map((section) => { const content = section.content || {}; const items = Array.isArray(content.items) ? content.items as Array<Record<string, unknown>> : []; const heading = getText(content.heading, getText(content.title, section.name)); const description = getText(content.description, getText(content.desc)); return <section key={section.id} id={section.anchorId || section.id} className="my-8 rounded-2xl px-5 py-12 sm:px-10" style={{ backgroundColor: section.style.backgroundColor || site.theme.surfaceColor, borderRadius: section.style.borderRadius || site.theme.radius, textAlign: section.style.textAlign || 'left' }}><h2 className="text-2xl font-black sm:text-4xl">{heading}</h2>{description && <p className="mt-3 max-w-3xl leading-relaxed opacity-75">{description}</p>}{section.type === 'hero' && <div className="mt-6 flex flex-wrap gap-3"><a href={getText(content.ctaPrimaryLink, '#')} className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: site.theme.primaryColor }}>{getText(content.ctaPrimary, 'Get started')}</a>{getText(content.ctaSecondary) && <a href={getText(content.ctaSecondaryLink, '#')} className="rounded-lg border px-5 py-3 font-bold">{getText(content.ctaSecondary)}</a>}</div>}{section.type === 'rich-text' && <p className="mt-5 whitespace-pre-wrap leading-relaxed">{getText(content.body, description)}</p>}{items.length > 0 && <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className="rounded-xl border border-black/10 bg-white/70 p-5">{typeof item.src === 'string' && <img src={item.src} alt={getText(item.alt)} className="mb-4 aspect-[4/3] w-full rounded-lg object-cover"/>}<h3 className="font-bold">{getText(item.title, getText(item.name, getText(item.question, 'Item ' + (index + 1))))}</h3>{getText(item.description, getText(item.desc, getText(item.answer))) && <p className="mt-2 text-sm leading-relaxed opacity-75">{getText(item.description, getText(item.desc, getText(item.answer)))}</p>}{getText(item.quote) && <blockquote className="mt-3 italic">“{getText(item.quote)}”</blockquote>}{getText(item.price) && <p className="mt-4 font-black">{getText(item.price)}</p>}<button type="button" onClick={() => setCart((count) => count + 1)} className="mt-4 rounded-lg px-4 py-2 text-sm font-bold text-black" style={{ backgroundColor: site.theme.primaryColor }}>Add to bag</button></article>)}</div>}{section.type === 'faq' && items.map((item, index) => <details key={index} className="border-b py-4"><summary className="cursor-pointer font-bold">{getText(item.question)}</summary><p className="mt-2 opacity-75">{getText(item.answer)}</p></details>)}{section.type === 'contact' && <form action="mailto:" method="get" className="mt-6 grid max-w-xl gap-3"><input required name="subject" placeholder="Your name" className="rounded border px-3 py-2"/><input required type="email" name="email" placeholder="Email address" className="rounded border px-3 py-2"/><textarea required name="body" placeholder="Message" rows={5} className="rounded border px-3 py-2"/><button className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: site.theme.primaryColor }}>{getText(content.submitLabel, 'Send message')}</button></form>}</section>; })}
    </div><footer className="border-t border-black/10 px-5 py-8 text-center text-sm opacity-70">© {new Date().getFullYear()} {site.name}</footer></main>;
}
`);
  const home = siteData.pages.find((page) => page.isHome) || siteData.pages[0];
  for (const page of siteData.pages) {
    if (page.slug === '/404') continue;
    const route = page.isHome ? '' : page.slug.split('/').filter(Boolean).join('/');
    const pageFile = `import SiteRenderer from '@/components/SiteRenderer';\nimport site from '@/site-data.json';\nconst page = site.pages.find((entry) => entry.id === ${JSON.stringify(page.id)})!;\nexport const metadata = { title: page.seo.title || page.title, description: page.seo.description, robots: page.seo.noindex ? { index: false, follow: false } : undefined };\nexport default function Page() { return <SiteRenderer pageId=${JSON.stringify(page.id)} />; }\n`;
    root.file(`src/app/${route ? `${route}/` : ''}page.tsx`, pageFile);
  }
  root.file('src/app/layout.tsx', `import type { Metadata } from 'next';\nimport type { ReactNode } from 'react';\nimport './globals.css';\nimport site from '@/site-data.json';\nexport const metadata: Metadata = { title: site.name, description: site.pages.find((page) => page.isHome)?.seo.description || '', icons: ${siteData.assets.find((asset) => asset.role === 'favicon')?.src ? `{ icon: ${JSON.stringify(siteData.assets.find((asset) => asset.role === 'favicon')?.src)} }` : '{}'} };\nexport default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n`);
  root.file('src/app/not-found.tsx', `import SiteRenderer from '@/components/SiteRenderer';\nimport site from '@/site-data.json';\nexport default function NotFound() { const page = site.pages.find((entry) => entry.slug === '/404'); return page ? <SiteRenderer pageId={page.id} /> : <main className="p-12 text-center"><h1 className="text-4xl font-black">Page not found</h1><a href="/">Return home</a></main>; }\n`);
  root.file('src/app/sitemap.ts', `import type { MetadataRoute } from 'next';\nimport site from '@/site-data.json';\nexport default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'; return site.pages.filter((page) => !page.seo.noindex && page.slug !== '/404').map((page) => ({ url: base + (page.isHome ? '' : page.slug), lastModified: new Date() })); }\n`);
  root.file('src/app/robots.ts', `import type { MetadataRoute } from 'next';\nexport default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/' }, sitemap: (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com') + '/sitemap.xml' }; }\n`);
  root.file('README.md', `# ${document.name}\n\nMulti-page Next.js website exported from Launchly.\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`);
  if (!home) root.file('src/app/page.tsx', 'export default function Home() { return <main>Welcome</main>; }\n');
  return zip.generateAsync({ type: 'blob' });
}
