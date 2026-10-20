'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Key,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectTemplateParams } from '@/lib/projectFiles';

function GithubIcon({ className = 'w-4 h-4 fill-current' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: ProjectTemplateParams;
}

export default function DeployModal({ isOpen, onClose, siteData }: DeployModalProps) {
  const [activeTab, setActiveTab] = useState<'github' | 'vercel'>('github');

  // GitHub State
  const [repoName, setRepoName] = useState(
    (siteData.siteTitle || 'my-launchly-site').toLowerCase().replace(/[^a-z0-9-_]/g, '-')
  );
  const [isPrivate, setIsPrivate] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [rememberToken, setRememberToken] = useState(true);
  const [deployingGithub, setDeployingGithub] = useState(false);
  const [githubStep, setGithubStep] = useState<string>('');
  const [githubError, setGithubError] = useState<string>('');
  const [githubResult, setGithubResult] = useState<{
    repoUrl: string;
    cloneUrl: string;
    vercelDeployUrl: string;
    owner: string;
    repo: string;
  } | null>(null);

  // Vercel Direct Deploy State
  const [vercelToken, setVercelToken] = useState('');
  const [deployingVercel, setDeployingVercel] = useState(false);
  const [vercelError, setVercelError] = useState<string>('');
  const [vercelResult, setVercelResult] = useState<{
    deploymentUrl: string;
    inspectorUrl?: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  // Load stored tokens on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedGithub = localStorage.getItem('launchly_github_token');
      if (storedGithub) setGithubToken(storedGithub);

      const storedVercel = localStorage.getItem('launchly_vercel_token');
      if (storedVercel) setVercelToken(storedVercel);
    }
  }, []);

  if (!isOpen) return null;

  const handleDeployGithub = async (e: React.FormEvent) => {
    e.preventDefault();
    setGithubError('');
    setGithubResult(null);

    if (!githubToken.trim()) {
      setGithubError('Please enter your GitHub Personal Access Token.');
      return;
    }

    if (rememberToken && typeof window !== 'undefined') {
      localStorage.setItem('launchly_github_token', githubToken.trim());
    }

    setDeployingGithub(true);
    setGithubStep('Authenticating GitHub account…');

    try {
      const res = await fetch('/api/deploy/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken: githubToken.trim(),
          repoName,
          isPrivate,
          siteData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Deployment to GitHub failed.');
      }

      setGithubStep('Repository initialized with Next.js 15 App Router!');
      setGithubResult({
        repoUrl: data.repoUrl,
        cloneUrl: data.cloneUrl,
        vercelDeployUrl: data.vercelDeployUrl,
        owner: data.owner,
        repo: data.repo,
      });
    } catch (err: any) {
      setGithubError(err.message || 'An unexpected error occurred during GitHub deployment.');
    } finally {
      setDeployingGithub(false);
    }
  };

  const handleDeployVercelDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setVercelError('');
    setVercelResult(null);

    if (!vercelToken.trim()) {
      setVercelError('Please enter your Vercel API Token.');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('launchly_vercel_token', vercelToken.trim());
    }

    setDeployingVercel(true);
    try {
      const res = await fetch('/api/deploy/vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vercelToken: vercelToken.trim(),
          projectName: repoName,
          siteData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Direct Vercel deployment failed.');
      }

      setVercelResult({
        deploymentUrl: data.deploymentUrl,
        inspectorUrl: data.inspectorUrl,
      });
    } catch (err: any) {
      setVercelError(err.message || 'Failed to deploy to Vercel.');
    } finally {
      setDeployingVercel(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl border-[3.5px] border-black bg-card text-ink shadow-[8px_8px_0px_#000] p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black/15">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl border-2 border-black bg-yellow text-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
              <Globe size={18} className="stroke-[2.5]" />
            </span>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl text-ink">
                One-Click Production Deploy
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground">
                Push full Next.js 15 repository directly to GitHub & Vercel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="brutal-press h-8 w-8 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 text-black flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mt-5 p-1 rounded-2xl border-2 border-black bg-background font-mono text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-yellow text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-muted-foreground hover:text-ink'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vercel')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'bg-pink text-black border-2 border-black shadow-[2px_2px_0px_#000]'
                : 'text-muted-foreground hover:text-ink'
            }`}
          >
            <svg viewBox="0 0 1155 1000" className="w-3.5 h-3.5 fill-current">
              <path d="m577.3 0 577.4 1000H0z" />
            </svg>
            <span>Vercel Edge Deploy</span>
          </button>
        </div>

        {/* TAB 1: GITHUB */}
        {activeTab === 'github' && (
          <div className="mt-5 space-y-4">
            {!githubResult ? (
              <form onSubmit={handleDeployGithub} className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] font-black uppercase text-ink mb-1">
                    Repository Name
                  </label>
                  <div className="flex items-center rounded-xl border-2 border-black bg-background shadow-[2px_2px_0px_#000] overflow-hidden">
                    <span className="px-3 py-2 font-mono text-xs text-muted-foreground bg-neutral-100 dark:bg-neutral-800 border-r-2 border-black shrink-0">
                      github.com/you/
                    </span>
                    <input
                      type="text"
                      required
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                      className="w-full px-3 py-2 font-mono text-xs font-bold text-ink bg-transparent focus:outline-none"
                      placeholder="my-launchly-site"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border-2 border-black bg-background shadow-[2px_2px_0px_#000]">
                  <div>
                    <span className="font-display font-black text-xs text-ink block">
                      Repository Visibility
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {isPrivate ? 'Private (only you can view code)' : 'Public (visible to everyone)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`px-3 py-1 rounded-lg border-2 border-black font-mono text-xs font-black transition-colors cursor-pointer ${
                      isPrivate ? 'bg-pink text-black' : 'bg-mint text-black'
                    }`}
                  >
                    {isPrivate ? '🔒 Private' : '🌍 Public'}
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-mono text-[11px] font-black uppercase text-ink">
                      GitHub Personal Access Token
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Launchly%20One-Click%20Deploy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] text-pink font-black underline flex items-center gap-1"
                    >
                      <span>Create Token (10s)</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl border-2 border-black bg-background font-mono text-xs font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-[2px_2px_0px_#000]"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground mt-1 block">
                    Requires classic token with <code className="font-bold text-ink">repo</code> scope or fine-grained token with Contents read/write.
                  </span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px] text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={rememberToken}
                    onChange={(e) => setRememberToken(e.target.checked)}
                    className="rounded border-2 border-black accent-pink w-4 h-4"
                  />
                  <span>Save token securely in browser for instant 1-click deploys</span>
                </label>

                {githubError && (
                  <div className="p-3 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{githubError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={deployingGithub}
                  className="brutal-press w-full py-3 px-4 rounded-xl border-[2.5px] border-black bg-yellow text-black font-display text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:bg-yellow/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {deployingGithub ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-black" />
                      <span>{githubStep || 'Initializing Repository…'}</span>
                    </>
                  ) : (
                    <>
                      <GithubIcon className="w-4 h-4" />
                      <span>Create &amp; Push to GitHub</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Screen */
              <div className="space-y-4 py-2 animate-scale-in">
                <div className="p-4 rounded-2xl border-2 border-black bg-mint text-black shadow-[3px_3px_0px_#000] flex items-start gap-3">
                  <CheckCircle2 size={24} className="stroke-[2.5] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-black text-sm uppercase">
                      Repository Successfully Published!
                    </h3>
                    <p className="font-mono text-xs mt-0.5">
                      Your full Next.js 15 App Router source code is live on GitHub.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-black bg-background font-mono text-xs shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-ink">{githubResult.repoUrl}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(githubResult.repoUrl)}
                      className="p-1.5 rounded-lg border border-black bg-white hover:bg-neutral-100 text-black cursor-pointer shadow-xs"
                      title="Copy Repo Link"
                    >
                      {copiedLink ? <Check size={14} className="text-mint stroke-[3]" /> : <Copy size={14} />}
                    </button>
                    <a
                      href={githubResult.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-black bg-black text-white hover:bg-neutral-800 cursor-pointer shadow-xs"
                    >
                      <span>Open</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* 1-Click Vercel Deploy Prompt */}
                <div className="p-4 rounded-2xl border-[2.5px] border-black bg-[#FAF9F6] dark:bg-[#141522] shadow-[3px_3px_0px_#000] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink border border-black" />
                    <span className="font-display font-black text-xs uppercase tracking-wider text-ink">
                      Next Step: Launch on Vercel Edge
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    Connect this repository to Vercel with zero configuration for global CDN hosting and automated SSL.
                  </p>
                  <a
                    href={githubResult.vercelDeployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-press w-full py-2.5 px-4 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_#000] hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg viewBox="0 0 1155 1000" className="w-3.5 h-3.5 fill-current">
                      <path d="m577.3 0 577.4 1000H0z" />
                    </svg>
                    <span>Deploy to Vercel in 1-Click</span>
                    <ArrowRight size={14} />
                  </a>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setGithubResult(null)}
                    className="font-mono text-xs text-muted-foreground hover:text-ink underline cursor-pointer"
                  >
                    Deploy another repository
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VERCEL */}
        {activeTab === 'vercel' && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl border-2 border-black bg-background font-mono text-xs space-y-2 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-2 text-ink font-bold">
                <ShieldCheck size={16} className="text-mint shrink-0" />
                <span>Zero-Config Vercel Edge Deployment</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Deploy directly using your Vercel API token or click the 1-Click Clone URL button to launch in your personal Vercel team.
              </p>
            </div>

            {!vercelResult ? (
              <form onSubmit={handleDeployVercelDirect} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-mono text-[11px] font-black uppercase text-ink">
                      Vercel Personal API Token (Optional)
                    </label>
                    <a
                      href="https://vercel.com/account/tokens"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] text-pink font-black underline flex items-center gap-1"
                    >
                      <span>Get Vercel Token</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                  <input
                    type="password"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                    placeholder="Paste your Vercel Token for direct API deploy…"
                    className="w-full px-3 py-2 rounded-xl border-2 border-black bg-background font-mono text-xs font-bold text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-pink shadow-[2px_2px_0px_#000]"
                  />
                </div>

                {vercelError && (
                  <div className="p-3 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{vercelError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={deployingVercel || !vercelToken.trim()}
                    className="brutal-press py-3 px-4 rounded-xl border-2 border-black bg-pink text-black font-display text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_#000] hover:bg-pink/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {deployingVercel ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-black" />
                        <span>Deploying to Edge…</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 1155 1000" className="w-3.5 h-3.5 fill-current">
                          <path d="m577.3 0 577.4 1000H0z" />
                        </svg>
                        <span>Direct API Deploy</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://vercel.com/new/clone?repository-url=${encodeURIComponent(
                      githubResult?.repoUrl || 'https://github.com/simplyvardaan/Launchly'
                    )}&project-name=${encodeURIComponent(repoName)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="brutal-press py-3 px-4 rounded-xl border-2 border-black bg-yellow text-black font-display text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_#000] hover:bg-yellow/90 transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <span>1-Click Deploy URL</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </form>
            ) : (
              /* Vercel Direct Deploy Result */
              <div className="space-y-4 py-2 animate-scale-in">
                <div className="p-4 rounded-2xl border-2 border-black bg-mint text-black shadow-[3px_3px_0px_#000] flex items-start gap-3">
                  <CheckCircle2 size={24} className="stroke-[2.5] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display font-black text-sm uppercase">
                      Live on Vercel Global Edge!
                    </h3>
                    <p className="font-mono text-xs mt-0.5">
                      Your production build has been queued and dispatched.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border-2 border-black bg-background font-mono text-xs shadow-[2px_2px_0px_#000] flex items-center justify-between gap-2">
                  <span className="truncate font-bold text-ink">{vercelResult.deploymentUrl}</span>
                  <a
                    href={vercelResult.deploymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black bg-pink text-black font-display font-black uppercase text-xs cursor-pointer shadow-xs"
                  >
                    <span>Visit Live</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {vercelResult.inspectorUrl && (
                  <a
                    href={vercelResult.inspectorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center font-mono text-xs text-muted-foreground hover:text-ink underline"
                  >
                    View build logs on Vercel Dashboard →
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
