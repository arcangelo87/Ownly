import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAllPosts, postLocales } from '@/lib/blog';
import { blogLocales, hreflangs, pageUrl } from '@/lib/seo/metadata';
import { SITE_PAGES } from '@/lib/seo/pages';

export const revalidate = 3600;

// Never publish a lastModified in the future.
function notAfterNow(date: Date): Date {
  return new Date(Math.min(date.getTime(), Date.now()));
}

// Built from SITE_PAGES, the markdown posts in content/blog and live deals.
// Nothing to edit here when a page or post is added.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageEntries: MetadataRoute.Sitemap = SITE_PAGES.filter((page) => !page.experiment).flatMap(
    ({ path, locales, priority, changeFrequency }) =>
      locales.map((locale) => ({
        url: pageUrl(locale, path),
        changeFrequency,
        priority,
        alternates: { languages: hreflangs(path, locales) },
      })),
  );

  const blogIndexEntries: MetadataRoute.Sitemap = blogLocales().map((locale) => ({
    url: pageUrl(locale, '/blog'),
    changeFrequency: 'weekly',
    priority: 0.6,
    alternates: { languages: hreflangs('/blog', blogLocales()) },
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts()
    .filter((post) => !post.noindex)
    .map((post) => {
      const path = `/blog/${post.slug}`;
      return {
        url: pageUrl(post.locale, path),
        lastModified: notAfterNow(new Date(`${post.date}T00:00:00Z`)),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: hreflangs(path, postLocales(post.slug)) },
      };
    });

  const admin = createAdminClient();
  const { data: listings } = await admin
    .from('listings')
    .select('slug, created_at')
    .eq('status', 'live')
    .is('deleted_at', null)
    .not('slug', 'is', null);

  const dealEntries: MetadataRoute.Sitemap = (listings ?? []).map((listing) => ({
    url: pageUrl('en', `/deals/${listing.slug}`),
    lastModified: listing.created_at ? notAfterNow(new Date(listing.created_at)) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: hreflangs(`/deals/${listing.slug}`, ['en']) },
  }));

  return [...pageEntries, ...blogIndexEntries, ...postEntries, ...dealEntries];
}
