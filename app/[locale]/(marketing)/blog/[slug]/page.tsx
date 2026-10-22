import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getAllPosts, getPost, postLocales } from '@/lib/blog';
import { buildMetadata, pageUrl } from '@/lib/seo/metadata';
import { HREFLANG, type Locale } from '@/lib/seo/pages';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ locale: post.locale, slug: post.slug }));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return {};
  return buildMetadata({
    locale: post.locale,
    path: `/blog/${post.slug}`,
    locales: postLocales(post.slug),
    title: post.title,
    description: post.description,
    noindex: post.noindex,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) notFound();

  const t = await getTranslations('blog');
  const lang = HREFLANG[post.locale];
  const date = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${post.date}T00:00:00Z`),
  );
  const external = /^https?:\/\//.test(post.ctaUrl);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: lang,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Manto', url: pageUrl('en', '') },
    mainEntityOfPage: pageUrl(post.locale, `/blog/${post.slug}`),
  };

  return (
    <article className="px-6 py-16 md:py-24 bg-[var(--color-bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/${post.locale}/blog`}
          className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          {t('back')}
        </Link>
        <h1 className="mt-6 font-[family-name:var(--font-serif)] text-[34px] md:text-[44px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-text)]">
          {post.title}
        </h1>
        <p className="mt-5 text-[14px] text-[var(--color-muted)]">
          <time dateTime={post.date}>{date}</time>
          <span aria-hidden="true"> · </span>
          {t('by')} {post.author}
        </p>

        <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

        <aside className="mt-14 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)] mb-5">{t('ctaEyebrow')}</p>
          <a
            href={post.ctaUrl}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="inline-flex items-center rounded-[4px] bg-[var(--color-accent)] px-6 py-3 text-[15px] font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {post.ctaLabel} →
          </a>
        </aside>
      </div>
    </article>
  );
}
