'use server';

import { createClient } from '@/lib/supabase/server';

interface ContactPayload {
  name: string;
  email: string;
  telephone: string;
  message: string;
}

export async function submitContact(payload: ContactPayload): Promise<{ error?: string } | void> {
  const supabase = await createClient();
  const { error } = await supabase.from('contact_submissions').insert({
    name: payload.name,
    email: payload.email,
    telephone: payload.telephone || null,
    message: payload.message,
  });
  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }
}
