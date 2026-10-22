import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt'],
  defaultLocale: 'en',
  // The URL alone decides the language: no Accept-Language or cookie redirects
  localeDetection: false,
  localeCookie: false,
  // hreflang comes from lib/seo, which knows which pages exist in each language
  alternateLinks: false,
});
