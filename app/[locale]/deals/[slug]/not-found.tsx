import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function DealNotFound() {
  const t = await getTranslations('deals.notFound');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="max-w-sm text-center">
        <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em]">{t('title')}</h1>
        <p className="mt-3 text-[14px] leading-[1.65] text-[var(--color-muted)]">{t('body')}</p>
        <Link
          href="/"
          className="mt-6 inline-block text-[13px] font-medium text-[var(--color-accent)] hover:underline"
        >
          {t('cta')}
        </Link>
      </div>
    </div>
  );
}
