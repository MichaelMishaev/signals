export type Platform = 'web' | 'mobile';
export type BannerPosition = 'side' | 'footer' | 'between-signals';

export interface BannerVariant {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface BannerConfig {
  web: {
    side: BannerVariant[];
    footer: BannerVariant[];
    'between-signals': BannerVariant[];
  };
  mobile: {
    side: BannerVariant[];
    footer: BannerVariant[];
    'between-signals': BannerVariant[];
  };
}

export interface AdBannerProps {
  position: BannerPosition;
  className?: string;
  rotationInterval?: number;
}
