import { cache } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/marketing/SiteNav';
import { createAdminClient } from '@/lib/supabase/admin';
import { MetricChip } from '@/components/deals/MetricChip';
import { HighlightsList } from '@/components/deals/HighlightsList';
import { FinancialsLock } from '@/components/deals/FinancialsLock';
import { DealBasicsCard } from '@/components/deals/DealBasicsCard';
import { EnquiryForm } from '@/components/deals/EnquiryForm';
import { PhotoStrip } from '@/components/deals/PhotoStrip';
import {
  SECTOR_LABELS,
  formatRevenue,
  formatEbitda,
  formatExactPrice,
  formatEmployees,
  formatTimeline,
  formatOwnerInvolvement,
} from '@/lib/format';
import type { Listing } from '@/types';

export const dynamic = 'force-dynamic';

const LISTING_COLUMNS =
  'id, slug, source, title, about, highlights, buyer_tags, title_it, about_it, highlights_it, buyer_tags_it, title_pt, about_pt, highlights_pt, buyer_tags_pt, owner_involvement, business_name, business_description, strongest_point, sector, region, country, year_founded, revenue_range, ebitda_margin, employee_count, asking_price, asking_price_exact, partial_sale, timeline, reasons_for_sale, created_at';

const getListing = cache(async (slug: string) => {
  const admin = createAdminClient();
  const { data: listing, error } = await admin
    .from('listings')
    .select(LISTING_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'live')
    .is('deleted_at', null)
    .single();

  if (error) console.error('[deal-page] supabase error:', JSON.stringify(error));
  return listing;
});

function localizedCopy(listing: NonNullable<Awaited<ReturnType<typeof getListing>>>, locale: string) {
  return locale === 'it'
    ? { title: listing.title_it ?? listing.title, about: listing.about_it ?? listing.about, highlights: listing.highlights_it ?? listing.highlights, buyer_tags: listing.buyer_tags_it ?? listing.buyer_tags }
    : locale === 'pt'
    ? { title: listing.title_pt ?? listing.title, about: listing.about_pt ?? listing.about, highlights: listing.highlights_pt ?? listing.highlights, buyer_tags: listing.buyer_tags_pt ?? listing.buyer_tags }
    : { title: listing.title, about: listing.about, highlights: listing.highlights, buyer_tags: listing.buyer_tags };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const listing = await getListing(slug);
  if (!listing) return { title: 'Deal not found' };

  const lc = localizedCopy(listing, locale);
  const sectorLabel = SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector ?? undefined;
  const title = lc.title ?? listing.business_name ?? sectorLabel ?? 'Business for sale';
  const rawDescription = lc.about ?? listing.business_description ?? listing.strongest_point ?? '';
  const description = rawDescription.length > 160 ? `${rawDescription.slice(0, 157).trimEnd()}...` : rawDescription || undefined;
  const url = `/${locale}/deals/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  };
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('deals');

  const listing = await getListing(slug);
  if (!listing) notFound();

  const admin = createAdminClient();
  const lc = localizedCopy(listing, locale);

  const { data: storageFiles } = await admin.storage
    .from('listing-photos')
    .list(listing.id, { limit: 10, sortBy: { column: 'name', order: 'asc' } });

  const photoUrls: string[] = (storageFiles ?? []).map((file) => {
    const { data } = admin.storage
      .from('listing-photos')
      .getPublicUrl(`${listing.id}/${file.name}`);
    return data.publicUrl;
  });

  const dateLabel = new Date(listing.created_at).toLocaleDateString(
    locale === 'en' ? 'en-GB' : locale,
    { month: 'long', year: 'numeric' },
  );

  const dealBasicsLabels = {
    title: t('dealBasics.title'),
    country: t('dealBasics.country'),
    region: t('dealBasics.region'),
    yearFounded: t('dealBasics.yearFounded'),
    saleStructure: t('dealBasics.saleStructure'),
    reasonsForSale: t('dealBasics.reasonsForSale'),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SiteNav />

      <main style={{ maxWidth: '1080px', margin: '0 auto' }} className="px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* ── Main content ── */}
          <article className="min-w-0 flex-1">
            <PhotoStrip urls={photoUrls} alt={t('photoAlt')} emptyLabel={t('noPhotos')} />

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                {SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector}
              </span>
              <span className="text-[12px] text-[var(--color-muted)]">{dateLabel}</span>
            </div>

            <h1 className="mt-3 font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.02em]">
              {lc.title ?? listing.business_name ?? (SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector)}
            </h1>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              <MetricChip label={t('metrics.revenue')} value={formatRevenue(listing.revenue_range)} />
              <MetricChip label={t('metrics.ebitda')} value={formatEbitda(listing.ebitda_margin)} />
              <MetricChip label={t('metrics.askingPrice')} value={formatExactPrice(listing.asking_price_exact, listing.asking_price)} />
              <MetricChip label={t('metrics.employees')} value={formatEmployees(listing.employee_count)} />
              <MetricChip label={t('metrics.timeline')} value={formatTimeline(listing.timeline)} />
              <MetricChip label={t('metrics.ownerInvolvement')} value={formatOwnerInvolvement(listing.owner_involvement)} />
            </div>

            {(lc.about ?? listing.business_description) && (
              <section className="mt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.about')}
                </p>
                <p className="text-[14px] leading-[1.75] text-[var(--color-text)]">{lc.about ?? listing.business_description}</p>
              </section>
            )}

            {(lc.highlights?.length || listing.strongest_point) && (
              <section className="mt-8">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.highlights')}
                </p>
                <HighlightsList items={lc.highlights?.length ? lc.highlights : [listing.strongest_point!]} />
              </section>
            )}

            {lc.buyer_tags && lc.buyer_tags.length > 0 && (
              <section className="mt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('browse.card.bestFor')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {lc.buyer_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--color-surface)] px-2.5 py-1 text-[13px] text-[var(--color-text)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-8">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {t('sections.financials')}
              </p>
              <FinancialsLock
                lockedLabel={t('sections.financialsLocked')}
                lockedDetail={t('sections.financialsLockedDetail')}
              />
            </section>

            {/* Mobile: sidebar content below main */}
            <div className="mt-10 flex flex-col gap-6 lg:hidden">
              <EnquiryForm listingId={listing.id} />
              <DealBasicsCard listing={listing as Listing} labels={dealBasicsLabels} />
            </div>
          </article>

          {/* ── Sticky sidebar ── */}
          <aside className="hidden w-[300px] flex-shrink-0 lg:block">
            <div className="sticky top-8 flex flex-col gap-6">
              <EnquiryForm listingId={listing.id} />
              <DealBasicsCard listing={listing as Listing} labels={dealBasicsLabels} />
            </div>
          </aside>

        </div>
      </main>

      {listing.source !== 'seller_form' && (
        <p className="px-6 pb-10 text-center text-[11px] text-[var(--color-muted)]">
          {t('disclaimer')}{' '}
          <a
            href={`/claim/${listing.slug}`}
            className="underline underline-offset-2 hover:opacity-70"
          >
            {t('claimListing')}
          </a>
        </p>
      )}
    </div>
  );
}
