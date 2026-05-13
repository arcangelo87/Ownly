import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  formatRevenue,
  formatEbitda,
  formatPrice,
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
      'id, slug, title, about, highlights, buyer_tags, owner_involvement, business_name, business_description, strongest_point, sector, region, country, year_founded, revenue_range, ebitda_margin, employee_count, asking_price, partial_sale, timeline, reasons_for_sale, created_at, title_it, title_pt, about_it, about_pt, highlights_it, highlights_pt, buyer_tags_it, buyer_tags_pt, strongest_point_it, strongest_point_pt',
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

  const l = locale as 'en' | 'it' | 'pt';
  const localTitle = (l === 'it' ? listing.title_it : l === 'pt' ? listing.title_pt : null) ?? listing.title;
  const localAbout = (l === 'it' ? listing.about_it : l === 'pt' ? listing.about_pt : null) ?? listing.about ?? listing.business_description;
  const localHighlights = (l === 'it' ? listing.highlights_it : l === 'pt' ? listing.highlights_pt : null) ?? listing.highlights;
  const localStrongestPoint = (l === 'it' ? listing.strongest_point_it : l === 'pt' ? listing.strongest_point_pt : null) ?? listing.strongest_point;
  const localBuyerTags = (l === 'it' ? listing.buyer_tags_it : l === 'pt' ? listing.buyer_tags_pt : null) ?? listing.buyer_tags;

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
    countryName: listing.country ? t(`countries.${listing.country}`) : '—',
    saleStructureValue: listing.partial_sale ? t(`partialSaleValues.${listing.partial_sale}`) : '—',
    reasonsForSaleValue: listing.reasons_for_sale?.length
      ? (listing.reasons_for_sale as string[]).map((r) => t(`reasonValues.${r}`)).join(', ')
      : '—',
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
                {listing.sector ? t(`sectors.${listing.sector}`) : ''}
              </span>
              <span className="text-[12px] text-[var(--color-muted)]">{dateLabel}</span>
            </div>

            <h1 className="mt-3 font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.02em]">
              {localTitle ?? listing.business_name ?? (listing.sector ? t(`sectors.${listing.sector}`) : '')}
            </h1>

            <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              <MetricChip label={t('metrics.revenue')} value={formatRevenue(listing.revenue_range)} />
              <MetricChip label={t('metrics.ebitda')} value={formatEbitda(listing.ebitda_margin)} />
              <MetricChip label={t('metrics.askingPrice')} value={formatPrice(listing.asking_price)} />
              <MetricChip label={t('metrics.employees')} value={listing.employee_count ? t(`employeeValues.${listing.employee_count}`) : '—'} />
              <MetricChip label={t('metrics.timeline')} value={listing.timeline ? t(`timelineValues.${listing.timeline}`) : '—'} />
              <MetricChip label={t('metrics.ownerInvolvement')} value={listing.owner_involvement ? t(`ownerInvolvementValues.${listing.owner_involvement}`) : '—'} />
            </div>

            {localAbout && (
              <section className="mt-10">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.about')}
                </p>
                <p className="text-[14px] leading-[1.75] text-[var(--color-text)]">{localAbout}</p>
              </section>
            )}

            {(localHighlights?.length || localStrongestPoint) && (
              <section className="mt-8">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('sections.highlights')}
                </p>
                <HighlightsList items={localHighlights?.length ? localHighlights : [localStrongestPoint!]} />
              </section>
            )}

            {localBuyerTags && localBuyerTags.length > 0 && (
              <section className="mt-8">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {t('browse.card.bestFor')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {localBuyerTags.map((tag: string) => (
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
                ghostRows={[
                  t('financialRows.revenue'),
                  t('financialRows.ebitda'),
                  t('financialRows.netProfit'),
                  t('financialRows.revenueGrowth'),
                ]}
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
