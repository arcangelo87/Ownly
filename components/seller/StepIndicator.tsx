'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations('seller.steps');

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-[var(--color-border)] px-8 py-12 sticky top-0 h-screen">
        <Logo width={96} className="mb-[52px]" />
        <ol className="flex flex-col">
          {STEPS.map((key, i) => {
            const step = i + 1;
            const isDone = step < currentStep;
            const isActive = step === currentStep;
            return (
              <li key={key} className="relative flex items-start gap-[14px] py-3">
                {/* connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[10px] top-9 w-px h-full bg-[var(--color-border)]" />
                )}
                {/* dot */}
                <div
                  className={[
                    'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
                    isDone || isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      : 'border-[var(--color-border)] bg-white',
                  ].join(' ')}
                >
                  {isDone ? (
                    <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                  ) : isActive ? (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  ) : null}
                </div>
                {/* labels */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-muted)]">
                    Step {step}
                  </span>
                  <span
                    className={[
                      'text-[13px] font-medium',
                      isActive
                        ? 'font-semibold text-[var(--color-text)]'
                        : 'text-[var(--color-muted)]',
                    ].join(' ')}
                  >
                    {t(key)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden border-b border-[var(--color-border)] px-5 pt-4 pb-3">
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-border)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Step{' '}
          <span className="font-semibold text-[var(--color-text)]">
            {currentStep} of {STEPS.length}
          </span>{' '}
          : {t(STEPS[currentStep - 1])}
        </p>
      </div>
    </>
  );
}
