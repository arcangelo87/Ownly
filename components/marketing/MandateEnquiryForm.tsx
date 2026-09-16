'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { submitMandateEnquiry, type MandateSide, type MandateVertical } from '@/app/actions/mandate-enquiry';

interface MandateEnquiryFormProps {
  side: MandateSide;
  submitLabel: string;
}

export function MandateEnquiryForm({ side, submitLabel }: MandateEnquiryFormProps) {
  const t = useTranslations('mandateForm');
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vertical, setVertical] = useState<MandateVertical | ''>('');
  const [message, setMessage] = useState('');

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = t('errors.nameRequired');
    if (!email.trim()) errors.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t('errors.emailInvalid');
    if (!vertical) errors.vertical = t('errors.verticalRequired');
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setFormError(null);

    startTransition(async () => {
      const { error } = await submitMandateEnquiry({
        side,
        vertical: vertical as MandateVertical,
        name,
        email,
        phone: phone || undefined,
        message: message || undefined,
      });
      if (error) {
        setFormError(t('errors.submitFailed'));
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-8 text-center">
        <p className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)]">
          {t('successHeading')}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
          {t('nameLabel')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
          {t('emailLabel')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
          {t('phoneLabel')}
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
          {t('verticalLabel')}
        </label>
        <select
          value={vertical}
          onChange={(e) => setVertical(e.target.value as MandateVertical)}
          className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="" disabled>
            {t('verticalPlaceholder')}
          </option>
          <option value="accounting">{t('verticalAccounting')}</option>
          <option value="insurance">{t('verticalInsurance')}</option>
          <option value="lending">{t('verticalLending')}</option>
          <option value="other">{t('verticalOther')}</option>
        </select>
        {fieldErrors.vertical && (
          <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{fieldErrors.vertical}</p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-medium text-[var(--color-text)] mb-1">
          {t('messageLabel')}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full border border-[var(--color-border)] bg-white rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
        />
      </div>

      {formError && (
        <p className="text-[13px] text-[var(--color-terracotta)]">{formError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-8 py-4 bg-[var(--color-accent)] text-white text-[16px] font-bold rounded-[4px] hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isPending ? '...' : submitLabel}
      </button>
    </form>
  );
}
