import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Suspense } from 'react';
import { DealCardStack } from '@/components/marketing/DealCardStack';
import { DealCardStackLoader } from '@/components/marketing/DealCardStackLoader';
import { DealCard } from '@/components/deals/DealCard';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ListingCard } from '@/app/[locale]/deals/page';

export const dynamic = 'force-dynamic';

type RawListing = Omit<ListingCard, 'coverPhotoUrl' | 'photoCount'>;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home.buyers');

  const admin = createAdminClient();

  const { data: raw } = await admin
    .from('listings')
    .select(
      'id, slug, title, sector, region, country, revenue_range, ebitda_margin, asking_price, employee_count, timeline, created_at, buyer_tags, owner_involvement',
    )
    .eq('status', 'live')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(4);

  const listings: ListingCard[] = await Promise.all(
    (raw ?? []).map(async (listing: RawListing) => {
      const { data: files } = await admin.storage
        .from('listing-photos')
        .list(listing.id, { limit: 10, sortBy: { column: 'name', order: 'asc' } });
      const photoFiles = files ?? [];
      const coverPhotoUrl =
        photoFiles.length > 0
          ? admin.storage
              .from('listing-photos')
              .getPublicUrl(`${listing.id}/${photoFiles[0].name}`).data.publicUrl
          : null;
      return { ...listing, coverPhotoUrl, photoCount: photoFiles.length };
    }),
  );

  const featureIcons = [
    /* compass — exclusive, curated sourcing */
    <svg key="compass" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="11" />
      <path d="M19.5 9.5 L13 22.5 L12.5 9.5" stroke="none" fill="none" />
      <polygon points="16,8 20,17 16,15 12,17" fill="currentColor" stroke="none" />
      <polygon points="16,24 12,15 16,17 20,15" />
    </svg>,
    /* shield with checkmark — guidance and protection */
    <svg key="shield" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3 L5 8 v8 c0 6.5 5 12 11 14 6-2 11-7.5 11-14 V8 Z" />
      <polyline points="10,16 14,20 22,12" />
    </svg>,
    /* crosshairs — precision sourcing on demand */
    <svg key="target" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="10" />
      <circle cx="16" cy="16" r="4" />
      <line x1="16" y1="2" x2="16" y2="8" />
      <line x1="16" y1="24" x2="16" y2="30" />
      <line x1="2" y1="16" x2="8" y2="16" />
      <line x1="24" y1="16" x2="30" y2="16" />
    </svg>,
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-[44px] md:text-[56px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
              {t('hero.h1')}
            </h1>
            <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-8">
              {t('hero.sub')}
            </p>
            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href={`/${locale}/deals`}
                className="inline-flex items-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
              >
                {t('hero.ctaBrowse')}
              </Link>
              <Link
                href={`/${locale}/buyers`}
                className="text-[15px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors underline underline-offset-4"
              >
                {t('hero.ctaSearch')}
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Suspense fallback={<DealCardStack />}>
              <DealCardStackLoader />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              [t('features.card1Title'), t('features.card1Body')],
              [t('features.card2Title'), t('features.card2Body')],
              [t('features.card3Title'), t('features.card3Body')],
            ] as [string, string][]).map(([title, body], i) => (
              <div
                key={title}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[8px] p-6"
              >
                <div className="text-[var(--color-accent)] mb-4">{featureIcons[i]}</div>
                <h3 className="font-[family-name:var(--font-serif)] text-[18px] font-semibold text-[var(--color-text)] mb-3">
                  {title}
                </h3>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listings ── */}
      {listings.length > 0 && (
        <section className="py-20 px-6 bg-[var(--color-bg)]">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
              {t('listings.heading')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {listings.map((listing) => (
                <DealCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href={`/${locale}/deals`}
                className="text-[14px] font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity underline underline-offset-4"
              >
                {t('listings.viewAll')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Seller / broker nudge ── */}
      <section className="py-16 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
            {t('nudge.sellerText')}{' '}
            <Link
              href={`/${locale}/sell`}
              className="text-[var(--color-accent)] underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {t('nudge.sellerCta')}
            </Link>
          </p>
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
            {t('nudge.brokerText')}{' '}
            <Link
              href={`/${locale}/brokers`}
              className="text-[var(--color-accent)] underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              {t('nudge.brokerCta')}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
