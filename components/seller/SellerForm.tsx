'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { StepIndicator } from './StepIndicator';
import { Step1BusinessBasics } from './steps/Step1BusinessBasics';
import { Step2SizeTeam } from './steps/Step2SizeTeam';
import { Step3TheDeal } from './steps/Step3TheDeal';
import { Step4YourStory } from './steps/Step4YourStory';

const TOTAL_STEPS = 4;

export function SellerForm() {
  const t = useTranslations('seller');
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [completed, setCompleted] = useState(false);

  function handleStep1Complete(id: string, uploadedPhotos: File[]) {
    setListingId(id);
    setPhotos(uploadedPhotos);
    setCurrentStep(2);
  }

  function handleStep2Complete() { setCurrentStep(3); }
  function handleStep3Complete() { setCurrentStep(4); }
  function handleStep4Complete() { setCompleted(true); }

  if (completed) {
    return <SuccessScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <StepIndicator currentStep={currentStep} />

      <main className="flex-1 px-5 py-10 md:px-16 md:py-14" style={{ maxWidth: '680px' }}>
        <header className="mb-10">
          <p className="mb-[10px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
            {t('steps.stepPrefix')} {currentStep} {t('steps.stepOf')} {TOTAL_STEPS}
          </p>
          <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em] leading-[1.2] mb-[10px]">
            {t(`step${currentStep}.title` as Parameters<typeof t>[0])}
          </h1>
          <p className="text-sm text-[var(--color-muted)] leading-[1.6]">
            {t(`step${currentStep}.subtitle` as Parameters<typeof t>[0])}
          </p>
        </header>

        {currentStep === 1 && (
          <Step1BusinessBasics onComplete={handleStep1Complete} />
        )}
        {currentStep === 2 && listingId && (
          <Step2SizeTeam listingId={listingId} onComplete={handleStep2Complete} />
        )}
        {currentStep === 3 && listingId && (
          <Step3TheDeal listingId={listingId} onComplete={handleStep3Complete} />
        )}
        {currentStep === 4 && listingId && (
          <Step4YourStory listingId={listingId} photos={photos} onComplete={handleStep4Complete} />
        )}
      </main>
    </div>
  );
}

function SuccessScreen() {
  const t = useTranslations('seller.success');
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF1ED]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13L9 17L19 7" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em] leading-[1.2] mb-3">
          {t('heading')}
        </h1>
        <p className="text-sm text-[var(--color-muted)] leading-[1.6]">
          {t('body')}
        </p>
      </div>
    </div>
  );
}
