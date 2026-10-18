'use client';

const TICKER_ITEMS = [
  'NO-CODE VISUAL BUILDER',
  '✦',
  'EXPORT NEXT.JS 15 CODE',
  '✦',
  '12+ DESIGNER TEMPLATES',
  '✦',
  'ZERO CONTEXT SWITCHING',
  '✦',
  'CUSTOM DOMAINS & SSL',
  '✦',
  'TAILWIND CSS V4',
  '✦',
  '100% RESPONSIVE',
  '✦',
  'STUDIO + CODE ON ONE SCREEN',
  '✦',
];

export default function MarqueeTicker() {
  return (
    <div className="w-full overflow-hidden border-b-[3px] border-black dark:border-[#222232] bg-pink py-2 text-black select-none z-20 relative">
      <div className="animate-marquee flex w-max items-center whitespace-nowrap">
        {/* List A */}
        <div className="flex items-center gap-6 pr-6">
          {TICKER_ITEMS.map((item, idx) => (
            <span
              key={`a-${idx}`}
              className={
                item === '✦'
                  ? 'text-base text-black'
                  : 'font-mono text-xs sm:text-[13px] font-black uppercase tracking-[0.18em] text-black'
              }
              aria-hidden={item === '✦'}
            >
              {item}
            </span>
          ))}
        </div>
        {/* List B for seamless infinite loop */}
        <div className="flex items-center gap-6 pr-6" aria-hidden="true">
          {TICKER_ITEMS.map((item, idx) => (
            <span
              key={`b-${idx}`}
              className={
                item === '✦'
                  ? 'text-base text-black'
                  : 'font-mono text-xs sm:text-[13px] font-black uppercase tracking-[0.18em] text-black'
              }
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
