import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SITE_URL } from '@/lib/site';
import { getAllPosts, getPosts } from '@/lib/blog';
import { HREFLANG, LOCALES, NOINDEX, SITE_PAGES, getSitePage, type Locale } from '@/lib/seo/pages';

// Absolute URL of a page in one language. The EN homepage is the bare domain.
export function pageUrl(locale: Locale, path: string): string {
  return locale === 'en' && path === '' ? `${SITE_URL}/` : `${SITE_URL}/${locale}${path}`;
}

// hreflang map for the languages a page exists in, plus x-default (EN) when
// an English version exists.
export function hreflangs(path: string, locales: readonly Locale[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const locale of locales) map[HREFLANG[locale]] = pageUrl(locale, path);
  if (locales.includes('en')) map['x-default'] = pageUrl('en', path);
  return map;
}

type BuildArgs = {
  locale: Locale;
  path: string;
  locales: readonly Locale[];
  title: string;
  description?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
};

export function buildMetadata({ locale, path, locales, title, description, noindex, type = 'website' }: BuildArgs): Metadata {
  const url = pageUrl(locale, path);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangs(path, locales) },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: 'Manto',
      locale: locale === 'pt' ? 'pt_PT' : 'en_GB',
      // Setting openGraph here replaces app/[locale]/opengraph-image.png, so point at it
      images: [{ url: `/${locale}/opengraph-image.png`, width: 1200, height: 630, alt: 'Manto' }],
    },
    ...(noindex ? NOINDEX : {}),
  };
}

// Metadata for a page in SITE_PAGES, with title and description from
// messages/<locale>.json under meta.<metaKey>.
export async function pageMetadata(path: string, locale: string): Promise<Metadata> {
  const page = getSitePage(path);
  const lang = (page.locales.includes(locale as Locale) ? locale : 'en') as Locale;
  const t = await getTranslations({ locale: lang, namespace: `meta.${page.metaKey}` });
  return buildMetadata({
    locale: lang,
    path,
    locales: page.locales,
    title: t('title'),
    description: t('description'),
    noindex: page.experiment,
  });
}

// Paths that exist in each language, for the language switcher.
export function availablePaths(): Record<Locale, string[]> {
  const result = {} as Record<Locale, string[]>;
  for (const locale of LOCALES) {
    const pages = SITE_PAGES.filter((p) => p.locales.includes(locale)).map((p) => p.path);
    const posts = getPosts(locale).map((post) => `/blog/${post.slug}`);
    result[locale] = [...pages, ...(posts.length ? ['/blog'] : []), ...posts];
  }
  return result;
}

// Languages the blog index exists in: any language with at least one post.
export function blogLocales(): Locale[] {
  return LOCALES.filter((locale) => getAllPosts().some((post) => post.locale === locale));
}
