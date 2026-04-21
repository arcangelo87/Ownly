import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
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
  formatPrice,
  formatEmployees,
  formatTimeline,
} from '@/lib/format';
import type { Listing } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('deals');

  const admin = createAdminClient();
  const { data: listing, error } = await admin
    .from('listings')
    .select(
      'id, slug, title, about, highlights, business_name, business_description, strongest_point, sector, region, country, year_founded, revenue_range, ebitda_margin, employee_count, asking_price, partial_sale, timeline, reasons_for_sale, created_at',
    )
    .eq('slug', slug)
    .eq('status', 'live')
    .is('deleted_at', null)
    .single();

  if (error) console.error('[deal-page] supabase error:', JSON.stringify(error));
  if (!listing) notFound();

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
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <div style={{ maxWidth: '1080px', margin: '0 auto' }} className="flex items-center justify-between">
          <Link href={`/${locale}`} className="font-serif text-[20px] font-semibold tracking-[-0.02em]">
            Ownly
          </Link>
          <Link href={`/${locale}/deals`} className="text-[13px] text-[var(--color-muted)] hover:text-[var(--color-text)]">
            ← Browse deals
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1080px', margin: '0 auto' }} className="px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* ── Main content ── */}
          <article className="min-w-0 flex-1">
            <PhotoStrip urls={photoUrls} alt={t('photoAlt')} />

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-accent)]">
                {SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector}
              </span>
              <span className="text-[12px] text-[var(--color-muted)]">{dateLabel}</span>
            </div>

            <h1 className="mt-3 font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.02em]">
              {listing.title ?? listing.business_name ?? (SECTOR_LABELS[listing.sector ?? ''] ?? listing.sector)}
            </h1>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-5">
              <MetricChip label={t('metrics.revenue')} value={formatRevenue(listing.revenue_range)} />
              <MetricChip label={t('metrics.ebitda')} value={formatEbitda(listing.ebitda_margin)} />
              <MetricChip label={t('metrics.askingPrice')} value={formatPrice(listing.asking_price)} />
              <MetricChip label={t('metrics.employees')} value={formatEmployees(listing.employee_count)} />
              <MetricChip label={t('metrics.timeline')} value={formatTimeline(listing.timeline)} />
            </div>

            {(listing.about ?? listing.business_description) && (
              <section className="mt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.about')}
                </p>
                <p className="text-[14px] leading-[1.75] text-[var(--color-text)]">{listing.about ?? listing.business_description}</p>
              </section>
            )}

            {(listing.highlights?.length || listing.strongest_point) && (
              <section className="mt-8">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.highlights')}
                </p>
                <HighlightsList items={listing.highlights?.length ? listing.highlights : [listing.strongest_point!]} />
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
    </div>
  );
}
