import { useTranslations } from 'next-intl';
import { Logo } from '@/components/ui/Logo';
import { SiteFooter } from '@/components/marketing/SiteFooter';

// Standalone experiment pages: own header, shared site footer.
export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dealAccess.nav');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)] relative z-40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-8">
          <Logo width={135} />
          <a
            href="#pricing"
            className="group relative inline-flex items-center overflow-hidden rounded-[4px] border border-[var(--color-accent)] px-4 py-2.5 md:px-6 md:py-3 text-[14px] font-semibold text-[var(--color-accent)] transition-colors duration-300 hover:text-white"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-terracotta)] transition-transform duration-300 group-hover:scale-x-100" />
            <span className="relative">{t('cta')} →</span>
          </a>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
