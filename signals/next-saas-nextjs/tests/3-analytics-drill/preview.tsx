import React from 'react';
import SignalDetailAnalytics from './signal-detail-analytics';
import { sampleSignalData } from '../sample-data';

const AnalyticsPreview = () => {
  return (
    <div className="min-h-screen bg-background-1 dark:bg-background-8">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Analytics Style Preview</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Professional dashboard with real-time KPIs and live performance tracking
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              ⭐ Trading Relevance: 5/5
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">👤 User Experience: 5/5</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">⚡ Implementation: 4/5</span>
          </div>
          <div className="mt-2">
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
              🏆 RECOMMENDED WINNER
            </span>
          </div>
        </div>

        <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-4 mb-4 bg-green-50 dark:bg-green-900/10">
          <p className="text-sm text-green-700 dark:text-green-300 text-center font-medium">
            📊 Perfect for active signals and professional trading platforms
          </p>
        </div>

        <SignalDetailAnalytics signal={sampleSignalData} />

        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">🏆 Why This Style Wins</h3>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 mb-4">
            <li>• Real-time KPI dashboard familiar to traders</li>
            <li>• Live performance tracking with visual indicators</li>
            <li>• Professional interface matching institutional platforms</li>
            <li>• Advanced analytics with risk assessment</li>
            <li>• Scalable design for additional metrics</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-green-800/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Key Features</h4>
              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                <li>• Circular progress indicators</li>
                <li>• Support/resistance level tables</li>
                <li>• Live chart integration area</li>
                <li>• Analyst track record display</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-green-800/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Perfect For</h4>
              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                <li>• Active signal monitoring</li>
                <li>• Professional traders</li>
                <li>• Real-time market analysis</li>
                <li>• Institutional platforms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPreview;
