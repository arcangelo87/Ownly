'use server';

import { createClient } from '@/lib/supabase/server';

export type FoundingEnquiryType = 'broker' | 'buyer';

export interface FoundingEnquiryInput {
  type: FoundingEnquiryType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function submitFoundingEnquiry(input: FoundingEnquiryInput): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from('founding_enquiries').insert({
    type: input.type,
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
