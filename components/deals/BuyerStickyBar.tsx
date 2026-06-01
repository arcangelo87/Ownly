'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface BuyerStickyBarProps {
  locale: string;
}

export function BuyerStickyBar({ locale }: BuyerStickyBarProps) {
  const t = useTranslations('deals.browse.buyerStickyBar');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem('buyerBarDismissed') === '1',
  );

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed) setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const dismiss = () => {
    sessionStorage.setItem('buyerBarDismissed', '1');
    setDismissed(true);
  };

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-white px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-[var(--color-text)] leading-[1.3]">
            {t('heading')}
          </p>
          <p className="mt-1 text-[14px] text-[var(--color-muted)] leading-[1.5] hidden sm:block">
            {t('body')}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`/${locale}/buy`}
            className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-6 py-3 text-[14px] font-medium text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t('cta')}
          </a>
          <button
            onClick={dismiss}
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
