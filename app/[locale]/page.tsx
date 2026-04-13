export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <h1>Ownly — {locale}</h1>
    </main>
  );
}
