'use client';

import { useLocale } from 'next-intl';
import { recordDealAccessClick } from '@/app/actions/deal-access';

interface ManagedSearchLinkProps {
  label: string;
}

// Records the click, then sends the buyer to the strategic buyers mandate form.
export function ManagedSearchLink({ label }: ManagedSearchLinkProps) {
  const locale = useLocale();
  const href = `/${locale}/institutional-buy-side#enquiry`;

  async function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      void recordDealAccessClick('managed');
      return;
    }
    e.preventDefault();
    await Promise.race([
      recordDealAccessClick('managed').catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 800)),
    ]);
    window.location.href = href;
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="inline-flex justify-center items-center px-9 py-4 border border-[var(--color-text)] text-[var(--color-text)] text-[16px] font-bold rounded-full hover:bg-[var(--color-text)] hover:text-white transition-colors"
    >
      {label}
    </a>
  );
}
