import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import { HREFLANG, LOCALES, type Locale } from '@/lib/seo/pages';

// One markdown file per post in content/blog/<locale>/. Posts are written
// natively per language, not translated. A post in the other language with
// the same slug counts as its counterpart.
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export type Post = {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  ctaLabel: string;
  ctaUrl: string;
  noindex: boolean;
  html: string;
};

const REQUIRED = ['title', 'description', 'slug', 'lang', 'date', 'author', 'cta_label', 'cta_url'] as const;

function parse(file: string, locale: Locale): Post {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing frontmatter`);

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (field) data[field[1]] = field[2].trim().replace(/^"(.*)"$/, '$1');
  }

  for (const key of REQUIRED) {
    if (!data[key]) throw new Error(`${file}: missing "${key}" in frontmatter`);
  }
  if (data.lang !== HREFLANG[locale]) {
    throw new Error(`${file}: lang "${data.lang}" does not match folder (expected "${HREFLANG[locale]}")`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${file}: date must be YYYY-MM-DD`);

  return {
    locale,
    slug: data.slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    ctaLabel: data.cta_label,
    ctaUrl: data.cta_url,
    noindex: data.noindex === 'true',
    html: marked.parse(match[2], { async: false }),
  };
}

let cached: Post[] | null = null;

// All posts, newest first. Future dates are published as is.
export function getAllPosts(): Post[] {
  if (cached) return cached;
  cached = LOCALES.flatMap((locale) => {
    const dir = path.join(BLOG_DIR, locale);
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((name) => name.endsWith('.md'))
      .map((name) => parse(path.join(dir, name), locale));
  }).sort((a, b) => b.date.localeCompare(a.date));
  return cached;
}

export function getPosts(locale: Locale): Post[] {
  return getAllPosts().filter((post) => post.locale === locale);
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return getAllPosts().find((post) => post.locale === locale && post.slug === slug);
}

// Locales a post exists in: its own, plus any post with the same slug.
export function postLocales(slug: string): Locale[] {
  return LOCALES.filter((locale) => getPost(locale, slug));
}
