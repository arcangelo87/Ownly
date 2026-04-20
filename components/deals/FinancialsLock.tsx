interface FinancialsLockProps {
  lockedLabel: string;
  lockedDetail: string;
}

const GHOST_ROWS = [
  'Revenue (last FY)',
  'EBITDA (€)',
  'Net profit margin',
  'Revenue growth (3yr CAGR)',
];

export function FinancialsLock({ lockedLabel, lockedDetail }: FinancialsLockProps) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-white">
      <div className="divide-y divide-[var(--color-border)] px-5" aria-hidden="true">
        {GHOST_ROWS.map((label) => (
          <div key={label} className="flex items-center justify-between py-3">
            <span className="text-[13px] text-[var(--color-muted)] opacity-40 select-none">{label}</span>
            <span className="h-[13px] w-20 rounded bg-[var(--color-border)] opacity-50" />
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] px-5 py-4">
        <p className="text-[13px] font-semibold text-[var(--color-text)]">{lockedLabel}</p>
        <p className="mt-1 text-[12px] leading-[1.6] text-[var(--color-muted)]">{lockedDetail}</p>
      </div>
    </div>
  );
}
