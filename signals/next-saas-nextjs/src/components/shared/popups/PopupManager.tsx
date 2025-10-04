/**
 * Popup Manager
 * Central component that manages all popup triggers and displays
 */

'use client';

import React from 'react';
import { usePopupTriggers } from '@/hooks/usePopupTriggers';
import BrokerPopup from './BrokerPopups';

export const PopupManager: React.FC = () => {
  const { activePopup, hidePopup } = usePopupTriggers();

  if (!activePopup) return null;

  return (
    <BrokerPopup
      type={activePopup}
      isOpen={!!activePopup}
      onClose={hidePopup}
    />
  );
};

export default PopupManager;
