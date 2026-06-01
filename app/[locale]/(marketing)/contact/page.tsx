import { useTranslations } from 'next-intl';
import { ContactForm } from '@/components/marketing/ContactForm';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-[family-name:var(--font-serif)] text-[32px] font-semibold text-[var(--color-text)] mb-3">
        {t('heading')}
      </h1>
      <p className="text-[15px] text-[var(--color-muted)] mb-10">{t('sub')}</p>
      <ContactForm />
    </div>
  );
}
