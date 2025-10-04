'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) {
      setIsOpen(false);
      return;
    }

    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(/^\/(en|ur)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`;

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-3 dark:bg-background-7 hover:bg-background-4 dark:hover:bg-background-8 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-sm font-medium">{currentLanguage?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-background-2 dark:bg-background-7 shadow-lg border border-neutral-300 dark:border-neutral-700 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-background-3 dark:hover:bg-background-8 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  lang.code === locale ? 'bg-accent/10 dark:bg-accent/20' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
                {lang.code === locale && (
                  <svg
                    className="w-4 h-4 ml-auto text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
