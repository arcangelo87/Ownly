# Manto

Next.js 15 (App Router), next-intl (`en`, `pt`), Supabase, deployed on Vercel. See CLAUDE.md for project rules.

```bash
npm run dev     # local dev server
npm run build   # production build
```

## Sitemap, robots.txt and new pages

- `app/sitemap.ts` generates https://onmanto.com/sitemap.xml (revalidated hourly) from three sources, with hreflang alternates for every URL:
  1. `SITE_PAGES` in `lib/seo/pages.ts` (static pages, one URL per language listed in `locales`)
  2. markdown posts in `content/blog/` (plus a `/blog` index per language that has posts)
  3. live deals from Supabase
- `app/robots.ts` generates robots.txt: allow all except `/admin` and `/claim`, plus the Sitemap line.

**New page:** add an entry to `SITE_PAGES` and export `generateMetadata` returning `pageMetadata('<path>', locale)`. Add `meta.<metaKey>.title` and `.description` to each language's messages file. Add `'pt'` to `locales` only when Portuguese copy exists. Pages marked `experiment: true` stay noindex and out of the sitemap.

**New blog post:** add one file to `content/blog/pt/` or `content/blog/en/`. It appears in the sitemap, the blog index and the language switcher on the next deploy, with no other edits.

```markdown
---
title: "Post title"
description: "One or two sentences for search results."
slug: post-slug
lang: en            # en or pt-PT, must match the folder
date: 2026-10-22    # YYYY-MM-DD; a future date shows in the sitemap as the current time
author: Arcangelo Passaro
cta_label: "Button text"
cta_url: /en/portugal-deal-access
noindex: false      # optional
---

Markdown body.
```

A post in the other language with the same slug is treated as its counterpart (hreflang and switcher). Without one, the switcher links to the other language's home page.
