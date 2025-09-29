import SmoothScrollProvider from '@/components/shared/SmoothScroll';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ModalProvider } from '@/context/ModalContext';
import { FeatureFlagProvider } from '@/context/FeatureFlagContext';
import { SessionProvider } from '@/components/auth/SessionProvider';
import VerificationToast from '@/components/shared/VerificationToast';
import DevProductionToggle from '@/components/shared/DevProductionToggle';
import { interTight } from '@/utils/font';
import { ReactNode, Suspense } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interTight.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <FeatureFlagProvider>
              <ModalProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                </Suspense>
                <VerificationToast />
                <DevProductionToggle />
              </ModalProvider>
            </FeatureFlagProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
