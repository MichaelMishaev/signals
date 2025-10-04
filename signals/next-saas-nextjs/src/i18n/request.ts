import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // This is the updated approach for Next.js 15
  let locale = await requestLocale;

  // Fallback to 'en' if no locale
  if (!locale) {
    locale = 'en';
  }

  // Load all translation files
  const [common, hero, signals] = await Promise.all([
    import(`@/../public/locales/${locale}/common.json`),
    import(`@/../public/locales/${locale}/hero.json`),
    import(`@/../public/locales/${locale}/signals.json`),
  ]);

  return {
    locale,
    messages: {
      ...common.default,
      hero: hero.default,
      signals: signals.default,
    },
  };
});
