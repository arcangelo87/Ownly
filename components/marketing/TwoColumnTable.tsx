interface TwoColumnTableProps {
  col1Heading: string;
  col2Heading: string;
  col1Items: string[];
  col2Items: string[];
}

export function TwoColumnTable({ col1Heading, col2Heading, col1Items, col2Items }: TwoColumnTableProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[8px] overflow-hidden">
      <div className="bg-[var(--color-bg)] p-6">
        <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4">
          {col1Heading}
        </h4>
        <ul className="flex flex-col gap-3">
          {col1Items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] text-[var(--color-text)] leading-[1.5]">
              <span className="mt-[5px] shrink-0 w-[5px] h-[5px] rounded-full bg-[var(--color-muted)]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-[var(--color-surface)] p-6">
        <h4 className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-4">
          {col2Heading}
        </h4>
        <ul className="flex flex-col gap-3">
          {col2Items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[14px] text-[var(--color-text)] leading-[1.5]">
              <span className="mt-[5px] shrink-0 w-[5px] h-[5px] rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
