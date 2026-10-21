'use client';

/* dnd-kit exposes callback refs and computed transforms from its hooks; these are required on drag targets. */
/* eslint-disable react-hooks/refs */

import type { ReactNode } from 'react';
import { GripVertical, Plus, Image as ImageIcon, Type, MousePointer2, Layout, Menu, List, Quote, Sparkles, SlidersHorizontal, Globe, Star, Layers } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function DraggablePaletteButton({ id, label, description, onClick, isPro = false, isLocked = false }: { id: string; label: string; description: string; onClick: () => void; isPro?: boolean; isLocked?: boolean }) {
  const drag = useDraggable({ id: `palette:${id}`, disabled: isLocked, data: { kind: 'palette', type: id, label } });
  const itemIcon = (() => {
    const value = `${id} ${label}`.toLowerCase();
    if (/image|photo|gallery|video|audio|logo|icon|avatar|svg|map/.test(value)) return ImageIcon;
    if (/heading|paragraph|text|quote|code|typewriter|marquee|rich/.test(value)) return Type;
    if (/button|link|action|payment|download|share/.test(value)) return MousePointer2;
    if (/navigation|navbar|menu|breadcrumb|pagination|toc/.test(value)) return Menu;
    if (/form|newsletter|booking|survey|contact|signup|login|search/.test(value)) return SlidersHorizontal;
    if (/list|table|faq|accordion|steps|timeline|comparison/.test(value)) return List;
    if (/quote|testimonial|review/.test(value)) return Quote;
    if (/section|column|container|layout|grid|row|spacer|divider/.test(value)) return Layout;
    if (/social|embed|integration|iframe|feed|calendar/.test(value)) return Globe;
    if (/animation|effect|interactive|carousel|slider|toggle|modal|popup/.test(value)) return Sparkles;
    if (/feature|stats|team|service|pricing|product|blog|portfolio|case study/.test(value)) return Layers;
    return Star;
  })();
  const ItemIcon = itemIcon;
  return <button ref={drag.setNodeRef} type="button" {...drag.listeners} {...drag.attributes} onClick={onClick} title={isLocked ? `${description} · Pro plan required` : `${description} · Drag onto the page or click to add`} className={`relative flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg border border-black bg-white px-2 py-1.5 font-mono text-[10px] font-bold leading-tight text-black shadow-[1.5px_1.5px_0_#000] transition-colors hover:bg-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${drag.isDragging ? 'opacity-40' : ''} ${isLocked ? 'border-dashed opacity-80' : ''}`}>
    <ItemIcon size={13} className="shrink-0 text-neutral-600" aria-hidden="true" />
    <GripVertical size={10} className="shrink-0 text-neutral-300" aria-hidden="true" />
    <span className="min-w-0 break-words text-center">{label}</span>{isPro && <span className="ml-0.5 shrink-0 rounded border border-black bg-yellow px-1 py-0.5 text-[8px] font-black uppercase">Pro</span>}
  </button>;
}

export function SortableSectionFrame({ id, index, source, children, className = '' }: { id: string; index: number; source: 'canvas' | 'sidebar'; children: ReactNode; className?: string }) {
  const sortable = useSortable({ id: `${source}-section:${id}`, data: { kind: 'section', sectionId: id, index, source } });
  return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={`relative ${className} ${sortable.isDragging ? 'z-20 opacity-40' : ''}`}>
    <button type="button" {...sortable.attributes} {...sortable.listeners} aria-label={`Drag section ${id}`} title="Drag to reorder section" className="absolute left-1 top-1 z-30 touch-none cursor-grab rounded bg-white/90 p-1 text-neutral-400 hover:bg-yellow hover:text-black active:cursor-grabbing"><GripVertical size={14} /></button>
    {children}
  </div>;
}

export function SectionDropMarker({ index, onClick }: { index: number; onClick?: (index: number) => void }) {
  const drop = useDroppable({ id: `canvas-drop:${index}`, data: { kind: 'section-drop', index } });
  return <div ref={drop.setNodeRef} className={`group relative flex h-3 items-center justify-center transition-all ${drop.isOver ? 'h-12' : 'hover:h-8'}`}>
    <div className={`h-0.5 w-full rounded-full transition-colors ${drop.isOver ? 'bg-pink' : 'bg-transparent group-hover:bg-pink/70'}`} />
    <button type="button" aria-label={`Add section at position ${index + 1}`} title="Add section" onClick={(event) => { event.stopPropagation(); onClick?.(index); }} className={`absolute inline-flex cursor-pointer items-center gap-1 rounded-full border border-pink bg-white px-3 py-1 font-mono text-[10px] font-bold text-black shadow-sm transition-opacity hover:bg-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-black ${drop.isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}><Plus size={11} /> Add section</button>
  </div>;
}
