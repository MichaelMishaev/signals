/**
 * Popup Trigger Manager Hook
 * Manages all popup triggers and action tracking
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { POPUP_CONFIG, PopupType } from '@/config/popups';
import {
  getPopupState,
  incrementActionCount,
  markPopupShown,
  shouldShowPopup,
  getActionCount,
} from '@/utils/popupState';

export interface PopupTriggers {
  idle: boolean;
  contentAccess: boolean;
  fourthAction: boolean;
  exitIntent: boolean;
}

export interface UsePopupTriggersOptions {
  enableGlobalTracking?: boolean; // Enable global click tracking
}

export const usePopupTriggers = (options: UsePopupTriggersOptions = {}) => {
  const { enableGlobalTracking = false } = options;

  const [activePopup, setActivePopup] = useState<PopupType | null>(null);
  const [triggers, setTriggers] = useState<PopupTriggers>({
    idle: false,
    contentAccess: false,
    fourthAction: false,
    exitIntent: false,
  });

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);
  const exitIntentCooldown = useRef<number>(0);
  const lastActionTime = useRef<number>(0);

  /**
   * Reset idle timer
   */
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      if (shouldShowPopup('idle')) {
        setTriggers(prev => ({ ...prev, idle: true }));
      }
    }, POPUP_CONFIG.timing.idleTimeout);
  }, []);

  /**
   * Track user action
   */
  const trackAction = useCallback(() => {
    const now = Date.now();

    // Prevent double-counting within same event (50ms window)
    // This happens when enableGlobalTracking is true AND manual trigger is called
    if (now - lastActionTime.current < 50) {
      return;
    }

    lastActionTime.current = now;
    const newCount = incrementActionCount();
    resetIdleTimer();

    // Check if this is the 4th action
    if (newCount === 4 && shouldShowPopup('fourthAction')) {
      setTriggers(prev => ({ ...prev, fourthAction: true }));
    }
  }, [resetIdleTimer]);

  /**
   * Trigger content access popup
   */
  const triggerContentAccess = useCallback(() => {
    if (shouldShowPopup('contentAccess')) {
      setTriggers(prev => ({ ...prev, contentAccess: true }));
      trackAction(); // Content access counts as an action
    }
  }, [trackAction]);

  /**
   * Handle exit intent (mouse leaving viewport)
   */
  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Only trigger if mouse leaves the DOCUMENT (not child elements)
    if (e.relatedTarget === null && e.clientY <= 0) {
      const now = Date.now();

      // Check cooldown
      if (now - exitIntentCooldown.current < POPUP_CONFIG.timing.exitIntentDebounce) {
        return;
      }

      if (shouldShowPopup('exitIntent')) {
        exitIntentCooldown.current = now;
        setTriggers(prev => ({ ...prev, exitIntent: true }));
      }
    }
  }, []);

  /**
   * Show specific popup
   */
  const showPopup = useCallback((type: PopupType) => {
    // Don't show if already showing a popup
    if (activePopup !== null) return;

    if (shouldShowPopup(type)) {
      setActivePopup(type);
      markPopupShown(type);
    }
  }, [activePopup]);

  /**
   * Hide active popup
   */
  const hidePopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  /**
   * Initialize triggers on mount
   */
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Start idle timer
    resetIdleTimer();

    // Add exit intent listener (desktop) - only on document
    const handleMouseLeave = (e: MouseEvent) => {
      handleExitIntent(e);
    };

    // Only add global click tracking if enabled (for testing)
    if (enableGlobalTracking) {
      const handleClick = () => {
        trackAction();
      };
      document.addEventListener('click', handleClick);

      return () => {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
        document.removeEventListener('click', handleClick);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [resetIdleTimer, trackAction, handleExitIntent, enableGlobalTracking]);

  /**
   * Show popup when trigger is activated
   */
  useEffect(() => {
    if (triggers.idle && !activePopup) {
      showPopup('idle');
      setTriggers(prev => ({ ...prev, idle: false }));
    } else if (triggers.contentAccess && !activePopup) {
      showPopup('contentAccess');
      setTriggers(prev => ({ ...prev, contentAccess: false }));
    } else if (triggers.fourthAction && !activePopup) {
      showPopup('fourthAction');
      setTriggers(prev => ({ ...prev, fourthAction: false }));
    } else if (triggers.exitIntent && !activePopup) {
      showPopup('exitIntent');
      setTriggers(prev => ({ ...prev, exitIntent: false }));
    }
  }, [triggers, activePopup, showPopup]);

  return {
    activePopup,
    showPopup,
    hidePopup,
    triggerContentAccess,
    trackAction,
    currentActionCount: getActionCount(),
  };
};

export default usePopupTriggers;
