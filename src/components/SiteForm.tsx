'use client';

import { useState } from 'react';

export type FormField = { id: string; label: string; name: string; type: 'text' | 'email' | 'tel' | 'textarea'; placeholder: string; required: boolean };
type FormConfig = {
  id: string;
  content: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
};

const defaultFields: FormField[] = [
  { id: 'name', label: 'Name', name: 'name', type: 'text', placeholder: 'Your name', required: true },
  { id: 'email', label: 'Email', name: 'email', type: 'email', placeholder: 'Email address', required: true },
  { id: 'message', label: 'Message', name: 'message', type: 'textarea', placeholder: 'How can we help?', required: true },
];

export function getDefaultFormFields(): FormField[] {
  return structuredClone(defaultFields);
}

export default function SiteForm({ id, content, style, className = '' }: FormConfig) {
  const [status, setStatus] = useState('');
  const configured = Array.isArray(content.fields) ? content.fields as FormField[] : defaultFields;
  const endpoint = typeof content.endpoint === 'string' ? content.endpoint : 'contact';
  const submitLabel = typeof content.submitLabel === 'string' ? content.submitLabel : 'Send message';

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    setStatus('Sending…');
    let url = '/api/contact';
    const nameField = configured.find((field) => field.name === 'name') || configured[0];
    const emailField = configured.find((field) => field.name === 'email' || field.type === 'email');
    const messageField = configured.find((field) => field.name === 'message' || field.type === 'textarea');
    let body: Record<string, unknown> = { ...fields, name: nameField ? fields[nameField.name] : undefined, email: emailField ? fields[emailField.name] : undefined, message: messageField ? fields[messageField.name] : undefined, category: `Website form: ${id}` };
    if (endpoint === 'newsletter') {
      url = '/api/newsletter';
      body = { email: emailField ? fields[emailField.name] : undefined, source: `website:${id}`, website: fields.website };
    } else if (endpoint === 'custom') {
      const configuredUrl = typeof content.apiUrl === 'string' ? content.apiUrl.trim() : '';
      try {
        const parsed = new URL(configuredUrl, window.location.origin);
        if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error();
        url = parsed.toString();
      } catch {
        setStatus('Enter a valid HTTP or HTTPS API URL in the form settings.');
        return;
      }
      body = { ...fields, formId: id };
    }
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({})) as { success?: boolean; message?: string };
      if (!response.ok || result.success === false) throw new Error(result.message || 'Could not submit this form.');
      form.reset();
      setStatus(String(content.successMessage || result.message || 'Thanks! Your response was submitted.'));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not submit this form. Please try again.');
    }
  };

  return <form onSubmit={submit} className={`grid max-w-xl gap-3 ${className}`}>
    {configured.map((field) => <label key={field.id} className="grid gap-1 text-sm font-semibold">
      {field.label}
      {field.type === 'textarea'
        ? <textarea name={field.name} required={field.required} placeholder={field.placeholder} rows={4} className="rounded-lg border border-black/20 px-3 py-2.5 font-normal" />
        : <input name={field.name} required={field.required} type={field.type} placeholder={field.placeholder} className="rounded-lg border border-black/20 px-3 py-2.5 font-normal" />}
    </label>)}
    {endpoint !== 'custom' && <label aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>}
    <button type="submit" style={style} className="justify-self-start rounded-lg bg-yellow px-5 py-3 font-bold">{submitLabel}</button>
    <p role="status" aria-live="polite" className="min-h-5 text-sm text-neutral-600">{status}</p>
  </form>;
}
