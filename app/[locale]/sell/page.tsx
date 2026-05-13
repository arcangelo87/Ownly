import { useTranslations } from 'next-intl';
import { SellerForm } from '@/components/seller/SellerForm';

export default function SellPage() {
  const t = useTranslations('sellers');

  return (
    <>
      <p className="px-6 pt-10 pb-0 text-center text-[13px] text-[var(--color-muted)]">
        {t('howItWorks.reassurance')}
      </p>
      <SellerForm />
    </>
  );
}
