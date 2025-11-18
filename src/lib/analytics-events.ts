// Analytics event tracking system
// Stores events in localStorage for trending calculation and future analytics integration

const ANALYTICS_EVENTS_KEY = 'analytics_events';
const MAX_EVENTS = 1000; // Keep last 1000 events to prevent localStorage overflow

export interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

/**
 * Get or create a session ID for the current browsing session
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Get all analytics events from localStorage
 */
export function getAnalyticsEvents(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(ANALYTICS_EVENTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading analytics events:', error);
    return [];
  }
}

/**
 * Track an analytics event
 */
export function trackEvent(event: string, data: Record<string, any> = {}): void {
  if (typeof window === 'undefined') return;
  
  try {
    const events = getAnalyticsEvents();
    
    const newEvent: AnalyticsEvent = {
      event,
      data,
      timestamp: Date.now(),
      sessionId: getSessionId(),
    };
    
    // Add new event
    events.push(newEvent);
    
    // Keep only the most recent MAX_EVENTS
    const trimmedEvents = events.slice(-MAX_EVENTS);
    
    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(trimmedEvents));
    
    // Also send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data);
    }
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event, data);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track filter usage
 */
export function trackFilterUsage(filterType: string, value: string | string[]): void {
  trackEvent('filter_applied', {
    type: filterType,
    value: Array.isArray(value) ? value.join(',') : value,
  });
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultCount: number): void {
  trackEvent('search_performed', {
    query,
    resultCount,
  });
}

/**
 * Track sort change
 */
export function trackSortChange(sortBy: string): void {
  trackEvent('sort_changed', {
    sortBy,
  });
}

/**
 * Track watchlist action
 */
export function trackWatchlistAction(animeId: string, action: 'add' | 'remove'): void {
  trackEvent('watchlist_action', {
    animeId,
    action,
  });
}

/**
 * Track watch now click
 */
export function trackWatchNowClick(animeId: string, animeTitle: string): void {
  trackEvent('watch_now_clicked', {
    animeId,
    animeTitle,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email: string, source: string): void {
  trackEvent('newsletter_signup', {
    email: email.substring(0, 3) + '***', // Anonymize email
    source,
  });
}

/**
 * Track page view
 */
export function trackPageView(page: string, filters?: Record<string, any>): void {
  trackEvent('page_view', {
    page,
    filters,
  });
}

/**
 * Track error
 */
export function trackError(error: string, context?: Record<string, any>): void {
  trackEvent('error_occurred', {
    error,
    context,
  });
}

/**
 * Get events by type
 */
export function getEventsByType(eventType: string): AnalyticsEvent[] {
  return getAnalyticsEvents().filter(e => e.event === eventType);
}

/**
 * Get events in time range
 */
export function getEventsInTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
  return getAnalyticsEvents().filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
}

/**
 * Clear old events (older than specified days)
 */
export function clearOldEvents(daysToKeep: number = 30): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const events = getAnalyticsEvents();
    const recentEvents = events.filter(e => e.timestamp > cutoffTime);
    
    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(recentEvents));
  } catch (error) {
    console.error('Error clearing old events:', error);
  }
}
