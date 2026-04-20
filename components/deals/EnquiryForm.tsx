'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { submitEnquiry } from '@/app/actions/deals';

interface EnquiryFormProps {
  listingId: string;
}

export function EnquiryForm({ listingId }: EnquiryFormProps) {
  const t = useTranslations('deals.enquiry');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      await submitEnquiry({
        listing_id: listingId,
        name,
        email,
        phone: phone || undefined,
        message: message || undefined,
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
    <div className="rounded-md border border-[var(--color-border)] bg-white px-5 py-5">
      <h2 className="mb-4 font-serif text-[18px] font-medium tracking-[-0.01em]">{t('title')}</h2>
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

        <FieldRow label={`${t('phone')} (${t('phonePlaceholder').toLowerCase()})`}>
          <Input
            type="tel"
            placeholder="+39 or +351…"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FieldRow>

        <div className="flex flex-col gap-1.5">
          <Label>{t('message')} <span className="font-normal text-[var(--color-muted)]">({t('phonePlaceholder').toLowerCase()})</span></Label>
          <textarea
            placeholder={t('messagePlaceholder')}
            rows={3}
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
        <p className="text-center text-[11px] leading-[1.5] text-[var(--color-muted)]">
          {t('reassurance')}
        </p>
      </form>
    </div>
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
