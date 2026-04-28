# CLAUDE.md — Bottega

Read this at the start of every session. These rules are non-negotiable unless explicitly overridden.

---

## What we're building

Bottega is a curated SME deal platform for Italy and Portugal. Business owners list their businesses for sale. Buyers browse structured deal pages. The product must feel like a trusted financial tool — not a startup, not a marketplace, not a real estate website.

Solo-operated, bootstrapped. Keep the codebase simple. No unnecessary abstractions.

---

## Infrastructure

- **GitHub:** github.com/angelo87/Ownly
- **Live URL:** https://ownly-iota.vercel.app/en
- **Vercel:** auto-deploys on every push
- **Supabase:** project URL in environment variables
- **Resend:** deferred — add when first email feature is needed

---

## Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- shadcn/ui — always restyle to match design tokens, never use defaults unstyled
- Supabase (Postgres + Auth + Storage)
- Anthropic Claude API — claude-sonnet-4-20250514
- next-intl (en live, pt + it empty placeholders)
- Vercel

---

## Design

Follow all rules in DESIGN.md. Read it before writing any component.

---

## Build order

1. Epic B — Seller input flow
2. Epic C — Deal presentation page
3. Epic D — Buyer discovery + inquiry flow
4. Epic A — Landing pages (last)

Full requirements for each epic are in bottega-product-doc.md.

---

## Hard rules

- No hardcoded colour values — use CSS variables defined in DESIGN.md
- No hardcoded strings — use next-intl translation keys
- All inputs must have visible labels
- No `any` TypeScript types
- Never hard delete user data — use `deleted_at` soft delete
- RLS enabled on all Supabase tables from day one

---

## Writing & Copy

- Never use em dashes (—), en dashes (–), or hyphens as punctuation in UI copy or marketing text
- Use commas, colons, periods, or restructure the sentence instead
- Numeric ranges are the only exception: €1–2.5M, 20–35%, 6–12 months

---

## i18n

Use `useTranslations('namespace')` in every component. Locale files in `/messages/`. Only `en.json` populated — `pt.json` and `it.json` are empty placeholders.

---

## Before writing any code

1. Read DESIGN.md and bottega-product-doc.md
2. Read relevant existing files in the codebase
3. Write a plan — wait for approval before implementing
4. Build one step at a time — never jump ahead
