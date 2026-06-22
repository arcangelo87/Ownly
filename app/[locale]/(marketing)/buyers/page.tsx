import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  TrendingUp,
  Settings2,
  ShieldCheck,
  Calculator,
  EyeOff,
  Clock,
  Landmark,
  Table2,
  ClipboardList,
  Search,
  LifeBuoy,
} from 'lucide-react';
import { IconCircle } from '@/components/marketing/IconCircle';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { FoundingForm } from '@/components/marketing/FoundingForm';

export default function BuyersPage() {
  const t = useTranslations('buyers');

  const whyInvest = [
    { icon: TrendingUp, label: t('whyInvest.item1Label'), desc: t('whyInvest.item1Desc') },
    { icon: Settings2, label: t('whyInvest.item2Label'), desc: t('whyInvest.item2Desc') },
    { icon: ShieldCheck, label: t('whyInvest.item3Label'), desc: t('whyInvest.item3Desc') },
  ];

  const problems = [
    { icon: Calculator, label: t('problem.item1Label'), desc: t('problem.item1Desc') },
    { icon: EyeOff, label: t('problem.item2Label'), desc: t('problem.item2Desc') },
    { icon: Clock, label: t('problem.item3Label'), desc: t('problem.item3Desc') },
    { icon: Landmark, label: t('problem.item4Label'), desc: t('problem.item4Desc') },
    { icon: Table2, label: t('problem.item5Label'), desc: t('problem.item5Desc') },
  ];

  const steps = [
    { icon: ClipboardList, label: t('howItWorks.step1Label'), desc: t('howItWorks.step1Desc') },
    { icon: Search, label: t('howItWorks.step2Label'), desc: t('howItWorks.step2Desc') },
    { icon: LifeBuoy, label: t('howItWorks.step3Label'), desc: t('howItWorks.step3Desc') },
  ];

  const faqs = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
  ];

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
          <p className="text-[16px] md:text-[17px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[480px] mx-auto">
            {t('hero.sub')}
          </p>
          <Link
            href="#founding"
            className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </Link>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('hero.note')}</p>
        </div>
      </section>

      {/* ── Why invest ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('whyInvest.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {whyInvest.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <IconCircle icon={icon} variant="surface" />
                <span className="text-[15px] font-semibold text-[var(--color-text)]">{label}</span>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('problem.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10 max-w-[600px] mx-auto">
            {problems.map(({ icon, label, desc }, i) => (
              <div
                key={label}
                className={`flex items-start gap-4 text-left ${
                  i === problems.length - 1 ? 'sm:col-span-2 sm:max-w-[280px] sm:mx-auto' : ''
                }`}
              >
                <IconCircle icon={icon} variant="bg" size={48} />
                <div>
                  <span className="block text-[15px] font-semibold text-[var(--color-text)] mb-1">{label}</span>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              {t('howItWorks.heading')}
            </h2>
            <span className="text-[12px] font-medium text-[var(--color-muted)] border border-[var(--color-border)] rounded-full px-3 py-1">
              {t('howItWorks.badge')}
            </span>
          </div>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <IconCircle icon={icon} variant="surface" />
                <span className="text-[15px] font-semibold text-[var(--color-text)]">{label}</span>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Questions ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
              {t('faq.heading')}
            </h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ── Footer CTA / Founding form ── */}
      <section id="founding" className="py-20 md:py-24 px-6 bg-[var(--color-surface)] text-center">
        <div className="mx-auto max-w-md">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-text)] mb-2">
            {t('cta.headingLead')}{' '}
            <span className="italic text-[var(--color-terracotta)]">{t('cta.headingEmphasis')}</span>
          </h2>
          <div className="mt-10 text-left">
            <FoundingForm
              type="buyer"
              namePlaceholder={t('foundingForm.namePlaceholder')}
              emailPlaceholder={t('foundingForm.emailPlaceholder')}
              phonePlaceholder={t('foundingForm.phonePlaceholder')}
              messagePlaceholder={t('foundingForm.messagePlaceholder')}
              submitLabel={t('cta.button')}
            />
          </div>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('cta.note')}</p>
        </div>
      </section>
    </>
  );
}
