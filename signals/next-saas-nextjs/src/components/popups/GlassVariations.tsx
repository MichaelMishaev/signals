'use client';

import React from 'react';

// Glassmorphism Variation 1: Elite Professional (Inspired by Apple)
export function GlassElite({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-scaleIn">
        {/* Glassmorphism Container */}
        <div className="relative bg-white/10 backdrop-blur-3xl rounded-[32px] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden">
          {/* Background Chart - Blurred */}
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1000&fit=crop"
              alt="Trading Background"
              className="w-full h-full object-cover blur-sm"
            />
          </div>

          {/* Content */}
          <div className="relative p-8 md:p-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all border border-white/10 z-10"
            >
              <span className="text-white text-2xl leading-none">×</span>
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Pakistani Professional Photo */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-3xl blur-2xl"></div>
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces"
                    alt="Trading Expert"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                {/* Success Badge */}
                <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <div className="text-center">
                    <div className="text-emerald-400 text-lg font-black">85%</div>
                    <div className="text-white text-[8px]">WIN</div>
                  </div>
                </div>
              </div>

              {/* Glass Card Info */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 mb-4 border border-white/20">
                <p className="text-cyan-300 text-sm font-semibold">Muhammad Ahmad</p>
                <p className="text-white/80 text-xs">Senior Trading Analyst</p>
              </div>

              <h3 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
                Start Trading Today
              </h3>
              <p className="text-white/90 text-lg mb-8 leading-relaxed max-w-md">
                Join thousands of traders using AI-powered signals. Get 3 free expert signals when you sign up.
              </p>

              {/* Stats Grid - Glass Style */}
              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="text-emerald-400 text-2xl font-black">3</div>
                  <div className="text-white/70 text-xs">Free Signals</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="text-cyan-400 text-2xl font-black">85%</div>
                  <div className="text-white/70 text-xs">Win Rate</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                  <div className="text-blue-400 text-2xl font-black">24/7</div>
                  <div className="text-white/70 text-xs">Support</div>
                </div>
              </div>

              <div className="space-y-3 w-full">
                <a
                  href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                >
                  Open Free Account →
                </a>
                <button
                  onClick={onClose}
                  className="block w-full px-8 py-3 text-white/70 hover:text-white transition-colors text-sm bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
                >
                  Maybe later
                </button>
              </div>

              <p className="text-white/50 text-xs mt-6">Risk warning: Trading involves risk</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Glassmorphism Variation 2: Neon Glass (Inspired by Stripe)
export function GlassNeon({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-scaleIn">
        <div className="relative bg-slate-900/40 backdrop-blur-3xl rounded-[32px] border-2 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>

          <div className="relative p-8 md:p-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all border border-cyan-500/50 z-10"
            >
              <span className="text-cyan-400 text-2xl leading-none">×</span>
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Pakistani Trader with Neon Glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                    alt="Trading Professional"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent"></div>
                </div>
                {/* Live Indicator */}
                <div className="absolute -top-2 -right-2 px-4 py-2 bg-cyan-500/90 backdrop-blur-md rounded-full border border-cyan-300 shadow-lg animate-pulse">
                  <span className="text-white text-xs font-bold">LIVE</span>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl px-6 py-3 mb-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <p className="text-cyan-300 text-sm font-semibold">Amir Khan</p>
                <p className="text-white/80 text-xs">Expert Forex Trader</p>
              </div>

              <h3 className="text-4xl font-black text-white mb-2" style={{ textShadow: '0 0 30px rgba(6,182,212,0.6)' }}>
                Unlock Premium Signals
              </h3>
              <p className="text-cyan-400 font-semibold mb-3 text-lg">AI-Powered Trading Intelligence</p>
              <p className="text-white/90 text-base mb-8 leading-relaxed">
                Access exclusive real-time trading signals with up to 85% accuracy. Start with 3 free signals today.
              </p>

              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-cyan-500/90 hover:bg-cyan-600 backdrop-blur-md text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.5)] border-2 border-cyan-400 mb-3"
              >
                Activate Premium Access →
              </a>
              <button
                onClick={onClose}
                className="block w-full px-8 py-3 text-gray-300 hover:text-cyan-400 transition-colors text-sm bg-white/5 backdrop-blur-sm rounded-2xl border border-cyan-500/20"
              >
                Continue with free version
              </button>

              <p className="text-gray-500 text-xs mt-6">Educational purposes only</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
