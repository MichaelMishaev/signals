'use client';

import { useState, useEffect } from 'react';

export default function DevProductionToggle() {
  const [isProductionMode, setIsProductionMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check current cookie state
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('dev-simulate-production='))
      ?.split('=')[1];
    setIsProductionMode(cookieValue === 'true');
  }, []);

  const toggleProductionMode = () => {
    const newValue = !isProductionMode;
    setIsProductionMode(newValue);

    // Set cookie
    document.cookie = `dev-simulate-production=${newValue}; path=/; max-age=86400`; // 24 hours

    // Reload page to apply middleware changes
    window.location.reload();
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production' || !mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-sm font-medium">Dev Mode:</span>
        <button
          onClick={toggleProductionMode}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isProductionMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isProductionMode ? 'Production View' : 'Development View'}
        </button>
        <div className="text-xs text-gray-300">
          {isProductionMode ? 'Simulating production restrictions' : 'All routes accessible'}
        </div>
      </div>
    </div>
  );
}