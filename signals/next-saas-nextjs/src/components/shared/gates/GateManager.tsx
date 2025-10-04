/**
 * Gate Manager
 * Central component that manages which gate to display
 */

'use client';

import React from 'react';
import { useGateFlow } from '@/hooks/useGateFlow';
import EmailGateModal from './EmailGateModal';
import BrokerGateModal from './BrokerGateModal';

interface GateManagerProps {
  currentSignal?: {
    confidence: number;
    currentProfit: number;
  };
}

export const GateManager: React.FC<GateManagerProps> = ({ currentSignal }) => {
  const {
    activeGate,
    onEmailSubmit,
    onBrokerClick,
    onBrokerVerify,
    closeGate,
  } = useGateFlow(currentSignal);

  return (
    <>
      {/* Email Gate */}
      <EmailGateModal
        isOpen={activeGate === 'email'}
        onSubmit={onEmailSubmit}
        onClose={closeGate}
      />

      {/* Broker Gate */}
      <BrokerGateModal
        isOpen={activeGate === 'broker'}
        onBrokerClick={onBrokerClick}
        onAlreadyHaveAccount={onBrokerVerify}
        onClose={closeGate}
      />
    </>
  );
};

export default GateManager;
