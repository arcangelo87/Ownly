'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { HOME_URL, type Locale } from '@/lib/seo/pages';

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

// Plain links to the same page in the other language, or to that language's
// home when the page has no version there. The URL alone decides the language.
export function LanguageSwitcher({ available }: { available: Record<Locale, string[]> }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  // The EN homepage is also served at /en/institutional-buy-side
  const path = pathname === '/' || pathname === '/institutional-buy-side' ? '' : pathname.replace(/\/$/, '');

  const hrefFor = (target: Locale) => {
    if (!available[target].includes(path)) return HOME_URL[target];
    return target === 'en' && path === '' ? '/' : `/${target}${path}`;
  };

  return (
    <nav aria-label={t('language')} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em]">
      {OPTIONS.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-[var(--color-border)]">|</span>}
          {code === locale ? (
            <span aria-current="true" className="text-[var(--color-text)]">{label}</span>
          ) : (
            <Link
              href={hrefFor(code)}
              hrefLang={code === 'pt' ? 'pt-PT' : 'en'}
              prefetch={false}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
