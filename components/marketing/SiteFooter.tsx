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

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
            <Link href={`/${locale}/sellers`} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              {t('sell')}
            </Link>
            <Link href={`/${locale}/brokers`} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              {t('brokers')}
            </Link>
            <Link href={`/${locale}/buyers`} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              {t('buyers')}
            </Link>
            <Link href={`/${locale}/deals`} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
              {t('browse')}
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-[var(--color-muted)]">
          <span>{t('copyright')}</span>
          <div className="flex gap-5">
            <Link href={`/${locale}/privacy`} className="hover:text-[var(--color-text)] transition-colors">
              {t('privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-[var(--color-text)] transition-colors">
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
