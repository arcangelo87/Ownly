'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { InstitutionalSearchInsert } from '@/types';

export async function submitInstitutionalSearch(data: InstitutionalSearchInsert) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('institutional_searches').insert({
    sectors: data.sectors?.length ? data.sectors : null,
    sector_other: data.sector_other || null,
    ticket_size: data.ticket_size || null,
    has_committed_capital: data.has_committed_capital || null,
    strategy: data.strategy?.length ? data.strategy : null,
    timeline: data.timeline || null,
    has_acquired_before: data.has_acquired_before,
    buyer_type: data.buyer_type || null,
    name: data.name?.trim() || null,
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message?.trim() || null,
  });
  if (error) throw error;
}
