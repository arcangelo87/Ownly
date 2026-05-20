'use client';

import { useState, useTransition } from 'react';
import { backfillMissingTranslations } from '@/app/actions/admin';

export function BackfillTranslationsButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ translated: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setResult(null);
    setError(null);
    startTransition(async () => {
      try {
        const res = await backfillMissingTranslations();
        setResult(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded bg-[var(--color-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--color-text)] transition-opacity hover:opacity-70 disabled:opacity-40"
      >
        {pending ? 'Translating…' : 'Translate missing listings'}
      </button>
      {result !== null && !pending && (
        <span className="text-[12px] text-[var(--color-muted)]">
          {result.translated === 0
            ? 'All translations up to date'
            : `Translated ${result.translated} listing${result.translated !== 1 ? 's' : ''}${result.failed > 0 ? ` (${result.failed} failed)` : ''}`}
        </span>
      )}
      {error && !pending && (
        <span className="text-[12px] text-red-600">{error}</span>
      )}
    </div>
  );
}
