import type { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

const STATIC_PATHS = [
  { path: '', priority: 1 },
  { path: '/deals', priority: 0.9 },
  { path: '/buy', priority: 0.7 },
  { path: '/sell', priority: 0.7 },
  { path: '/about', priority: 0.5 },
  { path: '/contact', priority: 0.5 },
  { path: '/brokers', priority: 0.5 },
  { path: '/privacy', priority: 0.2 },
  { path: '/terms', priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const admin = createAdminClient();

  const { data: listings } = await admin
    .from('listings')
    .select('slug, created_at')
    .eq('status', 'live')
    .is('deleted_at', null)
    .not('slug', 'is', null);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(({ path, priority }) => ({
    url: `${SITE_URL}/en${path}`,
    changeFrequency: path === '/deals' ? 'daily' : 'monthly',
    priority,
  }));

  const dealEntries: MetadataRoute.Sitemap = (listings ?? []).map((listing) => ({
    url: `${SITE_URL}/en/deals/${listing.slug}`,
    lastModified: listing.created_at ? new Date(listing.created_at) : undefined,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...dealEntries];
}
