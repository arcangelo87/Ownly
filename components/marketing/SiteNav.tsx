'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';

export function SiteNav() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/buyers`, label: t('buyers') },
    { href: `/${locale}/deals`, label: t('browse') },
    { href: `/${locale}/about`, label: t('about') },
  ];

  return (
    <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)] relative z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-8">
        <Link href={`/${locale}`} className="shrink-0" onClick={() => setOpen(false)}>
          <Logo width={108} />
        </Link>

        <div className="hidden md:flex items-center gap-4 ml-auto shrink-0">
          <LocaleSwitcher />
          <Link
            href={`/${locale}/sell`}
            className="inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white text-[13px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {t('getStarted')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 -mr-2 text-[var(--color-text)]"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 pb-6 pt-4 flex flex-col gap-1">
          {links.filter(l => !l.href.endsWith('/about')).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="py-3 text-[16px] text-[var(--color-text)] border-b border-[var(--color-border)] last:border-b-0"
            >
              {label}
            </Link>
          ))}
          <Link
            href={`/${locale}/sell`}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex justify-center items-center px-4 py-3 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {t('getStarted')}
          </Link>
          <div className="mt-4 flex justify-center">
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </nav>
  );
}
