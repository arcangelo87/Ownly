'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-[3px] text-[12px] font-medium tracking-[0.04em]">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-[3px]">
          {i > 0 && (
            <span className="text-[var(--color-border)] select-none">/</span>
          )}
          <button
            onClick={() => router.replace(pathname, { locale: loc })}
            className={
              loc === locale
                ? 'text-[var(--color-text)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors'
            }
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
