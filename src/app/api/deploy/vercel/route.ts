import { NextRequest, NextResponse } from 'next/server';
import { generateProjectFiles, ProjectTemplateParams } from '@/lib/projectFiles';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      vercelToken,
      repoUrl,
      projectName,
      siteData,
    }: {
      vercelToken?: string;
      repoUrl?: string;
      projectName?: string;
      siteData?: ProjectTemplateParams;
    } = body;

    const cleanProjectName = (projectName || siteData?.siteTitle || 'launchly-site')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/^-+|-+$/g, '');

    // 1. Direct API Deploy if Vercel Token is supplied
    if (vercelToken && vercelToken.trim()) {
      // Verify token
      const userRes = await fetch('https://api.vercel.com/v2/user', {
        headers: {
          Authorization: `Bearer ${vercelToken.trim()}`,
        },
      });

      if (!userRes.ok) {
        return NextResponse.json(
          { error: 'Invalid Vercel API token. Please generate a valid token in your Vercel Account Settings.' },
          { status: 401 }
        );
      }

      // Generate files
      const files = generateProjectFiles(siteData || {
        siteTitle: cleanProjectName,
        templateId: 'lumina-saas',
        theme: { primaryColor: '#FF5588', bgColor: '#0F0F11', textColor: '#FFFFFF', fontFamily: 'Inter', borderRadius: '16px' },
        heroContent: { title: cleanProjectName, description: 'Powered by Launchly Studio', ctaPrimary: 'Explore', ctaSecondary: 'Contact' },
        featuresContent: [{ title: 'Speed', desc: 'Edge SSR' }],
        testimonialsContent: [],
        ctaContent: { title: 'Launch Today', desc: 'Zero lock-in', buttonText: 'Get Started' },
      });

      const vercelFiles = Object.entries(files).map(([file, data]) => ({
        file,
        data,
      }));

      // Deploy to Vercel API v13
      const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${vercelToken.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanProjectName,
          files: vercelFiles,
          projectSettings: {
            framework: 'nextjs',
          },
        }),
      });

      if (!deployRes.ok) {
        const err = await deployRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: err.error?.message || 'Vercel API deployment failed.' },
          { status: deployRes.status }
        );
      }

      const deployData = await deployRes.json();
      return NextResponse.json({
        success: true,
        directDeploy: true,
        deploymentUrl: `https://${deployData.url}`,
        inspectorUrl: deployData.inspectorUrl,
        readyState: deployData.readyState,
        message: 'Project successfully dispatched to Vercel edge deployment pipeline!',
      });
    }

    // 2. Standard 1-Click Vercel Deploy URL (Zero token required)
    const targetRepo = repoUrl || 'https://github.com/simplyvardaan/Launchly';
    const oneClickUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(targetRepo)}&project-name=${encodeURIComponent(cleanProjectName)}`;

    return NextResponse.json({
      success: true,
      directDeploy: false,
      oneClickUrl,
      message: 'Generated official 1-Click Vercel deployment link.',
    });
  } catch (error: unknown) {
    console.error('Vercel Deploy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error while deploying to Vercel.' },
      { status: 500 }
    );
  }
}
