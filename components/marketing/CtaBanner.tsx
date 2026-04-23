import Link from 'next/link';

interface CtaBannerProps {
  heading: string;
  subheading?: string;
  ctaLabel: string;
  ctaHref: string;
}

export function CtaBanner({ heading, subheading, ctaLabel, ctaHref }: CtaBannerProps) {
  return (
    <section
      className="py-20 px-6 text-white text-center"
      style={{ background: 'var(--color-accent)' }}
    >
      <div className="mx-auto max-w-2xl">
        <h2 className="font-[family-name:var(--font-serif)] text-[32px] md:text-[40px] font-semibold leading-[1.2] tracking-[-0.02em] mb-4">
          {heading}
        </h2>
        {subheading && (
          <p className="text-[16px] opacity-80 mb-8 leading-[1.6]">{subheading}</p>
        )}
        <Link
          href={ctaHref}
          className="inline-flex items-center px-8 py-4 bg-white text-[var(--color-accent)] text-[15px] font-semibold rounded-[4px] hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
