import { getTranslations } from 'next-intl/server';
import { SellerForm } from '@/components/seller/SellerForm';
import { PricingCard } from '@/components/marketing/PricingCard';

export default async function SellPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('sellers');
  const wyg = await getTranslations('sellers.whatYouGet');

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-14 pb-10">
        <h2 className="font-[family-name:var(--font-serif)] text-[28px] font-semibold text-[var(--color-text)] mb-8">
          {wyg('heading')}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <PricingCard
            heading={wyg('freeHeading')}
            tagline={wyg('freeTagline')}
            price={wyg('freePrice')}
            features={[wyg('free1'), wyg('free2'), wyg('free5')]}
            ctaLabel={wyg('freeCta')}
            ctaHref="#seller-form"
          />
          <PricingCard
            heading={wyg('whiteGloveHeading')}
            tagline={wyg('whiteGloveTagline')}
            price={wyg('whiteGlovePrice')}
            heroFeatures={[wyg('whiteGloveHero1'), wyg('whiteGloveHero2')]}
            features={[wyg('whiteGlove1'), wyg('whiteGlove2')]}
            ctaLabel={wyg('whiteGloveCta')}
            ctaHref={`/${locale}/contact`}
            highlight
          />
        </div>
      </section>

      <p className="px-6 pt-0 pb-0 text-center text-[13px] text-[var(--color-muted)]" id="seller-form">
        {t('howItWorks.reassurance')}
      </p>
      <SellerForm />
    </>
  );
}
