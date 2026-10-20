export type ButtonTarget = 'url' | 'page' | 'anchor' | 'email' | 'phone';
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
