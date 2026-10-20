import JSZip from 'jszip';

interface ExportTemplateParams {
  siteTitle: string;
  templateId: string;
  theme: {
    primaryColor: string;
    bgColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  heroContent: {
    badge: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  featuresContent: Array<{ title: string; desc: string }>;
  testimonialsContent: Array<{ quote: string; name: string; role: string }>;
  ctaContent: { title: string; desc: string; buttonText: string };
  sectionOrder?: string[];
  assetUrl?: string;
  sectionNames?: Record<string, string>;
  logoUrl?: string;
  faviconUrl?: string;
  pages?: string[];
}

function safeCodeString(val: string): string {
  if (!val) return '';
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/<\/(script|style)>/gi, '<\\/$1>');
}

function escapeJsxText(val: string): string {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

export async function exportTemplateAsZip({
  siteTitle,
  templateId,
  theme,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
  sectionOrder = ['hero', 'features', 'testimonials', 'cta'],
  assetUrl = '',
  sectionNames = {},
  logoUrl = '',
  faviconUrl = '',
  pages = [],
}: ExportTemplateParams): Promise<Blob> {
  const zip = new JSZip();
  const folderName = siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'launchly-site';
  const root = zip.folder(folderName) || zip;
  let productImagePath = '';
  if (assetUrl.startsWith('data:image/')) {
    const match = assetUrl.match(/^data:image\/(png|jpe?g|webp|gif);base64,(.+)$/i);
    if (match) {
      const extension = match[1].toLowerCase().replace('jpeg', 'jpg');
      productImagePath = `product-image.${extension}`;
      root.file(`public/${productImagePath}`, match[2], { base64: true });
    }
  } else if (/^https?:\/\//i.test(assetUrl)) {
    productImagePath = assetUrl;
  }
  const saveDataImage = (dataUrl: string, fallback: string) => {
    const match = dataUrl.match(/^data:image\/(png|jpe?g|webp|gif|svg\+xml|x-icon|vnd\.microsoft\.icon);base64,(.+)$/i);
    if (!match) return '';
    const extension = match[1].toLowerCase().replace('jpeg', 'jpg').replace('svg+xml', 'svg').replace('x-icon', 'ico').replace('vnd.microsoft.icon', 'ico');
    root.file(`public/${fallback}.${extension}`, match[2], { base64: true });
    return `/${fallback}.${extension}`;
  };
  const logoPath = logoUrl.startsWith('data:image/') ? saveDataImage(logoUrl, 'site-logo') : logoUrl;
  const faviconPath = faviconUrl.startsWith('data:image/') ? saveDataImage(faviconUrl, 'favicon') : faviconUrl;

  // 1. package.json
  const packageJson = {
    name: folderName,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'eslint',
    },
    dependencies: {
      next: '^16.4.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^1.54.0',
    },
    devDependencies: {
      '@tailwindcss/postcss': '^4.0.0',
      typescript: '^5.7.0',
      eslint: '^9.0.0',
      'eslint-config-next': '^16.4.0',
      '@types/node': '^22.0.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      tailwindcss: '^4.0.0',
      postcss: '^8.5.0',
    },
  };
  root.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: { '@/*': ['./src/*'] },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  root.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));

  // 3. README.md
  const readme = `# ${siteTitle}

Exported from [Launchly](https://launchly.site) (Template: ${templateId}) — Production-ready Next.js 16 App Router website.
Configured sections: ${sectionOrder.join(', ')}.

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
pnpm install
# or
bun install
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
`;
  root.file('README.md', readme);

  // 4. app/globals.css
  const globalsCss = `@import "tailwindcss";

:root {
  --primary: ${theme.primaryColor};
  --bg: ${theme.bgColor};
  --text: ${theme.textColor};
  --radius: ${theme.borderRadius};
}

body {
  background-color: var(--bg);
  color: var(--text);
  font-family: ${theme.fontFamily};
  margin: 0;
  padding: 0;
}
`;
  root.file('src/app/globals.css', globalsCss);
  root.file('postcss.config.mjs', `export default { plugins: { '@tailwindcss/postcss': {} } };\n`);

  // 5. app/layout.tsx
  const layoutTsx = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '${safeCodeString(siteTitle)}',
  description: '${safeCodeString(heroContent.description)}',
  icons: ${faviconPath ? `{ icon: '${safeCodeString(faviconPath)}' }` : '{}'},
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
  root.file('src/app/layout.tsx', layoutTsx);

  // 6. app/page.tsx. Render only the sections in the editor, in the same order.
  const sectionMarkup: Record<string, string> = {
    nav: `<nav className="flex items-center justify-between px-6 py-5 border-b border-black/10"><a href="/" className="flex items-center gap-2 font-black text-lg">${logoPath ? `<img src="${safeCodeString(logoPath)}" alt="" className="h-9 w-9 object-contain" />` : ''}${escapeJsxText(siteTitle)}</a><div className="flex gap-5 text-sm"><a href="#collection">Collection</a><a href="#features">Details</a><a href="#contact">Contact</a>${pages.filter((page) => !/^home$/i.test(page)).map((page) => { const slug = page.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); return `<a href="/${slug}">${escapeJsxText(page)}</a>`; }).join('')}</div><div className="flex items-center gap-3"><span className="text-sm font-bold">Bag ({cartCount})</span><a href="#collection" className="rounded-lg px-4 py-2 font-bold text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }}>Shop now</a></div></nav>`,
    hero: `<section className="py-20 px-6 max-w-5xl mx-auto text-center"><span className="inline-block px-3 py-1 text-xs font-mono font-bold uppercase rounded-full mb-4 border" style={{ borderColor: '${safeCodeString(theme.primaryColor)}', color: '${safeCodeString(theme.primaryColor)}' }}>${escapeJsxText(heroContent.badge)}</span><h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">${escapeJsxText(heroContent.title)}</h1><p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">${escapeJsxText(heroContent.description)}</p><div className="flex items-center justify-center gap-4"><a href="#collection" className="px-6 py-3 rounded-xl font-bold shadow-md text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}', borderRadius: '${safeCodeString(theme.borderRadius)}' }}>${escapeJsxText(heroContent.ctaPrimary)}</a><a href="#features" className="px-6 py-3 rounded-xl font-bold border opacity-80">${escapeJsxText(heroContent.ctaSecondary)}</a></div></section>`,
    gallery: `<section id="collection" className="py-16 px-6 max-w-5xl mx-auto"><p className="text-center text-xs uppercase tracking-widest mb-2" style={{ color: '${safeCodeString(theme.primaryColor)}' }}>Curated for you</p><h2 className="text-3xl font-black mb-8 text-center">${escapeJsxText(sectionNames.gallery || 'Featured pieces')}</h2><div className="grid sm:grid-cols-3 gap-5">${['Everyday Essential', 'Signature Piece', 'The New Classic'].map((name, i) => `<article className="rounded-2xl border border-black/10 bg-white overflow-hidden"><div className="h-40 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, ${safeCodeString(theme.primaryColor)}40, ${safeCodeString(theme.primaryColor)}10)' }}>${productImagePath ? `<img src="${safeCodeString(productImagePath.startsWith('http') ? productImagePath : `/${productImagePath}`)}" alt="${name}" className="w-full h-full object-cover" />` : `<span className="text-4xl font-black">0${i + 1}</span>`}</div><div className="p-4"><h3 className="font-bold">${name}</h3><p className="text-xs opacity-70 mt-1">Thoughtfully made for everyday use.</p><div className="mt-4 flex justify-between"><span className="font-black">$${[68, 124, 92][i]}.00</span><button onClick={() => setCartCount((count) => count + 1)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }}>Add to bag</button></div></div></article>`).join('')}</div></section>`,
    features: `<section id="features" className="py-16 px-6 max-w-5xl mx-auto border-t border-black/10"><h2 className="text-2xl font-black mb-8 text-center">${escapeJsxText(sectionNames.features || 'Made for the details')}</h2><div className="grid md:grid-cols-3 gap-6">${featuresContent.map((f) => `<article className="p-6 rounded-2xl border border-black/10 bg-white" style={{ borderRadius: '${safeCodeString(theme.borderRadius)}' }}><h3 className="text-lg font-bold mb-2">${escapeJsxText(f.title)}</h3><p className="text-sm opacity-70">${escapeJsxText(f.desc)}</p></article>`).join('')}</div></section>`,
    testimonials: `<section className="py-16 px-6 max-w-5xl mx-auto border-t border-black/10"><h2 className="text-2xl font-black mb-8 text-center">${escapeJsxText(sectionNames.testimonials || 'Kind words from our customers')}</h2><div className="grid md:grid-cols-2 gap-6">${testimonialsContent.map((t) => `<blockquote className="p-6 rounded-2xl border border-black/10 bg-white" style={{ borderRadius: '${safeCodeString(theme.borderRadius)}' }}><p className="text-sm italic mb-4">“${escapeJsxText(t.quote)}”</p><footer><strong className="text-sm">${escapeJsxText(t.name)}</strong><p className="text-xs opacity-60">${escapeJsxText(t.role)}</p></footer></blockquote>`).join('')}</div></section>`,
    cta: `<section id="contact" className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-black/10"><h2 className="text-3xl font-black mb-4">${escapeJsxText(ctaContent.title)}</h2><p className="opacity-80 mb-6">${escapeJsxText(ctaContent.desc)}</p><a href="mailto:hello@example.com" className="inline-block px-8 py-3.5 rounded-xl font-bold shadow-lg text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}', borderRadius: '${safeCodeString(theme.borderRadius)}' }}>${escapeJsxText(ctaContent.buttonText)}</a></section>`,
    footer: `<footer className="border-t border-black/10 px-6 py-8 text-center text-sm opacity-70">© ${new Date().getFullYear()} ${escapeJsxText(siteTitle)} · All rights reserved.</footer>`,
    pricing: `<section className="py-16 px-6 max-w-5xl mx-auto"><h2 className="text-3xl font-black mb-8 text-center">${escapeJsxText(sectionNames.pricing || 'Shop the collection')}</h2><div className="grid md:grid-cols-3 gap-5">${['Everyday Essential', 'Signature Piece', 'The New Classic'].map((name, i) => `<article className="rounded-2xl border border-black/10 bg-white p-6"><h3 className="font-bold">${name}</h3><p className="my-4 text-2xl font-black">$${[68, 124, 92][i]}.00</p><button className="rounded-lg px-4 py-2 font-bold text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }}>Add to bag</button></article>`).join('')}</div></section>`,
    contact: `<section id="contact" className="py-16 px-6 text-center"><h2 className="text-3xl font-black mb-3">${escapeJsxText(sectionNames.contact || 'Get in touch')}</h2><p className="opacity-70">Questions about an order? Email us at hello@example.com.</p></section>`,
  };
  const orderedSections = sectionOrder
    .map((id) => id.startsWith('section-') ? id.split('-')[1] : id)
    .map((type) => sectionMarkup[type])
    .filter(Boolean)
    .join('\n');
  const pageTsx = `'use client';
import { useState } from 'react';

export default function Page() {
  const [cartCount, setCartCount] = useState(0);
  return (
    <main className="min-h-screen" style={{ backgroundColor: '${safeCodeString(theme.bgColor)}', color: '${safeCodeString(theme.textColor)}', fontFamily: '${safeCodeString(theme.fontFamily)}' }}>
      ${orderedSections}
    </main>
  );
}
`;
  root.file('src/app/page.tsx', pageTsx);
  for (const pageName of pages.filter((page) => !/^home$/i.test(page))) {
    const slug = pageName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) continue;
    const safePageName = escapeJsxText(pageName);
    const pageComponent = `'use client';
import { useState } from 'react';

const products = ['Everyday Essential', 'Signature Piece', 'The New Classic'];

export default function TemplatePage() {
  const [cartCount, setCartCount] = useState(0);
  const [message, setMessage] = useState('');
  const isCheckout = '${slug}' === 'checkout';
  const isAccount = '${slug}' === 'account';
  const isCart = '${slug}' === 'cart';
  const isAbout = '${slug}' === 'about';

  return (
    <main className="min-h-screen bg-[${safeCodeString(theme.bgColor)}] text-[${safeCodeString(theme.textColor)}]" style={{ fontFamily: '${safeCodeString(theme.fontFamily)}' }}>
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4 text-black">
        <a href="/" className="font-bold">${escapeJsxText(siteTitle)}</a>
        <nav className="flex flex-wrap gap-4 text-sm"><a href="/">Home</a>${pages.filter((page) => !/^home$/i.test(page)).map((page) => { const pageSlug = page.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); return `<a href="/${pageSlug}">${escapeJsxText(page)}</a>`; }).join('')}</nav>
        <a href="/cart" className="text-sm font-bold">Bag ({cartCount})</a>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '${safeCodeString(theme.primaryColor)}' }}>${escapeJsxText(templateId)}</p>
        <h1 className="mt-2 text-4xl font-black">${safePageName}</h1>
        <p className="mt-3 max-w-2xl opacity-75">${safePageName} at ${escapeJsxText(siteTitle)}. Explore considered details, thoughtful materials, and pieces made to be part of your everyday.</p>
        {isAbout ? <article className="mt-10 rounded-2xl bg-white p-8 text-black"><h2 className="text-2xl font-black">Made with intention</h2><p className="mt-3 leading-relaxed">${escapeJsxText(heroContent.description)} We believe great design should feel personal, last beyond a season, and make the everyday more meaningful.</p></article> : isCheckout || isAccount ? <form className="mt-10 grid max-w-xl gap-4 rounded-2xl bg-white p-6 text-black" onSubmit={(event) => { event.preventDefault(); setMessage(isCheckout ? 'Your order details are ready.' : 'Your account request has been received.'); }}><h2 className="text-xl font-black">{isCheckout ? 'Delivery details' : 'Your account'}</h2><input required aria-label="Email address" type="email" placeholder="Email address" className="rounded-lg border border-black/20 px-4 py-3" />{isCheckout && <><input required aria-label="Full name" placeholder="Full name" className="rounded-lg border border-black/20 px-4 py-3" /><input required aria-label="Shipping address" placeholder="Shipping address" className="rounded-lg border border-black/20 px-4 py-3" /></>}<button className="rounded-lg px-5 py-3 font-bold text-black" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }}>{isCheckout ? 'Continue to payment' : 'Continue'}</button>{message && <p role="status">{message}</p>}</form> : isCart ? <div className="mt-10 rounded-2xl bg-white p-8 text-black"><h2 className="text-xl font-black">Your shopping bag</h2><p className="mt-3">{cartCount ? cartCount + ' item(s) in your bag.' : 'Your bag is ready for something special.'}</p><div className="mt-5 flex gap-3"><a className="rounded-lg border px-4 py-2" href="/shop">Continue shopping</a><a className="rounded-lg px-4 py-2 font-bold" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }} href="/checkout">Checkout</a></div></div> : <div className="mt-10 grid gap-5 sm:grid-cols-3">{products.map((product, index) => <article key={product} className="overflow-hidden rounded-2xl border border-black/10 bg-white text-black"><div className="flex h-40 items-center justify-center text-4xl font-black" style={{ background: 'linear-gradient(135deg, ${safeCodeString(theme.primaryColor)}55, ${safeCodeString(theme.primaryColor)}15)' }}>0{index + 1}</div><div className="p-5"><h2 className="font-bold">{product}</h2><p className="mt-1 text-sm opacity-70">Premium materials, made with care.</p><div className="mt-4 flex items-center justify-between"><strong>\${[68, 124, 92][index]}.00</strong><button type="button" onClick={() => { setCartCount((count) => count + 1); setMessage(product + ' added to your bag.'); }} className="rounded-lg px-3 py-2 text-xs font-bold" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}' }}>Add to bag</button></div></div></article>)}</div>}
        {message && !isCheckout && !isAccount && !isCart && <p role="status" className="mt-4 text-sm">{message}</p>}
      </section>
      <footer className="border-t border-black/10 bg-white px-6 py-6 text-center text-sm text-black">© ${new Date().getFullYear()} ${escapeJsxText(siteTitle)} · <a href="/">Back to home</a></footer>
    </main>
  );
}
`;
    root.file(`src/app/${slug}/page.tsx`, pageComponent);
  }

  return await zip.generateAsync({ type: 'blob' });
}
