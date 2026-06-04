'use server';

import { createClient } from '@/lib/supabase/server';

export interface WaitlistInput {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function submitWaitlist(input: WaitlistInput): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { error } = await supabase.from('founding_enquiries').insert({
    type: 'waitlist',
    name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.role || null,
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  return { error: null };
}
