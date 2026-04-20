interface MetricChipProps {
  label: string;
  value: string;
}

export function MetricChip({ label, value }: MetricChipProps) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-white px-3 py-3">
      <span className="text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </span>
      <span
        className="mt-0.5 text-[13px] font-medium leading-none text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {value}
      </span>
    </div>
  );
}
