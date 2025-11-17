// Affiliate Configuration
// Store affiliate IDs in environment variables for security

export interface AffiliateConfig {
  platform: string;
  baseUrl: string;
  affiliateId: string;
  trackingParam: string;
  enabled: boolean;
  logo?: string;
}

export interface AffiliateSettings {
  streaming: Record<string, AffiliateConfig>;
  amazon: {
    associateId: string;
    trackingId: string;
    region: 'US' | 'UK' | 'CA' | 'JP';
  };
  disclosure: {
    shortText: string;
    fullPolicyUrl: string;
  };
}

// Affiliate configuration with environment variables
export const affiliateSettings: AffiliateSettings = {
  streaming: {
    crunchyroll: {
      platform: 'Crunchyroll',
      baseUrl: 'https://www.crunchyroll.com',
      affiliateId: process.env.NEXT_PUBLIC_CRUNCHYROLL_AFFILIATE_ID || '',
      trackingParam: 'ref',
      enabled: !!process.env.NEXT_PUBLIC_CRUNCHYROLL_AFFILIATE_ID,
      logo: '/streaming/crunchyroll.svg',
    },
    funimation: {
      platform: 'Funimation',
      baseUrl: 'https://www.funimation.com',
      affiliateId: process.env.NEXT_PUBLIC_FUNIMATION_AFFILIATE_ID || '',
      trackingParam: 'ref',
      enabled: !!process.env.NEXT_PUBLIC_FUNIMATION_AFFILIATE_ID,
      logo: '/streaming/funimation.svg',
    },
    netflix: {
      platform: 'Netflix',
      baseUrl: 'https://www.netflix.com',
      affiliateId: process.env.NEXT_PUBLIC_NETFLIX_AFFILIATE_ID || '',
      trackingParam: 'ref',
      enabled: !!process.env.NEXT_PUBLIC_NETFLIX_AFFILIATE_ID,
      logo: '/streaming/netflix.svg',
    },
    hulu: {
      platform: 'Hulu',
      baseUrl: 'https://www.hulu.com',
      affiliateId: process.env.NEXT_PUBLIC_HULU_AFFILIATE_ID || '',
      trackingParam: 'ref',
      enabled: !!process.env.NEXT_PUBLIC_HULU_AFFILIATE_ID,
      logo: '/streaming/hulu.svg',
    },
    amazonPrime: {
      platform: 'Amazon Prime Video',
      baseUrl: 'https://www.amazon.com/gp/video',
      affiliateId: process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID || '',
      trackingParam: 'tag',
      enabled: !!process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_ID,
      logo: '/streaming/prime.svg',
    },
    hidive: {
      platform: 'HIDIVE',
      baseUrl: 'https://www.hidive.com',
      affiliateId: process.env.NEXT_PUBLIC_HIDIVE_AFFILIATE_ID || '',
      trackingParam: 'ref',
      enabled: !!process.env.NEXT_PUBLIC_HIDIVE_AFFILIATE_ID,
      logo: '/streaming/hidive.svg',
    },
  },
  amazon: {
    associateId: process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_ID || '',
    trackingId: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID || '',
    region: 'US',
  },
  disclosure: {
    shortText: 'This page contains affiliate links. We may earn a commission from purchases.',
    fullPolicyUrl: '/affiliate-policy',
  },
};

// Get enabled streaming platforms
export function getEnabledPlatforms(): AffiliateConfig[] {
  return Object.values(affiliateSettings.streaming).filter(platform => platform.enabled);
}

// Check if any affiliate links are enabled
export function hasAffiliateLinks(): boolean {
  return getEnabledPlatforms().length > 0 || !!affiliateSettings.amazon.associateId;
}
