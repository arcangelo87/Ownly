'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

const VALID_STATUSES = ['draft', 'in_review', 'live', 'rejected'] as const;
type ListingStatus = (typeof VALID_STATUSES)[number];

export async function updateListingStatus(listingId: string, status: ListingStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  if (!VALID_STATUSES.includes(status)) throw new Error('Invalid status');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update({ status })
    .eq('id', listingId);

  if (error) throw error;
}

type LocaleContent = {
  title: string | null;
  about: string | null;
  highlights: string[] | null;
  buyer_tags: string[] | null;
};

type AllLocaleContent = LocaleContent & {
  title_it: string | null;
  about_it: string | null;
  highlights_it: string[] | null;
  buyer_tags_it: string[] | null;
  title_pt: string | null;
  about_pt: string | null;
  highlights_pt: string[] | null;
  buyer_tags_pt: string[] | null;
};

export async function updateListingContent(listingId: string, content: AllLocaleContent) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update(content)
    .eq('id', listingId);

  if (error) throw error;
}

export async function updateListingSector(listingId: string, sector: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update({ sector })
    .eq('id', listingId);

  if (error) throw error;
}

export async function getListingPhotos(listingId: string): Promise<{ name: string; url: string }[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { data } = await admin.storage
    .from('listing-photos')
    .list(listingId, { sortBy: { column: 'name', order: 'asc' } });

  if (!data) return [];

  return data
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: admin.storage
        .from('listing-photos')
        .getPublicUrl(`${listingId}/${f.name}`).data.publicUrl,
    }));
}

export async function deleteListingPhoto(listingId: string, filename: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from('listing-photos')
    .remove([`${listingId}/${filename}`]);

  if (error) throw new Error(error.message);
}
