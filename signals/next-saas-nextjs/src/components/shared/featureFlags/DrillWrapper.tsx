'use client';

import React, { ReactNode } from 'react';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

interface DrillWrapperProps {
  drillId: string;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function DrillWrapper({
  drillId,
  children,
  fallback,
  className
}: DrillWrapperProps) {
  const { isEnabled, isAdmin } = useFeatureFlagContext();
  const [showOverride, setShowOverride] = React.useState(false);

  // Check if this drill is enabled
  const drillEnabled = isEnabled(`drill_${drillId}`);

  // For regular users, show content only if enabled
  if (!isAdmin) {
    if (drillEnabled) {
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
          <span>Show {drillEnabled ? 'as User' : 'Hidden'}</span>
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs ${
              drillEnabled
                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {drillEnabled ? 'Active' : 'Inactive'}
          </span>
        </label>
      </div>

      {(drillEnabled && !showOverride) || (!drillEnabled && showOverride) ? (
        <div
          className={
            !drillEnabled && showOverride
              ? 'opacity-60 border-2 border-dashed border-orange-500 rounded-lg p-2'
              : ''
          }
        >
          {!drillEnabled && showOverride && (
            <div className="mb-2 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
              Hidden from users (Drill ID: {drillId})
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