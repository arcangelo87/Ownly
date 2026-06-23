import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Logo } from '@/components/ui/Logo';

export function SiteFooter() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16">
          <div className="shrink-0">
            <Link href={`/${locale}`}>
              <Logo width={100} />
            </Link>
            <p className="mt-3 text-[13px] text-[var(--color-muted)] max-w-[200px]">
              {t('tagline')}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-[13px]">
            <Link href={`/${locale}/deals`} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              {t('browse')}
            </Link>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-[var(--color-muted)]">
          <span>{t('copyright')}</span>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}/privacy`} className="hover:text-[var(--color-text)] transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-[var(--color-text)] transition-colors">
              {t('terms')}
            </Link>
            <a
              href="https://www.linkedin.com/in/arcangelo-passaro-280b8048/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('linkedin')}
              className="hover:text-[var(--color-text)] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.56V9h3.554v11.452z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
