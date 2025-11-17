// Analytics tracking utilities
// Supports Google Analytics 4 and custom event tracking

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Quiz-specific tracking
export const trackQuizEvent = {
  started: (userName: string) => {
    trackEvent('quiz_started', 'Quiz', userName);
  },
  
  questionAnswered: (questionNumber: number, answer: string) => {
    trackEvent('quiz_question_answered', 'Quiz', `Q${questionNumber}: ${answer}`);
  },
  
  completed: (characterResult: string, userName: string) => {
    trackEvent('quiz_completed', 'Quiz', `${userName} got ${characterResult}`);
  },
  
  resultShared: (characterResult: string, platform: string) => {
    trackEvent('quiz_result_shared', 'Quiz', `${characterResult} on ${platform}`);
  },
  
  emailCaptured: (characterResult: string) => {
    trackEvent('email_captured', 'Quiz', characterResult);
  },
  
  retaken: () => {
    trackEvent('quiz_retaken', 'Quiz');
  },
};

// Anime browsing tracking
export const trackBrowseEvent = {
  filterApplied: (filterType: string, filterValue: string) => {
    trackEvent('filter_applied', 'Browse', `${filterType}: ${filterValue}`);
  },
  
  animeClicked: (animeTitle: string) => {
    trackEvent('anime_clicked', 'Browse', animeTitle);
  },
  
  searchPerformed: (searchQuery: string) => {
    trackEvent('search_performed', 'Browse', searchQuery);
  },
};

// Watchlist tracking
export const trackWatchlistEvent = {
  added: (animeTitle: string) => {
    trackEvent('watchlist_added', 'Watchlist', animeTitle);
  },
  
  removed: (animeTitle: string) => {
    trackEvent('watchlist_removed', 'Watchlist', animeTitle);
  },
  
  viewed: () => {
    trackEvent('watchlist_viewed', 'Watchlist');
  },
};

// Newsletter tracking
export const trackNewsletterEvent = {
  subscribed: (source: string) => {
    trackEvent('newsletter_subscribed', 'Newsletter', source);
  },
  
  failed: (source: string, error: string) => {
    trackEvent('newsletter_failed', 'Newsletter', `${source}: ${error}`);
  },
};

// Social sharing tracking
export const trackSocialShare = (platform: string, content: string) => {
  trackEvent('social_share', 'Social', `${platform}: ${content}`);
};

// Error tracking
export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent('error', 'Error', `${errorType}: ${errorMessage}`);
};

// Performance tracking
export const trackPerformance = (metric: string, value: number) => {
  trackEvent('performance', 'Performance', metric, value);
};
