import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-serif)] text-[40px] md:text-[52px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)] mb-6">
            {t('meta.title')}
          </h1>
          <div className="text-[14px] text-[var(--color-muted)] leading-[1.7]">
            <p className="font-medium text-[var(--color-text)]">{t('company')}</p>
            <p>{t('address')}</p>
            <p>{t('registration')}</p>
            <p className="mt-3 italic">{t('lastUpdated')}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border)] mb-12" />

        {/* Sections */}
        <div className="space-y-10">
          {/* 1 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s1.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s1.body')}</p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s2.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s2.body')}</p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s3.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s3.body')}</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s4.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s4.intro')}</p>
            <ul className="space-y-2 mb-4">
              {(['item1', 'item2', 'item3', 'item4'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s4.${key}`)}
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s4.discretion')}</p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s5.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s5.intro')}</p>
            <ul className="space-y-2">
              {(['item1', 'item2', 'item3', 'item4'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s5.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s6.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s6.intro')}</p>
            <ul className="space-y-2">
              <li className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                {t('s6.item1')}
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s7.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s7.body')}</p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s8.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s8.body')}</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s9.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s9.intro')}</p>
            <ul className="space-y-2">
              {(['item1', 'item2'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s9.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 10 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s10.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s10.body')}</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s11.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s11.body')}</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s12.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s12.body')}</p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s13.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">
              {t('s13.body')}{' '}
              <a
                href={`mailto:${t('s13.email')}`}
                className="text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                {t('s13.email')}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
