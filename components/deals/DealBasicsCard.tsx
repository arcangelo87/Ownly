'use client';

import { useTranslations } from 'next-intl';
import type { Listing } from '@/types';

interface DealBasicsCardProps {
  listing: Pick<Listing, 'country' | 'region' | 'year_founded' | 'partial_sale' | 'reasons_for_sale'>;
  labels: {
    title: string;
    country: string;
    region: string;
    yearFounded: string;
    saleStructure: string;
    reasonsForSale: string;
  };
}

export function DealBasicsCard({ listing, labels }: DealBasicsCardProps) {
  const t = useTranslations('deals');

  const countryName =
    listing.country === 'IT' ? t('countries.IT') : listing.country === 'PT' ? t('countries.PT') : (listing.country ?? '—');

  const partialSaleValue = listing.partial_sale ? t(`partialSaleValues.${listing.partial_sale}`) : '—';
  const reasonsValue = listing.reasons_for_sale && listing.reasons_for_sale.length > 0
    ? listing.reasons_for_sale.map((r: string) => t(`reasonsValues.${r}`)).join(', ')
    : '—';

  const rows = [
    { label: labels.country, value: countryName },
    { label: labels.region, value: listing.region ?? '—' },
    { label: labels.yearFounded, value: listing.year_founded?.toString() ?? '—' },
    { label: labels.saleStructure, value: partialSaleValue },
    { label: labels.reasonsForSale, value: reasonsValue },
  ];

  return (
    <div className="rounded-md border border-[var(--color-border)] bg-white px-5 py-1">
      <dl className="flex flex-col divide-y divide-[var(--color-border)]">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-0.5 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {label}
            </dt>
            <dd className="text-[13px] text-[var(--color-text)]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
