'use client';

import { useState, use, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Globe,
  Layers, Type, Image as ImageIcon, Palette, Settings,
  Plus, Trash2, ChevronRight, Eye, X,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Check, Loader2, Wand2, ArrowUpRight, Star,
  SlidersHorizontal, Layout, Download, ZoomIn, ZoomOut,
  ArrowUp, ArrowDown, Share2
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { exportTemplateAsZip } from '@/lib/zipExport';
import { getContrastRatio, getWcagLevel, suggestAccessibleColor } from '@/lib/contrast';
import DeployModal from '@/components/DeployModal';
import SocialShareModal from '@/components/SocialShareModal';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type LeftPanel = 'sections' | 'ai' | 'styles' | 'elements' | 'pages' | 'assets';
type MobileTab = 'canvas' | 'sections' | 'styles' | 'inspector';

const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface Section {
  id: string;
  name: string;
  type: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'nav', name: 'Navigation', type: 'nav' },
  { id: 'hero', name: 'Hero', type: 'hero' },
  { id: 'features', name: 'Features', type: 'features' },
  { id: 'testimonials', name: 'Testimonials', type: 'testimonials' },
  { id: 'cta', name: 'Call to Action', type: 'cta' },
  { id: 'footer', name: 'Footer', type: 'footer' },
];

export default function EditorPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('sections');
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [selectedSection, setSelectedSection] = useState<string | null>('hero');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [exportingZip, setExportingZip] = useState(false);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiStep, setAiStep] = useState('');

  // Design tokens & content state
  const [theme, setTheme] = useState({
    primaryColor: template.accent || '#FF5588',
    bgColor: template.bgColor || '#0F0F11',
    textColor: template.textColor || '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '16px',
  });
  const [siteTitle, setSiteTitle] = useState(template.name || 'My Website');

  // Bespoke content state (can be updated via AI)
  const [heroContent, setHeroContent] = useState({
    badge: `${template.category} // ${template.badge || 'PRO'}`,
    title: template.name,
    description: template.description,
    ctaPrimary: 'Launch Experience',
    ctaSecondary: 'Documentation',
    stat1Label: 'RUNTIME VELOCITY',
    stat1Value: '4.2M Tokens/s',
    stat2Label: 'ZERO-SHOT BENCHMARK',
    stat2Value: '99.98% SLA',
  });

  const [featuresContent, setFeaturesContent] = useState([
    { title: 'Deterministic Edge', desc: 'Global sub-millisecond propagation with zero cold starts across 300+ edge nodes.' },
    { title: 'Neural Reasoning', desc: 'Integrated multi-agent execution pipeline with instant structured telemetry.' },
    { title: 'Zero Friction', desc: 'Production-ready Next.js 15 App Router architecture with full TypeScript safety.' },
  ]);

  const [testimonialsContent, setTestimonialsContent] = useState([
    { quote: 'Shipped our client flagship in less than 3 hours. The aesthetic level is completely unmatched.', name: 'Tanisha M.', role: 'Lead Product Designer' },
    { quote: 'The cleanest Next.js export in the industry. Saved our startup weeks of frontend scaffolding.', name: 'Divyam J.', role: 'Founding Engineer' }
  ]);

  const [ctaContent, setCtaContent] = useState({
    title: 'Start building today.',
    desc: 'Export full production Next.js source code anytime. Zero lock-in.',
    buttonText: 'Claim Workspace →',
  });

  // Undo / Redo State Stack
  interface Snapshot {
    theme: typeof theme;
    siteTitle: string;
    heroContent: typeof heroContent;
    featuresContent: typeof featuresContent;
    testimonialsContent: typeof testimonialsContent;
    ctaContent: typeof ctaContent;
    sections: typeof sections;
  }

  const [history] = useState<Snapshot[]>(() => [{
    theme: {
      primaryColor: template.accent || '#FF5588',
      bgColor: template.bgColor || '#0F0F11',
      textColor: template.textColor || '#FFFFFF',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '16px',
    },
    siteTitle: template.name || 'My Website',
    heroContent: {
      badge: `${template.category} // ${template.badge || 'PRO'}`,
      title: template.name,
      description: template.description,
      ctaPrimary: 'Launch Experience',
      ctaSecondary: 'Documentation',
      stat1Label: 'RUNTIME VELOCITY',
      stat1Value: '4.2M Tokens/s',
      stat2Label: 'ZERO-SHOT BENCHMARK',
      stat2Value: '99.98% SLA',
    },
    featuresContent: [
      { title: 'Deterministic Edge', desc: 'Global sub-millisecond propagation with zero cold starts across 300+ edge nodes.' },
      { title: 'Neural Reasoning', desc: 'Integrated multi-agent execution pipeline with instant structured telemetry.' },
      { title: 'Zero Friction', desc: 'Production-ready Next.js 15 App Router architecture with full TypeScript safety.' },
    ],
    testimonialsContent: [
      { quote: 'Shipped our client flagship in less than 3 hours. The aesthetic level is completely unmatched.', name: 'Tanisha M.', role: 'Lead Product Designer' },
      { quote: 'The cleanest Next.js export in the industry. Saved our startup weeks of frontend scaffolding.', name: 'Divyam J.', role: 'Founding Engineer' }
    ],
    ctaContent: {
      title: 'Start building today.',
      desc: 'Export full production Next.js source code anytime. Zero lock-in.',
      buttonText: 'Claim Workspace →',
    },
    sections,
  }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setTheme(prev.theme);
      setSiteTitle(prev.siteTitle);
      setHeroContent(prev.heroContent);
      setFeaturesContent(prev.featuresContent);
      setTestimonialsContent(prev.testimonialsContent);
      setCtaContent(prev.ctaContent);
      setSections(prev.sections);
      setHistoryIndex(historyIndex - 1);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setTheme(next.theme);
      setSiteTitle(next.siteTitle);
      setHeroContent(next.heroContent);
      setFeaturesContent(next.featuresContent);
      setTestimonialsContent(next.testimonialsContent);
      setCtaContent(next.ctaContent);
      setSections(next.sections);
      setHistoryIndex(historyIndex + 1);
    }
  }, [historyIndex, history]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Section Reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setSections(reordered);
  };

  // 1-Click ZIP Export
  const handleExportZip = async () => {
    setExportingZip(true);
    try {
      const blob = await exportTemplateAsZip({
        siteTitle,
        templateId: template.id,
        theme,
        heroContent,
        featuresContent,
        testimonialsContent,
        ctaContent,
        sectionOrder: sections.map((s) => s.id),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${siteTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'launchly-site'}-nextjs.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('ZIP Export Error:', err);
    } finally {
      setExportingZip(false);
    }
  };

  // Floating Inline Formatting Toolbar State
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setToolbarPos(null);
        return;
      }
      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && rect.width > 0 && rect.height > 0) {
          const canvasEl = document.querySelector('[data-canvas-frame]');
          if (canvasEl && canvasEl.contains(range.commonAncestorContainer)) {
            setToolbarPos({
              x: Math.max(10, rect.left + rect.width / 2 - 110),
              y: Math.max(10, rect.top - 46),
            });
            return;
          }
        }
      } catch {}
      setToolbarPos(null);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        siteName: siteTitle,
        templateId: template.id,
        theme,
        heroContent,
        featuresContent,
        testimonialsContent,
        ctaContent,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`launchly_site_${template.id}`, JSON.stringify(payload));
        localStorage.setItem(`launchly_site_${siteTitle.toLowerCase().replace(/\s+/g, '-')}`, JSON.stringify(payload));
      }
    } catch {}
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAiGenerate = async (promptToUse?: string) => {
    const prompt = (promptToUse || aiPrompt).trim();
    if (!prompt) return;

    setAiGenerating(true);
    setAiStep('Analyzing aesthetic direction...');

    try {
      setTimeout(() => setAiStep('Synthesizing color palette & typography tokens...'), 500);
      setTimeout(() => setAiStep('Drafting high-converting copy & telemetry...'), 1100);

      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, templateId: template.id }),
      });
      const data = await res.json();

      if (data.success && data.design) {
        const d = data.design;
        setSiteTitle(d.siteTitle);
        setTheme({
          primaryColor: d.theme.primaryColor,
          bgColor: d.theme.bgColor,
          textColor: d.theme.textColor,
          fontFamily: d.theme.fontFamily,
          borderRadius: d.theme.borderRadius,
        });
        setHeroContent(d.hero);
        if (d.features?.length) setFeaturesContent(d.features);
        if (d.testimonials?.length) setTestimonialsContent(d.testimonials);
        if (d.cta) setCtaContent(d.cta);
      }
    } catch {
      // Graceful fallback
    } finally {
      setAiStep('Applying design to canvas...');
      setTimeout(() => {
        setAiGenerating(false);
        setAiStep('');
        setShowAiModal(false);
      }, 600);
    }
  };

  const addSection = (type: string) => {
    const sectionIndex = sections.length + 1;
    const newSection: Section = {
      id: `section-${type}-${sectionIndex}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
    };
    setSections(prev => [...prev, newSection]);
    setSelectedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedSection === id) setSelectedSection(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAF9F6] text-[#0F0F11] overflow-hidden">
      {/* Neo-brutalist Top Toolbar - Fully Responsive */}
      <header className="h-14 sm:h-16 bg-white border-b-[3px] border-black flex items-center justify-between px-2.5 sm:px-5 z-50 shrink-0 shadow-[0_2px_0_#000]">
        {/* Left: Logo, Site Name */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link href="/dashboard" className="flex items-center gap-1.5 group shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:scale-105 transition-transform">
              <NextImage
                src="/brand-logo-clean.png"
                alt="Launchly Emblem"
                width={26}
                height={26}
                className="w-full h-full object-contain p-0.5 rounded-lg"
              />
            </div>
          </Link>

          {/* Site Name Pill */}
          <div className="flex items-center gap-1 rounded-xl border-2 border-black bg-[#FAF9F6] px-2 py-1 shadow-[1.5px_1.5px_0px_#000] max-w-[120px] sm:max-w-[200px]">
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="font-mono text-xs sm:text-sm font-bold text-black bg-transparent border-none outline-none w-full focus:ring-0 truncate"
              title="Click to rename website"
            />
          </div>

          {/* AI Designer Button */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border-2 border-black bg-yellow hover:bg-yellow/90 font-mono text-[11px] sm:text-xs font-black text-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0"
          >
            <Wand2 size={13} className="stroke-[2.5]" />
            <span className="hidden xs:inline">AI</span>
            <span className="hidden sm:inline">Designer</span>
          </button>

          {/* Undo / Redo Buttons */}
          <div className="hidden sm:flex items-center gap-1 rounded-xl border-2 border-black bg-[#FAF9F6] p-0.5 shadow-[1.5px_1.5px_0px_#000]">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 rounded-lg text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={13} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Center: Device Switcher & Zoom Controls (Desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-2xl border-2 border-black bg-[#FFFDF8] p-1 shadow-[2px_2px_0px_#000]">
            {([
              { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
              { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                className={cn(
                  'px-2.5 py-1 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                  deviceMode === mode
                    ? 'bg-yellow text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000]'
                    : 'text-neutral-500 hover:text-black border-2 border-transparent'
                )}
                title={label}
              >
                <Icon size={14} className="stroke-[2.5]" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="hidden xl:flex items-center gap-1 rounded-xl border-2 border-black bg-[#FFFDF8] px-2 py-1 shadow-[1.5px_1.5px_0px_#000] font-mono text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(1))))}
              className="p-0.5 hover:bg-neutral-200 rounded cursor-pointer text-black"
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="min-w-[34px] text-center text-black">{Math.round(zoomScale * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(1))))}
              className="p-0.5 hover:bg-neutral-200 rounded cursor-pointer text-black"
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
            {zoomScale !== 1 && (
              <button
                type="button"
                onClick={() => setZoomScale(1)}
                className="text-[9px] text-pink font-black uppercase cursor-pointer ml-1"
                title="Reset zoom"
              >
                100%
              </button>
            )}
          </div>
        </div>

        {/* Right: Save, Export ZIP, Deploy, Share & Publish */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-mint font-mono text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            title="Preview live OpenGraph social card & share"
          >
            <Share2 size={13} className="stroke-[2.5]" />
            <span>Share &amp; OG</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeployModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-yellow font-mono text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            title="One-click deploy repository to GitHub and Vercel"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Deploy</span>
          </button>

          <button
            type="button"
            onClick={handleExportZip}
            disabled={exportingZip}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-yellow hover:bg-yellow/90 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
            title="Download Next.js 15 source code as a ZIP archive"
          >
            {exportingZip ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} className="stroke-[2.5]" />}
            <span>{exportingZip ? 'Exporting…' : 'Export .zip'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const subdomain = siteTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || template.id;
              const payload = {
                siteName: siteTitle,
                templateId: template.id,
                theme,
                heroContent,
                featuresContent,
                testimonialsContent,
                ctaContent,
              };
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem(`launchly_site_${template.id}`, JSON.stringify(payload));
                  localStorage.setItem(`launchly_site_${subdomain}`, JSON.stringify(payload));
                } catch {}
                window.open(`/live/${subdomain}`, '_blank');
              }
            }}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-white hover:bg-yellow font-mono text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer"
            title="Preview live site"
          >
            <Eye size={13} className="stroke-[2.5]" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border-2 border-black font-mono text-xs font-bold transition-all cursor-pointer shadow-[2px_2px_0px_#000]',
              saved ? 'bg-mint text-black' : 'bg-white hover:bg-mint text-black'
            )}
            title="Save changes"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} className="stroke-[3]" /> : <Save size={13} className="stroke-[2.5]" />}
            <span className="hidden sm:inline">{saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={() => setShowPublishDialog(true)}
            className="inline-flex items-center gap-1 px-3 sm:px-5 py-1 sm:py-1.5 rounded-xl border-2 border-black bg-pink hover:bg-pink/90 font-display text-xs sm:text-sm font-black text-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <Globe size={13} className="stroke-[2.5]" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Leftmost Tool Icon Rail (Hidden on mobile < md) */}
        <div className="hidden md:flex w-14 bg-white border-r-[3px] border-black flex-col items-center py-4 gap-2 z-40 shrink-0">
          {([
            { id: 'sections', icon: Layers, label: 'Sections' },
            { id: 'ai', icon: Wand2, label: 'AI Generator' },
            { id: 'styles', icon: Palette, label: 'Styles' },
            { id: 'elements', icon: Type, label: 'Elements' },
            { id: 'pages', icon: ChevronRight, label: 'Pages' },
            { id: 'assets', icon: ImageIcon, label: 'Assets' },
          ] as { id: LeftPanel; icon: typeof Layers; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                if (id === 'ai') setShowAiModal(true);
                else setLeftPanel(id);
              }}
              title={label}
              className={cn(
                'w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer',
                leftPanel === id
                  ? 'bg-yellow text-black border-black shadow-[2px_2px_0px_#000]'
                  : 'bg-transparent text-neutral-400 hover:text-black border-transparent hover:border-black/20'
              )}
            >
              <Icon size={17} className="stroke-[2.5]" />
            </button>
          ))}
          <div className="flex-1" />
          <button
            title="Studio Settings"
            className="w-10 h-10 rounded-xl border-2 border-transparent hover:border-black/20 flex items-center justify-center text-neutral-400 hover:text-black transition-all cursor-pointer"
          >
            <Settings size={17} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Left Sub-Drawer: Desktop persistent / Mobile full-screen when active */}
        <div
          className={cn(
            'bg-[#FAF9F6] border-r-[3px] border-black flex flex-col z-30 shrink-0 overflow-hidden transition-all',
            'w-60 hidden md:flex', // Desktop default
            // Mobile full screen overlay when tab selected
            mobileTab === 'sections' && '!flex fixed inset-x-0 top-14 bottom-14 w-full z-40 bg-white',
            mobileTab === 'styles' && '!flex fixed inset-x-0 top-14 bottom-14 w-full z-40 bg-white'
          )}
        >
          <div className="p-3.5 border-b-[2px] border-black bg-white flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase text-black tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink" />
              <span>{mobileTab !== 'canvas' ? mobileTab : leftPanel}</span>
            </div>
            {/* Close button on mobile */}
            <button
              onClick={() => setMobileTab('canvas')}
              className="md:hidden px-2 py-0.5 rounded-lg border border-black bg-yellow font-mono text-[10px] font-bold text-black"
            >
              Done ✕
            </button>
            <span className="hidden md:inline font-mono text-[10px] text-neutral-400">
              {sections.length} blocks
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {(leftPanel === 'sections' || mobileTab === 'sections') && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  {sections.map((section, idx) => (
                    <div
                      key={section.id}
                      onClick={() => {
                        setSelectedSection(section.id);
                        if (mobileTab === 'sections') setMobileTab('canvas');
                      }}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all',
                        selectedSection === section.id
                          ? 'border-black bg-pink text-black shadow-[2.5px_2.5px_0px_#000] font-bold'
                          : 'border-black/15 bg-white hover:border-black hover:bg-neutral-50 text-neutral-800 shadow-xs'
                      )}
                    >
                      {/* Section Reorder Controls */}
                      <div className="flex flex-col gap-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'up'); }}
                          className="hover:text-black disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move section up"
                        >
                          <ArrowUp size={10} className="stroke-[3]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === sections.length - 1}
                          onClick={(e) => { e.stopPropagation(); moveSection(idx, 'down'); }}
                          className="hover:text-black disabled:opacity-20 cursor-pointer p-0.5"
                          title="Move section down"
                        >
                          <ArrowDown size={10} className="stroke-[3]" />
                        </button>
                      </div>

                      <span className="font-mono text-xs flex-1 truncate">{section.name}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                        className="opacity-60 hover:opacity-100 p-1 rounded-md transition-all cursor-pointer hover:bg-black/10 text-neutral-600"
                        title="Delete section"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-black/10">
                  <div className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2">
                    + Add Block
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Hero', 'Features', 'Testimonials', 'Gallery', 'Pricing', 'CTA', 'Contact'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          addSection(type.toLowerCase());
                          if (mobileTab === 'sections') setMobileTab('canvas');
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-black bg-white hover:bg-yellow font-mono text-[11px] font-bold text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                      >
                        <Plus size={11} className="stroke-[3]" />
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(leftPanel === 'styles' || mobileTab === 'styles') && (
              <div className="space-y-4">
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2">
                    Brand Palette
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Accent', key: 'primaryColor' },
                      { label: 'Background', key: 'bgColor' },
                    ].map(({ label, key }) => (
                      <div key={key} className="flex items-center justify-between rounded-xl border border-black/20 bg-white p-2">
                        <span className="font-mono text-xs font-medium text-neutral-700">{label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme[key as keyof typeof theme] || '#000000'}
                            onChange={(e) => setTheme(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-7 h-7 rounded-lg border border-black cursor-pointer p-0.5"
                          />
                          <span className="font-mono text-[11px] font-bold text-black">
                            {theme[key as keyof typeof theme]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2">
                    Preset Swatches
                  </div>
                  <div className="flex items-center gap-2">
                    {['#FF5588', '#FFDD00', '#00E599', '#9966FF', '#00F0FF', '#0F0F11'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setTheme(prev => ({ ...prev, primaryColor: c }))}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-md border-2 border-black transition-transform cursor-pointer ${
                          theme.primaryColor === c ? 'scale-125 ring-2 ring-black' : 'hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Real-time WCAG Contrast Checker */}
                {(() => {
                  const textContrast = getContrastRatio(theme.textColor, theme.bgColor);
                  const textWcag = getWcagLevel(textContrast);
                  return (
                    <div className="p-3 rounded-xl border-2 border-black bg-white shadow-brutal-xs space-y-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase text-neutral-600">
                          WCAG Contrast
                        </span>
                        <span
                          style={{ backgroundColor: textWcag.color }}
                          className="px-2 py-0.5 rounded-full border border-black font-mono text-[9px] font-black text-black"
                        >
                          {textContrast}:1 ({textWcag.level})
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-neutral-500 leading-tight">
                        Readability ratio between base text and canvas background.
                      </p>
                      {!textWcag.pass && (
                        <button
                          type="button"
                          onClick={() => setTheme(prev => ({ ...prev, textColor: suggestAccessibleColor(prev.textColor, prev.bgColor) }))}
                          className="w-full py-1 px-2 rounded-lg border border-black bg-yellow text-black font-mono text-[10px] font-bold hover:bg-pink transition-colors cursor-pointer"
                        >
                          Auto-Fix Contrast (to 4.5:1)
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Viewport - 100% visible on mobile, responsive everywhere */}
        <div className="flex-1 bg-[#EBE7DF] overflow-auto flex items-start justify-center p-2 sm:p-6 lg:p-8 relative w-full">
          {/* Subtle architectural dot grid */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Browser Frame */}
          <div
            className="relative z-10 bg-white rounded-2xl border-[3px] sm:border-[3.5px] border-black shadow-[6px_6px_0px_#000] sm:shadow-[10px_10px_0px_#000] transition-all duration-300 overflow-hidden flex flex-col w-full max-w-full origin-top"
            style={{
              width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : DEVICE_WIDTHS[deviceMode],
              transform: `scale(${zoomScale})`,
              minHeight: '800px',
            }}
          >
            {/* Top Browser Bar */}
            <div className="h-9 sm:h-10 bg-[#FAF9F6] border-b-[2px] sm:border-b-[2.5px] border-black px-3 sm:px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black bg-[#FF5F56]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-black/20 bg-white px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-neutral-600 truncate max-w-[200px] sm:max-w-xs">
                <span className="text-mint font-bold">●</span>
                <span className="truncate">https://{siteTitle.toLowerCase().replace(/\s+/g, '-')}.launchly.site</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] font-black uppercase text-neutral-400">
                {deviceMode}
              </span>
            </div>

            {/* Editable Content Frame */}
            <div data-canvas-frame className="flex-1 overflow-y-auto">
              <CanvasContent
                sections={sections}
                selectedSection={selectedSection}
                theme={theme}
                siteTitle={siteTitle}
                heroContent={heroContent}
                featuresContent={featuresContent}
                testimonialsContent={testimonialsContent}
                ctaContent={ctaContent}
              />
            </div>
          </div>
        </div>

        {/* Right Inspector: Desktop sidebar / Mobile full-screen when active */}
        <div
          className={cn(
            'bg-white border-l-[3px] border-black flex flex-col z-30 shrink-0 overflow-hidden',
            'w-72 hidden lg:flex', // Desktop default
            // Mobile full screen overlay when tab selected
            mobileTab === 'inspector' && '!flex fixed inset-x-0 top-14 bottom-14 w-full z-40 bg-white'
          )}
        >
          <div className="p-3.5 border-b-[2px] border-black bg-[#FAF9F6] flex items-center justify-between">
            <div className="font-mono text-xs font-black uppercase text-black tracking-wider">
              <span>{selectedSection ? `${sections.find(s => s.id === selectedSection)?.name || ''} Properties` : 'Inspector'}</span>
            </div>
            {/* Close button on mobile */}
            <button
              onClick={() => setMobileTab('canvas')}
              className="lg:hidden px-2 py-0.5 rounded-lg border border-black bg-yellow font-mono text-[10px] font-bold text-black"
            >
              Done ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {selectedSection ? (
              <SectionProperties
                sectionId={selectedSection}
                sections={sections}
                theme={theme}
                setTheme={setTheme}
              />
            ) : (
              <div className="text-center py-10 font-mono text-xs text-neutral-400">
                Click any section on the canvas to inspect properties.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop) */}
      <nav className="md:hidden h-14 bg-white border-t-[3px] border-black flex items-center justify-around px-1 z-50 shrink-0 shadow-[0_-2px_0_#000]">
        {[
          { id: 'canvas' as const, label: 'Canvas', icon: Layout },
          { id: 'sections' as const, label: 'Blocks', icon: Layers },
          { id: 'styles' as const, label: 'Styles', icon: Palette },
          { id: 'inspector' as const, label: 'Inspect', icon: SlidersHorizontal },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={cn(
              'flex flex-col items-center justify-center py-1 px-3 rounded-xl font-mono text-[10px] font-bold transition-all cursor-pointer',
              mobileTab === id
                ? 'bg-yellow text-black border-2 border-black shadow-xs font-black'
                : 'text-neutral-500 hover:text-black'
            )}
          >
            <Icon size={16} className="stroke-[2.5]" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* AI Prompt Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-lg w-full shadow-[10px_10px_0px_#000] relative border-[3.5px] border-black max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => !aiGenerating && setShowAiModal(false)}
              disabled={aiGenerating}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-white hover:bg-yellow shadow-[2px_2px_0px_#000] cursor-pointer transition-all disabled:opacity-50"
            >
              <X size={14} className="stroke-[2.5]" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border-2 border-black bg-yellow flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                  <Wand2 size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-black leading-tight">
                    AI Design Studio
                  </h3>
                  <p className="font-mono text-xs text-neutral-500">
                    Describe your website — AI will redesign the canvas live
                  </p>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">
                  Your Creative Prompt
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. A futuristic Web3 AI copilot with neon cyan glow, high-converting stats, and dark brutalist telemetry..."
                  disabled={aiGenerating}
                  className="w-full p-3 rounded-2xl border-2 border-black bg-[#FAF9F6] font-mono text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-yellow shadow-inner resize-none"
                />
              </div>

              {/* Quick Prompt Pills */}
              <div>
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block mb-1.5">
                  Or pick a curated design aesthetic:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Cyberpunk & Web3 L2', prompt: 'Futuristic Web3 Layer-2 with neon cyan accents, dark telemetry radar, and zero-knowledge compute' },
                    { label: 'Autonomous AI Copilot', prompt: 'High-scale multi-agent cognitive engine with neon pink glow, streaming metrics, and dark mode' },
                    { label: 'Kyoto Architecture', prompt: 'Wabi-sabi architectural monograph with warm cream background, deep serif typography, and natural proportions' },
                    { label: 'Limited EDC Capsule', prompt: 'Brutalist everyday carry commerce drop with yellow accents, titanium gear, and countdown timer' },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      disabled={aiGenerating}
                      onClick={() => {
                        setAiPrompt(p.prompt);
                        handleAiGenerate(p.prompt);
                      }}
                      className="px-2 py-1 rounded-xl border border-black bg-white hover:bg-yellow font-mono text-[10px] sm:text-[11px] font-bold text-black shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {aiGenerating && (
                <div className="p-3 rounded-2xl border-2 border-black bg-yellow/40 flex items-center gap-3 animate-pulse">
                  <Loader2 size={16} className="animate-spin text-black stroke-[3]" />
                  <span className="font-mono text-xs font-bold text-black">
                    {aiStep || 'Synthesizing bespoke design tokens...'}
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleAiGenerate()}
                disabled={aiGenerating || !aiPrompt.trim()}
                className="w-full justify-center py-2.5 sm:py-3 rounded-2xl border-2 border-black bg-pink hover:bg-pink/90 font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>Redesigning Live Canvas…</span>
                  </>
                ) : (
                  <>
                    <Wand2 size={16} className="stroke-[2.5]" />
                    <span>Generate Bespoke Website Design →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro Account Domain Publishing Modal */}
      {showPublishDialog && (
        <PublishDialog
          onClose={() => setShowPublishDialog(false)}
          siteName={siteTitle}
          templateId={template.id}
          sitePayload={{
            siteName: siteTitle,
            templateId: template.id,
            theme,
            heroContent,
            featuresContent,
            testimonialsContent,
            ctaContent,
          }}
        />
      )}

      {/* One-Click GitHub & Vercel Deploy Modal */}
      {showDeployModal && (
        <DeployModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          siteData={{
            siteTitle,
            templateId: template.id,
            theme,
            heroContent,
            featuresContent,
            testimonialsContent,
            ctaContent,
            sectionOrder: sections.map((s) => s.id),
          }}
        />
      )}

      {/* Dynamic Social Share & OG Card Modal */}
      {showShareModal && (
        <SocialShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={siteTitle}
          description={heroContent.description || 'High-performance digital presence powered by Launchly.'}
          badge={heroContent.badge || `${template.category} // PRO`}
          accent={theme.primaryColor || template.accent}
          bgColor={theme.bgColor || template.bgColor}
          subdomain={siteTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || template.id}
        />
      )}

      {/* Floating Inline Formatting Toolbar */}
      {toolbarPos && (
        <div
          style={{ top: toolbarPos.y, left: toolbarPos.x }}
          className="fixed z-[120] flex items-center gap-1 p-1 bg-white dark:bg-[#181824] rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] animate-in fade-in zoom-in-95"
        >
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs cursor-pointer text-black dark:text-white"
            title="Bold"
          >
            <Bold size={13} className="stroke-[3]" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-xs cursor-pointer text-black dark:text-white"
            title="Italic"
          >
            <Italic size={13} className="stroke-[3]" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-mono text-xs font-black underline cursor-pointer text-black dark:text-white"
            title="Underline"
          >
            U
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('hiliteColor', '#FFD600'); }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center"
            title="Highlight Yellow"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-yellow border border-black inline-block" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); applyFormat('removeFormat'); }}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 font-mono text-[10px] font-bold cursor-pointer text-neutral-500 hover:text-black dark:hover:text-white"
            title="Clear formatting"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function CanvasContent({
  sections,
  selectedSection,
  theme,
  siteTitle,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
}: {
  sections: Section[];
  selectedSection: string | null;
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  siteTitle: string;
  heroContent: Record<string, string>;
  featuresContent: Array<{ title: string; desc: string }>;
  testimonialsContent: Array<{ quote: string; name: string; role: string }>;
  ctaContent: { title: string; desc: string; buttonText: string };
}) {
  return (
    <div style={{ fontFamily: theme.fontFamily }} className="min-h-full flex flex-col">
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          isSelected={selectedSection === section.id}
          theme={theme}
          siteTitle={siteTitle}
          heroContent={heroContent}
          featuresContent={featuresContent}
          testimonialsContent={testimonialsContent}
          ctaContent={ctaContent}
        />
      ))}
    </div>
  );
}

function SectionRenderer({
  section,
  isSelected,
  theme,
  siteTitle,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
}: {
  section: Section;
  isSelected: boolean;
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  siteTitle: string;
  heroContent: Record<string, string>;
  featuresContent: Array<{ title: string; desc: string }>;
  testimonialsContent: Array<{ quote: string; name: string; role: string }>;
  ctaContent: { title: string; desc: string; buttonText: string };
}) {
  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all',
        isSelected && 'outline-[3px] outline-pink outline-offset-[-3px] shadow-[inset_0_0_0_2px_#000]'
      )}
    >
      {/* Navigation Block */}
      {section.type === 'nav' && (
        <nav className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-4 border-b-2 border-black/10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: theme.primaryColor }}
              className="w-7 h-7 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-display font-black text-xs text-black"
            >
              {siteTitle.charAt(0)}
            </div>
            <span className="font-display font-black text-sm sm:text-base text-ink tracking-tight">
              {siteTitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 font-mono text-xs font-bold text-neutral-700">
            {['Home', 'Features', 'Showcase', 'Pricing'].map(item => (
              <span key={item} className="hover:text-black hover:underline cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          <button
            type="button"
            style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
            className="px-3 sm:px-4 py-1.5 rounded-xl border-2 border-black font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            Get Started
          </button>
        </nav>
      )}

      {/* Hero Block */}
      {section.type === 'hero' && (
        <div
          className="py-12 sm:py-24 px-4 sm:px-12 text-center relative overflow-hidden"
          style={{ background: theme.bgColor, color: theme.textColor }}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-25 pointer-events-none"
            style={{ backgroundColor: theme.primaryColor }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3 sm:space-y-4">
            {/* Category Pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-black font-mono text-[10px] sm:text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_#000]"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <span>{heroContent.badge}</span>
            </div>

            {/* Editable Headline */}
            <h1
              className="font-display text-2xl sm:text-5xl font-black tracking-tight leading-tight outline-none focus:ring-2 focus:ring-pink rounded-lg p-1"
              contentEditable
              suppressContentEditableWarning
            >
              {heroContent.title}
            </h1>

            {/* Editable Description */}
            <p
              className="font-mono text-xs sm:text-sm opacity-80 max-w-lg mx-auto leading-relaxed outline-none focus:ring-2 focus:ring-pink rounded-lg p-1"
              contentEditable
              suppressContentEditableWarning
            >
              {heroContent.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-black font-display text-xs sm:text-sm font-black text-black shadow-[2.5px_2.5px_0px_#000] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{heroContent.ctaPrimary}</span>
                <ArrowUpRight size={14} className="stroke-[3]" />
              </button>
              <button
                type="button"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-current bg-white/10 hover:bg-white/20 font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                {heroContent.ctaSecondary}
              </button>
            </div>

            {/* Live Telemetry Radar Pills */}
            <div className="pt-4 sm:pt-6 grid grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto text-left">
              <div className="rounded-xl border border-current/20 bg-white/5 p-2.5 sm:p-3 backdrop-blur-sm">
                <span className="font-mono text-[8px] sm:text-[9px] font-bold opacity-60 block uppercase">
                  {heroContent.stat1Label}
                </span>
                <span className="font-display text-sm sm:text-base font-black">{heroContent.stat1Value}</span>
              </div>
              <div className="rounded-xl border border-current/20 bg-white/5 p-2.5 sm:p-3 backdrop-blur-sm">
                <span className="font-mono text-[8px] sm:text-[9px] font-bold opacity-60 block uppercase">
                  {heroContent.stat2Label}
                </span>
                <span className="font-display text-sm sm:text-base font-black">{heroContent.stat2Value}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Block */}
      {section.type === 'features' && (
        <div className="py-12 sm:py-16 px-4 sm:px-12 bg-white text-black border-y-2 border-black/10">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h2 className="font-display text-xl sm:text-3xl font-black tracking-tight" contentEditable suppressContentEditableWarning>
              Engineered for hyper-scale precision.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {featuresContent.map((f: { title: string; desc: string }, i: number) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-2xl border-2 border-black bg-[#FAF9F6] shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000]"
              >
                <div
                  style={{ backgroundColor: theme.primaryColor }}
                  className="w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center font-mono font-black text-xs text-black mb-2.5 shadow-[1.5px_1.5px_0px_#000]"
                >
                  0{i + 1}
                </div>
                <h3 className="font-display font-black text-sm sm:text-base mb-1" contentEditable suppressContentEditableWarning>
                  {f.title}
                </h3>
                <p className="font-mono text-xs text-neutral-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Block */}
      {section.type === 'testimonials' && (
        <div className="py-12 sm:py-16 px-4 sm:px-12 bg-[#FFFDF8] text-black">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-display text-xl sm:text-3xl font-black">
              Trusted by world-class teams.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {testimonialsContent.map((item: { quote: string; name: string; role: string }, idx: number) => (
              <div key={idx} className="p-4 sm:p-6 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="flex gap-1 mb-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-yellow text-black stroke-[1.5]" />
                  ))}
                </div>
                <p className="font-mono text-xs sm:text-[13px] leading-relaxed mb-4 text-neutral-800" contentEditable suppressContentEditableWarning>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-black/10 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-black bg-lilac flex items-center justify-center font-mono font-bold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display font-black text-xs text-black">{item.name}</h4>
                    <p className="font-mono text-[9px] sm:text-[10px] text-neutral-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Block */}
      {section.type === 'cta' && (
        <div className="py-12 sm:py-16 px-4 sm:px-12 bg-black text-white text-center relative overflow-hidden">
          <div className="relative z-10 max-w-lg mx-auto space-y-3">
            <h2 className="font-display text-xl sm:text-3xl font-black" contentEditable suppressContentEditableWarning>
              {ctaContent.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400" contentEditable suppressContentEditableWarning>
              {ctaContent.desc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-white font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#FFFFFF] cursor-pointer"
              >
                {ctaContent.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Block */}
      {section.type === 'footer' && (
        <footer className="py-6 sm:py-8 px-4 sm:px-12 border-t-2 border-black/10 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-neutral-600">
          <div className="flex items-center gap-2 font-bold text-black">
            <span>{siteTitle}</span>
            <span>•</span>
            <span className="text-[10px] text-neutral-400">Powered by Launchly</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-black cursor-pointer">Privacy</span>
            <span className="hover:text-black cursor-pointer">Terms</span>
            <span className="hover:text-black cursor-pointer">Security</span>
          </div>
        </footer>
      )}
    </div>
  );
}

function SectionProperties({
  sectionId,
  sections,
  theme,
  setTheme
}: {
  sectionId: string;
  sections: Section[];
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  setTheme: React.Dispatch<React.SetStateAction<{ primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string }>>;
}) {
  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;

  return (
    <div className="space-y-4">
      {/* Block identity */}
      <div className="rounded-xl border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#000]">
        <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase block">Active Section</span>
        <span className="font-display font-black text-sm text-black">{section.name}</span>
      </div>

      {/* Typography Toolbar */}
      <div>
        <div className="font-mono text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
          Typography
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <Bold size={13} className="stroke-[3]" />
          </button>
          <button type="button" className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <Italic size={13} className="stroke-[3]" />
          </button>
          <div className="flex-1 h-px bg-black/10" />
          <button type="button" className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <AlignLeft size={13} />
          </button>
          <button type="button" className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <AlignCenter size={13} />
          </button>
          <button type="button" className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <AlignRight size={13} />
          </button>
        </div>
      </div>

      {/* Spacing Controls */}
      <div>
        <div className="font-mono text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
          Spacing (px)
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Top: 48', 'Bottom: 48', 'Left: 32', 'Right: 32'].map((label) => (
            <div key={label} className="rounded-xl border-2 border-black bg-white p-2 text-center">
              <span className="font-mono text-xs font-bold text-black">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Accent Color */}
      <div>
        <div className="font-mono text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
          Section Accent
        </div>
        <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-white p-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
            className="w-8 h-8 rounded-lg border border-black cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
            className="flex-1 font-mono text-xs font-bold text-black outline-none uppercase"
          />
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <div className="font-mono text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
          Corner Radius
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {['8px', '16px', '24px', '9999px'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTheme(prev => ({ ...prev, borderRadius: r }))}
              className={cn(
                'py-1.5 rounded-lg border-2 border-black font-mono text-[10px] font-black cursor-pointer transition-all',
                theme.borderRadius === r ? 'bg-pink text-black shadow-2xs' : 'bg-white hover:bg-neutral-100'
              )}
            >
              {r === '9999px' ? 'Pill' : r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Pro Account Domain Publishing Modal
function PublishDialog({ 
  onClose, 
  siteName, 
  templateId, 
  sitePayload 
}: { 
  onClose: () => void; 
  siteName: string; 
  templateId: string; 
  sitePayload?: Record<string, unknown>;
}) {
  const [step, setStep] = useState<'form' | 'publishing' | 'success'>('form');
  const [subdomain, setSubdomain] = useState(siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  const [publishedUrl, setPublishedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const getWorkingUrl = () => {
    if (publishedUrl) {
      if (typeof window !== 'undefined' && publishedUrl.startsWith('/')) {
        return `${window.location.origin}${publishedUrl}`;
      }
      return publishedUrl;
    }
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/live/${subdomain}`;
    }
    return `/live/${subdomain}`;
  };

  const handlePublish = async () => {
    setStep('publishing');
    // Save to localStorage immediately so live preview works with 100% fidelity
    if (typeof window !== 'undefined' && sitePayload) {
      try {
        localStorage.setItem(`launchly_site_${subdomain}`, JSON.stringify({
          ...sitePayload,
          subdomain,
          siteName,
        }));
        localStorage.setItem(`launchly_site_${templateId}`, JSON.stringify({
          ...sitePayload,
          subdomain,
          siteName,
        }));
      } catch {}
    }

    try {
      const res = await fetch('/api/sites/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          name: siteName,
          subdomain,
          siteData: sitePayload,
        }),
      });
      const data = await res.json();
      if (data.site) {
        setPublishedUrl(`/live/${data.site.subdomain}`);
      } else {
        setPublishedUrl(`/live/${subdomain}`);
      }
    } catch {
      setPublishedUrl(`/live/${subdomain}`);
    }
    await new Promise(r => setTimeout(r, 1000));
    setStep('success');
  };

  const handleCopyWorkingUrl = () => {
    const full = getWorkingUrl();
    navigator.clipboard?.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCustomDomain = () => {
    const full = `https://${subdomain}.launchly.site`;
    navigator.clipboard?.writeText(full);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[110] flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-[10px_10px_0px_#000] relative border-[3.5px] border-black">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-black bg-white hover:bg-yellow shadow-[2px_2px_0px_#000] cursor-pointer transition-all"
        >
          <X size={14} className="stroke-[2.5]" />
        </button>

        {step === 'form' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl border-2 border-black bg-pink flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Globe size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-black leading-tight">
                  Launchly Pro Hosting
                </h3>
                <p className="font-mono text-xs text-neutral-500">
                  Deploy live directly on our platform domain
                </p>
              </div>
            </div>

            {/* Our Platform Domain Notice */}
            <div className="p-3 rounded-2xl border-2 border-black bg-yellow/20">
              <div className="font-mono text-[10px] font-black uppercase text-black">
                🔒 HOSTED ON OUR LAUNCHLY DOMAIN
              </div>
              <div className="font-mono text-[11px] text-neutral-700 mt-0.5">
                Pro accounts are provisioned under <strong>{subdomain}.launchly.site</strong> with instant live edge preview.
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Website Name
              </label>
              <input
                type="text"
                value={siteName}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl border-2 border-black bg-[#FAF9F6] font-display font-bold text-sm text-black"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Subdomain on our domain
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 bg-white border-2 border-r-0 border-black rounded-l-xl font-mono text-xs font-bold text-black focus:outline-none"
                />
                <div className="px-3 py-2 bg-yellow border-2 border-black rounded-r-xl font-mono text-xs font-black text-black">
                  .launchly.site
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-mint font-bold">
                <span className="w-2 h-2 rounded-full bg-mint" />
                <span>Available for instant edge activation</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePublish}
              className="w-full justify-center py-3 rounded-2xl border-2 border-black bg-pink hover:bg-yellow font-display text-sm font-black text-black shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe size={16} className="stroke-[2.5]" />
              <span>Host on Our Domain Now →</span>
            </button>
          </div>
        )}

        {step === 'publishing' && (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 rounded-2xl border-2 border-black bg-yellow flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <Loader2 size={26} className="animate-spin text-black stroke-[2.5]" />
            </div>
            <h3 className="font-display font-black text-lg text-black">Deploying to launchly.site…</h3>
            <p className="font-mono text-xs text-neutral-500 max-w-xs mx-auto">
              Generating Edge SSR bundle, configuring SSL certificates, and pointing DNS to our edge network.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-3.5">
            <div className="w-14 h-14 rounded-2xl border-2 border-black bg-mint flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <Check size={28} className="stroke-[3] text-black" />
            </div>
            <h3 className="font-display font-black text-xl text-black">Your Website is Live!</h3>
            
            {/* Live Instant Preview Box */}
            <div className="p-3 rounded-xl border-2 border-black bg-yellow text-left">
              <span className="font-mono text-[9px] font-black uppercase text-neutral-600 block">
                ● LIVE URL (INSTANT PREVIEW)
              </span>
              <span className="font-mono text-xs font-black text-black truncate block mt-0.5">
                {getWorkingUrl()}
              </span>
            </div>

            {/* Edge Domain Tag */}
            <div className="p-2.5 rounded-xl border-2 border-black bg-[#FAF9F6] text-left flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold text-neutral-500 uppercase block">
                  Production Edge Subdomain
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  https://{subdomain}.launchly.site
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyCustomDomain}
                className="px-2 py-1 rounded-lg border border-black bg-white hover:bg-yellow font-mono text-[10px] font-bold text-black transition-colors cursor-pointer"
              >
                {copiedDomain ? '✓' : 'Copy'}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  window.open(getWorkingUrl(), '_blank');
                }}
                className="w-full py-2.5 rounded-xl border-2 border-black bg-pink hover:bg-yellow font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Visit Live Website Now</span>
                <ArrowUpRight size={15} className="stroke-[3]" />
              </button>
              
              <button
                type="button"
                onClick={handleCopyWorkingUrl}
                className="w-full py-2 rounded-xl border-2 border-black bg-white hover:bg-neutral-100 font-mono text-xs font-bold text-black shadow-xs cursor-pointer transition-colors"
              >
                {copied ? '✓ Live URL Copied!' : 'Copy Live URL'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
