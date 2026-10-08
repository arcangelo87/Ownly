'use server';

import { createClient } from '@/lib/supabase/server';

export type DealAccessTier = 'single' | 'all' | 'managed';

const TIERS: readonly DealAccessTier[] = ['single', 'all', 'managed'];

export async function recordDealAccessClick(tier: DealAccessTier): Promise<void> {
  if (!TIERS.includes(tier)) return;
  const supabase = await createClient();
  const { error } = await supabase.from('deal_access_interest').insert({ tier, event: 'click' });
  if (error) console.error('deal_access_interest click insert failed', error);
}

export interface DealAccessSubmitInput {
  tier: DealAccessTier;
  email: string;
  criteria?: string;
}

export async function submitDealAccess(input: DealAccessSubmitInput): Promise<{ error: string | null }> {
  if (!TIERS.includes(input.tier)) return { error: 'Invalid tier.' };
  const supabase = await createClient();

  const { error } = await supabase.from('deal_access_interest').insert({
    tier: input.tier,
    event: 'submit',
    email: input.email.trim().toLowerCase(),
    criteria: input.criteria?.trim() || null,
  });

  if (error) {
    console.error('deal_access_interest submit insert failed', error);
    return { error: 'Something went wrong. Please try again.' };
  }

  return { error: null };
}
