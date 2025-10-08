'use client';

import { useState, useEffect } from 'react';

/**
 * Phase 0: Urdu Demand Analysis Dashboard
 *
 * Purpose: Visualize user interest in Urdu translation to make data-driven
 * go/no-go decision before investing 243 hours in full implementation.
 *
 * Access: /admin/urdu-demand
 */

interface UrduDemandStats {
  totalClicks: number;
  last7Days: number;
  last30Days: number;
  conversionRate: number;
  estimatedTotalVisitors: number;
  demandLevel: 'HIGH' | 'MODERATE' | 'LOW';
  recommendation: string;
  demoMode: boolean;
  dataCollectedSince?: string;
  lastUpdated?: string;
}

export default function UrduDemandDashboard() {
  const [stats, setStats] = useState<UrduDemandStats>({
    totalClicks: 0,
    last7Days: 0,
    last30Days: 0,
    conversionRate: 0,
    estimatedTotalVisitors: 0,
    demandLevel: 'LOW',
    recommendation: 'Loading...',
    demoMode: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    // Refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/urdu-demand');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching Urdu demand stats:', err);
      setError('Failed to load analytics. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-green-600 dark:text-green-400';
      case 'MODERATE':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'LOW':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getDemandLevelBg = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'MODERATE':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'LOW':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-2 dark:bg-background-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-2 dark:bg-background-6 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Phase 0: Urdu Demand Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tracking user interest in Urdu translation before investing 243 hours in implementation
          </p>
          {stats.demoMode && (
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Demo Mode:</strong> Supabase not configured. Showing mock data.
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200">
                ❌ <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Clicks */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total Interest Clicks
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.totalClicks}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              All-time clicks on "View in Urdu?" button
            </p>
          </div>

          {/* Last 7 Days */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Last 7 Days
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.last7Days}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Recent week activity
            </p>
          </div>

          {/* Last 30 Days */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Last 30 Days
            </h3>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {stats.last30Days}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Monthly demand signal
            </p>
          </div>

          {/* Demand Level */}
          <div className={`${getDemandLevelBg(stats.demandLevel)} p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700`}>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Demand Level
            </h3>
            <p className={`text-2xl font-bold ${getDemandLevelColor(stats.demandLevel)}`}>
              {stats.demandLevel === 'HIGH' && '🟢 HIGH'}
              {stats.demandLevel === 'MODERATE' && '🟡 MODERATE'}
              {stats.demandLevel === 'LOW' && '🔴 LOW'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {stats.conversionRate.toFixed(1)}% conversion rate
            </p>
          </div>
        </div>

        {/* Decision Matrix */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Decision Matrix
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  HIGH Demand (&gt;30% conversion)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  → <strong>Action:</strong> Proceed to Phase 1 immediately. Strong user demand validated.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🟡</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  MODERATE Demand (10-30% conversion)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  → <strong>Action:</strong> Continue monitoring for 3 more months. Gather more data before deciding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  LOW Demand (&lt;10% conversion)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  → <strong>Action:</strong> Focus on English-only. Insufficient demand detected. Save 243 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`${getDemandLevelBg(stats.demandLevel)} rounded-lg border border-gray-200 dark:border-gray-700 p-6`}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            💡 Recommendation
          </h2>
          <p className="text-lg text-gray-900 dark:text-white font-medium">
            {stats.recommendation}
          </p>
        </div>

        {/* Metadata */}
        {stats.dataCollectedSince && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Data collected since: {new Date(stats.dataCollectedSince).toLocaleDateString()}</p>
            <p>Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'N/A'}</p>
            <p className="mt-2 text-xs">
              Estimated monthly visitors: {stats.estimatedTotalVisitors.toLocaleString()}
            </p>
          </div>
        )}

        {/* Documentation Link */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">
            📖 Phase 0 Documentation
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
            This dashboard is part of Phase 0 (Demand Validation) from the Urdu implementation plan.
          </p>
          <a
            href="/Documentation/uiUx/implrove_2.md"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            → Read full implementation plan
          </a>
        </div>
      </div>
    </div>
  );
}
