import { useTranslations } from 'next-intl';
import { Clock, EyeOff, FileWarning, Scale, BarChart3, Users, BadgeCheck, Handshake, ListChecks, SlidersHorizontal, Mail, Check } from 'lucide-react';
import { IconCircle } from '@/components/marketing/IconCircle';
import { AccessCta } from '@/components/deal-access/AccessCta';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
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

  const steps = [
    { icon: ListChecks, label: t('howItWorks.step1Label'), desc: t('howItWorks.step1Desc') },
    { icon: SlidersHorizontal, label: t('howItWorks.step2Label'), desc: t('howItWorks.step2Desc') },
    { icon: Mail, label: t('howItWorks.step3Label'), desc: t('howItWorks.step3Desc') },
    { icon: Handshake, label: t('howItWorks.step4Label'), desc: t('howItWorks.step4Desc') },
  ];

  const faqs = [1, 2, 3, 4, 5].map((n) => ({ question: t(`faq.q${n}`), answer: t(`faq.a${n}`) }));

  const tiers = [
    {
      tier: 'single',
      name: t('pricing.singleName'),
      price: t('pricing.singlePrice'),
      tagline: t('pricing.singleTagline'),
      volume: t('pricing.singleVolume'),
      volumeNote: t('pricing.singleVolumeNote'),
      includedLabel: t('pricing.includedLabel'),
      items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => t(`pricing.singleItems.item${n}`)),
    },
    {
      tier: 'all',
      name: t('pricing.allName'),
      price: t('pricing.allPrice'),
      tagline: t('pricing.allTagline'),
      volume: t('pricing.allVolume'),
      volumeNote: t('pricing.allVolumeNote'),
      includedLabel: t('pricing.allIncludedLabel'),
      items: [1, 2, 3].map((n) => t(`pricing.allItems.item${n}`)),
    },
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

      {/* ── How it works ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className={headingClass}>{t('howItWorks.heading')}</h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map(({ icon, label, desc }, i) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <IconCircle icon={icon} variant="surface" />
                <span className="text-[15px] font-semibold text-[var(--color-text)]">
                  {i + 1}. {label}
                </span>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-16 md:py-20 px-6 scroll-mt-4 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className={headingClass}>{t('pricing.heading')}</h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tiers.map(({ tier, name, price, tagline, volume, volumeNote, includedLabel, items }) => (
              <div key={tier} className="flex flex-col bg-white border border-[var(--color-border)] rounded-[8px] p-8">
                <h3 className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-muted)] mb-3">{name}</h3>
                <p className="mb-2">
                  <span className="font-[family-name:var(--font-serif)] text-[44px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
                    {price}
                  </span>
                  <span className="ml-2 text-[14px] text-[var(--color-muted)]">/ {t('pricing.period')}</span>
                </p>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] mb-6">{tagline}</p>
                <div className="rounded-[6px] bg-[var(--color-surface)] px-5 py-4 mb-6">
                  <p className="font-[family-name:var(--font-serif)] text-[26px] font-semibold leading-[1.2] text-[var(--color-text)]">{volume}</p>
                  <p className="text-[14px] font-medium text-[var(--color-text)] mt-1">{t('pricing.volumeLabel')}</p>
                  <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{volumeNote}</p>
                </div>
                <p className="text-[13px] font-semibold text-[var(--color-text)] mb-3">{includedLabel}</p>
                <ul className="flex flex-col gap-2.5 mb-8">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-[var(--color-muted)] leading-[1.5]">
                      <Check size={16} strokeWidth={2} className="shrink-0 mt-[2px] text-[var(--color-accent)]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <AccessCta tier={tier} label={t('pricing.cta')} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[13px] text-[var(--color-muted)]">{t('pricing.note')}</p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className={headingClass}>{t('faq.heading')}</h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ── Managed service ── */}
      <section className="py-20 md:py-24 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className={headingClass}>{t('managed.heading')}</h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-6" />
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-8">{t('managed.body')}</p>
          <AccessCta tier="managed" label={t('managed.cta')} variant="outline" />
        </div>
      </section>
    </>
  );
}
