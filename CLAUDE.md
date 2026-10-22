# CLAUDE.md — Manto

Read this at the start of every session. These rules are non-negotiable unless explicitly overridden.

---

## What we're building

Manto is a curated SME deal platform for Italy and Portugal. Business owners list their businesses for sale. Buyers browse structured deal pages. The product must feel like a trusted financial tool — not a startup, not a marketplace, not a real estate website.

Solo-operated, bootstrapped. Keep the codebase simple. No unnecessary abstractions.

---

## Infrastructure

- **GitHub:** github.com/angelo87/Ownly
- **Live URL:** https://onmanto.com
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
- next-intl (en and pt)
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
- `/en/institutional-buy-side` is a public URL shared with investors. Never rename, move or delete it, and never add middleware that redirects or rewrites it. If it must change, add a 301 redirect from `/en/institutional-buy-side` to `https://onmanto.com` in the same change

---

## Writing & Copy

- Never use em dashes (—), en dashes (–), or hyphens as punctuation in UI copy or marketing text
- Use commas, colons, periods, or restructure the sentence instead
- Numeric ranges are the only exception: €1–2.5M, 20–35%, 6–12 months

---

## i18n

Use `useTranslations('namespace')` in every component. Locale files in `/messages/`: `en.json` and `pt.json` (pt-PT). No other locales, no empty placeholders.

- The URL alone decides the language. No geo, cookie or Accept-Language redirects.
- A page is served under `/pt` only when it has real Portuguese copy and lists `'pt'` in `SITE_PAGES` (`lib/seo/pages.ts`). Other `/pt/...` URLs 308 to `/en/...`. `/pt` 308s to `/pt/sell-side`, the PT home.
- Never auto-translate copy. If a page exists in one language only, flag it.

---

## SEO and discoverability (default for every new or changed page)

- Every public page has an entry in `SITE_PAGES` in `lib/seo/pages.ts` and uses `generateMetadata` with `pageMetadata(path, locale)`. Its title and description go in `messages/<locale>.json` under `meta.<metaKey>`. That one entry puts the page in the sitemap, hreflang, canonical URLs, the language switcher and the `/pt` routing. Do this in the same change that adds the page; don't wait to be asked.
- Pages are indexable by default. The only exception is a page marked `experiment: true` (noindex, out of the sitemap).
- When an experiment page ships its final version, remove `experiment: true` in that same change so it becomes indexable automatically. Don't ask first. This applies to `/en/portugal-deal-access`: it is noindex until its final version ships, then indexable.
- Blog posts: one markdown file in `content/blog/<locale>/`. See README.

---

## Before writing any code

1. Read DESIGN.md and bottega-product-doc.md
2. Read relevant existing files in the codebase
3. Write a plan — wait for approval before implementing
4. Build one step at a time — never jump ahead

---

## Working style

Suggest the fastest path to the goal, regardless of how direct it is. If a quick fix exists (SQL editor, dashboard action, config change), lead with that. Mention the cleaner long-term solution briefly after, only if it's worth doing.
