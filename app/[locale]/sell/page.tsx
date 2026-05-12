import { useTranslations } from 'next-intl';
import { StepList } from '@/components/marketing/StepList';
import { SellerForm } from '@/components/seller/SellerForm';

export default function SellPage() {
  const t = useTranslations('sellers');

  const howSteps = [
    { label: t('howItWorks.step1Label'), description: t('howItWorks.step1Desc') },
    { label: t('howItWorks.step2Label'), description: t('howItWorks.step2Desc') },
    { label: t('howItWorks.step3Label'), description: t('howItWorks.step3Desc') },
    { label: t('howItWorks.step4Label'), description: t('howItWorks.step4Desc') },
  ];

  return (
    <>
      <section className="py-16 px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-10">
            {t('howItWorks.heading')}
          </h1>
          <StepList steps={howSteps} />
          <p className="mt-8 text-[14px] text-[var(--color-muted)] leading-[1.6]">
            {t('howItWorks.reassurance')}
          </p>
        </div>
      </section>
      <SellerForm />
    </>
  );
}
