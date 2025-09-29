'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFeatureFlags, UseFeatureFlagsOptions, FeatureFlag } from '@/hooks/useFeatureFlags';

interface FeatureFlagContextValue {
  flags: Record<string, FeatureFlag>;
  loading: boolean;
  error: string | null;
  isEnabled: (key: string) => boolean;
  getValue: (key: string, defaultValue?: any) => any;
  refresh: () => Promise<void>;
  isAdmin: boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined);

export function FeatureFlagProvider({
  children,
  options = {}
}: {
  children: ReactNode;
  options?: UseFeatureFlagsOptions;
}) {
  const featureFlags = useFeatureFlags(options);

  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagContext() {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlagContext must be used within FeatureFlagProvider');
  }
  return context;
}

// Component wrapper for feature flags
export function FeatureFlag({
  flag,
  children,
  fallback = null
}: {
  flag: string;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isEnabled } = useFeatureFlagContext();

  if (isEnabled(flag)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// Component for admin toggle visibility
export function AdminToggle({
  children,
  showToggle = true
}: {
  children: ReactNode;
  showToggle?: boolean;
}) {
  const { isAdmin, isEnabled } = useFeatureFlagContext();
  const [overrideShow, setOverrideShow] = React.useState(false);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="relative">
      {showToggle && (
        <div className="absolute -top-8 right-0 z-50">
          <label className="flex items-center gap-2 text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={overrideShow}
              onChange={(e) => setOverrideShow(e.target.checked)}
              className="w-3 h-3"
            />
            <span>Show Hidden Content</span>
          </label>
        </div>
      )}
      {overrideShow && (
        <div className="opacity-50 border-2 border-dashed border-yellow-500 rounded p-2">
          {children}
        </div>
      )}
    </div>
  );
}