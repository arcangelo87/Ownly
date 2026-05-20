'use server';

import Anthropic from '@anthropic-ai/sdk';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { SECTOR_LABELS, generateSlug } from '@/lib/format';
import { translateTags } from '@/lib/tags';

const VALID_STATUSES = ['draft', 'in_review', 'live', 'rejected'] as const;
type ListingStatus = (typeof VALID_STATUSES)[number];

function coerceEnum(val: unknown, allowed: readonly (string | null)[]): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'string' && (allowed as (string | null)[]).includes(val)) return val;
  return null;
}

export async function updateListingStatus(listingId: string, status: ListingStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  if (!VALID_STATUSES.includes(status)) throw new Error('Invalid status');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update({ status })
    .eq('id', listingId);

  if (error) throw error;
}

type LocaleContent = {
  title: string | null;
  about: string | null;
  highlights: string[] | null;
  buyer_tags: string[] | null;
};

type AllLocaleContent = LocaleContent & {
  title_it: string | null;
  about_it: string | null;
  highlights_it: string[] | null;
  buyer_tags_it: string[] | null;
  title_pt: string | null;
  about_pt: string | null;
  highlights_pt: string[] | null;
  buyer_tags_pt: string[] | null;
};

export async function updateListingContent(listingId: string, content: AllLocaleContent) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update(content)
    .eq('id', listingId);

  if (error) throw error;
}

export async function updateListingSector(listingId: string, sector: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin
    .from('listings')
    .update({ sector })
    .eq('id', listingId);

  if (error) throw error;
}

export async function getListingPhotos(listingId: string): Promise<{ name: string; url: string }[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { data } = await admin.storage
    .from('listing-photos')
    .list(listingId, { sortBy: { column: 'name', order: 'asc' } });

  if (!data) return [];

  return data
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: admin.storage
        .from('listing-photos')
        .getPublicUrl(`${listingId}/${f.name}`).data.publicUrl,
    }));
}

export async function deleteListingPhoto(listingId: string, filename: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from('listing-photos')
    .remove([`${listingId}/${filename}`]);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Ingest actions
// ---------------------------------------------------------------------------

const INGEST_SYSTEM_PROMPT = `You are a specialist M&A copywriter for Bottega, a curated SME acquisition platform for Italy and Portugal.
Extract raw facts from source text and rewrite them into a structured listing for sophisticated international buyers.
Never copy source text verbatim. All prose must be fully rewritten.
Tone: direct, financially literate, active voice. No hype or filler.

Rules:
- Use null for fields where the source provides insufficient information.
- country: "IT" for Italy, "PT" for Portugal only. Null for anything else.
- region: exact official name (Italian: Lombardia, Veneto, Toscana, Lazio, Campania, Sicilia, etc. Portuguese: Lisboa, Norte, Centro, Alentejo, Algarve, Açores, Madeira). Null if unclear.
- title: 8–12 words, structured as "[Type] Business for Sale, [Location], [Country]". Include a key metric if available.
- about: 4–6 sentences. What it does, how it makes money, customer base, trading history, buyer appeal. British English.
- business_description: 2–3 sentence factual internal summary. Different wording from about.
- highlights: 3–5 standalone fact or metric strings. Start with a capital letter.
- buyer_tags: pick up to 3 tags from the allowed list only. Do not invent new tags.
- strongest_point: one sentence, the single most compelling reason to buy.
- buyer_disclosure: one sentence covering material risks. Null if none stated.
- Do not invent seller_email or seller_phone.`;

const INGEST_TOOL = {
  name: 'extract_listing',
  description: 'Extract and rewrite a structured business listing from source text.',
  input_schema: {
    type: 'object' as const,
    properties: {
      business_name:        { type: ['string', 'null'], description: 'Trading name, or null.' },
      country:              { type: ['string', 'null'], description: '"IT" or "PT" only, null otherwise.' },
      region:               { type: ['string', 'null'], description: 'Official region name, null if unclear.' },
      sector:               { type: ['string', 'null'], enum: ['manufacturing','food_beverage','hospitality_tourism','leisure_entertainment','retail_artisan','health_wellness','automotive_transport','construction','professional_services','agriculture_land','wholesale','technology','other', null] },
      year_founded:         { type: ['integer', 'null'] },
      seller_email:         { type: ['string', 'null'], description: 'Only if explicit in source.' },
      seller_phone:         { type: ['string', 'null'], description: 'Only if explicit in source.' },
      revenue_range:        { type: ['string', 'null'], enum: ['under_500k','500k_1m','1m_2_5m','2_5m_5m','over_5m', null] },
      ebitda_margin:        { type: ['string', 'null'], enum: ['below_10','10_20','20_35','above_35','not_sure', null] },
      employee_count:       { type: ['string', 'null'], enum: ['just_me','2_5','6_15','16_30','30_plus', null] },
      owner_involvement:    { type: ['string', 'null'], enum: ['full_time','part_time','advisory','minimal', null] },
      asking_price:         { type: ['string', 'null'], enum: ['under_500k','500k_1m','1m_2_5m','2_5m_5m','5m_10m','over_10m', null] },
      partial_sale:         { type: ['string', 'null'], enum: ['open_to_minority','full_sale_only', null] },
      timeline:             { type: ['string', 'null'], enum: ['ready_now','6_12_months','1_2_years','exploring', null] },
      reasons_for_sale:     { type: ['array', 'null'], items: { type: 'string', enum: ['retirement','growth_capital','no_succession','health_personal','market_opportunity','other'] } },
      business_description: { type: ['string', 'null'] },
      strongest_point:      { type: ['string', 'null'] },
      buyer_disclosure:     { type: ['string', 'null'] },
      title:                { type: ['string', 'null'], description: 'SEO title, 8–12 words.' },
      about:                { type: ['string', 'null'], description: '4–6 sentence buyer-facing description.' },
      highlights:           { type: ['array', 'null'], items: { type: 'string' } },
      buyer_tags:           { type: ['array', 'null'], items: { type: 'string', enum: ['Owner-operator','Passive income','Lifestyle acquisition','Succession opportunity','Bolt-on acquisition','Portfolio add-on','Turnaround','Growth capital','First acquisition','Recurring revenue','Asset-light','Family business'] }, maxItems: 3 },
    },
    required: [
      'business_name','country','region','sector','year_founded','seller_email','seller_phone',
      'revenue_range','ebitda_margin','employee_count','owner_involvement',
      'asking_price','partial_sale','timeline','reasons_for_sale',
      'business_description','strongest_point','buyer_disclosure',
      'title','about','highlights','buyer_tags',
    ],
  },
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 15000);
}

function buildSlug(name: string | null, sector: string | null, region: string | null, country: string | null): string {
  const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const countryStr = country === 'IT' ? 'italy' : country === 'PT' ? 'portugal' : '';
  if (name) return [slugify(name), countryStr].filter(Boolean).join('-');
  return generateSlug(sector ?? 'other', region ?? '', country ?? '');
}

export async function ingestListingWithAI(
  input: { mode: 'url'; url: string } | { mode: 'text'; text: string },
): Promise<{ id: string; slug: string; title: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  let inputText: string;
  if (input.mode === 'url') {
    const res = await fetch(input.url);
    if (!res.ok) throw new Error(`Failed to fetch URL: HTTP ${res.status}`);
    inputText = stripHtml(await res.text());
    if (inputText.length < 100) throw new Error('Page content too short — it may be JavaScript-rendered. Try copying and pasting the text instead.');
  } else {
    inputText = input.text.trim();
    if (!inputText) throw new Error('Text is empty.');
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [INGEST_TOOL],
    tool_choice: { type: 'tool', name: 'extract_listing' },
    system: INGEST_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `Extract and rewrite a structured listing from this source text:\n\n---\n${inputText}\n---` }],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') throw new Error('Extraction failed — no structured output returned.');
  const x = toolBlock.input as Record<string, unknown>;

  const slug = buildSlug(x.business_name as string | null, x.sector as string | null, x.region as string | null, x.country as string | null);

  const SECTORS = ['manufacturing','food_beverage','hospitality_tourism','leisure_entertainment','retail_artisan','health_wellness','automotive_transport','construction','professional_services','agriculture_land','wholesale','technology','other',null] as const;
  const REVENUES = ['under_500k','500k_1m','1m_2_5m','2_5m_5m','over_5m',null] as const;
  const EBITDAS = ['below_10','10_20','20_35','above_35','not_sure',null] as const;
  const EMPLOYEES = ['just_me','2_5','6_15','16_30','30_plus',null] as const;
  const INVOLVEMENTS = ['full_time','part_time','advisory','minimal',null] as const;
  const PRICES = ['under_500k','500k_1m','1m_2_5m','2_5m_5m','5m_10m','over_10m',null] as const;
  const PARTIALS = ['open_to_minority','full_sale_only',null] as const;
  const TIMELINES = ['ready_now','6_12_months','1_2_years','exploring',null] as const;

  const sanitized = {
    sector:           coerceEnum(x.sector, SECTORS),
    revenue_range:    coerceEnum(x.revenue_range, REVENUES),
    ebitda_margin:    coerceEnum(x.ebitda_margin, EBITDAS),
    employee_count:   coerceEnum(x.employee_count, EMPLOYEES),
    owner_involvement:coerceEnum(x.owner_involvement, INVOLVEMENTS),
    asking_price:     coerceEnum(x.asking_price, PRICES),
    partial_sale:     coerceEnum(x.partial_sale, PARTIALS),
    timeline:         coerceEnum(x.timeline, TIMELINES),
  };

  const admin = createAdminClient();
  const { data, error } = await admin.from('listings').insert({
    status: 'draft',
    source: 'operator_ingest',
    business_name: x.business_name ?? null,
    country: x.country ?? null,
    region: x.region ?? null,
    ...sanitized,
    year_founded: x.year_founded ?? null,
    seller_email: x.seller_email ?? null,
    seller_phone: x.seller_phone ?? null,
    reasons_for_sale: x.reasons_for_sale ?? null,
    business_description: x.business_description ?? null,
    strongest_point: x.strongest_point ?? null,
    buyer_disclosure: x.buyer_disclosure ?? null,
    title: x.title ?? null,
    about: x.about ?? null,
    highlights: x.highlights ?? null,
    buyer_tags: x.buyer_tags ?? null,
    slug,
  }).select('id').single();

  if (error) {
    if (error.code === '23505') {
      const fallbackSlug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      const { data: retryData, error: retryError } = await admin.from('listings').insert({
        status: 'draft',
        source: 'operator_ingest',
        business_name: x.business_name ?? null,
        country: x.country ?? null,
        region: x.region ?? null,
        ...sanitized,
        year_founded: x.year_founded ?? null,
        seller_email: x.seller_email ?? null,
        seller_phone: x.seller_phone ?? null,
        reasons_for_sale: x.reasons_for_sale ?? null,
        business_description: x.business_description ?? null,
        strongest_point: x.strongest_point ?? null,
        buyer_disclosure: x.buyer_disclosure ?? null,
        title: x.title ?? null,
        about: x.about ?? null,
        highlights: x.highlights ?? null,
        buyer_tags: x.buyer_tags ?? null,
        slug: fallbackSlug,
      }).select('id').single();
      if (retryError) throw retryError;
      return { id: retryData.id, slug: fallbackSlug, title: (x.title as string | null) ?? null };
    }
    throw error;
  }
  return { id: data.id, slug, title: (x.title as string | null) ?? null };
}

export async function generateTranslations(listingId: string): Promise<{
  title_it: string | null; about_it: string | null; highlights_it: string[] | null; buyer_tags_it: string[] | null;
  title_pt: string | null; about_pt: string | null; highlights_pt: string[] | null; buyer_tags_pt: string[] | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const admin = createAdminClient();
  const { data } = await admin
    .from('listings')
    .select('title, about, highlights, buyer_tags')
    .eq('id', listingId)
    .single();

  if (!data || (!data.title && !data.about)) throw new Error('No English content to translate.');

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
          title_pt:      { type: ['string', 'null'] },
          about_pt:      { type: ['string', 'null'] },
          highlights_pt: { type: ['array', 'null'], items: { type: 'string' } },
        },
        required: ['title_it','about_it','highlights_it','title_pt','about_pt','highlights_pt'],
      },
    }],
    tool_choice: { type: 'tool', name: 'translate_listing' },
    system: 'Translate business listing content into Italian and European Portuguese. Rewrite naturally in each language, do not translate word-for-word. Maintain a professional, financially-literate tone. Use null for any field where the source is null.',
    messages: [{
      role: 'user',
      content: `Translate this listing content:\n\nTitle: ${data.title ?? 'null'}\nAbout: ${data.about ?? 'null'}\nHighlights: ${JSON.stringify(data.highlights ?? null)}`,
    }],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock || toolBlock.type !== 'tool_use') throw new Error('Translation failed: no structured output returned.');
  const t = toolBlock.input as Record<string, unknown>;

  const result = {
    title_it:      (t.title_it      as string | null) ?? null,
    about_it:      (t.about_it      as string | null) ?? null,
    highlights_it: (t.highlights_it as string[] | null) ?? null,
    buyer_tags_it: translateTags(data.buyer_tags as string[] | null, 'it'),
    title_pt:      (t.title_pt      as string | null) ?? null,
    about_pt:      (t.about_pt      as string | null) ?? null,
    highlights_pt: (t.highlights_pt as string[] | null) ?? null,
    buyer_tags_pt: translateTags(data.buyer_tags as string[] | null, 'pt'),
  };

  await admin.from('listings').update(result).eq('id', listingId);
  return result;
}

export async function fixBadEnumValues() {
  const admin = createAdminClient();
  await admin.from('listings').update({ ebitda_margin: 'not_sure' }).eq('ebitda_margin', 'Not sure');
  await admin.from('listings').update({ ebitda_margin: 'not_sure' }).eq('ebitda_margin', 'not sure');
}

export type ManualIngestData = {
  business_name: string;
  country: string;
  region: string;
  sector: string;
  year_founded: string;
  revenue_range: string;
  ebitda_margin: string;
  employee_count: string;
  owner_involvement: string;
  asking_price: string;
  partial_sale: string;
  timeline: string;
  business_description: string;
};

export async function ingestListingManual(
  data: ManualIngestData,
): Promise<{ id: string; slug: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const slug = buildSlug(data.business_name || null, data.sector || null, data.region || null, data.country || null);

  const admin = createAdminClient();
  const { data: row, error } = await admin.from('listings').insert({
    status: 'draft',
    source: 'operator_ingest',
    business_name:        data.business_name        || null,
    country:              data.country              || null,
    region:               data.region               || null,
    sector:               data.sector               || null,
    year_founded:         data.year_founded ? parseInt(data.year_founded) : null,
    revenue_range:        data.revenue_range        || null,
    ebitda_margin:        data.ebitda_margin        || null,
    employee_count:       data.employee_count       || null,
    owner_involvement:    data.owner_involvement    || null,
    asking_price:         data.asking_price         || null,
    partial_sale:         data.partial_sale         || null,
    timeline:             data.timeline             || null,
    business_description: data.business_description || null,
    slug,
  }).select('id').single();

  if (error) throw error;
  return { id: row.id, slug };
}
