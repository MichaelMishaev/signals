'use client';
import React from 'react';

// 1. Premium Glass Morphism Design
export function PremiumGlassPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white text-3xl font-light">×</button>

          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-3">
            Start Trading Today
          </h2>
          <p className="text-white/80 text-center mb-8 text-lg">
            Join 50,000+ traders using our premium signals
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-xs text-white/60">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-white/60">Traders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-white/60">Support</div>
            </div>
          </div>

          <a
            href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg text-center shadow-lg transform transition hover:scale-105"
          >
            Open Trading Account →
          </a>

          <p className="text-white/50 text-center text-xs mt-4">
            No credit card required • Start in 2 minutes
          </p>
        </div>
      </div>
    </>
  );
}

// 2. Minimal Elegant Design
export function MinimalElegantPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
        <div className="bg-white rounded-none p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900" />

          <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 text-2xl">×</button>

          <div className="space-y-8">
            <div>
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">Premium Trading</div>
              <h1 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
                Trade with<br />Confidence
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Professional-grade signals delivered instantly to your device. Make informed decisions, maximize profits.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-3 py-6 border-t border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                <span className="text-gray-700">Real-time market analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                <span className="text-gray-700">Expert trading signals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                <span className="text-gray-700">Risk management tools</span>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 text-white text-center font-medium transition-colors"
              >
                Start Trading
              </a>
              <button
                onClick={onClose}
                className="px-8 py-4 border border-gray-300 hover:border-gray-900 text-gray-900 font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 3. Bold Gradient Impact
export function BoldGradientPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
        <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-1 shadow-2xl">
          <div className="bg-gray-900 rounded-3xl p-10 relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl">×</button>

            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full text-white text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Limited Offer
            </div>

            <h2 className="text-5xl font-black text-white mb-4 leading-tight">
              Trade Like a<br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Pro
              </span>
            </h2>

            <p className="text-white/80 text-xl mb-8">
              Get exclusive access to premium trading signals with up to 89% accuracy rate
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-white font-semibold">Instant Signals</div>
                <div className="text-white/60 text-sm">Real-time alerts</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-white font-semibold">High Accuracy</div>
                <div className="text-white/60 text-sm">89% win rate</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-white font-semibold">Expert Analysis</div>
                <div className="text-white/60 text-sm">Pro traders</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-white font-semibold">Secure Trading</div>
                <div className="text-white/60 text-sm">Protected funds</div>
              </div>
            </div>

            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-2xl font-bold text-xl text-center shadow-xl transform transition hover:scale-105"
            >
              Start Trading Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// 4. Professional Dashboard Style
export function ProfessionalDashboardPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900/95 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 relative">
            <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white text-2xl">×</button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Trading Dashboard</h2>
                <p className="text-emerald-100">Your gateway to profitable trading</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Win Rate</div>
                <div className="text-emerald-400 text-2xl font-bold">89.2%</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Avg Profit</div>
                <div className="text-emerald-400 text-2xl font-bold">+12.4%</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Signals</div>
                <div className="text-white text-2xl font-bold">5-10/day</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Response</div>
                <div className="text-white text-2xl font-bold">&lt;1min</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                Live Trading Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">EUR/USD • Buy Signal</span>
                  <span className="text-emerald-400 font-semibold">+2.4% profit</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">GBP/JPY • Sell Signal</span>
                  <span className="text-emerald-400 font-semibold">+1.8% profit</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Gold • Buy Signal</span>
                  <span className="text-emerald-400 font-semibold">+3.2% profit</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-lg text-center shadow-lg transition-all"
            >
              Access Trading Dashboard →
            </a>

            <p className="text-gray-500 text-center text-sm mt-4">
              Join 50,000+ active traders • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// 5. Mobile-First Modern Card
export function ModernCardPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-purple-900 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Image Header */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">×</button>
            <div className="text-center">
              <div className="text-6xl mb-2">📊</div>
              <div className="text-white font-bold text-xl">Trading Signals</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Premium Access</h3>
                <p className="text-gray-600">Unlock professional trading</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Free</div>
                <div className="text-xs text-gray-500">To start</div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Real-time Trading Signals</div>
                  <div className="text-sm text-gray-600">Get instant notifications for every opportunity</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Expert Market Analysis</div>
                  <div className="text-sm text-gray-600">Professional insights from top traders</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Risk Management Tools</div>
                  <div className="text-sm text-gray-600">Protect your capital with smart strategies</div>
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-xs text-gray-600">Active Traders</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-xs text-gray-600">User Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">89%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg text-center shadow-lg transform transition hover:scale-105 mb-3"
            >
              Get Started Free
            </a>

            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
