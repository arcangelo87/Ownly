import { getTranslations } from 'next-intl/server';

export async function BetaBanner() {
  const t = await getTranslations('betaBanner');

  return (
    <div className="bg-[var(--color-accent)] text-white text-[12px] font-medium text-center py-2.5 px-4">
      {t('text')}
    </div>
  );
}
