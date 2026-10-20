interface ComingSoonCardProps {
  category: string;
  onBrowseAll: () => void;
  onExploreEcommerce: () => void;
  className?: string;
}

export default function ComingSoonCard({
  category,
  onBrowseAll,
  onExploreEcommerce,
  className = '',
}: ComingSoonCardProps) {
  return (
    <div className={`mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-3xl border-[3px] border-ink bg-card p-8 text-center shadow-brutal sm:p-10 ${className}`}>
      <div aria-hidden="true" className="mb-5 text-6xl">🚧</div>
      <h3 className="mb-3 font-display text-3xl font-black text-ink">Coming Soon!</h3>
      <p className="mb-6 max-w-md font-mono text-sm text-muted-foreground">
        The <span className="font-black text-pink">{category}</span> category is under development. We&apos;re working hard to bring you amazing templates in this category.
      </p>
      <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onBrowseAll}
          className="brutal-press w-full rounded-xl border-[2.5px] border-ink bg-pink px-6 py-3 font-display text-xs font-black text-black shadow-brutal sm:w-auto"
        >
          Browse All Templates
        </button>
        <button
          type="button"
          onClick={onExploreEcommerce}
          className="brutal-press w-full rounded-xl border-[2.5px] border-ink bg-yellow px-6 py-3 font-display text-xs font-black text-black shadow-brutal sm:w-auto"
        >
          View Ecommerce Templates
        </button>
      </div>
    </div>
  );
}
