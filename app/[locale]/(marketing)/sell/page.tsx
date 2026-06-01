import { getTranslations } from 'next-intl/server';
import { SellerForm } from '@/components/seller/SellerForm';

export default async function SellPage() {
  const t = await getTranslations('sellers');
  const s = await getTranslations('sellPage');

  const trustItems = [
    { label: s('trust1Label'), body: s('trust1Body') },
    { label: s('trust2Label'), body: s('trust2Body') },
    { label: s('trust3Label'), body: s('trust3Body') },
  ];

  return (
    <>
      <section className="mx-auto max-w-2xl px-6 pt-14 pb-10 text-center">
        <h2 className="font-[family-name:var(--font-serif)] text-[26px] font-semibold text-[var(--color-text)] mb-8">
          {s('trustHeading')}
        </h2>
        <div className="flex flex-col gap-5 text-left">
          {trustItems.map(({ label, body }) => (
            <div key={label} className="flex gap-4">
              <span className="mt-[6px] shrink-0 w-[6px] h-[6px] rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-text)]">{label}</p>
                <p className="text-[14px] text-[var(--color-muted)] leading-[1.6]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="px-6 pt-0 pb-0 text-center text-[13px] text-[var(--color-muted)]">
        {t('howItWorks.reassurance')}
      </p>
      <SellerForm />
    </>
  );
}
