'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { recordDealAccessClick, submitDealAccess, type DealAccessTier } from '@/app/actions/deal-access';

interface AccessCtaProps {
  tier: DealAccessTier;
  label: string;
  variant?: 'primary' | 'outline';
}

const headingKey = { single: 'singleHeading', all: 'allHeading', managed: 'managedHeading' } as const;
const subKey = { single: 'singleSub', all: 'allSub', managed: 'managedSub' } as const;
const criteriaKey = { single: 'criteriaLabelSingle', all: 'criteriaLabelAll', managed: 'criteriaLabelManaged' } as const;

export function AccessCta({ tier, label, variant = 'primary' }: AccessCtaProps) {
  const t = useTranslations('dealAccess.form');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [criteria, setCriteria] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (next) void recordDealAccessClick(tier);
    setOpen(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return setEmailError(t('errors.emailRequired'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setEmailError(t('errors.emailInvalid'));
    setEmailError(null);
    setFormError(null);

    startTransition(async () => {
      const { error } = await submitDealAccess({ tier, email, criteria: criteria || undefined });
      if (error) setFormError(t('errors.submitFailed'));
      else setSubmitted(true);
    });
  }

  const triggerClass =
    variant === 'primary'
      ? 'w-full inline-flex justify-center items-center px-8 py-4 bg-[var(--color-text)] text-white text-[16px] font-bold rounded-full hover:opacity-90 transition-opacity'
      : 'inline-flex justify-center items-center px-9 py-4 border border-[var(--color-text)] text-[var(--color-text)] text-[16px] font-bold rounded-full hover:bg-[var(--color-text)] hover:text-white transition-colors';

  const inputId = `deal-access-${tier}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className={triggerClass}>{label}</DialogTrigger>
      <DialogContent className="max-w-md w-[calc(100%-32px)] rounded-[8px] p-8">
        {submitted ? (
          <div className="text-center py-4">
            <DialogPrimitive.Title className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)] mb-2">
              {t('successHeading')}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-[14px] text-[var(--color-muted)]">
              {t('successBody')}
            </DialogPrimitive.Description>
          </div>
        ) : (
          <>
            <DialogPrimitive.Title className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)] mb-1 pr-6">
              {t(headingKey[tier])}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-[14px] text-[var(--color-muted)] leading-[1.6] mb-6">
              {t(subKey[tier])}
            </DialogPrimitive.Description>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor={`${inputId}-email`} className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
                  {t('emailLabel')}
                </label>
                <input
                  id={`${inputId}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                />
                {emailError && <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{emailError}</p>}
              </div>
              <div>
                <label htmlFor={`${inputId}-criteria`} className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
                  {t(criteriaKey[tier])}
                </label>
                <textarea
                  id={`${inputId}-criteria`}
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  rows={3}
                  className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
                />
              </div>
              {formError && <p className="text-[13px] text-[var(--color-terracotta)]">{formError}</p>}
              <button
                type="submit"
                disabled={isPending}
                className="mt-2 inline-flex justify-center items-center px-8 py-4 bg-[var(--color-text)] text-white text-[16px] font-bold rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isPending ? t('submitting') : tier === 'managed' ? t('submitManaged') : t('submit')}
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
