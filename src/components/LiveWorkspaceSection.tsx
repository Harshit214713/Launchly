'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowUpRight, 
  Sliders, 
  Play
} from 'lucide-react';

const COLOR_THEMES = [
  { name: 'Candy Pink', color: '#f472b6', border: '#000000', text: '#000000' },
  { name: 'Electric Yellow', color: '#ffd600', border: '#000000', text: '#000000' },
  { name: 'Fresh Mint', color: '#7bd7c1', border: '#000000', text: '#000000' },
  { name: 'Cyber Lilac', color: '#ddd6fe', border: '#000000', text: '#000000' },
];

export default function LiveWorkspaceSection() {
  const [activeMode, setActiveMode] = useState<'visual' | 'split' | 'code'>('split');
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [siteTitle, setSiteTitle] = useState('Build faster than ever.');
  const [siteSubtitle, setSiteSubtitle] = useState('The modern AI toolkit built for ambitious founders.');
  const [ctaText, setCtaText] = useState('Get Started Free');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'props'>('code');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('✓ Turbopack compiled /app/page.tsx in 118ms · 0 errors\n✓ Standalone Next.js 15.2 output ready');
  const [runtimeVersion, setRuntimeVersion] = useState('Next.js 15.2');
  const [showRuntimeMenu, setShowRuntimeMenu] = useState(false);
  
  // Resizable split width percentage (20% to 80%)
  const [splitWidth, setSplitWidth] = useState(54);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize calculation function
  const updateSplit = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(80, Math.max(22, pct));
    setSplitWidth(clamped);
  }, []);

  // Global mouse and touch event listeners while dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateSplit(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateSplit(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateSplit]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    updateSplit(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSplit(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
  };

  const handleRunEngine = () => {
    setIsRunning(true);
    setTerminalOutput('Executing sandbox compilation engine...');
    setTimeout(() => {
      setIsRunning(false);
      const streamText = customInput.trim() ? customInput : 'print("Hello Launchly!")';
      setTerminalOutput(
        `✓ Compiled successfully in 64ms\n✓ Diagnostic status: 0 errors, 0 warnings\n> Standard I/O stream: ${streamText}`
      );
    }, 400);
  };

  const generatedCode = `// Generated Next.js 15 + Tailwind CSS Component
export default function HeroSection() {
  return (
    <section className="py-24 px-6 text-center bg-[#fdf2f8]">
      <div className="max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full border-[3px] border-black bg-[${selectedTheme.color}] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#000]">
          Live Launch
        </span>
        <h1 className="mt-6 text-5xl sm:text-7xl font-black text-black">
          ${siteTitle}
        </h1>
        <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto">
          ${siteSubtitle}
        </p>
        <div className="mt-8">
          <button className="px-8 py-4 rounded-xl border-[3px] border-black bg-[${selectedTheme.color}] font-bold text-black shadow-[5px_5px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all">
            ${ctaText} →
          </button>
        </div>
      </div>
    </section>
  );
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="live-workspace" className="mx-auto w-[min(1400px,calc(100%-32px))] sm:w-[min(1400px,calc(100%-48px))] pb-10 pt-4">
      {/* Section Header */}
      <div className="mb-6 max-w-3xl">
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-ink">
          Try the real workspace right here.
        </h2>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-muted-foreground">
          Tweak copy live, pick color themes, test responsive viewports, and inspect clean production source code.
        </p>
      </div>

      {/* Workspace Shell */}
      <div className="overflow-hidden rounded-3xl border-[3.5px] border-ink bg-card shadow-brutal sm:shadow-brutal-lg">
        {/* Workspace Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-[3px] border-ink bg-[#faf5ff] dark:bg-[#171720] px-3 sm:px-6 py-2.5 sm:py-3">
          {/* Mode Switcher */}
          <div className="inline-flex items-center rounded-full border-[2.5px] border-ink bg-card p-0.5 sm:p-1 shadow-brutal-sm">
            <button
              type="button"
              onClick={() => setActiveMode('visual')}
              className={`rounded-full px-2.5 sm:px-4 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeMode === 'visual'
                  ? 'bg-pink text-black shadow-brutal-xs'
                  : 'text-muted-foreground hover:text-black'
              }`}
            >
              Visual
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('split')}
              className={`rounded-full px-2.5 sm:px-4 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeMode === 'split'
                  ? 'bg-pink text-black shadow-brutal-xs'
                  : 'text-muted-foreground hover:text-black'
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('code')}
              className={`rounded-full px-2.5 sm:px-4 py-1 text-[11px] sm:text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                activeMode === 'code'
                  ? 'bg-pink text-black shadow-brutal-xs'
                  : 'text-muted-foreground hover:text-black'
              }`}
            >
              Code
            </button>
          </div>

          {/* Device Switcher (Desktop & Tablet) */}
          <div className="hidden sm:inline-flex items-center gap-1 rounded-xl border-[2.5px] border-ink bg-card p-1 shadow-brutal-sm">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'desktop' ? 'bg-yellow text-black' : 'text-muted-foreground hover:text-black'
              }`}
              title="Desktop view"
            >
              <Laptop size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'tablet' ? 'bg-yellow text-black' : 'text-muted-foreground hover:text-black'
              }`}
              title="Tablet view"
            >
              <Tablet size={15} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                device === 'mobile' ? 'bg-yellow text-black' : 'text-muted-foreground hover:text-black'
              }`}
              title="Mobile view"
            >
              <Smartphone size={15} />
            </button>
          </div>

          {/* Theme Palette Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden md:inline font-mono text-[10px] sm:text-[11px] font-bold uppercase text-muted-foreground">
              Theme:
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  style={{ backgroundColor: theme.color }}
                  className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg border-2 border-ink shadow-brutal-xs transition-transform cursor-pointer ${
                    selectedTheme.name === theme.name ? 'scale-110 ring-2 ring-ink ring-offset-1' : 'hover:scale-105'
                  }`}
                  title={theme.name}
                />
              ))}
            </div>
          </div>

          {/* Open full editor button */}
          <Link
            href="/editor/saas-launch"
            className="brutal-press inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-ink bg-pink px-3 py-1.5 font-display text-xs sm:text-sm font-bold text-black shadow-brutal-sm"
          >
            <span>Open Studio</span>
            <ArrowUpRight size={14} className="stroke-[3]" />
          </Link>
        </div>

        {/* Workspace Body */}
        <div ref={containerRef} className="relative flex flex-col md:flex-row min-h-[560px] w-full select-none">
          {/* Left Canvas Preview */}
          <div
            style={{
              width: activeMode === 'split' ? `${splitWidth}%` : activeMode === 'visual' ? '100%' : '0%',
              display: activeMode === 'code' ? 'none' : 'flex',
            }}
            className="border-b-[3px] md:border-b-0 border-ink bg-white dark:bg-[#0b0b12] p-3 sm:p-6 relative flex flex-col justify-between shrink-0 max-md:!w-full overflow-hidden"
          >
            {/* Background dot grid pattern matching Screenshot 2 */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#c4b5fd 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Virtual Browser Top Bar */}
            <div className="relative z-10 mb-4 flex items-center justify-between rounded-xl border-[2.5px] border-ink bg-card px-3 py-2 shadow-brutal-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-ink bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-ink bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-ink bg-[#27c93f]" />
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] font-bold text-muted-foreground flex items-center gap-1.5 truncate">
                <span className="text-mint">●</span> https://launchly.site/preview
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground">
                {device}
              </span>
            </div>

            {/* Live Interactive Editable Preview Canvas */}
            <div
              className={`relative z-10 mx-auto my-auto w-full rounded-2xl border-[3px] border-ink bg-card p-4 sm:p-8 shadow-brutal transition-all ${
                device === 'mobile'
                  ? 'max-w-[340px]'
                  : device === 'tablet'
                  ? 'max-w-[540px]'
                  : 'max-w-full'
              }`}
            >
              {/* Pill badge */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <span
                  style={{ backgroundColor: selectedTheme.color }}
                  className="inline-flex items-center gap-1.5 rounded-full border-[2px] sm:border-[2.5px] border-ink px-3 py-0.5 sm:py-1 font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-black shadow-brutal-xs"
                >
                  <Sparkles size={11} />
                  <span>Next-Gen Platform</span>
                </span>
              </div>

              {/* Editable Headline */}
              <div className="text-center">
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full text-center font-display text-xl sm:text-3xl md:text-4xl font-black text-ink bg-transparent border-b-2 border-dashed border-ink/40 hover:border-ink focus:border-ink focus:outline-none transition-colors"
                  title="Click to edit headline live"
                />
                <p className="mt-1 font-mono text-[9px] sm:text-[10px] text-pink font-bold uppercase">
                  ✦ Click to edit headline directly ✦
                </p>
              </div>

              {/* Editable Subtitle */}
              <div className="mt-2.5 text-center">
                <input
                  type="text"
                  value={siteSubtitle}
                  onChange={(e) => setSiteSubtitle(e.target.value)}
                  className="w-full text-center text-xs sm:text-sm font-medium text-muted-foreground bg-transparent border-b border-dashed border-ink/20 hover:border-ink focus:border-ink focus:outline-none transition-colors"
                  title="Click to edit subtitle"
                />
              </div>

              {/* Interactive CTA button */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  style={{ backgroundColor: selectedTheme.color }}
                  className="brutal-press rounded-xl border-[2.5px] sm:border-[3px] border-ink px-4 sm:px-6 py-2 sm:py-2.5 font-display text-xs sm:text-sm font-black text-black shadow-brutal cursor-pointer flex items-center gap-1.5"
                >
                  <span>{ctaText}</span>
                  <ArrowUpRight size={14} className="stroke-[3]" />
                </button>
                <button
                  type="button"
                  className="brutal-press rounded-xl border-[2.5px] sm:border-[3px] border-ink bg-card px-3.5 sm:px-4 py-2 sm:py-2.5 font-display text-xs sm:text-sm font-bold text-ink shadow-brutal cursor-pointer"
                >
                  Book Demo
                </button>
              </div>

              {/* Live Metric Pills */}
              <div className="mt-6 pt-3.5 border-t-[2px] border-ink/20 grid grid-cols-2 gap-2 sm:gap-3 text-center">
                <div className="rounded-xl border-[2px] border-ink bg-[#faf5ff] dark:bg-[#1a1a24] p-2 shadow-brutal-xs">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-muted-foreground block">
                    CONVERSION BOOST
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-ink">+34.8%</span>
                </div>
                <div className="rounded-xl border-[2px] border-ink bg-[#faf5ff] dark:bg-[#1a1a24] p-2 shadow-brutal-xs">
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold text-muted-foreground block">
                    PAGE LOAD SPEED
                  </span>
                  <span className="font-display text-base sm:text-lg font-black text-ink">0.18s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Resizer Bar with Vertical Black Line & Pink Pill Handle matching Screenshot 2 */}
          {activeMode === 'split' && (
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="hidden md:flex w-7 -mx-3.5 items-center justify-center cursor-col-resize relative z-30 select-none group shrink-0 touch-none"
              title="Drag horizontally to resize preview and code panel"
            >
              {/* Continuous vertical black divider line matching Screenshot 2 */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2.5px] bg-black dark:bg-[#26283d]" />

              {/* Pink handle pill matching Screenshot 2 */}
              <div 
                className={`relative z-10 h-14 w-4 rounded-full border-[2.5px] border-black bg-pink shadow-[2px_2px_0px_#000] flex items-center justify-center transition-all cursor-col-resize ${
                  isDragging ? 'scale-125 bg-yellow shadow-[3px_3px_0px_#000]' : 'group-hover:scale-115'
                }`}
              >
                <div className="w-1 h-5 bg-black/80 rounded-full" />
              </div>
            </div>
          )}

          {/* Right Code & Execution Sandbox Panel */}
          <div
            style={{
              width: activeMode === 'split' ? `${100 - splitWidth}%` : activeMode === 'code' ? '100%' : '0%',
              display: activeMode === 'visual' ? 'none' : 'flex',
            }}
            className="relative bg-[#faf8fc] dark:bg-[#0d0d12] p-3 sm:p-5 flex flex-col justify-between overflow-hidden shrink-0 max-md:!w-full border-t-[3px] md:border-t-0 border-ink"
          >
            {/* Lavender ruled notebook paper background matching Screenshot 2 */}
            <div
              className="absolute inset-0 pointer-events-none opacity-80 dark:opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(196, 181, 253, 0.45) 0px, rgba(196, 181, 253, 0.45) 1px, transparent 1px, transparent 24px), linear-gradient(to right, rgba(196, 181, 253, 0.45) 1px, transparent 1px)',
                backgroundSize: '100% 24px, 24px 100%',
              }}
            />

            <div className="relative z-10 flex flex-col gap-3">
              {/* Outer Top Tab Selector - Neo-Brutalist White Pills */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('props')}
                    className={`rounded-2xl border-[2.5px] border-black dark:border-[#26283d] px-3.5 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs font-black uppercase transition-all cursor-pointer ${
                      activeTab === 'props'
                        ? 'bg-white dark:bg-pink text-black shadow-[3px_3px_0px_#000000]'
                        : 'bg-white dark:bg-[#151726] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white shadow-[1.5px_1.5px_0px_#000000]'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`rounded-2xl border-[2.5px] border-black dark:border-[#26283d] px-3.5 sm:px-4 py-1.5 font-mono text-[11px] sm:text-xs font-black uppercase transition-all cursor-pointer ${
                      activeTab === 'code'
                        ? 'bg-white dark:bg-pink text-black shadow-[3px_3px_0px_#000000]'
                        : 'bg-white dark:bg-[#151726] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white shadow-[1.5px_1.5px_0px_#000000]'
                    }`}
                  >
                    Code
                  </button>
                </div>

                {activeTab === 'code' && (
                  <button
                    type="button"
                    onClick={copyCode}
                    className="brutal-press inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-black dark:border-[#26283d] bg-white dark:bg-[#151726] px-3 py-1 text-xs font-mono font-bold text-black dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-neutral-50 dark:hover:bg-[#1f2136] transition-all cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-mint stroke-[3]" /> : <Copy size={12} />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>

              {/* Main Code Execution Sandbox Window */}
              <div className="rounded-2xl sm:rounded-3xl border-[2.5px] border-black dark:border-[#26283d] bg-[#0d0d12] p-3 sm:p-4 shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#000000] flex flex-col gap-2.5 sm:gap-3">
                {/* Titlebar */}
                <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ef4444] border border-black/30 inline-block" />
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#f59e0b] border border-black/30 inline-block" />
                      <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#10b981] border border-black/30 inline-block" />
                    </div>
                    <span className="font-mono text-[10px] sm:text-xs font-black tracking-wider text-neutral-300 uppercase">
                      CODE EXECUTION SANDBOX
                    </span>
                  </div>

                  {/* Version dropdown pill */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowRuntimeMenu(!showRuntimeMenu)}
                      className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-[#1a1a24] px-2 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[11px] sm:text-xs font-bold text-lilac hover:border-neutral-500 cursor-pointer"
                    >
                      <span>{runtimeVersion}</span>
                      <span className="text-[9px] text-neutral-400">▼</span>
                    </button>
                    {showRuntimeMenu && (
                      <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-xl border-2 border-neutral-700 bg-[#161622] py-1 shadow-lg font-mono text-xs">
                        {['Python 3.14', 'Next.js 15.2', 'React 19'].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => {
                              setRuntimeVersion(v);
                              setShowRuntimeMenu(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-white/10 text-neutral-300 hover:text-white"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inner Card: Code Editor or Properties */}
                {activeTab === 'code' ? (
                  <div className="rounded-xl border border-neutral-800/90 bg-[#09090d] p-2.5 sm:p-3 font-mono">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5 mb-2 text-[10px] font-mono">
                      <span className="text-neutral-400 font-bold uppercase tracking-wider">
                        Single File Sandbox Input
                      </span>
                      <span className="rounded border border-neutral-700 bg-[#14141e] px-1.5 py-0.5 text-[9px] font-bold text-neutral-300 tracking-wider">
                        SYNTAX: TSX
                      </span>
                    </div>
                    {/* Numbered Code Editor */}
                    <div className="code-scroll overflow-x-auto max-h-[190px] font-mono text-[11px] leading-relaxed select-text pr-2">
                      {generatedCode.split('\n').map((line, idx) => (
                        <div key={idx} className="flex">
                          <span className="w-6 shrink-0 text-right pr-2.5 text-neutral-600 select-none">
                            {idx + 1}
                          </span>
                          <span
                            className={`whitespace-pre ${
                              line.startsWith('//')
                                ? 'text-neutral-500 italic'
                                : line.includes('export') || line.includes('function') || line.includes('return')
                                ? 'text-[#c4b5fd]'
                                : line.includes('<') || line.includes('>')
                                ? 'text-[#7dd3fc]'
                                : line.includes('className')
                                ? 'text-[#f472b6]'
                                : 'text-neutral-300'
                            }`}
                          >
                            {line}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-neutral-800/90 bg-[#09090d] p-3 space-y-2.5 font-mono text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                        Headline Text
                      </label>
                      <input
                        type="text"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        className="w-full rounded-lg border border-neutral-700 bg-[#14141e] px-3 py-1 font-display text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                        Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={siteSubtitle}
                        onChange={(e) => setSiteSubtitle(e.target.value)}
                        className="w-full rounded-lg border border-neutral-700 bg-[#14141e] px-3 py-1 font-mono text-[11px] text-neutral-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full rounded-lg border border-neutral-700 bg-[#14141e] px-3 py-1 font-display text-xs font-bold text-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
                {/* Bottom Action: SIGN UP FREE TO SAVE Button */}
                <Link
                  href="/editor/saas-launch"
                  className="brutal-press w-full rounded-full border-[2.5px] border-black dark:border-[#26283d] bg-pink hover:bg-yellow text-black py-2.5 font-mono text-xs sm:text-sm font-black uppercase tracking-widest shadow-brutal-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>SIGN UP FREE TO SAVE</span>
                  <ArrowUpRight size={14} className="stroke-[3]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
