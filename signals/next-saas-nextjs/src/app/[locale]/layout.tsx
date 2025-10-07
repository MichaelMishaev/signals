import SmoothScrollProvider from '@/components/shared/SmoothScroll';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ModalProvider } from '@/context/ModalContext';
import { FeatureFlagProvider } from '@/context/FeatureFlagContext';
import { SessionProvider } from '@/components/auth/SessionProvider';
import VerificationToast from '@/components/shared/VerificationToast';
import DevProductionToggle from '@/components/shared/DevProductionToggle';
import DevEmailDebugBar from '@/components/shared/emailGate/DevEmailDebugBar';
import PopupManager from '@/components/shared/popups/PopupManager';
import { interTight } from '@/utils/font';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

const locales = ['en', 'ur'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Await params as required by Next.js 15
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  // Load messages for the specific locale
  const messages = await getMessages();

  // Determine text direction
  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        {/* Preconnect to banner CDN for faster loading (Pakistan slow internet optimization) */}
        <link rel="preconnect" href="https://d3dpet1g0ty5ed.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d3dpet1g0ty5ed.cloudfront.net" />
      </head>
      <body className={`${interTight.variable} antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <FeatureFlagProvider>
                <ModalProvider>
                  <DevEmailDebugBar />
                  <Suspense fallback={<div>Loading...</div>}>
                    <SmoothScrollProvider>{children}</SmoothScrollProvider>
                  </Suspense>
                  <VerificationToast />
                  <DevProductionToggle />
                  <PopupManager />
                </ModalProvider>
              </FeatureFlagProvider>
            </ThemeProvider>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
