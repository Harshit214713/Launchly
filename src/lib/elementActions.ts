export type ButtonTarget = 'url' | 'page' | 'anchor' | 'email' | 'phone' | 'whatsapp' | 'telegram' | 'discord' | 'download' | 'back-to-top';
export type AnimationPreset = 'fade-in' | 'slide-up' | 'slide-left' | 'zoom-in' | 'float' | 'pulse';

const animationClasses: Record<AnimationPreset, string> = {
  'fade-in': 'launchly-motion-fade-in',
  'slide-up': 'launchly-motion-slide-up',
  'slide-left': 'launchly-motion-slide-left',
  'zoom-in': 'launchly-motion-zoom-in',
  float: 'launchly-motion-float',
  pulse: 'launchly-motion-pulse',
};

export function getAnimationClass(preset?: string): string {
  return preset && preset in animationClasses ? animationClasses[preset as AnimationPreset] : '';
}

export function resolveButtonHref(target: ButtonTarget, value: string, pages: Array<{ id: string; slug?: string; isHome?: boolean }>, pagePrefix = ''): string {
  const normalized = value.trim();
  if (target === 'back-to-top') return '#top';
  if (!normalized) return '#';
  if (target === 'email') return `mailto:${normalized.replace(/^mailto:/i, '')}`;
  if (target === 'phone') return `tel:${normalized.replace(/^tel:/i, '')}`;
  if (target === 'whatsapp') return `https://wa.me/${normalized.replace(/\D/g, '')}`;
  if (target === 'telegram') return `https://t.me/${normalized.replace(/^@/, '').replace(/^https?:\/\/(www\.)?t\.me\//i, '')}`;
  if (target === 'discord') return safeWebUrl(normalized);
  if (target === 'anchor') return `#${normalized.replace(/^#/, '')}`;
  if (target === 'page') {
    const page = pages.find((entry) => entry.id === normalized);
    if (!page) return '#';
    if (page.isHome) return pagePrefix || '/';
    const slug = (page.slug || '').replace(/^\/+|\/+$/g, '');
    return `${pagePrefix.replace(/\/$/, '')}/${slug}` || '/';
  }
  return safeWebUrl(normalized);
}

function safeWebUrl(value: string): string {
  if (/^(https?:\/\/|\/|#)/i.test(value)) return value;
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return '#';
  return `https://${value}`;
}
