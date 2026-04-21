'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { uploadListingPhotos } from '@/app/actions/deals';

const REASONS = [
  { value: 'retirement', labelKey: 'reasons.retirement' },
  { value: 'growth_capital', labelKey: 'reasons.growthCapital' },
  { value: 'no_succession', labelKey: 'reasons.noSuccession' },
  { value: 'health_personal', labelKey: 'reasons.healthPersonal' },
  { value: 'market_opportunity', labelKey: 'reasons.marketOpportunity' },
  { value: 'other', labelKey: 'reasons.other' },
] as const;

interface Step4Data {
  reasons_for_sale: string[];
  business_description: string;
  strongest_point: string;
  buyer_disclosure: string;
}

interface Step4YourStoryProps {
  listingId: string;
  photos: File[];
  onComplete: () => void;
}

export function Step4YourStory({ listingId, photos, onComplete }: Step4YourStoryProps) {
  const t = useTranslations('seller.step4');

  const [data, setData] = useState<Step4Data>({
    reasons_for_sale: [],
    business_description: '',
    strongest_point: '',
    buyer_disclosure: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Step4Data, string>>>({});
  const [saving, setSaving] = useState(false);

  function toggleReason(value: string) {
    setData((prev) => ({
      ...prev,
      reasons_for_sale: prev.reasons_for_sale.includes(value)
        ? prev.reasons_for_sale.filter((r) => r !== value)
        : [...prev.reasons_for_sale, value],
    }));
    if (errors.reasons_for_sale) setErrors((prev) => ({ ...prev, reasons_for_sale: undefined }));
  }

  function setText(key: 'business_description' | 'strongest_point' | 'buyer_disclosure', value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof Step4Data, string>> = {};
    if (data.reasons_for_sale.length === 0) next.reasons_for_sale = t('errors.reasonsRequired');
    if (!data.business_description.trim()) next.business_description = t('errors.descriptionRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function uploadPhotos(): Promise<void> {
    if (photos.length === 0) return;
    const formData = new FormData();
    photos.forEach((file) => formData.append('photos', file));
    await uploadListingPhotos(listingId, formData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const supabase = createClient();

      await uploadPhotos();

      const { error } = await supabase
        .from('listings')
        .update({
          reasons_for_sale: data.reasons_for_sale,
          business_description: data.business_description.trim(),
          strongest_point: data.strongest_point.trim() || null,
          buyer_disclosure: data.buyer_disclosure.trim() || null,
          status: 'in_review',
        })
        .eq('id', listingId);

      if (error) throw error;
      onComplete();
    } catch (err) {
      console.error('[Step4] Supabase update failed:', err);
      setErrors({ business_description: t('errors.saveFailed') });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">

      {/* Reasons for sale */}
      <div className="flex flex-col gap-1.5">
        <Label>{t('reasons.label')}</Label>
        <div className="flex flex-col gap-2">
          {REASONS.map(({ value, labelKey }) => {
            const checked = data.reasons_for_sale.includes(value);
            return (
              <label
                key={value}
                className={[
                  'flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors',
                  checked
                    ? 'border-[var(--color-accent)] bg-[#EBF1ED]'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]',
                  errors.reasons_for_sale ? 'border-red-600' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-[1.5px] transition-colors',
                    checked
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      : 'border-[var(--color-border)] bg-white',
                  ].join(' ')}
                >
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  value={value}
                  checked={checked}
                  onChange={() => toggleReason(value)}
                  className="sr-only"
                />
                {t(labelKey)}
              </label>
            );
          })}
        </div>
        {errors.reasons_for_sale ? (
          <p className="text-xs text-red-600">{errors.reasons_for_sale}</p>
        ) : (
          <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{t('reasons.helper')}</p>
        )}
      </div>

      {/* Business description */}
      <div className="flex flex-col gap-1.5">
        <Label>{t('description.label')}</Label>
        <textarea
          value={data.business_description}
          onChange={(e) => setText('business_description', e.target.value)}
          placeholder={t('description.placeholder')}
          rows={5}
          className={[
            'w-full resize-none rounded-md border bg-white px-3 py-[10px] text-sm outline-none transition-colors placeholder:text-[var(--color-muted)]',
            errors.business_description
              ? 'border-red-600'
              : 'border-[var(--color-border)] focus:border-[var(--color-text)]',
          ].join(' ')}
        />
        {errors.business_description ? (
          <p className="text-xs text-red-600">{errors.business_description}</p>
        ) : (
          <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{t('description.helper')}</p>
        )}
      </div>

      {/* Strongest point (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label>
          {t('strongestPoint.label')}
          <span className="ml-1 font-normal text-[var(--color-muted)]">(optional)</span>
        </Label>
        <textarea
          value={data.strongest_point}
          onChange={(e) => setText('strongest_point', e.target.value)}
          placeholder={t('strongestPoint.placeholder')}
          rows={3}
          className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-text)]"
        />
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{t('strongestPoint.helper')}</p>
      </div>

      {/* Buyer disclosure (optional) */}
      <div className="flex flex-col gap-1.5">
        <Label>
          {t('buyerDisclosure.label')}
          <span className="ml-1 font-normal text-[var(--color-muted)]">(optional)</span>
        </Label>
        <textarea
          value={data.buyer_disclosure}
          onChange={(e) => setText('buyer_disclosure', e.target.value)}
          placeholder={t('buyerDisclosure.placeholder')}
          rows={3}
          className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-text)]"
        />
        <p className="text-xs leading-[1.5] text-[var(--color-muted)]">{t('buyerDisclosure.helper')}</p>
      </div>

      <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-8">
        <Button type="submit" disabled={saving}>
          {saving ? 'Submitting…' : t('submit')}
        </Button>
      </div>
    </form>
  );
}
