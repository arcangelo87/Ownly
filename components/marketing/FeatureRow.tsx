interface FeatureRowProps {
  label: string;
  description: string;
}

export function FeatureRow({ label, description }: FeatureRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 py-6 border-b border-[var(--color-border)] last:border-b-0">
      <div className="shrink-0 sm:w-[200px]">
        <span className="text-[14px] font-semibold text-[var(--color-text)] tracking-[-0.01em]">
          {label}
        </span>
      </div>
      <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">
        {description}
      </p>
    </div>
  );
}
