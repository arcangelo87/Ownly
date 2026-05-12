import { createAdminClient } from '@/lib/supabase/admin';
import type { ListingCard } from '@/app/[locale]/deals/page';
import { DealCardStack } from './DealCardStack';

type RawListing = Omit<ListingCard, 'coverPhotoUrl' | 'photoCount'>;

export async function DealCardStackLoader() {
  const admin = createAdminClient();

  const { data: listings } = await admin
    .from('listings')
    .select(
      'id, slug, title, sector, region, country, revenue_range, ebitda_margin, asking_price, employee_count, timeline, created_at, buyer_tags, owner_involvement',
    )
    .eq('status', 'live')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(20);

  const enriched: ListingCard[] = await Promise.all(
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

  const withPhotos = enriched.filter((l) => l.photoCount > 0).slice(0, 10);

  return <DealCardStack listings={withPhotos.length > 0 ? withPhotos : undefined} />;
}
