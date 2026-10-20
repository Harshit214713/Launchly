'use client';

/* dnd-kit callback refs are attached to each column as documented drop targets. */
/* eslint-disable react-hooks/refs */
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Camera, Heart, Sparkles, Star } from 'lucide-react';
import type { Column, Device, SiteElement } from '@/lib/siteDocument';
import SiteForm from '@/components/SiteForm';
import ImageCarousel from '@/components/ImageCarousel';
import { getAnimationClass } from '@/lib/elementActions';

type Props = {
  sectionId: string;
  columns: Column[];
  device: Device;
  selectedElementId: string | null;
  onSelectElement: (columnId: string, elementId: string) => void;
  onUpdateElement: (columnId: string, elementId: string, update: (element: SiteElement) => SiteElement) => void;
  onResizeColumn: (columnId: string, width: number) => void;
  onDuplicateElement: (columnId: string, elementId: string) => void;
  onDeleteElement: (columnId: string, elementId: string) => void;
};

export default function TreeSectionRenderer({ sectionId, columns, device, selectedElementId, onSelectElement, onUpdateElement, onResizeColumn, onDuplicateElement, onDeleteElement }: Props) {
  return <div className="grid grid-cols-12 gap-3 p-4" data-section-tree={sectionId}>
    {columns.map((column) => <TreeColumn key={column.id} sectionId={sectionId} column={column} device={device} selectedElementId={selectedElementId} onSelectElement={onSelectElement} onUpdateElement={onUpdateElement} onResizeColumn={onResizeColumn} onDuplicateElement={onDuplicateElement} onDeleteElement={onDeleteElement} />)}
  </div>;
}

type TreeColumnProps = Omit<Props, 'columns'> & { column: Column };

function TreeColumn({ sectionId, column, device, selectedElementId, onSelectElement, onUpdateElement, onResizeColumn, onDuplicateElement, onDeleteElement }: TreeColumnProps) {
  const drop = useDroppable({ id: `column-drop:${sectionId}:${column.id}`, data: { kind: 'column-drop', sectionId, columnId: column.id, index: column.elements.length } });
  const span = device === 'mobile' ? (column.width.mobile || 12) : device === 'tablet' ? (column.width.tablet || column.width.desktop || 12) : (column.width.desktop || 12);
  const style: CSSProperties = { gridColumn: `span ${span} / span ${span}`, minHeight: column.elements.length ? undefined : 96, backgroundColor: column.style.backgroundColor };
  return <div ref={drop.setNodeRef} style={style} className={`relative min-w-0 rounded-xl border-2 border-dashed p-3 pt-9 transition-colors ${drop.isOver ? 'border-pink bg-pink/10' : 'border-black/20'} ${column.elements.length ? 'space-y-3' : 'flex items-center justify-center'}`}>
    <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg border border-black/20 bg-white/90 p-1 font-mono text-[9px]" onPointerDown={(event) => event.stopPropagation()}><span className="text-neutral-500">{device}</span><input aria-label={`${device} column width`} type="number" min={1} max={12} value={span} onChange={(event) => onResizeColumn(column.id, Number(event.target.value))} className="w-9 rounded border border-black/20 px-1 text-center"/><span>/ 12</span></div>
    {column.elements.length ? <SortableContext items={column.elements.map((element) => `tree-element:${sectionId}:${column.id}:${element.id}`)} strategy={verticalListSortingStrategy}>{column.elements.map((element, index) => <TreeElement key={element.id} sectionId={sectionId} element={element} columnId={column.id} index={index} selected={selectedElementId === element.id} onSelect={onSelectElement} onUpdate={onUpdateElement} onDuplicate={onDuplicateElement} onDelete={onDeleteElement} />)}</SortableContext> : <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">Drop widgets here</span>}
    {drop.isOver && <span className="pointer-events-none rounded-full bg-pink px-3 py-1 font-mono text-[10px] font-bold text-black">Drop here</span>}
  </div>;
}

function TreeElement({ sectionId, element, columnId, index, selected, onSelect, onUpdate, onDuplicate, onDelete }: { sectionId: string; element: SiteElement; columnId: string; index: number; selected: boolean; onSelect: (columnId: string, elementId: string) => void; onUpdate: Props['onUpdateElement']; onDuplicate: Props['onDuplicateElement']; onDelete: Props['onDeleteElement'] }) {
  const sortable = useSortable({ id: `tree-element:${sectionId}:${columnId}:${element.id}`, data: { kind: 'element', sectionId, columnId, elementId: element.id, index } });
  const text = typeof element.content.text === 'string' ? element.content.text : typeof element.content.title === 'string' ? element.content.title : '';
  const style: CSSProperties = { color: element.style.color, backgroundColor: element.style.backgroundColor, fontFamily: element.style.fontFamily, fontSize: element.style.fontSize, fontWeight: element.style.fontWeight, textAlign: element.style.textAlign, borderRadius: element.style.borderRadius, maxWidth: element.style.maxWidth, marginTop: element.style.margin?.top, marginBottom: element.style.margin?.bottom, padding: element.style.padding ? `${element.style.padding.top || 0}px ${element.style.padding.right || 0}px ${element.style.padding.bottom || 0}px ${element.style.padding.left || 0}px` : undefined };
  const frame = (child: ReactNode) => <div ref={sortable.setNodeRef} style={{ transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }} className={`group/tree-element relative rounded-lg ${sortable.isDragging ? 'z-20 opacity-40' : ''} ${selected ? 'outline outline-2 outline-pink outline-offset-2' : 'hover:outline hover:outline-1 hover:outline-pink/60'}`} data-element-drop={element.id}><button type="button" {...sortable.attributes} {...sortable.listeners} aria-label={`Drag ${element.type}`} className="absolute -left-5 top-1 z-10 cursor-grab touch-none p-0.5 text-neutral-400 hover:text-black"><span aria-hidden="true">⠿</span></button><div className="absolute -top-3 right-1 z-10 hidden items-center gap-1 group-hover/tree-element:flex"><button type="button" onClick={(event) => { event.stopPropagation(); onSelect(columnId, element.id); }} className="rounded border border-black bg-yellow px-2 py-0.5 font-mono text-[9px] font-bold">{element.type}</button><button type="button" aria-label={`Duplicate ${element.type}`} onClick={(event) => { event.stopPropagation(); onDuplicate(columnId, element.id); }} className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">⧉</button><button type="button" aria-label={`Delete ${element.type}`} onClick={(event) => { event.stopPropagation(); onDelete(columnId, element.id); }} className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold">×</button></div><div className={getAnimationClass(element.style.animation)} onClick={(event) => { event.stopPropagation(); onSelect(columnId, element.id); }}>{child}</div></div>;
  switch (element.type) {
    case 'heading': return frame(<h2 style={style} contentEditable suppressContentEditableWarning onInput={(event) => { const value = event.currentTarget.innerText; onUpdate(columnId, element.id, (current) => ({ ...current, content: { ...current.content, text: value } })); }} className="text-3xl font-black">{text || 'Your heading'}</h2>);
    case 'text': return frame(<p style={style} contentEditable suppressContentEditableWarning onInput={(event) => { const value = event.currentTarget.innerText; onUpdate(columnId, element.id, (current) => ({ ...current, content: { ...current.content, text: value } })); }} className="min-h-6 whitespace-pre-wrap leading-relaxed">{text || 'Write something for your visitors.'}</p>);
    case 'button': return frame(<a href={typeof element.content.href === 'string' ? element.content.href : '#'} onClick={(event) => event.preventDefault()} style={style} className="inline-flex rounded-xl border-2 border-black bg-yellow px-5 py-3 font-bold shadow-[2px_2px_0_#000]">{text || 'Button label'}</a>);
    case 'image': return frame(typeof element.content.src === 'string' && element.content.src ? <Image src={element.content.src} alt={typeof element.content.alt === 'string' ? element.content.alt : ''} width={1200} height={900} unoptimized style={style} className="max-h-96 w-full rounded-xl object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-black/30 bg-neutral-50 font-mono text-xs text-neutral-500">Select image in properties</div>);
    case 'icon': { const Icon = ({ Star, Heart, Sparkles, Camera } as Record<string, typeof Star>)[String(element.content.icon || 'Star')] || Star; return frame(typeof element.content.src === 'string' && element.content.src ? <Image src={element.content.src} alt={String(element.content.alt || '')} width={256} height={256} unoptimized style={style} className="h-12 w-12 object-contain" /> : <Icon size={Number(element.content.size || 36)} style={style} />); }
    case 'divider': return frame(<hr style={{ borderColor: element.style.borderColor || '#111111', borderWidth: element.style.borderWidth || 1 }} />);
    case 'spacer': return frame(<div style={{ height: Number(element.content.height || 48) }} />);
    case 'video': return frame(typeof element.content.src === 'string' && element.content.src ? <video controls src={element.content.src} className="w-full rounded-xl" /> : <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-black/30 font-mono text-xs text-neutral-500">Add a video URL in properties</div>);
    case 'gallery': { const images = Array.isArray(element.content.images) ? element.content.images.filter((item): item is string => typeof item === 'string') : []; return frame(<ImageCarousel images={images} autoplay={Boolean(element.content.autoplay)} intervalMs={Number(element.content.intervalMs) || 4000} preview className="w-full" />); }
    case 'form': return frame(<SiteForm id={element.id} content={{ submitLabel: text || element.content.submitLabel || 'Send message', ...element.content }} style={style} className="rounded-xl border border-black/10 bg-white p-4" />);
    case 'html': return frame(<div style={style} className="min-h-8 rounded-lg border border-dashed border-black/20 p-3 font-mono text-xs text-neutral-600">Custom HTML is disabled in the editor preview for safety. Use text and layout elements instead.</div>);
    case 'list': { const items = Array.isArray(element.content.items) ? element.content.items : ['First item', 'Second item']; return frame(<ul style={style} className="list-inside list-disc space-y-1">{items.map((item, index) => <li key={index}>{String(item)}</li>)}</ul>); }
    case 'card': return frame(<article style={style} className="rounded-xl border-2 border-black bg-white p-5 shadow-[2px_2px_0_#000]"><h3 className="font-bold">{String(element.content.title || 'Card title')}</h3><p className="mt-2 text-sm">{String(element.content.description || 'Add a short description.')}</p></article>);
    case 'block': return frame(<div style={style} className="rounded-xl border border-black/10 bg-white/60 p-4"><strong className="font-mono text-xs uppercase">{String(element.content.blockType || 'Section')}</strong><p className="mt-1 text-xs text-neutral-500">This preset block is editable in the section properties.</p></div>);
    default: return frame(<div style={style} className="rounded-lg border border-dashed border-black/30 p-4 font-mono text-xs">{text || element.type}</div>);
  }
}
