import React from 'react';
import SignalDetailBlog from './signal-detail-blog';
import { sampleSignalData } from '../sample-data';

const BlogPreview = () => {
  return (
    <div className="min-h-screen bg-background-1 dark:bg-background-8">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Style Preview</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Community-focused layout with social features and detailed analysis
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              ⭐ Trading Relevance: 3/5
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">👤 User Experience: 4/5</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">⚡ Implementation: 3/5</span>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 text-center">💬 Best for educational content and community engagement</p>
        </div>

        <SignalDetailBlog signal={sampleSignalData} />

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Key Strengths</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Social engagement with comments and sharing</li>
            <li>• Perfect author attribution and branding</li>
            <li>• Natural reading flow for detailed analysis</li>
            <li>• Community building features</li>
            <li>• Good for educational trading content</li>
          </ul>

          <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mt-4 mb-2">⚠️ Considerations</h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Less structured for quick trading decisions</li>
            <li>• Metrics scattered throughout content</li>
            <li>• Comments system needs implementation</li>
            <li>• Higher maintenance overhead</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
