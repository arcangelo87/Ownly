'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PhotoUpload } from '@/components/seller/PhotoUpload';
import { REGIONS } from '@/lib/regions';
import { createClient } from '@/lib/supabase/client';
import type { Step1Data } from '@/types';

const SECTORS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'wholesale', label: 'Wholesale & Distribution' },
  { value: 'construction', label: 'Construction & Engineering' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
];

interface Step1BusinessBasicsProps {
  onComplete: (listingId: string, photos: File[]) => void;
}

export function Step1BusinessBasics({ onComplete }: Step1BusinessBasicsProps) {
  const t = useTranslations('seller.step1');

  const [data, setData] = useState<Step1Data>({
    business_name: '',
    country: '',
    region: '',
    sector: '',
    year_founded: '',
    photos: [],
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step1Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Step1Data>(key: K, value: Step1Data[K]) {
    if (key === 'country') {
      setData((prev) => ({ ...prev, country: value as string, region: '' }));
    } else {
      setData((prev) => ({ ...prev, [key]: value }));
    }
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step1Data, string>> = {};
    if (!data.country) next.country = t('errors.countryRequired');
    if (data.country && !data.region) next.region = t('errors.regionRequired');
    if (!data.sector) next.sector = t('errors.sectorRequired');
    const year = parseInt(data.year_founded);
    if (!data.year_founded || isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
      next.year_founded = t('errors.yearRequired');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: row, error } = await supabase
        .from('listings')
        .insert({
          business_name: data.business_name || null,
          country: data.country,
          region: data.region,
          sector: data.sector,
          year_founded: parseInt(data.year_founded),
        })
        .select('id')
        .single();

      if (error) throw error;
      onComplete(row.id, data.photos);
    } catch (err) {
      console.error('[Step1] Supabase insert failed:', err);
      setErrors({ sector: 'Something went wrong. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  const regions = data.country ? REGIONS[data.country] ?? [] : [];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">

        {/* Business name — full width */}
        <div className="sm:col-span-2">
          <Field label={t('businessName.label')} helper={t('businessName.helper')} optional>
            <Input
              id="businessName"
              value={data.business_name}
              onChange={(e) => set('business_name', e.target.value)}
              placeholder={t('businessName.placeholder')}
            />
          </Field>
        </div>

        {/* Country */}
        <Field label={t('country.label')} helper={t('country.helper')} error={errors.country}>
          <NativeSelect
            id="country"
            value={data.country}
            onChange={(v) => set('country', v)}
            placeholder={t('country.placeholder')}
            hasError={!!errors.country}
            options={[
              { value: 'IT', label: 'Italy' },
              { value: 'PT', label: 'Portugal' },
            ]}
          />
        </Field>

        {/* Region */}
        <Field label={t('region.label')} helper={t('region.helper')} error={errors.region}>
          <NativeSelect
            id="region"
            value={data.region}
            onChange={(v) => set('region', v)}
            placeholder={t('region.placeholder')}
            hasError={!!errors.region}
            disabled={!data.country}
            options={regions.map((r) => ({ value: r, label: r }))}
          />
        </Field>

        {/* Sector — full width */}
        <div className="sm:col-span-2">
          <Field label={t('sector.label')} helper={t('sector.helper')} error={errors.sector}>
            <NativeSelect
              id="sector"
              value={data.sector}
              onChange={(v) => set('sector', v)}
              placeholder={t('sector.placeholder')}
              hasError={!!errors.sector}
              options={SECTORS}
            />
          </Field>
        </div>

        {/* Year founded — half width */}
        <Field
          label={t('yearFounded.label')}
          helper={t('yearFounded.helper')}
          error={errors.year_founded}
        >
          <Input
            id="yearFounded"
            inputMode="numeric"
            maxLength={4}
            value={data.year_founded}
            onChange={(e) => set('year_founded', e.target.value.replace(/\D/g, ''))}
            placeholder={t('yearFounded.placeholder')}
            className={errors.year_founded ? 'border-red-600' : ''}
          />
        </Field>
      </div>

      {/* Photos */}
      <div className="mt-10 border-t border-[var(--color-border)] pt-8">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--color-muted)]">
          {t('photos.label')}
        </p>
        <PhotoUpload
          files={data.photos}
          onChange={(photos) => set('photos', photos)}
        />
      </div>

      <div className="mt-10 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : t('continue')}
        </Button>
      </div>
    </form>
  );
}

/* ── small local helpers ── */

function Field({
  label,
  helper,
  error,
  optional,
  children,
}: {
  label: string;
  helper: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>
        {label}
        {optional && (
          <span className="font-normal text-[var(--color-muted)]"> (optional)</span>
        )}
      </Label>
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
  disabled,
  hasError,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
  hasError?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          'w-full appearance-none rounded-md border bg-white pl-3 pr-8 py-[10px] text-sm outline-none transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError
            ? 'border-red-600'
            : 'border-[var(--color-border)] focus:border-[var(--color-text)]',
          !value ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]',
        ].join(' ')}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
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
