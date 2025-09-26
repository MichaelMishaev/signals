import SmoothScrollProvider from '@/components/shared/SmoothScroll';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ModalProvider } from '@/context/ModalContext';
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ModalProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
            </Suspense>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
