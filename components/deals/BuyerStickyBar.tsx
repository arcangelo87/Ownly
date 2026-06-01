'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface BuyerStickyBarProps {
  locale: string;
}

export function BuyerStickyBar({ locale }: BuyerStickyBarProps) {
  const t = useTranslations('deals.browse.buyerStickyBar');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-white px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[var(--color-text)] leading-[1.3]">
            {t('heading')}
          </p>
          <p className="mt-0.5 text-[13px] text-[var(--color-muted)] leading-[1.5] hidden sm:block">
            {t('body')}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`/${locale}/buyers#founding`}
            className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t('cta')}
          </a>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
