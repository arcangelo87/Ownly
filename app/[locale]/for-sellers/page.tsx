import { getTranslations } from 'next-intl/server';
import { Logo } from '@/components/ui/Logo';
import { SellerLandingFaq } from '@/components/marketing/SellerLandingFaq';
import { SellerLandingForm } from '@/components/marketing/SellerLandingForm';

export default async function ForSellersPage() {
  const t = await getTranslations('sellerLanding');

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    { q: t('faq.q9'), a: t('faq.a9') },
    { q: t('faq.q10'), a: t('faq.a10') },
    { q: t('faq.q11'), a: t('faq.a11') },
  ];

  const contactLabels = {
    name: t('contact.nameLabel'),
    email: t('contact.emailLabel'),
    phone: t('contact.phoneLabel'),
    message: t('contact.messageLabel'),
    cta: t('contact.cta'),
    success: t('contact.success'),
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col px-8 md:px-16 pt-10 pb-20">
        <div className="mb-auto">
          <Logo width={96} className="text-[var(--color-text)]" />
        </div>
        <div className="max-w-2xl mt-20">
          <h1 className="font-[family-name:var(--font-serif)] text-[48px] md:text-[64px] font-semibold leading-[1.1] tracking-[-0.5px] mb-8">
            {t('hero.h1')}
          </h1>
          <p className="text-[17px] text-[var(--color-muted)] leading-[1.7] mb-10 max-w-lg">
            {t('hero.sub')}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-text)] text-[var(--color-bg)] text-[15px] font-medium rounded-[4px] hover:opacity-80 transition-opacity"
          >
            {t('hero.cta')}
          </a>
          <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('hero.supporting')}</p>
        </div>
      </section>

      {/* ── Who we work with ─────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-20 border-t border-[var(--color-border)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-4">
            {t('focus.eyebrow')}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.15] mb-14">
            {t('focus.heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Col 1 */}
            <div>
              <div className="mb-3 text-[var(--color-accent)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="19" cy="7" r="2"/><path d="M23 21v-1a3 3 0 0 0-2-2.83"/>
                </svg>
              </div>
              <p className="font-semibold text-[15px] mb-2">{t('focus.col1Label')}</p>
              <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{t('focus.col1Body')}</p>
            </div>
            {/* Col 2 */}
            <div>
              <div className="mb-3 text-[var(--color-accent)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <p className="font-semibold text-[15px] mb-2">{t('focus.col2Label')}</p>
              <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{t('focus.col2Body')}</p>
            </div>
            {/* Col 3 */}
            <div>
              <div className="mb-3 text-[var(--color-accent)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <p className="font-semibold text-[15px] mb-2">{t('focus.col3Label')}</p>
              <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{t('focus.col3Body')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-20 border-t border-[var(--color-border)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-4">
            {t('process.eyebrow')}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.15] mb-14">
            {t('process.heading')}
          </h2>
          <div className="flex flex-col gap-12">
            {[
              {
                num: '01',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 5.97 5.97l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17.92z"/>
                  </svg>
                ),
                label: t('process.step1Label'),
                body: t('process.step1Body'),
              },
              {
                num: '02',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                ),
                label: t('process.step2Label'),
                body: t('process.step2Body'),
              },
              {
                num: '03',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                label: t('process.step3Label'),
                body: t('process.step3Body'),
              },
            ].map(({ num, icon, label, body }) => (
              <div key={num} className="grid grid-cols-[48px_1fr] gap-6 items-start">
                <span className="font-[family-name:var(--font-mono)] text-[22px] text-[var(--color-muted)] opacity-60 pt-0.5">
                  {num}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                    {icon}
                    <p className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)]">
                      {label}
                    </p>
                  </div>
                  <p className="text-[15px] text-[var(--color-muted)] leading-[1.7]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="px-8 md:px-16 py-20 border-t border-[var(--color-border)]">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-4">
            {t('faq.eyebrow')}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.15] mb-12">
            {t('faq.heading')}
          </h2>
          <SellerLandingFaq items={faqItems} />
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <section id="contact" className="px-8 md:px-16 py-20 border-t border-[var(--color-border)]">
        <div className="max-w-lg">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-4">
            {t('contact.eyebrow')}
          </p>
          <h2 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.15] mb-4">
            {t('contact.heading')}
          </h2>
          <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-10">
            {t('contact.sub')}
          </p>
          <SellerLandingForm labels={contactLabels} />
        </div>
      </section>

    </div>
  );
}
