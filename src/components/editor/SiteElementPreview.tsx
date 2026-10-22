'use client';

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { SiteElement } from '@/lib/siteDocument';

type Props = {
  element: SiteElement;
  style: CSSProperties;
  isEditor?: boolean;
  onChange?: (key: string, value: unknown, historyGroup?: string) => void;
};

const recordItems = (value: unknown): Array<Record<string, unknown>> => Array.isArray(value)
  ? value.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
  : [];
const textValue = (value: unknown, fallback = '') => typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
const subscribeCookieBanner = (callback: () => void) => {
  window.addEventListener('storage', callback);
  window.addEventListener('launchly-cookie-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('launchly-cookie-change', callback);
  };
};

export function supportsAdditionalElement(type: SiteElement['type']): boolean {
  return ['audio', 'html', 'lottie', 'map', 'chart', 'countdown', 'progress', 'rating', 'table', 'code', 'testimonial', 'stat', 'pricing-card', 'profile-card', 'feature-card', 'news-card', 'logo', 'avatar', 'before-after', 'device-mockup', 'qr-code', 'sticky-bar', 'cookie-banner', 'popup', 'marquee', 'typewriter'].includes(type);
}

export default function SiteElementPreview({ element, style, isEditor = false, onChange }: Props) {
  const content = element.content;
  const items = recordItems(content.items);
  const [seconds, setSeconds] = useState(Math.max(0, Number(content.seconds) || 0));
  const [comparison, setComparison] = useState(Math.max(0, Math.min(100, Number(content.position) || 50)));
  const [popupOpen, setPopupOpen] = useState(false);
  const cookieAccepted = useSyncExternalStore(
    subscribeCookieBanner,
    () => typeof window !== 'undefined' && localStorage.getItem(`launchly-cookie-${element.id}`) === 'accepted',
    () => false,
  );
  const title = textValue(content.title, element.name || element.type);
  const description = textValue(content.description || content.text);
  const editable = (key: string, value: string, className?: string) => isEditor && onChange
    ? <span contentEditable suppressContentEditableWarning onInput={(event) => onChange(key, event.currentTarget.textContent || '', `typing:${element.id}:${key}`)} className={className}>{value}</span>
    : value;

  useEffect(() => {
    if (element.type !== 'countdown') return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [element.type]);

  const image = (src: unknown, alt: unknown, className: string) => typeof src === 'string' && src
    ? <Image src={src} alt={textValue(alt)} width={1000} height={700} unoptimized className={className} />
    : <div className={`${className} grid place-items-center bg-neutral-100 text-xs text-neutral-500`}>Add an image in the inspector</div>;

  switch (element.type) {
    case 'audio':
      return <section style={style} className="rounded-xl border border-black/15 bg-white p-4 text-black"><h3 className="mb-3 font-bold">{editable('title', title)}</h3>{typeof content.src === 'string' && content.src ? <audio controls preload="none" src={content.src} className="w-full" /> : <p className="text-sm text-neutral-500">Add an audio URL in the inspector.</p>}</section>;
    case 'html':
      return <div style={style} className="rounded-xl border border-dashed border-black/30 bg-neutral-50 p-4 text-sm text-neutral-600">Custom HTML is not executed in the preview. Use standard elements or a trusted embed URL.</div>;
    case 'lottie':
      return <div style={style} role="img" aria-label={textValue(content.alt, title)} className="grid min-h-36 place-items-center rounded-xl border border-dashed border-black/25 bg-neutral-50 p-4 text-center"><div><p className="font-bold">{title}</p><p className="mt-1 text-xs text-neutral-500">Add a Lottie JSON URL to configure this animation.</p></div></div>;
    case 'map': {
      const src = textValue(content.src || content.url);
      return <section style={style} className="overflow-hidden rounded-xl border border-black/15 bg-white"><h3 className="p-3 font-bold">{title}</h3>{/^https:\/\//i.test(src) ? <iframe title={title} src={src} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms" referrerPolicy="no-referrer" className="h-64 w-full border-t border-black/10" /> : <p className="p-4 text-sm text-neutral-500">Add a secure map embed URL.</p>}</section>;
    }
    case 'chart': {
      const values = items.length ? items : [{ title: 'First', value: 64 }, { title: 'Second', value: 82 }, { title: 'Third', value: 47 }];
      const maximum = Math.max(1, ...values.map((item) => Number(item.value) || 0));
      return <section style={style} aria-label={title} className="rounded-xl border border-black/15 bg-white p-4"><h3 className="font-bold">{editable('title', title)}</h3><div className="mt-4 flex h-44 items-end gap-3 border-b border-black/15 px-2">{values.map((item, index) => { const value = Math.max(0, Number(item.value) || 0); return <div key={index} className="flex h-full min-w-0 flex-1 flex-col justify-end text-center"><span className="mb-1 text-xs font-bold">{value}</span><div role="img" aria-label={`${textValue(item.title, `Item ${index + 1}`)}: ${value}`} className="rounded-t bg-pink" style={{ height: `${Math.max(2, value / maximum * 85)}%` }} /><span className="mt-2 truncate text-[10px]">{textValue(item.title, `Item ${index + 1}`)}</span></div>; })}</div></section>;
    }
    case 'countdown': {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor(seconds % 86400 / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const remaining = seconds % 60;
      return <section style={style} className="rounded-xl border-2 border-black bg-yellow p-5 text-center"><h3 className="font-bold">{editable('title', title)}</h3><p className="mt-3 font-mono text-3xl font-black" aria-live="polite">{[days, hours, minutes, remaining].map((part) => String(part).padStart(2, '0')).join(' : ')}</p></section>;
    }
    case 'progress': {
      const maximum = Math.max(1, Number(content.max) || 100);
      const value = Math.max(0, Math.min(maximum, Number(content.value) || 0));
      return <section style={style} className="rounded-xl border border-black/15 bg-white p-4"><h3 className="font-bold">{editable('title', title)}</h3><div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-100"><div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={value} className="h-full rounded-full bg-pink" style={{ width: `${value / maximum * 100}%` }} /></div>{description && <p className="mt-2 text-sm">{description}</p>}</section>;
    }
    case 'rating': {
      const rating = Math.max(0, Math.min(5, Number(content.value) || 0));
      return <div style={style} role="img" aria-label={`${rating} out of 5 stars`} className="inline-flex items-center gap-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} aria-hidden="true" fill={index < Math.round(rating) ? 'currentColor' : 'none'} className={index < Math.round(rating) ? 'text-yellow-500' : 'text-neutral-300'} />)}<span className="ml-1 text-sm">{rating.toFixed(1)}</span></div>;
    }
    case 'table':
      return <div style={style} className="overflow-x-auto rounded-xl border border-black/15 bg-white text-black"><table className="w-full text-left text-sm"><caption className="p-3 text-left font-bold">{title}</caption><thead><tr className="bg-neutral-100">{(Array.isArray(content.columns) ? content.columns : ['Name', 'Details']).map((column, index) => <th key={index} className="px-3 py-2">{textValue(column)}</th>)}</tr></thead><tbody>{items.map((item, index) => <tr key={index} className="border-t border-black/10">{(Array.isArray(content.columns) ? content.columns : ['Name', 'Details']).map((column, columnIndex) => <td key={columnIndex} className="px-3 py-2">{textValue(item[textValue(column).toLowerCase()], textValue(Object.values(item)[columnIndex]))}</td>)}</tr>)}</tbody></table></div>;
    case 'code':
      return <pre style={style} className="overflow-x-auto rounded-xl bg-neutral-950 p-4 text-sm text-emerald-200"><code>{textValue(content.code || content.text, 'Add code in the inspector.')}</code></pre>;
    case 'testimonial':
      return <figure style={style} className="rounded-xl border-2 border-black bg-white p-5 text-black shadow-[3px_3px_0_#000]"><blockquote className="text-lg font-medium">“{editable('quote', textValue(content.quote || content.text, 'Add a customer quote.'))}”</blockquote><figcaption className="mt-4 text-sm"><strong>{editable('name', textValue(content.name, 'Customer name'))}</strong>{Boolean(content.role) && <span className="ml-2 text-neutral-500">{textValue(content.role)}</span>}</figcaption></figure>;
    case 'stat':
      return <div style={style} className="rounded-xl border-2 border-black bg-white p-5 text-black"><p className="text-3xl font-black">{editable('value', textValue(content.value, '0'))}</p><p className="mt-1 text-sm text-neutral-600">{editable('label', textValue(content.label, title))}</p></div>;
    case 'pricing-card':
      return <article style={style} className={`rounded-2xl border-2 border-black p-5 text-black ${content.highlighted ? 'bg-yellow shadow-[4px_4px_0_#000]' : 'bg-white'}`}><p className="font-mono text-xs font-bold uppercase">{editable('title', title)}</p><p className="my-4 text-3xl font-black">{editable('price', textValue(content.price, '$0'))}<span className="text-sm font-normal">{textValue(content.interval, '/ month')}</span></p><p className="text-sm">{description}</p><ul className="mt-4 list-inside list-disc space-y-1 text-sm">{(Array.isArray(content.features) ? content.features : []).map((feature, index) => <li key={index}>{textValue(feature)}</li>)}</ul>{Boolean(content.buttonText) && <a href={textValue(content.href, '#')} className="mt-5 inline-flex rounded-lg border-2 border-black bg-pink px-4 py-2 font-bold">{textValue(content.buttonText)}</a>}</article>;
    case 'profile-card':
    case 'feature-card':
    case 'news-card':
      return <article style={style} className="overflow-hidden rounded-xl border-2 border-black bg-white text-black shadow-[2px_2px_0_#000]">{image(content.image || content.src, content.alt || title, 'aspect-[4/3] w-full object-cover')}<div className="p-4"><h3 className="font-bold">{editable('title', title)}</h3>{Boolean(content.role) && <p className="mt-1 text-xs font-semibold text-neutral-500">{textValue(content.role)}</p>}<p className="mt-2 text-sm text-neutral-600">{editable('description', description || 'Add a description.')}</p>{Boolean(content.date) && <p className="mt-3 font-mono text-xs">{textValue(content.date)}</p>}</div></article>;
    case 'logo':
      return <div style={style} className="inline-flex items-center justify-center">{image(content.src || content.image, content.alt || title, 'max-h-16 w-auto object-contain')}</div>;
    case 'avatar':
      return <div style={style} className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-yellow font-bold text-black">{typeof (content.src || content.image) === 'string' && (content.src || content.image) ? image(content.src || content.image, content.alt || title, 'h-full w-full object-cover') : textValue(content.initials, title.slice(0, 2).toUpperCase())}</div>;
    case 'before-after':
      return <div style={style} className="relative overflow-hidden rounded-xl border-2 border-black"><div className="grid min-h-56 place-items-center bg-neutral-200 font-bold">AFTER</div><div className="absolute inset-y-0 left-0 grid place-items-center overflow-hidden bg-yellow font-bold" style={{ width: `${comparison}%` }}><span className="min-w-56 text-center">BEFORE</span></div><input aria-label="Before and after comparison" type="range" min="0" max="100" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} className="absolute inset-x-4 bottom-4" /></div>;
    case 'device-mockup':
      return <div style={style} className="mx-auto max-w-md rounded-[2rem] border-[8px] border-neutral-800 bg-neutral-900 p-2 shadow-xl"><div className="overflow-hidden rounded-[1.4rem] bg-white">{image(content.src || content.image, content.alt || title, 'aspect-[9/16] w-full object-cover')}</div></div>;
    case 'qr-code': {
      const data = textValue(content.data || content.text, title);
      return <div style={style} className="inline-grid gap-2 rounded-xl border border-black/15 bg-white p-4 text-center"><div aria-label={`QR code data: ${data}`} role="img" className="grid h-32 w-32 place-items-center border-4 border-black bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] text-[0px]">QR</div><span className="max-w-40 truncate text-xs">{data}</span></div>;
    }
    case 'sticky-bar':
      return <aside style={style} className={`${isEditor ? 'relative' : 'fixed inset-x-0 bottom-0 z-40'} flex flex-wrap items-center justify-center gap-3 border-t-2 border-black bg-yellow p-3 text-center text-sm font-bold text-black`}><span>{editable('text', textValue(content.text || content.title, 'Add your announcement.'))}</span>{Boolean(content.buttonText) && <a href={textValue(content.href, '#')} className="underline">{textValue(content.buttonText)}</a>}</aside>;
    case 'cookie-banner':
      return isEditor || !cookieAccepted ? <aside style={style} role="dialog" aria-label={title} className={`${isEditor ? 'relative' : 'fixed inset-x-3 bottom-3 z-50'} flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-black bg-white p-4 text-black shadow-[3px_3px_0_#000]`}><p className="text-sm">{editable('text', textValue(content.text || content.description, 'This site uses cookies to improve your experience.'))}</p><button type="button" onClick={() => { localStorage.setItem(`launchly-cookie-${element.id}`, 'accepted'); window.dispatchEvent(new Event('launchly-cookie-change')); }} className="rounded-lg border-2 border-black bg-yellow px-3 py-2 text-xs font-bold">Accept</button></aside> : null;
    case 'popup':
      return <div style={style} className="rounded-xl border border-black/15 bg-white p-4 text-black"><button type="button" onClick={() => setPopupOpen(true)} className="rounded-lg border-2 border-black bg-yellow px-4 py-2 font-bold">{textValue(content.buttonText, 'Open popup')}</button>{popupOpen && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) setPopupOpen(false); }}><div className="w-full max-w-lg rounded-xl border-2 border-black bg-white p-6 shadow-[5px_5px_0_#000]"><div className="flex items-start justify-between gap-3"><h2 className="text-xl font-black">{title}</h2><button type="button" onClick={() => setPopupOpen(false)} aria-label="Close popup" className="rounded border border-black px-2 py-1">×</button></div><p className="mt-3">{description}</p></div></div>}</div>;
    case 'marquee':
    case 'typewriter':
      return <div style={{ ...style, overflow: 'hidden' }} className="rounded-xl border-2 border-black bg-black px-4 py-3 font-mono font-bold text-yellow"><span className={element.type === 'marquee' && !isEditor ? 'inline-block whitespace-nowrap motion-safe:animate-[marquee_18s_linear_infinite]' : 'inline-block'}>{editable('text', textValue(content.text || content.title, 'Add animated text.'))}</span></div>;
    default:
      return null;
  }
}
