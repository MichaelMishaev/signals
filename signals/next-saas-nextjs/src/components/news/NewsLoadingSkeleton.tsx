import React from 'react';

interface NewsLoadingSkeletonProps {
  count?: number;
  message?: string;
}

const NewsLoadingSkeleton = ({ count = 6, message }: NewsLoadingSkeletonProps) => {
  return (
    <div className="w-full">
      {/* Loading Message */}
      {message && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
            {/* Spinner */}
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 rounded-full border-2 border-primary-200 dark:border-primary-800"></div>
              <div className="absolute inset-0 rounded-full border-2 border-primary-600 dark:border-primary-400 border-t-transparent animate-spin"></div>
            </div>

            {/* Message */}
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {message}
            </span>
          </div>
        </div>
      )}

      {/* Skeleton Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm animate-pulse"
          >
            {/* Content Area */}
            <div className="p-6 space-y-4">
              {/* Category Badge */}
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>

              {/* Related Symbols */}
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>

              {/* Button */}
              <div className="pt-2">
                <div className="h-9 w-28 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Translation Progress Info (Optional) */}
      {message && (
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This may take 10-15 seconds on first load</p>
          <p className="mt-1">Subsequent loads will be instant (cached)</p>
        </div>
      )}
    </div>
  );
};

export default NewsLoadingSkeleton;
