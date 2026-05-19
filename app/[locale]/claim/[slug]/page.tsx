import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { SiteNav } from '@/components/marketing/SiteNav';
import { createAdminClient } from '@/lib/supabase/admin';
import { ClaimForm } from '@/components/claim/ClaimForm';

export const dynamic = 'force-dynamic';

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations('claim');

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from('listings')
    .select('business_name, title')
    .eq('slug', slug)
    .eq('status', 'live')
    .is('deleted_at', null)
    .maybeSingle();

  if (!listing) notFound();

  const displayName = listing.business_name ?? listing.title ?? slug;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <SiteNav />

      <main style={{ maxWidth: '480px', margin: '0 auto' }} className="px-6 py-16">
        <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em]">
          {t('title')}
        </h1>
        <p className="mt-2 text-[14px] leading-[1.7] text-[var(--color-muted)]">
          {displayName}
        </p>
        <p className="mt-4 text-[14px] leading-[1.7] text-[var(--color-text)]">
          {t('intro')}
        </p>

        <div className="mt-8">
          <ClaimForm slug={slug} />
        </div>
      </main>
    </div>
  );
}
