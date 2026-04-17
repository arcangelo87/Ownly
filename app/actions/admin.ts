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
