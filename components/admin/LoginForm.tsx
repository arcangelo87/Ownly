'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm outline-none focus:border-[var(--color-text)]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm outline-none focus:border-[var(--color-text)]"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-[6px] bg-[var(--color-accent)] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-[0.88] disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
