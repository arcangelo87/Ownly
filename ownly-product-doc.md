# Ownly — Product Document

Last updated: April 2026
Source of truth for all product and strategic decisions. Update after every session where decisions are made.

---

## What is Ownly

Ownly is a curated SME deal platform for Southern Europe, starting with Italy and Portugal. It connects business owners who want to sell with buyers who want to acquire. Deals are structured, presented professionally, and financials are shared under NDA after an initial conversation.

The platform targets businesses in the €500k–€5M revenue range, typically founder-run, sub-15 employees, B2B, profitable.

---

## ICP — Sellers

**Who they are:** Founder-operators, 50+, built something excellent, no succession plan, commercially isolated. Often at the ceiling — can't grow further alone. The signal isn't "wants to sell" — it's "can't grow further alone." Manufacturing, food production, professional services, specialty wholesale.

**Target profile:** Italy and Portugal, €1M–€5M revenue, 20–50% EBITDA margins, 1 founder, sub-15 employees, B2B clients.

**Core problem:** They don't know how to package or present their business. They have no access to serious buyers. And they don't know what their business is worth.

**Value proposition:**
- Turn basic business info into a structured deal page that serious buyers can evaluate
- Get in front of buyers actively looking in Italy and Portugal
- Clean, shareable deal page — free to start
- Assisted service (€299–350/year) includes: teaser doc, NDA support, outreach materials, buyer matching, business valuation
- White glove advisory on request: full support from positioning to close, custom price

**Tone:** Respectful, plain-spoken, warm. This is a big life decision. Never pushy. Never jargon-heavy.

---

## ICP — Buyers

**Who they are:** Individual investors, micro PE operators, expats looking for lifestyle businesses, diaspora buyers interested in Italy or Portugal. Often browsing before committing. May have capital but limited deal flow access.

**Core problem:** Quality SME deals in Southern Europe are hard to find. What's listed publicly is poorly presented, financially opaque, or handled by brokers who don't respond.

**Value proposition:**
- Browse curated, structured deals — not raw marketplace listings
- Each deal comes with a clear financial snapshot so you can assess fit quickly
- Request more information via a simple enquiry — no cold calls, no chasing brokers
- Deals in Italy and Portugal — markets most platforms underserve

**Tone:** Confident, informative, respectful of their time. They're evaluating, not being sold to. Let the deal quality speak.

**Access model:**
- Browse listings: public, no login required
- View deal detail page: public, no login required
- Submit an enquiry: requires registration (name + email minimum)

---

## ICP — Brokers

Deal brokers and M&A advisors who want to list client deals on Ownly and access the buyer network.

**Pricing:** Free up to 5 listings, Pro plan €49/month for unlimited listings + buyer matching tools + deal room access.

---

## Business Model

| Tier | Who | Price | What's included |
|------|-----|-------|-----------------|
| Free | Sellers | €0 | Listing page, up to 10 inbound enquiries |
| Assisted | Sellers | €299–350/year | Listing + teaser + NDA support + outreach materials + valuation + unlimited enquiries |
| White Glove | Sellers | Custom | Full advisory to close |
| Free | Brokers | €0 | Up to 5 deal listings |
| Pro | Brokers | €49/month | Unlimited listings + buyer matching + deal room |
| Free | Buyers | €0 | Browse + up to 10 enquiries |
| Paid | Buyers | €199 one-off | Unlimited enquiries + saved deal alerts |

Note: The buyer paywall at enquiry #11 is not yet relevant until the platform has real scale. Deprioritise building it.

---

## Buyer Funnel

Three distinct stages:

1. **Browse** — public, no login. Deal listing page with cards showing sector, location, revenue, EBITDA, asking price.
2. **View deal** — public, no login. Full deal detail page with description, highlights, key metrics. Financials shown as locked — "available on request."
3. **Enquire** — requires registration. Simple form: name, email, phone, message (optional). Enquiry goes to Ownly operator, who routes to seller manually.

**NDA process:** Manual and offline for now. Not captured in platform flow. The deal detail page references that detailed financials are shared after an initial conversation — no hard gate to build yet.

---

## Seller Form — 4 Steps

Decided April 2026. Build one step at a time.

### Step 1 — Business basics
Fields:
- Business name (optional — can stay anonymous)
- Country (Italy / Portugal)
- Region (dropdown, changes based on country)
- Sector (Manufacturing / Food & Beverage / Professional Services / Wholesale & Distribution / Construction & Engineering / Technology / Other)
- Year founded
- Email address (required — for operator contact only, never shown publicly)
- Phone number (optional — for operator contact only, never shown publicly)
- Photo upload (optional — premises, equipment, team — up to 10 files, 5MB each)

Design notes: Email and phone sit below year founded, above the photos divider. Email is required. Photo upload at the bottom of step 1, below a divider. Upload zone with drag target. Live preview grid (4 columns) after upload. Note that listings with photos get significantly more buyer interest.

Removed from this step: "Revenue from top client" — too intrusive at first contact.

### Step 2 — Size & team
Fields:
- Annual revenue (range dropdown — under €500k / €500k–€1M / €1M–€2.5M / €2.5M–€5M / over €5M)
- EBITDA margin (below 10% / 10–20% / 20–35% / above 35% / not sure)
- Number of employees FTE (just me / 2–5 / 6–15 / 16–30 / 30+)

Helper text: "Last full fiscal year. Exact figures shared under NDA."
Removed: Client concentration / revenue from top client field.

### Step 3 — The deal
Fields:
- Asking price (range dropdown)
- Open to partial sale? (Yes, open to minority / Full sale only — radio buttons)
- Timeline (Ready now under 6 months / 6–12 months / 1–2 years / Just exploring)

### Step 4 — Your story
Fields:
- Why are you considering a sale? (checkboxes: Retirement / Need growth capital / No succession plan / Health or personal / Market opportunity / Other)
- Describe your business in your own words (guided textarea — "what you do, who your clients are, what makes it work")
- What's the strongest thing about this business? (optional — "what would you tell a serious buyer in 30 seconds?")
- Anything a buyer should know upfront? (optional — risks, dependencies, things better disclosed early)

Each field has a concrete placeholder example showing the founder what good looks like.

**Important:** The third field ("anything a buyer should know upfront") is where founders will often surface founder-dependency issues themselves. This is high-value signal.

---

## Listing Copy Process

**Decided April 2026.**

Listing descriptions ("About the business" and "Highlights" on the deal detail page) are written by Ownly — not auto-generated from the form alone.

Process:
1. Seller submits the 4-step form
2. Listing status defaults to Draft
3. Ownly reviews the guided text fields from Step 4 and writes the listing copy
4. Operator publishes the listing when copy is ready
5. Optionally, Ownly may conduct a follow-up call (20–30 min) to fill gaps — but this is an operational practice, not a platform requirement. Sellers can publish without a call.

Retiring founders in Italy and Portugal will not write compelling deal descriptions. Ownly does it for them based on the Step 4 inputs. The follow-up call improves quality but is not a gate.

---

## Deal Listing Page (Browse)

URL: `/deals`

Layout: Left sidebar filters + right card grid (2 columns).

**Filters:**
- Country (Italy / Portugal checkboxes)
- Sector (multi-checkbox)
- Asking price (radio: Any / Under €1M / €1–2M / €2–4M / Over €4M)
- Timeline (checkboxes)

**Sort:** Most recent / Asking price low–high / Revenue high–low / EBITDA margin high–low

**Deal card contains:**
- Photo area (full width top — shows placeholder if no photos, photo count badge if photos uploaded)
- Sector (small caps, coral accent)
- Location (right-aligned, muted)
- Title / business description (serif, 15px)
- 3 metric chips: Revenue, EBITDA, Asking price
- Footer: employees + timeline (left), CTA (right)

**CTA on card:** "View deal →" — leads to deal detail page. Not "Request NDA."

---

## Deal Detail Page

URL: `/deals/[slug]`

Fully public — no login required to view.

Layout: Two-column — main content (left, wider) + sidebar (right, 300px, sticky).

**Main content sections:**
1. Photo area (full width, 240px height — placeholder if no photos)
2. Sector badge + date listed
3. Business title (serif, 28px)
4. 5 metric chips: Revenue, EBITDA, Asking price, Employees, Timeline
5. About the business (written by Ownly after seller call)
6. Highlights (bullet list, 3–5 points — written by Ownly)
7. Full financials (soft-locked section — "available on request" message, not a hard gate)

**Sidebar:**
- Enquiry form (name, email, phone number, message optional) + submit button
- Reassurance line: "Your details are shared only with the seller. No spam."
- Deal basics summary card (country, region, founded, sale structure, reason for sale)

**Seller motivation (reason for sale):** Shown publicly in the sidebar deal basics. Decision to show this was made — worth revisiting once real sellers are live.

**Enquiry handling:** Manual. Enquiries stored in Supabase, Ownly operator notified, routed to seller manually. No automated NDA flow.

---

## Design Direction

Decided April 2026. Updates the original "boutique financial advisory" direction to be warmer and fresher.

**Aesthetic:** Professional and fresh. Not boring, not cold, not intimidating. Think Mercury or Stripe — trusted and modern — with Southern European warmth.

**What to avoid:** Rounded cards + blue gradients + stock photography + Inter on white = generic AI slop. Do not build this.

**Typography:** High-contrast serif for headings (Playfair Display or Cormorant) + clean sans-serif for body (DM Sans or similar).

**Colour:** Off-white or warm cream background. Near-black text. Accent: deep terracotta / coral (#C1440E or similar). Used sparingly — sector labels, CTAs, progress indicators, bullet accents. One accent, used with restraint.

**Layout:** Two-column layouts where content allows. Generous whitespace. Density over decoration.

**Reference screens by page type:**
- Deal listing cards → Wellfound / Linear (information-dense, no imagery filler)
- Deal detail page → Mercury / Brex (label/value rows, structured)
- Seller form → Deel / Clerkie (one concept per step, helper text below fields)
- Financials locked section → Dovetail / Notion (soft lock, informative, not aggressive)

---

## Discovery Insights — Seller Archetype (Iris Tiberio call)

Key learnings from seller call March 2025:

- Sellers self-diagnose better than expected. Iris said "il problema sono io" unprompted. Ownly's job is translation and structuring — not diagnosis.
- Readiness signal is subtle. Age, succession language, growth frustration — soft signals. A seller ready in 6 months looks identical to one ready in 3 years on paper.
- Capacity gap is the strongest buyer value signal. 50% spare production capacity — mentioned in passing, worth millions in buyer framing. Should be a headline output on the listing.
- Operational documentation varies wildly. Iris had machine-by-machine maintenance logs — exceptional. Most won't. The form needs to work for both.
- Founder dependency is rarely stated directly. It needs to be inferred from org structure and the "anything buyers should know" field.

**Future product ideas validated by this call (not V1):**
- Founder Dependency Detector — infer from org structure and client concentration
- Capacity vs. Revenue Gap module — surface as headline metric
- Readiness Signal layer — score based on age, succession language, growth frustration

---

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- shadcn/ui (restyled — never default shadcn appearance)
- Supabase (Postgres + Auth + Storage)
- Anthropic Claude API — claude-sonnet-4-20250514
- next-intl (i18n — en live, pt + it placeholder)
- Vercel (deploy, auto-deploys on push)
- Resend (email — add when first email feature is needed)

**Infrastructure:**
- GitHub: github.com/angelo87/Ownly
- Live URL: https://ownly-iota.vercel.app/en

---

## Build Order

Work through epics in this order. Do not jump ahead.

1. **Epic B** — Seller input flow (4-step form + operator review)
2. **Epic C** — Deal detail page (public, with enquiry sidebar)
3. **Epic D** — Deal listing page (browse, filters, card grid)
4. **Epic A** — Landing pages (last, when real deals exist to show)

---

## Epics — Requirements

### Epic B — Seller Input Flow

Multi-step form (4 steps as defined above). One concept per step. Step indicator always visible. Helper text below each field. Sensitive fields include explanation of why they're needed.

**Post-submission:**
- Seller data stored in Supabase
- Operator notified by email (Resend)
- Listing status: Draft (operator reviews, writes copy, then publishes)
- Operator dashboard: list of submitted listings with status (Draft / In Review / Live / Rejected)

**Operator dashboard columns (all form fields visible):**
- Business name, Country, Region, Sector, Year founded
- Email (contact — for operator use only), Phone (contact — optional)
- Revenue range, EBITDA margin, Employees (FTE)
- Asking price, Partial sale, Timeline
- Reasons for sale, Business description, Strongest point, Buyer disclosure
- Status (editable inline), Submitted date

**Listing goes live when:** Operator has written the listing copy and is satisfied with quality. No call required — that is an operational choice, not a platform gate.

### Epic C — Deal Detail Page

As specified in "Deal Detail Page" section above.

**Slug:** Auto-generated from business type + location (e.g. `precision-manufacturer-veneto-italy`). Anonymised — no company name in URL unless seller opts in.

**Enquiry form submission:** Stored in Supabase. Operator email notification. Status tracked: New / Reviewed / Forwarded / Closed.

### Epic D — Deal Listing Page

As specified in "Deal Listing Page" section above.

Filters implemented client-side for V1 (no pagination needed until 20+ deals). Sort is client-side.

### Epic A — Landing Pages

Build last. Will use real screenshots of the product and real (anonymised) deal examples.

Pages needed: Homepage (/, /en), /sellers, /buyers, /brokers.

---

## Open Questions

- Should seller motivation (reason for sale) be shown publicly on the deal detail page, or only after enquiry? Currently shown — worth revisiting once real sellers are onboarded.
- Buyer registration flow: what's the minimum required? Name + email only, or more?
- Deal alerts for buyers (email digest): V2 — not building yet.
- Languages: English first, Italian and Portuguese as placeholders. When to activate?
