import type { MetadataRoute } from 'next';

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;

type IndexedPage = {
  // Path after the locale prefix. '' is the homepage, served at the bare domain.
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
  // Locales with a real translation. Other locales redirect to English.
  locales: readonly ('en' | 'pt')[];
};

// Every public page that should rank. The sitemap is built from this list.
// Deal pages are added separately from the database.
export const INDEXED_PAGES: readonly IndexedPage[] = [
  // Also served at /en and /en/institutional-buy-side, which canonicalise here
  { path: '', priority: 1, changeFrequency: 'weekly', locales: ['en'] },
  { path: '/deals', priority: 0.9, changeFrequency: 'daily', locales: ['en'] },
  { path: '/sell-side', priority: 0.9, changeFrequency: 'weekly', locales: ['en', 'pt'] },
  { path: '/buyers', priority: 0.9, changeFrequency: 'weekly', locales: ['en'] },
  { path: '/buy', priority: 0.5, changeFrequency: 'monthly', locales: ['en'] },
  { path: '/sell', priority: 0.5, changeFrequency: 'monthly', locales: ['en'] },
  { path: '/privacy', priority: 0.1, changeFrequency: 'yearly', locales: ['en'] },
  { path: '/terms', priority: 0.1, changeFrequency: 'yearly', locales: ['en'] },
];

// Built but not linked from the live site. Kept out of search until they are.
export const NOINDEX = { robots: { index: false, follow: true } } as const;
