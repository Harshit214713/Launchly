import { NextRequest, NextResponse } from 'next/server';
import { generateProjectFiles, ProjectTemplateParams } from '@/lib/projectFiles';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      githubToken,
      repoName,
      description = 'Crafted and launched via Launchly Studio',
      isPrivate = false,
      siteData,
    }: {
      githubToken: string;
      repoName: string;
      description?: string;
      isPrivate?: boolean;
      siteData: ProjectTemplateParams;
    } = body;

    if (!githubToken || !githubToken.trim()) {
      return NextResponse.json(
        { error: 'GitHub Personal Access Token is required. Generate one at github.com/settings/tokens with "repo" scope.' },
        { status: 400 }
      );
    }

    const cleanRepoName = (repoName || siteData?.siteTitle || 'launchly-site')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!cleanRepoName) {
      return NextResponse.json(
        { error: 'A valid repository name is required.' },
        { status: 400 }
      );
    }

    // 1. Verify User Authentication with GitHub API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken.trim()}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Launchly-Studio',
      },
    });

    if (!userRes.ok) {
      const errData = await userRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.message || 'Invalid GitHub token. Ensure your token has "repo" permissions.' },
        { status: 401 }
      );
    }

    const userData = await userRes.json();
    const owner = userData.login;

    // 2. Create the Repository (or check if it exists)
    let repoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Launchly-Studio',
      },
      body: JSON.stringify({
        name: cleanRepoName,
        description: description || `${siteData?.siteTitle || 'Website'} — Built with Launchly`,
        private: Boolean(isPrivate),
        auto_init: true,
      }),
    });

    let repoData;
    if (repoRes.status === 422) {
      // Repository might already exist, fetch its details
      const existingRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}`, {
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'Launchly-Studio',
        },
      });
      if (existingRes.ok) {
        repoData = await existingRes.json();
      } else {
        const err = await repoRes.json().catch(() => ({}));
        return NextResponse.json(
          { error: err.message || 'Repository creation failed on GitHub.' },
          { status: 422 }
        );
      }
    } else if (!repoRes.ok) {
      const err = await repoRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || 'Failed to create GitHub repository.' },
        { status: repoRes.status }
      );
    } else {
      repoData = await repoRes.json();
    }

    // 3. Generate Project Files
    const files = generateProjectFiles(siteData || {
      siteTitle: cleanRepoName,
      templateId: 'lumina-saas',
      theme: { primaryColor: '#FF5588', bgColor: '#0F0F11', textColor: '#FFFFFF', fontFamily: 'Inter', borderRadius: '16px' },
      heroContent: { title: cleanRepoName, description: 'Powered by Launchly Studio', ctaPrimary: 'Explore', ctaSecondary: 'Contact' },
      featuresContent: [{ title: 'Speed', desc: 'Edge SSR' }],
      testimonialsContent: [],
      ctaContent: { title: 'Launch Today', desc: 'Zero lock-in', buttonText: 'Get Started' },
    });

    // 4. Commit files to Repository using Git Trees API or sequential Contents API
    // Let's get the latest commit SHA and base tree
    let defaultBranch = repoData.default_branch || 'main';
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/ref/heads/${defaultBranch}`, {
      headers: {
        Authorization: `Bearer ${githubToken.trim()}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Launchly-Studio',
      },
    });

    if (refRes.ok) {
      const refData = await refRes.json();
      const latestCommitSha = refData.object.sha;

      // Create Blobs for each file in parallel
      const fileEntries = Object.entries(files);
      const treeItems = await Promise.all(
        fileEntries.map(async ([path, content]) => {
          const blobRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/blobs`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${githubToken.trim()}`,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
              'User-Agent': 'Launchly-Studio',
            },
            body: JSON.stringify({
              content: content,
              encoding: 'utf-8',
            }),
          });
          const blobData = await blobRes.json();
          return {
            path,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
          };
        })
      );

      // Create Tree
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/trees`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Launchly-Studio',
        },
        body: JSON.stringify({
          tree: treeItems,
        }),
      });
      const treeData = await treeRes.json();

      // Create Commit
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/commits`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Launchly-Studio',
        },
        body: JSON.stringify({
          message: 'feat: initialize Next.js 15 app architecture via Launchly Studio',
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      });
      const commitData = await commitRes.json();

      // Update Ref (Branch Head)
      await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/git/refs/heads/${defaultBranch}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Launchly-Studio',
        },
        body: JSON.stringify({
          sha: commitData.sha,
          force: true,
        }),
      });
    } else {
      // Fallback: Commit README via contents API
      await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/contents/README.md`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Launchly-Studio',
        },
        body: JSON.stringify({
          message: 'Initial commit from Launchly',
          content: Buffer.from(files['README.md']).toString('base64'),
        }),
      });
    }

    const repoUrl = `https://github.com/${owner}/${cleanRepoName}`;
    const vercelDeployUrl = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repoUrl)}&project-name=${encodeURIComponent(cleanRepoName)}`;

    return NextResponse.json({
      success: true,
      owner,
      repo: cleanRepoName,
      repoUrl,
      cloneUrl: `https://github.com/${owner}/${cleanRepoName}.git`,
      vercelDeployUrl,
      message: `Repository ${owner}/${cleanRepoName} successfully initialized on GitHub!`,
    });
  } catch (error: any) {
    console.error('GitHub Deploy Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while deploying to GitHub.' },
      { status: 500 }
    );
  }
}
