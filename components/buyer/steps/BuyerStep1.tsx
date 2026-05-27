'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BUDGET_VALUES = ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', '5m_10m', 'over_10m'] as const;
const LOCATION_VALUES = ['italy', 'portugal'] as const;

export interface Step1Data {
  industry: string;
  locations: string[];
  budget_range: string;
}

interface BuyerStep1Props {
  onComplete: (data: Step1Data) => void;
}

export function BuyerStep1({ onComplete }: BuyerStep1Props) {
  const t = useTranslations('buyerSearch.step1');

  const BUDGET_OPTIONS = BUDGET_VALUES.map((v) => ({ value: v, label: t(`budgetOptions.${v}`) }));

  const [data, setData] = useState<Step1Data>({
    industry: '',
    locations: [],
    budget_range: '',
  });

  const [errors, setErrors] = useState<{ locations?: string; budget_range?: string }>({});

  function toggleLocation(loc: string) {
    setData((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));
    if (errors.locations) setErrors((prev) => ({ ...prev, locations: undefined }));
  }

  function setBudget(value: string) {
    setData((prev) => ({ ...prev, budget_range: value }));
    if (errors.budget_range) setErrors((prev) => ({ ...prev, budget_range: undefined }));
  }

  function validate(): boolean {
    const next: { locations?: string; budget_range?: string } = {};
    if (data.locations.length === 0) next.locations = t('errors.locationRequired');
    if (!data.budget_range) next.budget_range = t('errors.budgetRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete(data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      <Field label={t('industry.label')} helper={t('industry.helper')}>
        <Input
          type="text"
          value={data.industry}
          onChange={(e) => setData((prev) => ({ ...prev, industry: e.target.value }))}
          placeholder={t('industry.placeholder')}
        />
      </Field>

      <Field label={t('locations.label')} helper={t('locations.helper')} error={errors.locations}>
        <div className="flex flex-col gap-3">
          {LOCATION_VALUES.map((loc) => {
            const selected = data.locations.includes(loc);
            return (
              <label
                key={loc}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                  selected
                    ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
                  errors.locations ? 'border-red-600' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
                    selected ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-[var(--color-border)]',
                  ].join(' ')}
                >
                  {selected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleLocation(loc)}
                  className="sr-only"
                />
                {t(`locations.${loc}`)}
              </label>
            );
          })}
        </div>
      </Field>

      <Field label={t('budget.label')} helper={t('budget.helper')} error={errors.budget_range}>
        <NativeSelect
          id="budget"
          value={data.budget_range}
          onChange={setBudget}
          placeholder={t('budget.placeholder')}
          hasError={!!errors.budget_range}
          options={BUDGET_OPTIONS}
        />
      </Field>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit">{t('continue')}</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{helper}</p>
      )}
    </div>
  );
}

function NativeSelect({
  id,
  value,
  onChange,
  placeholder,
  options,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  hasError?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full appearance-none rounded-md border bg-white pl-3 pr-8 py-[10px] text-sm outline-none transition-colors',
          hasError
            ? 'border-red-600'
            : 'border-[var(--color-border)] focus:border-[var(--color-text)]',
          !value ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]',
        ].join(' ')}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
