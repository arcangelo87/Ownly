'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const VERTICAL_VALUES = ['accounting', 'insurance', 'lending', 'other'] as const;
const REVENUE_VALUES = ['under_250k', '250k_1m', '1m_2_5m', '2_5m_5m', 'over_5m'] as const;
const VALUATION_VALUES = ['yes', 'no', 'notSure'] as const;

export interface Step1Data {
  vertical: string;
  vertical_other: string;
  revenue_range: string;
  had_valuation: string;
}

interface SellerStep1Props {
  onComplete: (data: Step1Data) => void;
}

export function SellerStep1({ onComplete }: SellerStep1Props) {
  const t = useTranslations('sellerSearch.step1');

  const [vertical, setVertical] = useState('');
  const [verticalOther, setVerticalOther] = useState('');
  const [revenueRange, setRevenueRange] = useState('');
  const [hadValuation, setHadValuation] = useState('');
  const [errors, setErrors] = useState<{ vertical?: string; revenue_range?: string; had_valuation?: string }>({});

  function handleVertical(value: string) {
    setVertical(value);
    if (errors.vertical) setErrors((prev) => ({ ...prev, vertical: undefined }));
  }

  function handleRevenue(value: string) {
    setRevenueRange(value);
    if (errors.revenue_range) setErrors((prev) => ({ ...prev, revenue_range: undefined }));
  }

  function handleValuation(value: string) {
    setHadValuation(value);
    if (errors.had_valuation) setErrors((prev) => ({ ...prev, had_valuation: undefined }));
  }

  function validate(): boolean {
    const next: { vertical?: string; revenue_range?: string; had_valuation?: string } = {};
    if (!vertical) next.vertical = t('errors.verticalRequired');
    if (!revenueRange) next.revenue_range = t('errors.revenueRequired');
    if (!hadValuation) next.had_valuation = t('errors.valuationRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete({
      vertical,
      vertical_other: verticalOther,
      revenue_range: revenueRange,
      had_valuation: hadValuation,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Sector */}
      <Field label={t('vertical.label')} helper={t('vertical.helper')} error={errors.vertical}>
        <div className="grid grid-cols-2 gap-2">
          {VERTICAL_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`vertical.${key}`)}
              name="vertical"
              selected={vertical === key}
              hasError={!!errors.vertical}
              onChange={() => handleVertical(key)}
            />
          ))}
        </div>
        {vertical === 'other' && (
          <Input
            type="text"
            value={verticalOther}
            onChange={(e) => setVerticalOther(e.target.value)}
            placeholder={t('verticalOther.placeholder')}
            className="mt-2"
          />
        )}
      </Field>

      {/* Revenue */}
      <Field label={t('revenue.label')} helper={t('revenue.helper')} error={errors.revenue_range}>
        <NativeSelect
          id="revenue"
          value={revenueRange}
          onChange={handleRevenue}
          placeholder={t('revenue.placeholder')}
          hasError={!!errors.revenue_range}
          options={REVENUE_VALUES.map((v) => ({ value: v, label: t(`revenueOptions.${v}`) }))}
        />
      </Field>

      {/* Prior valuation */}
      <Field label={t('hadValuation.label')} error={errors.had_valuation}>
        <div className="flex flex-col gap-3">
          {VALUATION_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`hadValuation.${key}`)}
              name="had_valuation"
              selected={hadValuation === key}
              hasError={!!errors.had_valuation}
              onChange={() => handleValuation(key)}
            />
          ))}
        </div>
      </Field>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit">{t('continue')}</Button>
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
  hasError?: boolean;
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
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helper ? (
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{helper}</p>
      ) : null}
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
