import { permanentRedirect } from 'next/navigation';

export default async function SellPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  permanentRedirect(`/${locale}/sellers`);
}
