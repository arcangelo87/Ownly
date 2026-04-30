'use client';

import { useTranslations } from 'next-intl';

export type SortOption = 'recent' | 'price_asc' | 'revenue_desc' | 'ebitda_desc';

interface DealSortProps {
  sort: SortOption;
  count: number;
  onChange: (sort: SortOption) => void;
}

export function DealSort({ sort, count, onChange }: DealSortProps) {
  const t = useTranslations('deals.browse');

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[13px] text-[var(--color-muted)]">
        {t('resultCount', { count })}
      </span>

      <div className="relative flex items-center">
        <label className="sr-only">{t('sort.label')}</label>
        <select
          value={sort}
          onChange={({ target }: { target: HTMLSelectElement }) => onChange(target.value as SortOption)}
          className="appearance-none rounded-md border border-[var(--color-border)] bg-white py-1.5 pl-3 pr-8 text-[13px] text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-text)]"
        >
          <option value="recent">{t('sort.recent')}</option>
          <option value="price_asc">{t('sort.priceAsc')}</option>
          <option value="revenue_desc">{t('sort.revenueDesc')}</option>
          <option value="ebitda_desc">{t('sort.ebitdaDesc')}</option>
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
