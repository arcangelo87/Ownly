'use server';

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateSlug } from '@/lib/format';

export async function submitEnquiry(data: {
  listing_id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('enquiries').insert({
    listing_id: data.listing_id,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    message: data.message?.trim() || null,
  });
  if (error) throw error;
}

export async function createPhotoUploadUrl(
  listingId: string,
  index: number,
  filename: string,
): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from('listing-photos')
    .createSignedUploadUrl(`${listingId}/${index}-${filename}`);
  if (error) throw new Error(error.message);
  return data.signedUrl;
}

export async function publishListing(listingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();

  const { data: listing, error: fetchError } = await admin
    .from('listings')
    .select('sector, region, country, slug')
    .eq('id', listingId)
    .single();

  if (fetchError || !listing) throw fetchError ?? new Error('Listing not found');

  if (listing.slug) {
    const { error } = await admin
      .from('listings')
      .update({ status: 'live' })
      .eq('id', listingId);
    if (error) throw error;
    return listing.slug as string;
  }

  const base = generateSlug(listing.sector ?? '', listing.region ?? '', listing.country ?? '');

  const { data: existing } = await admin
    .from('listings')
    .select('id')
    .eq('slug', base)
    .neq('id', listingId)
    .maybeSingle();

  const slug = existing ? `${base}-${listingId.slice(0, 6)}` : base;

  const { error } = await admin
    .from('listings')
    .update({ status: 'live', slug })
    .eq('id', listingId);

  if (error) throw error;

  translateListing(listingId, admin).catch((e) => console.error('[translate-on-publish]', listingId, e));
  return slug;
}

async function translateListing(listingId: string, admin: ReturnType<typeof createAdminClient>) {
  if (!process.env.ANTHROPIC_API_KEY) return;

  const { data } = await admin
    .from('listings')
    .select('title, about, highlights, buyer_tags')
    .eq('id', listingId)
    .single();

  if (!data || (!data.title && !data.about)) return;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    tools: [{
      name: 'translate_listing',
      description: 'Translate listing content into Italian and European Portuguese.',
      input_schema: {
        type: 'object' as const,
        properties: {
          title_it:      { type: ['string', 'null'] },
          about_it:      { type: ['string', 'null'] },
          highlights_it: { type: ['array', 'null'], items: { type: 'string' } },
          buyer_tags_it: { type: ['array', 'null'], items: { type: 'string' } },
          title_pt:      { type: ['string', 'null'] },
          about_pt:      { type: ['string', 'null'] },
          highlights_pt: { type: ['array', 'null'], items: { type: 'string' } },
          buyer_tags_pt: { type: ['array', 'null'], items: { type: 'string' } },
        },
        required: ['title_it','about_it','highlights_it','buyer_tags_it','title_pt','about_pt','highlights_pt','buyer_tags_pt'],
      },
    }],
    tool_choice: { type: 'tool', name: 'translate_listing' },
    system: 'Translate business listing content into Italian and European Portuguese. Rewrite naturally in each language — do not translate word-for-word. Maintain a professional, financially-literate tone. Use null for any field where the source is null.',
    messages: [{
      role: 'user',
      content: `Translate this listing content:\n\nTitle: ${data.title ?? 'null'}\nAbout: ${data.about ?? 'null'}\nHighlights: ${JSON.stringify(data.highlights ?? null)}\nBuyer tags: ${JSON.stringify(data.buyer_tags ?? null)}`,
    }],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') return;
  const t = toolBlock.input as Record<string, unknown>;

  await admin.from('listings').update({
    title_it:      t.title_it      ?? null,
    about_it:      t.about_it      ?? null,
    highlights_it: t.highlights_it ?? null,
    buyer_tags_it: t.buyer_tags_it ?? null,
    title_pt:      t.title_pt      ?? null,
    about_pt:      t.about_pt      ?? null,
    highlights_pt: t.highlights_pt ?? null,
    buyer_tags_pt: t.buyer_tags_pt ?? null,
  }).eq('id', listingId);
}
