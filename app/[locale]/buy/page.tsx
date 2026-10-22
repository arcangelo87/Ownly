import { BuyerSearchForm } from '@/components/buyer/BuyerSearchForm';
import type { Metadata } from 'next';
import { availablePaths, pageMetadata } from '@/lib/seo/metadata';
import { LanguageSwitcher } from '@/components/marketing/LanguageSwitcher';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('/buy', locale);
}

export default function BuyPage() {
  return (
    <>
      <div className="flex justify-end px-5 pt-4 md:px-16">
        <LanguageSwitcher available={availablePaths()} />
      </div>
      <BuyerSearchForm />
    </>
  );
}
