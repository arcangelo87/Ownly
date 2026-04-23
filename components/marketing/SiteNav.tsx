'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Logo } from '@/components/ui/Logo';

export function SiteNav() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-8">
        <Link href={`/${locale}`} className="shrink-0">
          <Logo width={108} />
        </Link>

        <ul className="hidden md:flex items-center gap-7 flex-1 justify-center list-none">
          <li>
            <Link
              href={`/${locale}/sellers`}
              className="text-[14px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t('sell')}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/brokers`}
              className="text-[14px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t('brokers')}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/deals`}
              className="text-[14px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t('browse')}
            </Link>
          </li>
        </ul>

        <Link
          href={`/${locale}/sell`}
          className="ml-auto shrink-0 inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white text-[13px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
        >
          {t('getStarted')}
        </Link>
      </div>
    </nav>
  );
}
