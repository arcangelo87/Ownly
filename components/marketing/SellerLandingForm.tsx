'use client';

import { useState } from 'react';
import { submitContact } from '@/app/actions/contact';

interface Props {
  labels: {
    name: string;
    email: string;
    phone: string;
    message: string;
    cta: string;
    success: string;
  };
}

export function SellerLandingForm({ labels }: Props) {
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
      <p className="text-[15px] text-[var(--color-text)] py-4">{labels.success}</p>
    );
  }

  const fieldClass =
    'w-full border border-[var(--color-border)] rounded-[4px] px-3 py-2.5 text-[14px] text-[var(--color-text)] bg-[var(--color-bg)] focus:outline-none focus:border-[var(--color-accent)]';
  const labelClass =
    'flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div>
        <label className={labelClass}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          {labels.name}
        </label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
          {labels.email}
        </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 5.97 5.97l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
          {labels.phone}
        </label>
        <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} className={fieldClass} />
      </div>

      <div>
        <label className={labelClass}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          {labels.message}
        </label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={5} className={`${fieldClass} resize-none`} />
      </div>

      {error && <p className="text-[13px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-fit inline-flex justify-center items-center gap-2 px-6 py-3 bg-[var(--color-accent)] text-white text-[14px] font-medium rounded-[4px] hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {loading ? '...' : labels.cta}
      </button>
    </form>
  );
}
