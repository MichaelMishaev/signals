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
  const [common, hero, signals, modals, buttons, footer, navigation, faq, terms] = await Promise.all([
    import(`@/../public/locales/${locale}/common.json`),
    import(`@/../public/locales/${locale}/hero.json`),
    import(`@/../public/locales/${locale}/signals.json`),
    import(`@/../public/locales/${locale}/modals.json`),
    import(`@/../public/locales/${locale}/buttons.json`),
    import(`@/../public/locales/${locale}/footer.json`),
    import(`@/../public/locales/${locale}/navigation.json`),
    import(`@/../public/locales/${locale}/faq.json`),
    import(`@/../public/locales/${locale}/terms.json`),
  ]);

  return {
    locale,
    messages: {
      common: common.default,
      hero: hero.default,
      signals: signals.default,
      modals: modals.default,
      buttons: buttons.default,
      footer: footer.default,
      navigation: navigation.default,
      faq: faq.default,
      terms: terms.default,
    },
  };
});
