import { useTranslations } from 'next-intl';
import { Clock, EyeOff, FileWarning, Scale, BarChart3, Users, BadgeCheck, Handshake } from 'lucide-react';
import { IconCircle } from '@/components/marketing/IconCircle';
import { AccessCta } from '@/components/deal-access/AccessCta';
import { NOINDEX } from '@/lib/seo/pages';

export const metadata = { ...NOINDEX, title: 'Off-market businesses in Portugal' };

const headingClass =
  'font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1';

export default function DealAccessPage() {
  const t = useTranslations('dealAccess');

  const problems = [
    { icon: Clock, label: t('problem.item1Label'), desc: t('problem.item1Desc') },
    { icon: EyeOff, label: t('problem.item2Label'), desc: t('problem.item2Desc') },
    { icon: FileWarning, label: t('problem.item3Label'), desc: t('problem.item3Desc') },
    { icon: Scale, label: t('problem.item4Label'), desc: t('problem.item4Desc') },
  ];

  const benefits = [
    { icon: BarChart3, label: t('benefits.item1Label'), desc: t('benefits.item1Desc') },
    { icon: Users, label: t('benefits.item2Label'), desc: t('benefits.item2Desc') },
    { icon: BadgeCheck, label: t('benefits.item3Label'), desc: t('benefits.item3Desc') },
    { icon: Handshake, label: t('benefits.item4Label'), desc: t('benefits.item4Desc') },
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
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-muted)] mb-5">
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {t('hero.h1Lead')}{' '}
            <span className="italic text-[var(--color-terracotta)]">{t('hero.h1Emphasis')}</span>
          </h1>
          <p className="text-[16px] md:text-[17px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[520px] mx-auto">
            {t('hero.sub')}
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </a>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('hero.note')}</p>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={headingClass}>{t('problem.heading')}</h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 max-w-[600px] mx-auto">
            {problems.map(({ icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 text-left">
                <IconCircle icon={icon} variant="surface" size={48} />
                <div>
                  <span className="block text-[15px] font-semibold text-[var(--color-text)] mb-1">{label}</span>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className={headingClass}>{t('benefits.heading')}</h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-6" />
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.6] mb-12">{t('benefits.intro')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <IconCircle icon={icon} variant="bg" />
                <span className="text-[15px] font-semibold text-[var(--color-text)]">{label}</span>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-12 text-[14px] text-[var(--color-muted)] leading-[1.6]">{t('benefits.outro')}</p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 md:py-20 px-6 scroll-mt-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={headingClass}>{t('pricing.heading')}</h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(({ tier, name, price, desc, best }) => (
              <div key={tier} className="flex flex-col bg-white border border-[var(--color-border)] rounded-[8px] p-8">
                <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-muted)] mb-3">{name}</h3>
                <p className="mb-5">
                  <span className="font-[family-name:var(--font-serif)] text-[44px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
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
      <section className="py-16 md:py-20 px-6 border-t border-[var(--color-border)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={headingClass}>{t('managed.heading')}</h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-6" />
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-8">{t('managed.body')}</p>
          <AccessCta tier="managed" label={t('managed.cta')} variant="outline" />
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-surface)] text-center">
        <div className="mx-auto max-w-md">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-text)] mb-8">
            {t('cta.headingLead')}{' '}
            <span className="italic text-[var(--color-terracotta)]">{t('cta.headingEmphasis')}</span>
          </h2>
          <a
            href="#pricing"
            className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {t('cta.button')}
          </a>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('cta.note')}</p>
        </div>
      </section>
    </>
  );
}
