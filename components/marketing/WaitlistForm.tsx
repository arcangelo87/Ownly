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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [region, setRegion] = useState('');

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
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
      const role = [budget, region].filter(Boolean).join(', ');
      const { error } = await submitWaitlist({ firstName: name, lastName: '', email, role });
      if (error) {
        setFormError(error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[8px] p-8 text-center max-w-[540px] mx-auto">
        <p className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)] mb-2">
          You are on the list.
        </p>
        <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">
          We will reach out when your access slot opens.
        </p>
      </div>
    );
  }

  const inputClass = "w-full border border-[var(--color-border)] bg-[var(--color-bg)] rounded-[4px] px-3.5 py-3 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]";
  const labelClass = "block text-[13px] font-medium text-[var(--color-text)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 w-full max-w-[540px] mx-auto">
      <div>
        <label className={labelClass}>{t('name')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          autoComplete="name"
          className={inputClass}
        />
        {fieldErrors.name && <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{fieldErrors.name}</p>}
      </div>

      <div>
        <label className={labelClass}>{t('email')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={inputClass}
        />
        {fieldErrors.email && <p className="mt-1 text-[12px] text-[var(--color-terracotta)]">{fieldErrors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('budget')}</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={inputClass}>
            <option value="">{t('budgetPlaceholder')}</option>
            <option value="under-500k">{t('budgetOpt1')}</option>
            <option value="500k-2m">{t('budgetOpt2')}</option>
            <option value="2m-5m">{t('budgetOpt3')}</option>
            <option value="over-5m">{t('budgetOpt4')}</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('region')}</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
            <option value="">{t('regionPlaceholder')}</option>
            <option value="italy">{t('regionOpt1')}</option>
            <option value="portugal">{t('regionOpt2')}</option>
            <option value="both">{t('regionOpt3')}</option>
          </select>
        </div>
      </div>

      {formError && <p className="text-[13px] text-[var(--color-terracotta)]">{formError}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-[var(--color-text)] text-white text-[15px] font-medium rounded-full hover:opacity-85 transition-opacity disabled:opacity-60 mt-1"
      >
        {isPending ? 'Sending…' : t('submit')}
      </button>

      <p className="text-[12px] text-[var(--color-muted)] text-center">{t('formNote')}</p>
    </form>
  );
}
