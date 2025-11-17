import { affiliateSettings, type AffiliateConfig } from './config';

// Generate affiliate link with tracking parameters
export function generateAffiliateLink(
  platform: string,
  destinationUrl?: string
): string {
  const config = affiliateSettings.streaming[platform];
  
  if (!config || !config.enabled || !config.affiliateId) {
    // Return base URL if affiliate not configured
    return destinationUrl || config?.baseUrl || '#';
  }

  const url = new URL(destinationUrl || config.baseUrl);
  url.searchParams.set(config.trackingParam, config.affiliateId);
  
  return url.toString();
}

// Generate Amazon affiliate link
export function generateAmazonLink(asin: string): string {
  const { associateId, region } = affiliateSettings.amazon;
  
  if (!associateId) {
    return `https://www.amazon.com/dp/${asin}`;
  }

  const domains = {
    US: 'amazon.com',
    UK: 'amazon.co.uk',
    CA: 'amazon.ca',
    JP: 'amazon.co.jp',
  };

  return `https://www.${domains[region]}/dp/${asin}?tag=${associateId}`;
}

// Track affiliate click (for analytics)
export function trackAffiliateClick(
  platform: string,
  animeId?: string,
  position?: string
): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      platform,
      anime_id: animeId,
      position,
      timestamp: new Date().toISOString(),
    });
  }
}

// Track affiliate impression
export function trackAffiliateImpression(
  platform: string,
  animeId?: string
): void {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_impression', {
      platform,
      anime_id: animeId,
      timestamp: new Date().toISOString(),
    });
  }
}
