'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { BuyerSearchInsert } from '@/types';

export async function submitBuyerSearch(data: BuyerSearchInsert) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('buyer_searches').insert({
    industry: data.industry || null,
    locations: data.locations,
    budget_range: data.budget_range || null,
    primary_goal: data.primary_goal || null,
    target_return: data.target_return || null,
    search_timeline: data.search_timeline || null,
    has_acquired_before: data.has_acquired_before,
    background: data.background || null,
    name: data.name?.trim() || null,
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
  });
  if (error) throw error;
}
