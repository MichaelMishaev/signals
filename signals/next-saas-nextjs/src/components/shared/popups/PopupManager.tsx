/**
 * Popup Manager
 * Central component that manages all popup triggers and displays
 *
 * NOTE: Disabled on signal/drill pages since they use the Gate System instead
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { usePopupTriggers } from '@/hooks/usePopupTriggers';
import BrokerPopup from './BrokerPopups';

export const PopupManager: React.FC = () => {
  const pathname = usePathname();

  // Disable PopupManager on signal/drill pages - they use GateManager instead
  const isSignalPage = pathname?.includes('/signal/');

  // Also disable on FAQ, Terms, and Privacy pages
  const isStaticPage = pathname?.includes('/faq') ||
                       pathname?.includes('/terms') ||
                       pathname?.includes('/privacy');

  const { activePopup, hidePopup } = usePopupTriggers();

  // Don't show popups on signal pages (gate system handles those) or static pages
  if (isSignalPage || isStaticPage || !activePopup) return null;

  return (
    <BrokerPopup
      type={activePopup}
      isOpen={!!activePopup}
      onClose={hidePopup}
    />
  );
};

export default PopupManager;
