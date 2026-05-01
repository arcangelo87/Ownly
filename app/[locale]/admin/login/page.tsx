import { LoginForm } from '@/components/admin/LoginForm';
import { Logo } from '@/components/ui/Logo';

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo width={96} />
          <p className="mt-1 text-sm text-[var(--color-muted)]">Operator access</p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-white px-8 py-8">
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
