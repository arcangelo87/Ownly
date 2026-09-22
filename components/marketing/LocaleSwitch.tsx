import Link from 'next/link';

interface LocaleSwitchProps {
  locale: string;
  href: string;
}

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
] as const;

export function LocaleSwitch({ locale, href }: LocaleSwitchProps) {
  return (
    <div className="flex justify-center items-center gap-2 pb-6 text-[12px] font-semibold uppercase tracking-[0.08em]">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span className="text-[var(--color-border)]">/</span>}
          {code === locale ? (
            <span className="text-[var(--color-text)]">{label}</span>
          ) : (
            <Link
              href={`/${code}${href}`}
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              {label}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
