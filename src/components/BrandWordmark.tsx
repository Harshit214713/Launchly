'use client';

interface BrandWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandWordmark({ className = '', size = 'md' }: BrandWordmarkProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg tracking-[0.14em]',
    md: 'text-xl sm:text-2xl tracking-[0.16em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.18em]',
  };

  return (
    <span
      className={`font-brand font-black uppercase text-black dark:text-white inline-flex items-center select-none leading-none ${sizeClasses[size]} ${className}`}
    >
      <span>L</span>
      <span className="relative inline-flex items-center justify-center">
        <span>A</span>
        {/* The signature futuristic yellow triangle notch from the Launchly emblem */}
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
  );
}
