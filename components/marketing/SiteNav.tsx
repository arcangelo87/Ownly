import { SiteNavClient } from '@/components/marketing/SiteNavClient';
import { availablePaths } from '@/lib/seo/metadata';

export function SiteNav() {
  return <SiteNavClient available={availablePaths()} />;
}
