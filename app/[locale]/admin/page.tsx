import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ListingsTable } from '@/components/admin/ListingsTable';
import { SignOutButton } from '@/components/admin/SignOutButton';
import type { Listing } from '@/types';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/${locale}/admin/login`);

  const admin = createAdminClient();
  const { data: listings } = await admin
    .from('listings')
    .select('id, created_at, updated_at, deleted_at, status, business_name, country, region, sector, year_founded, seller_email, seller_phone, revenue_range, ebitda_margin, employee_count, asking_price, partial_sale, timeline, reasons_for_sale, business_description, strongest_point, buyer_disclosure, slug, title, about, highlights')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="sticky top-0 z-10 border-b border-[var(--color-border)] bg-[var(--color-bg)] px-8 py-4">
        <div className="flex items-center justify-between" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="font-serif text-[20px] font-semibold tracking-[-0.02em]">Ownly</span>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[var(--color-muted)]">{user.email}</span>
            <SignOutButton locale={locale} />
          </div>
        </div>
      </header>

      <main className="px-8 py-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="font-serif text-[24px] font-medium tracking-[-0.02em]">Listings</h1>
          <span className="text-sm text-[var(--color-muted)]">
            {listings?.length ?? 0} total
          </span>
        </div>
        <ListingsTable initialListings={(listings ?? []) as Listing[]} />
      </main>
    </div>
  );
}
