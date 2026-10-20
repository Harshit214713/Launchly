'use client';

import { useState, use, useEffect, useCallback, useRef } from 'react';
import { useStore } from 'zustand';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Globe,
  Layers, Type, Image as ImageIcon, Palette, Settings, Menu as MenuIcon, ExternalLink,
  Plus, Trash2, ChevronRight, Eye, EyeOff, Lock, Unlock, X,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Check, Loader2, Wand2, ArrowUpRight, Star,
  SlidersHorizontal, Layout, Download, ZoomIn, ZoomOut,
  ArrowUp, ArrowDown, Heart, Sparkles, Camera, CheckCircle2, History as HistoryIcon
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';
import { exportTemplateAsZip } from '@/lib/zipExport';
import { getContrastRatio, getWcagLevel, suggestAccessibleColor } from '@/lib/contrast';
import { createSiteDocument, makeSection, mergeEditorProjection, migrateSiteDocument, type MenuItem, type SectionStyle, type SiteDocument } from '@/lib/siteDocument';
import { blockRegistry } from '@/lib/blockRegistry';
import { createEditorStore, type SiteVersion } from '@/store/editorStore';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type LeftPanel = 'sections' | 'ai' | 'styles' | 'elements' | 'pages' | 'navigation' | 'assets';
type MobileTab = 'canvas' | 'sections' | 'styles' | 'inspector' | 'elements' | 'pages' | 'navigation' | 'assets';

const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

interface Section {
  id: string;
  name: string;
  type: string;
  content?: Record<string, unknown>;
  style?: SectionStyle;
  hidden?: Partial<Record<DeviceMode, boolean>>;
  locked?: boolean;
  anchorId?: string;
  customClass?: string;
}
type SectionSpacing = { top: number; bottom: number; left: number; right: number };
type CanvasElement = { id: string; type: 'image' | 'icon'; name: string; src?: string; icon?: string; x: number; y: number; width: number; height: number };
type SitePage = { id: string; title: string; description: string; slug?: string; isHome?: boolean; showInMenu?: boolean; noindex?: boolean; useSharedHeader?: boolean; useSharedFooter?: boolean };
const DEFAULT_SPACING: SectionSpacing = { top: 0, bottom: 0, left: 0, right: 0 };

const DEFAULT_SECTIONS: Section[] = [
  { id: 'nav', name: 'Navigation', type: 'nav' },
  { id: 'hero', name: 'Hero', type: 'hero' },
  { id: 'gallery', name: 'Featured Products', type: 'gallery' },
  { id: 'features', name: 'Features', type: 'features' },
  { id: 'testimonials', name: 'Testimonials', type: 'testimonials' },
  { id: 'cta', name: 'Call to Action', type: 'cta' },
  { id: 'footer', name: 'Footer', type: 'footer' },
];
const withBlockDefaults = (items: Section[]) => items.map((section) => {
  if (section.content && Object.keys(section.content).length) return section;
  if (['hero', 'features', 'testimonials', 'cta'].includes(section.type)) return section;
  const definition = blockRegistry[section.type];
  return definition ? { ...section, content: structuredClone(definition.defaultContent) } : section;
});

export default function EditorPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('sections');
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [sectionSpacing, setSectionSpacing] = useState<Record<string, SectionSpacing>>({});
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [sitePages, setSitePages] = useState<SitePage[]>(() => template.pages.map((name, index) => ({ id: index ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'home', title: name, description: index ? `Explore ${name.toLowerCase()} at ${template.name}.` : template.description })));
  const [activePageId, setActivePageId] = useState('home');
  const [slugDrafts, setSlugDrafts] = useState<Record<string, string>>({});
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [draggedMenuId, setDraggedMenuId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>('hero');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [exportingZip, setExportingZip] = useState(false);
  const [userPlan, setUserPlan] = useState<'loading' | 'free' | 'pro'>('loading');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

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
  const [assetUrl, setAssetUrl] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then((response) => response.json()).then((data) => {
      setUserPlan(data?.authenticated && data.user?.plan === 'pro' ? 'pro' : 'free');
    }).catch(() => setUserPlan('free'));
  }, []);

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

  const initialFeatures = template.features.map((title) => ({
    title,
    desc: `${title} is thoughtfully integrated into the ${template.name} shopping experience.`,
  }));
  const [featuresContent, setFeaturesContent] = useState(initialFeatures);

  const [testimonialsContent, setTestimonialsContent] = useState([
    template.topReview
      ? { quote: template.topReview.comment, name: template.topReview.author, role: template.topReview.role }
      : { quote: `${template.name} gave our store the premium experience we wanted.`, name: 'Alex Morgan', role: 'Store owner' },
    { quote: `${template.name} made it easy to present our products beautifully and serve customers on every screen.`, name: 'Jamie Lee', role: 'Brand director' },
  ]);

  const [ctaContent, setCtaContent] = useState({
    title: `Discover ${template.name}.`,
    desc: `Explore the ${template.name} collection and find your next favorite.`,
    buttonText: 'Shop the collection →',
  });

  const [editorStore] = useState(() => createEditorStore(createSiteDocument({
    id: template.id, name: siteTitle, templateId: template.id, theme,
    sections: withBlockDefaults(sections), sectionSpacing, elements: canvasElements, pages: sitePages,
    hero: heroContent, features: featuresContent, testimonials: testimonialsContent, cta: ctaContent,
    assetUrl, logoUrl, faviconUrl,
  })));
  const editorDocument = useStore(editorStore, (state) => state.document);
  const saveStatus = useStore(editorStore, (state) => state.saveStatus);
  const undoCount = useStore(editorStore, (state) => state.past.length);
  const redoCount = useStore(editorStore, (state) => state.future.length);
  const versions = useStore(editorStore, (state) => state.versions);

  const documentFromState = useCallback((source: {
    theme: typeof theme; siteTitle: string; heroContent: typeof heroContent; featuresContent: typeof featuresContent;
    testimonialsContent: typeof testimonialsContent; ctaContent: typeof ctaContent; sections: Section[];
    sectionSpacing: Record<string, SectionSpacing>; canvasElements: CanvasElement[]; sitePages: SitePage[];
    assetUrl: string; logoUrl: string; faviconUrl: string;
  }): SiteDocument => createSiteDocument({
    id: template.id, name: source.siteTitle, templateId: template.id, theme: source.theme,
      sections: withBlockDefaults(source.sections), sectionSpacing: source.sectionSpacing, elements: source.canvasElements, pages: source.sitePages,
    hero: source.heroContent, features: source.featuresContent, testimonials: source.testimonialsContent, cta: source.ctaContent,
    assetUrl: source.assetUrl, logoUrl: source.logoUrl, faviconUrl: source.faviconUrl,
  }), [template.id]);

  const [isHistoryReady, setHistoryReady] = useState(false);
  const [serverDraftReady, setServerDraftReady] = useState(false);
  // Draft restoration is an external-storage synchronization on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const key = `launchly_site_${template.id}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const savedSite = JSON.parse(raw);
        try {
          const savedVersions = localStorage.getItem(`launchly_versions_${template.id}`);
          if (savedVersions) editorStore.getState().setVersions(JSON.parse(savedVersions) as SiteVersion[]);
        } catch { /* Ignore a malformed version-history cache. */ }
        const migrated = migrateSiteDocument(savedSite, editorStore.getState().document);
        editorStore.getState().replaceDocument(migrated);
        setTheme(migrated.theme);
        setSiteTitle(migrated.name);
        setHeroContent((current) => ({ ...current, ...migrated.content.hero }));
        setFeaturesContent(migrated.content.features);
        setTestimonialsContent(migrated.content.testimonials);
        setCtaContent(migrated.content.cta);
        const homePage = migrated.pages.find((page) => page.isHome) || migrated.pages[0];
        if (homePage?.sections.length) setSections(homePage.sections.map((section) => ({ ...section })));
        setSectionSpacing(Object.fromEntries(migrated.pages.flatMap((page) => page.sections.filter((section) => section.style.padding).map((section) => [section.id, { top: section.style.padding?.top || 0, right: section.style.padding?.right || 0, bottom: section.style.padding?.bottom || 0, left: section.style.padding?.left || 0 }]))));
        setCanvasElements(homePage?.elements || []);
        setSitePages(migrated.pages.map((page) => ({ id: page.isHome ? 'home' : page.id, title: page.title, description: page.seo.description, slug: page.slug.replace(/^\//, ''), isHome: page.isHome, showInMenu: page.showInMenu, noindex: page.seo.noindex, useSharedHeader: page.useSharedHeader, useSharedFooter: page.useSharedFooter })));
        setActivePageId(homePage?.id || 'home');
        setAssetUrl(migrated.assets.find((asset) => asset.role === 'product')?.src || '');
        setLogoUrl(migrated.assets.find((asset) => asset.role === 'logo')?.src || '');
        setFaviconUrl(migrated.assets.find((asset) => asset.role === 'favicon')?.src || '');
        if (!savedSite.document) {
          if (savedSite.theme) setTheme(savedSite.theme);
          if (savedSite.siteName) setSiteTitle(savedSite.siteName);
          if (savedSite.heroContent) setHeroContent(savedSite.heroContent);
          if (savedSite.featuresContent) setFeaturesContent(savedSite.featuresContent);
          if (savedSite.testimonialsContent) setTestimonialsContent(savedSite.testimonialsContent);
          if (savedSite.ctaContent) setCtaContent(savedSite.ctaContent);
          if (savedSite.sections?.length) setSections(savedSite.sections);
          if (savedSite.assetUrl) setAssetUrl(savedSite.assetUrl);
          if (savedSite.logoUrl) setLogoUrl(savedSite.logoUrl);
          if (savedSite.faviconUrl) setFaviconUrl(savedSite.faviconUrl);
          if (savedSite.sectionSpacing) setSectionSpacing(savedSite.sectionSpacing);
          if (savedSite.canvasElements) setCanvasElements(savedSite.canvasElements);
          if (savedSite.sitePages) setSitePages(savedSite.sitePages);
        }
      }
    } catch { /* Ignore malformed local drafts and keep template defaults. */ }
    setHistoryReady(true);
  // Load once for each selected template.
  }, [template.id, editorStore]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHistoryReady || !serverDraftReady) return;
    const nextDocument = documentFromState({ theme, siteTitle, heroContent, featuresContent, testimonialsContent, ctaContent, sections, sectionSpacing, canvasElements, sitePages, assetUrl, logoUrl, faviconUrl });
    editorStore.getState().updateDocument((current) => {
      const merged = mergeEditorProjection(current, nextDocument, activePageId);
      return JSON.stringify(current) === JSON.stringify(merged) ? current : merged;
    }, 'editor-sync');
  }, [isHistoryReady, serverDraftReady, editorStore, documentFromState, theme, siteTitle, heroContent, featuresContent, testimonialsContent, ctaContent, sections, sectionSpacing, canvasElements, sitePages, assetUrl, logoUrl, faviconUrl, activePageId]);

  useEffect(() => {
    if (!isHistoryReady || !serverDraftReady) return;
    editorStore.getState().setSaveStatus('unsaved');
    const timer = window.setTimeout(async () => {
      const currentDocument = editorStore.getState().document;
      const latestVersion = editorStore.getState().versions.at(-1);
      if (!latestVersion || (Date.now() - Date.parse(latestVersion.createdAt) > 5 * 60 * 1000 && JSON.stringify(latestVersion.document) !== JSON.stringify(currentDocument))) {
        editorStore.getState().captureVersion('Autosave');
        localStorage.setItem(`launchly_versions_${template.id}`, JSON.stringify(editorStore.getState().versions));
      }
      const legacyPayload = { siteName: currentDocument.name, templateId: currentDocument.templateId, theme: currentDocument.theme, heroContent: currentDocument.content.hero, featuresContent: currentDocument.content.features, testimonialsContent: currentDocument.content.testimonials, ctaContent: currentDocument.content.cta, sections: currentDocument.pages[0]?.sections.map(({ id, name, type }) => ({ id, name, type })) || [], sectionSpacing: Object.fromEntries(currentDocument.pages.flatMap((page) => page.sections.filter((section) => section.style.padding).map((section) => [section.id, section.style.padding]))), canvasElements: currentDocument.pages[0]?.elements || [], sitePages: currentDocument.pages.map((page) => ({ id: page.isHome ? 'home' : page.id, title: page.title, description: page.seo.description })), assetUrl: currentDocument.assets.find((asset) => asset.role === 'product')?.src || '', logoUrl: currentDocument.assets.find((asset) => asset.role === 'logo')?.src || '', faviconUrl: currentDocument.assets.find((asset) => asset.role === 'favicon')?.src || '' };
      try {
        localStorage.setItem(`launchly_site_${template.id}`, JSON.stringify({ ...legacyPayload, schemaVersion: 1, document: currentDocument }));
        localStorage.setItem(`launchly_site_${currentDocument.settings.subdomain}`, JSON.stringify({ ...legacyPayload, schemaVersion: 1, document: currentDocument }));
      } catch { editorStore.getState().setSaveStatus('offline'); return; }
      editorStore.getState().setSaveStatus('saving');
      try {
        const response = await fetch('/api/sites/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ document: currentDocument }) });
        editorStore.getState().setSaveStatus(response.ok ? 'saved' : response.status === 401 ? 'saved' : 'offline', new Date().toISOString());
      } catch { editorStore.getState().setSaveStatus('offline'); }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [editorDocument, isHistoryReady, serverDraftReady, editorStore, template.id]);
  const applyDocumentToEditor = useCallback((document: SiteDocument, requestedPageId = activePageId) => {
    const page = document.pages.find((entry) => entry.id === requestedPageId) || document.pages.find((entry) => entry.isHome) || document.pages[0];
    if (!page) return;
    setActivePageId(page.id);
    setTheme(document.theme);
    setSiteTitle(document.name);
    const hero = page.sections.find((section) => section.type === 'hero')?.content as Partial<typeof heroContent> | undefined;
    const features = page.sections.find((section) => section.type === 'features')?.content.items;
    const testimonials = page.sections.find((section) => section.type === 'testimonials')?.content.items;
    const cta = page.sections.find((section) => section.type === 'cta')?.content as Partial<typeof ctaContent> | undefined;
    setHeroContent((current) => ({ ...current, ...document.content.hero, ...hero }));
    setFeaturesContent(Array.isArray(features) ? features as unknown as typeof featuresContent : document.content.features);
    setTestimonialsContent(Array.isArray(testimonials) ? testimonials as unknown as typeof testimonialsContent : document.content.testimonials);
    setCtaContent({ ...document.content.cta, ...cta });
    setSections(page.sections.map((section) => ({ ...section })));
    setSectionSpacing(Object.fromEntries(page.sections.filter((section) => section.style.padding).map((section) => [section.id, { top: section.style.padding?.top || 0, right: section.style.padding?.right || 0, bottom: section.style.padding?.bottom || 0, left: section.style.padding?.left || 0 }])));
    setCanvasElements(page.elements || []);
    setSitePages(document.pages.map((entry) => ({ id: entry.isHome ? 'home' : entry.id, title: entry.title, description: entry.seo.description, slug: entry.slug.replace(/^\//, ''), isHome: entry.isHome, showInMenu: entry.showInMenu, noindex: entry.seo.noindex, useSharedHeader: entry.useSharedHeader, useSharedFooter: entry.useSharedFooter })));
    setAssetUrl(document.assets.find((asset) => asset.role === 'product')?.src || '');
    setLogoUrl(document.assets.find((asset) => asset.role === 'logo')?.src || '');
    setFaviconUrl(document.assets.find((asset) => asset.role === 'favicon')?.src || '');
  }, [activePageId, setActivePageId, setTheme, setSiteTitle, setHeroContent, setFeaturesContent, setTestimonialsContent, setCtaContent, setSections, setSectionSpacing, setCanvasElements, setSitePages, setAssetUrl, setLogoUrl, setFaviconUrl]);

  const serverDraftLookupStarted = useRef(false);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!isHistoryReady || serverDraftLookupStarted.current) return;
    serverDraftLookupStarted.current = true;
    const localDraft = localStorage.getItem(`launchly_site_${template.id}`);
    if (localDraft) { setServerDraftReady(true); return; }
    const subdomain = siteTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || template.id;
    fetch(`/api/sites/draft?subdomain=${encodeURIComponent(subdomain)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!result?.document) return;
        const restored = migrateSiteDocument(result.document, editorStore.getState().document);
        editorStore.getState().replaceDocument(restored);
        applyDocumentToEditor(restored);
      })
      .catch(() => editorStore.getState().setSaveStatus('offline'))
      .finally(() => setServerDraftReady(true));
  }, [isHistoryReady, siteTitle, template.id, editorStore, applyDocumentToEditor]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleUndo = useCallback(() => {
    if (!editorStore.getState().canUndo()) return;
    editorStore.getState().undo();
    applyDocumentToEditor(editorStore.getState().document);
  }, [editorStore, applyDocumentToEditor]);

  const handleRedo = useCallback(() => {
    if (!editorStore.getState().canRedo()) return;
    editorStore.getState().redo();
    applyDocumentToEditor(editorStore.getState().document);
  }, [editorStore, applyDocumentToEditor]);

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

  const dropSectionOn = (targetId: string) => {
    if (!draggedSectionId || draggedSectionId === targetId) return;
    setSections((current) => {
      const from = current.findIndex((section) => section.id === draggedSectionId);
      const to = current.findIndex((section) => section.id === targetId);
      if (from < 0 || to < 0) return current;
      const reordered = [...current];
      const [dragged] = reordered.splice(from, 1);
      reordered.splice(to, 0, dragged);
      return reordered;
    });
    setDraggedSectionId(null);
  };

  const removeDuplicateBlocks = () => {
    setSections((current) => {
      const seen = new Set<string>();
      return current.filter((section) => {
        if (seen.has(section.type)) return false;
        seen.add(section.type);
        return true;
      });
    });
  };

  const addCanvasElement = (type: CanvasElement['type']) => {
    const id = `element-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: CanvasElement = { id, type, name: type === 'image' ? 'Image' : 'Icon', src: '', icon: 'Star', x: 32, y: 120 + canvasElements.length * 32, width: type === 'image' ? 240 : 72, height: type === 'image' ? 160 : 72 };
    setCanvasElements((current) => [...current, item]);
    setSelectedElementId(id);
  };
  const updateCanvasElement = (id: string, patch: Partial<CanvasElement>) => setCanvasElements((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  const readElementUpload = (id: string, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => updateCanvasElement(id, { src: String(reader.result || ''), name: file.name });
    reader.readAsDataURL(file);
  };

  // 1-Click ZIP Export
  const handleExportZip = async () => {
    if (userPlan !== 'pro') {
      setShowUpgrade(true);
      return;
    }
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
        assetUrl,
        logoUrl,
        faviconUrl,
        pages: sitePages.map((page) => page.title),
        sitePages,
        sectionSpacing,
        canvasElements,
        document: editorDocument,
        sectionNames: Object.fromEntries(sections.map((section) => [section.type, section.name])),
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
    if (!selectedSection) return;
    const changes: Partial<SectionStyle> = command === 'bold' ? { fontWeight: 700 }
      : command === 'italic' ? { fontStyle: 'italic' }
        : command === 'underline' ? { textDecoration: 'underline' }
          : command === 'hiliteColor' ? { highlightColor: value || '#FFD600' }
            : { fontWeight: 400, fontStyle: 'normal', textDecoration: 'none', highlightColor: undefined };
    setSections((items) => items.map((item) => item.id === selectedSection ? { ...item, style: { ...item.style, ...changes } } : item));
  };

  const handleSave = async () => {
    setSaving(true);
    editorStore.getState().setSaveStatus('saving');
    try {
      const payload = {
        siteName: siteTitle,
        templateId: template.id,
        theme,
        heroContent,
        featuresContent,
        testimonialsContent,
        ctaContent,
        sections,
        sectionSpacing,
        canvasElements,
        sitePages,
        assetUrl,
        logoUrl,
        faviconUrl,
        schemaVersion: 1,
        document: editorStore.getState().document,
      };
      if (typeof window !== 'undefined') {
        const versioned = { ...payload, schemaVersion: 1, document: editorStore.getState().document };
        localStorage.setItem(`launchly_site_${template.id}`, JSON.stringify(versioned));
        localStorage.setItem(`launchly_site_${siteTitle.toLowerCase().replace(/\s+/g, '-')}`, JSON.stringify(versioned));
      }
      const response = await fetch('/api/sites/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ document: editorStore.getState().document }) });
      editorStore.getState().setSaveStatus(response.ok || response.status === 401 ? 'saved' : 'offline', new Date().toISOString());
      editorStore.getState().captureVersion('Manual save');
      localStorage.setItem(`launchly_versions_${template.id}`, JSON.stringify(editorStore.getState().versions));
    } catch { editorStore.getState().setSaveStatus('offline'); }
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
    let suffix = sections.length + 1;
    let id = `section-${type}-${suffix}`;
    while (sections.some((section) => section.id === id)) {
      suffix += 1;
      id = `section-${type}-${suffix}`;
    }
    const definition = blockRegistry[type];
    const newSection: Section = makeSection(type, id, definition?.label, {}, definition?.defaultContent || {});
    setSections(prev => [...prev, newSection]);
    setSelectedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedSection === id) setSelectedSection(null);
  };

  const switchPage = (pageId: string) => {
    const document = editorStore.getState().document;
    if (document.pages.some((page) => page.id === pageId)) applyDocumentToEditor(document, pageId);
  };
  const addSitePage = (duplicateId?: string) => {
    if (userPlan !== 'pro' && sitePages.length >= 3) { setShowUpgrade(true); return; }
    const store = editorStore.getState();
    let newId: string | null;
    if (duplicateId) newId = store.duplicatePage(duplicateId);
    else newId = store.addPage('New Page', [makeSection('hero', `hero-${Date.now()}`, 'Hero', {}, { title: 'New Page', description: 'Add a page introduction.' }), makeSection('cta', `cta-${Date.now()}`, 'Call to Action')]);
    if (newId) applyDocumentToEditor(editorStore.getState().document, newId);
  };
  const addPageFromTemplate = (preset: string) => {
    if (userPlan !== 'pro' && sitePages.length >= 3) { setShowUpgrade(true); return; }
    const presets: Record<string, Array<{ type: string; name?: string }>> = {
      About: [{ type: 'hero' }, { type: 'rich-text', name: 'Our story' }, { type: 'team' }, { type: 'cta' }],
      Services: [{ type: 'hero' }, { type: 'features' }, { type: 'steps' }, { type: 'cta' }],
      Pricing: [{ type: 'hero' }, { type: 'pricing' }, { type: 'faq' }, { type: 'cta' }],
      Contact: [{ type: 'hero' }, { type: 'contact' }, { type: 'newsletter' }],
      FAQ: [{ type: 'hero' }, { type: 'faq' }, { type: 'contact' }],
      Blog: [{ type: 'hero' }, { type: 'rich-text', name: 'Latest stories' }, { type: 'newsletter' }],
      Portfolio: [{ type: 'hero' }, { type: 'gallery' }, { type: 'testimonials' }, { type: 'contact' }],
      Privacy: [{ type: 'hero' }, { type: 'rich-text', name: 'Privacy policy' }],
      '404': [{ type: 'hero', name: 'Page not found' }, { type: 'cta' }],
    };
    const sections = (presets[preset] || presets.About).map((block, index) => makeSection(block.type, `${preset.toLowerCase()}-${block.type}-${Date.now()}-${index}`, block.name || blockRegistry[block.type]?.label, {}, blockRegistry[block.type]?.defaultContent || {}));
    const pageId = editorStore.getState().addPage(preset, sections);
    applyDocumentToEditor(editorStore.getState().document, pageId);
  };
  const deleteSitePage = (pageId: string) => {
    const page = editorStore.getState().document.pages.find((entry) => entry.id === pageId);
    if (!page || page.isHome || !window.confirm(`Delete the “${page.title}” page? This cannot be undone after saving.`)) return;
    if (editorStore.getState().removePage(pageId)) switchPage('home');
  };
  const updatePage = (pageId: string, patch: Partial<SitePage>) => setSitePages((items) => items.map((page) => page.id === pageId ? { ...page, ...patch } : page));
  const changePageSlug = (pageId: string, rawSlug: string) => {
    const slug = editorStore.getState().setPageSlug(pageId, rawSlug);
    updatePage(pageId, { slug: slug.replace(/^\//, '') });
  };
  const currentPage = sitePages.find((page) => page.id === activePageId) || sitePages[0];
  const updateMenuItem = (id: string, update: (item: (typeof editorDocument.menu)[number]) => (typeof editorDocument.menu)[number]) => {
    editorStore.getState().setMenu(editorStore.getState().document.menu.map((item) => item.id === id ? update(item) : item));
  };
  const reorderMenuItem = (id: string, targetIndex: number) => {
    const menu = [...editorStore.getState().document.menu];
    const index = menu.findIndex((item) => item.id === id);
    if (index < 0 || targetIndex < 0 || targetIndex >= menu.length) return;
    const [item] = menu.splice(index, 1);
    menu.splice(targetIndex, 0, item);
    editorStore.getState().setMenu(menu);
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

          <select aria-label="Current page" value={activePageId} onChange={(event) => switchPage(event.target.value)} className="hidden sm:block max-w-28 rounded-lg border-2 border-black bg-white px-2 py-1 font-mono text-[10px] font-bold">
            {sitePages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}
          </select>

          <span role="status" aria-live="polite" className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white px-2 py-1 font-mono text-[9px] font-bold text-neutral-600">
            <span className={`h-1.5 w-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : saveStatus === 'offline' ? 'bg-red-500' : saveStatus === 'saving' ? 'bg-yellow-500' : 'bg-pink'}`} />
            {saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving' : saveStatus === 'offline' ? 'Offline · local copy saved' : 'Unsaved changes'}
          </span>

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
              disabled={undoCount === 0}
              className="p-1.5 rounded-lg text-black hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={13} className="stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoCount === 0}
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

        {/* Right: Save, Export ZIP & Publish */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportZip}
            disabled={exportingZip || userPlan === 'loading'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black bg-yellow hover:bg-yellow/90 font-mono text-xs font-bold text-black shadow-[2px_2px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
            title={userPlan === 'pro' ? 'Download Next.js 16 source code as a ZIP archive' : 'Upgrade to Pro to export source code'}
          >
            {exportingZip ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} className="stroke-[2.5]" />}
            <span>{exportingZip ? 'Exporting…' : userPlan === 'loading' ? 'Checking plan…' : userPlan === 'pro' ? 'Export .zip' : 'Export .zip · Pro'}</span>
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
                sections,
                sectionSpacing,
                canvasElements,
                sitePages,
                assetUrl,
        logoUrl,
        faviconUrl,
                schemaVersion: 1,
                document: editorStore.getState().document,
              };
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem(`launchly_site_${template.id}`, JSON.stringify(payload));
                  localStorage.setItem(`launchly_site_${subdomain}`, JSON.stringify(payload));
                } catch {}
                window.open(`/live/${subdomain}?preview=1`, '_blank');
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

          <button type="button" onClick={() => setShowVersionHistory(true)} title="Version history" className="hidden md:inline-flex items-center gap-1 rounded-xl border-2 border-black bg-white px-2 py-1.5 font-mono text-[10px] font-bold hover:bg-yellow"><HistoryIcon size={13}/><span>History</span></button>

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
            { id: 'navigation', icon: MenuIcon, label: 'Navigation' },
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
            onClick={() => setLeftPanel('styles')}
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
            mobileTab === 'styles' && '!flex fixed inset-x-0 top-14 bottom-14 w-full z-40 bg-white',
            ['elements', 'pages', 'navigation', 'assets'].includes(mobileTab) && '!flex fixed inset-x-0 top-14 bottom-14 w-full z-40 bg-white'
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
                {sections.length > new Set(sections.map((section) => section.type)).size && <button type="button" onClick={removeDuplicateBlocks} className="w-full rounded-lg border border-black/20 bg-yellow/50 px-3 py-2 text-left font-mono text-[10px] font-bold text-black hover:bg-yellow">Remove duplicate blocks</button>}
                <div className="space-y-1.5">
                  {sections.map((section, idx) => (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={(event) => { setDraggedSectionId(section.id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', section.id); }}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => { event.preventDefault(); dropSectionOn(section.id); }}
                      onDragEnd={() => setDraggedSectionId(null)}
                      onClick={() => {
                        setSelectedSection(section.id);
                        if (mobileTab === 'sections') setMobileTab('canvas');
                      }}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 cursor-pointer transition-all',
                        `${selectedSection === section.id
                          ? 'border-black bg-pink text-black shadow-[2.5px_2.5px_0px_#000] font-bold'
                          : 'border-black/15 bg-white hover:border-black hover:bg-neutral-50 text-neutral-800 shadow-xs'} ${draggedSectionId === section.id ? 'opacity-50' : ''}`
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
                      <button type="button" aria-label={`${section.hidden?.[deviceMode] ? 'Show' : 'Hide'} ${section.name} on ${deviceMode}`} onClick={(e) => { e.stopPropagation(); setSections((items) => items.map((item) => item.id === section.id ? { ...item, hidden: { ...item.hidden, [deviceMode]: !item.hidden?.[deviceMode] } } : item)); }} className="p-1 text-neutral-500 hover:text-black">{section.hidden?.[deviceMode] ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
                      <button type="button" aria-label={`${section.locked ? 'Unlock' : 'Lock'} ${section.name}`} onClick={(e) => { e.stopPropagation(); setSections((items) => items.map((item) => item.id === section.id ? { ...item, locked: !item.locked } : item)); }} className="p-1 text-neutral-500 hover:text-black">{section.locked ? <Lock size={12}/> : <Unlock size={12}/>}</button>
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
                    {Object.values(blockRegistry).filter((block) => !['nav', 'footer'].includes(block.type)).map((block) => (
                      <button
                        key={block.type}
                        type="button"
                        onClick={() => {
                          addSection(block.type);
                          if (mobileTab === 'sections') setMobileTab('canvas');
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-black bg-white hover:bg-yellow font-mono text-[11px] font-bold text-black shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                        title={block.description}
                      >
                        <Plus size={11} className="stroke-[3]" />
                        <span>{block.label}</span>
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
                      { label: 'Text', key: 'textColor' },
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

                <div>
                  <label htmlFor="editor-font-family" className="font-mono text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2 block">Typography</label>
                  <select id="editor-font-family" value={theme.fontFamily} onChange={(e) => setTheme((prev) => ({ ...prev, fontFamily: e.target.value }))} className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 font-mono text-xs font-bold text-black">
                    <option value="Inter, sans-serif">Modern sans</option>
                    <option value="Arial, Helvetica, sans-serif">Clean classic</option>
                    <option value="Trebuchet MS, sans-serif">Friendly geometric</option>
                    <option value="Verdana, sans-serif">Readable UI</option>
                    <option value="system-ui, sans-serif">System UI</option>
                    <option value="'Courier New', monospace">Typewriter</option>
                    <option value="Palatino Linotype, Book Antiqua, serif">Premium serif</option>
                    <option value="Georgia, serif">Editorial serif</option>
                    <option value="ui-monospace, monospace">Monospace</option>
                  </select>
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

            {(leftPanel === 'elements' || mobileTab === 'elements') && (
              <div className="space-y-3">
                <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Add a block to your page</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(blockRegistry).filter((block) => !['nav', 'footer'].includes(block.type)).map((block) => (
                    <button key={block.type} type="button" title={block.description} onClick={() => addSection(block.type)} className="rounded-xl border-2 border-black bg-white px-2 py-3 font-mono text-xs font-bold shadow-[2px_2px_0_#000] hover:bg-yellow">＋ {block.label}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-black/15 pt-3">
                  <button type="button" onClick={() => addCanvasElement('image')} className="rounded-xl border-2 border-black bg-white px-2 py-3 font-mono text-xs font-bold shadow-[2px_2px_0_#000] hover:bg-yellow">＋ Image</button>
                  <button type="button" onClick={() => addCanvasElement('icon')} className="rounded-xl border-2 border-black bg-white px-2 py-3 font-mono text-xs font-bold shadow-[2px_2px_0_#000] hover:bg-yellow">＋ Icon</button>
                </div>
                <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Canvas elements</p>
                {canvasElements.map((item) => <div key={item.id} className="flex items-center gap-2 rounded-lg border border-black/20 bg-white p-2">
                  <button type="button" onClick={() => setSelectedElementId(item.id)} className="min-w-0 flex-1 truncate text-left font-mono text-xs">{item.name} · {item.type}</button>
                  {item.type === 'image' && <label className="cursor-pointer rounded border border-black px-2 py-1 font-mono text-[10px]">Upload<input type="file" accept="image/*" className="sr-only" onChange={(e) => readElementUpload(item.id, e.target.files?.[0])} /></label>}
                  {item.type === 'icon' && <><select aria-label="Choose icon" value={item.icon || 'Star'} onChange={(e) => updateCanvasElement(item.id, { icon: e.target.value, src: '' })} className="max-w-20 rounded border border-black p-1 text-xs">{['Star','Heart','Sparkles','Camera','CheckCircle2','ArrowUpRight'].map((name) => <option key={name}>{name}</option>)}</select><label className="cursor-pointer rounded border border-black px-2 py-1 font-mono text-[10px]">Upload<input type="file" accept="image/*" className="sr-only" onChange={(e) => readElementUpload(item.id, e.target.files?.[0])} /></label></>}
                  <button type="button" aria-label={`Delete ${item.name}`} onClick={() => { setCanvasElements((items) => items.filter((el) => el.id !== item.id)); if (selectedElementId === item.id) setSelectedElementId(null); }} className="text-red-600"><Trash2 size={14}/></button>
                </div>)}
              </div>
            )}

            {(leftPanel === 'pages' || mobileTab === 'pages') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between"><p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Site pages</p><span className="font-mono text-[9px] text-neutral-500">{sitePages.length}{userPlan === 'pro' ? ' · unlimited' : ' / 3 free'}</span></div>
                {sitePages.map((page, index) => <div key={page.id} draggable onDragStart={() => setDraggedPageId(page.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (!draggedPageId) return; editorStore.getState().reorderPage(draggedPageId, index); setDraggedPageId(null); applyDocumentToEditor(editorStore.getState().document, activePageId); }} className={`space-y-2 rounded-xl border-2 bg-white p-3 ${activePageId === page.id ? 'border-black shadow-[2px_2px_0_#000]' : 'border-black/15'}`}>
                  <div className="flex items-center gap-2"><button type="button" onClick={() => switchPage(page.id)} className="min-w-0 flex-1 truncate text-left font-mono text-xs font-bold">{page.isHome || page.id === 'home' ? '⌂ ' : '⠿ '}{page.title}</button><button type="button" title="Duplicate page" aria-label={`Duplicate ${page.title}`} onClick={() => addSitePage(page.id)}><Plus size={14}/></button>{!page.isHome && page.id !== 'home' && <button type="button" title="Delete page" aria-label={`Delete ${page.title}`} onClick={() => deleteSitePage(page.id)}><Trash2 size={14}/></button>}</div>
                  {activePageId === page.id && <div className="space-y-2 border-t border-black/10 pt-2">
                    <label className="block font-mono text-[9px] font-bold uppercase">Page name<input aria-label="Page name" value={page.title} onChange={(e) => updatePage(page.id, { title: e.target.value })} className="mt-1 w-full rounded-lg border border-black/30 px-2 py-1.5 font-mono text-xs font-bold" /></label>
                    <label className="block font-mono text-[9px] font-bold uppercase">URL slug<div className="mt-1 flex items-center rounded-lg border border-black/30 px-2"><span className="font-mono text-xs text-neutral-400">/</span><input aria-label="Page URL slug" value={slugDrafts[page.id] ?? (page.slug || (page.id === 'home' ? '' : page.id))} disabled={page.isHome || page.id === 'home'} onFocus={() => setSlugDrafts((drafts) => ({ ...drafts, [page.id]: page.slug || page.id }))} onChange={(e) => setSlugDrafts((drafts) => ({ ...drafts, [page.id]: e.target.value }))} onBlur={(e) => { changePageSlug(page.id, slugDrafts[page.id] ?? e.target.value); setSlugDrafts((drafts) => { const next = { ...drafts }; delete next[page.id]; return next; }); }} className="min-w-0 flex-1 bg-transparent py-1.5 font-mono text-xs disabled:text-neutral-400" /></div></label>
                    <label className="block font-mono text-[9px] font-bold uppercase">Page description<input aria-label="Page description" value={page.description} onChange={(e) => updatePage(page.id, { description: e.target.value })} className="mt-1 w-full rounded-lg border border-black/20 px-2 py-1.5 font-mono text-[10px]" placeholder="Page intro content" /></label>
                    <div className="flex flex-wrap gap-3 font-mono text-[10px]"><label className="flex items-center gap-1"><input type="checkbox" checked={page.showInMenu !== false && page.id !== 'home'} disabled={page.id === 'home' || page.isHome} onChange={(e) => updatePage(page.id, { showInMenu: e.target.checked })} />Show in menu</label><label className="flex items-center gap-1"><input type="checkbox" checked={page.noindex || false} onChange={(e) => updatePage(page.id, { noindex: e.target.checked })} />Hide from search</label></div>
                    <div className="flex flex-wrap gap-3 font-mono text-[10px]"><label className="flex items-center gap-1"><input type="checkbox" checked={page.useSharedHeader !== false} onChange={(e) => updatePage(page.id, { useSharedHeader: e.target.checked })} />Shared header</label><label className="flex items-center gap-1"><input type="checkbox" checked={page.useSharedFooter !== false} onChange={(e) => updatePage(page.id, { useSharedFooter: e.target.checked })} />Shared footer</label></div>
                    {!page.isHome && page.id !== 'home' && <button type="button" onClick={() => { editorStore.getState().setHomePage(page.id); applyDocumentToEditor(editorStore.getState().document, page.id); }} className="w-full rounded-lg border border-black bg-white py-1.5 font-mono text-[10px] font-bold hover:bg-yellow">Set as home page</button>}
                  </div>}
                </div>)}
                <button type="button" onClick={() => addSitePage()} className="w-full rounded-xl border-2 border-black bg-yellow p-2 font-mono text-xs font-bold">＋ Add page</button>
                <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">Add from page template<select aria-label="Add page from template" value="" onChange={(event) => { if (event.target.value) addPageFromTemplate(event.target.value); }} className="mt-1 w-full rounded-lg border-2 border-black bg-white px-2 py-2 font-mono text-xs font-bold text-black"><option value="">Choose a page layout…</option>{['About', 'Services', 'Pricing', 'Contact', 'FAQ', 'Blog', 'Portfolio', 'Privacy', '404'].map((preset) => <option key={preset}>{preset}</option>)}</select></label>
                <p className="text-[10px] font-mono leading-relaxed text-neutral-500">Drag pages to reorder. Page links use their saved slugs.</p>
              </div>
            )}

            {(leftPanel === 'navigation' || mobileTab === 'navigation') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between"><p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Navigation menu</p><span className="font-mono text-[9px] text-neutral-400">Drag to reorder</span></div>
                {editorDocument.menu.map((item, index) => <div key={item.id} draggable onDragStart={() => setDraggedMenuId(item.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedMenuId) reorderMenuItem(draggedMenuId, index); setDraggedMenuId(null); }} onDragEnd={() => setDraggedMenuId(null)} className="space-y-2 rounded-xl border-2 border-black/20 bg-white p-3">
                  <div className="flex items-center gap-2"><span aria-hidden="true" className="cursor-grab text-neutral-400">⠿</span><label className="min-w-0 flex-1 font-mono text-[9px] font-bold uppercase text-neutral-500">Label<input aria-label={`Navigation label ${index + 1}`} value={item.label} onChange={(event) => updateMenuItem(item.id, (current) => ({ ...current, label: event.target.value }))} className="mt-1 w-full rounded border border-black/20 px-2 py-1.5 font-mono text-xs font-normal normal-case text-black" /></label><button type="button" aria-label={`Move ${item.label} up`} disabled={index === 0} onClick={() => reorderMenuItem(item.id, index - 1)} className="rounded border border-black/20 px-2 py-1 disabled:opacity-30">↑</button><button type="button" aria-label={`Move ${item.label} down`} disabled={index === editorDocument.menu.length - 1} onClick={() => reorderMenuItem(item.id, index + 1)} className="rounded border border-black/20 px-2 py-1 disabled:opacity-30">↓</button><button type="button" aria-label={`Remove ${item.label}`} onClick={() => editorStore.getState().setMenu(editorStore.getState().document.menu.filter((entry) => entry.id !== item.id))} className="rounded border border-black/20 p-1 hover:bg-pink"><Trash2 size={13}/></button></div>
                  <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">Link target<select aria-label={`Link target for ${item.label}`} value={item.target.type} onChange={(event) => updateMenuItem(item.id, (current) => ({ ...current, target: { type: event.target.value as 'page' | 'url' | 'anchor', value: event.target.value === 'page' ? sitePages.find((page) => page.id !== 'home')?.id || 'home' : '' } }))} className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1.5 font-mono text-xs text-black"><option value="page">Site page</option><option value="url">External URL</option><option value="anchor">Section anchor</option></select></label>
                  {item.target.type === 'page' ? <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">Page<select aria-label={`Page for ${item.label}`} value={item.target.value} onChange={(event) => updateMenuItem(item.id, (current) => ({ ...current, target: { type: 'page', value: event.target.value } }))} className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1.5 font-mono text-xs text-black">{sitePages.map((page) => <option key={page.id} value={page.id}>{page.title}</option>)}</select></label> : <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">{item.target.type === 'url' ? 'URL' : 'Anchor ID'}<input aria-label={`${item.target.type} for ${item.label}`} value={item.target.value} onChange={(event) => updateMenuItem(item.id, (current) => ({ ...current, target: { ...current.target, value: event.target.value } }))} placeholder={item.target.type === 'url' ? 'https://example.com' : 'section-id'} className="mt-1 w-full rounded border border-black/20 px-2 py-1.5 font-mono text-xs text-black" /></label>}
                  <label className="flex items-center gap-1 font-mono text-[10px]"><input type="checkbox" checked={item.newTab} onChange={(event) => updateMenuItem(item.id, (current) => ({ ...current, newTab: event.target.checked }))}/>Open in new tab</label>
                </div>)}
                <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => { const page = sitePages.find((candidate) => candidate.id !== 'home' && !editorDocument.menu.some((item) => item.target.type === 'page' && item.target.value === candidate.id)); if (!page) return; editorStore.getState().setMenu([...editorStore.getState().document.menu, { id: `menu-${page.id}`, label: page.title, target: { type: 'page', value: page.id }, newTab: false }]); }} className="rounded-lg border-2 border-black bg-yellow px-2 py-2 font-mono text-[10px] font-bold">＋ Page link</button><button type="button" onClick={() => editorStore.getState().setMenu([...editorStore.getState().document.menu, { id: `menu-url-${Date.now()}`, label: 'External link', target: { type: 'url', value: 'https://' }, newTab: true }])} className="rounded-lg border-2 border-black bg-white px-2 py-2 font-mono text-[10px] font-bold"><ExternalLink size={12} className="mr-1 inline"/>＋ URL link</button></div>
                <p className="font-mono text-[9px] leading-relaxed text-neutral-500">Page links stay connected when page titles or slugs change.</p>
              </div>
            )}

            {(leftPanel === 'assets' || mobileTab === 'assets') && (
              <div className="space-y-3">
                <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Brand identity</p>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-black/40 bg-white p-3 text-center font-mono text-xs font-bold text-black hover:bg-yellow">Upload site logo<input type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setLogoUrl(String(reader.result || '')); reader.readAsDataURL(file); }} /></label>
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-black/40 bg-white p-3 text-center font-mono text-xs font-bold text-black hover:bg-yellow">Upload favicon<input type="file" accept="image/png,image/x-icon,image/svg+xml,image/jpeg" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setFaviconUrl(String(reader.result || '')); reader.readAsDataURL(file); }} /></label>
                {logoUrl && <div className="flex items-center gap-2 rounded-xl border border-black/20 bg-white p-2"><NextImage src={logoUrl} alt="Site logo preview" width={40} height={40} unoptimized className="h-10 w-10 rounded object-contain" /><button type="button" onClick={() => setLogoUrl('')} className="font-mono text-xs underline">Remove logo</button></div>}
                {faviconUrl && <div className="flex items-center gap-2 rounded-xl border border-black/20 bg-white p-2"><NextImage src={faviconUrl} alt="Favicon preview" width={32} height={32} unoptimized className="h-8 w-8 rounded object-contain" /><button type="button" onClick={() => setFaviconUrl('')} className="font-mono text-xs underline">Remove favicon</button></div>}
                <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Product image asset</p>
                <input type="url" value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} placeholder="Paste an image URL" className="w-full rounded-xl border-2 border-black bg-white px-3 py-2 font-mono text-xs text-black" />
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-black/40 bg-white p-4 text-center font-mono text-xs font-bold text-black hover:bg-yellow">
                  Upload image<input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setAssetUrl(String(reader.result || ''));
                    reader.readAsDataURL(file);
                  }} />
                </label>
                {assetUrl && <div className="space-y-2">
                  {/* Dynamic user-provided images can come from any host or a local data URL. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetUrl} alt="Selected product asset preview" className="w-full h-36 rounded-xl border-2 border-black object-cover" />
                  <button type="button" onClick={() => setAssetUrl('')} className="w-full rounded-lg border border-black bg-white py-2 font-mono text-xs font-bold">Remove image</button>
                </div>}
                <p className="font-mono text-[10px] text-neutral-500">The selected image appears on featured product cards and is saved with your draft.</p>
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
              width: DEVICE_WIDTHS[deviceMode],
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
                <span className="truncate">https://{siteTitle.toLowerCase().replace(/\s+/g, '-')}.launchly.site{currentPage?.slug ? `/${currentPage.slug}` : ''}</span>
              </div>
              <span className="hidden sm:inline font-mono text-[10px] font-black uppercase text-neutral-400">
                {deviceMode}
              </span>
            </div>

            {/* Editable Content Frame */}
            <div data-canvas-frame className="flex-1 overflow-y-auto">
              <CanvasContent
                sections={sections}
                sitePages={sitePages}
                menuItems={editorDocument.menu}
                sectionSpacing={sectionSpacing}
                canvasElements={canvasElements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onMoveElement={(id, x, y) => updateCanvasElement(id, { x, y })}
                onNavigatePage={switchPage}
                selectedSection={selectedSection}
                theme={theme}
                siteTitle={siteTitle}
                heroContent={heroContent}
                featuresContent={featuresContent}
                testimonialsContent={testimonialsContent}
                ctaContent={ctaContent}
                onUpdateSectionContent={(sectionId, content) => setSections((items) => items.map((item) => item.id === sectionId ? { ...item, content } : item))}
                onSelectSection={(id) => { setSelectedSection(id); setSelectedElementId(null); }}
                assetUrl={assetUrl}
                logoUrl={logoUrl}
                deviceMode={deviceMode}
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
              <span>{selectedElementId ? 'Element Properties' : selectedSection ? `${sections.find(s => s.id === selectedSection)?.name || ''} Properties` : 'Inspector'}</span>
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
            {selectedElementId ? (() => { const item = canvasElements.find((element) => element.id === selectedElementId); return item ? <ElementProperties item={item} onChange={(patch) => updateCanvasElement(item.id, patch)} /> : null; })() : selectedSection ? (
              <SectionProperties
                sectionId={selectedSection}
                sections={sections}
                theme={theme}
                setSectionStyle={(style) => setSections((items) => items.map((item) => item.id === selectedSection ? { ...item, style: { ...item.style, ...style } } : item))}
                setSectionContent={(content) => setSections((items) => items.map((item) => item.id === selectedSection ? { ...item, content } : item))}
                setSectionSettings={(settings) => setSections((items) => items.map((item) => item.id === selectedSection ? { ...item, ...settings } : item))}
                sectionSpacing={sectionSpacing[selectedSection] || DEFAULT_SPACING}
                setSectionSpacing={(nextSpacing) => setSectionSpacing((current) => ({ ...current, [selectedSection]: typeof nextSpacing === 'function' ? nextSpacing(current[selectedSection] || DEFAULT_SPACING) : nextSpacing }))}
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
          { id: 'elements' as const, label: 'Add', icon: Plus },
          { id: 'pages' as const, label: 'Pages', icon: ChevronRight },
          { id: 'navigation' as const, label: 'Menu', icon: MenuIcon },
          { id: 'assets' as const, label: 'Assets', icon: ImageIcon },
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
          isPro={userPlan === 'pro'}
          sitePayload={{
            siteName: siteTitle,
            templateId: template.id,
            theme,
            heroContent,
            featuresContent,
            testimonialsContent,
            ctaContent,
            sections,
            sectionSpacing,
            canvasElements,
                sitePages,
            assetUrl,
            logoUrl,
            faviconUrl,
            schemaVersion: 1,
            document: editorDocument,
          }}
        />
      )}

      {showVersionHistory && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="version-history-title">
        <div className="w-full max-w-lg rounded-2xl border-[3px] border-black bg-white p-5 shadow-[8px_8px_0_#000]">
          <div className="mb-4 flex items-center justify-between"><h2 id="version-history-title" className="font-display text-lg font-black">Version history</h2><button type="button" onClick={() => setShowVersionHistory(false)} aria-label="Close version history" className="rounded-lg border border-black p-1 hover:bg-yellow"><X size={16}/></button></div>
          <p className="mb-3 font-mono text-xs text-neutral-600">Up to 20 autosave and manual snapshots are kept in this browser.</p>
          <div className="max-h-80 space-y-2 overflow-y-auto">{[...versions].reverse().map((version) => <div key={version.id} className="flex items-center gap-3 rounded-xl border border-black/20 p-3"><div className="min-w-0 flex-1"><p className="truncate font-mono text-xs font-bold">{version.label}</p><p className="text-[10px] text-neutral-500">{new Date(version.createdAt).toLocaleString()}</p></div><button type="button" onClick={() => { if (!window.confirm(`Restore “${version.label}”? This replaces the current editor content.`)) return; if (editorStore.getState().restoreVersion(version.id)) applyDocumentToEditor(editorStore.getState().document); setShowVersionHistory(false); }} className="rounded-lg border-2 border-black bg-yellow px-3 py-1.5 font-mono text-[10px] font-bold">Restore</button></div>)}{versions.length === 0 && <div className="rounded-xl border border-dashed border-black/30 p-8 text-center font-mono text-xs text-neutral-500">No saved versions yet. Versions are captured during autosave and when you save manually.</div>}</div>
        </div>
      </div>}

      {showUpgrade && <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
        <div className="w-full max-w-sm rounded-3xl border-[3px] border-black bg-white p-6 text-center shadow-[8px_8px_0_#000]">
          <button type="button" onClick={() => setShowUpgrade(false)} aria-label="Close" className="float-right rounded-lg p-1 hover:bg-neutral-100"><X size={18} /></button>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-yellow"><Download size={22} /></div>
          <h2 id="upgrade-title" className="font-display text-xl font-black">Export is a Pro feature</h2>
          <p className="mt-2 font-mono text-xs text-neutral-600">Upgrade to download your complete site source as a ZIP file.</p>
          <a href="/checkout?plan=pro" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-pink px-4 py-3 font-display text-sm font-black shadow-[3px_3px_0_#000] hover:bg-yellow">Upgrade to Pro <ArrowUpRight size={15} /></a>
        </div>
      </div>}

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
  sectionSpacing,
  sitePages,
  menuItems,
  canvasElements,
  selectedElementId,
  onSelectElement,
  onMoveElement,
  onNavigatePage,
  selectedSection,
  theme,
  siteTitle,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
  onUpdateSectionContent,
  onSelectSection,
  assetUrl,
  logoUrl,
  deviceMode,
}: {
  sections: Section[];
  sectionSpacing: Record<string, SectionSpacing>;
  sitePages: SitePage[];
  menuItems: MenuItem[];
  canvasElements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onMoveElement: (id: string, x: number, y: number) => void;
  onNavigatePage: (id: string) => void;
  selectedSection: string | null;
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  siteTitle: string;
  heroContent: Record<string, string>;
  featuresContent: Array<{ title: string; desc: string }>;
  testimonialsContent: Array<{ quote: string; name: string; role: string }>;
  ctaContent: { title: string; desc: string; buttonText: string };
  onUpdateSectionContent: (sectionId: string, content: Record<string, unknown>) => void;
  onSelectSection: (id: string) => void;
  assetUrl: string;
  logoUrl: string;
  deviceMode: DeviceMode;
}) {
  return (
    <div data-editable-canvas style={{ fontFamily: theme.fontFamily }} className="relative min-h-full flex flex-col">
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          sitePages={sitePages}
          menuItems={menuItems}
          onNavigatePage={onNavigatePage}
          spacing={sectionSpacing[section.id] || DEFAULT_SPACING}
          isSelected={selectedSection === section.id}
          theme={{ ...theme, primaryColor: section.style?.accentColor || theme.primaryColor, borderRadius: section.style?.borderRadius || theme.borderRadius }}
          siteTitle={siteTitle}
          heroContent={heroContent}
          featuresContent={featuresContent}
          testimonialsContent={testimonialsContent}
          ctaContent={ctaContent}
          onUpdateSectionContent={onUpdateSectionContent}
          onSelect={() => onSelectSection(section.id)}
          assetUrl={assetUrl}
          logoUrl={logoUrl}
          deviceMode={deviceMode}
        />
      ))}
      {canvasElements.map((item) => {
        const IconComponent = ({ Star, Heart, Sparkles, Camera, CheckCircle2, ArrowUpRight } as Record<string, typeof Star>)[item.icon || 'Star'] || Star;
        return <div key={item.id} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); onSelectElement(item.id); }} onPointerMove={(event) => { if (event.buttons !== 1) return; const rect = event.currentTarget.parentElement?.getBoundingClientRect(); if (rect) onMoveElement(item.id, Math.max(0, event.clientX - rect.left - item.width / 2), Math.max(0, event.clientY - rect.top - item.height / 2)); }} onClick={() => onSelectElement(item.id)} className={`absolute z-20 cursor-move touch-none ${selectedElementId === item.id ? 'outline outline-2 outline-pink outline-offset-2' : ''}`} style={{ left: item.x, top: item.y, width: item.width, height: item.height }}>
          {item.src ? <NextImage src={item.src} alt={item.name} width={item.width} height={item.height} unoptimized draggable={false} className={`h-full w-full ${item.type === 'image' ? 'rounded-lg object-cover' : 'object-contain'}`} /> : item.type === 'image' ? <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-black/50 bg-yellow/30 text-black"><ImageIcon/><span className="font-mono text-[10px]">Upload image</span></div> : <div className="flex h-full w-full items-center justify-center rounded-xl bg-pink/30 text-black"><IconComponent size={Math.min(item.width, item.height) * .65} /></div>}
        </div>;
      })}
    </div>
  );
}

function ElementProperties({ item, onChange }: { item: CanvasElement; onChange: (patch: Partial<CanvasElement>) => void }) {
  const fields: Array<[keyof Pick<CanvasElement, 'x' | 'y' | 'width' | 'height'>, string]> = [['x','Horizontal position'],['y','Vertical position'],['width','Width'],['height','Height']];
  return <div className="space-y-4">
    <label className="block text-xs font-bold">Name<input value={item.name} onChange={(e) => onChange({ name: e.target.value })} className="mt-1 w-full rounded-lg border-2 border-black px-3 py-2 font-mono text-xs" /></label>
    {item.type === 'icon' && <label className="block text-xs font-bold">Icon<input value={item.icon || 'Star'} onChange={(e) => onChange({ icon: e.target.value, src: '' })} list="editor-icon-options" className="mt-1 w-full rounded-lg border-2 border-black px-3 py-2 font-mono text-xs" /><datalist id="editor-icon-options">{['Star','Heart','Sparkles','Camera','CheckCircle2','ArrowUpRight'].map((icon) => <option key={icon} value={icon}/>)}</datalist></label>}
    <label className="block text-xs font-bold">{item.type === 'image' ? 'Image URL' : 'Custom icon image URL'}<input type="url" value={item.src?.startsWith('data:') ? '' : item.src || ''} onChange={(e) => onChange({ src: e.target.value })} placeholder="https://…" className="mt-1 w-full rounded-lg border-2 border-black px-3 py-2 font-mono text-xs" /></label>
    <label className="block cursor-pointer rounded-lg border-2 border-dashed border-black p-3 text-center font-mono text-xs font-bold">Upload {item.type === 'image' ? 'image' : 'icon image'}<input type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onChange({ src: String(reader.result || ''), name: file.name }); reader.readAsDataURL(file); }} /></label>
    <p className="font-mono text-[10px] font-bold uppercase text-neutral-500">Position & size (px)</p>
    <div className="grid grid-cols-2 gap-2">{fields.map(([key, label]) => <label key={key} className="text-[10px] font-bold">{label}<input type="number" min={key === 'width' || key === 'height' ? 16 : 0} value={item[key]} onChange={(e) => onChange({ [key]: Math.max(key === 'width' || key === 'height' ? 16 : 0, Number(e.target.value) || 0) })} className="mt-1 w-full rounded-lg border-2 border-black px-2 py-2 font-mono text-xs" /></label>)}</div>
    <button type="button" onClick={() => onChange({ x: 0 })} className="w-full rounded-lg border border-black bg-white py-2 font-mono text-xs">Align to left edge</button>
  </div>;
}

function SectionRenderer({
  section,
  sitePages,
  menuItems,
  onNavigatePage,
  spacing,
  isSelected,
  theme,
  siteTitle,
  heroContent,
  featuresContent,
  testimonialsContent,
  ctaContent,
  onUpdateSectionContent,
  onSelect,
  assetUrl,
  logoUrl,
  deviceMode,
}: {
  section: Section;
  sitePages: SitePage[];
  menuItems: MenuItem[];
  onNavigatePage: (id: string) => void;
  spacing: SectionSpacing;
  isSelected: boolean;
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  siteTitle: string;
  heroContent: Record<string, string>;
  featuresContent: Array<{ title: string; desc: string }>;
  testimonialsContent: Array<{ quote: string; name: string; role: string }>;
  ctaContent: { title: string; desc: string; buttonText: string };
  onUpdateSectionContent: (sectionId: string, content: Record<string, unknown>) => void;
  onSelect: () => void;
  assetUrl: string;
  logoUrl: string;
  deviceMode: DeviceMode;
}) {
  const sectionContent = section.content || {};
  const sectionHero = { ...heroContent, ...(sectionContent as Partial<typeof heroContent>) } as typeof heroContent;
  const sectionFeatures = Array.isArray(sectionContent.items) ? sectionContent.items as typeof featuresContent : featuresContent;
  const sectionTestimonials = Array.isArray(sectionContent.items) ? sectionContent.items as typeof testimonialsContent : testimonialsContent;
  const sectionCta = { ...ctaContent, ...(sectionContent as Partial<typeof ctaContent>) };
  const setHero = (update: React.SetStateAction<typeof heroContent>) => {
    const next = typeof update === 'function' ? update(sectionHero) : update;
    onUpdateSectionContent(section.id, { ...sectionContent, ...next });
  };
  const setFeatures = (update: React.SetStateAction<typeof featuresContent>) => {
    const next = typeof update === 'function' ? update(sectionFeatures) : update;
    onUpdateSectionContent(section.id, { ...sectionContent, items: next });
  };
  const setTestimonials = (update: React.SetStateAction<typeof testimonialsContent>) => {
    const next = typeof update === 'function' ? update(sectionTestimonials) : update;
    onUpdateSectionContent(section.id, { ...sectionContent, items: next });
  };
  const setCta = (update: React.SetStateAction<typeof ctaContent>) => {
    const next = typeof update === 'function' ? update(sectionCta) : update;
    onUpdateSectionContent(section.id, { ...sectionContent, ...next });
  };
  const heading = typeof sectionContent.heading === 'string' ? sectionContent.heading : section.name;
  const blockItems = Array.isArray(sectionContent.items) ? sectionContent.items as Array<Record<string, unknown>> : [];
  const textValue = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
  const updateBlockItem = (index: number, key: string, value: unknown) => onUpdateSectionContent(section.id, { ...sectionContent, items: blockItems.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const renderMenuItem = (item: MenuItem) => {
    if (item.target.type === 'page') {
      const page = sitePages.find((entry) => entry.id === item.target.value);
      return page ? <button key={item.id} type="button" onClick={(event) => { event.stopPropagation(); onNavigatePage(page.id); setMobileMenuOpen(false); }} className="hover:text-black hover:underline cursor-pointer">{item.label}</button> : null;
    }
    const href = item.target.type === 'anchor' ? `#${item.target.value.replace(/^#/, '')}` : item.target.value;
    const safeHref = item.target.type === 'anchor' || /^(https?:|mailto:|tel:)/i.test(href) ? href : '';
    return safeHref ? <a key={item.id} href={safeHref} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noopener noreferrer' : undefined} onClick={(event) => event.stopPropagation()} className="hover:text-black hover:underline">{item.label}</a> : null;
  };
  return (
    <div
      id={section.anchorId || section.id}
      style={{ padding: `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`, backgroundColor: section.style?.highlightColor || section.style?.backgroundColor, color: section.style?.overrides?.[deviceMode]?.color as string | undefined, textAlign: section.style?.textAlign, fontWeight: section.style?.fontWeight, fontStyle: section.style?.fontStyle, textDecoration: section.style?.textDecoration, display: section.hidden?.[deviceMode] ? 'none' : undefined }}
      className={cn(
        'relative group cursor-pointer transition-all',
        section.locked && 'cursor-not-allowed pointer-events-none opacity-75',
        isSelected && 'outline-[3px] outline-pink outline-offset-[-3px] shadow-[inset_0_0_0_2px_#000]'
      )}
      onClick={() => { if (!section.locked) onSelect(); }}
    >
      {/* Navigation Block */}
      {section.type === 'nav' && (
        <>
        <nav className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-4 border-b-2 border-black/10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {logoUrl ? <NextImage src={logoUrl} alt={`${siteTitle} logo`} width={32} height={32} unoptimized className="h-8 w-8 rounded-lg object-contain" /> : <div
              style={{ backgroundColor: theme.primaryColor }}
              className="w-7 h-7 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center font-display font-black text-xs text-black"
            >
              {siteTitle.charAt(0)}
            </div>}
            <span className="font-display font-black text-sm sm:text-base text-ink tracking-tight">
              {siteTitle}
            </span>
          </div>

          <div className={cn('hidden sm:flex items-center gap-6 font-mono text-xs font-bold text-neutral-700', deviceMode === 'mobile' && 'hidden')}>
            {menuItems.map(renderMenuItem)}
          </div>
          <button type="button" aria-expanded={mobileMenuOpen} aria-label="Toggle site navigation" onClick={(event) => { event.stopPropagation(); setMobileMenuOpen((open) => !open); }} className="sm:hidden rounded-lg border border-black px-2 py-1 font-mono text-xs font-bold">{mobileMenuOpen ? 'Close' : 'Menu'}</button>

          <button
            type="button"
            disabled={!menuItems.length}
            onClick={(event) => {
              event.stopPropagation();
              const target = menuItems[0]?.target;
              if (target?.type === 'page') onNavigatePage(target.value);
              else if (target?.type === 'anchor') document.getElementById(target.value.replace(/^#/, ''))?.scrollIntoView({ behavior: 'smooth' });
              else if (target?.type === 'url' && /^(https?:|mailto:|tel:)/i.test(target.value)) window.open(target.value, menuItems[0].newTab ? '_blank' : '_self', 'noopener,noreferrer');
            }}
            style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
            className="px-3 sm:px-4 py-1.5 rounded-xl border-2 border-black font-display text-xs font-black text-black shadow-[2px_2px_0px_#000] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Get Started
          </button>
        </nav>
        {mobileMenuOpen && <nav aria-label="Mobile navigation" className="sm:hidden border-b-2 border-black bg-white px-4 py-3"><div className="flex flex-col gap-3 font-mono text-xs font-bold">{menuItems.map(renderMenuItem)}</div></nav>}
        </>
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
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setHero((prev) => ({ ...prev, badge: (e.target as HTMLElement).innerText }))}
            >
              <span>{sectionHero.badge}</span>
            </div>

            {/* Editable Headline */}
            <h1
              className="font-display text-2xl sm:text-5xl font-black tracking-tight leading-tight outline-none focus:ring-2 focus:ring-pink rounded-lg p-1"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setHero((prev) => ({ ...prev, title: (e.target as HTMLElement).innerText }))}
            >
              {sectionHero.title}
            </h1>

            {/* Editable Description */}
            <p
              className="font-mono text-xs sm:text-sm opacity-80 max-w-lg mx-auto leading-relaxed outline-none focus:ring-2 focus:ring-pink rounded-lg p-1"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setHero((prev) => ({ ...prev, description: (e.target as HTMLElement).innerText }))}
            >
              {sectionHero.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-black font-display text-xs sm:text-sm font-black text-black shadow-[2.5px_2.5px_0px_#000] flex items-center gap-1.5 cursor-pointer"
              >
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, ctaPrimary: (e.target as HTMLElement).innerText }))}>{sectionHero.ctaPrimary}</span>
                <ArrowUpRight size={14} className="stroke-[3]" />
              </button>
              <button
                type="button"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-current bg-white/10 hover:bg-white/20 font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, ctaSecondary: (e.target as HTMLElement).innerText }))}>{sectionHero.ctaSecondary}</span>
              </button>
            </div>

            {/* Live Telemetry Radar Pills */}
            <div className="pt-4 sm:pt-6 grid grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto text-left">
              <div className="rounded-xl border border-current/20 bg-white/5 p-2.5 sm:p-3 backdrop-blur-sm">
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, stat1Label: (e.target as HTMLElement).innerText }))} className="font-mono text-[8px] sm:text-[9px] font-bold opacity-60 block uppercase">
                  {sectionHero.stat1Label}
                </span>
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, stat1Value: (e.target as HTMLElement).innerText }))} className="font-display text-sm sm:text-base font-black">{sectionHero.stat1Value}</span>
              </div>
              <div className="rounded-xl border border-current/20 bg-white/5 p-2.5 sm:p-3 backdrop-blur-sm">
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, stat2Label: (e.target as HTMLElement).innerText }))} className="font-mono text-[8px] sm:text-[9px] font-bold opacity-60 block uppercase">
                  {sectionHero.stat2Label}
                </span>
                <span contentEditable suppressContentEditableWarning onInput={(e) => setHero((prev) => ({ ...prev, stat2Value: (e.target as HTMLElement).innerText }))} className="font-display text-sm sm:text-base font-black">{sectionHero.stat2Value}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Block */}
      {section.type === 'features' && (
        <div className="py-12 sm:py-16 px-4 sm:px-12 bg-white text-black border-y-2 border-black/10">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <h2 className="font-display text-xl sm:text-3xl font-black tracking-tight" contentEditable suppressContentEditableWarning onInput={(e) => onUpdateSectionContent(section.id, { ...sectionContent, heading: (e.target as HTMLElement).innerText })}>
              {heading === section.name ? 'Engineered for hyper-scale precision.' : heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {sectionFeatures.map((f: { title: string; desc: string }, i: number) => (
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
                <h3 className="font-display font-black text-sm sm:text-base mb-1" contentEditable suppressContentEditableWarning onInput={(e) => setFeatures((prev) => prev.map((item, index) => index === i ? { ...item, title: (e.target as HTMLElement).innerText } : item))}>
                  {f.title}
                </h3>
                <p className="font-mono text-xs text-neutral-600 leading-relaxed" contentEditable suppressContentEditableWarning onInput={(e) => setFeatures((prev) => prev.map((item, index) => index === i ? { ...item, desc: (e.target as HTMLElement).innerText } : item))}>
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
            <h2 className="font-display text-xl sm:text-3xl font-black" contentEditable suppressContentEditableWarning onInput={(e) => onUpdateSectionContent(section.id, { ...sectionContent, heading: (e.target as HTMLElement).innerText })}>
              {heading === section.name ? 'Trusted by world-class teams.' : heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-3xl mx-auto">
            {sectionTestimonials.map((item: { quote: string; name: string; role: string }, idx: number) => (
              <div key={idx} className="p-4 sm:p-6 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] flex flex-col justify-between">
                <div className="flex gap-1 mb-2.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-yellow text-black stroke-[1.5]" />
                  ))}
                </div>
                <p className="font-mono text-xs sm:text-[13px] leading-relaxed mb-4 text-neutral-800" contentEditable suppressContentEditableWarning onInput={(e) => setTestimonials((prev) => prev.map((item, index) => index === idx ? { ...item, quote: (e.target as HTMLElement).innerText.replace(/[“”\"]/g, '') } : item))}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="pt-3 border-t border-black/10 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border border-black bg-lilac flex items-center justify-center font-mono font-bold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 contentEditable suppressContentEditableWarning onInput={(e) => setTestimonials((prev) => prev.map((entry, index) => index === idx ? { ...entry, name: (e.target as HTMLElement).innerText } : entry))} className="font-display font-black text-xs text-black">{item.name}</h4>
                    <p contentEditable suppressContentEditableWarning onInput={(e) => setTestimonials((prev) => prev.map((entry, index) => index === idx ? { ...entry, role: (e.target as HTMLElement).innerText } : entry))} className="font-mono text-[9px] sm:text-[10px] text-neutral-500">{item.role}</p>
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
            <h2 className="font-display text-xl sm:text-3xl font-black" contentEditable suppressContentEditableWarning onInput={(e) => setCta((prev) => ({ ...prev, title: (e.target as HTMLElement).innerText }))}>
              {sectionCta.title}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-400" contentEditable suppressContentEditableWarning onInput={(e) => setCta((prev) => ({ ...prev, desc: (e.target as HTMLElement).innerText }))}>
              {sectionCta.desc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                style={{ backgroundColor: theme.primaryColor, borderRadius: theme.borderRadius }}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-white font-display text-xs sm:text-sm font-black text-black shadow-[3px_3px_0px_#FFFFFF] cursor-pointer"
              >
                <span contentEditable suppressContentEditableWarning onInput={(e) => setCta((prev) => ({ ...prev, buttonText: (e.target as HTMLElement).innerText }))}>{sectionCta.buttonText}</span>
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
      {section.type === 'divider' && <hr aria-label="Section divider" className="mx-auto w-full max-w-5xl border-0 border-t-2 border-black/20" />}
      {['gallery', 'pricing', 'contact', 'stats', 'faq', 'team', 'steps', 'newsletter', 'rich-text', 'image-text', 'announcement'].includes(section.type) && (
        <section className="py-12 sm:py-16 px-4 sm:px-12 bg-[#FAF9F6] text-black">
          <div className="max-w-4xl mx-auto">
            {section.type !== 'divider' && <div className="text-center mb-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.primaryColor }}>{siteTitle}</p>
              <h2 contentEditable suppressContentEditableWarning onInput={(e) => onUpdateSectionContent(section.id, { ...sectionContent, heading: (e.target as HTMLElement).innerText })} className="font-display text-2xl sm:text-3xl font-black mt-2">{heading}</h2>
              {typeof sectionContent.description === 'string' && <p contentEditable suppressContentEditableWarning onInput={(e) => onUpdateSectionContent(section.id, { ...sectionContent, description: (e.target as HTMLElement).innerText })} className="font-mono text-xs text-neutral-600 mt-2">{sectionContent.description}</p>}
            </div>}
            {section.type === 'contact' ? (
              formSubmitted ? <p role="status" className="mx-auto max-w-lg rounded-xl border-2 border-black bg-white p-4 text-center font-mono text-sm">{textValue(sectionContent.successMessage, 'Thanks for reaching out. We will be in touch soon.')}</p> : <form className="max-w-lg mx-auto grid gap-3" onSubmit={(event) => { event.preventDefault(); setFormSubmitted(true); }}>
                <input required aria-label="Your name" placeholder="Your name" className="rounded-xl border-2 border-black bg-white px-4 py-3 font-mono text-sm" />
                <input required type="email" aria-label="Email address" placeholder="Email address" className="rounded-xl border-2 border-black bg-white px-4 py-3 font-mono text-sm" />
                <textarea required aria-label="Message" placeholder="How can we help?" rows={4} className="rounded-xl border-2 border-black bg-white px-4 py-3 font-mono text-sm" />
                <button type="submit" className="rounded-xl border-2 border-black px-4 py-3 font-display font-black shadow-[3px_3px_0px_#000]" style={{ backgroundColor: theme.primaryColor }}>{textValue(sectionContent.submitLabel, 'Send message')}</button>
              </form>
            ) : section.type === 'newsletter' ? (
              formSubmitted ? <p role="status" className="mx-auto max-w-lg rounded-xl border-2 border-black bg-white p-4 text-center font-mono text-sm">You are subscribed. Thank you!</p> : <form className="mx-auto flex max-w-lg flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); setFormSubmitted(true); }}><label className="sr-only" htmlFor={`newsletter-${section.id}`}>Email address</label><input id={`newsletter-${section.id}`} required type="email" placeholder="Email address" className="min-w-0 flex-1 rounded-xl border-2 border-black bg-white px-4 py-3 font-mono text-sm"/><button type="submit" className="rounded-xl border-2 border-black px-4 py-3 font-display font-black shadow-[3px_3px_0px_#000]" style={{ backgroundColor: theme.primaryColor }}>{textValue(sectionContent.submitLabel, 'Subscribe')}</button></form>
            ) : section.type === 'pricing' ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">{blockItems.map((item, index) => <article key={`${section.id}-plan-${index}`} className={`rounded-2xl border-2 border-black bg-white p-5 shadow-[3px_3px_0px_#000] ${item.highlighted ? 'ring-2 ring-offset-2' : ''}`} style={item.highlighted ? { outlineColor: theme.primaryColor } : undefined}><h3 contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'title', (e.target as HTMLElement).innerText)} className="font-display text-lg font-black">{textValue(item.title, 'Plan')}</h3><p className="mt-2 font-mono text-xs text-neutral-600">{textValue(item.description)}</p><p className="my-4 font-display text-3xl font-black">{textValue(item.price)}<span className="font-mono text-xs font-normal">{textValue(item.interval)}</span></p><ul className="space-y-2 font-mono text-xs">{(Array.isArray(item.features) ? item.features as string[] : []).map((feature, featureIndex) => <li key={featureIndex}>✓ {feature}</li>)}</ul><p className="mt-4 rounded-lg bg-neutral-100 px-3 py-2 text-center font-mono text-xs">Choose a plan by contacting us.</p></article>)}</div>
            ) : section.type === 'gallery' ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">{blockItems.map((item, index) => <article key={`${section.id}-item-${index}`} className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0px_#000]"><div className="h-36 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}55, ${theme.primaryColor}15)` }}>{textValue(item.image, assetUrl) ? <><NextImage src={textValue(item.image, assetUrl)} alt={textValue(item.title, 'Gallery image')} width={900} height={700} unoptimized className="h-full w-full object-cover" /></> : <span className="font-display text-4xl font-black" aria-hidden="true">0{index + 1}</span>}</div><div className="p-4"><h3 contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'title', (e.target as HTMLElement).innerText)} className="font-display font-black">{textValue(item.title, 'Featured item')}</h3><p contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'desc', (e.target as HTMLElement).innerText)} className="mt-1 font-mono text-xs text-neutral-500">{textValue(item.desc)}</p>{typeof item.price === 'string' && <p className="mt-4 font-display font-black">{item.price}</p>}</div></article>)}</div>
            ) : section.type === 'faq' ? (
              <div className="mx-auto max-w-3xl divide-y-2 divide-black/10 rounded-2xl border-2 border-black bg-white px-5">{blockItems.map((item, index) => <div key={`${section.id}-faq-${index}`} className="py-4"><button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq((current) => current === index ? null : index)} className="flex w-full items-center justify-between text-left font-display font-black">{textValue(item.question, 'Question')}<span aria-hidden="true">{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p className="mt-3 font-mono text-sm leading-relaxed text-neutral-600">{textValue(item.answer)}</p>}</div>)}</div>
            ) : section.type === 'stats' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{blockItems.map((item, index) => <div key={`${section.id}-stat-${index}`} className="rounded-2xl border-2 border-black bg-white p-5 text-center shadow-[3px_3px_0px_#000]"><p contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'value', (e.target as HTMLElement).innerText)} className="font-display text-3xl font-black" style={{ color: theme.primaryColor }}>{textValue(item.value)}</p><p contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'label', (e.target as HTMLElement).innerText)} className="mt-1 font-mono text-xs">{textValue(item.label)}</p></div>)}</div>
            ) : section.type === 'team' ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{blockItems.map((item, index) => <article key={`${section.id}-team-${index}`} className="rounded-2xl border-2 border-black bg-white p-5"><div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-black font-display text-2xl font-black" style={{ backgroundColor: theme.primaryColor }}>{textValue(item.name, '?').charAt(0)}</div><h3 contentEditable suppressContentEditableWarning onInput={(e) => updateBlockItem(index, 'name', (e.target as HTMLElement).innerText)} className="font-display font-black">{textValue(item.name)}</h3><p className="font-mono text-xs text-neutral-500">{textValue(item.role)}</p><p className="mt-2 font-mono text-xs">{textValue(item.bio)}</p></article>)}</div>
            ) : section.type === 'steps' ? (
              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">{blockItems.map((item, index) => <li key={`${section.id}-step-${index}`} className="rounded-2xl border-2 border-black bg-white p-5"><span className="font-mono text-xs font-black" style={{ color: theme.primaryColor }}>STEP 0{index + 1}</span><h3 className="mt-2 font-display font-black">{textValue(item.title)}</h3><p className="mt-1 font-mono text-xs text-neutral-600">{textValue(item.desc)}</p></li>)}</ol>
            ) : section.type === 'rich-text' ? (
              <article className="mx-auto max-w-3xl rounded-2xl border-2 border-black bg-white p-6 font-mono text-sm leading-relaxed"><p contentEditable suppressContentEditableWarning onInput={(e) => onUpdateSectionContent(section.id, { ...sectionContent, body: (e.target as HTMLElement).innerText })}>{textValue(sectionContent.body)}</p></article>
            ) : section.type === 'image-text' ? (
              <div className="grid items-center gap-6 rounded-2xl border-2 border-black bg-white p-5 sm:grid-cols-2">{assetUrl ? <><NextImage src={textValue(sectionContent.image, assetUrl)} alt="" width={900} height={700} unoptimized className="h-64 w-full rounded-xl object-cover" /></> : <div className="flex h-64 items-center justify-center rounded-xl bg-neutral-100 font-mono text-xs">Choose a site image in Assets</div>}<p className="font-mono text-sm leading-relaxed">{textValue(sectionContent.body)}</p></div>
            ) : section.type === 'announcement' ? (
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-black p-4 text-center font-mono text-sm" style={{ backgroundColor: theme.primaryColor }}><span>{textValue(sectionContent.text)}</span>{typeof sectionContent.linkLabel === 'string' && <span className="font-bold underline">{sectionContent.linkLabel}</span>}</div>
            ) : (
              null
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionProperties({
  sectionId,
  sections,
  theme,
  setSectionStyle,
  setSectionContent,
  setSectionSettings,
  sectionSpacing,
  setSectionSpacing,
}: {
  sectionId: string;
  sections: Section[];
  theme: { primaryColor: string; bgColor: string; textColor: string; fontFamily: string; borderRadius: string };
  setSectionStyle: (style: Partial<SectionStyle>) => void;
  setSectionContent: (content: Record<string, unknown>) => void;
  setSectionSettings: (settings: Partial<Pick<Section, 'hidden' | 'anchorId' | 'customClass' | 'locked'>>) => void;
  sectionSpacing: SectionSpacing;
  setSectionSpacing: React.Dispatch<React.SetStateAction<SectionSpacing>>;
}) {
  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;
  const content = section.content || {};
  const updateContent = (key: string, value: unknown) => setSectionContent({ ...content, [key]: value });
  const repeaterItems = Array.isArray(content.items) ? content.items as Array<Record<string, unknown>> : [];

  return (
    <div className="space-y-4">
      {/* Block identity */}
      <div className="rounded-xl border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#000]">
        <span className="font-mono text-[9px] font-bold text-neutral-400 uppercase block">Active Section</span>
        <span className="font-display font-black text-sm text-black">{section.name}</span>
      </div>

      <div className="space-y-2 rounded-xl border-2 border-black bg-white p-3">
        <p className="font-mono text-[10px] font-black uppercase text-neutral-500">Block content</p>
        {['title', 'heading', 'badge', 'description', 'desc', 'body', 'ctaPrimary', 'ctaSecondary', 'buttonText', 'submitLabel', 'successMessage', 'text', 'linkLabel', 'image'].filter((key) => typeof content[key] === 'string').map((key) => <label key={key} className="block font-mono text-[9px] font-bold uppercase text-neutral-500">{key.replace(/([A-Z])/g, ' $1')}<textarea rows={['description', 'desc', 'body', 'successMessage'].includes(key) ? 3 : 1} value={content[key] as string} onChange={(event) => updateContent(key, event.target.value)} className="mt-1 w-full rounded-lg border border-black/30 px-2 py-1.5 font-sans text-xs font-normal normal-case text-black" /></label>)}
        {Array.isArray(content.items) && <div className="space-y-2 border-t border-black/10 pt-2"><p className="font-mono text-[9px] font-bold uppercase text-neutral-500">Items · {repeaterItems.length}</p>{repeaterItems.map((item, index) => <div key={`${section.id}-item-${index}`} className="space-y-1 rounded-lg border border-black/20 bg-[#FAF9F6] p-2"><div className="flex items-center justify-between"><span className="font-mono text-[9px] font-bold">Item {index + 1}</span><button type="button" aria-label={`Remove item ${index + 1}`} onClick={() => updateContent('items', repeaterItems.filter((_, itemIndex) => itemIndex !== index))} className="rounded border border-black/20 p-1 hover:bg-pink"><Trash2 size={12}/></button></div>{Object.entries(item).filter(([, value]) => typeof value === 'string' || typeof value === 'number').map(([key, value]) => <label key={key} className="block font-mono text-[9px] font-bold capitalize text-neutral-500">{key}<input value={String(value)} onChange={(event) => updateContent('items', repeaterItems.map((entry, itemIndex) => itemIndex === index ? { ...entry, [key]: event.target.value } : entry))} className="mt-0.5 w-full rounded border border-black/20 bg-white px-2 py-1 font-sans text-xs font-normal text-black" /></label>)}</div>)}<button type="button" onClick={() => { const defaults = blockRegistry[section.type]?.defaultContent.items; const fallback = Array.isArray(defaults) ? defaults[0] as Record<string, unknown> : { title: 'New item', desc: 'Add a description.' }; updateContent('items', [...repeaterItems, structuredClone(repeaterItems[0] || fallback)]); }} className="w-full rounded-lg border border-black bg-yellow py-1.5 font-mono text-[10px] font-bold">＋ Add item</button></div>}
      </div>

      {/* Typography Toolbar */}
      <div>
        <div className="font-mono text-[10px] font-black uppercase text-neutral-500 tracking-wider mb-1.5">
          Typography
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" title="Toggle bold for this section" aria-pressed={section.style?.fontWeight === 700} onClick={() => setSectionStyle({ fontWeight: section.style?.fontWeight === 700 ? 400 : 700 })} className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <Bold size={13} className="stroke-[3]" />
          </button>
          <button type="button" title="Toggle italic for this section" aria-pressed={section.style?.fontStyle === 'italic'} onClick={() => setSectionStyle({ fontStyle: section.style?.fontStyle === 'italic' ? 'normal' : 'italic' })} className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <Italic size={13} className="stroke-[3]" />
          </button>
          <div className="flex-1 h-px bg-black/10" />
          <button type="button" title="Align left" aria-pressed={section.style?.textAlign === 'left'} onClick={() => setSectionStyle({ textAlign: 'left' })} className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <AlignLeft size={13} />
          </button>
          <button type="button" title="Align center" aria-pressed={section.style?.textAlign === 'center'} onClick={() => setSectionStyle({ textAlign: 'center' })} className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
            <AlignCenter size={13} />
          </button>
          <button type="button" title="Align right" aria-pressed={section.style?.textAlign === 'right'} onClick={() => setSectionStyle({ textAlign: 'right' })} className="p-2 rounded-lg border-2 border-black bg-white hover:bg-yellow shadow-2xs cursor-pointer">
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
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <label key={side} className="rounded-xl border-2 border-black bg-white p-2">
              <span className="mb-1 block font-mono text-[10px] font-bold capitalize text-neutral-500">{side}: {sectionSpacing[side]}px</span>
              <input type="range" min={0} max={120} step={4} value={sectionSpacing[side]} onChange={(event) => setSectionSpacing((current) => ({ ...current, [side]: Number(event.target.value) }))} className="w-full accent-pink" aria-label={`${side} spacing`} />
            </label>
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
            value={section.style?.accentColor || theme.primaryColor}
            onChange={(e) => setSectionStyle({ accentColor: e.target.value })}
            className="w-8 h-8 rounded-lg border border-black cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={section.style?.accentColor || theme.primaryColor}
            onChange={(e) => setSectionStyle({ accentColor: e.target.value })}
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
              onClick={() => setSectionStyle({ borderRadius: r })}
              className={cn(
                'py-1.5 rounded-lg border-2 border-black font-mono text-[10px] font-black cursor-pointer transition-all',
                (section.style?.borderRadius || theme.borderRadius) === r ? 'bg-pink text-black shadow-2xs' : 'bg-white hover:bg-neutral-100'
              )}
            >
              {r === '9999px' ? 'Pill' : r}
            </button>
          ))}
        </div>
      </div>
      <label className="block font-mono text-[10px] font-bold uppercase text-neutral-500">Section background
        <span className="mt-1 flex items-center gap-2 rounded-xl border-2 border-black bg-white p-2"><input type="color" value={section.style?.backgroundColor || '#ffffff'} onChange={(event) => setSectionStyle({ backgroundColor: event.target.value })} aria-label="Section background color" className="h-8 w-9 rounded border border-black" /><input value={section.style?.backgroundColor || ''} onChange={(event) => setSectionStyle({ backgroundColor: event.target.value || undefined })} placeholder="Use theme default" className="min-w-0 flex-1 font-mono text-xs font-bold uppercase" /></span>
      </label>
      <div className="space-y-2 rounded-xl border-2 border-black bg-white p-3">
        <p className="font-mono text-[10px] font-black uppercase text-neutral-500">Advanced</p>
        <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">Anchor ID<input value={section.anchorId || ''} onChange={(event) => setSectionSettings({ anchorId: event.target.value || undefined })} placeholder={section.id} className="mt-1 w-full rounded-lg border border-black/30 px-2 py-1.5 font-mono text-xs font-normal normal-case text-black" /></label>
        <label className="block font-mono text-[9px] font-bold uppercase text-neutral-500">Custom class<input value={section.customClass || ''} onChange={(event) => setSectionSettings({ customClass: event.target.value || undefined })} placeholder="my-section" className="mt-1 w-full rounded-lg border border-black/30 px-2 py-1.5 font-mono text-xs font-normal normal-case text-black" /></label>
        <p className="font-mono text-[9px] font-bold uppercase text-neutral-500">Hide on device</p>
        <div className="flex flex-wrap gap-3 font-mono text-[10px]">{(['desktop', 'tablet', 'mobile'] as const).map((device) => <label key={device} className="flex items-center gap-1"><input type="checkbox" checked={section.hidden?.[device] || false} onChange={(event) => setSectionSettings({ hidden: { ...section.hidden, [device]: event.target.checked } })}/>{device}</label>)}</div>
        <button type="button" onClick={() => setSectionSettings({ locked: !section.locked })} className="w-full rounded-lg border border-black py-1.5 font-mono text-[10px] font-bold">{section.locked ? 'Unlock block' : 'Lock block'}</button>
      </div>
    </div>
  );
}

// Pro Account Domain Publishing Modal
function PublishDialog({ 
  onClose, 
  siteName, 
  templateId, 
  isPro,
  sitePayload 
}: { 
  onClose: () => void; 
  siteName: string; 
  templateId: string; 
  isPro: boolean;
  sitePayload?: Record<string, unknown>;
}) {
  const [step, setStep] = useState<'form' | 'publishing' | 'success'>('form');
  const [subdomain, setSubdomain] = useState(siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  const [publishedUrl, setPublishedUrl] = useState('');
  const [publishError, setPublishError] = useState('');
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
    setPublishError('');
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
      if (!res.ok || !data.site) {
        setPublishError(data.message || 'We could not publish this site. Please try again.');
        setStep('form');
        return;
      }
      setPublishedUrl(`/live/${data.site.subdomain}`);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'We could not publish this site. Please try again.');
      setStep('form');
      return;
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
            {publishError && <p role="alert" className="rounded-xl border-2 border-red-600 bg-red-50 p-3 font-mono text-xs font-bold text-red-800">{publishError}</p>}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl border-2 border-black bg-pink flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <Globe size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-black leading-tight">
                  {isPro ? 'Launchly Pro Hosting' : 'Free Launchly Hosting'}
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
                Your site is hosted at <strong>{subdomain}.launchly.site</strong>. {isPro ? 'Pro publishing has no Launchly watermark.' : 'Free published sites include a Launchly watermark.'}
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
