import Homepage31Client from './Homepage31Client';
import { Metadata, Viewport } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Time Tracking Software - NextSaaS',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const Homepage31 = () => {
  return <Homepage31Client />;
};

export default Homepage31;
