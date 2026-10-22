import type { SiteElement } from './siteDocument';

export function getElementAccessibilityProps(element: SiteElement): Record<string, string | number | boolean> {
  const props: Record<string, string | number | boolean> = {};
  const a11y = element.a11y;

  if (element.anchorId) props.id = element.anchorId;
  if (a11y?.role) props.role = a11y.role;
  if (a11y?.title) props.title = a11y.title;
  if (a11y?.ariaLabel) props['aria-label'] = a11y.ariaLabel;
  if (a11y?.ariaLabelledby) props['aria-labelledby'] = a11y.ariaLabelledby;
  if (a11y?.ariaDescribedby) props['aria-describedby'] = a11y.ariaDescribedby;
  if (a11y?.ariaHidden !== undefined) props['aria-hidden'] = a11y.ariaHidden;
  if (a11y?.ariaLive) props['aria-live'] = a11y.ariaLive;
  if (a11y?.tabIndex !== undefined) props.tabIndex = a11y.tabIndex;
  if (a11y?.lang) props.lang = a11y.lang;

  for (const [name, value] of Object.entries(element.advanced?.customAttributes || {})) {
    if (/^data-[a-z0-9_.:-]{1,80}$/i.test(name) && value.length <= 500) props[name] = value;
  }
  return props;
}
