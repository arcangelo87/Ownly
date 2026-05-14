import Link from 'next/link';

interface PricingCardProps {
  heading: string;
  tagline?: string;
  badge?: string;
  price: string;
  priceStrike?: string;
  priceNote?: string;
  heroFeatures?: string[];
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  muted?: boolean;
}

export function PricingCard({
  heading,
  tagline,
  badge,
  price,
  priceStrike,
  priceNote,
  heroFeatures,
  features,
  ctaLabel,
  ctaHref,
  highlight = false,
  muted = false,
}: PricingCardProps) {
  return (
    <div
      className={[
        'flex flex-col rounded-[8px] border p-8',
        highlight
          ? 'border-[var(--color-accent)] bg-white'
          : 'border-[var(--color-border)] bg-[var(--color-bg)]',
        muted ? 'opacity-90' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 mb-1">
        <h3 className="font-[family-name:var(--font-serif)] text-[20px] font-semibold text-[var(--color-text)]">
          {heading}
        </h3>
        {badge && (
          <span className="text-[10px] font-bold tracking-[0.08em] uppercase px-2 py-1 bg-[var(--color-accent)] text-white rounded-[3px]">
            {badge}
          </span>
        )}
      </div>

      {tagline && (
        <p className="text-[14px] font-medium text-[var(--color-text)] leading-[1.5] mb-4">{tagline}</p>
      )}

      <div className="mb-6">
        {priceStrike && (
          <span className="line-through text-[var(--color-muted)] text-[14px] mr-2">
            {priceStrike}
          </span>
        )}
        <span className="font-[family-name:var(--font-mono)] text-[18px] font-medium text-[var(--color-text)]">
          {price}
        </span>
        {priceNote && (
          <span className="ml-2 text-[12px] text-[var(--color-muted)]">({priceNote})</span>
        )}
      </div>

      <div className="flex flex-col flex-1 mb-8">
        {heroFeatures && heroFeatures.length > 0 && (
          <>
            <ul className="flex flex-col gap-3 mb-4">
              {heroFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[14px] font-medium text-[var(--color-text)] leading-[1.5]">
                  <span className="mt-[3px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <hr className="border-[var(--color-border)] mb-4" />
          </>
        )}
        <ul className="flex flex-col gap-3">
          {features.map((f, i) => (
            <li
              key={i}
              className={[
                'flex items-start gap-2 leading-[1.5]',
                heroFeatures ? 'text-[13px] text-[var(--color-muted)]' : 'text-[14px] text-[var(--color-text)]',
              ].join(' ')}
            >
              <span className="mt-[3px] shrink-0 w-[5px] h-[5px] rounded-full bg-[var(--color-border)]" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={ctaHref}
        className={[
          'text-center py-3 px-6 rounded-[4px] text-[14px] font-medium transition-opacity hover:opacity-90',
          highlight
            ? 'bg-[var(--color-accent)] text-white'
            : 'border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent',
        ].join(' ')}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
