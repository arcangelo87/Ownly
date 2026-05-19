'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function submitClaim(data: {
  slug: string;
  name: string;
  email: string;
  message?: string;
}) {
  const admin = createAdminClient();

  const { data: listing } = await admin
    .from('listings')
    .select('id')
    .eq('slug', data.slug)
    .maybeSingle();

  const { error } = await admin.from('claims').insert({
    slug: data.slug,
    listing_id: listing?.id ?? null,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message?.trim() || null,
  });

  if (error) throw error;
}
