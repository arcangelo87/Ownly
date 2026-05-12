import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export default function AboutPage() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl max-w-2xl">
          <span className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-accent)] mb-5">
            {t('hero.eyebrow')}
          </span>
          <h1 className="font-[family-name:var(--font-serif)] text-[40px] md:text-[52px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
            {t('hero.h1')}
          </h1>
          <p className="text-[17px] text-[var(--color-muted)] leading-[1.65] max-w-[520px]">
            <strong className="text-[var(--color-text)] font-normal">{t('hero.subBold')}</strong>{' '}
            {t('hero.subRest')}
          </p>
        </div>
      </section>

      {/* ── Why Bottega ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-6">
                {t('why.heading')}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-4">
                {t('why.prose1')}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
                {t('why.prose2')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {([
                [t('why.stat1Value'), t('why.stat1Label')],
                [t('why.stat2Value'), t('why.stat2Label')],
                [t('why.stat3Value'), t('why.stat3Label')],
              ] as [string, string][]).map(([value, label]) => (
                <div key={value} className="flex flex-col gap-2">
                  <span className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)] tracking-[-0.01em]">
                    {value}
                  </span>
                  <span className="text-[13px] text-[var(--color-muted)] leading-[1.4]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── For Brokers ── */}
      <section className="py-16 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-serif)] text-[24px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-3">
              {t('brokers.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.65] mb-5">
              {t('brokers.body')}
            </p>
            <Link
              href={`/${locale}/brokers`}
              className="text-[14px] font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
            >
              {t('brokers.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <CtaBanner
        heading={t('cta.heading')}
        subheading={t('cta.sub')}
        ctaLabel={t('cta.button')}
        ctaHref={`/${locale}/sell`}
      />
    </>
  );
}
