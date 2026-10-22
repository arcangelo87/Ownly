import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPosts } from '@/lib/blog';
import { blogLocales, buildMetadata } from '@/lib/seo/metadata';
import { HREFLANG, type Locale } from '@/lib/seo/pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return blogLocales().map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.blog' });
  return buildMetadata({
    locale: locale as Locale,
    path: '/blog',
    locales: blogLocales(),
    title: t('title'),
    description: t('description'),
  });
}

export default async function BlogIndexPage({ params }: { params: Params }) {
  const { locale } = await params;
  const posts = getPosts(locale as Locale);
  if (!posts.length) notFound();

  const t = await getTranslations('blog');
  const format = new Intl.DateTimeFormat(HREFLANG[locale as Locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <section className="px-6 py-16 md:py-24 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-[family-name:var(--font-serif)] text-[36px] md:text-[44px] font-semibold tracking-[-0.02em] text-[var(--color-text)]">
          {t('heading')}
        </h1>
        <p className="mt-3 text-[16px] text-[var(--color-muted)]">{t('sub')}</p>

        <ul className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <Link href={`/${locale}/blog/${post.slug}`} className="group block">
                <time dateTime={post.date} className="text-[13px] text-[var(--color-muted)]">
                  {format.format(new Date(`${post.date}T00:00:00Z`))}
                </time>
                <h2 className="mt-2 font-[family-name:var(--font-serif)] text-[24px] font-semibold leading-[1.25] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-[15px] leading-[1.6] text-[var(--color-muted)]">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
