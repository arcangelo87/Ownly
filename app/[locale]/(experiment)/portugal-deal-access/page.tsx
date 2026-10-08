import { useTranslations } from 'next-intl';
import { FeatureRow } from '@/components/marketing/FeatureRow';
import { AccessCta } from '@/components/deal-access/AccessCta';
import { NOINDEX } from '@/lib/seo/pages';

export const metadata = { ...NOINDEX, title: 'Off-market businesses in Portugal' };

export default function DealAccessPage() {
  const t = useTranslations('dealAccess');

  const benefits = [
    { label: t('benefits.item1Label'), description: t('benefits.item1Desc') },
    { label: t('benefits.item2Label'), description: t('benefits.item2Desc') },
    { label: t('benefits.item3Label'), description: t('benefits.item3Desc') },
    { label: t('benefits.item4Label'), description: t('benefits.item4Desc') },
  ];

  const tiers = [
    { tier: 'single', name: t('pricing.singleName'), price: t('pricing.singlePrice'), desc: t('pricing.singleDesc'), best: t('pricing.singleBest') },
    { tier: 'all', name: t('pricing.allName'), price: t('pricing.allPrice'), desc: t('pricing.allDesc'), best: t('pricing.allBest') },
  ] as const;

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-20 md:py-28 px-6 text-center bg-[var(--color-surface)]">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {t('hero.h1')}
          </h1>
          <p className="text-[16px] md:text-[17px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[560px] mx-auto">
            {t('hero.sub')}
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </a>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('problem.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-8" />
          <p className="text-[16px] text-[var(--color-muted)] leading-[1.7]">{t('problem.body')}</p>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-4">
            <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
              {t('benefits.heading')}
            </h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-6" />
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.6]">{t('benefits.intro')}</p>
          </div>
          <div>
            {benefits.map(({ label, description }) => (
              <FeatureRow key={label} label={label} description={description} />
            ))}
          </div>
          <p className="mt-6 text-center text-[14px] text-[var(--color-muted)] leading-[1.6]">{t('benefits.outro')}</p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 md:py-20 px-6 scroll-mt-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
              {t('pricing.heading')}
            </h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(({ tier, name, price, desc, best }) => (
              <div
                key={tier}
                className="flex flex-col bg-white border border-[var(--color-border)] rounded-[8px] p-8"
              >
                <h3 className="text-[15px] font-semibold text-[var(--color-text)] mb-3">{name}</h3>
                <p className="mb-5">
                  <span className="font-[family-name:var(--font-serif)] text-[40px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
                    {price}
                  </span>
                  <span className="ml-2 text-[14px] text-[var(--color-muted)]">/ {t('pricing.period')}</span>
                </p>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] mb-4">{desc}</p>
                <p className="text-[14px] font-medium text-[var(--color-text)] leading-[1.6] mb-8">{best}</p>
                <div className="mt-auto">
                  <AccessCta tier={tier} label={t('pricing.cta')} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-[var(--color-muted)]">{t('pricing.note')}</p>
        </div>
      </section>

      {/* ── Managed service ── */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[24px] md:text-[28px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('managed.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-6" />
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-8">{t('managed.body')}</p>
          <AccessCta tier="managed" label={t('managed.cta')} variant="outline" />
        </div>
      </section>
    </>
  );
}
