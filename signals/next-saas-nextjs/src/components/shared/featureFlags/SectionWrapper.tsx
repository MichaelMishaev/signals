'use client';

import React, { ReactNode } from 'react';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

interface SectionWrapperProps {
  sectionId: string;
  sectionName?: string;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function SectionWrapper({
  sectionId,
  sectionName,
  children,
  fallback,
  className
}: SectionWrapperProps) {
  const { isEnabled, isAdmin } = useFeatureFlagContext();
  const [showOverride, setShowOverride] = React.useState(false);

  // Check if this section is enabled
  const sectionEnabled = isEnabled(`section_${sectionId}`);

  // For regular users, show content only if enabled
  if (!isAdmin) {
    if (sectionEnabled) {
      return <div className={className}>{children}</div>;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // For admins, provide inline toggle
  return (
    <div className={`relative ${className || ''}`}>
      {!sectionEnabled && (
        <div className="absolute -top-2 -left-2 z-50">
          <div className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-tl-md rounded-br-md shadow-sm">
            <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
              Hidden Section
            </span>
          </div>
        </div>
      )}

      <div className="absolute -top-2 right-0 z-50">
        <button
          onClick={() => setShowOverride(!showOverride)}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            sectionEnabled
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
          }`}
        >
          {showOverride ? '👁️' : '👁️‍🗨️'} {sectionName || sectionId}
        </button>
      </div>

      {(sectionEnabled && !showOverride) || (!sectionEnabled && showOverride) ? (
        <div
          className={
            !sectionEnabled && showOverride
              ? 'relative border-2 border-dashed border-purple-500 rounded-lg'
              : ''
          }
        >
          {!sectionEnabled && showOverride && (
            <div className="absolute top-0 left-0 right-0 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 text-xs rounded-t-lg">
              Hidden Section: {sectionName || sectionId} (Only visible to admins)
            </div>
          )}
          <div className={!sectionEnabled && showOverride ? 'pt-8' : ''}>
            {children}
          </div>
        </div>
      ) : (
        fallback && <>{fallback}</>
      )}
    </div>
  );
}