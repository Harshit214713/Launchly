import type { CSSProperties } from 'react';
import type { ElementStyle } from '@/lib/siteDocument';

function gradientValue(style: ElementStyle): string | undefined {
  const stops = style.gradientStops;
  if (!stops || stops.length < 2) return undefined;
  const type = style.gradientType || 'linear';
  const angle = Number.isFinite(style.gradientAngle) ? `${style.gradientAngle}deg, ` : '';
  return `${type}-gradient(${type === 'linear' || type === 'conic' ? angle : ''}${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;
}

/** Converts the editor's visual controls into styles shared by preview and live sites. */
export function elementVisualStyle(style: Partial<ElementStyle>): CSSProperties {
  const padding = style.padding;
  const margin = style.margin;
  const gradient = gradientValue(style as ElementStyle);
  return {
    color: style.color,
    backgroundColor: style.backgroundColor,
    backgroundImage: gradient || style.backgroundImage,
    backgroundSize: style.backgroundSize,
    backgroundPosition: style.backgroundPosition,
    backgroundRepeat: style.backgroundRepeat,
    backgroundAttachment: style.backgroundAttachment,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textAlign: style.textAlign,
    textTransform: style.textTransform,
    textDecoration: style.textDecoration,
    textShadow: style.textShadow,
    paddingTop: padding?.top,
    paddingRight: padding?.right,
    paddingBottom: padding?.bottom,
    paddingLeft: padding?.left,
    marginTop: margin?.top,
    marginRight: margin?.right,
    marginBottom: margin?.bottom,
    marginLeft: margin?.left,
    borderColor: style.borderColor,
    borderWidth: style.borderWidth,
    borderStyle: style.borderStyle,
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow || style.shadow,
    filter: style.filter || style.dropShadow,
    backdropFilter: style.backdropFilter,
    opacity: style.opacity,
    mixBlendMode: style.mixBlendMode as CSSProperties['mixBlendMode'],
    width: style.width ? `${style.width}%` : undefined,
    maxWidth: style.maxWidth,
    minWidth: style.minWidth,
    height: style.height,
    minHeight: style.minHeight,
    maxHeight: style.maxHeight,
    aspectRatio: style.aspectRatio,
    display: style.display,
    flexDirection: style.flexDirection,
    flexWrap: style.flexWrap,
    justifyContent: style.justifyContent,
    alignItems: style.alignItems,
    gap: style.gap,
    position: style.position,
    top: style.top,
    right: style.right,
    bottom: style.bottom,
    left: style.left,
    zIndex: style.zIndex,
    overflow: style.overflow,
    overflowX: style.overflowX,
    overflowY: style.overflowY,
    transform: style.transform,
    transformOrigin: style.transformOrigin,
    perspective: style.perspective,
    clipPath: style.clipPath,
  };
}
