'use client';

import React, { ReactNode } from 'react';
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

interface PageWrapperProps {
  pageId: string;
  pagePath?: string;
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export function PageWrapper({
  pageId,
  pagePath,
  children,
  fallback,
  className
}: PageWrapperProps) {
  const { isEnabled, isAdmin } = useFeatureFlagContext();
  const [showOverride, setShowOverride] = React.useState(false);

  // Check if this page is enabled
  const pageEnabled = isEnabled(`page_${pageId}`);

  // For regular users, show content only if enabled
  if (!isAdmin) {
    if (pageEnabled) {
      return <div className={className}>{children}</div>;
    }
    return fallback ? <>{fallback}</> : (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Page Under Construction
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This page is currently being worked on. Please check back later.
            </p>
            {pagePath && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                Path: {pagePath}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For admins, provide toggle to see hidden content
  return (
    <div className={`relative min-h-screen ${className || ''}`}>
      <div className="fixed top-20 right-4 z-50 bg-yellow-100 dark:bg-yellow-900 px-4 py-3 rounded-md shadow-lg">
        <div className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
          Page Control Panel
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showOverride}
            onChange={(e) => setShowOverride(e.target.checked)}
            className="w-4 h-4"
          />
          <span>Toggle View</span>
        </label>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs">Status:</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              pageEnabled
                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {pageEnabled ? 'Published' : 'Hidden'}
          </span>
        </div>
        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          ID: {pageId}
        </div>
        {pagePath && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Path: {pagePath}
          </div>
        )}
      </div>

      {(pageEnabled && !showOverride) || (!pageEnabled && showOverride) ? (
        <div
          className={
            !pageEnabled && showOverride
              ? 'border-4 border-dashed border-yellow-500'
              : ''
          }
        >
          {!pageEnabled && showOverride && (
            <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="font-medium">Admin Preview Mode</span>
              </div>
              <p className="text-sm mt-1">
                This page is hidden from regular users. Only admins can see this content.
              </p>
            </div>
          )}
          {children}
        </div>
      ) : (
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Page Under Construction
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  This page is currently being worked on. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}