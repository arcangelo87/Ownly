'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PRIORITY_VALUES = ['maxPrice', 'cleanExit', 'staffContinuity', 'confidentiality', 'stayInvolved'] as const;
const TIMELINE_VALUES = ['readyNow', 'within6to12', 'exploring'] as const;

export interface Step2Data {
  priorities: string[];
  timeline: string;
}

interface SellerStep2Props {
  onComplete: (data: Step2Data) => void;
}

export function SellerStep2({ onComplete }: SellerStep2Props) {
  const t = useTranslations('sellerSearch.step2');

  const [priorities, setPriorities] = useState<string[]>([]);
  const [timeline, setTimeline] = useState('');

  const [errors, setErrors] = useState<{ priorities?: string; timeline?: string }>({});

  function togglePriority(value: string) {
    setPriorities((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value],
    );
    if (errors.priorities) setErrors((prev) => ({ ...prev, priorities: undefined }));
  }

  function handleTimeline(value: string) {
    setTimeline(value);
    if (errors.timeline) setErrors((prev) => ({ ...prev, timeline: undefined }));
  }

  function validate(): boolean {
    const next: { priorities?: string; timeline?: string } = {};
    if (priorities.length === 0) next.priorities = t('errors.prioritiesRequired');
    if (!timeline) next.timeline = t('errors.timelineRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete({ priorities, timeline });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      <Field label={t('priorities.label')} helper={t('priorities.helper')} error={errors.priorities}>
        <div className="flex flex-col gap-3">
          {PRIORITY_VALUES.map((key) => (
            <CheckboxCard
              key={key}
              label={t(`priorities.${key}`)}
              checked={priorities.includes(key)}
              hasError={!!errors.priorities}
              onChange={() => togglePriority(key)}
            />
          ))}
        </div>
      </Field>

      <Field label={t('timeline.label')} helper={t('timeline.helper')} error={errors.timeline}>
        <div className="flex flex-col gap-3">
          {TIMELINE_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`timeline.${key}`)}
              name="timeline"
              selected={timeline === key}
              hasError={!!errors.timeline}
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
