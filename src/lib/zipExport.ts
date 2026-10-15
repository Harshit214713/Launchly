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

export async function exportTemplateAsZip({
  siteTitle,
  templateId,
  theme,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
  sectionOrder = ['hero', 'features', 'testimonials', 'cta'],
}: ExportTemplateParams): Promise<Blob> {
  const zip = new JSZip();
  const folderName = siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'launchly-site';
  const root = zip.folder(folderName) || zip;

  // 1. package.json
  const packageJson = {
    name: folderName,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '^15.2.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^1.54.0',
    },
    devDependencies: {
      typescript: '^5.7.0',
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

Exported from [Launchly](https://launchly.site) (Template: ${templateId}) — Production-ready Next.js 15 App Router website.
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

  // 5. app/layout.tsx
  const layoutTsx = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${safeCodeString(siteTitle)}',
  description: '${safeCodeString(heroContent.description)}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
  root.file('src/app/layout.tsx', layoutTsx);

  // 6. app/page.tsx
  const pageTsx = `'use client';

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <span className="inline-block px-3 py-1 text-xs font-mono font-bold uppercase rounded-full mb-4 border" style={{ borderColor: '${safeCodeString(theme.primaryColor)}', color: '${safeCodeString(theme.primaryColor)}' }}>
          ${safeCodeString(heroContent.badge)}
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
          ${safeCodeString(heroContent.title)}
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
          ${safeCodeString(heroContent.description)}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-xl font-bold transition-all shadow-md" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}', color: '#000000', borderRadius: '${safeCodeString(theme.borderRadius)}' }}>
            ${safeCodeString(heroContent.ctaPrimary)}
          </button>
          <button className="px-6 py-3 rounded-xl font-bold border opacity-80 hover:opacity-100 transition-all" style={{ borderRadius: '${safeCodeString(theme.borderRadius)}' }}>
            ${safeCodeString(heroContent.ctaSecondary)}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
        <h2 className="text-2xl font-black mb-8 text-center uppercase tracking-wider">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          ${featuresContent
            .map(
              (f) => `
          <div className="p-6 rounded-2xl border border-white/10" style={{ borderRadius: '${safeCodeString(theme.borderRadius)}' }}>
            <h3 className="text-lg font-bold mb-2">${safeCodeString(f.title)}</h3>
            <p className="text-sm opacity-70">${safeCodeString(f.desc)}</p>
          </div>`
            )
            .join('\n')}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-2 gap-6">
          ${testimonialsContent
            .map(
              (t) => `
          <div className="p-6 rounded-2xl border border-white/10" style={{ borderRadius: '${safeCodeString(theme.borderRadius)}' }}>
            <p className="text-sm italic mb-4">"${safeCodeString(t.quote)}"</p>
            <div>
              <h4 className="font-bold text-sm">${safeCodeString(t.name)}</h4>
              <p className="text-xs opacity-60">${safeCodeString(t.role)}</p>
            </div>
          </div>`
            )
            .join('\n')}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-white/10">
        <h2 className="text-3xl font-black mb-4">${safeCodeString(ctaContent.title)}</h2>
        <p className="opacity-80 mb-6">${safeCodeString(ctaContent.desc)}</p>
        <button className="px-8 py-3.5 rounded-xl font-bold shadow-lg" style={{ backgroundColor: '${safeCodeString(theme.primaryColor)}', color: '#000000', borderRadius: '${safeCodeString(theme.borderRadius)}' }}>
          ${safeCodeString(ctaContent.buttonText)}
        </button>
      </section>
    </main>
  );
}
`;
  root.file('src/app/page.tsx', pageTsx);

  return await zip.generateAsync({ type: 'blob' });
}
