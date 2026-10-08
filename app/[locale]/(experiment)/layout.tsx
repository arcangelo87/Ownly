import { Logo } from '@/components/ui/Logo';

// Standalone experiment pages: logo only, no links into the rest of the site.
export default function ExperimentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <Logo width={135} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
