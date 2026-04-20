'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ locale }: { locale: string }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
    >
      Sign out
    </button>
  );
}
