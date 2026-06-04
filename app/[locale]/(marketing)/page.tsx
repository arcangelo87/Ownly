import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { WaitlistForm } from '@/components/marketing/WaitlistForm';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('waitlist');

  const features = [
    { title: t('feat1Title'), desc: t('feat1Desc') },
    { title: t('feat2Title'), desc: t('feat2Desc') },
    { title: t('feat3Title'), desc: t('feat3Desc') },
    { title: t('feat4Title'), desc: t('feat4Desc') },
  ];

  const steps = [
    { num: t('step1Num'), title: t('step1Title'), desc: t('step1Desc') },
    { num: t('step2Num'), title: t('step2Title'), desc: t('step2Desc') },
    { num: t('step3Num'), title: t('step3Title'), desc: t('step3Desc') },
  ];

  const previewListings = [
    { sector: 'Food & Beverage', location: 'Cascais, Portugal', title: 'Traditional Portuguese restaurant', price: 'Asking price < €500k' },
    { sector: 'Food & Beverage', location: 'Turin, Italy', title: 'Artisan bakery and café', price: 'Asking price < €500k' },
    { sector: 'Professional Services', location: 'Lisbon, Portugal', title: 'Established accounting firm', price: 'Asking price €500k to €2M' },
  ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-24 md:py-32 px-6 text-center bg-[var(--color-bg)]">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-muted)] mb-6">
            {t('eyebrow')}
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-[52px] md:text-[68px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--color-text)] mb-6">
            {t('h1line1')}{' '}
            <em className="italic not-italic text-[var(--color-terracotta)]" style={{ fontStyle: 'italic' }}>
              {t('h1accent')}
            </em>
          </h1>
          <p className="text-[18px] text-[var(--color-muted)] leading-[1.65] mb-10 max-w-xl mx-auto">
            {t('sub')}
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-5">
            <Link
              href={`#waitlist`}
              className="inline-flex items-center px-7 py-3.5 bg-[var(--color-text)] text-white text-[15px] font-medium rounded-full hover:opacity-85 transition-opacity"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`#how`}
              className="inline-flex items-center px-7 py-3.5 border border-[var(--color-border)] text-[var(--color-text)] text-[15px] font-medium rounded-full hover:bg-[var(--color-surface)] transition-colors"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
          <p className="text-[13px] text-[var(--color-muted)]">{t('socialProof')}</p>
        </div>
      </section>

      {/* ── Preview listings ── */}
      <section className="px-6 pb-20 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-[family-name:var(--font-serif)] text-[22px] font-semibold text-[var(--color-text)]">
              {t('previewHeading')}
            </h2>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {t('previewLabel')}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewListings.map((l) => (
              <div key={l.title} className="group relative overflow-hidden rounded-[8px] border border-[var(--color-border)]">
                {/* Blurred placeholder image */}
                <div className="h-[200px] bg-[var(--color-surface)] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-[var(--color-surface)]" style={{ filter: 'blur(0px)' }} />
                  </div>
                  <div className="absolute inset-0 bg-[var(--color-text)]/20" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-[var(--color-bg)] text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text)] rounded-full">
                      {t('previewUnlocks')}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-[var(--color-bg)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)] mb-1">
                    {l.sector} · {l.location}
                  </p>
                  <p className="font-[family-name:var(--font-serif)] text-[17px] font-semibold text-[var(--color-text)] mb-1">
                    {l.title}
                  </p>
                  <p className="text-[13px] text-[var(--color-muted)]">{l.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] text-[var(--color-text)] text-center mb-16">
            {t('howHeading')}
          </h2>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {steps.map((step) => (
              <div key={step.num}>
                <p className="text-[13px] font-semibold text-[var(--color-terracotta)] mb-3">{step.num}</p>
                <h3 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.65]">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="border-t border-[var(--color-border)] pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title}>
                <h4 className="font-[family-name:var(--font-serif)] text-[16px] font-semibold text-[var(--color-text)] mb-2">
                  {f.title}
                </h4>
                <p className="text-[13px] text-[var(--color-muted)] leading-[1.65]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist form ── */}
      <section id="waitlist" className="py-20 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="font-[family-name:var(--font-serif)] text-[32px] md:text-[44px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-4">
            {t('formHeading')}
          </h2>
          <p className="text-[17px] text-[var(--color-muted)] leading-[1.65]">{t('formSub')}</p>
        </div>
        <WaitlistForm />
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 bg-[var(--color-surface)]">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-[family-name:var(--font-serif)] text-[32px] md:text-[40px] font-semibold tracking-[-0.02em] text-[var(--color-text)] text-center mb-12">
            {t('faqHeading')}
          </h2>
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
