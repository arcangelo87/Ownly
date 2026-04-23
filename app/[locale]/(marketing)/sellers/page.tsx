import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { StepList } from '@/components/marketing/StepList';
import { PricingCard } from '@/components/marketing/PricingCard';
import { TwoColumnTable } from '@/components/marketing/TwoColumnTable';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export default function SellersPage() {
  const t = useTranslations('sellers');
  const locale = useLocale();

  const howSteps = [
    { label: t('howItWorks.step1Label'), description: t('howItWorks.step1Desc') },
    { label: t('howItWorks.step2Label'), description: t('howItWorks.step2Desc') },
    { label: t('howItWorks.step3Label'), description: t('howItWorks.step3Desc') },
    { label: t('howItWorks.step4Label'), description: t('howItWorks.step4Desc') },
  ];

  const freeFeatures = [
    t('whatYouGet.free1'),
    t('whatYouGet.free2'),
    t('whatYouGet.free3'),
    t('whatYouGet.free4'),
    t('whatYouGet.free5'),
  ];

  const assistedFeatures = [
    t('whatYouGet.assisted1'),
    t('whatYouGet.assisted2'),
    t('whatYouGet.assisted3'),
    t('whatYouGet.assisted4'),
    t('whatYouGet.assisted5'),
    t('whatYouGet.assisted6'),
    t('whatYouGet.assisted7'),
    t('whatYouGet.assisted8'),
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[44px] md:text-[56px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
            {t('hero.h1')}
          </h1>
          <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-3 max-w-[560px]">
            {t('hero.sub')}
          </p>
          <p className="text-[14px] text-[var(--color-muted)] mb-8">{t('hero.supporting')}</p>
          <Link
            href={`/${locale}/sell`}
            className="inline-flex items-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('problem.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {([
              [t('problem.card1Title'), t('problem.card1Body')],
              [t('problem.card2Title'), t('problem.card2Body')],
              [t('problem.card3Title'), t('problem.card3Body')],
            ] as [string, string][]).map(([title, body]) => (
              <div
                key={title}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[8px] p-6"
              >
                <h3 className="font-[family-name:var(--font-serif)] text-[18px] font-semibold text-[var(--color-text)] mb-3">
                  {title}
                </h3>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('whatYouGet.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <PricingCard
              heading={t('whatYouGet.freeHeading')}
              price={t('whatYouGet.freePrice')}
              features={freeFeatures}
              ctaLabel={t('whatYouGet.freeCta')}
              ctaHref={`/${locale}/sell`}
            />
            <PricingCard
              heading={t('whatYouGet.assistedHeading')}
              badge={t('whatYouGet.assistedBadge')}
              price={t('whatYouGet.assistedPrice')}
              priceStrike={t('whatYouGet.assistedPriceStrike')}
              priceNote={t('whatYouGet.assistedNote')}
              features={assistedFeatures}
              ctaLabel={t('whatYouGet.assistedCta')}
              ctaHref={`/${locale}/contact`}
              highlight
            />
          </div>
          <div className="border border-[var(--color-border)] rounded-[8px] p-6 bg-[var(--color-surface)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-[18px] font-semibold text-[var(--color-text)] mb-1">
                  {t('whatYouGet.whiteGloveHeading')}
                </h3>
                <p className="text-[14px] text-[var(--color-muted)]">{t('whatYouGet.whiteGlovePrice')}</p>
                <p className="text-[14px] text-[var(--color-muted)] mt-1 leading-[1.5]">
                  {t('whatYouGet.whiteGloveBody')}
                </p>
              </div>
              <Link
                href={`/${locale}/contact`}
                className="shrink-0 text-[14px] font-medium text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                {t('whatYouGet.whiteGloveCta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            <div>
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-6">
                {t('privacy.heading')}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-4">
                {t('privacy.prose1')}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">
                {t('privacy.prose2')}
              </p>
            </div>
            <TwoColumnTable
              col1Heading={t('privacy.publicHeading')}
              col2Heading={t('privacy.protectedHeading')}
              col1Items={[
                t('privacy.public1'),
                t('privacy.public2'),
                t('privacy.public3'),
                t('privacy.public4'),
                t('privacy.public5'),
              ]}
              col2Items={[
                t('privacy.protected1'),
                t('privacy.protected2'),
                t('privacy.protected3'),
                t('privacy.protected4'),
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('howItWorks.heading')}
          </h2>
          <StepList steps={howSteps} />
          <p className="mt-10 text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[560px]">
            {t('howItWorks.reassurance')}
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('pricing.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PricingCard
              heading={t('whatYouGet.freeHeading')}
              price={t('whatYouGet.freePrice')}
              features={freeFeatures}
              ctaLabel={t('whatYouGet.freeCta')}
              ctaHref={`/${locale}/sell`}
            />
            <PricingCard
              heading={t('whatYouGet.assistedHeading')}
              badge={t('whatYouGet.assistedBadge')}
              price={t('whatYouGet.assistedPrice')}
              priceStrike={t('whatYouGet.assistedPriceStrike')}
              priceNote={t('whatYouGet.assistedNote')}
              features={assistedFeatures}
              ctaLabel={t('whatYouGet.assistedCta')}
              ctaHref={`/${locale}/contact`}
              highlight
            />
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <CtaBanner
        heading={t('cta.heading')}
        subheading={t('cta.supporting')}
        ctaLabel={t('cta.button')}
        ctaHref={`/${locale}/sell`}
      />
    </>
  );
}
