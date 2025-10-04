/**
 * Gate Manager
 * Central component that manages which gate to display
 */

'use client';

import React from 'react';
import { UseGateFlowReturn } from '@/hooks/useGateFlow';
import EmailGateModal from './EmailGateModal';
import BrokerGateModal from './BrokerGateModal';

interface GateManagerProps {
  gateFlow: UseGateFlowReturn;
}

export const GateManager: React.FC<GateManagerProps> = ({ gateFlow }) => {
  const {
    activeGate,
    onEmailSubmit,
    onBrokerClick,
    onBrokerVerify,
    closeGate,
  } = gateFlow;

  console.log('[GateManager] Rendering with activeGate:', activeGate);

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
