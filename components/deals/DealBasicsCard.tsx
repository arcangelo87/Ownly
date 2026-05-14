import type { Listing } from '@/types';

interface DealBasicsCardProps {
  listing: Pick<Listing, 'region' | 'year_founded'>;
  labels: {
    title: string;
    country: string;
    region: string;
    yearFounded: string;
    saleStructure: string;
    reasonsForSale: string;
  };
  values: {
    country: string;
    saleStructure: string;
    reasonsForSale: string;
  };
}

export function DealBasicsCard({ listing, labels, values }: DealBasicsCardProps) {
  const rows = [
    { label: labels.country, value: values.country },
    { label: labels.region, value: listing.region ?? '—' },
    { label: labels.yearFounded, value: listing.year_founded?.toString() ?? '—' },
    { label: labels.saleStructure, value: values.saleStructure },
    { label: labels.reasonsForSale, value: values.reasonsForSale },
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
