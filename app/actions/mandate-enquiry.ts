'use server';

import { createClient } from '@/lib/supabase/server';

export type MandateSide = 'sell' | 'buy' | 'institutional';
export type MandateVertical = 'accounting' | 'insurance' | 'lending' | 'other';

export interface MandateEnquiryInput {
  side: MandateSide;
  vertical: MandateVertical;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function submitMandateEnquiry(input: MandateEnquiryInput): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from('mandate_enquiries').insert({
    side: input.side,
    vertical: input.vertical,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    message: input.message?.trim() || null,
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  return { error: null };
}
