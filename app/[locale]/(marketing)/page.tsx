import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';
import { PricingCard } from '@/components/marketing/PricingCard';
import { DealCardStack } from '@/components/marketing/DealCardStack';
import { DealCardStackLoader } from '@/components/marketing/DealCardStackLoader';
import { TwoColumnTable } from '@/components/marketing/TwoColumnTable';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const t = useTranslations('sellers');
  const locale = useLocale();

  const freeHeroFeatures = [
    t('whatYouGet.free1'),
    t('whatYouGet.free2'),
  ];

  const freeFeatures = [
    t('whatYouGet.free5'),
  ];

  const assistedHeroFeatures = [
    t('whatYouGet.assistedHero1'),
    t('whatYouGet.assistedHero2'),
    t('whatYouGet.assistedHero3'),
  ];

  const assistedFeatures = [
    t('whatYouGet.assisted1'),
    t('whatYouGet.assisted2'),
    t('whatYouGet.assisted3'),
  ];

  const bespokeheroFeatures = [
    t('whatYouGet.whiteGloveHero1'),
    t('whatYouGet.whiteGloveHero2'),
  ];

  const bespokeFeatures = [
    t('whatYouGet.whiteGlove1'),
    t('whatYouGet.whiteGlove2'),
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-[44px] md:text-[56px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-5">
              {t('hero.h1')}
            </h1>
            <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-3">
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
          <div className="flex justify-center">
            <Suspense fallback={<DealCardStack />}>
              <DealCardStackLoader />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── Problem cards ── */}
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

      {/* ── What you get / Pricing ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('whatYouGet.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              heading={t('whatYouGet.freeHeading')}
              tagline={t('whatYouGet.freeTagline')}
              price={t('whatYouGet.freePrice')}
              heroFeatures={freeHeroFeatures}
              features={freeFeatures}
              ctaLabel={t('whatYouGet.freeCta')}
              ctaHref={`/${locale}/sell`}
            />
            <PricingCard
              heading={t('whatYouGet.assistedHeading')}
              tagline={t('whatYouGet.assistedTagline')}
              badge={t('whatYouGet.assistedBadge')}
              price={t('whatYouGet.assistedPrice')}
              priceStrike={t('whatYouGet.assistedPriceStrike')}
              priceNote={t('whatYouGet.assistedNote')}
              heroFeatures={assistedHeroFeatures}
              features={assistedFeatures}
              ctaLabel={t('whatYouGet.assistedCta')}
              ctaHref={`/${locale}/sell`}
              highlight
            />
            <PricingCard
              heading={t('whatYouGet.whiteGloveHeading')}
              tagline={t('whatYouGet.whiteGloveTagline')}
              price={t('whatYouGet.whiteGlovePrice')}
              heroFeatures={bespokeheroFeatures}
              features={bespokeFeatures}
              ctaLabel={t('whatYouGet.whiteGloveCta')}
              ctaHref={`/${locale}/sell`}
              muted
            />
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

      {/* ── Customer quotes ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('quotes.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {([
              /* REPLACE WITH REAL QUOTE */
              [t('quotes.quote1Text'), t('quotes.quote1Name'), t('quotes.quote1Meta')],
              /* REPLACE WITH REAL QUOTE */
              [t('quotes.quote2Text'), t('quotes.quote2Name'), t('quotes.quote2Meta')],
              /* REPLACE WITH REAL QUOTE */
              [t('quotes.quote3Text'), t('quotes.quote3Name'), t('quotes.quote3Meta')],
              /* REPLACE WITH REAL QUOTE */
              [t('quotes.quote4Text'), t('quotes.quote4Name'), t('quotes.quote4Meta')],
            ] as [string, string, string][]).map(([quote, name, meta]) => (
              <div
                key={name}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-8 flex flex-col gap-6"
              >
                <p className="font-[family-name:var(--font-serif)] text-[18px] italic leading-[1.6] text-[var(--color-text)]">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <p className="text-[14px] font-medium text-[var(--color-text)]">{name}</p>
                  <p className="text-[13px] text-[var(--color-muted)]">{meta}</p>
                </div>
              </div>
            ))}
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
