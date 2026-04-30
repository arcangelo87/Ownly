import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { FeatureRow } from '@/components/marketing/FeatureRow';
import { FoundingForm } from '@/components/marketing/FoundingForm';

export default function BrokersPage() {
  const t = useTranslations('brokers');
  const locale = useLocale();

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[44px] md:text-[56px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
            {t('hero.h1')}
          </h1>
          <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[560px]">
            {t('hero.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href={`/${locale}/sell`}
              className="inline-flex items-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
            >
              {t('hero.cta')}
            </Link>
            <a
              href="#founding"
              className="text-[14px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl max-w-3xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {t('problem.heading')}
          </h2>
          <div className="text-[16px] text-[var(--color-muted)] leading-[1.7] whitespace-pre-line">
            {t('problem.prose')}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-8">
            {t('features.heading')}
          </h2>
          <div className="flex flex-col">
            <FeatureRow label={t('features.feat1Label')} description={t('features.feat1Desc')} />
            <FeatureRow label={t('features.feat2Label')} description={t('features.feat2Desc')} />
            <FeatureRow label={t('features.feat3Label')} description={t('features.feat3Desc')} />
            <FeatureRow label={t('features.feat4Label')} description={t('features.feat4Desc')} />
          </div>
        </div>
      </section>

      {/* ── Not a broker ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl max-w-3xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {t('notABroker.heading')}
          </h2>
          <p className="text-[16px] text-[var(--color-muted)] leading-[1.7] mb-4">
            {t('notABroker.prose1')}
          </p>
          <p className="text-[16px] text-[var(--color-muted)] leading-[1.7]">
            {t('notABroker.prose2')}
          </p>
        </div>
      </section>

      {/* ── Founding Programme ── */}
      <section id="founding" className="py-20 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-4">
                {t('founding.heading')}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
                {t('founding.prose')}
              </p>
            </div>
            <div>
              <FoundingForm
                type="broker"
                namePlaceholder={t('founding.namePlaceholder')}
                emailPlaceholder={t('founding.emailPlaceholder')}
                phonePlaceholder={t('founding.phonePlaceholder')}
                messagePlaceholder={t('founding.messagePlaceholder')}
                submitLabel={t('founding.submit')}
              />
              <p className="mt-4 text-[12px] text-[var(--color-muted)]">{t('founding.after')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
