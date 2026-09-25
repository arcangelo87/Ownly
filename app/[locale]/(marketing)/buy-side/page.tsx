import { useTranslations } from 'next-intl';
import { IconCircle } from '@/components/marketing/IconCircle';
import { StepList } from '@/components/marketing/StepList';
import { FeatureRow } from '@/components/marketing/FeatureRow';
import { MandateEnquiryForm } from '@/components/marketing/MandateEnquiryForm';
import { Landmark, ShieldCheck, Percent } from 'lucide-react';
import { NOINDEX } from '@/lib/seo/pages';

export const metadata = NOINDEX;

export default function BuySidePage() {
  const t = useTranslations('buySide');

  const verticals = [
    { icon: Landmark, label: t('verticals.accountingLabel'), desc: t('verticals.accountingDesc') },
    { icon: ShieldCheck, label: t('verticals.insuranceLabel'), desc: t('verticals.insuranceDesc') },
    { icon: Percent, label: t('verticals.lendingLabel'), desc: t('verticals.lendingDesc') },
  ];

  const steps = [
    { label: t('process.step1Label'), description: t('process.step1Desc') },
    { label: t('process.step2Label'), description: t('process.step2Desc') },
    { label: t('process.step3Label'), description: t('process.step3Desc') },
    { label: t('process.step4Label'), description: t('process.step4Desc') },
    { label: t('process.step5Label'), description: t('process.step5Desc') },
  ];

  const credibility = [
    { label: t('credibility.item1Label'), description: t('credibility.item1Desc') },
    { label: t('credibility.item2Label'), description: t('credibility.item2Desc') },
    { label: t('credibility.item3Label'), description: t('credibility.item3Desc') },
    { label: t('credibility.item5Label'), description: t('credibility.item5Desc') },
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
            {t('hero.h1')}
          </h1>
          <p className="text-[16px] md:text-[17px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[520px] mx-auto">
            {t('hero.sub')}
          </p>
          <a
            href="#enquiry"
            className="inline-flex items-center px-9 py-4.5 bg-[var(--color-text)] text-white text-[17px] font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {t('hero.cta')}
          </a>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('hero.note')}</p>
        </div>
      </section>

      {/* ── Where we source deals ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('verticals.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {verticals.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <IconCircle icon={icon} variant="surface" />
                <span className="text-[15px] font-semibold text-[var(--color-text)]">{label}</span>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[260px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 md:py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
            {t('process.heading')}
          </h2>
          <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto mb-12" />
          <div className="text-left">
            <StepList steps={steps} />
          </div>
        </div>
      </section>

      {/* ── How we work / credibility ── */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-4">
            <h2 className="font-[family-name:var(--font-serif)] text-[26px] md:text-[30px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-1">
              {t('credibility.heading')}
            </h2>
            <div className="w-8 h-[3px] bg-[var(--color-terracotta)] mx-auto" />
          </div>
          <div>
            {credibility.map(({ label, description }) => (
              <FeatureRow key={label} label={label} description={description} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Enquiry form ── */}
      <section id="enquiry" className="py-20 md:py-24 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-md text-center mb-10">
          <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-text)] mb-2">
            {t('formSection.heading')}
          </h2>
          <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{t('formSection.sub')}</p>
        </div>
        <div className="mx-auto max-w-md">
          <MandateEnquiryForm side="buy" submitLabel={t('hero.cta')} />
        </div>
      </section>
    </>
  );
}
