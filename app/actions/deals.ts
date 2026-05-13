'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateSlug } from '@/lib/format';
import { translateListingContent } from '@/lib/translate';

export async function submitEnquiry(data: {
  listing_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('enquiries').insert({
    listing_id: data.listing_id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message?.trim() || null,
  });
  if (error) throw error;
}

export async function createPhotoUploadUrl(
  listingId: string,
  index: number,
  filename: string,
): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from('listing-photos')
    .createSignedUploadUrl(`${listingId}/${index}-${filename}`);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function publishListing(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();

  const { data: listing, error: fetchError } = await admin
    .from('listings')
    .select('sector, region, country, slug, title, about, highlights, buyer_tags, strongest_point')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) throw fetchError ?? new Error('Listing not found');

  let slug = listing.slug as string | null;

  if (!slug) {
    const base = generateSlug(listing.sector ?? '', listing.region ?? '', listing.country ?? '');
    const { data: existing } = await admin
      .from('listings')
      .select('id')
      .eq('slug', base)
      .neq('id', listingId)
      .maybeSingle();
    slug = existing ? `${base}-${listingId.slice(0, 6)}` : base;
  }

  const content = {
    title: listing.title as string | null,
    about: listing.about as string | null,
    highlights: listing.highlights as string[] | null,
    buyer_tags: listing.buyer_tags as string[] | null,
    strongest_point: listing.strongest_point as string | null,
  };

  const [it, pt] = await Promise.allSettled([
    translateListingContent(content, 'it'),
    translateListingContent(content, 'pt'),
  ]);

  const translations: Record<string, string | string[] | null> = {};
  if (it.status === 'fulfilled') {
    translations.title_it = it.value.title;
    translations.about_it = it.value.about;
    translations.highlights_it = it.value.highlights;
    translations.buyer_tags_it = it.value.buyer_tags;
    translations.strongest_point_it = it.value.strongest_point;
  } else {
    console.error('[publishListing] Italian translation failed:', it.reason);
  }
  if (pt.status === 'fulfilled') {
    translations.title_pt = pt.value.title;
    translations.about_pt = pt.value.about;
    translations.highlights_pt = pt.value.highlights;
    translations.buyer_tags_pt = pt.value.buyer_tags;
    translations.strongest_point_pt = pt.value.strongest_point;
  } else {
    console.error('[publishListing] Portuguese translation failed:', pt.reason);
  }

  const { error } = await admin
    .from('listings')
    .update({ status: 'live', slug, ...translations })
    .eq('id', listingId);

  if (error) throw error;
  return slug;
}
