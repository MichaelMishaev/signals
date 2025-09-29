'use client';

import React, { ReactNode } from 'react';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

interface SignalWrapperProps {
  signalId: string;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function SignalWrapper({
  signalId,
  children,
  fallback,
  className
}: SignalWrapperProps) {
  const { isEnabled, isAdmin } = useFeatureFlagContext();
  const [showOverride, setShowOverride] = React.useState(false);

  // Check if this signal is enabled
  const signalEnabled = isEnabled(`signal_${signalId}`);

  // For regular users, show content only if enabled
  if (!isAdmin) {
    if (signalEnabled) {
      return <div className={className}>{children}</div>;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // For admins, provide toggle to see hidden content
  return (
    <div className={`relative ${className || ''}`}>
      <div className="absolute -top-10 right-0 z-50 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-md shadow-lg">
        <label className="flex items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            checked={showOverride}
            onChange={(e) => setShowOverride(e.target.checked)}
            className="w-3 h-3"
          />
          <span>Show {signalEnabled ? 'as User' : 'Hidden'}</span>
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs ${
              signalEnabled
                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {signalEnabled ? 'Active' : 'Inactive'}
          </span>
        </label>
      </div>

      {(signalEnabled && !showOverride) || (!signalEnabled && showOverride) ? (
        <div
          className={
            !signalEnabled && showOverride
              ? 'opacity-60 border-2 border-dashed border-yellow-500 rounded-lg p-2'
              : ''
          }
        >
          {!signalEnabled && showOverride && (
            <div className="mb-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
              Hidden from users (Signal ID: {signalId})
            </div>
          )}
          {children}
        </div>
      ) : (
        fallback && <>{fallback}</>
      )}
    </div>
  );
}