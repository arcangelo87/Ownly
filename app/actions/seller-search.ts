'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { SellerSearchInsert } from '@/types';

export async function submitSellerSearch(data: SellerSearchInsert) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('seller_searches').insert({
    vertical: data.vertical || null,
    vertical_other: data.vertical_other || null,
    revenue_range: data.revenue_range || null,
    had_valuation: data.had_valuation || null,
    priorities: data.priorities?.length ? data.priorities : null,
    timeline: data.timeline || null,
    had_advisor_before: data.had_advisor_before,
    role: data.role || null,
    name: data.name?.trim() || null,
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message?.trim() || null,
  });
  if (error) throw error;
}
