import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function PrivacyPage() {
  const t = useTranslations('privacy');

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
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-3">{t('s1.body')}</p>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">
              {t('s1.contactIntro')}{' '}
              <a
                href={`mailto:${t('s1.email')}`}
                className="text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                {t('s1.email')}
              </a>
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s2.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s2.intro')}</p>
            <ul className="space-y-2">
              {(['item1', 'item2', 'item3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s2.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-4">
              {t('s3.heading')}
            </h2>
            <div className="space-y-4">
              {(
                [
                  ['sellersLabel', 'sellersBody'],
                  ['buyersLabel', 'buyersBody'],
                  ['brokersLabel', 'brokersBody'],
                  ['allLabel', 'allBody'],
                ] as const
              ).map(([labelKey, bodyKey]) => (
                <p key={labelKey} className="text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="font-medium text-[var(--color-text)]">{t(`s3.${labelKey}`)}</span>{' '}
                  {t(`s3.${bodyKey}`)}
                </p>
              ))}
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s4.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s4.intro')}</p>
            <ul className="space-y-2">
              {(['item1', 'item2', 'item3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s4.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s5.heading')}
            </h2>
            <ul className="space-y-2 mb-4">
              {(['item1', 'item2', 'item3', 'item4', 'item5'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s5.${key}`)}
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s5.noSell')}</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s6.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s6.intro')}</p>
            <ul className="space-y-2">
              {(['item1', 'item2', 'item3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s6.${key}`)}
                </li>
              ))}
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
            <ul className="space-y-2">
              {(['item1', 'item2', 'item3'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s8.${key}`)}
                </li>
              ))}
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)] mb-3">
              {t('s9.heading')}
            </h2>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-4">{t('s9.intro')}</p>
            <ul className="space-y-2 mb-4">
              {(['right1', 'right2', 'right3', 'right4', 'right5', 'right6'] as const).map((key) => (
                <li key={key} className="flex gap-3 text-[15px] text-[var(--color-muted)] leading-[1.75]">
                  <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" />
                  {t(`s9.${key}`)}
                </li>
              ))}
            </ul>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75] mb-3">
              {t('s9.exercise')}{' '}
              <a
                href={`mailto:${t('s9.email')}`}
                className="text-[var(--color-accent)] hover:opacity-80 transition-opacity"
              >
                {t('s9.email')}
              </a>
              {'. '}
              {t('s9.exerciseEnd')}
            </p>
            <p className="text-[15px] text-[var(--color-muted)] leading-[1.75]">{t('s9.complaint')}</p>
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
        </div>
      </div>
    </div>
  );
}
