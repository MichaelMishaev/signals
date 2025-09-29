'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Signal {
  id: number;
  title: string;
  content: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss: number;
  take_profit: number;
  current_price?: number;
  confidence: number;
  market: string;
  status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  author: string;
  chart_image?: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
  };
  design: string;
}

export default function TestDesignsPage() {
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check for existing admin session on component mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_verified');
    if (adminSession === 'true') {
      setIsPasswordVerified(true);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === '6262') {
      setIsPasswordVerified(true);
      setPasswordInput('');
      setError(null);
      sessionStorage.setItem('admin_verified', 'true');
    } else {
      setError('Invalid admin password');
      setPasswordInput('');
    }
  };

  // 10 Different Signal Designs
  const testSignals: Signal[] = [
    // Design 1: Classic Blue
    {
      id: 1,
      title: 'EUR/USD Bullish Breakout Signal',
      content: 'Strong technical breakout with volume confirmation. RSI shows bullish momentum above 60 level.',
      pair: 'EUR/USD',
      action: 'BUY',
      entry: 1.0845,
      stop_loss: 1.0820,
      take_profit: 1.0920,
      current_price: 1.0865,
      confidence: 89,
      market: 'FOREX',
      status: 'ACTIVE',
      author: 'John Martinez',
      chart_image: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=400&h=200&fit=crop',
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
        background: '#EFF6FF',
        text: '#1F2937',
        accent: '#F59E0B'
      },
      design: 'Classic'
    },
    // Design 2: Dark Mode
    {
      id: 2,
      title: 'GBP/JPY Bearish Reversal Setup',
      content: 'Multiple rejections at resistance level with bearish divergence on MACD.',
      pair: 'GBP/JPY',
      action: 'SELL',
      entry: 195.40,
      stop_loss: 196.80,
      take_profit: 192.50,
      current_price: 194.85,
      confidence: 82,
      market: 'FOREX',
      status: 'ACTIVE',
      author: 'Sarah Kim',
      chart_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
      colors: {
        primary: '#F97316',
        secondary: '#EF4444',
        background: '#111827',
        text: '#F9FAFB',
        accent: '#FBBF24'
      },
      design: 'Dark Mode'
    },
    // Design 3: Gradient
    {
      id: 3,
      title: 'BTC/USD Cryptocurrency Momentum',
      content: 'Breaking above key resistance with institutional buying pressure. Target new ATH.',
      pair: 'BTC/USD',
      action: 'BUY',
      entry: 98500,
      stop_loss: 95800,
      take_profit: 105000,
      current_price: 99200,
      confidence: 91,
      market: 'CRYPTO',
      status: 'ACTIVE',
      author: 'Alex Chen',
      chart_image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=200&fit=crop',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        text: '#FFFFFF',
        accent: '#F59E0B'
      },
      design: 'Gradient'
    },
    // Design 4: Minimal
    {
      id: 4,
      title: 'AAPL Stock Earnings Play',
      content: 'Pre-earnings momentum with strong technical setup. Volume increasing ahead of announcement.',
      pair: 'AAPL',
      action: 'BUY',
      entry: 195.50,
      stop_loss: 192.00,
      take_profit: 205.00,
      current_price: 197.25,
      confidence: 75,
      market: 'STOCKS',
      status: 'ACTIVE',
      author: 'Michael Rodriguez',
      chart_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',
      colors: {
        primary: '#374151',
        secondary: '#6B7280',
        background: '#FFFFFF',
        text: '#111827',
        accent: '#EF4444'
      },
      design: 'Minimal'
    },
    // Design 5: Neon
    {
      id: 5,
      title: 'ETH/USD DeFi Surge Signal',
      content: 'DeFi sector showing strength with ETH leading the charge. Network activity increasing.',
      pair: 'ETH/USD',
      action: 'BUY',
      entry: 3850,
      stop_loss: 3720,
      take_profit: 4200,
      current_price: 3920,
      confidence: 86,
      market: 'CRYPTO',
      status: 'ACTIVE',
      author: 'Emma Thompson',
      chart_image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop',
      colors: {
        primary: '#00FF88',
        secondary: '#FF0080',
        background: '#000000',
        text: '#00FF88',
        accent: '#FFFF00'
      },
      design: 'Neon'
    },
    // Design 6: Corporate
    {
      id: 6,
      title: 'Gold (XAU/USD) Safe Haven Demand',
      content: 'Geopolitical tensions driving safe haven demand. Technical breakout confirms bullish trend.',
      pair: 'XAU/USD',
      action: 'BUY',
      entry: 2040.50,
      stop_loss: 2025.00,
      take_profit: 2075.00,
      current_price: 2048.75,
      confidence: 88,
      market: 'COMMODITIES',
      status: 'ACTIVE',
      author: 'David Wilson',
      chart_image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=200&fit=crop',
      colors: {
        primary: '#1E40AF',
        secondary: '#DC2626',
        background: '#F8FAFC',
        text: '#0F172A',
        accent: '#F59E0B'
      },
      design: 'Corporate'
    },
    // Design 7: Retro
    {
      id: 7,
      title: 'USD/CAD Oil Correlation Play',
      content: 'Inverse correlation with oil prices creating opportunity. BoC policy divergence supportive.',
      pair: 'USD/CAD',
      action: 'BUY',
      entry: 1.3580,
      stop_loss: 1.3520,
      take_profit: 1.3680,
      current_price: 1.3595,
      confidence: 79,
      market: 'FOREX',
      status: 'ACTIVE',
      author: 'Lisa Park',
      chart_image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop',
      colors: {
        primary: '#DC2626',
        secondary: '#F59E0B',
        background: '#FEF3C7',
        text: '#92400E',
        accent: '#059669'
      },
      design: 'Retro'
    },
    // Design 8: Glass Morphism
    {
      id: 8,
      title: 'Tesla (TSLA) Breakout Signal',
      content: 'EV sector momentum with Tesla leading. Production numbers exceeding expectations.',
      pair: 'TSLA',
      action: 'BUY',
      entry: 248.50,
      stop_loss: 240.00,
      take_profit: 265.00,
      current_price: 252.75,
      confidence: 83,
      market: 'STOCKS',
      status: 'ACTIVE',
      author: 'Ryan Johnson',
      chart_image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        background: 'rgba(255, 255, 255, 0.25)',
        text: '#1F2937',
        accent: '#10B981'
      },
      design: 'Glass'
    },
    // Design 9: High Contrast
    {
      id: 9,
      title: 'AUD/USD Interest Rate Differential',
      content: 'RBA hawkish stance vs Fed pause creating opportunity. Commodity strength supportive.',
      pair: 'AUD/USD',
      action: 'BUY',
      entry: 0.6720,
      stop_loss: 0.6680,
      take_profit: 0.6800,
      current_price: 0.6735,
      confidence: 76,
      market: 'FOREX',
      status: 'ACTIVE',
      author: 'Sophie Anderson',
      chart_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        background: '#FFFF00',
        text: '#000000',
        accent: '#FF0000'
      },
      design: 'High Contrast'
    },
    // Design 10: Pastel
    {
      id: 10,
      title: 'EUR/GBP Brexit Recovery Play',
      content: 'Post-Brexit normalization with ECB policy supporting Euro strength vs Pound.',
      pair: 'EUR/GBP',
      action: 'BUY',
      entry: 0.8450,
      stop_loss: 0.8420,
      take_profit: 0.8520,
      current_price: 0.8465,
      confidence: 72,
      market: 'FOREX',
      status: 'ACTIVE',
      author: 'James Taylor',
      chart_image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
      colors: {
        primary: '#EC4899',
        secondary: '#8B5CF6',
        background: '#FDF2F8',
        text: '#831843',
        accent: '#06B6D4'
      },
      design: 'Pastel'
    }
  ];

  const SignalCard = ({ signal }: { signal: Signal }) => {
    const profitLoss = signal.current_price ?
      (signal.current_price - signal.entry) * (signal.action === 'BUY' ? 1 : -1) : 0;

    // Different card designs based on signal.design
    const getCardStyle = () => {
      switch (signal.design) {
        case 'Dark Mode':
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: `2px solid ${signal.colors.primary}`,
            boxShadow: `0 0 20px ${signal.colors.primary}40`
          };
        case 'Gradient':
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: 'none',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          };
        case 'Glass':
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          };
        case 'Neon':
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: `2px solid ${signal.colors.primary}`,
            boxShadow: `0 0 30px ${signal.colors.primary}, inset 0 0 30px ${signal.colors.secondary}40`,
            textShadow: `0 0 10px ${signal.colors.primary}`
          };
        case 'High Contrast':
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: `4px solid ${signal.colors.primary}`,
            boxShadow: '8px 8px 0px rgba(0,0,0,1)'
          };
        default:
          return {
            background: signal.colors.background,
            color: signal.colors.text,
            border: `1px solid ${signal.colors.primary}20`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          };
      }
    };

    return (
      <div className="relative rounded-lg p-6 transition-all duration-300 hover:scale-105" style={getCardStyle()}>
        {/* Design Label */}
        <div className="absolute top-2 right-2">
          <span
            className="px-2 py-1 rounded text-xs font-bold"
            style={{
              backgroundColor: signal.colors.primary,
              color: signal.design === 'Dark Mode' || signal.design === 'Neon' ? '#000' : '#fff'
            }}
          >
            {signal.design}
          </span>
        </div>

        {/* Header */}
        <div className="mb-4">
          <h3
            className="text-lg font-bold mb-2"
            style={{
              color: signal.colors.primary,
              textShadow: signal.design === 'Neon' ? `0 0 10px ${signal.colors.primary}` : 'none'
            }}
          >
            {signal.title}
          </h3>
          <div className="flex gap-2 mb-3">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: signal.colors.primary,
                color: signal.design === 'High Contrast' ? signal.colors.text : '#fff'
              }}
            >
              {signal.pair}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: signal.colors.secondary,
                color: signal.design === 'High Contrast' ? '#000' : '#fff'
              }}
            >
              {signal.action}
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor: signal.colors.accent || signal.colors.primary,
                color: '#fff'
              }}
            >
              {signal.confidence}%
            </span>
          </div>
        </div>

        {/* Chart Image */}
        {signal.chart_image && (
          <div className="mb-4">
            <img
              src={signal.chart_image}
              alt="Chart"
              className="w-full h-32 object-cover rounded"
              style={{
                filter: signal.design === 'Neon' ? 'hue-rotate(90deg) saturate(1.5)' :
                        signal.design === 'High Contrast' ? 'contrast(2) brightness(1.2)' : 'none'
              }}
            />
          </div>
        )}

        {/* Trading Data */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <div className="opacity-70">Entry</div>
            <div className="font-bold" style={{ color: signal.colors.primary }}>
              {signal.entry}
            </div>
          </div>
          <div>
            <div className="opacity-70">Current</div>
            <div className="font-bold" style={{ color: profitLoss >= 0 ? '#10B981' : '#EF4444' }}>
              {signal.current_price}
            </div>
          </div>
          <div>
            <div className="opacity-70">Stop Loss</div>
            <div className="font-bold text-red-500">
              {signal.stop_loss}
            </div>
          </div>
          <div>
            <div className="opacity-70">Take Profit</div>
            <div className="font-bold text-green-500">
              {signal.take_profit}
            </div>
          </div>
        </div>

        {/* P&L */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-70">P&L:</span>
            <span
              className="font-bold text-lg"
              style={{
                color: profitLoss >= 0 ? '#10B981' : '#EF4444',
                textShadow: signal.design === 'Neon' ? `0 0 10px ${profitLoss >= 0 ? '#10B981' : '#EF4444'}` : 'none'
              }}
            >
              {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm mb-4 opacity-80" style={{ color: signal.colors.text }}>
          {signal.content}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs opacity-70">
          <span>By {signal.author}</span>
          <span>{signal.market}</span>
        </div>

        {/* Special Effects for certain designs */}
        {signal.design === 'Neon' && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(45deg, ${signal.colors.primary}20, ${signal.colors.secondary}20)`,
              animation: 'pulse 2s infinite'
            }}
          />
        )}
      </div>
    );
  };

  if (!isPasswordVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Admin Access Required
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Access Test Designs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎨 Signal Design Test Gallery
              </h1>
              <p className="text-gray-600 mt-1">
                10 different visual designs for trading signals - explore colors, layouts, and styles
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/signals"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Design Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Design Variations</h2>
          <p className="text-gray-600 mb-6">
            Each design showcases different visual approaches for presenting trading signals.
            Choose colors, add images, customize layouts, and create engaging user experiences.
          </p>

          {/* Design Legend */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Available Design Styles:</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Classic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-900 rounded"></div>
                <span>Dark Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                <span>Gradient</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 border rounded"></div>
                <span>Minimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded" style={{ boxShadow: '0 0 8px #00FF88' }}></div>
                <span>Neon</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Corporate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                <span>Retro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white bg-opacity-25 backdrop-blur border rounded"></div>
                <span>Glass</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border-2 border-black rounded"></div>
                <span>High Contrast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-200 rounded"></div>
                <span>Pastel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {testSignals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>

        {/* Design Notes */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Design Implementation Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Color Customization</h4>
              <ul className="space-y-1">
                <li>• Primary: Main brand/action color</li>
                <li>• Secondary: Accent/highlight color</li>
                <li>• Background: Card/container background</li>
                <li>• Text: Main text color</li>
                <li>• Accent: Additional highlight color</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Special Effects</h4>
              <ul className="space-y-1">
                <li>• Shadows and glows for depth</li>
                <li>• Gradients for modern look</li>
                <li>• Glass morphism with blur effects</li>
                <li>• Neon effects with text shadows</li>
                <li>• High contrast for accessibility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Image Integration</h4>
              <ul className="space-y-1">
                <li>• Chart images from URLs</li>
                <li>• Responsive image sizing</li>
                <li>• Filter effects for themes</li>
                <li>• Fallback handling</li>
                <li>• Optimized loading</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Interactive Elements</h4>
              <ul className="space-y-1">
                <li>• Hover effects and animations</li>
                <li>• Real-time P&L calculations</li>
                <li>• Status indicators</li>
                <li>• Confidence level display</li>
                <li>• Author attribution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/admin/signals"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            ← Back to Signals Admin
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Back to Main Admin
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}