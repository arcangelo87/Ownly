import { getTranslations } from 'next-intl/server';
import { WaitlistForm } from '@/components/marketing/WaitlistForm';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const t = await getTranslations('waitlist');

  const trustItems = [
    {
      title: t('trust1Title'),
      desc: t('trust1Desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="6" y="3" width="20" height="26" rx="2" />
          <line x1="11" y1="10" x2="21" y2="10" />
          <line x1="11" y1="15" x2="21" y2="15" />
          <polyline points="11,21 14,24 21,19" />
        </svg>
      ),
    },
    {
      title: t('trust2Title'),
      desc: t('trust2Desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="14" cy="14" r="9" />
          <line x1="21" y1="21" x2="28" y2="28" />
          <line x1="10" y1="14" x2="18" y2="14" />
          <line x1="14" y1="10" x2="14" y2="18" />
        </svg>
      ),
    },
    {
      title: t('trust3Title'),
      desc: t('trust3Desc'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="16" cy="16" r="10" />
          <circle cx="16" cy="16" r="4" />
          <line x1="16" y1="2" x2="16" y2="8" />
          <line x1="16" y1="24" x2="16" y2="30" />
          <line x1="2" y1="16" x2="8" y2="16" />
          <line x1="24" y1="16" x2="30" y2="16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center px-6 py-20 md:py-28">
      <div className="w-full max-w-[520px] flex flex-col items-center text-center">

        {/* Beta pill */}
        <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
          {t('badge')}
        </div>

        {/* Headline */}
        <h1 className="font-[family-name:var(--font-serif)] text-[42px] md:text-[52px] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--color-text)] mb-5">
          {t('h1')}
        </h1>

        {/* Sub */}
        <p className="text-[17px] text-[var(--color-muted)] leading-[1.65] mb-10 max-w-[460px]">
          {t('sub')}
        </p>

        {/* Form */}
        <WaitlistForm />

        {/* Divider */}
        <div className="w-full h-px bg-[var(--color-border)] my-12" />

        {/* Trust bullets */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          {trustItems.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <div className="text-[var(--color-accent)] mb-1">{item.icon}</div>
              <p className="font-[family-name:var(--font-serif)] text-[15px] font-semibold text-[var(--color-text)]">
                {item.title}
              </p>
              <p className="text-[13px] text-[var(--color-muted)] leading-[1.6]">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
