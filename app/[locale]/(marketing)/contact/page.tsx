import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { PlanEnquiryForm } from '@/components/marketing/PlanEnquiryForm';
import type { PlanEnquiryPlan } from '@/app/actions/plan-enquiry';

interface Props {
  searchParams: Promise<{ plan?: string }>;
}

export default async function ContactPage({ searchParams }: Props) {
  const { plan } = await searchParams;
  const locale = await getLocale();

  if (plan !== 'assisted' && plan !== 'bespoke') {
    redirect(`/${locale}`);
  }

  return <ContactContent plan={plan} />;
}

function ContactContent({ plan }: { plan: PlanEnquiryPlan }) {
  const t = useTranslations('contact');

  return (
    <section className="py-16 px-6 bg-[var(--color-surface)] min-h-screen">
      <div className="mx-auto max-w-lg">
        <h1 className="font-[family-name:var(--font-serif)] text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-[var(--color-text)] mb-3">
          {t('heading')}
        </h1>
        <p className="text-[15px] text-[var(--color-muted)] leading-[1.7] mb-10">
          {t('subheading')}
        </p>
        <PlanEnquiryForm plan={plan} />
      </div>
    </section>
  );
}
