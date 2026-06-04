'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function FaqAccordion() {
  const t = useTranslations('waitlist');
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
  ];

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
            aria-expanded={open === i}
          >
            <span className="text-[16px] font-[family-name:var(--font-serif)] text-[var(--color-text)]">
              {item.q}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`shrink-0 text-[var(--color-muted)] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <path d="M3 6l5 5 5-5" />
            </svg>
          </button>
          {open === i && (
            <p className="pb-5 text-[15px] text-[var(--color-muted)] leading-[1.65]">
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
