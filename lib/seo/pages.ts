import type { MetadataRoute } from 'next';

export type Locale = 'en' | 'pt';
export const LOCALES: readonly Locale[] = ['en', 'pt'];

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

export type SitePage = {
  // Path after the locale prefix. '' is the homepage, served at the bare domain.
  path: string;
  // Key under the `meta` namespace in messages/*.json for title and description.
  metaKey: string;
  // Locales with real copy. A /pt URL for a page without 'pt' redirects to /en.
  locales: readonly Locale[];
  priority: number;
  changeFrequency: ChangeFrequency;
  // Work in progress: noindex and left out of the sitemap. Remove the flag
  // when the final version ships and the page is indexed automatically.
  experiment?: true;
};

// Every public page. The sitemap, hreflang tags, canonical URLs, the language
// switcher and the /pt routing in middleware.ts are all built from this list.
// Blog posts come from content/blog and deal pages from the database.
export const SITE_PAGES: readonly SitePage[] = [
  // Also served at /en and /en/institutional-buy-side, which canonicalise here
  { path: '', metaKey: 'home', locales: ['en'], priority: 1, changeFrequency: 'weekly' },
  { path: '/sell-side', metaKey: 'sellSide', locales: ['en', 'pt'], priority: 0.9, changeFrequency: 'weekly' },
  { path: '/buyers', metaKey: 'buyers', locales: ['en', 'pt'], priority: 0.9, changeFrequency: 'weekly' },
  { path: '/deals', metaKey: 'deals', locales: ['en'], priority: 0.9, changeFrequency: 'daily' },
  { path: '/portugal-deal-access', metaKey: 'dealAccess', locales: ['en'], priority: 0.9, changeFrequency: 'weekly', experiment: true },
  { path: '/buy', metaKey: 'buy', locales: ['en'], priority: 0.5, changeFrequency: 'monthly' },
  { path: '/sell', metaKey: 'sell', locales: ['en'], priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', metaKey: 'privacy', locales: ['en', 'pt'], priority: 0.1, changeFrequency: 'yearly' },
  { path: '/terms', metaKey: 'terms', locales: ['en', 'pt'], priority: 0.1, changeFrequency: 'yearly' },
];

// Where each language's home is. Portuguese visitors are sellers, so the PT
// home is the PT sell-side page (/pt redirects there).
export const HOME_URL: Record<Locale, string> = { en: '/', pt: '/pt/sell-side' };

export const HREFLANG: Record<Locale, string> = { en: 'en', pt: 'pt-PT' };

// Built but not linked from the live site. Kept out of search until they are.
export const NOINDEX = { robots: { index: false, follow: true } } as const;

export function getSitePage(path: string): SitePage {
  const page = SITE_PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`No SITE_PAGES entry for "${path}"`);
  return page;
}
