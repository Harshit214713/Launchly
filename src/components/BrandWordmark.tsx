'use client';

interface BrandWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitle?: string;
  /** Force contrast when the surrounding surface is known (for example the editor's white chrome). */
  tone?: 'auto' | 'dark' | 'light';
}

export default function BrandWordmark({
  className = '',
  size = 'md',
  showSubtitle = true,
  subtitle = 'VISUAL WEB STUDIO',
  tone = 'auto',
}: BrandWordmarkProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg tracking-[0.14em]',
    md: 'text-xl sm:text-2xl tracking-[0.16em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.18em]',
  };

  const subtitleClasses = {
    sm: 'text-[7.5px] sm:text-[8px] tracking-[0.16em]',
    md: 'text-[8.5px] sm:text-[9.5px] tracking-[0.18em]',
    lg: 'text-[10px] sm:text-[11px] tracking-[0.2em]',
  };
  const wordmarkTone = tone === 'dark' ? 'text-black' : tone === 'light' ? 'text-white' : 'text-black dark:text-white';
  const subtitleTone = tone === 'dark' ? 'text-neutral-600' : tone === 'light' ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400';

  return (
    <div className={`inline-flex flex-col justify-center select-none ${className}`}>
      <span
        className={`font-brand font-black uppercase ${wordmarkTone} inline-flex items-center leading-none ${sizeClasses[size]}`}
      >
        <span>L</span>
        <span className="relative inline-flex items-center justify-center">
          <span>A</span>
          {/* Signature futuristic yellow triangle notch inside Launchly wordmark */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 bottom-[18%] pointer-events-none"
          >
            <svg
              viewBox="0 0 10 9"
              fill="none"
              className="w-[6px] h-[5px] sm:w-[7px] sm:h-[6px]"
            >
              <polygon points="5,0.5 9.5,8.5 0.5,8.5" fill="#ffd600" stroke="#111111" strokeWidth="1" />
            </svg>
          </span>
        </span>
        <span>UNCHLY</span>
      </span>

      {showSubtitle && (
        <span
          className={`font-mono font-bold uppercase ${subtitleTone} mt-0.5 leading-none ${subtitleClasses[size]}`}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
