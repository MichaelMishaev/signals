/**
 * Affiliate Tracking Utilities
 *
 * Centralized functions for tracking affiliate link clicks and conversions
 * Usage: Import and call trackAffiliateClick before opening affiliate links
 */

import { GATE_CONFIG } from '@/config/gates';

// ============================================================================
// Types
// ============================================================================

export interface AffiliateClickData {
  clickId: string;
  signalId?: number | string;
  source: AffiliateSource;
  buttonVariant?: string;
  utmParams?: UTMParams;
  metadata?: Record<string, any>;
}

export type AffiliateSource =
  | 'signal_page_cta'
  | 'signal_page_home_button'
  | 'homepage_feed'
  | 'gate_modal_email'
  | 'gate_modal_broker'
  | 'popup_idle'
  | 'popup_content_access'
  | 'popup_fourth_action'
  | 'popup_exit_intent'
  | 'banner_side'
  | 'banner_footer'
  | 'banner_between_signals';

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

// ============================================================================
// Click ID Generation
// ============================================================================

/**
 * Generates a unique click ID for tracking
 * Format: timestamp_signalId_randomString
 */
export function generateClickId(signalId?: number | string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  const signal = signalId ? `_${signalId}` : '';

  return `${timestamp}${signal}_${random}`;
}

// ============================================================================
// UTM Parameter Builder
// ============================================================================

/**
 * Builds UTM parameters based on source and context
 */
export function buildUTMParams(
  source: AffiliateSource,
  signalId?: number | string,
  buttonVariant?: string
): UTMParams {
  const params: UTMParams = {
    source: 'signals_platform',
    medium: getUTMMedium(source),
    campaign: signalId ? `signal_${signalId}` : 'general_traffic',
  };

  if (buttonVariant) {
    params.content = `button_${buttonVariant}`;
  }

  // Add specific content based on source
  if (source.includes('popup')) {
    params.content = source.replace('popup_', '');
  } else if (source.includes('gate')) {
    params.content = source.replace('gate_modal_', 'gate_');
  } else if (source.includes('banner')) {
    params.content = source.replace('banner_', 'ad_');
  }

  return params;
}

function getUTMMedium(source: AffiliateSource): string {
  if (source.includes('popup')) return 'popup';
  if (source.includes('gate')) return 'gate_modal';
  if (source.includes('banner')) return 'display_ad';
  if (source.includes('feed')) return 'feed';
  return 'cta_button';
}

// ============================================================================
// Affiliate URL Builder
// ============================================================================

/**
 * Builds complete affiliate URL with tracking parameters
 */
export function buildAffiliateUrl(
  clickId: string,
  utmParams: UTMParams,
  customParams?: Record<string, string>
): string {
  const baseUrl = GATE_CONFIG.brokerUrl;
  const params = new URLSearchParams();

  // Add click ID
  params.append('cid', clickId);

  // Add UTM parameters
  if (utmParams.source) params.append('utm_source', utmParams.source);
  if (utmParams.medium) params.append('utm_medium', utmParams.medium);
  if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
  if (utmParams.content) params.append('utm_content', utmParams.content);
  if (utmParams.term) params.append('utm_term', utmParams.term);

  // Add custom parameters
  if (customParams) {
    Object.entries(customParams).forEach(([key, value]) => {
      params.append(key, value);
    });
  }

  return `${baseUrl}?${params.toString()}`;
}

// ============================================================================
// Session & Context Tracking
// ============================================================================

/**
 * Gets or creates a session ID for tracking user sessions
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_side';

  const SESSION_KEY = 'affiliate_session_id';
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    const storedTime = localStorage.getItem(`${SESSION_KEY}_time`);

    // Check if session is still valid
    if (stored && storedTime) {
      const elapsed = Date.now() - parseInt(storedTime, 10);
      if (elapsed < SESSION_DURATION) {
        return stored;
      }
    }

    // Create new session
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(SESSION_KEY, newSessionId);
    localStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString());

    return newSessionId;
  } catch (error) {
    console.error('[Affiliate Tracking] Error managing session:', error);
    return `session_${Date.now()}`;
  }
}

/**
 * Gets user context for tracking
 */
export function getUserContext(): {
  userAgent: string;
  referrer: string;
  pagePath: string;
  locale: string;
} {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server_side',
      referrer: '',
      pagePath: '',
      locale: 'en',
    };
  }

  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    pagePath: window.location.pathname,
    locale: window.location.pathname.split('/')[1] || 'en',
  };
}

// ============================================================================
// Main Tracking Function
// ============================================================================

/**
 * Tracks affiliate link click and returns the tracking URL
 *
 * @param signalId - Optional signal ID if click originated from a signal
 * @param source - Where the click originated from
 * @param buttonVariant - Optional button variant name
 * @param metadata - Optional additional metadata
 * @returns Promise<string> - The affiliate URL with tracking parameters
 *
 * @example
 * ```typescript
 * const url = await trackAffiliateClick({
 *   signalId: 123,
 *   source: 'signal_page_cta',
 *   buttonVariant: 'urgent-countdown'
 * });
 * window.open(url, '_blank');
 * ```
 */
export async function trackAffiliateClick(data: {
  signalId?: number | string;
  source: AffiliateSource;
  buttonVariant?: string;
  metadata?: Record<string, any>;
}): Promise<string> {
  try {
    // Generate click ID
    const clickId = generateClickId(data.signalId);

    // Build UTM parameters
    const utmParams = buildUTMParams(data.source, data.signalId, data.buttonVariant);

    // Get user context
    const context = getUserContext();
    const sessionId = getSessionId();

    // Prepare tracking data
    const trackingData: AffiliateClickData = {
      clickId,
      signalId: data.signalId,
      source: data.source,
      buttonVariant: data.buttonVariant,
      utmParams,
      metadata: {
        ...data.metadata,
        ...context,
        sessionId,
        timestamp: new Date().toISOString(),
      },
    };

    // Send tracking data to API (non-blocking)
    fetch('/api/track-affiliate-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData),
    }).catch((error) => {
      console.error('[Affiliate Tracking] Failed to track click:', error);
      // Don't block user action even if tracking fails
    });

    // Build and return affiliate URL
    const affiliateUrl = buildAffiliateUrl(clickId, utmParams, {
      signal_id: data.signalId?.toString() || '',
      source: data.source,
    });

    console.log('[Affiliate Tracking] Click tracked:', {
      clickId,
      source: data.source,
      signalId: data.signalId,
      url: affiliateUrl,
    });

    return affiliateUrl;
  } catch (error) {
    console.error('[Affiliate Tracking] Error tracking click:', error);

    // Fallback: return basic affiliate URL without tracking
    return GATE_CONFIG.brokerUrl;
  }
}

// ============================================================================
// Analytics Helpers
// ============================================================================

/**
 * Tracks a custom event for analytics
 */
export async function trackCustomEvent(
  eventName: string,
  eventData: Record<string, any>
): Promise<void> {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...eventData,
      }),
    });
  } catch (error) {
    console.error('[Affiliate Tracking] Failed to track event:', error);
  }
}

/**
 * Gets click statistics from local storage
 */
export function getLocalClickStats(): {
  totalClicks: number;
  lastClickTime: string | null;
  clickHistory: string[];
} {
  if (typeof window === 'undefined') {
    return { totalClicks: 0, lastClickTime: null, clickHistory: [] };
  }

  try {
    const clicks = localStorage.getItem('affiliate_click_history');
    const clickHistory = clicks ? JSON.parse(clicks) : [];

    return {
      totalClicks: clickHistory.length,
      lastClickTime: clickHistory.length > 0 ? clickHistory[clickHistory.length - 1] : null,
      clickHistory,
    };
  } catch (error) {
    console.error('[Affiliate Tracking] Error reading local stats:', error);
    return { totalClicks: 0, lastClickTime: null, clickHistory: [] };
  }
}

/**
 * Saves click to local history
 */
export function saveClickToLocalHistory(clickId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const clicks = localStorage.getItem('affiliate_click_history');
    const clickHistory = clicks ? JSON.parse(clicks) : [];

    clickHistory.push({
      clickId,
      timestamp: new Date().toISOString(),
    });

    // Keep only last 50 clicks
    const trimmed = clickHistory.slice(-50);

    localStorage.setItem('affiliate_click_history', JSON.stringify(trimmed));
  } catch (error) {
    console.error('[Affiliate Tracking] Error saving to local history:', error);
  }
}
