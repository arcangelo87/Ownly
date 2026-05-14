import { useTranslations } from 'next-intl';

const SECTIONS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'] as const;

export default function TermsPage() {
  const t = useTranslations('termsPage');

  return (
    <section className="py-16 md:py-24 px-6 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)] mb-4">
          {t('lastUpdated')}
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-[34px] md:text-[44px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-12">
          {t('title')}
        </h1>
        <div className="flex flex-col gap-10">
          {SECTIONS.map((s) => (
            <div key={s}>
              <h2 className="font-[family-name:var(--font-serif)] text-[18px] font-semibold text-[var(--color-text)] mb-3">
                {t(`${s}Heading`)}
              </h2>
              <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">
                {t(`${s}Body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
