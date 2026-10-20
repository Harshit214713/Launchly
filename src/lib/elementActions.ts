export type ButtonTarget = 'url' | 'page' | 'anchor' | 'email' | 'phone';

export function resolveButtonHref(target: ButtonTarget, value: string, pages: Array<{ id: string; slug?: string; isHome?: boolean }>, pagePrefix = ''): string {
  const normalized = value.trim();
  if (!normalized) return '#';
  if (target === 'email') return `mailto:${normalized.replace(/^mailto:/i, '')}`;
  if (target === 'phone') return `tel:${normalized.replace(/^tel:/i, '')}`;
  if (target === 'anchor') return `#${normalized.replace(/^#/, '')}`;
  if (target === 'page') {
    const page = pages.find((entry) => entry.id === normalized);
    return page ? `${pagePrefix}${page.isHome ? '' : page.slug}` || '/' : '#';
  }
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(normalized)) return normalized;
  if (/^[a-z][a-z\d+.-]*:/i.test(normalized)) return '#';
  return `https://${normalized}`;
}
