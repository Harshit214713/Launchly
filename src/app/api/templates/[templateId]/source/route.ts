import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getTemplateById } from '@/lib/templates';
import { verifySessionToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);

  if (!template) {
    return NextResponse.json(
      { success: false, message: 'Template not found' },
      { status: 404 }
    );
  }

  // Paywall enforcement: Pro templates require active Pro subscription
  if (template.isPro) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('launchly_session');
    const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null;

    if (!session || session.plan !== 'pro') {
      return NextResponse.json(
        {
          success: false,
          isPro: true,
          message: `"${template.name}" is a Pro template. Please upgrade to Launchly Pro to access the production source code.`,
          upgradeUrl: `/checkout?plan=pro&templateId=${template.id}`
        },
        { status: 403 }
      );
    }
  }

  // Generates source code package metadata and files
  const projectArchive = {
    name: `${template.id}-launchly-project`,
    templateName: template.name,
    framework: 'Next.js 15 (App Router)',
    styling: 'Tailwind CSS v4',
    language: 'TypeScript',
    license: 'Commercial & Personal Royalty-Free',
    rating: template.rating,
    features: template.features,
    pages: template.pages,
    manifest: {
      'package.json': JSON.stringify({
        name: template.id,
        version: '1.0.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint'
        },
        dependencies: {
          next: '^15.0.0',
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'lucide-react': '^1.54.0',
          clsx: '^2.1.1',
          'tailwind-merge': '^3.0.0'
        },
        devDependencies: {
          typescript: '^5.0.0',
          '@types/node': '^20.0.0',
          '@types/react': '^19.0.0',
          tailwindcss: '^4.0.0'
        }
      }, null, 2),
      'src/app/page.tsx': `// ${template.name} - Built with Launchly Studio\nimport React from 'react';\n\nexport default function Home() {\n  return (\n    <main className="min-h-screen" style={{ backgroundColor: '${template.bgColor}', color: '${template.textColor}' }}>\n      <nav className="p-6 flex justify-between items-center border-b border-white/10">\n        <div className="font-bold text-xl">${template.name}</div>\n        <button className="px-4 py-2 rounded-full font-bold" style={{ backgroundColor: '${template.accent}', color: '#171717' }}>Get Started</button>\n      </nav>\n      <section className="py-24 text-center max-w-4xl mx-auto px-6">\n        <h1 className="text-6xl font-black mb-6">${template.description}</h1>\n      </section>\n    </main>\n  );\n}`,
      'README.md': `# ${template.name}\n\nExported from Launchly Studio.\n\n## Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\nOpen [http://localhost:3000](http://localhost:3000) in your browser.`
    }
  };

  return NextResponse.json({
    success: true,
    template,
    downloadUrl: `/api/templates/${template.id}/source/download`,
    project: projectArchive,
    message: `Source code package for "${template.name}" generated successfully.`
  });
}
