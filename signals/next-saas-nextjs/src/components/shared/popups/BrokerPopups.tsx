/**
 * Broker Signup Popups
 * 4 popup types: idle, content access, 4th action, exit intent
 * All link to single configurable broker URL
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { POPUP_CONFIG, PopupType } from '@/config/popups';
import { trackAffiliateClick } from '@/utils/affiliateTracking';

interface BrokerPopupProps {
  type: PopupType;
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerPopup: React.FC<BrokerPopupProps> = ({ type, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAction = async () => {
    // Track affiliate click based on popup type
    const sourceMap: Record<PopupType, any> = {
      idle: 'popup_idle',
      contentAccess: 'popup_content_access',
      fourthAction: 'popup_fourth_action',
      exitIntent: 'popup_exit_intent',
    };

    const affiliateUrl = await trackAffiliateClick({
      source: sourceMap[type],
      metadata: {
        popupType: type,
      },
    });

    // Open affiliate link in new tab
    window.open(affiliateUrl, '_blank');
    handleClose();
  };

  if (!isOpen) return null;

  // IDLE POPUP - Shows after 1 minute of inactivity
  if (type === 'idle') {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={handleClose}
        />
        <div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            'transition-all duration-300',
            isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95'
          )}
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <span className="text-white text-xl">×</span>
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>

                <p className="text-white text-lg mb-6 leading-relaxed">
                  {POPUP_CONFIG.messages.idle}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleAction}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                  >
                    Start Trading Now →
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-gray-500 text-xs mt-4">Educational purposes only</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // CONTENT ACCESS POPUP - Shows when clicking signal/news
  if (type === 'contentAccess') {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={handleClose}
        />
        <div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            'transition-all duration-300',
            isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95'
          )}
        >
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-cyan-500/30 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <span className="text-white text-xl">×</span>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔓</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">Premium Content</h3>

              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                {POPUP_CONFIG.messages.contentAccess}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleAction}
                  className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
                >
                  Unlock Now →
                </button>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Browse Free Content
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-4">No investment advice provided</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // FOURTH ACTION POPUP - Shows once only on 4th action
  if (type === 'fourthAction') {
    const { basic, standard, premium } = POPUP_CONFIG.pricing;

    return (
      <>
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={handleClose}
        />
        <div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg',
            'transition-all duration-300',
            isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95'
          )}
        >
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <span className="text-white text-xl">×</span>
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-3xl">🚀</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">Special Offer!</h3>

                <p className="text-gray-300 text-base mb-6 leading-relaxed">
                  {POPUP_CONFIG.messages.fourthAction}
                </p>

                {/* Pricing Tiers */}
                <div className="space-y-3 mb-6">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">${basic.price} account</span>
                      <span className="text-gray-400 text-sm">{basic.label}</span>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 border border-amber-500/50">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">${standard.price} account</span>
                      <span className="text-amber-400 text-sm">{standard.label}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-4 border border-amber-500">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">${premium.price} account</span>
                      <span className="text-amber-400 text-sm font-bold">{premium.label}!</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAction}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 mb-3"
                >
                  Open Account Now →
                </button>

                <button
                  onClick={handleClose}
                  className="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  I'll decide later
                </button>

                <p className="text-gray-500 text-xs mt-4">Risk disclosure applies</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // EXIT INTENT POPUP - Shows when leaving (email subscribers only)
  if (type === 'exitIntent') {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
          onClick={handleClose}
        />
        <div
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md',
            'transition-all duration-300',
            isVisible ? 'animate-scaleIn' : 'opacity-0 scale-95'
          )}
        >
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border-2 border-red-500 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <span className="text-white text-xl">×</span>
            </button>

            <div className="text-center">
              <div className="text-5xl mb-4 animate-shake">👋</div>

              <h3 className="text-2xl font-bold text-white mb-3">Before You Go...</h3>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {POPUP_CONFIG.messages.exitIntent}
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 font-bold text-xl mb-1">EXCLUSIVE BONUS</p>
                <p className="text-white text-2xl font-black">3 FREE SIGNALS</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAction}
                  className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                >
                  Claim My Bonus →
                </button>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  No thanks, I'll pass
                </button>
              </div>

              <p className="text-gray-500 text-xs mt-4">For informational use only</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default BrokerPopup;
