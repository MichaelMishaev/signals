import React from 'react';
import SignalDetailCaseStudy from './signal-detail-case-study';
import { sampleSignalData } from '../sample-data';

const CaseStudyPreview = () => {
  return (
    <div className="min-h-screen bg-background-1 dark:bg-background-8">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Case Study Style Preview</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Professional performance tracking with before/after comparison tables
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              ⭐ Trading Relevance: 5/5
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">👤 User Experience: 4/5</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">⚡ Implementation: 5/5</span>
          </div>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 text-center">📊 Perfect for signal archives and performance reviews</p>
        </div>

        <SignalDetailCaseStudy signal={sampleSignalData} />

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Key Strengths</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Perfect before/after performance tracking</li>
            <li>• Professional metrics display with clean comparison</li>
            <li>• Built-in testimonial section for credibility</li>
            <li>• Easy implementation with existing components</li>
            <li>• Natural progression from analysis to results</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPreview;
