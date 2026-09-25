import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/site';
import { INDEXED_PAGES } from '@/lib/seo/pages';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const admin = createAdminClient();

  const { data: listings } = await admin
    .from('listings')
    .select('slug, created_at')
    .eq('status', 'live')
    .is('deleted_at', null)
    .not('slug', 'is', null);

  const staticEntries: MetadataRoute.Sitemap = INDEXED_PAGES.map(
    ({ path, priority, changeFrequency, locales }) => {
      const url = path === '' ? `${SITE_URL}/` : `${SITE_URL}/en${path}`;
      const languages =
        locales.length > 1
          ? Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
          : undefined;
      return { url, changeFrequency, priority, alternates: languages && { languages } };
    },
  );

  const dealEntries: MetadataRoute.Sitemap = (listings ?? []).map((listing) => ({
    url: `${SITE_URL}/en/deals/${listing.slug}`,
    lastModified: listing.created_at ? new Date(listing.created_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...dealEntries];
}
