import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

type Messages = { [key: string]: string | Messages };

// Fill keys missing from a locale with English so untranslated strings never render as raw keys.
function withFallback(fallback: Messages, messages: Messages): Messages {
  const result: Messages = { ...fallback };
  for (const [key, value] of Object.entries(messages)) {
    const base = result[key];
    result[key] =
      typeof value === 'object' && typeof base === 'object' ? withFallback(base, value) : value;
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const messages: Messages = (await import(`../messages/${locale}.json`)).default;
  if (locale === 'en') return { locale, messages };

  const english: Messages = (await import('../messages/en.json')).default;
  return { locale, messages: withFallback(english, messages) };
});
