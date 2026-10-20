'use client';

/* dnd-kit exposes callback refs and computed transforms from its hooks; these are required on drag targets. */
/* eslint-disable react-hooks/refs */

import type { ReactNode } from 'react';
import { GripVertical, Plus } from 'lucide-react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function DraggablePaletteButton({ id, label, description, onClick }: { id: string; label: string; description: string; onClick: () => void }) {
  const drag = useDraggable({ id: `palette:${id}`, data: { kind: 'palette', type: id, label } });
  return <button ref={drag.setNodeRef} type="button" {...drag.listeners} {...drag.attributes} onClick={onClick} title={`${description} · Drag onto the page or click to add`} className={`flex min-h-10 items-center justify-center gap-1 rounded-lg border border-black bg-white px-2 py-1.5 font-mono text-[11px] font-bold text-black shadow-[1.5px_1.5px_0_#000] transition-colors hover:bg-yellow active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${drag.isDragging ? 'opacity-40' : ''}`}>
    <GripVertical size={12} className="shrink-0 text-neutral-400" aria-hidden="true" />
    <span>{label}</span>
  </button>;
}

export function SortableSectionFrame({ id, index, source, children, className = '' }: { id: string; index: number; source: 'canvas' | 'sidebar'; children: ReactNode; className?: string }) {
  const sortable = useSortable({ id: `${source}-section:${id}`, data: { kind: 'section', sectionId: id, index, source } });
  return <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={`relative ${className} ${sortable.isDragging ? 'z-20 opacity-40' : ''}`}>
    <button type="button" {...sortable.attributes} {...sortable.listeners} aria-label={`Drag section ${id}`} title="Drag to reorder section" className="absolute left-1 top-1 z-30 touch-none cursor-grab rounded bg-white/90 p-1 text-neutral-400 hover:bg-yellow hover:text-black active:cursor-grabbing"><GripVertical size={14} /></button>
    {children}
  </div>;
}

export function SectionDropMarker({ index }: { index: number }) {
  const drop = useDroppable({ id: `canvas-drop:${index}`, data: { kind: 'section-drop', index } });
  return <div ref={drop.setNodeRef} className={`group relative flex h-3 items-center justify-center transition-all ${drop.isOver ? 'h-12' : 'hover:h-8'}`}>
    <div className={`h-0.5 w-full rounded-full transition-colors ${drop.isOver ? 'bg-pink' : 'bg-transparent group-hover:bg-pink/70'}`} />
    <span className={`absolute inline-flex items-center gap-1 rounded-full border border-pink bg-white px-3 py-1 font-mono text-[10px] font-bold text-black shadow-sm transition-opacity ${drop.isOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}><Plus size={11} /> Add section</span>
  </div>;
}
