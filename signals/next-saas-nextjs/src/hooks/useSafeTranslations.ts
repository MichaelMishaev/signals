/**
 * Safe translation hooks that gracefully handle pages without i18n context
 * (e.g., old template pages that aren't under [locale]/ routes)
 */

import { useTranslations as useNextIntlTranslations, useLocale as useNextIntlLocale } from 'next-intl';

/**
 * Safe version of useTranslations that returns a fallback function if i18n context is missing
 */
export function useSafeTranslations(namespace?: string) {
  try {
    return useNextIntlTranslations(namespace);
  } catch (error) {
    // Fallback for pages without i18n context
    return (key: string) => key;
  }
}

/**
 * Safe version of useLocale that returns 'en' if i18n context is missing
 */
export function useSafeLocale(): string {
  try {
    return useNextIntlLocale();
  } catch (error) {
    // Fallback for pages without i18n context
    return 'en';
  }
}
