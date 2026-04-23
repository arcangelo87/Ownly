interface MockDealCardProps {
  sector: string;
  location: string;
  title: string;
  revenue: string;
  ebitda: string;
  asking: string;
  employees: number;
  timeline: string;
}

export function MockDealCard({
  sector,
  location,
  title,
  revenue,
  ebitda,
  asking,
  employees,
  timeline,
}: MockDealCardProps) {
  const initial = sector.charAt(0);

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-[8px] overflow-hidden shadow-[0_2px_16px_rgba(26,26,24,0.07)] w-full">
      {/* Photo block */}
      <div className="h-[168px] bg-[var(--color-surface)] flex items-center justify-center relative">
        <span
          className="font-[family-name:var(--font-serif)] text-[48px] font-normal text-[var(--color-border)] select-none"
          aria-hidden="true"
        >
          {initial}
        </span>
      </div>

      {/* Body */}
      <div className="px-[18px] py-[16px] pb-[20px]">
        <div className="flex justify-between items-baseline mb-[10px]">
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-accent)]">
            {sector}
          </span>
          <span className="text-[12px] text-[var(--color-muted)]">{location}</span>
        </div>

        <p className="font-[family-name:var(--font-serif)] text-[15px] font-medium leading-[1.4] mb-[14px] text-[var(--color-text)]">
          {title}
        </p>

        <div className="grid grid-cols-3 gap-[10px] mb-[14px] pb-[14px] border-b border-[var(--color-border)]">
          <div className="flex flex-col gap-[3px]">
            <span className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[var(--color-muted)]">
              Revenue
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--color-text)]">
              {revenue}
            </span>
          </div>
          <div className="flex flex-col gap-[3px]">
            <span className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[var(--color-muted)]">
              EBITDA
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--color-text)]">
              {ebitda}
            </span>
          </div>
          <div className="flex flex-col gap-[3px]">
            <span className="text-[10px] font-semibold tracking-[0.06em] uppercase text-[var(--color-muted)]">
              Asking
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--color-text)]">
              {asking}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[12px] text-[var(--color-muted)]">
            {employees} employees · {timeline}
          </span>
          <span className="text-[13px] font-medium text-[var(--color-terracotta)] tracking-[-0.01em]">
            View deal →
          </span>
        </div>
      </div>
    </div>
  );
}
