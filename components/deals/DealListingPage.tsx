'use client';

import { useMemo, useState, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { DealCard } from '@/components/deals/DealCard';
import { DealFilters, type Filters } from '@/components/deals/DealFilters';
import { DealSort, type SortOption } from '@/components/deals/DealSort';
import type { ListingCard } from '@/app/[locale]/deals/page';

const PRICE_FILTER_MAP: Record<string, string[]> = {
  under_1m: ['under_500k', '500k_1m'],
  '1m_2m': ['1m_2_5m'],
  '2m_4m': ['2_5m_5m'],
  over_4m: ['5m_10m', 'over_10m'],
};

const PRICE_ORDER: Record<string, number> = {
  under_500k: 0, '500k_1m': 1, '1m_2_5m': 2, '2_5m_5m': 3, '5m_10m': 4, over_10m: 5,
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

export function DealListingPage({ listings, locale }: DealListingPageProps) {
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
          <div className="sticky top-8 flex flex-col gap-6">
            <DealFilters filters={filters} onChange={setFilters} />
            <div className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5">
              <p className="text-[13px] font-semibold text-[var(--color-text)] leading-[1.4] mb-2">
                {t('buyerCtaSidebar.heading')}
              </p>
              <p className="text-[12px] text-[var(--color-muted)] leading-[1.6] mb-4">
                {t('buyerCtaSidebar.body')}
              </p>
              <a
                href={`/${locale}/buyers#founding`}
                className="block w-full rounded-[4px] bg-[var(--color-accent)] px-4 py-2 text-center text-[12px] font-medium text-white hover:opacity-90 transition-opacity"
              >
                {t('buyerCtaSidebar.cta')}
              </a>
            </div>
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
              <div className="mt-8 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6 text-left">
                <p className="text-[14px] font-semibold text-[var(--color-text)] mb-2">
                  {t('buyerCtaInline.heading')}
                </p>
                <p className="text-[13px] text-[var(--color-muted)] leading-[1.6] mb-4">
                  {t('buyerCtaInline.body')}
                </p>
                <a
                  href={`/${locale}/buyers#founding`}
                  className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
                >
                  {t('buyerCtaInline.cta')}
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sorted.map((listing: ListingCard, index: number) => (
                  <Fragment key={listing.id}>
                    <DealCard listing={listing} />
                    {index === 3 && sorted.length > 4 && (
                      <div
                        key="inline-cta"
                        className="col-span-1 sm:col-span-2 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6"
                      >
                        <p className="text-[14px] font-semibold text-[var(--color-text)] mb-1.5">
                          {t('buyerCtaInline.heading')}
                        </p>
                        <p className="text-[13px] text-[var(--color-muted)] leading-[1.6] mb-4 max-w-[480px]">
                          {t('buyerCtaInline.body')}
                        </p>
                        <a
                          href={`/${locale}/buyers#founding`}
                          className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 transition-opacity"
                        >
                          {t('buyerCtaInline.cta')}
                        </a>
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
              <div className="mt-8 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-8">
                <p className="font-serif text-[20px] font-semibold text-[var(--color-text)] leading-[1.3] mb-2">
                  {t('buyerCtaBottom.heading')}
                </p>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.7] mb-5 max-w-[520px]">
                  {t('buyerCtaBottom.body')}
                </p>
                <a
                  href={`/${locale}/buyers#founding`}
                  className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-6 py-3 text-[14px] font-medium text-white hover:opacity-90 transition-opacity"
                >
                  {t('buyerCtaBottom.cta')}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
