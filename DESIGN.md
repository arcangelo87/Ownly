# DESIGN.md — Ownly

Read this before writing any component. These decisions are final unless explicitly overridden.

---

## The brief in one sentence

Ownly should feel **professional and fresh** — trustworthy enough for a serious financial transaction, but alive enough that it doesn't feel like a government portal or a legacy broker website.

## The single most important rule

**Do not make it boring.** Boring is the failure mode. A flat, grey, lifeless UI will undermine trust just as much as a chaotic one — it signals that nobody cared. Every screen should feel considered and intentional.

This does not mean loud or decorative. It means: typographically sharp, spatially confident, with just enough warmth to feel human.

---

## What this is not

Avoid these at all costs — they signal generic AI-generated product:

- Inter or Roboto on a white background
- Blue gradient hero sections
- Rounded pill buttons everywhere
- Stock photography of handshakes or cityscapes
- Purple or teal SaaS colour schemes
- Cards with heavy drop shadows
- Oversized emoji or icon illustrations as section decoration

---

## Aesthetic direction

The closest references are **Mercury** (clean, modern, financially credible) and **FT.com** (editorial, information-dense, typographically led) — but warmer. Southern European warmth without being kitsch.

Think: a well-designed boutique investment firm that also happens to feel contemporary. Not a startup, not a legacy institution.

---

## Typography

**Headings:** Playfair Display or Cormorant Garamond — high contrast serif. Creates editorial weight without feeling cold.

**Body / UI:** DM Sans — clean, slightly humanist, readable at small sizes. Pairs well with the serif without competing.

**Monospace** (for financial figures only): IBM Plex Mono — numbers align vertically, signals precision.

Never use Inter, Roboto, or system fonts. They are fine — they are also invisible. Ownly needs to be remembered.

---

## Colour

**Background:** Pale linen — #F7F2E9. Warm without being loud. Feels considered, not sterile.

**Text:** Near-black — #1A1A18 or similar. Not pure black.

**Accent:** Deep forest green — #1C4A2A. Used sparingly and intentionally:
- Sector labels on deal cards
- Active step indicators on the seller form
- CTA buttons
- Bullet point accents on deal highlights
- Progress bars

**No secondary accent colours.** One accent, used well, is more powerful than two used inconsistently.

**Muted tones for supporting UI:** Warm greys derived from the background — borders, labels, placeholders. Never cold blue-greys.

---

## Spacing and layout

- Two-column layouts wherever content allows — left navigation/filters, right main content
- Generous vertical rhythm — sections breathe, they don't crowd
- Component-level spacing is tight and precise (8px, 12px, 16px grid)
- No decorative dividers — use whitespace to separate sections, not lines

---

## Components

### Deal cards
- Photo area full-width at top — placeholder state must look intentional, not broken
- Metric chips (Revenue, EBITDA, Asking price) in a tight 3-column grid — small label above, value below
- Hover state: border colour shift only, no elevation or scale transform
- CTA: "View deal →" — plain text link style, terracotta colour, no button chrome

### Seller form
- One concept per step — never overload a screen
- Step indicator always visible (e.g. "Step 2 of 4")
- Helper text below each field, in a smaller muted size — not above, not in a tooltip
- Placeholder text in textareas should model the answer — show founders what good looks like
- Progress bar in terracotta accent

### Deal detail page
- Metrics in a row of chips near the top — scannable immediately
- "About the business" section in readable prose — 14px, generous line height
- Highlights as a simple dot list — terracotta dots, clean
- Financials section: soft-locked with a plain message — not a dramatic paywall, just honest

### Enquiry form (sidebar)
- Contained in a card with a subtle border
- Fields: name, email, phone, message (optional)
- CTA button: full width, terracotta background, white text
- Reassurance line below button in small muted text

---

## Design references by screen type

| Screen | Reference | What to borrow |
|--------|-----------|----------------|
| Deal listing cards | Wellfound, Linear | Information density, no filler imagery |
| Deal detail page | Mercury, Brex | Label/value structure, financial credibility |
| Seller form | Deel, Clerkie | One concept per step, guided inputs |
| Financials locked | Notion, Dovetail | Soft lock — visible structure, not aggressive gate |

---

## Tone of the UI copy

- Sentence case everywhere — never Title Case, never ALL CAPS in body text
- Direct and plain — no marketing fluff inside the product
- Warm but not cute — this is a serious financial decision, not a consumer app
- Helper text should explain *why* a field matters, not just what to enter

---

## Mobile

V1 is mobile-ready but not mobile-first. Build desktop, then apply these three rules at breakpoint 768px.

**Rule 1 — All two-column layouts collapse to single column.**
This applies to: deal listing page (filters + card grid), deal detail page (content + sidebar), seller form (left nav + right fields).

**Rule 2 — Seller form: full width, step indicator moves to a top bar.**
On mobile the left sidebar with step dots disappears. Replace with a slim progress bar at the very top of the screen (full width, forest green fill) and a "Step X of 4" label below it. Fields are full width. No horizontal padding waste.

**Rule 3 — Deal detail page: enquiry sidebar moves below main content.**
On mobile the sticky sidebar becomes a full-width section that sits below the highlights and financials. The "Send enquiry" button should remain visible — consider a fixed bottom bar on mobile with a single "Get in touch" CTA that scrolls to the form.

No other mobile-specific design decisions are needed for V1.

---

## Dark mode

Not required for V1. Build in light mode only. Use CSS variables for all colours so dark mode can be added later without a rewrite.
