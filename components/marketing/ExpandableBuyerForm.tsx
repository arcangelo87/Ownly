'use client';

import { useState } from 'react';
import { BuyerSearchFormEmbed } from '@/components/buyer/BuyerSearchFormEmbed';

interface ExpandableBuyerFormProps {
  ctaLabel: string;
  note?: string;
}

export function ExpandableBuyerForm({ ctaLabel, note }: ExpandableBuyerFormProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </button>
        {note && <p className="mt-4 text-[13px] text-[var(--color-muted)]">{note}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-8 text-left md:px-10 md:py-10">
      <BuyerSearchFormEmbed />
    </div>
  );
}
