'use client';

import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { Step1BusinessBasics } from './steps/Step1BusinessBasics';

const TOTAL_STEPS = 4;

export function SellerForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listingId, setListingId] = useState<string | null>(null);

  function handleStep1Complete(id: string) {
    setListingId(id);
    setCurrentStep(2);
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <StepIndicator currentStep={currentStep} />

      <main className="flex-1 px-5 py-10 md:px-16 md:py-14 max-w-[680px]">
        <header className="mb-10">
          {currentStep === 1 && (
            <>
              <p className="mb-[10px] text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)]">
                Step 1 of {TOTAL_STEPS}
              </p>
              <h1 className="font-serif text-[28px] font-medium tracking-[-0.02em] leading-[1.2] mb-[10px]">
                Tell us about your business
              </h1>
              <p className="text-sm text-[var(--color-muted)] leading-[1.6]">
                You can stay anonymous for now — your name and company won&apos;t appear publicly.
              </p>
            </>
          )}
          {currentStep > 1 && (
            <p className="text-sm text-[var(--color-muted)]">
              Listing saved · ID: <code className="font-mono text-xs">{listingId}</code>
            </p>
          )}
        </header>

        {currentStep === 1 && (
          <Step1BusinessBasics onComplete={handleStep1Complete} />
        )}

        {currentStep === 2 && (
          <Placeholder stepNumber={2} stepName="Size & team" />
        )}
        {currentStep === 3 && (
          <Placeholder stepNumber={3} stepName="The deal" />
        )}
        {currentStep === 4 && (
          <Placeholder stepNumber={4} stepName="Your story" />
        )}
      </main>
    </div>
  );
}

function Placeholder({ stepNumber, stepName }: { stepNumber: number; stepName: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white px-8 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-2">
        Step {stepNumber}
      </p>
      <p className="font-serif text-xl text-[var(--color-text)]">{stepName}</p>
      <p className="mt-3 text-sm text-[var(--color-muted)]">Coming soon</p>
    </div>
  );
}
