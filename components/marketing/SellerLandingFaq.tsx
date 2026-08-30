'use client';

import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export function SellerLandingFaq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
            aria-expanded={open === i}
          >
            <span className="font-[family-name:var(--font-serif)] text-[18px] text-[var(--color-text)]">
              {item.q}
            </span>
            <span className="shrink-0 text-[var(--color-muted)] text-[18px]" aria-hidden="true">
              {open === i ? '∧' : '∨'}
            </span>
          </button>
          {open === i && (
            <p className="pb-5 text-[15px] text-[var(--color-muted)] leading-[1.7]">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
