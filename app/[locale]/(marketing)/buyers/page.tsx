import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { FeatureRow } from '@/components/marketing/FeatureRow';
import { FoundingForm } from '@/components/marketing/FoundingForm';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export default function BuyersPage() {
  const t = useTranslations('buyers');
  const locale = useLocale();

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[40px] md:text-[52px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
            {t('hero.h1')}
          </h1>
          <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[560px]">
            {t('hero.sub')}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href={`/${locale}/deals`}
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
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-6">
              {t('problem.heading')}
            </h2>
            <p className="text-[16px] text-[var(--color-muted)] leading-[1.7] mb-4">
              {t('problem.prose1')}
            </p>
            <p className="text-[16px] text-[var(--color-muted)] leading-[1.7] mb-4">
              {t('problem.prose2')}
            </p>
            <p className="text-[16px] text-[var(--color-muted)] leading-[1.7]">
              {t('problem.prose3')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              [t('problem.pain1Quote'), t('problem.pain1Desc')],
              [t('problem.pain2Quote'), t('problem.pain2Desc')],
              [t('problem.pain3Quote'), t('problem.pain3Desc')],
            ] as [string, string][]).map(([quote, desc]) => (
              <div key={quote} className="flex flex-col gap-3">
                <p className="font-[family-name:var(--font-serif)] text-[17px] font-semibold text-[var(--color-text)] leading-[1.4]">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{desc}</p>
              </div>
            ))}
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

      {/* ── Access model ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-4">
                {t('access.heading')}
              </h2>
              <p className="text-[16px] text-[var(--color-muted)] leading-[1.7]">
                {t('access.prose')}
              </p>
            </div>
            <div className="border border-[var(--color-border)] rounded-[8px] overflow-hidden">
              <div className="grid grid-cols-2 bg-[var(--color-bg)] px-5 py-3 border-b border-[var(--color-border)]">
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-muted)]">
                  {t('access.col1')}
                </span>
                <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-muted)]">
                  {t('access.col2')}
                </span>
              </div>
              {([
                [t('access.row1Feature'), t('access.row1Value'), true],
                [t('access.row2Feature'), t('access.row2Value'), true],
                [t('access.row3Feature'), t('access.row3Value'), true],
                [t('access.row4Feature'), t('access.row4Value'), false],
                [t('access.row5Feature'), t('access.row5Value'), false],
                [t('access.row6Feature'), t('access.row6Value'), false],
              ] as [string, string, boolean][]).map(([feature, value, isAvailable]) => (
                <div
                  key={feature}
                  className="grid grid-cols-2 px-5 py-3 border-b border-[var(--color-border)] last:border-b-0 bg-white"
                >
                  <span className="text-[14px] text-[var(--color-text)]">{feature}</span>
                  <span
                    className={`text-[14px] font-medium ${isAvailable ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Founding Programme ── */}
      <section id="founding" className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-4">
                {t('founding.heading')}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-4">
                {t('founding.prose1')}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
                {t('founding.prose2')}
              </p>
            </div>
            <div>
              <FoundingForm
                type="buyer"
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

      {/* ── Footer CTA ── */}
      <CtaBanner
        heading={t('cta.heading')}
        subheading={t('cta.supporting')}
        ctaLabel={t('cta.button')}
        ctaHref={`/${locale}/deals`}
      />
    </>
  );
}
