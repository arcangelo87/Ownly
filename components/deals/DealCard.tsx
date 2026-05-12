'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MetricChip } from '@/components/deals/MetricChip';
import {
  SECTOR_LABELS,
  formatRevenue,
  formatEbitda,
  formatPrice,
  formatOwnerInvolvement,
} from '@/lib/format';
import type { ListingCard } from '@/app/[locale]/deals/page';

interface DealCardProps {
  listing: ListingCard;
  photoHeight?: string;
}

export function DealCard({ listing, photoHeight = 'h-40' }: DealCardProps) {
  const tCard = useTranslations('deals.browse.card');
  const tMetrics = useTranslations('deals.metrics');

  const sectorLabel = SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector ?? '';
  const title = listing.title ?? sectorLabel;
  const location = [
    listing.region,
    listing.country === 'IT' ? 'Italy' : listing.country === 'PT' ? 'Portugal' : listing.country,
  ]
    .filter(Boolean)
    .join(', ');
  const href = `/deals/${listing.slug ?? listing.id}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-md border border-[var(--color-border)] bg-white transition-colors hover:border-[var(--color-accent)]"
    >
      {/* Photo area */}
      <div className={`relative ${photoHeight} w-full flex-shrink-0 overflow-hidden bg-[var(--color-surface)]`}>
        {listing.coverPhotoUrl ? (
          <Image
            src={listing.coverPhotoUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {tCard('noPhoto')}
            </span>
          </div>
        )}
        {listing.photoCount > 1 && (
          <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
            {tCard('photosBadge', { count: listing.photoCount })}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Sector + location */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
            {sectorLabel}
          </span>
          {location && (
            <span className="truncate text-[12px] text-[var(--color-muted)]">{location}</span>
          )}
        </div>

        {/* Title */}
        <p className="line-clamp-2 font-serif text-[15px] leading-snug text-[var(--color-text)]">
          {title}
        </p>

        {/* Metric chips */}
        <div className="grid grid-cols-3 gap-1.5">
          <MetricChip label={tMetrics('revenue')} value={formatRevenue(listing.revenue_range)} />
          <MetricChip label={tMetrics('ebitda')} value={formatEbitda(listing.ebitda_margin)} />
          <MetricChip label={tMetrics('askingPrice')} value={formatPrice(listing.asking_price)} />
        </div>

        {/* Owner involvement */}
        {listing.owner_involvement && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {tMetrics('ownerInvolvement')}:
            </span>
            <span className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] text-[var(--color-text)]">
              {formatOwnerInvolvement(listing.owner_involvement)}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-start justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          {listing.buyer_tags && listing.buyer_tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {tCard('bestFor')}:
              </span>
              {listing.buyer_tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[11px] text-[var(--color-text)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className="shrink-0 text-[13px] font-medium text-[var(--color-accent)]">
            {tCard('viewDeal')}
          </span>
        </div>
      </div>
    </Link>
  );
}
