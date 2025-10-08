import { Inter_Tight, Noto_Nastaliq_Urdu } from 'next/font/google';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-interTight',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Phase 1: Urdu font for RTL support
const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  variable: '--font-urdu',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

export { interTight, notoNastaliqUrdu };
