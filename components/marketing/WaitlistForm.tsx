'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { submitWaitlist } from '@/app/actions/waitlist';

export function WaitlistForm() {
  const t = useTranslations('waitlist');
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  function validate() {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
    if (!role) errors.role = 'Please select one';
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
      const { error } = await submitWaitlist({ firstName, lastName, email, role });
      if (error) {
        setFormError(error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-8 text-center">
        <p className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)] mb-2">
          You are on the list.
        </p>
        <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">
          We will reach out when your access slot opens. No spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] mb-1.5">
            {t('firstName')}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] rounded-[4px] px-3.5 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-[12px] text-red-600">{fieldErrors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] mb-1.5">
            {t('lastName')}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] rounded-[4px] px-3.5 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] mb-1.5">
          {t('email')}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] rounded-[4px] px-3.5 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-[12px] text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] mb-1.5">
          {t('roleLabel')}
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] rounded-[4px] px-3.5 py-3 text-[15px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
        >
          <option value="">{t('rolePlaceholder')}</option>
          <option value="buyer">{t('roleBuyer')}</option>
          <option value="seller">{t('roleSeller')}</option>
          <option value="broker">{t('roleBroker')}</option>
        </select>
        {fieldErrors.role && (
          <p className="mt-1 text-[12px] text-red-600">{fieldErrors.role}</p>
        )}
      </div>

      {formError && (
        <p className="text-[13px] text-red-600">{formError}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity disabled:opacity-60 mt-1"
      >
        {isPending ? 'Sending…' : t('submit')}
      </button>

      <p className="text-[12px] text-[var(--color-muted)] text-center">{t('formNote')}</p>
    </form>
  );
}
