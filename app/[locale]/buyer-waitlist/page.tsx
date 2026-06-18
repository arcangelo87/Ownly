import type { Metadata } from 'next';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { TrendingUp, Settings2, ShieldCheck, Tag, EyeOff, FileSearch, Landmark, AlertTriangle, ClipboardList, Search, Users } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { FoundingForm } from '@/components/marketing/FoundingForm';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';

export const metadata: Metadata = {
  title: 'Bottega — Private beta',
  robots: { index: false, follow: false },
};

function SectionRule() {
  return <div className="w-10 h-[3px] bg-[var(--color-accent)] mt-3 mb-8" />;
}

export default function BuyerWaitlistPage() {
  const t = useTranslations('buyerWaitlist');
  const locale = useLocale();

  const whyInvestCards = [
    { Icon: TrendingUp, title: t('whyInvest.card1Title'), desc: t('whyInvest.card1Desc') },
    { Icon: Settings2, title: t('whyInvest.card2Title'), desc: t('whyInvest.card2Desc') },
    { Icon: ShieldCheck, title: t('whyInvest.card3Title'), desc: t('whyInvest.card3Desc') },
  ];

  const problemItems = [
    { Icon: Tag, title: t('problem.item1Title'), desc: t('problem.item1Desc') },
    { Icon: EyeOff, title: t('problem.item2Title'), desc: t('problem.item2Desc') },
    { Icon: FileSearch, title: t('problem.item3Title'), desc: t('problem.item3Desc') },
    { Icon: Landmark, title: t('problem.item4Title'), desc: t('problem.item4Desc') },
    { Icon: AlertTriangle, title: t('problem.item5Title'), desc: t('problem.item5Desc') },
  ];

  const howItWorksCards = [
    { Icon: ClipboardList, title: t('howItWorks.step1Title'), desc: t('howItWorks.step1Desc') },
    { Icon: Search, title: t('howItWorks.step2Title'), desc: t('howItWorks.step2Desc') },
    { Icon: Users, title: t('howItWorks.step3Title'), desc: t('howItWorks.step3Desc') },
  ];

  const faqItems = [
    { question: t('faq.q1'), answer: t('faq.a1') },
    { question: t('faq.q2'), answer: t('faq.a2') },
    { question: t('faq.q3'), answer: t('faq.a3') },
    { question: t('faq.q4'), answer: t('faq.a4') },
    { question: t('faq.q5'), answer: t('faq.a5') },
    { question: t('faq.q6'), answer: t('faq.a6') },
    { question: t('faq.q7'), answer: t('faq.a7') },
    { question: t('faq.q8'), answer: t('faq.a8') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Nav ── */}
      <nav className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}/buyer-waitlist`}>
            <Logo width={108} />
          </Link>
          <a
            href="#access"
            className="inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white text-[13px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {t('nav.requestAccess')}
          </a>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="py-20 md:py-28 px-6 bg-[var(--color-bg)]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-bold tracking-[0.1em] uppercase text-[var(--color-muted)] mb-5">
              {t('hero.eyebrow')}
            </p>
            <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[48px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-6">
              {t('hero.h1Pre')}
              <em className="text-[var(--color-accent)] not-italic font-medium italic">{t('hero.h1Accent')}</em>
            </h1>
            <p className="text-[17px] text-[var(--color-muted)] leading-[1.65] mb-8 max-w-[540px] mx-auto">
              {t('hero.sub')}
            </p>
            <a
              href="#access"
              className="inline-flex items-center px-7 py-3.5 bg-[var(--color-accent)] text-white text-[15px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
            >
              {t('hero.cta')}
            </a>
            <p className="mt-4 text-[13px] text-[var(--color-muted)]">{t('hero.microcopy')}</p>
          </div>
        </section>

        {/* ── Why invest ── */}
        <section className="py-20 px-6 bg-[var(--color-bg)]">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              {t('whyInvest.heading')}
            </h2>
            <div className="w-10 h-[3px] bg-[var(--color-accent)] mt-3 mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {whyInvestCards.map(({ Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-3">
                  <Icon className="text-[var(--color-accent)]" size={28} strokeWidth={1.5} />
                  <p className="text-[16px] font-semibold text-[var(--color-text)]">{title}</p>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The problem ── */}
        <section className="py-20 px-6 bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              {t('problem.heading')}
            </h2>
            <SectionRule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {problemItems.map(({ Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <Icon className="text-[var(--color-accent)] shrink-0 mt-0.5" size={22} strokeWidth={1.5} />
                  <div>
                    <p className="text-[16px] font-semibold text-[var(--color-text)] mb-1">{title}</p>
                    <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-6 bg-[var(--color-bg)]">
          <div className="mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-3 justify-center">
              <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
                {t('howItWorks.heading')}
              </h2>
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--color-accent)] border border-[var(--color-accent)] rounded-[4px] px-2 py-1">
                {t('howItWorks.badge')}
              </span>
            </div>
            <div className="w-10 h-[3px] bg-[var(--color-accent)] mt-3 mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {howItWorksCards.map(({ Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center gap-3">
                  <Icon className="text-[var(--color-accent)]" size={28} strokeWidth={1.5} />
                  <p className="text-[16px] font-semibold text-[var(--color-text)]">{title}</p>
                  <p className="text-[14px] text-[var(--color-muted)] leading-[1.6] max-w-[220px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-6 bg-[var(--color-surface)]">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
              {t('faq.heading')}
            </h2>
            <SectionRule />
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* ── Access ── */}
        <section id="access" className="py-20 md:py-24 px-6 bg-[var(--color-accent)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-[family-name:var(--font-serif)] text-[32px] md:text-[40px] font-semibold leading-[1.2] tracking-[-0.02em] text-white mb-3">
              {t('access.h2Pre')}
              <em className="not-italic italic">{t('access.h2Accent')}</em>
            </h2>
            <div className="mt-8 bg-[var(--color-bg)] rounded-[8px] p-6 md:p-8 text-left">
              <FoundingForm
                type="buyer"
                namePlaceholder={t('access.namePlaceholder')}
                emailPlaceholder={t('access.emailPlaceholder')}
                phonePlaceholder={t('access.phonePlaceholder')}
                messagePlaceholder={t('access.messagePlaceholder')}
                submitLabel={t('access.cta')}
              />
            </div>
            <p className="mt-4 text-[13px] text-white/80">{t('access.microcopy')}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
