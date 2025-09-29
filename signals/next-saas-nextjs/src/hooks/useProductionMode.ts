'use client';

import { useState, useEffect } from 'react';

export function useProductionMode() {
  const [isProductionMode, setIsProductionMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkProductionMode = () => {
      // Check if we're in actual production
      const isActualProduction = process.env.NODE_ENV === 'production';

      // Check if dev toggle is set to simulate production
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('dev-simulate-production='))
        ?.split('=')[1];
      const isSimulatingProduction = cookieValue === 'true';

      return isActualProduction || isSimulatingProduction;
    };

    setIsProductionMode(checkProductionMode());

    // Listen for cookie changes (when toggle is used)
    const interval = setInterval(() => {
      setIsProductionMode(checkProductionMode());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { isProductionMode, mounted };
}