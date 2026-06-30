'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitClaim } from '@/app/actions/claim';

export function ClaimForm({ slug }: { slug: string }) {
  const t = useTranslations('claim');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const attribution = useRef<{
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }>(
    typeof window === 'undefined'
      ? {}
      : (() => {
          const params = new URLSearchParams(window.location.search);
          return {
            referrer: document.referrer || undefined,
            utmSource: params.get('utm_source') || undefined,
            utmMedium: params.get('utm_medium') || undefined,
            utmCampaign: params.get('utm_campaign') || undefined,
          };
        })()
  ).current;

  function validate() {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t('errors.nameRequired');
    if (!email.trim()) next.email = t('errors.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = t('errors.emailInvalid');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitClaim({
        slug,
        name,
        email,
        message: message || undefined,
        referrer: attribution.referrer,
        utmSource: attribution.utmSource,
        utmMedium: attribution.utmMedium,
        utmCampaign: attribution.utmCampaign,
      });
      setSuccess(true);
    } catch {
      setErrors({ submit: t('errors.submitFailed') });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-md border border-[var(--color-border)] bg-white px-5 py-8 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF1ED]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 5" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-[14px] font-semibold">{t('successTitle')}</p>
        <p className="mt-1 text-[13px] text-[var(--color-muted)]">{t('successBody')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FieldRow label={t('name')} error={errors.name}>
        <Input
          placeholder={t('namePlaceholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
        />
      </FieldRow>

      <FieldRow label={t('email')} error={errors.email}>
        <Input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? 'border-red-500' : ''}
        />
      </FieldRow>

      <div className="flex flex-col gap-1.5">
        <Label>{t('message')}</Label>
        <textarea
          placeholder={t('messagePlaceholder')}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-md border border-[var(--color-border)] bg-white px-3 py-[10px] text-sm outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-text)]"
        />
      </div>

      {errors.submit && (
        <p className="text-[12px] text-red-600">{errors.submit}</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}

function FieldRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
