import { getTranslations } from 'next-intl/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { DealListingPage } from '@/components/deals/DealListingPage';
import { SiteNav } from '@/components/marketing/SiteNav';

export const dynamic = 'force-dynamic';

export type ListingCard = {
  id: string;
  slug: string | null;
  title: string | null;
  sector: string | null;
  region: string | null;
  country: string | null;
  revenue_range: string | null;
  ebitda_margin: string | null;
  asking_price: string | null;
  employee_count: string | null;
  timeline: string | null;
  created_at: string;
  coverPhotoUrl: string | null;
  photoCount: number;
  buyer_tags: string[] | null;
  owner_involvement: string | null;
};

export default async function DealsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('deals.browse');
  const admin = createAdminClient();

  const { data: listings } = await admin
    .from('listings')
    .select(
      'id, slug, title, sector, region, country, revenue_range, ebitda_margin, asking_price, employee_count, timeline, created_at, buyer_tags, owner_involvement',
    )
    .eq('status', 'live')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  type RawListing = Omit<ListingCard, 'coverPhotoUrl' | 'photoCount'>;

  const cards: ListingCard[] = await Promise.all(
    (listings ?? []).map(async (listing: RawListing) => {
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SiteNav />

      <main style={{ maxWidth: '1080px', margin: '0 auto' }} className="px-6 py-10">
        <div className="mb-10">
          <h1 className="font-serif text-[32px] font-medium leading-[1.15] tracking-[-0.02em]">
            {t('pageTitle')}
          </h1>
          <p className="mt-2 text-[14px] text-[var(--color-muted)]">{t('pageSubtitle')}</p>
        </div>

        <DealListingPage listings={cards} locale={locale} />
      </main>
    </div>
  );
}
