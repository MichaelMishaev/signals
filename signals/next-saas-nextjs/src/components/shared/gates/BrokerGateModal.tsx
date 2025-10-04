/**
 * Broker Gate Modal
 * Blocking modal that requires broker account to continue viewing signals
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { brokerGateConfig, GATE_CONFIG } from '@/config/gates';

interface BrokerGateModalProps {
  isOpen: boolean;
  onBrokerClick: (clickId: string) => void;
  onAlreadyHaveAccount: () => void;
  onClose?: () => void; // Optional - gate is blocking
}

export const BrokerGateModal: React.FC<BrokerGateModalProps> = ({
  isOpen,
  onBrokerClick,
  onAlreadyHaveAccount,
  onClose,
}) => {
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenBroker = () => {
    // Generate unique click ID
    const clickId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Track click
    onBrokerClick(clickId);

    // Open broker URL with tracking
    const trackingUrl = `${GATE_CONFIG.brokerUrl}?ref=signals&clickid=${clickId}`;
    window.open(trackingUrl, '_blank');

    // Show waiting message
    alert('Complete your broker signup. This page will update automatically once verified (5-30 minutes).');
  };

  const handleAlreadyHaveAccount = () => {
    setShowVerification(true);
  };

  const handleVerifyCode = async () => {
    setIsProcessing(true);

    // TODO: Implement verification API call
    // For now, just call the callback
    setTimeout(() => {
      onAlreadyHaveAccount();
      setIsProcessing(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl',
            'transform transition-all duration-300',
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          )}
        >
          <div className="p-6 sm:p-8">
            {!showVerification ? (
              <>
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-3xl">🚀</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                  {brokerGateConfig.title}
                </h2>

                {/* Subtitle */}
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  {brokerGateConfig.subtitle}
                </p>

                {/* Pricing Tiers */}
                <div className="space-y-3 mb-6">
                  {brokerGateConfig.tiers.map((tier, index) => (
                    <div
                      key={index}
                      className={cn(
                        'rounded-lg p-4 border-2 transition-all',
                        tier.recommended
                          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500 dark:border-amber-400'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${tier.deposit} deposit
                          </span>
                          {tier.recommended && (
                            <span className="ml-2 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <span className={cn(
                          'text-sm font-medium',
                          tier.recommended ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
                        )}>
                          {tier.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tier.bonus}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleOpenBroker}
                    className={cn(
                      'w-full px-6 py-4 rounded-lg font-bold text-white text-lg',
                      'bg-gradient-to-r from-amber-600 to-orange-600',
                      'hover:from-amber-700 hover:to-orange-700',
                      'transition-all transform hover:scale-105',
                      'shadow-lg hover:shadow-xl'
                    )}
                  >
                    {brokerGateConfig.ctaText} →
                  </button>

                  <button
                    onClick={handleAlreadyHaveAccount}
                    className={cn(
                      'w-full px-6 py-3 rounded-lg font-semibold',
                      'bg-gray-200 dark:bg-gray-800',
                      'text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-300 dark:hover:bg-gray-700',
                      'transition-colors'
                    )}
                  >
                    {brokerGateConfig.ctaSecondary}
                  </button>
                </div>

                {/* Verification Note */}
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {brokerGateConfig.verificationNote}
                </p>

                {/* Risk Disclosure */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                  {brokerGateConfig.riskDisclosure}
                </p>
              </>
            ) : (
              <>
                {/* Verification View */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    Verify Your Broker Account
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Enter the confirmation code from your broker:
                  </p>

                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="CONFIRMED-ABC123"
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border-2 mb-4',
                      'bg-white dark:bg-gray-800',
                      'border-gray-300 dark:border-gray-700',
                      'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                      'text-gray-900 dark:text-white text-center font-mono',
                      'placeholder:text-gray-500 dark:placeholder:text-gray-400'
                    )}
                  />

                  <button
                    onClick={handleVerifyCode}
                    disabled={!verificationCode || isProcessing}
                    className={cn(
                      'w-full px-6 py-3 rounded-lg font-bold text-white mb-3',
                      'bg-blue-600 hover:bg-blue-700',
                      'transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? 'Verifying...' : 'Verify Code'}
                  </button>

                  <button
                    onClick={() => setShowVerification(false)}
                    className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrokerGateModal;
