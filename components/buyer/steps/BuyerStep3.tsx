'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitBuyerSearch } from '@/app/actions/buyer-search';
import type { Step1Data } from './BuyerStep1';
import type { Step2Data } from './BuyerStep2';

const BACKGROUND_VALUES = ['operator', 'investor', 'professional', 'other'] as const;

export interface Step3Data {
  has_acquired_before: boolean | null;
  background: string;
  name: string;
  email: string;
  phone: string;
}

interface BuyerStep3Props {
  step1: Step1Data;
  step2: Step2Data;
  onComplete: () => void;
}

export function BuyerStep3({ step1, step2, onComplete }: BuyerStep3Props) {
  const t = useTranslations('buyerSearch.step3');

  const [data, setData] = useState<Step3Data>({
    has_acquired_before: null,
    background: '',
    name: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step3Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Step3Data>(key: K, value: Step3Data[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step3Data, string>> = {};
    if (data.has_acquired_before === null) next.has_acquired_before = t('errors.acquiredRequired');
    if (!data.background) next.background = t('errors.backgroundRequired');
    if (!data.email.trim()) next.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) next.email = t('errors.emailInvalid');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await submitBuyerSearch({
        industry: step1.industry || null,
        locations: step1.locations,
        budget_range: step1.budget_range || null,
        primary_goal: step2.primary_goal || null,
        target_return: step2.target_return || null,
        search_timeline: step2.search_timeline || null,
        has_acquired_before: data.has_acquired_before,
        background: data.background || null,
        name: data.name.trim() || null,
        email: data.email.trim(),
        phone: data.phone.trim() || null,
      });
      onComplete();
    } catch {
      setErrors({ email: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      <Field label={t('hasAcquired.label')} error={errors.has_acquired_before}>
        <div className="flex flex-col gap-3">
          {([true, false] as const).map((val) => (
            <RadioCard
              key={String(val)}
              label={t(val ? 'hasAcquired.yes' : 'hasAcquired.no')}
              name="has_acquired_before"
              selected={data.has_acquired_before === val}
              hasError={!!errors.has_acquired_before}
              onChange={() => set('has_acquired_before', val)}
            />
          ))}
        </div>
      </Field>

      <Field label={t('background.label')} helper={t('background.helper')} error={errors.background}>
        <div className="flex flex-col gap-3">
          {BACKGROUND_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`background.${key}`)}
              name="background"
              selected={data.background === key}
              hasError={!!errors.background}
              onChange={() => set('background', key)}
            />
          ))}
        </div>
      </Field>

      <div className="border-t border-[var(--color-border)] pt-6 flex flex-col gap-6">
        <Field label={t('name.label')} optional>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder={t('name.placeholder')}
          />
        </Field>

        <Field label={t('email.label')} error={errors.email}>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder={t('email.placeholder')}
          />
        </Field>

        <Field label={t('phone.label')} optional>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder={t('phone.placeholder')}
          />
        </Field>
      </div>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit" disabled={saving}>
          {saving ? 'Submitting…' : t('submit')}
        </Button>
      </div>
    </form>
  );
}

function RadioCard({
  label,
  name,
  selected,
  hasError,
  onChange,
}: {
  label: string;
  name: string;
  selected: boolean;
  hasError: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
        selected
          ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
        hasError && !selected ? 'border-red-600' : '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
          selected ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]',
        ].join(' ')}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />}
      </span>
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function Field({
  label,
  helper,
  error,
  optional,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {optional && (
          <span className="ml-1 text-[var(--color-muted)] font-normal">(optional)</span>
        )}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helper ? (
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{helper}</p>
      ) : null}
    </div>
  );
}
