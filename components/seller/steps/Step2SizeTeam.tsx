'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const REVENUE_VALUES = ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', 'over_5m'] as const;
const EBITDA_VALUES = ['below_10', '10_20', '20_35', 'above_35', 'not_sure'] as const;
const EMPLOYEE_VALUES = ['just_me', '2_5', '6_15', '16_30', '30_plus'] as const;
const INVOLVEMENT_VALUES = ['full_time', 'part_time', 'advisory', 'minimal'] as const;

interface Step2Data {
  revenue_range: string;
  ebitda_margin: string;
  employee_count: string;
  owner_involvement: string;
}

interface Step2SizeTeamProps {
  listingId: string;
  onComplete: () => void;
}

export function Step2SizeTeam({ listingId, onComplete }: Step2SizeTeamProps) {
  const t = useTranslations('seller.step2');
  const tDeals = useTranslations('deals');

  const REVENUE_OPTIONS = REVENUE_VALUES.map((v) => ({ value: v, label: t(`revenueOptions.${v}`) }));
  const EBITDA_OPTIONS = EBITDA_VALUES.map((v) => ({ value: v, label: t(`ebitdaOptions.${v}`) }));
  const EMPLOYEE_OPTIONS = EMPLOYEE_VALUES.map((v) => ({ value: v, label: t(`employeeOptions.${v}`) }));
  const INVOLVEMENT_OPTIONS = INVOLVEMENT_VALUES.map((v) => ({ value: v, label: tDeals(`ownerInvolvementValues.${v}`) }));

  const [data, setData] = useState<Step2Data>({
    revenue_range: '',
    ebitda_margin: '',
    employee_count: '',
    owner_involvement: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step2Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Step2Data>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step2Data, string>> = {};
    if (!data.revenue_range) next.revenue_range = t('errors.revenueRequired');
    if (!data.ebitda_margin) next.ebitda_margin = t('errors.ebitdaRequired');
    if (!data.employee_count) next.employee_count = t('errors.employeesRequired');
    if (!data.owner_involvement) next.owner_involvement = t('errors.involvementRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('listings')
        .update({
          revenue_range: data.revenue_range,
          ebitda_margin: data.ebitda_margin,
          employee_count: data.employee_count,
          owner_involvement: data.owner_involvement,
        })
        .eq('id', listingId);

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('[Step2] Supabase update failed:', err);
      setErrors({ employee_count: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <p className="text-sm text-[var(--color-muted)]">{t('helper')}</p>

      <Field label={t('revenue.label')} helper={t('revenue.helper')} error={errors.revenue_range}>
        <NativeSelect
          id="revenue"
          value={data.revenue_range}
          onChange={(v) => set('revenue_range', v)}
          placeholder={t('revenue.placeholder')}
          hasError={!!errors.revenue_range}
          options={REVENUE_OPTIONS}
        />
      </Field>

      <Field label={t('ebitda.label')} helper={t('ebitda.helper')} error={errors.ebitda_margin}>
        <NativeSelect
          id="ebitda"
          value={data.ebitda_margin}
          onChange={(v) => set('ebitda_margin', v)}
          placeholder={t('ebitda.placeholder')}
          hasError={!!errors.ebitda_margin}
          options={EBITDA_OPTIONS}
        />
      </Field>

      <Field label={t('employees.label')} helper={t('employees.helper')} error={errors.employee_count}>
        <NativeSelect
          id="employees"
          value={data.employee_count}
          onChange={(v) => set('employee_count', v)}
          placeholder={t('employees.placeholder')}
          hasError={!!errors.employee_count}
          options={EMPLOYEE_OPTIONS}
        />
      </Field>

      <Field label={t('ownerInvolvement.label')} helper={t('ownerInvolvement.helper')} error={errors.owner_involvement}>
        <NativeSelect
          id="owner_involvement"
          value={data.owner_involvement}
          onChange={(v) => set('owner_involvement', v)}
          placeholder={t('ownerInvolvement.placeholder')}
          hasError={!!errors.owner_involvement}
          options={INVOLVEMENT_OPTIONS}
        />
      </Field>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : t('continue')}
        </Button>
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
          <path d="M1 1L5 5L9 1" stroke="var(--color-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
