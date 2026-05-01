'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DealCard } from '@/components/deals/DealCard';
import { DealFilters, type Filters } from '@/components/deals/DealFilters';
import { DealSort, type SortOption } from '@/components/deals/DealSort';
import type { ListingCard } from '@/app/[locale]/deals/page';

const PRICE_FILTER_MAP: Record<string, string[]> = {
  under_1m: ['under_500k', '500k_1m'],
  '1m_2m': ['1m_2m'],
  '2m_4m': ['2m_4m'],
  over_4m: ['over_4m'],
};

const PRICE_ORDER: Record<string, number> = {
  under_500k: 0, '500k_1m': 1, '1m_2m': 2, '2m_4m': 3, over_4m: 4, not_sure: 5,
};
const REVENUE_ORDER: Record<string, number> = {
  under_500k: 0, '500k_1m': 1, '1m_2_5m': 2, '2_5m_5m': 3, over_5m: 4,
};
const EBITDA_ORDER: Record<string, number> = {
  not_sure: -1, below_10: 0, '10_20': 1, '20_35': 2, above_35: 3,
};

const DEFAULT_FILTERS: Filters = {
  countries: [],
  sectors: [],
  priceRange: 'any',
  timelines: [],
};

interface DealListingPageProps {
  listings: ListingCard[];
  locale: string;
}

function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.countries.length > 0 ||
    filters.sectors.length > 0 ||
    filters.priceRange !== 'any' ||
    filters.timelines.length > 0
  );
}

export function DealListingPage({ listings }: DealListingPageProps) {
  const t = useTranslations('deals.browse');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = listings;

    if (filters.countries.length > 0) {
      result = result.filter((l) => l.country && filters.countries.includes(l.country));
    }
    if (filters.sectors.length > 0) {
      result = result.filter((l) => l.sector && filters.sectors.includes(l.sector));
    }
    if (filters.priceRange !== 'any') {
      const allowed = PRICE_FILTER_MAP[filters.priceRange] ?? [];
      result = result.filter((l) => l.asking_price && allowed.includes(l.asking_price));
    }
    if (filters.timelines.length > 0) {
      result = result.filter((l) => l.timeline && filters.timelines.includes(l.timeline));
    }

    return result;
  }, [listings, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case 'price_asc':
        return arr.sort(
          (a, b) => (PRICE_ORDER[a.asking_price ?? ''] ?? 99) - (PRICE_ORDER[b.asking_price ?? ''] ?? 99),
        );
      case 'revenue_desc':
        return arr.sort(
          (a, b) => (REVENUE_ORDER[b.revenue_range ?? ''] ?? -1) - (REVENUE_ORDER[a.revenue_range ?? ''] ?? -1),
        );
      case 'ebitda_desc':
        return arr.sort(
          (a, b) => (EBITDA_ORDER[b.ebitda_margin ?? ''] ?? -1) - (EBITDA_ORDER[a.ebitda_margin ?? ''] ?? -1),
        );
      default:
        return arr;
    }
  }, [filtered, sort]);

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="mb-4 md:hidden">
        <button
          onClick={() => setFiltersOpen((v: boolean) => !v)}
          className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-[13px] text-[var(--color-text)]"
        >
          <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
            <path d="M1 2h12M3 6h8M5 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {t('showFilters')}
          {hasActiveFilters(filters) && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-semibold text-white">
              {filters.countries.length + filters.sectors.length + filters.timelines.length + (filters.priceRange !== 'any' ? 1 : 0)}
            </span>
          )}
        </button>

        {filtersOpen && (
          <div className="mt-4 rounded-md border border-[var(--color-border)] bg-white p-5">
            <DealFilters filters={filters} onChange={setFilters} />
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        {/* Sidebar — hidden on mobile */}
        <aside className="hidden md:block">
          <div className="sticky top-8">
            <DealFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          <div className="mb-5">
            <DealSort sort={sort} count={sorted.length} onChange={setSort} />
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-md border border-[var(--color-border)] bg-white px-8 py-16 text-center">
              <p className="text-[14px] font-medium text-[var(--color-text)]">{t('noResults')}</p>
              <p className="mt-1 text-[13px] text-[var(--color-muted)]">{t('noResultsHint')}</p>
              {hasActiveFilters(filters) && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="mt-4 text-[13px] text-[var(--color-accent)] underline underline-offset-2"
                >
                  {t('clearFilters')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sorted.map((listing: ListingCard) => (
                <DealCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
