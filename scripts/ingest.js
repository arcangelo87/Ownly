'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

const AnthropicClass = Anthropic.default ?? Anthropic;

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  let url = null;
  let text = null;
  let file = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) { url = args[++i]; }
    else if (args[i] === '--text' && args[i + 1]) { text = args[++i]; }
    else if (args[i] === '--file' && args[i + 1]) { file = args[++i]; }
  }
  if (!url && !text && !file) {
    console.error('Usage:');
    console.error('  node scripts/ingest.js --url <url>');
    console.error('  node scripts/ingest.js --text "<pasted text>"');
    console.error('  node scripts/ingest.js --file <path-to-csv>   (first column = URLs)');
    process.exit(1);
  }
  return { url, text, file };
}

// ---------------------------------------------------------------------------
// URL fetching + HTML stripping
// ---------------------------------------------------------------------------

async function fetchUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const html = await res.text();

  const stripped = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 15000);

  if (stripped.length < 200) {
    console.warn(
      'Warning: extracted text is very short (' + stripped.length + ' chars). ' +
      'The page may be JavaScript-rendered. Consider using --text with copied content instead.'
    );
  }

  return stripped;
}

// ---------------------------------------------------------------------------
// Anthropic extraction
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a specialist M&A copywriter and analyst for Bottega, a curated deal platform for SME acquisitions in Italy and Portugal.

Your job is to extract raw facts from source text and rewrite them into a structured listing for sophisticated international buyers. You must NEVER copy source text verbatim — all prose fields must be fully rewritten.

Tone: direct, financially literate, written for international buyers. No hype. No filler. Active voice.

Rules:
- Use null for any field where the source provides insufficient information. Do not invent data.
- For enum fields, pick the closest matching value from the allowed list. Use null only if genuinely indeterminate.
- country: "IT" for Italy, "PT" for Portugal only. Null for anything else.
- region: use exact official names. Italian: Lombardia, Piemonte, Valle d'Aosta, Trentino-Alto Adige, Veneto, Friuli-Venezia Giulia, Liguria, Emilia-Romagna, Toscana, Umbria, Marche, Lazio, Abruzzo, Molise, Campania, Puglia, Basilicata, Calabria, Sicilia, Sardegna. Portuguese: Lisboa, Norte, Centro, Alentejo, Algarve, Açores, Madeira. Null if unclear.
- title: write a concise 8–12 word SEO title structured as "[Sector/Product] Business for Sale — [Location], [Country]". Include a key financial attribute if one is available (e.g. EBITDA margin, years trading). Never use em dashes or hyphens as punctuation. Use "for Sale" not "for sale".
- about: rewrite as 4–6 sentences. Cover: what the business does, how it makes money, its customer base, trading history, and what makes it attractive to a buyer. British English. Financially precise. No filler phrases. Must be entirely original prose.
- business_description: a shorter 2–3 sentence factual summary for internal use. Different wording from about.
- highlights: 3–5 bullet-point strings. Each is a standalone fact or metric. E.g. "Established 2008, 16 years of continuous trading". Start each with a capital letter. No bullet symbols.
- buyer_tags: 2–5 short tags relevant to buyer type or deal thesis. E.g. "Owner-operator", "Lifestyle acquisition", "Portfolio add-on", "Passive income", "Turnaround", "Succession opportunity".
- strongest_point: one sentence naming the single most compelling reason a buyer should be interested.
- buyer_disclosure: one sentence covering material risks, dependencies, or caveats. Null if none are stated or inferable.
- Do not include seller_email or seller_phone unless they appear explicitly in the source text.`;

const EXTRACT_TOOL = {
  name: 'extract_listing',
  description: 'Extract and rewrite a structured business listing from source text.',
  input_schema: {
    type: 'object',
    properties: {
      // Step 1 — basics
      business_name: {
        type: ['string', 'null'],
        description: 'Trading name of the business, or null if not stated.',
      },
      country: {
        type: ['string', 'null'],
        description: '"IT" for Italy, "PT" for Portugal, null for anything else.',
      },
      region: {
        type: ['string', 'null'],
        description: 'Official Italian or Portuguese region name, exactly as specified in the rules. Null if unclear.',
      },
      sector: {
        type: ['string', 'null'],
        enum: [
          'manufacturing',
          'food_beverage',
          'hospitality_tourism',
          'leisure_entertainment',
          'retail_artisan',
          'health_wellness',
          'automotive_transport',
          'construction',
          'professional_services',
          'agriculture_land',
          'wholesale',
          'technology',
          'other',
          null,
        ],
        description: 'Sector enum value. Null if truly indeterminate.',
      },
      year_founded: {
        type: ['integer', 'null'],
        description: 'Four-digit founding year, or null.',
      },
      seller_email: {
        type: ['string', 'null'],
        description: 'Seller email only if explicitly in the source. Null otherwise.',
      },
      seller_phone: {
        type: ['string', 'null'],
        description: 'Seller phone only if explicitly in the source. Null otherwise.',
      },
      // Step 2 — financials
      revenue_range: {
        type: ['string', 'null'],
        enum: ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', 'over_5m', null],
        description: 'Revenue range enum. Null if not mentioned.',
      },
      ebitda_margin: {
        type: ['string', 'null'],
        enum: ['below_10', '10_20', '20_35', 'above_35', 'not_sure', null],
        description: 'EBITDA margin band. Null if not mentioned.',
      },
      employee_count: {
        type: ['string', 'null'],
        enum: ['just_me', '2_5', '6_15', '16_30', '30_plus', null],
        description: 'Headcount range. Null if not mentioned.',
      },
      owner_involvement: {
        type: ['string', 'null'],
        enum: ['full_time', 'part_time', 'advisory', 'minimal', null],
        description: 'Current owner involvement level. Null if not mentioned.',
      },
      // Step 3 — deal terms
      asking_price: {
        type: ['string', 'null'],
        enum: ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', '5m_10m', 'over_10m', null],
        description: 'Asking price range. Null if not mentioned.',
      },
      partial_sale: {
        type: ['string', 'null'],
        enum: ['open_to_minority', 'full_sale_only', null],
        description: 'Whether a partial sale is considered. Null if not mentioned.',
      },
      timeline: {
        type: ['string', 'null'],
        enum: ['ready_now', '6_12_months', '1_2_years', 'exploring', null],
        description: 'Seller timeline. Null if not mentioned.',
      },
      // Step 4 — story
      reasons_for_sale: {
        type: ['array', 'null'],
        items: {
          type: 'string',
          enum: ['retirement', 'growth_capital', 'no_succession', 'health_personal', 'market_opportunity', 'other'],
        },
        description: 'Array of applicable reasons for sale, or null.',
      },
      business_description: {
        type: ['string', 'null'],
        description: 'Rewritten 2–3 sentence factual internal summary. Original prose only.',
      },
      strongest_point: {
        type: ['string', 'null'],
        description: 'Single sentence stating the most compelling reason to buy.',
      },
      buyer_disclosure: {
        type: ['string', 'null'],
        description: 'Material risks or caveats in one sentence. Null if none.',
      },
      // Operator-authored fields
      title: {
        type: ['string', 'null'],
        description: 'SEO title: "[Sector/Product] Business for Sale, [Location]". 8–12 words. Original.',
      },
      about: {
        type: ['string', 'null'],
        description: 'Fully rewritten 4–6 sentence buyer-facing description. British English. Financially precise.',
      },
      highlights: {
        type: ['array', 'null'],
        items: { type: 'string' },
        description: '3–5 standalone fact or metric strings. Original phrasing.',
      },
      buyer_tags: {
        type: ['array', 'null'],
        items: { type: 'string' },
        description: '2–5 short buyer-type or deal-thesis tags.',
      },
    },
    required: [
      'business_name', 'country', 'region', 'sector', 'year_founded',
      'seller_email', 'seller_phone',
      'revenue_range', 'ebitda_margin', 'employee_count', 'owner_involvement',
      'asking_price', 'partial_sale', 'timeline',
      'reasons_for_sale', 'business_description', 'strongest_point', 'buyer_disclosure',
      'title', 'about', 'highlights', 'buyer_tags',
    ],
  },
};

async function extractListing(inputText) {
  const client = new AnthropicClass({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    tools: [EXTRACT_TOOL],
    tool_choice: { type: 'tool', name: 'extract_listing' },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Extract and rewrite a structured business listing from the following source text:\n\n---\n${inputText}\n---`,
      },
    ],
  });

  const toolBlock = response.content.find((b) => b.type === 'tool_use');
  if (!toolBlock) throw new Error('Claude did not return a tool_use block.');
  return toolBlock.input;
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SECTOR_SLUGS = {
  manufacturing: 'manufacturing',
  food_beverage: 'food-beverage',
  hospitality_tourism: 'hospitality',
  leisure_entertainment: 'leisure',
  retail_artisan: 'retail',
  health_wellness: 'health-wellness',
  automotive_transport: 'automotive',
  construction: 'construction',
  professional_services: 'professional-services',
  agriculture_land: 'agriculture',
  wholesale: 'wholesale',
  technology: 'technology',
  other: 'business',
};

function generateSlug(extracted) {
  const country = extracted.country === 'IT' ? 'italy' : extracted.country === 'PT' ? 'portugal' : null;

  if (extracted.business_name) {
    const base = slugify(extracted.business_name);
    return [base, country].filter(Boolean).join('-');
  }

  const sector = SECTOR_SLUGS[extracted.sector] ?? 'business';
  const region = slugify(extracted.region);
  return [sector, region, country].filter(Boolean).join('-');
}

// ---------------------------------------------------------------------------
// Supabase insert
// ---------------------------------------------------------------------------

async function insertListing(payload) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('listings')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    // Unique slug collision — append random suffix and retry once
    if (error.code === '23505' && payload.slug) {
      const suffix = Math.random().toString(36).slice(2, 6);
      const retryPayload = { ...payload, slug: `${payload.slug}-${suffix}` };
      const { data: retryData, error: retryError } = await supabase
        .from('listings')
        .insert(retryPayload)
        .select('id')
        .single();
      if (retryError) throw retryError;
      return { id: retryData.id, slug: retryPayload.slug };
    }
    throw error;
  }

  return { id: data.id, slug: payload.slug };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function ingestUrl(url) {
  const inputText = await fetchUrl(url);
  const extracted = await extractListing(inputText);
  const slug = generateSlug(extracted);
  const payload = {
    status: 'draft',
    source: 'operator_ingest',
    business_name:        extracted.business_name        ?? null,
    country:              extracted.country              ?? null,
    region:               extracted.region               ?? null,
    sector:               extracted.sector               ?? null,
    year_founded:         extracted.year_founded         ?? null,
    seller_email:         extracted.seller_email         ?? null,
    seller_phone:         extracted.seller_phone         ?? null,
    revenue_range:        extracted.revenue_range        ?? null,
    ebitda_margin:        extracted.ebitda_margin        ?? null,
    employee_count:       extracted.employee_count       ?? null,
    owner_involvement:    extracted.owner_involvement    ?? null,
    asking_price:         extracted.asking_price         ?? null,
    partial_sale:         extracted.partial_sale         ?? null,
    timeline:             extracted.timeline             ?? null,
    reasons_for_sale:     extracted.reasons_for_sale     ?? null,
    business_description: extracted.business_description ?? null,
    strongest_point:      extracted.strongest_point      ?? null,
    buyer_disclosure:     extracted.buyer_disclosure     ?? null,
    title:                extracted.title                ?? null,
    about:                extracted.about                ?? null,
    highlights:           extracted.highlights           ?? null,
    buyer_tags:           extracted.buyer_tags           ?? null,
    slug,
  };
  const { id, slug: finalSlug } = await insertListing(payload);
  return { id, slug: finalSlug, title: extracted.title };
}

async function main() {
  const { url, text, file } = parseArgs();

  // --file: batch mode from CSV
  if (file) {
    const lines = fs.readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.split(',')[0].trim())
      .filter((l) => l.startsWith('http'));

    if (lines.length === 0) {
      console.error('No URLs found in file (first column must start with http).');
      process.exit(1);
    }

    console.log(`Found ${lines.length} URL${lines.length === 1 ? '' : 's'} in ${file}\n`);
    let ok = 0;
    let fail = 0;

    for (let i = 0; i < lines.length; i++) {
      const u = lines[i];
      process.stdout.write(`[${i + 1}/${lines.length}] ${u} ... `);
      try {
        const { slug: finalSlug, title } = await ingestUrl(u);
        console.log(`✓ ${finalSlug}${title ? ` — ${title}` : ''}`);
        ok++;
      } catch (e) {
        console.log(`✗ ${e.message}`);
        fail++;
      }
    }

    console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
    return;
  }

  // --url or --text: single listing
  let inputText;
  if (url) {
    console.log(`Fetching ${url} ...`);
    inputText = await fetchUrl(url);
    console.log(`Fetched ${inputText.length.toLocaleString()} characters.`);
  } else {
    inputText = text;
    console.log(`Using provided text (${inputText.length.toLocaleString()} characters).`);
  }

  console.log('Extracting and rewriting listing with Claude...');
  const extracted = await extractListing(inputText);
  const slug = generateSlug(extracted);
  const payload = {
    status: 'draft',
    source: 'operator_ingest',
    business_name:        extracted.business_name        ?? null,
    country:              extracted.country              ?? null,
    region:               extracted.region               ?? null,
    sector:               extracted.sector               ?? null,
    year_founded:         extracted.year_founded         ?? null,
    seller_email:         extracted.seller_email         ?? null,
    seller_phone:         extracted.seller_phone         ?? null,
    revenue_range:        extracted.revenue_range        ?? null,
    ebitda_margin:        extracted.ebitda_margin        ?? null,
    employee_count:       extracted.employee_count       ?? null,
    owner_involvement:    extracted.owner_involvement    ?? null,
    asking_price:         extracted.asking_price         ?? null,
    partial_sale:         extracted.partial_sale         ?? null,
    timeline:             extracted.timeline             ?? null,
    reasons_for_sale:     extracted.reasons_for_sale     ?? null,
    business_description: extracted.business_description ?? null,
    strongest_point:      extracted.strongest_point      ?? null,
    buyer_disclosure:     extracted.buyer_disclosure     ?? null,
    title:                extracted.title                ?? null,
    about:                extracted.about                ?? null,
    highlights:           extracted.highlights           ?? null,
    buyer_tags:           extracted.buyer_tags           ?? null,
    slug,
  };

  console.log('Inserting into Supabase...');
  const { id, slug: finalSlug } = await insertListing(payload);

  console.log('\nDone.');
  console.log(`  ID:     ${id}`);
  console.log(`  Slug:   ${finalSlug}`);
  console.log(`  Status: draft`);
  if (extracted.title) console.log(`  Title:  ${extracted.title}`);
}

main().catch((err) => {
  console.error('\nError:', err.message || err);
  process.exit(1);
});
