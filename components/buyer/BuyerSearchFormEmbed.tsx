'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { BuyerStep1 } from './steps/BuyerStep1';
import { BuyerStep2 } from './steps/BuyerStep2';
import { BuyerStep3 } from './steps/BuyerStep3';
import type { Step1Data } from './steps/BuyerStep1';
import type { Step2Data } from './steps/BuyerStep2';

const TOTAL_STEPS = 3;

const STEP_HEADERS = [
  { titleKey: 'step1.title', subtitleKey: 'step1.subtitle' },
  { titleKey: 'step2.title', subtitleKey: 'step2.subtitle' },
  { titleKey: 'step3.title', subtitleKey: 'step3.subtitle' },
] as const;

export function BuyerSearchFormEmbed() {
  const t = useTranslations('buyerSearch');

  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [completed, setCompleted] = useState(false);

  function handleStep1Complete(data: Step1Data) {
    setStep1Data(data);
    setCurrentStep(2);
  }

  function handleStep2Complete(data: Step2Data) {
    setStep2Data(data);
    setCurrentStep(3);
  }

  function handleStep3Complete() {
    setCompleted(true);
  }

  if (completed) {
    return (
      <div className="py-12 text-center">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#EBF1ED]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13L9 17L19 7" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-[family-name:var(--font-serif)] text-[22px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-2">
          {t('success.heading')}
        </p>
        <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">
          {t('success.body')}
        </p>
      </div>
    );
  }

  const { titleKey, subtitleKey } = STEP_HEADERS[currentStep - 1];

  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
        {t('steps.stepPrefix')} {currentStep} {t('steps.stepOf')} {TOTAL_STEPS}
      </p>
      <h2 className="font-[family-name:var(--font-serif)] text-[26px] font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--color-text)] mb-2">
        {t(titleKey)}
      </h2>
      <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] mb-8">
        {t(subtitleKey)}
      </p>

      {currentStep === 1 && <BuyerStep1 onComplete={handleStep1Complete} />}
      {currentStep === 2 && <BuyerStep2 onComplete={handleStep2Complete} />}
      {currentStep === 3 && step1Data && step2Data && (
        <BuyerStep3 step1={step1Data} step2={step2Data} onComplete={handleStep3Complete} />
      )}
    </div>
  );
}
