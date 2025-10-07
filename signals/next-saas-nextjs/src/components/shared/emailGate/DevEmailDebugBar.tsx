'use client';

import { useEffect, useState } from 'react';
import { useModalContext } from '@/context/ModalContext';

export default function DevEmailDebugBar() {
  const [storedData, setStoredData] = useState<{email?: string; timestamp: number} | null>(null);
  const [mounted, setMounted] = useState(false);
  const { emailGate } = useModalContext();

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('emailGate');
    if (data) {
      setStoredData(JSON.parse(data));
    }
  }, [emailGate.hasSubmittedEmail]);

  const clearEmail = () => {
    // Clear localStorage - emailGate
    localStorage.removeItem('emailGate');

    // Clear gate flow state (all variations)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gate_flow_state')) {
        localStorage.removeItem(key);
      }
    });

    // Clear rate limiting data from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('email_submission_')) {
        localStorage.removeItem(key);
      }
    });

    // Clear email verification cookie if it exists
    document.cookie = 'email_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'verification_message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Use the email gate's clear function
    if (emailGate.clearEmailGate) {
      emailGate.clearEmailGate();
    }

    // Update local state immediately
    setStoredData(null);

    // Reload page to reset all state
    window.location.reload();
  };

  // Show in development OR when explicitly enabled via localStorage flag
  const isDebugEnabled = typeof window !== 'undefined' && localStorage.getItem('enable_email_debug') === 'true';
  const shouldHide = (process.env.NODE_ENV !== 'development' && !isDebugEnabled) || !mounted;

  if (shouldHide) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] bg-yellow-400/95 text-black px-4 py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold">🚧 DEV</span>
          <span>Email: {storedData?.email || 'Not set'}</span>
          <span>Has Access: {emailGate.hasSubmittedEmail ? '✅' : '❌'}</span>
          {storedData && (
            <span>Expires: {new Date(storedData.timestamp + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
          )}
        </div>
        <button
          onClick={clearEmail}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-sans text-xs font-medium">
          Clear Email Gate
        </button>
      </div>
    </div>
  );
}
