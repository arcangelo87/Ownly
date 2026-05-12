'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export type PlanEnquiryPlan = 'assisted' | 'bespoke';

export interface PlanEnquiryInput {
  plan: PlanEnquiryPlan;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export async function submitPlanEnquiry(input: PlanEnquiryInput): Promise<{ error: string | null }> {
  const supabase = createAdminClient();

  const { error } = await supabase.from('plan_enquiries').insert({
    plan: input.plan,
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
