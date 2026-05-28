'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const GOAL_VALUES = ['passiveIncome', 'capitalAppreciation', 'lifestyle', 'strategicBoltOn'] as const;
const RETURN_VALUES = ['r10_15', 'r15_20', 'r20_30', 'r30plus'] as const;
const TIMELINE_VALUES = ['activeNow', 'within6months', 'exploring'] as const;

export interface Step2Data {
  primary_goal: string;
  target_return: string;
  search_timeline: string;
}

interface BuyerStep2Props {
  onComplete: (data: Step2Data) => void;
}

export function BuyerStep2({ onComplete }: BuyerStep2Props) {
  const t = useTranslations('buyerSearch.step2');

  const [data, setData] = useState<Step2Data>({
    primary_goal: '',
    target_return: '',
    search_timeline: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step2Data, string>>>({});

  function set<K extends keyof Step2Data>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step2Data, string>> = {};
    if (!data.primary_goal) next.primary_goal = t('errors.goalRequired');
    if (!data.target_return) next.target_return = t('errors.returnRequired');
    if (!data.search_timeline) next.search_timeline = t('errors.timelineRequired');
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

      <Field label={t('goal.label')} helper={t('goal.helper')} error={errors.primary_goal}>
        <div className="flex flex-col gap-3">
          {GOAL_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`goal.${key}`)}
              name="primary_goal"
              value={key}
              selected={data.primary_goal === key}
              hasError={!!errors.primary_goal}
              onChange={() => set('primary_goal', key)}
            />
          ))}
        </div>
      </Field>

      <Field label={t('targetReturn.label')} helper={t('targetReturn.helper')} error={errors.target_return}>
        <NativeSelect
          id="targetReturn"
          value={data.target_return}
          onChange={(v) => set('target_return', v)}
          placeholder={t('targetReturn.placeholder')}
          hasError={!!errors.target_return}
          options={RETURN_VALUES.map((v) => ({ value: v, label: t(`targetReturnOptions.${v}`) }))}
        />
      </Field>

      <Field label={t('searchTimeline.label')} helper={t('searchTimeline.helper')} error={errors.search_timeline}>
        <div className="flex flex-col gap-3">
          {TIMELINE_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`searchTimeline.${key}`)}
              name="search_timeline"
              value={key}
              selected={data.search_timeline === key}
              hasError={!!errors.search_timeline}
              onChange={() => set('search_timeline', key)}
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
  value,
  selected,
  hasError,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
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
        value={value}
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
