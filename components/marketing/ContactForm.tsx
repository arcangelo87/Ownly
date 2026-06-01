'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { submitContact } from '@/app/actions/contact';

export function ContactForm() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await submitContact({ name, email, telephone, message });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <p className="text-[15px] text-[var(--color-text)]">{t('success')}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">{t('nameLabel')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-[var(--color-border)] rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">{t('emailLabel')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[var(--color-border)] rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">{t('phoneLabel')}</label>
        <input
          type="tel"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="border border-[var(--color-border)] rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[var(--color-text)]">{t('messageLabel')}</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="border border-[var(--color-border)] rounded-[4px] px-3 py-2 text-[14px] text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)] resize-none"
        />
      </div>

      {error && <p className="text-[13px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center items-center px-6 py-3 bg-[var(--color-accent)] text-white text-[14px] font-medium rounded-[4px] hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading ? '...' : t('cta')}
      </button>
    </form>
  );
}
