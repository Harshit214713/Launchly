'use client';

import { useEffect, useState, type CSSProperties, type ElementType, type FormEvent, type ReactNode } from 'react';
import Image from 'next/image';
import type { EditorWidgetKind } from '@/lib/editorWidgetRegistry';

type WidgetRecord = Record<string, unknown>;

type Props = {
  kind: EditorWidgetKind;
  widgetId: string;
  content: WidgetRecord;
  style?: CSSProperties;
  isEditor?: boolean;
  onChange?: (key: string, value: unknown, historyGroup?: string) => void;
};

const records = (value: unknown): WidgetRecord[] => Array.isArray(value)
  ? value.filter((item): item is WidgetRecord => typeof item === 'object' && item !== null && !Array.isArray(item))
  : [];

const text = (value: unknown, fallback = '') => typeof value === 'string' || typeof value === 'number'
  ? String(value)
  : fallback;

const safeHref = (value: unknown) => {
  const href = text(value).trim();
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href) ? href : '#';
};

const safeMediaSrc = (value: unknown) => {
  const src = text(value).trim();
  return /^(https?:\/\/|\/|data:image\/)/i.test(src) ? src : '';
};

export default function CatalogWidgetPreview({ kind, widgetId, content, style, isEditor = false, onChange }: Props) {
  const items = records(content.items);
  const title = text(content.title, widgetId);
  const description = text(content.description);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [comparison, setComparison] = useState(50);
  const [seconds, setSeconds] = useState(Math.max(0, Number(content.seconds) || 0));
  const [popupOpen, setPopupOpen] = useState(false);
  const [cookieVisible, setCookieVisible] = useState(true);
  useEffect(() => {
    if (kind !== 'interactive' || !/countdown/i.test(widgetId) || seconds <= 0 || isEditor) return;
    const timeout = window.setTimeout(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timeout);
  }, [isEditor, kind, seconds, widgetId]);
  const editable = (key: string, value: string, className?: string): ReactNode => isEditor && onChange
    ? <span dir="auto" contentEditable suppressContentEditableWarning onInput={(event) => onChange(key, event.currentTarget.textContent || '', `typing:widget:${widgetId}:${key}`)} className={className}>{value}</span>
    : value;
  const editableItem = (index: number, key: string, value: string): ReactNode => isEditor && onChange
    ? <span dir="auto" contentEditable suppressContentEditableWarning onInput={(event) => onChange('items', items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: event.currentTarget.textContent || '' } : item), `typing:widget:${widgetId}:items:${index}:${key}`)}>{value}</span>
    : value;
  const heading = <h2 className="text-2xl font-black tracking-tight">{editable('title', title)}</h2>;
  const intro = description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed opacity-75">{editable('description', description)}</p> : null;
  const visual = (item: WidgetRecord, index: number, className = 'h-40 w-full object-cover') => {
    const src = text(item.image || item.src || item.url);
    return src
      ? <Image src={src} alt={text(item.alt, text(item.title, `Item ${index + 1}`))} width={900} height={600} unoptimized className={className} />
      : <div role="img" aria-label={text(item.alt, `Image placeholder ${index + 1}`)} className={`${className} grid place-items-center bg-gradient-to-br from-yellow/35 via-pink/20 to-emerald-100 text-4xl font-black text-black/25`}>{String(index + 1).padStart(2, '0')}</div>;
  };
  const button = (label: string, href: unknown, className = '') => <a href={safeHref(href)} className={`inline-flex items-center justify-center rounded-lg border-2 border-current px-4 py-2 text-sm font-bold transition-colors hover:bg-black/5 ${className}`}>{label}<span aria-hidden="true" className="ml-2">↗</span></a>;
  const section = (children: ReactNode, className = '') => <section style={style} className={`rounded-2xl border border-current/15 p-5 ${className}`}>{children}</section>;
  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
    const configuredEndpoint = text(content.endpoint);
    const newsletter = configuredEndpoint === 'newsletter';
    const endpoint = newsletter ? '/api/newsletter' : configuredEndpoint === 'contact' ? '/api/contact' : configuredEndpoint;
    if (!endpoint || (!endpoint.startsWith('/api/') && !/^https:\/\//i.test(endpoint))) {
      setFormError('Use a local /api/ route or a secure https:// endpoint.');
      setSubmitting(false);
      return;
    }
    const payload = newsletter
      ? { email: fields.email, source: title, website: '' }
      : { ...fields, category: title, website: '' };
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(result.message || 'Submission failed. Please try again.');
      setSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (kind === 'interactive' && /countdown/i.test(widgetId)) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const remaining = seconds % 60;
    return section(<>{heading}<p className="mt-3 font-mono text-3xl font-black" aria-live="polite">{[days, hours, minutes, remaining].map((part) => String(part).padStart(2, '0')).join(' : ')}</p></>, 'bg-yellow/20 text-center');
  }

  if (kind === 'interactive' && /before.?after/i.test(widgetId)) return section(<>{heading}{intro}<div className="relative mt-4 h-64 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-200 to-yellow-100">
    {content.afterImage ? <Image src={text(content.afterImage)} alt="After" width={1000} height={700} unoptimized className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center font-bold">AFTER · add image URL</div>}
    <div className="absolute inset-y-0 left-0 grid place-items-center overflow-hidden border-r-2 border-white bg-gradient-to-br from-pink/30 to-amber-100" style={{ width: `${comparison}%` }}>
      <span className="font-bold">BEFORE · {content.beforeImage ? 'image set' : 'add image URL'}</span>
    </div>
    <input aria-label="Before and after comparison" type="range" min="0" max="100" value={comparison} onChange={(event) => { const value = Number(event.target.value); setComparison(value); onChange?.('position', value); }} className="absolute inset-x-4 bottom-3 z-10" />
  </div></>);

  if (kind === 'interactive' && /popup|modal/i.test(widgetId)) return <div style={style} className="rounded-xl border border-current/15 p-4">
    <button type="button" onClick={() => setPopupOpen(true)} className="rounded-lg border-2 border-current bg-yellow px-4 py-2 font-bold text-black">{text(content.buttonText, 'Open popup')}</button>
    {popupOpen && <div className="fixed inset-0 z-[160] grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => { if (event.target === event.currentTarget) setPopupOpen(false); }}><div className="w-full max-w-lg rounded-xl border-2 border-black bg-white p-6 text-black shadow-[5px_5px_0_#000]"><div className="flex items-start justify-between gap-3"><div>{heading}{intro}</div><button type="button" onClick={() => setPopupOpen(false)} aria-label="Close popup" className="rounded border border-black px-2 py-1">×</button></div></div></div>}
  </div>;

  if (kind === 'interactive' && /cookie|consent/i.test(widgetId)) return cookieVisible
    ? <aside style={style} role="dialog" aria-label={title} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-black bg-white p-4 text-black shadow-[3px_3px_0_#000]"><div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm">{description}</p></div><div className="flex gap-2"><button type="button" onClick={() => setCookieVisible(false)} className="rounded-lg border border-black px-3 py-2 text-xs font-bold">Decline</button><button type="button" onClick={() => setCookieVisible(false)} className="rounded-lg border-2 border-black bg-yellow px-3 py-2 text-xs font-bold">Accept</button></div></aside>
    : null;

  if (kind === 'text') {
    const normalizedId = widgetId.toLowerCase();
    if (/quote|pull-quote/.test(normalizedId)) {
      const item = items[0] || {};
      return section(<><blockquote className="border-l-4 border-current/30 py-2 pl-5 text-xl italic">{editableItem(0, 'quote', text(item.quote, title))}</blockquote><p className="mt-2 text-sm font-bold">{text(item.attribution, text(content.attribution))}</p></>);
    }
    if (/list/.test(normalizedId)) {
      const List = /numbered|ordered/.test(normalizedId) ? 'ol' : 'ul';
      return section(<>{heading}<List className={`mt-3 space-y-2 ${List === 'ol' ? 'list-decimal' : 'list-disc'} list-inside`}>{items.map((item, index) => <li key={index}>{editableItem(index, 'title', text(item.title, `Item ${index + 1}`))}{text(item.description) && <span className="ml-2 opacity-70">{text(item.description)}</span>}</li>)}</List></>);
    }
    if (/code/.test(normalizedId)) {
      return section(<><h3 className="mb-2 font-bold">{editable('title', title)}</h3><pre className="overflow-x-auto rounded-lg bg-neutral-950 p-4 font-mono text-sm text-white"><code>{editable('code', text(content.code, '// Add your code here'))}</code></pre></>);
    }
    const levelMatch = normalizedId.match(/(?:heading|h)([1-6])(?:\\b|$)/);
    const level = levelMatch ? Number(levelMatch[1]) : 2;
    const TextHeading = `h${level}` as ElementType;
    if (/heading/.test(normalizedId)) {
      return <TextHeading style={style} className={`font-black tracking-tight ${level < 3 ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{editable('title', title)}</TextHeading>;
    }
    if (/paragraph|body text|rich text/.test(normalizedId)) {
      return <p style={style} className="whitespace-pre-wrap leading-relaxed">{editable('description', description || title)}</p>;
    }
    return section(<>{heading}<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed opacity-75">{editable('description', description || text(items[0]?.description, 'Add supporting copy in the inspector.'))}</p></>);
  }

  if (kind === 'media') {
    const src = safeMediaSrc(content.url || content.src || items[0]?.image || items[0]?.src);
    const alt = text(content.alt || items[0]?.alt, title);
    if (/audio|podcast/i.test(widgetId)) {
      return section(<>{heading}{intro}{src ? <audio controls preload="metadata" className="mt-4 w-full" src={src}>Audio playback is not supported by this browser.</audio> : <p className="mt-4 rounded-lg border border-dashed border-current/25 p-4 text-sm">Add an audio URL in the inspector.</p>}</>);
    }
    if (/video|youtube|vimeo/i.test(widgetId)) {
      return section(<>{heading}{intro}{src && /^https:\/\//i.test(src) ? <iframe title={title} src={src} loading="lazy" sandbox="allow-scripts allow-same-origin allow-presentation" referrerPolicy="no-referrer" className="mt-4 aspect-video w-full rounded-xl border border-current/15" /> : <p className="mt-4 rounded-lg border border-dashed border-current/25 p-4 text-sm">Add a secure HTTPS video URL in the inspector.</p>}</>);
    }
    return section(<>{heading}{intro}{src
      ? <Image src={src} alt={alt} width={1200} height={800} unoptimized className="mt-4 max-h-[32rem] w-full rounded-xl object-cover" />
      : <div role="img" aria-label={alt || 'Media placeholder'} className="mt-4 grid min-h-48 place-items-center rounded-xl bg-gradient-to-br from-yellow/35 via-pink/20 to-emerald-100 text-4xl font-black text-black/25">Add media</div>}</>);
  }

  if (kind === 'hero') {
    return <section style={style} className="overflow-hidden rounded-2xl border border-current/15 bg-gradient-to-br from-yellow/20 via-pink/10 to-transparent px-6 py-12 sm:px-10">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-pink-700">{editable('eyebrow', text(content.eyebrow, 'A better way forward'))}</p>
      <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{editable('title', title)}</h2>
      {intro}
      {text(content.buttonText) && <div className="mt-6">{button(text(content.buttonText), content.href || content.linkValue || '#contact', 'bg-yellow')}</div>}
      {items.length > 0 && <div className="mt-8 grid gap-3 sm:grid-cols-3">{items.slice(0, 3).map((item, index) => <article key={index} className="rounded-xl border border-current/10 bg-white/70 p-4"><h3 className="font-bold">{text(item.title, `Highlight ${index + 1}`)}</h3><p className="mt-1 text-sm opacity-70">{text(item.description)}</p></article>)}</div>}
    </section>;
  }

  if (kind === 'metrics') return section(<><div>{heading}{intro}</div><div className="mt-6 grid gap-3 sm:grid-cols-3">{items.map((item, index) => <article key={index} className="rounded-xl border border-current/10 bg-current/[0.03] p-4"><p className="text-3xl font-black">{text(item.value, '0')}</p><h3 className="mt-1 text-sm font-semibold opacity-75">{text(item.title || item.label, `Metric ${index + 1}`)}</h3></article>)}</div></>);

  if (kind === 'testimonials') return section(<>{heading}{intro}<div className="mt-5 grid gap-3 md:grid-cols-2">{items.map((item, index) => <figure key={index} className="rounded-xl border border-current/10 bg-current/[0.03] p-4"><p className="text-amber-500" aria-label={`${Number(item.rating) || 5} out of 5 stars`}>{'★'.repeat(Math.max(1, Math.min(5, Number(item.rating) || 5)))}</p><blockquote className="mt-2 text-sm leading-relaxed">“{text(item.quote || item.description, 'Add a customer quote in the inspector.')}”</blockquote><figcaption className="mt-3 border-t border-current/10 pt-3 text-sm"><strong>{text(item.name || item.title, `Customer ${index + 1}`)}</strong>{text(item.role) && <span className="ml-2 opacity-60">{text(item.role)}</span>}</figcaption></figure>)}</div></>);

  if (kind === 'faq') return section(<>{heading}{intro}<div className="mt-4 divide-y divide-current/15 border-y border-current/15">{items.map((item, index) => <details key={index} className="py-3"><summary className="cursor-pointer font-bold">{text(item.title || item.question, `Question ${index + 1}`)}</summary><p className="mt-2 text-sm leading-relaxed opacity-75">{text(item.description || item.answer, 'Add the answer in the inspector.')}</p></details>)}</div></>);

  if (kind === 'timeline') return section(<>{heading}{intro}<ol className="mt-5 space-y-3 border-l-2 border-pink pl-5">{items.map((item, index) => <li key={index} className="relative rounded-xl border border-current/10 p-4 before:absolute before:-left-[1.65rem] before:top-5 before:h-3 before:w-3 before:rounded-full before:border-2 before:border-black before:bg-yellow"><p className="font-mono text-[10px] font-bold uppercase opacity-60">{text(item.date, `Step ${index + 1}`)}</p><h3 className="mt-1 font-bold">{text(item.title, `Milestone ${index + 1}`)}</h3><p className="mt-1 text-sm opacity-75">{text(item.description)}</p></li>)}</ol></>);

  if (kind === 'pricing') return section(<>{heading}{intro}<div className="mt-5 grid gap-3 md:grid-cols-3">{items.map((item, index) => <article key={index} className={`rounded-xl border-2 p-4 ${item.highlighted ? 'border-black bg-yellow text-black shadow-[3px_3px_0_#000]' : 'border-current/15'}`}><h3 className="font-bold">{text(item.title, `Plan ${index + 1}`)}</h3><p className="mt-3 text-3xl font-black">{text(item.price, 'Contact us')}<span className="ml-1 text-xs font-normal">{text(item.interval)}</span></p><p className="mt-2 text-sm opacity-75">{text(item.description)}</p><ul className="mt-4 space-y-2 text-sm">{(Array.isArray(item.features) ? item.features : []).map((feature, featureIndex) => <li key={featureIndex}>✓ {text(feature)}</li>)}</ul>{button(text(item.buttonText, 'Choose plan'), item.href || '#contact', 'mt-5')}</article>)}</div></>);

  if (kind === 'navigation') return <nav style={style} aria-label={title} className="rounded-xl border border-current/15 p-4"><p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">{editable('title', title)}</p><ul className="flex flex-wrap gap-2">{items.map((item, index) => <li key={index}><a href={safeHref(item.href || item.url)} className="rounded-lg px-3 py-2 text-sm font-semibold underline-offset-4 hover:underline">{text(item.title || item.label, `Link ${index + 1}`)}</a></li>)}</ul></nav>;

  if (kind === 'form') return <form style={style} onSubmit={(event: FormEvent<HTMLFormElement>) => { void submitForm(event); }} className="grid gap-3 rounded-2xl border-2 border-current/15 p-5" aria-label={title}>
    {heading}{intro}
    {items.map((item, index) => {
      const label = text(item.title || item.label, `Field ${index + 1}`);
      const type = text(item.type, 'text');
      const name = text(item.name, `field-${index + 1}`);
      return <label key={name} className="grid gap-1 text-sm font-semibold">{label}{type === 'textarea'
        ? <textarea name={name} required={Boolean(item.required)} className="min-h-24 rounded-lg border border-current/25 bg-transparent p-2" />
        : <input name={name} type={['email', 'tel', 'date', 'number'].includes(type) ? type : 'text'} required={Boolean(item.required)} placeholder={text(item.placeholder)} className="rounded-lg border border-current/25 bg-transparent p-2" />}</label>;
    })}
    <button type="submit" disabled={submitting} className="w-fit rounded-lg border-2 border-current bg-yellow px-4 py-2 font-bold text-black disabled:opacity-60">{submitting ? 'Sending…' : text(content.submitLabel, 'Send message')}</button>
    {formError && <p role="alert" className="rounded-lg bg-red-100 p-3 text-sm font-bold text-red-900">{formError}</p>}
    {submitted && <p role="status" className="rounded-lg bg-emerald-100 p-3 text-sm font-bold text-emerald-950">{text(content.successMessage, 'Your response has been received.')}</p>}
  </form>;

  if (kind === 'gallery' || kind === 'commerce' || kind === 'editorial' || kind === 'people' || kind === 'cards') {
    const cardTitle = (item: WidgetRecord, index: number) => text(item.title || item.name || item.label, `Item ${index + 1}`);
    return section(<>{heading}{intro}<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((item, index) => <article key={index} className="overflow-hidden rounded-xl border border-current/15 bg-white/70 text-neutral-950">
      {kind !== 'people' || item.image || item.src ? visual(item, index) : <div className="grid h-28 place-items-center bg-gradient-to-br from-pink/20 to-yellow/40 text-3xl font-black">{cardTitle(item, index).slice(0, 1)}</div>}
      <div className="p-4">{text(item.category || item.role || item.date) && <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-pink-700">{text(item.category || item.role || item.date)}</p>}<h3 className="mt-1 font-bold">{cardTitle(item, index)}</h3><p className="mt-1 text-sm leading-relaxed text-neutral-600">{text(item.description || item.desc || item.quote)}</p>{kind === 'commerce' && <div className="mt-4 flex items-center justify-between gap-2"><strong>{text(item.price, 'Add price')}</strong>{Boolean(item.href) && <a href={safeHref(item.href)} className="rounded-lg border border-black px-3 py-1.5 text-xs font-bold">View item</a>}</div>}</div>
    </article>)}</div></>);
  }

  if (kind === 'embed') {
    const url = text(content.url || content.src);
    return section(<>{heading}{intro}{/^https:\/\//i.test(url)
      ? <iframe title={title} src={url} loading="lazy" sandbox="allow-scripts allow-forms allow-presentation" referrerPolicy="no-referrer" className="mt-4 h-72 w-full rounded-xl border border-current/15" />
      : <p className="mt-4 rounded-xl border border-dashed border-current/25 p-6 text-sm opacity-70">Add a secure HTTPS embed URL in the content fields.</p>}</>);
  }

  if (kind === 'table') return <div style={style} className="overflow-x-auto rounded-xl border border-current/15"><table className="w-full text-left text-sm"><caption className="p-4 text-left text-lg font-bold">{title}</caption><thead><tr className="bg-yellow text-black"><th className="p-3">Option</th><th className="p-3">Details</th><th className="p-3">Status</th></tr></thead><tbody>{items.map((item, index) => <tr key={index} className="border-t border-current/10"><th scope="row" className="p-3 font-bold">{text(item.title, `Row ${index + 1}`)}</th><td className="p-3">{text(item.description || item.value)}</td><td className="p-3">{text(item.status)}</td></tr>)}</tbody></table></div>;

  if (kind === 'actions') return <div style={style} className="flex flex-wrap items-center gap-3">{items.map((item, index) => button(text(item.title || item.label, `Action ${index + 1}`), item.href || item.url))}</div>;

  if (kind === 'interactive') return section(<>{heading}{intro}<div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={title}>{items.map((item, index) => <button key={index} type="button" role="tab" aria-selected={activeTab === index} onClick={() => setActiveTab(index)} className={`rounded-lg border px-3 py-2 text-sm font-bold ${activeTab === index ? 'border-black bg-yellow text-black' : 'border-current/20'}`}>{text(item.title, `Option ${index + 1}`)}</button>)}</div>{items[activeTab] && <div role="tabpanel" className="mt-3 rounded-xl border border-current/10 p-4"><p className="text-sm leading-relaxed opacity-75">{text(items[activeTab].description, 'Add panel content in the inspector.')}</p></div>}{/before.after|comparison|slider/i.test(widgetId) && <div className="relative mt-4 grid h-40 place-items-center overflow-hidden rounded-xl bg-gradient-to-r from-yellow/40 to-pink/30"><span className="font-black">COMPARISON PREVIEW</span><input aria-label="Comparison position" type="range" min="0" max="100" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} className="absolute inset-x-4 bottom-3" /></div>}</>);

  return section(<>{heading}{intro}{items.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-2">{items.map((item, index) => <article key={index} className="rounded-xl border border-current/10 bg-current/[0.03] p-4"><h3 className="font-bold">{text(item.title, `Item ${index + 1}`)}</h3><p className="mt-1 text-sm leading-relaxed opacity-75">{text(item.description || item.desc)}</p></article>)}</div>}</>, kind === 'layout' ? 'min-h-28 bg-current/[0.03]' : '');
}
