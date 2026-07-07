'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SECTOR_VALUES = [
  'manufacturing', 'food_beverage', 'hospitality_tourism', 'leisure_entertainment',
  'retail_artisan', 'health_wellness', 'automotive_transport', 'construction',
  'professional_services', 'agriculture_land', 'wholesale', 'technology',
] as const;

const FEATURED_LOCATIONS = ['portugal'] as const;

const OTHER_COUNTRY_CODES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL',
  'RO', 'SK', 'SI', 'ES', 'SE', 'GB',
] as const;

const BUDGET_VALUES = ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', '5m_10m', 'over_10m'] as const;
const FINANCING_VALUES = ['yes', 'no', 'notSure'] as const;

export interface Step1Data {
  sectors: string[];
  industry_other: string;
  locations: string[];
  budget_range: string;
  needs_financing: string;
}

interface BuyerStep1Props {
  onComplete: (data: Step1Data) => void;
}

export function BuyerStep1({ onComplete }: BuyerStep1Props) {
  const t = useTranslations('buyerSearch.step1');
  const tSectors = useTranslations('deals.sectors');

  const [sectors, setSectors] = useState<string[]>([]);
  const [otherSectorChecked, setOtherSectorChecked] = useState(false);
  const [industryOther, setIndustryOther] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [otherCountry, setOtherCountry] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [needsFinancing, setNeedsFinancing] = useState('');
  const [errors, setErrors] = useState<{ locations?: string; budget_range?: string; needs_financing?: string }>({});

  function toggleSector(value: string) {
    setSectors((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  }

  function toggleLocation(loc: string) {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
    if (errors.locations) setErrors((prev) => ({ ...prev, locations: undefined }));
  }

  function handleOtherCountry(value: string) {
    setOtherCountry(value);
    if (errors.locations) setErrors((prev) => ({ ...prev, locations: undefined }));
  }

  function handleBudget(value: string) {
    setBudgetRange(value);
    if (errors.budget_range) setErrors((prev) => ({ ...prev, budget_range: undefined }));
  }

  function handleFinancing(value: string) {
    setNeedsFinancing(value);
    if (errors.needs_financing) setErrors((prev) => ({ ...prev, needs_financing: undefined }));
  }

  function validate(): boolean {
    const next: { locations?: string; budget_range?: string; needs_financing?: string } = {};
    if (locations.length === 0 && !otherCountry) next.locations = t('errors.locationRequired');
    if (!budgetRange) next.budget_range = t('errors.budgetRequired');
    if (!needsFinancing) next.needs_financing = t('errors.financingRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onComplete({
      sectors,
      industry_other: industryOther,
      locations: [...locations, ...(otherCountry ? [otherCountry] : [])],
      budget_range: budgetRange,
      needs_financing: needsFinancing,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Sector */}
      <Field label={t('sectors.label')} helper={t('sectors.helper')}>
        <div className="grid grid-cols-2 gap-2">
          {SECTOR_VALUES.map((key) => {
            const selected = sectors.includes(key);
            return (
              <CheckboxCard
                key={key}
                label={tSectors(key)}
                checked={selected}
                onChange={() => toggleSector(key)}
              />
            );
          })}
          <CheckboxCard
            label={tSectors('other')}
            checked={otherSectorChecked}
            onChange={() => setOtherSectorChecked((v) => !v)}
          />
        </div>
        {otherSectorChecked && (
          <Input
            type="text"
            value={industryOther}
            onChange={(e) => setIndustryOther(e.target.value)}
            placeholder={t('sectorOther.placeholder')}
            className="mt-2"
          />
        )}
      </Field>

      {/* Locations */}
      <Field label={t('locations.label')} helper={t('locations.helper')} error={errors.locations}>
        <div className="flex flex-col gap-3">
          {FEATURED_LOCATIONS.map((loc) => {
            const selected = locations.includes(loc);
            return (
              <CheckboxCard
                key={loc}
                label={t(`locations.${loc}`)}
                checked={selected}
                hasError={!!errors.locations}
                onChange={() => toggleLocation(loc)}
              />
            );
          })}
        </div>
        <div className="mt-3">
          <Label className="mb-1.5 block text-xs text-[var(--color-muted)]">
            {t('locations.otherCountry.label')}
          </Label>
          <NativeSelect
            id="otherCountry"
            value={otherCountry}
            onChange={handleOtherCountry}
            placeholder={t('locations.otherCountry.placeholder')}
            hasError={!!errors.locations && locations.length === 0 && !otherCountry}
            options={OTHER_COUNTRY_CODES.map((code) => ({ value: code, label: t(`countries.${code}`) }))}
          />
        </div>
      </Field>

      {/* Budget */}
      <Field label={t('budget.label')} helper={t('budget.helper')} error={errors.budget_range}>
        <NativeSelect
          id="budget"
          value={budgetRange}
          onChange={handleBudget}
          placeholder={t('budget.placeholder')}
          hasError={!!errors.budget_range}
          options={BUDGET_VALUES.map((v) => ({ value: v, label: t(`budgetOptions.${v}`) }))}
        />
      </Field>

      {/* Financing */}
      <Field label={t('financing.label')} error={errors.needs_financing}>
        <div className="flex flex-col gap-3">
          {FINANCING_VALUES.map((key) => (
            <RadioCard
              key={key}
              label={t(`financing.${key}`)}
              name="needs_financing"
              selected={needsFinancing === key}
              hasError={!!errors.needs_financing}
              onChange={() => handleFinancing(key)}
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
