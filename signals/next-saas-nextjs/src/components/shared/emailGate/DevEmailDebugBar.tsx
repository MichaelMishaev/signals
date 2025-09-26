'use client';

import { useEffect, useState } from 'react';
import { useModalContext } from '@/context/ModalContext';

export default function DevEmailDebugBar() {
  const [storedData, setStoredData] = useState<unknown>(null);
  const { emailGate } = useModalContext();

  useEffect(() => {
    const data = localStorage.getItem('emailGate');
    if (data) {
      setStoredData(JSON.parse(data));
    }
  }, [emailGate.hasSubmittedEmail]);

  const clearEmail = () => {
    localStorage.removeItem('emailGate');
    window.location.reload();
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

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
