'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

const PRICE_VALUES = ['under_500k', '500k_1m', '1m_2_5m', '2_5m_5m', '5m_10m', 'over_10m'] as const;
const TIMELINE_VALUES = ['ready_now', '6_12_months', '1_2_years', 'exploring'] as const;

interface Step3Data {
  asking_price: string;
  partial_sale: string;
  timeline: string;
}

interface Step3TheDealProps {
  listingId: string;
  onComplete: () => void;
}

export function Step3TheDeal({ listingId, onComplete }: Step3TheDealProps) {
  const t = useTranslations('seller.step3');
  const tSeller = useTranslations('seller');

  const PRICE_OPTIONS = PRICE_VALUES.map((v) => ({ value: v, label: t(`priceOptions.${v}`) }));
  const TIMELINE_OPTIONS = TIMELINE_VALUES.map((v) => ({ value: v, label: t(`timelineOptions.${v}`) }));

  const [data, setData] = useState<Step3Data>({
    asking_price: '',
    partial_sale: '',
    timeline: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step3Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Step3Data>(key: K, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step3Data, string>> = {};
    if (!data.asking_price) next.asking_price = t('errors.priceRequired');
    if (!data.partial_sale) next.partial_sale = t('errors.partialRequired');
    if (!data.timeline) next.timeline = t('errors.timelineRequired');
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
          asking_price: data.asking_price,
          partial_sale: data.partial_sale,
          timeline: data.timeline,
        })
        .eq('id', listingId);

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('[Step3] Supabase update failed:', err);
      setErrors({ timeline: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      <Field label={t('price.label')} helper={t('price.helper')} error={errors.asking_price}>
        <NativeSelect
          id="askingPrice"
          value={data.asking_price}
          onChange={(v) => set('asking_price', v)}
          placeholder={t('price.placeholder')}
          hasError={!!errors.asking_price}
          options={PRICE_OPTIONS}
        />
      </Field>

      <Field label={t('partialSale.label')} helper={t('partialSale.helper')} error={errors.partial_sale}>
        <div className="flex flex-col gap-3">
          {[
            { value: 'open_to_minority', label: t('partialSale.openToMinority') },
            { value: 'full_sale_only', label: t('partialSale.fullSaleOnly') },
          ].map((opt) => (
            <label
              key={opt.value}
              className={[
                'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                data.partial_sale === opt.value
                  ? 'border-[var(--color-accent)] bg-[#EBF1ED] text-[var(--color-text)]'
                  : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]',
                errors.partial_sale ? 'border-red-600' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
                  data.partial_sale === opt.value
                    ? 'border-[var(--color-accent)]'
                    : 'border-[var(--color-border)]',
                ].join(' ')}
              >
                {data.partial_sale === opt.value && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                )}
              </span>
              <input
                type="radio"
                name="partialSale"
                value={opt.value}
                checked={data.partial_sale === opt.value}
                onChange={() => set('partial_sale', opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label={t('timeline.label')} helper={t('timeline.helper')} error={errors.timeline}>
        <NativeSelect
          id="timeline"
          value={data.timeline}
          onChange={(v) => set('timeline', v)}
          placeholder={t('timeline.placeholder')}
          hasError={!!errors.timeline}
          options={TIMELINE_OPTIONS}
        />
      </Field>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit" disabled={saving}>
          {saving ? tSeller('ui.saving') : t('continue')}
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
