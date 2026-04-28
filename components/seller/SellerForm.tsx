'use client';

import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { Step1BusinessBasics } from './steps/Step1BusinessBasics';
import { Step2SizeTeam } from './steps/Step2SizeTeam';
import { Step3TheDeal } from './steps/Step3TheDeal';
import { Step4YourStory } from './steps/Step4YourStory';

const TOTAL_STEPS = 4;

const STEP_HEADERS: Record<number, { title: string; subtitle: string }> = {
  1: {
    title: 'Tell us about your business',
    subtitle: "You can stay anonymous for now. Your name and company won't appear publicly.",
  },
  2: {
    title: 'Size & team',
    subtitle: 'Approximate figures are fine. Exact numbers are shared under NDA.',
  },
  3: {
    title: 'The deal',
    subtitle: 'These details help buyers quickly assess fit. Everything stays confidential until you choose to share.',
  },
  4: {
    title: 'Your story',
    subtitle: 'Help buyers understand what makes this business worth looking at.',
  },
};

export function SellerForm() {
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

  const header = STEP_HEADERS[currentStep];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <StepIndicator currentStep={currentStep} />

      <main className="flex-1 px-5 py-10 md:px-16 md:py-14" style={{ maxWidth: '680px' }}>
        <header className="mb-10">
          <p className="mb-[10px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em] leading-[1.2] mb-[10px]">
            {header.title}
          </h1>
          <p className="text-sm text-[var(--color-muted)] leading-[1.6]">
            {header.subtitle}
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
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF1ED]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 13L9 17L19 7" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em] leading-[1.2] mb-3">
          Listing submitted
        </h1>
        <p className="text-sm text-[var(--color-muted)] leading-[1.6]">
          Thank you. We&apos;ll review your listing and be in touch shortly. In the meantime, feel free to reach out if you have any questions.
        </p>
      </div>
    </div>
  );
}
