'use client';

import { useTranslations } from 'next-intl';
import { SECTOR_LABELS } from '@/lib/format';

export interface Filters {
  countries: string[];
  sectors: string[];
  priceRange: string;
  timelines: string[];
}

interface DealFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const PRICE_OPTIONS = [
  { value: 'any', labelKey: 'any' },
  { value: 'under_1m', labelKey: 'priceUnder1m' },
  { value: '1m_2m', labelKey: 'price1to2m' },
  { value: '2m_4m', labelKey: 'price2to4m' },
  { value: 'over_4m', labelKey: 'priceOver4m' },
] as const;

const TIMELINE_OPTIONS = [
  { value: 'ready_now', labelKey: 'timelineReadyNow' },
  { value: '6_12_months', labelKey: 'timeline6to12' },
  { value: '1_2_years', labelKey: 'timeline1to2' },
  { value: 'exploring', labelKey: 'timelineExploring' },
] as const;

function SectionHeading({ label }: { label: string }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-muted)]">
      {label}
    </p>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1">
      <span
        className={[
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
          checked
            ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
            : 'border-[var(--color-border)] bg-white',
        ].join(' ')}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-[13px] text-[var(--color-text)]">{label}</span>
    </label>
  );
}

export function DealFilters({ filters, onChange }: DealFiltersProps) {
  const t = useTranslations('deals.browse.filters');

  function toggleCountry(code: string) {
    const next = filters.countries.includes(code)
      ? filters.countries.filter((c) => c !== code)
      : [...filters.countries, code];
    onChange({ ...filters, countries: next });
  }

  function toggleSector(sectorKey: string) {
    const next = filters.sectors.includes(sectorKey)
      ? filters.sectors.filter((s) => s !== sectorKey)
      : [...filters.sectors, sectorKey];
    onChange({ ...filters, sectors: next });
  }

  function toggleTimeline(val: string) {
    const next = filters.timelines.includes(val)
      ? filters.timelines.filter((tl) => tl !== val)
      : [...filters.timelines, val];
    onChange({ ...filters, timelines: next });
  }

  return (
    <div className="flex flex-col gap-7">
      {/* Country */}
      <div>
        <SectionHeading label={t('country')} />
        <CheckboxRow
          checked={filters.countries.includes('IT')}
          onChange={() => toggleCountry('IT')}
          label={t('italy')}
        />
        <CheckboxRow
          checked={filters.countries.includes('PT')}
          onChange={() => toggleCountry('PT')}
          label={t('portugal')}
        />
      </div>

      {/* Sector */}
      <div>
        <SectionHeading label={t('sector')} />
        {Object.entries(SECTOR_LABELS).map(([key, sectorLabel]) => (
          <CheckboxRow
            key={key}
            checked={filters.sectors.includes(key)}
            onChange={() => toggleSector(key)}
            label={sectorLabel}
          />
        ))}
      </div>

      {/* Asking price */}
      <div>
        <SectionHeading label={t('askingPrice')} />
        {PRICE_OPTIONS.map(({ value, labelKey }) => (
          <label key={value} className="flex cursor-pointer items-center gap-2.5 py-1">
            <span
              className={[
                'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
                filters.priceRange === value
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                  : 'border-[var(--color-border)] bg-white',
              ].join(' ')}
            >
              {filters.priceRange === value && (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </span>
            <input
              type="radio"
              name="priceRange"
              value={value}
              checked={filters.priceRange === value}
              onChange={() => onChange({ ...filters, priceRange: value })}
              className="sr-only"
            />
            <span className="text-[13px] text-[var(--color-text)]">{t(labelKey)}</span>
          </label>
        ))}
      </div>

      {/* Timeline */}
      <div>
        <SectionHeading label={t('timeline')} />
        {TIMELINE_OPTIONS.map(({ value, labelKey }) => (
          <CheckboxRow
            key={value}
            checked={filters.timelines.includes(value)}
            onChange={() => toggleTimeline(value)}
            label={t(labelKey)}
          />
        ))}
      </div>
    </div>
  );
}
