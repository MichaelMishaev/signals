'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SignalImportData {
  title: string;
  title_ur?: string;
  content: string;
  content_ur?: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss?: number;
  take_profit?: number;
  confidence: number;
  market: 'FOREX' | 'CRYPTO' | 'PSX' | 'COMMODITIES';
  status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  author_ur?: string;
  published_date?: string;
}

export default function SignalImportPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sampleJson = {
    title: "EUR/USD Strong BUY Signal - Bullish Momentum",
    title_ur: "EUR/USD مضبوط خریداری کا سگنل - تیزی کا رجحان",
    content: "Technical analysis shows strong bullish momentum with RSI oversold recovery and key support at 1.0820. Multiple indicators confirm upward trend.",
    content_ur: "تکنیکی تجزیہ مضبوط تیزی کا رجحان ظاہر کرتا ہے۔",
    pair: "EUR/USD",
    action: "BUY",
    entry: 1.0850,
    stop_loss: 1.0820,
    take_profit: 1.0920,
    confidence: 87,
    market: "FOREX",
    status: "ACTIVE",
    priority: "HIGH",
    author: "Ahmad Ali",
    author_ur: "احمد علی",
    published_date: new Date().toISOString()
  };

  const validateSignal = (data: any): string[] => {
    const errors: string[] = [];

    // Required fields
    if (!data.title) errors.push('Missing required field: title');
    if (!data.content) errors.push('Missing required field: content');
    if (!data.pair) errors.push('Missing required field: pair');
    if (!data.action) errors.push('Missing required field: action');
    if (data.entry === undefined || data.entry === null) errors.push('Missing required field: entry');
    if (data.confidence === undefined || data.confidence === null) errors.push('Missing required field: confidence');
    if (!data.market) errors.push('Missing required field: market');
    if (!data.author) errors.push('Missing required field: author');

    // Validate enums
    if (data.action && !['BUY', 'SELL'].includes(data.action)) {
      errors.push('action must be either "BUY" or "SELL"');
    }

    if (data.market && !['FOREX', 'CRYPTO', 'PSX', 'COMMODITIES'].includes(data.market)) {
      errors.push('market must be one of: FOREX, CRYPTO, PSX, COMMODITIES');
    }

    if (data.status && !['ACTIVE', 'CLOSED', 'CANCELLED'].includes(data.status)) {
      errors.push('status must be one of: ACTIVE, CLOSED, CANCELLED');
    }

    if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority)) {
      errors.push('priority must be one of: HIGH, MEDIUM, LOW');
    }

    // Validate numbers
    if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 100)) {
      errors.push('confidence must be between 0 and 100');
    }

    if (data.entry !== undefined && isNaN(data.entry)) {
      errors.push('entry must be a valid number');
    }

    return errors;
  };

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationErrors([]);

    try {
      // Parse JSON
      let signalData: SignalImportData;
      try {
        signalData = JSON.parse(jsonInput);
      } catch (e) {
        setError('Invalid JSON format. Please check your JSON syntax.');
        setIsLoading(false);
        return;
      }

      // Validate
      const errors = validateSignal(signalData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsLoading(false);
        return;
      }

      // Add default values
      signalData.status = signalData.status || 'ACTIVE';
      signalData.priority = signalData.priority || 'MEDIUM';
      signalData.published_date = signalData.published_date || new Date().toISOString();

      // Send to API
      const response = await fetch('/api/admin/signal-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signalData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to import signal');
        setIsLoading(false);
        return;
      }

      setResult(data);
      setJsonInput(''); // Clear input on success
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    setJsonInput(JSON.stringify(sampleJson, null, 2));
    setError(null);
    setResult(null);
    setValidationErrors([]);
  };

  const handleClear = () => {
    setJsonInput('');
    setError(null);
    setResult(null);
    setValidationErrors([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📥 Signal Import Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste JSON to create a new signal with auto-generated drills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                1. Paste JSON Data
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleUseSample}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Use Sample
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your signal JSON here..."
              className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4">
              <button
                onClick={handleImport}
                disabled={isLoading || !jsonInput.trim()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '⏳ Processing...' : '🚀 Import Signal & Generate Drills'}
              </button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                  ❌ Validation Errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx} className="text-sm text-red-700 dark:text-red-400">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Instructions & Result Section */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📖 Instructions
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Required Fields:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">title</code> - Signal title (English)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">content</code> - Signal description</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">pair</code> - Trading pair (e.g., "EUR/USD")</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">action</code> - "BUY" or "SELL"</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">entry</code> - Entry price (number)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">confidence</code> - 0-100</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">market</code> - FOREX, CRYPTO, PSX, or COMMODITIES</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">author</code> - Author name</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Optional Fields:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">title_ur</code> - Urdu title</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">content_ur</code> - Urdu description</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">stop_loss</code> - Stop loss price</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">take_profit</code> - Take profit price</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">status</code> - ACTIVE, CLOSED, CANCELLED</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">priority</code> - HIGH, MEDIUM, LOW</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">author_ur</code> - Urdu author name</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 Tip: Click "Use Sample" to see a complete example
                  </p>
                </div>
              </div>
            </div>

            {/* Success Result */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
                  ✅ Success!
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">Signal Created:</h3>
                    <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">{result.signal.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        ID: {result.signal.id} | {result.signal.pair} | {result.signal.action}
                      </p>
                    </div>
                  </div>

                  {result.drills && result.drills.length > 0 && (
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                        Drills Generated: ({result.drills.length})
                      </h3>
                      <div className="space-y-2">
                        {result.drills.map((drill: any, idx: number) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                            <p className="text-gray-900 dark:text-white font-medium">{drill.title}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              Type: {drill.type} | ID: {drill.id}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-green-200 dark:border-green-800">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      🔗 View Signal on Live Site
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
