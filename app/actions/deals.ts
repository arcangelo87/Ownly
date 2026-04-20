'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateSlug } from '@/lib/format';

export async function submitEnquiry(data: {
  listing_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('enquiries').insert({
    listing_id: data.listing_id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message?.trim() || null,
  });
  if (error) throw error;
}

export async function publishListing(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();

  const { data: listing, error: fetchError } = await admin
    .from('listings')
    .select('sector, region, country, slug')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) throw fetchError ?? new Error('Listing not found');

  if (listing.slug) {
    const { error } = await admin
      .from('listings')
      .update({ status: 'live' })
      .eq('id', listingId);
    if (error) throw error;
    return listing.slug as string;
  }

  const base = generateSlug(listing.sector ?? '', listing.region ?? '', listing.country ?? '');

  const { data: existing } = await admin
    .from('listings')
    .select('id')
    .eq('slug', base)
    .neq('id', listingId)
    .maybeSingle();

  const slug = existing ? `${base}-${listingId.slice(0, 6)}` : base;

  const { error } = await admin
    .from('listings')
    .update({ status: 'live', slug })
    .eq('id', listingId);

  if (error) throw error;
  return slug;
}
