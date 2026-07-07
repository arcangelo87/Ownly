'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const GOAL_VALUES = ['passiveIncome', 'capitalAppreciation', 'lifestyle', 'strategicBoltOn'] as const;
const TIMELINE_VALUES = ['activeNow', 'within6months', 'exploring'] as const;

export interface Step2Data {
  primary_goals: string[];
  search_timeline: string;
}

interface BuyerStep2Props {
  onComplete: (data: Step2Data) => void;
}

export function BuyerStep2({ onComplete }: BuyerStep2Props) {
  const t = useTranslations('buyerSearch.step2');

  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [searchTimeline, setSearchTimeline] = useState('');

  const [errors, setErrors] = useState<{ primary_goals?: string; search_timeline?: string }>({});

  function toggleGoal(value: string) {
    setPrimaryGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value],
    );
    if (errors.primary_goals) setErrors((prev) => ({ ...prev, primary_goals: undefined }));
  }

  function handleTimeline(value: string) {
    setSearchTimeline(value);
    if (errors.search_timeline) setErrors((prev) => ({ ...prev, search_timeline: undefined }));
  }

  function validate(): boolean {
    const next: { primary_goals?: string; search_timeline?: string } = {};
    if (primaryGoals.length === 0) next.primary_goals = t('errors.goalRequired');
    if (!searchTimeline) next.search_timeline = t('errors.timelineRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete({ primary_goals: primaryGoals, search_timeline: searchTimeline });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      <Field label={t('goal.label')} helper={t('goal.helper')} error={errors.primary_goals}>
        <div className="flex flex-col gap-3">
          {GOAL_VALUES.map((key) => (
            <CheckboxCard
              key={key}
              label={t(`goal.${key}`)}
              checked={primaryGoals.includes(key)}
              hasError={!!errors.primary_goals}
              onChange={() => toggleGoal(key)}
            />
          ))}
        </div>
      </Field>

      <Field label={t('searchTimeline.label')} helper={t('searchTimeline.helper')} error={errors.search_timeline}>
        <div className="flex flex-col gap-3">
          {TIMELINE_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`searchTimeline.${key}`)}
              name="search_timeline"
              value={key}
              selected={searchTimeline === key}
              hasError={!!errors.search_timeline}
              onChange={() => handleTimeline(key)}
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

function CheckboxCard({
  label,
  checked,
  hasError,
  onChange,
}: {
  label: string;
  checked: boolean;
  hasError?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
        checked
          ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
          : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
        hasError && !checked ? 'border-red-600' : '',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
          checked ? 'border-[var(--color-accent)] bg-[var(--color-accent)]' : 'border-[var(--color-border)]',
        ].join(' ')}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
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

