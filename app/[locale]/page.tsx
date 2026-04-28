import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('homepage');
  const sellHref = `/${locale}/sell`;

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center justify-between px-12 h-16">
        <Link href={`/${locale}`} className="font-serif text-[22px] font-bold tracking-[-0.02em]">
          Ownly
        </Link>
        <div className="flex items-center gap-8">
          <Link href={sellHref} className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {t('nav.forSellers')}
          </Link>
          <a href="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {t('nav.forBrokers')}
          </a>
          <a href="#" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            {t('nav.browseDeals')}
          </a>
          <Link
            href={sellHref}
            className="bg-[var(--color-accent)] text-white text-sm font-medium px-5 py-2 rounded-[4px] hover:opacity-[0.88] transition-opacity"
          >
            {t('nav.listYourBusiness')}
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-24">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="max-w-[760px]">
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-accent)] mb-6">
              {t('hero.eyebrow')}
            </p>
            <h1 className="font-serif text-[clamp(40px,5.5vw,64px)] font-medium leading-[1.08] tracking-[-0.02em] mb-7">
              {t('hero.h1')}
            </h1>
            <p className="text-lg font-light leading-[1.7] text-[var(--color-muted)] max-w-[620px] mb-11">
              <strong className="text-[var(--color-text)] font-normal">{t('hero.subHeadlineBold')}</strong>{' '}
              {t('hero.subHeadlineRest')}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={sellHref}
                className="bg-[var(--color-accent)] text-white text-[15px] font-medium px-7 py-3 rounded-[4px] hover:opacity-[0.88] transition-opacity inline-flex items-center"
              >
                {t('hero.cta')}
              </Link>
              <a
                href="#"
                className="text-[15px] font-normal text-[var(--color-text)] py-3 border-b border-[var(--color-border)] inline-flex items-center hover:border-[var(--color-muted)] transition-colors"
              >
                {t('hero.ctaSecondary')}
              </a>
            </div>
            <div className="flex gap-5 mt-5">
              {[t('hero.reassurance1'), t('hero.reassurance2'), t('hero.reassurance3')].map((line) => (
                <span key={line} className="text-[13px] text-[var(--color-muted)] before:content-['✓_'] before:text-[var(--color-accent)] before:font-medium">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-24 border-t border-[var(--color-border)]">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-serif text-[clamp(22px,3.2vw,36px)] italic font-normal leading-[1.45] max-w-[820px] mb-9">
            &ldquo;{t('problem.quote')}&rdquo;
          </p>
          <p className="text-base text-[var(--color-muted)] leading-[1.7] max-w-[560px] mb-16 border-l-2 border-[var(--color-accent)] pl-5">
            {t('problem.response1')}<br />
            {t('problem.response2')}<br />
            {t('problem.response3')}
          </p>
          <div className="grid grid-cols-2 gap-12 max-w-[680px]">
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-accent)] mb-2">
                {t('problem.brokersLabel')}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] italic leading-[1.6]">
                {t('problem.brokersQuote')}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-accent)] mb-2">
                {t('problem.buyersLabel')}
              </p>
              <p className="text-[15px] text-[var(--color-muted)] italic leading-[1.6]">
                {t('problem.buyersQuote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-muted)] mb-12">
            {t('howItWorks.label')}
          </p>
          <div className="grid grid-cols-3 gap-12">
            {(
              [
                { num: t('howItWorks.step1Num'), title: t('howItWorks.step1Title'), body: t('howItWorks.step1Body') },
                { num: t('howItWorks.step2Num'), title: t('howItWorks.step2Title'), body: t('howItWorks.step2Body') },
                { num: t('howItWorks.step3Num'), title: t('howItWorks.step3Title'), body: t('howItWorks.step3Body') },
              ] as const
            ).map((step) => (
              <div key={step.num}>
                <div className="font-serif text-5xl font-normal text-[var(--color-accent)] opacity-25 leading-none mb-5">
                  {step.num}
                </div>
                <h3 className="font-serif text-xl font-medium leading-[1.3] mb-3">{step.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-[1.65]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OWNLY ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="grid grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="font-serif text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.2] tracking-[-0.01em] mb-7">
                {t('why.heading')}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.8] mb-4">{t('why.body1')}</p>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.8]">{t('why.body2')}</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-md overflow-hidden">
              {(
                [
                  { stat: t('why.proof1Stat'), label: t('why.proof1Label') },
                  { stat: t('why.proof2Stat'), label: t('why.proof2Label') },
                  { stat: t('why.proof3Stat'), label: t('why.proof3Label') },
                  { stat: t('why.proof4Stat'), label: t('why.proof4Label') },
                ] as const
              ).map((item) => (
                <div key={item.stat} className="bg-[var(--color-bg)] p-6">
                  <div className="font-serif text-xl font-medium text-[var(--color-accent)] mb-1.5">{item.stat}</div>
                  <div className="text-[13px] text-[var(--color-muted)] leading-[1.5]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-[1100px] mx-auto px-12">
          <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--color-muted)] mb-12">
            {t('pricing.label')}
          </p>
          <div className="grid grid-cols-2 gap-6">
            {/* Standard */}
            <div className="border border-[var(--color-border)] rounded-md p-10 bg-[var(--color-bg)]">
              <div className="font-serif text-[22px] font-medium mb-2">{t('pricing.plan1Name')}</div>
              <div className="font-mono text-[28px] font-medium text-[var(--color-accent)] mb-1">{t('pricing.plan1Price')}</div>
              <div className="text-[13px] text-[var(--color-muted)] mb-7">{t('pricing.plan1PriceNote')}</div>
              <p className="text-sm text-[var(--color-muted)] leading-[1.65] mb-7 pb-7 border-b border-[var(--color-border)]">
                {t('pricing.plan1Desc')}
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[t('pricing.plan1Feature1'), t('pricing.plan1Feature2'), t('pricing.plan1Feature3'), t('pricing.plan1Feature4')].map((f) => (
                  <li key={f} className="text-sm flex gap-2.5 items-start">
                    <span className="text-[var(--color-accent)] font-medium shrink-0 mt-[1px]">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={sellHref}
                className="block text-center py-3 px-6 rounded-[4px] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-muted)] transition-colors"
              >
                {t('pricing.plan1Cta')}
              </Link>
            </div>

            {/* Assisted */}
            <div className="border border-[var(--color-accent)] rounded-md p-10 bg-white">
              <div className="font-serif text-[22px] font-medium mb-2">{t('pricing.plan2Name')}</div>
              <div className="font-mono text-[28px] font-medium text-[var(--color-accent)] mb-1">{t('pricing.plan2Price')}</div>
              <div className="text-[13px] text-[var(--color-muted)] mb-7">{t('pricing.plan2PriceNote')}</div>
              <p className="text-sm text-[var(--color-muted)] leading-[1.65] mb-7 pb-7 border-b border-[var(--color-border)]">
                {t('pricing.plan2Desc')}
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  t('pricing.plan2Feature1'),
                  t('pricing.plan2Feature2'),
                  t('pricing.plan2Feature3'),
                  t('pricing.plan2Feature4'),
                  t('pricing.plan2Feature5'),
                ].map((f) => (
                  <li key={f} className="text-sm flex gap-2.5 items-start">
                    <span className="text-[var(--color-accent)] font-medium shrink-0 mt-[1px]">→</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="block text-center py-3 px-6 rounded-[4px] text-sm font-medium bg-[var(--color-accent)] text-white hover:opacity-[0.88] transition-opacity"
              >
                {t('pricing.plan2Cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING BUYER ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-12">
          <div className="max-w-[580px]">
            <span className="inline-block font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--color-accent)] border border-[var(--color-accent)] rounded-[2px] px-2 py-0.5 mb-6">
              {t('buyer.tag')}
            </span>
            <h2 className="font-serif text-[clamp(22px,2.8vw,32px)] font-medium leading-[1.3] mb-5">
              {t('buyer.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('buyer.body1')}</p>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-8">{t('buyer.body2')}</p>
            <a
              href="#"
              className="inline-flex items-center text-sm text-[var(--color-text)] border border-[var(--color-border)] px-5 py-2 rounded-[4px] hover:border-[var(--color-muted)] transition-colors"
            >
              {t('buyer.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-24 bg-[var(--color-surface)] border-t border-[var(--color-border)] text-center">
        <div className="max-w-[1100px] mx-auto px-12">
          <h2 className="font-serif text-[clamp(24px,3.2vw,40px)] font-medium leading-[1.25] tracking-[-0.01em] max-w-[640px] mx-auto mb-8">
            {t('footerCta.heading')}
          </h2>
          <Link
            href={sellHref}
            className="inline-flex items-center bg-[var(--color-accent)] text-white text-[15px] font-medium px-7 py-3 rounded-[4px] hover:opacity-[0.88] transition-opacity"
          >
            {t('footerCta.cta')}
          </Link>
          <div className="flex items-center justify-center gap-6 mt-4">
            {[t('footerCta.reassurance1'), t('footerCta.reassurance2'), t('footerCta.reassurance3')].map((line) => (
              <span key={line} className="text-[13px] text-[var(--color-muted)]">— {line}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--color-border)] py-8">
        <div className="max-w-[1100px] mx-auto px-12 flex items-center justify-between">
          <div className="font-serif text-lg font-bold">Ownly</div>
          <div className="flex gap-6">
            {[
              { label: t('footer.forSellers'), href: sellHref },
              { label: t('footer.forBrokers'), href: '#' },
              { label: t('footer.forBuyers'), href: '#' },
              { label: t('footer.privacy'), href: '#' },
            ].map((link) => (
              <a key={link.label} href={link.href} className="text-[13px] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-[13px] text-[var(--color-muted)]">{t('footer.copyright')}</p>
        </div>
      </footer>

    </div>
  );
}
