'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitSellerSearch } from '@/app/actions/seller-search';
import type { Step1Data } from './SellerStep1';
import type { Step2Data } from './SellerStep2';

const ROLE_VALUES = ['owner', 'coOwner', 'other'] as const;

export interface Step3Data {
  had_advisor_before: boolean | null;
  role: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface SellerStep3Props {
  step1: Step1Data;
  step2: Step2Data;
  onComplete: () => void;
}

export function SellerStep3({ step1, step2, onComplete }: SellerStep3Props) {
  const t = useTranslations('sellerSearch.step3');

  const [data, setData] = useState<Step3Data>({
    had_advisor_before: null,
    role: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [roleOther, setRoleOther] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof Step3Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Step3Data>(key: K, value: Step3Data[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step3Data, string>> = {};
    if (data.had_advisor_before === null) next.had_advisor_before = t('errors.advisorRequired');
    if (!data.role) next.role = t('errors.roleRequired');
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
      await submitSellerSearch({
        vertical: step1.vertical || null,
        vertical_other: step1.vertical_other || null,
        revenue_range: step1.revenue_range || null,
        had_valuation: step1.had_valuation || null,
        priorities: step2.priorities.length ? step2.priorities : null,
        timeline: step2.timeline || null,
        had_advisor_before: data.had_advisor_before,
        role: data.role === 'other' && roleOther.trim()
          ? `other: ${roleOther.trim()}`
          : data.role || null,
        name: data.name.trim() || null,
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        message: data.message.trim() || null,
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

      <Field label={t('hadAdvisor.label')} error={errors.had_advisor_before}>
        <div className="flex flex-col gap-3">
          {([true, false] as const).map((val) => (
            <RadioCard
              key={String(val)}
              label={t(val ? 'hadAdvisor.yes' : 'hadAdvisor.no')}
              name="had_advisor_before"
              selected={data.had_advisor_before === val}
              hasError={!!errors.had_advisor_before}
              onChange={() => set('had_advisor_before', val)}
            />
          ))}
        </div>
      </Field>

      <Field label={t('role.label')} helper={t('role.helper')} error={errors.role}>
        <div className="flex flex-col gap-3">
          {ROLE_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`role.${key}`)}
              name="role"
              selected={data.role === key}
              hasError={!!errors.role}
              onChange={() => set('role', key)}
            />
          ))}
        </div>
        {data.role === 'other' && (
          <Input
            type="text"
            value={roleOther}
            onChange={(e) => setRoleOther(e.target.value)}
            placeholder={t('role.otherPlaceholder')}
            className="mt-2"
          />
        )}
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

        <Field label={t('message.label')} helper={t('message.helper')} optional>
          <textarea
            value={data.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder={t('message.placeholder')}
            rows={4}
            className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-text)]"
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
