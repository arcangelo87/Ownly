import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';
import { PricingCard } from '@/components/marketing/PricingCard';
import { DealCardStack } from '@/components/marketing/DealCardStack';
import { DealCardStackLoader } from '@/components/marketing/DealCardStackLoader';
import { TwoColumnTable } from '@/components/marketing/TwoColumnTable';
import { CtaBanner } from '@/components/marketing/CtaBanner';

export const dynamic = 'force-dynamic';

export default function SellYourBusinessPage() {
  const t = useTranslations('sellers');
  const locale = useLocale();

  const freeHeroFeatures = [
    t('whatYouGet.free1'),
    t('whatYouGet.free2'),
  ];

  const freeFeatures = [
    t('whatYouGet.free5'),
  ];

  const bespokeheroFeatures = [
    t('whatYouGet.whiteGloveHero1'),
    t('whatYouGet.whiteGloveHero2'),
  ];

  const bespokeFeatures = [
    t('whatYouGet.whiteGlove1'),
    t('whatYouGet.whiteGlove2'),
  ];

  const problemIcons = [
    /* "How do I explain my business to a stranger?" — document/presentation */
    <svg key="explain" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="3" width="20" height="26" rx="2" />
      <line x1="11" y1="10" x2="21" y2="10" />
      <line x1="11" y1="15" x2="21" y2="15" />
      <line x1="11" y1="20" x2="17" y2="20" />
    </svg>,
    /* "Where do serious buyers actually look?" — magnifying glass */
    <svg key="buyers" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="14" cy="14" r="8" />
      <line x1="20" y1="20" x2="27" y2="27" />
    </svg>,
    /* "What if my staff find out before I'm ready?" — shield */
    <svg key="privacy" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 3L5 8v9c0 7 5.5 13.5 11 15 5.5-1.5 11-8 11-15V8L16 3z" />
      <line x1="16" y1="13" x2="16" y2="19" />
      <circle cx="16" cy="22" r="1" fill="currentColor" stroke="none" />
    </svg>,
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
            <div className="flex items-center gap-5 flex-wrap">
              <Link
                href={`/${locale}/sell`}
                className="inline-flex items-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
              >
                {t('hero.cta')}
              </Link>
            </div>
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
            ] as [string, string][]).map(([title, body], i) => (
              <div
                key={title}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[8px] p-6"
              >
                <div className="text-[var(--color-accent)] mb-4">{problemIcons[i]}</div>
                <h3 className="font-[family-name:var(--font-serif)] text-[18px] font-semibold text-[var(--color-text)] mb-3">
                  {title}
                </h3>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{body}</p>
              </div>
            ))}
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
              col1Icon={
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <ellipse cx="11" cy="11" rx="9" ry="5.5" />
                  <circle cx="11" cy="11" r="2.5" />
                </svg>
              }
              col2Icon={
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="5" y="10" width="12" height="9" rx="2" />
                  <path d="M8 10V7a3 3 0 0 1 6 0v3" />
                  <circle cx="11" cy="14.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              }
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
              [t('quotes.quote1Text'), t('quotes.quote1Name'), t('quotes.quote1Meta')],
              [t('quotes.quote2Text'), t('quotes.quote2Name'), t('quotes.quote2Meta')],
              [t('quotes.quote3Text'), t('quotes.quote3Name'), t('quotes.quote3Meta')],
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

      {/* ── What you get / Pricing ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
            {t('whatYouGet.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              heading={t('whatYouGet.whiteGloveHeading')}
              tagline={t('whatYouGet.whiteGloveTagline')}
              price={t('whatYouGet.whiteGlovePrice')}
              heroFeatures={bespokeheroFeatures}
              features={bespokeFeatures}
              ctaLabel={t('whatYouGet.whiteGloveCta')}
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
