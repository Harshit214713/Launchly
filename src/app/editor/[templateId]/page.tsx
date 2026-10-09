'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  Undo2, Redo2, Monitor, Tablet, Smartphone, Save, Globe,
  ChevronDown, Layers, Type, Image, Palette, Settings,
  Plus, Trash2, GripVertical, ChevronRight, Eye, X,
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Check, Loader2
} from 'lucide-react';
import { TEMPLATES } from '@/lib/templates';
import { cn } from '@/lib/utils';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type LeftPanel = 'pages' | 'sections' | 'elements' | 'styles' | 'assets';

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
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [selectedSection, setSelectedSection] = useState<string | null>('hero');
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: template.accent,
    bgColor: template.bgColor,
    fontFamily: 'Geist',
    borderRadius: '12px',
  });
  const [siteTitle, setSiteTitle] = useState('My Website');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedSection === id) setSelectedSection(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#FAF9F6] overflow-hidden">
      {/* Top toolbar */}
      <header className="h-14 bg-white border-b border-[#E8E6E0] flex items-center justify-between px-4 z-50 flex-shrink-0">
        {/* Left: Logo + Undo/Redo */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-[#0F0F11] overflow-hidden flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <NextImage
                src="/brand-logo-clean.png"
                alt="Launchly Emblem"
                width={28}
                height={28}
                className="w-full h-full object-contain p-0.5 rounded-md"
              />
            </div>
            <div className="hidden sm:block">
              <NextImage
                src="/brand-name-light.png"
                alt="LAUNCHLY"
                width={120}
                height={18}
                className="h-3 w-auto object-contain"
              />
              <span className="sr-only">LAUNCHLY</span>
            </div>
          </Link>

          <div className="w-px h-6 bg-[#E8E6E0]" />

          {/* Site name */}
          <input
            type="text"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="text-sm font-medium text-[#171717] bg-transparent border-none outline-none focus:bg-[#F5F4F0] px-2 py-1 rounded-lg transition-colors max-w-32"
          />

          <div className="w-px h-6 bg-[#E8E6E0]" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-[#F5F4F0] text-[#525252] hover:text-[#171717] transition-colors" title="Undo">
              <Undo2 size={15} />
            </button>
            <button className="p-2 rounded-lg hover:bg-[#F5F4F0] text-[#525252] hover:text-[#171717] transition-colors" title="Redo">
              <Redo2 size={15} />
            </button>
          </div>
        </div>

        {/* Center: Device preview */}
        <div className="flex items-center gap-1 bg-[#F5F4F0] rounded-xl p-1">
          {([
            { mode: 'desktop' as const, icon: Monitor },
            { mode: 'tablet' as const, icon: Tablet },
            { mode: 'mobile' as const, icon: Smartphone },
          ]).map(({ mode, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setDeviceMode(mode)}
              className={cn(
                'p-2 rounded-lg transition-all',
                deviceMode === mode ? 'bg-white shadow-sm text-[#FF5500]' : 'text-[#ACACAC] hover:text-[#525252]'
              )}
              title={mode.charAt(0).toUpperCase() + mode.slice(1)}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* Right: Preview/Save/Publish */}
        <div className="flex items-center gap-2">
          <Link
            href={`/templates/${template.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#525252] hover:text-[#171717] hover:bg-[#F5F4F0] rounded-lg transition-all"
          >
            <Eye size={14} />
            Preview
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              saved
                ? 'bg-[#22C55E]/10 text-[#22C55E]'
                : 'bg-[#F5F4F0] text-[#525252] hover:bg-[#E8E6E0] hover:text-[#171717]'
            )}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
          </button>

          <button
            onClick={() => setShowPublishDialog(true)}
            className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FF5500] hover:bg-[#E04800] text-white shadow-sm hover:shadow-md hover:shadow-[#FF5500]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Globe size={14} />
            Publish
          </button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar icons */}
        <div className="w-14 bg-white border-r border-[#E8E6E0] flex flex-col items-center py-3 gap-1 z-40">
          {([
            { id: 'pages', icon: Layers, label: 'Pages' },
            { id: 'sections', icon: Layers, label: 'Sections' },
            { id: 'elements', icon: Type, label: 'Elements' },
            { id: 'styles', icon: Palette, label: 'Styles' },
            { id: 'assets', icon: Image, label: 'Assets' },
          ] as { id: LeftPanel; icon: typeof Layers; label: string }[]).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setLeftPanel(id)}
              title={label}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                leftPanel === id
                  ? 'bg-[#171717] text-white'
                  : 'text-[#ACACAC] hover:text-[#525252] hover:bg-[#F5F4F0]'
              )}
            >
              <Icon size={16} />
            </button>
          ))}

          <div className="flex-1" />

          <button title="Settings" className="w-10 h-10 rounded-xl flex items-center justify-center text-[#ACACAC] hover:text-[#525252] hover:bg-[#F5F4F0] transition-all">
            <Settings size={16} />
          </button>
        </div>

        {/* Left panel content */}
        <div className="w-56 bg-white border-r border-[#E8E6E0] flex flex-col z-30 overflow-hidden">
          <div className="p-4 border-b border-[#E8E6E0]">
            <div className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
              {leftPanel.charAt(0).toUpperCase() + leftPanel.slice(1)}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {leftPanel === 'sections' && (
              <div className="p-3">
                <div className="space-y-1">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                      className={cn(
                        'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                        selectedSection === section.id
                          ? 'bg-[#171717] text-white'
                          : 'text-[#525252] hover:bg-[#F5F4F0] hover:text-[#171717]'
                      )}
                    >
                      <GripVertical size={12} className="opacity-40 flex-shrink-0" />
                      <span className="text-sm flex-1">{section.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                        className={cn(
                          'opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all',
                          selectedSection === section.id ? 'hover:bg-white/20' : 'hover:bg-[#E8E6E0]'
                        )}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#E8E6E0]">
                  <div className="text-xs font-medium text-[#8A8A8A] mb-2">Add section</div>
                  {['Hero', 'Features', 'Testimonials', 'Gallery', 'Pricing', 'CTA', 'Contact'].map((type) => (
                    <button
                      key={type}
                      onClick={() => addSection(type.toLowerCase())}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#525252] hover:bg-[#F5F4F0] hover:text-[#171717] transition-all"
                    >
                      <Plus size={12} />
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftPanel === 'pages' && (
              <div className="p-3">
                {(template.pages || ['Home', 'About', 'Contact']).map((page, i) => (
                  <div
                    key={page}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-all',
                      i === 0
                        ? 'bg-[#171717] text-white'
                        : 'text-[#525252] hover:bg-[#F5F4F0]'
                    )}
                  >
                    <ChevronRight size={12} className="opacity-40" />
                    {page}
                    {i === 0 && <span className="ml-auto text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full">Home</span>}
                  </div>
                ))}
                <button className="flex items-center gap-2 w-full mt-3 px-3 py-2 text-sm text-[#525252] hover:text-[#171717] border border-dashed border-[#E8E6E0] rounded-lg hover:border-[#FF5500]/50 transition-all">
                  <Plus size={12} />
                  Add page
                </button>
              </div>
            )}

            {leftPanel === 'styles' && (
              <div className="p-4 space-y-6">
                <div>
                  <div className="text-xs font-medium text-[#8A8A8A] mb-2 uppercase tracking-wide">Colors</div>
                  <div className="space-y-2">
                    {[
                      { label: 'Primary', key: 'primaryColor' },
                      { label: 'Background', key: 'bgColor' },
                    ].map(({ label, key }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-[#525252]">{label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={theme[key as keyof typeof theme] || '#000000'}
                            onChange={(e) => setTheme(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-8 h-8 rounded-lg border border-[#E8E6E0] cursor-pointer p-0.5"
                          />
                          <span className="text-xs font-mono text-[#8A8A8A]">
                            {theme[key as keyof typeof theme]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[#8A8A8A] mb-2 uppercase tracking-wide">Typography</div>
                  <select className="w-full px-3 py-2 bg-[#F5F4F0] rounded-lg text-sm text-[#525252] border-none outline-none focus:ring-2 focus:ring-[#FF5500]/20">
                    {['Geist', 'Inter', 'Playfair Display', 'Space Grotesk', 'DM Sans'].map(f => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs font-medium text-[#8A8A8A] mb-2 uppercase tracking-wide">Border Radius</div>
                  <div className="flex gap-2">
                    {['4px', '8px', '12px', '20px', '9999px'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setTheme(prev => ({ ...prev, borderRadius: r }))}
                        className={cn(
                          'flex-1 py-2 text-xs rounded transition-all border',
                          theme.borderRadius === r
                            ? 'border-[#171717] bg-[#171717] text-white'
                            : 'border-[#E8E6E0] text-[#525252] hover:border-[#171717]'
                        )}
                        style={{ borderRadius: r }}
                      >
                        {r.replace('px', '')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {leftPanel === 'elements' && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {['Text', 'Image', 'Button', 'Video', 'Form', 'Divider', 'Icon', 'Grid'].map((el) => (
                  <button
                    key={el}
                    className="flex flex-col items-center gap-1.5 p-3 border border-[#E8E6E0] rounded-xl text-xs text-[#525252] hover:border-[#FF5500]/50 hover:text-[#171717] hover:bg-[#FAFAF8] transition-all"
                  >
                    <div className="w-8 h-6 bg-[#F0EEE9] rounded" />
                    {el}
                  </button>
                ))}
              </div>
            )}

            {leftPanel === 'assets' && (
              <div className="p-4">
                <button className="w-full border-2 border-dashed border-[#E8E6E0] rounded-xl p-6 flex flex-col items-center gap-2 text-[#8A8A8A] hover:border-[#FF5500]/50 hover:text-[#525252] transition-all">
                  <Image size={20} />
                  <div className="text-xs">Upload images</div>
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-[#F0EEE9] rounded-lg" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#E8E6E0] overflow-auto flex items-start justify-center p-6">
          <div
            className="bg-white shadow-2xl transition-all duration-500 overflow-hidden"
            style={{
              width: DEVICE_WIDTHS[deviceMode],
              minHeight: '100%',
              borderRadius: deviceMode !== 'desktop' ? '16px' : '8px',
            }}
          >
            {/* Simulated website content */}
            <CanvasContent template={template} sections={sections} selectedSection={selectedSection} theme={theme} />
          </div>
        </div>

        {/* Right sidebar - Properties */}
        <div className="w-72 bg-white border-l border-[#E8E6E0] flex flex-col z-30 overflow-hidden">
          <div className="p-4 border-b border-[#E8E6E0] flex items-center justify-between">
            <div className="text-xs font-semibold text-[#171717] uppercase tracking-wider">
              {selectedSection ? `${sections.find(s => s.id === selectedSection)?.name || ''} Properties` : 'Properties'}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedSection ? (
              <SectionProperties
                sectionId={selectedSection}
                sections={sections}
                theme={theme}
              />
            ) : (
              <div className="text-sm text-[#8A8A8A] text-center py-8">
                Select a section to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish dialog */}
      {showPublishDialog && (
        <PublishDialog
          onClose={() => setShowPublishDialog(false)}
          siteName={siteTitle}
          templateId={template.id}
        />
      )}
    </div>
  );
}

function CanvasContent({ template, sections, selectedSection, theme }: {
  template: typeof TEMPLATES[0];
  sections: Section[];
  selectedSection: string | null;
  theme: { primaryColor: string; bgColor: string; fontFamily: string; borderRadius: string };
}) {
  const tmpl = template;
  
  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          isSelected={selectedSection === section.id}
          template={tmpl}
          theme={theme}
        />
      ))}
    </div>
  );
}

function SectionRenderer({ section, isSelected, template, theme }: {
  section: Section;
  isSelected: boolean;
  template: typeof TEMPLATES[0];
  theme: { primaryColor: string; bgColor: string; fontFamily: string; borderRadius: string };
}) {
  return (
    <div
      className={cn(
        'relative group cursor-pointer transition-all',
        isSelected && 'outline-2 outline-[#FF5500] outline'
      )}
    >
      {/* Section label */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-[#FF5500] text-white text-xs font-semibold px-2 py-1 rounded-t-md z-10 shadow-xs">
          {section.name}
        </div>
      )}

      {/* Actual section content */}
      {section.type === 'nav' && (
        <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: '#E8E6E0' }}>
          <div className="font-bold text-[#171717]">Logo</div>
          <div className="flex gap-6">
            {['Home', 'About', 'Work', 'Contact'].map(item => (
              <div key={item} className="text-sm text-[#525252]">{item}</div>
            ))}
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: theme.primaryColor, borderRadius: theme.borderRadius }}>
            Get started
          </div>
        </div>
      )}

      {section.type === 'hero' && (
        <div className="py-24 px-8 text-center" style={{ background: template.bgColor }}>
          <div className="text-sm mb-4 px-3 py-1.5 rounded-full inline-block"
               style={{ color: theme.primaryColor, background: `${theme.primaryColor}15` }}>
            ✦ New platform launch
          </div>
          <div className="text-5xl font-bold leading-tight mb-4 contenteditable" style={{ color: template.textColor }}
               contentEditable suppressContentEditableWarning>
            Your headline<br />goes right here.
          </div>
          <div className="text-lg mb-8 max-w-lg mx-auto" style={{ color: template.textColor, opacity: 0.7 }}
               contentEditable suppressContentEditableWarning>
            Supporting copy that explains your value proposition clearly.
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-lg font-semibold text-[#171717]"
                 style={{ background: theme.primaryColor, borderRadius: theme.borderRadius }}>
              Get started free
            </div>
            <div className="px-6 py-3 rounded-lg border font-medium" style={{ borderColor: `${template.textColor}30`, color: template.textColor, borderRadius: theme.borderRadius }}>
              Learn more
            </div>
          </div>
        </div>
      )}

      {section.type === 'features' && (
        <div className="py-20 px-8">
          <div className="text-center mb-12">
            <div className="text-3xl font-bold text-[#171717] mb-3" contentEditable suppressContentEditableWarning>Why choose us?</div>
            <div className="text-[#6B6B6B]" contentEditable suppressContentEditableWarning>We&apos;re different from the rest.</div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {['Speed', 'Design', 'Scale'].map((f) => (
              <div key={f} className="p-6 rounded-2xl border border-[#E8E6E0]">
                <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center"
                     style={{ background: `${theme.primaryColor}15` }}>
                  <div className="w-4 h-4 rounded" style={{ background: theme.primaryColor }} />
                </div>
                <div className="font-semibold text-[#171717] mb-2" contentEditable suppressContentEditableWarning>{f}</div>
                <div className="text-sm text-[#6B6B6B]" contentEditable suppressContentEditableWarning>Feature description goes here for the {f.toLowerCase()} section.</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.type === 'testimonials' && (
        <div className="py-20 px-8 bg-[#FAF9F6]">
          <div className="text-center mb-12">
            <div className="text-3xl font-bold text-[#171717] mb-3">What people say</div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {['A great product that changed how we work.', 'Couldn\'t be happier with the results.'].map((q, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-[#E8E6E0]">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <div key={s} className="w-3 h-3 bg-[#FF5500] rounded-full" style={{ background: theme.primaryColor }} />)}
                </div>
                <div className="text-[#171717] italic mb-4" contentEditable suppressContentEditableWarning>&ldquo;{q}&rdquo;</div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ background: theme.primaryColor }} />
                  <div>
                    <div className="text-sm font-medium text-[#171717]">Customer Name</div>
                    <div className="text-xs text-[#8A8A8A]">CEO at Company</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.type === 'cta' && (
        <div className="py-20 px-8 bg-[#171717] text-center">
          <div className="text-3xl font-bold text-white mb-4" contentEditable suppressContentEditableWarning>
            Ready to get started?
          </div>
          <div className="text-[#8A8A8A] mb-8" contentEditable suppressContentEditableWarning>
            Join thousands of happy customers today.
          </div>
          <div className="inline-flex px-8 py-4 rounded-xl font-semibold text-[#171717]"
               style={{ background: theme.primaryColor, borderRadius: theme.borderRadius }}>
            Start for free
          </div>
        </div>
      )}

      {section.type === 'footer' && (
        <div className="py-12 px-8 border-t border-[#E8E6E0]">
          <div className="flex items-center justify-between">
            <div className="font-bold text-[#171717]">Logo</div>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map(item => (
                <div key={item} className="text-sm text-[#8A8A8A]">{item}</div>
              ))}
            </div>
            <div className="text-sm text-[#8A8A8A]">© 2024 Company</div>
          </div>
        </div>
      )}

      {!['nav', 'hero', 'features', 'testimonials', 'cta', 'footer'].includes(section.type) && (
        <div className="py-20 px-8 text-center bg-[#F5F4F0]">
          <div className="text-[#8A8A8A] text-sm">{section.name} Section</div>
        </div>
      )}

      {/* Hover indicator */}
      {!isSelected && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#FF5500]/30 pointer-events-none transition-all" />
      )}
    </div>
  );
}

function SectionProperties({ sectionId, sections, theme }: {
  sectionId: string;
  sections: Section[];
  theme: object;
}) {
  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wide mb-3">Typography</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-[#E8E6E0] hover:border-[#FF5500]/50 transition-all">
              <Bold size={13} />
            </button>
            <button className="p-2 rounded-lg border border-[#E8E6E0] hover:border-[#FF5500]/50 transition-all">
              <Italic size={13} />
            </button>
            <div className="flex-1 h-px bg-[#E8E6E0]" />
            <button className="p-2 rounded-lg border border-[#E8E6E0] hover:border-[#FF5500]/50 transition-all">
              <AlignLeft size={13} />
            </button>
            <button className="p-2 rounded-lg border border-[#E8E6E0] hover:border-[#FF5500]/50 transition-all">
              <AlignCenter size={13} />
            </button>
            <button className="p-2 rounded-lg border border-[#E8E6E0] hover:border-[#FF5500]/50 transition-all">
              <AlignRight size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-[#8A8A8A]">Size</div>
            <input type="range" min={12} max={72} defaultValue={16} className="flex-1 accent-[#FF5500]" />
            <div className="text-xs text-[#8A8A8A] w-8">16px</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wide mb-3">Spacing</div>
        <div className="grid grid-cols-2 gap-2">
          {['Padding top', 'Padding bottom', 'Margin left', 'Margin right'].map((label) => (
            <div key={label}>
              <div className="text-xs text-[#8A8A8A] mb-1">{label.split(' ')[1]}</div>
              <input
                type="number"
                defaultValue={48}
                className="w-full px-2 py-1.5 bg-[#F5F4F0] rounded-lg text-sm text-[#171717] border-none outline-none focus:ring-2 focus:ring-[#FF5500]/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wide mb-3">Background</div>
        <div className="flex items-center gap-3">
          <input type="color" defaultValue="#FFFFFF" className="w-10 h-10 rounded-xl border border-[#E8E6E0] cursor-pointer p-1" />
          <input
            type="text"
            defaultValue="#FFFFFF"
            className="flex-1 px-3 py-2 bg-[#F5F4F0] rounded-lg text-sm font-mono text-[#171717] border-none outline-none focus:ring-2 focus:ring-[#FF5500]/20"
          />
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wide mb-3">Visibility</div>
        <div className="flex gap-2">
          {[
            { icon: <Monitor size={16} className="mx-auto" />, title: 'Desktop' },
            { icon: <Tablet size={16} className="mx-auto" />, title: 'Tablet' },
            { icon: <Smartphone size={16} className="mx-auto" />, title: 'Mobile' },
          ].map(({ icon, title }) => (
            <button
              key={title}
              title={title}
              className="flex-1 py-2 bg-[#F5F4F0] rounded-lg text-base hover:bg-[#FF5500]/15 transition-all flex items-center justify-center text-neutral-700"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublishDialog({ onClose, siteName, templateId }: { onClose: () => void; siteName: string; templateId: string }) {
  const [step, setStep] = useState<'form' | 'publishing' | 'success'>('form');
  const [subdomain, setSubdomain] = useState(siteName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  const [publishedUrl, setPublishedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    setStep('publishing');
    try {
      const res = await fetch('/api/sites/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          name: siteName,
          subdomain,
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
    await new Promise(r => setTimeout(r, 1200));
    setStep('success');
  };

  const handleCopy = () => {
    const full = typeof window !== 'undefined' ? `${window.location.origin}/live/${subdomain}` : `https://${subdomain}.launchly.site`;
    navigator.clipboard?.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in relative border border-[#E8E6E0]">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#F5F4F0] text-[#8A8A8A] hover:text-[#171717] transition-colors cursor-pointer">
          <X size={16} />
        </button>

        {step === 'form' && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2EB] text-[#FF5500] flex items-center justify-center shadow-xs">
                <Globe size={20} />
              </div>
              <div>
                <div className="font-bold text-[#171717]">Publish your website</div>
                <div className="text-xs text-[#8A8A8A]">Go live instantly on global edge network</div>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5 block">Website Name</label>
              <input
                type="text"
                value={siteName}
                readOnly
                className="w-full px-4 py-2.5 bg-[#FAF9F6] rounded-xl text-sm text-[#171717] border border-[#E8E6E0]"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-[#171717] uppercase tracking-wider mb-1.5 block">Choose Subdomain</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-4 py-2.5 bg-white border border-[#E8E6E0] rounded-l-xl text-sm text-[#171717] focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 font-mono"
                />
                <div className="px-3.5 py-2.5 bg-[#FAF9F6] border border-l-0 border-[#E8E6E0] rounded-r-xl text-xs text-[#8A8A8A] font-mono whitespace-nowrap">
                  .launchly.site
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span className="text-xs text-[#22C55E] font-medium">{subdomain}.launchly.site is available</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePublish}
                className="w-full justify-center text-sm py-3.5 font-bold rounded-xl bg-[#FF5500] hover:bg-[#E04800] text-white shadow-md hover:shadow-lg hover:shadow-[#FF5500]/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Globe size={16} />
                Publish Live Now
              </button>
              <p className="text-[11px] text-center text-[#8A8A8A]">
                Instant SSL certificate and global CDN deployment included
              </p>
            </div>
          </>
        )}

        {step === 'publishing' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#FFF2EB] flex items-center justify-center mx-auto mb-4">
              <Loader2 size={28} className="text-[#FF5500] animate-spin" />
            </div>
            <div className="font-bold text-[#171717] text-xl mb-1">Publishing Live...</div>
            <div className="text-xs text-[#8A8A8A]">Compiling Next.js assets & provisioning edge CDN</div>
            <div className="mt-6 space-y-2">
              {['Minifying styles and fonts...', 'Generating edge static bundles...', 'Deploying live routing table...'].map((msg) => (
                <div key={msg} className="flex items-center justify-center gap-2 text-xs text-[#8A8A8A]">
                  <Loader2 size={12} className="animate-spin text-[#FF5500]" />
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#FF5500] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF5500]/25">
              <Check size={28} strokeWidth={3} />
            </div>
            <div className="font-black text-[#171717] text-2xl mb-1">Your Website is Live!</div>
            <div className="text-xs text-[#8A8A8A] mb-5">Genuinely deployed and accessible worldwide:</div>

            <div className="bg-[#FAF9F6] border border-[#E8E6E0] rounded-xl px-4 py-3 mb-6">
              <div className="font-mono text-sm text-[#FF5500] font-bold">
                https://{subdomain}.launchly.site
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => window.open(publishedUrl || `/live/${subdomain}`, '_blank')}
                className="w-full justify-center text-sm py-3 rounded-xl bg-[#FF5500] hover:bg-[#E04800] text-white font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Visit Live Website</span>
                <Globe size={14} />
              </button>
              <button
                onClick={handleCopy}
                className="w-full justify-center text-xs py-2.5 rounded-xl border border-[#E8E6E0] bg-white hover:bg-[#FAF9F6] text-[#171717] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-[#22C55E]" /> : null}
                <span>{copied ? 'Live Link Copied!' : 'Copy Live Website Link'}</span>
              </button>
              <button 
                onClick={onClose} 
                className="w-full py-2 text-xs text-[#8A8A8A] hover:text-[#171717] transition-colors cursor-pointer"
              >
                Back to Studio Editor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
