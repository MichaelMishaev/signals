'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GlassElite, GlassNeon, GlassMinimal, GlassPremium } from '@/components/popups/GlassVariations';

type DesignVariant = 'glass' | 'neon' | 'minimal' | 'card' | 'split' | 'floating' | 'broker';

// Initialize Google GenAI
const genAI = new GoogleGenerativeAI('AIzaSyBBWfCSzMIpx5-uB9QGtP33xb5PihFxnyM');

export default function AgentDesignsDemo() {
  const [activeVariant, setActiveVariant] = useState<DesignVariant>('broker');
  const [showPopup, setShowPopup] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiHeadline, setAiHeadline] = useState<string>('');
  const [isGeneratingHeadline, setIsGeneratingHeadline] = useState(false);

  const designs: { id: DesignVariant; name: string; description: string }[] = [
    { id: 'broker', name: 'Broker Pro', description: 'Professional broker style with hero visual' },
    { id: 'glass', name: 'Glass Elite', description: 'Glassmorphism with Pakistani professional' },
    { id: 'neon', name: 'Glass Neon', description: 'Neon glass with South Asian trader' },
    { id: 'minimal', name: 'Glass Minimal', description: 'Minimal glass with Pakistani expert' },
    { id: 'card', name: 'Glass Premium', description: 'Premium glass card with professional' },
    { id: 'split', name: 'Glass Split', description: 'Split glass panel with Pakistani trader' },
    { id: 'floating', name: 'Glass Float', description: 'Floating glass with South Asian pro' },
  ];

  const analyzeDesign = async (variant: DesignVariant) => {
    setIsAnalyzing(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const designDetails = designs.find(d => d.id === variant);
      const prompt = `Analyze this popup design for a trading signals platform:

Design: ${designDetails?.name}
Description: ${designDetails?.description}
Purpose: Converting visitors to sign up for trading accounts via affiliate link
Industry: FinTech/Trading
Target: Traders seeking AI-powered signals

Provide a brief analysis (3-4 sentences) covering:
1. Visual appeal and modern design trends
2. Conversion potential for trading audience
3. One specific improvement suggestion

Keep it concise and actionable.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiAnalysis(response.text());
    } catch (error) {
      setAiAnalysis('AI analysis temporarily unavailable. Please try again.');
      console.error('AI analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHeadline = async () => {
    setIsGeneratingHeadline(true);
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Generate a powerful, conversion-focused headline for a trading broker popup.

Context:
- Target: Active traders looking for signals
- Platform: AI-powered trading signals
- Offer: 3 free premium signals
- Goal: Immediate account sign-up

Requirements:
- Maximum 6-8 words
- Action-oriented and urgent
- Professional but exciting
- Include benefit or result

Generate 1 headline only, no quotes or explanation.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiHeadline(response.text().replace(/['"]/g, '').trim());
    } catch (error) {
      setAiHeadline('Generate Your Winning Trade Today');
      console.error('Headline generation error:', error);
    } finally {
      setIsGeneratingHeadline(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Agent Popup Design Gallery
              </h1>
              <p className="text-gray-400 mt-1">AI-Powered designs with professional broker styling</p>
            </div>
            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Open Exness →
            </a>
          </div>
        </div>
      </header>

      {/* Design Selector */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setActiveVariant(design.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all',
                activeVariant === design.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              )}
            >
              <h3 className="font-bold text-white mb-1 text-sm">{design.name}</h3>
              <p className="text-xs text-gray-400">{design.description}</p>
            </button>
          ))}
        </div>

        {/* AI Content Generator */}
        <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 rounded-xl p-6 border border-orange-500/30 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">✨</span>
                AI Headline Generator
              </h3>
              <p className="text-gray-400 text-sm">Generate conversion-optimized headlines with Gemini</p>
            </div>
            <button
              onClick={generateHeadline}
              disabled={isGeneratingHeadline}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingHeadline ? 'Generating...' : 'Generate New'}
            </button>
          </div>
          {aiHeadline && (
            <div className="bg-black/30 rounded-lg p-4 border border-orange-500/30">
              <p className="text-2xl font-bold text-white text-center">{aiHeadline}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => setShowPopup(true)}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
          >
            Preview {designs.find((d) => d.id === activeVariant)?.name} Design
          </button>
          <button
            onClick={() => analyzeDesign(activeVariant)}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              'AI Design Analysis'
            )}
          </button>
        </div>

        {/* AI Analysis Results */}
        {aiAnalysis && (
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  AI Design Insights
                  <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">Powered by Gemini 2.0</span>
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Design Info */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Design Details</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Style</p>
              <p className="font-semibold">{designs.find((d) => d.id === activeVariant)?.name}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Best For</p>
              <p className="font-semibold">Trading & Financial Apps</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">AI Enhanced</p>
              <p className="font-semibold text-green-400">Yes - Gemini 2.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Previews */}
      {showPopup && activeVariant === 'broker' && <BrokerPopup onClose={() => setShowPopup(false)} headline={aiHeadline} />}
      {showPopup && activeVariant === 'glass' && <GlassElite onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'neon' && <GlassNeon onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'minimal' && <GlassMinimal onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'card' && <GlassPremium onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'split' && <SplitPopup onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'floating' && <FloatingPopup onClose={() => setShowPopup(false)} />}
    </div>
  );
}

// NEW: Broker Pro Design - Professional broker style
function BrokerPopup({ onClose, headline }: { onClose: () => void; headline?: string }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl animate-scaleIn">
        <div className="bg-gradient-to-br from-slate-900 via-blue-900/90 to-teal-900/80 rounded-3xl overflow-hidden shadow-2xl border border-teal-500/30 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-sm"
          >
            <span className="text-white text-2xl leading-none">×</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-10">
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center">
              <div className="inline-block px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30 mb-6 w-fit">
                <span className="text-emerald-300 text-sm font-semibold">RECOMMENDED PARTNER</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {headline || 'Trade with Our Trusted Broker'}
              </h2>

              <p className="text-xl text-gray-300 mb-8">
                Join 50,000+ successful traders using AI-powered signals. Start with 3 free premium signals today.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">85% Win Rate on Signals</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">Real-Time Market Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white font-medium">24/7 Expert Support</span>
                </div>
              </div>

              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold text-xl text-center transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/50"
              >
                Open Free Account →
              </a>

              <p className="text-gray-500 text-xs mt-4 text-center">Risk warning: Trading involves risk of capital loss</p>
            </div>

            {/* Right Side - Visual with Real Photo */}
            <div className="relative flex items-center justify-center overflow-hidden">
              {/* Background gradient particles */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-teal-600/20 to-emerald-600/20">
                <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-150"></div>
                <div className="absolute bottom-10 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
              </div>

              {/* Ultra Realistic Trading Chart */}
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 rounded-3xl blur-3xl animate-pulse"></div>

                {/* Real Candlestick Chart */}
                <div className="relative w-80 h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border-4 border-emerald-400/50 shadow-2xl overflow-hidden">
                  {/* Chart Background Grid */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                  </div>

                  {/* Realistic Candlestick Chart */}
                  <svg viewBox="0 0 300 300" className="w-full h-full">
                    <defs>
                      <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                      </linearGradient>
                      <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>

                    {/* Candlesticks - Ultra Realistic */}
                    {/* Bullish Candle */}
                    <line x1="30" y1="200" x2="30" y2="140" stroke="#10b981" strokeWidth="2"/>
                    <rect x="20" y="160" width="20" height="40" fill="url(#greenGrad)" stroke="#10b981" strokeWidth="1"/>

                    {/* Bearish Candle */}
                    <line x1="70" y1="130" x2="70" y2="190" stroke="#ef4444" strokeWidth="2"/>
                    <rect x="60" y="130" width="20" height="40" fill="url(#redGrad)" stroke="#ef4444" strokeWidth="1"/>

                    {/* Bullish Candle */}
                    <line x1="110" y1="170" x2="110" y2="110" stroke="#10b981" strokeWidth="2"/>
                    <rect x="100" y="130" width="20" height="40" fill="url(#greenGrad)" stroke="#10b981" strokeWidth="1"/>

                    {/* Bullish Candle */}
                    <line x1="150" y1="150" x2="150" y2="80" stroke="#10b981" strokeWidth="2"/>
                    <rect x="140" y="100" width="20" height="50" fill="url(#greenGrad)" stroke="#10b981" strokeWidth="1"/>

                    {/* Small Bearish */}
                    <line x1="190" y1="90" x2="190" y2="120" stroke="#ef4444" strokeWidth="2"/>
                    <rect x="180" y="90" width="20" height="20" fill="url(#redGrad)" stroke="#ef4444" strokeWidth="1"/>

                    {/* Bullish Candle */}
                    <line x1="230" y1="110" x2="230" y2="40" stroke="#10b981" strokeWidth="2"/>
                    <rect x="220" y="60" width="20" height="50" fill="url(#greenGrad)" stroke="#10b981" strokeWidth="1"/>

                    {/* Trend Line */}
                    <path d="M 20 200 L 60 160 L 100 140 L 140 100 L 180 90 L 220 60 L 260 30"
                          stroke="#14b8a6"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="5,5"
                          opacity="0.6"/>

                    {/* Moving Average */}
                    <path d="M 20 180 Q 100 120 230 50"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.7"/>
                  </svg>

                  {/* Chart Labels */}
                  <div className="absolute bottom-2 left-2 text-emerald-400 text-xs font-mono">
                    EUR/USD • 1H
                  </div>
                  <div className="absolute top-2 right-2 text-emerald-400 text-xs font-bold">
                    +12.5%
                  </div>
                </div>
              </div>

              {/* Floating Trend Arrow - Ultra Realistic */}
              <div className="absolute -right-12 top-8 w-64 h-64 animate-float">
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl backdrop-blur-sm border border-emerald-400/30 p-4">
                  <div className="text-emerald-300 text-xs font-semibold mb-2">TREND ANALYSIS</div>
                  <svg viewBox="0 0 200 150" className="w-full h-full">
                    <defs>
                      <linearGradient id="trendGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 0.8 }} />
                      </linearGradient>
                    </defs>
                    {/* Area Chart */}
                    <path d="M 10 140 L 30 120 L 50 110 L 70 90 L 90 75 L 110 60 L 130 50 L 150 35 L 170 20 L 190 10 L 190 140 Z"
                          fill="url(#trendGrad)"/>
                    {/* Line */}
                    <path d="M 10 140 L 30 120 L 50 110 L 70 90 L 90 75 L 110 60 L 130 50 L 150 35 L 170 20 L 190 10"
                          stroke="#10b981"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                    {/* Arrow head */}
                    <polygon points="185,5 195,10 190,15" fill="#10b981"/>
                  </svg>
                  <div className="text-white text-xl font-black mt-1">STRONG BUY</div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -left-6 bottom-16 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/40 shadow-2xl animate-float-delayed">
                <div className="text-emerald-300 text-sm font-semibold uppercase tracking-wide">Win Rate</div>
                <div className="text-white text-4xl font-black mt-1">85%</div>
                <div className="text-emerald-200 text-xs mt-1">AI Powered</div>
              </div>

              {/* PipGuru watermark style */}
              <div className="absolute bottom-4 right-4 text-emerald-500/40 font-black text-2xl tracking-wider">
                PipGuru
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
      `}</style>
    </>
  );
}

function SplitPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl animate-scaleIn">
        <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-sm"
          >
            <span className="text-white text-2xl leading-none">×</span>
          </button>

          <div className="grid md:grid-cols-2">
            <div className="relative bg-gradient-to-br from-cyan-600 to-blue-700 p-10 flex flex-col justify-center items-center text-center overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <img
                  src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=800&fit=crop"
                  alt="Chart Background"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-10 w-40 h-40 mb-6">
                {/* Volume Profile Chart */}
                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-4 border-white/30 shadow-2xl rotate-6 overflow-hidden p-4">
                  <div className="text-cyan-300 text-[8px] font-bold mb-1">VOLUME</div>
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    {/* Horizontal Volume Bars */}
                    <rect x="0" y="10" width="60" height="8" fill="#10b981" opacity="0.6"/>
                    <rect x="0" y="22" width="80" height="8" fill="#10b981" opacity="0.7"/>
                    <rect x="0" y="34" width="100" height="8" fill="#10b981" opacity="0.9"/>
                    <rect x="0" y="46" width="110" height="8" fill="#10b981"/>
                    <rect x="0" y="58" width="90" height="8" fill="#10b981" opacity="0.8"/>
                    <rect x="0" y="70" width="70" height="8" fill="#059669" opacity="0.7"/>
                    <rect x="0" y="82" width="50" height="8" fill="#059669" opacity="0.6"/>
                    <rect x="0" y="94" width="40" height="8" fill="#059669" opacity="0.5"/>
                    {/* Current Price Line */}
                    <line x1="0" y1="50" x2="120" y2="50" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,4"/>
                  </svg>
                </div>
              </div>
              <h4 className="relative z-10 text-white text-2xl font-bold mb-2">Trade Smarter</h4>
              <p className="relative z-10 text-cyan-100 text-sm">AI-powered signals with 85% accuracy</p>

              <div className="mt-8 space-y-3 w-full">
                <div className="flex items-center gap-3 text-white text-sm">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                  <span>Real-time signal alerts</span>
                </div>
                <div className="flex items-center gap-3 text-white text-sm">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                  <span>Expert market analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white text-sm">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                  <span>24/7 trading support</span>
                </div>
              </div>
            </div>

            <div className="p-10 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-white mb-3">Get 3 Free Signals</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Start your trading journey with professional-grade signals. No credit card required.
              </p>

              <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🎁</div>
                  <div>
                    <p className="text-white font-semibold">Special Launch Offer</p>
                    <p className="text-gray-400 text-sm">Limited to first 100 users today</p>
                  </div>
                </div>
              </div>

              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-center transition-all transform hover:scale-105 mb-3"
              >
                Claim Free Signals →
              </a>
              <button
                onClick={onClose}
                className="block w-full px-8 py-3 text-gray-400 hover:text-white transition-colors text-sm text-center"
              >
                Not interested
              </button>

              <p className="text-gray-600 text-xs mt-4 text-center">Trading involves risk of loss</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FloatingPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-scaleIn perspective-1000">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-all border border-red-500/50 z-10"
          >
            <span className="text-red-400 text-2xl leading-none">×</span>
          </button>

          <div className="text-center">
            {/* Advanced Trading Dashboard */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-4 border-gradient-to-br from-cyan-500 to-purple-600 shadow-2xl transform rotate-6 hover:rotate-12 transition-transform p-4 overflow-hidden">
                {/* Mini Dashboard */}
                <div className="text-cyan-400 text-[10px] font-bold mb-2">TRADING SIGNALS</div>

                {/* Signal Cards Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-emerald-500/20 rounded-lg p-2 border border-emerald-500/30">
                    <div className="text-emerald-400 text-[8px]">BUY</div>
                    <div className="text-white text-[10px] font-bold">EUR/USD</div>
                  </div>
                  <div className="bg-emerald-500/20 rounded-lg p-2 border border-emerald-500/30">
                    <div className="text-emerald-400 text-[8px]">BUY</div>
                    <div className="text-white text-[10px] font-bold">GOLD</div>
                  </div>
                </div>

                {/* Mini Chart */}
                <svg viewBox="0 0 120 50" className="w-full h-16">
                  <defs>
                    <linearGradient id="miniGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d="M 0 45 L 20 40 L 40 35 L 60 25 L 80 20 L 100 15 L 120 10 L 120 50 L 0 50 Z" fill="url(#miniGrad)"/>
                  <path d="M 0 45 L 20 40 L 40 35 L 60 25 L 80 20 L 100 15 L 120 10" stroke="#06b6d4" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/20">
                <div className="text-center">
                  <div className="text-white text-lg font-black">3</div>
                  <div className="text-white text-[8px]">SIGNALS</div>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-sm font-semibold">87 TRADERS ONLINE</span>
            </div>

            <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Start Trading Like a Pro
            </h3>
            <p className="text-gray-300 text-base mb-8 leading-relaxed">
              Join our community of successful traders. Get 3 premium AI signals to kickstart your journey.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <p className="text-2xl font-bold text-cyan-400">3</p>
                <p className="text-xs text-gray-400">Free Signals</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <p className="text-2xl font-bold text-green-400">85%</p>
                <p className="text-xs text-gray-400">Win Rate</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <p className="text-2xl font-bold text-purple-400">24/7</p>
                <p className="text-xs text-gray-400">Support</p>
              </div>
            </div>

            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 mb-3"
            >
              Activate Free Account →
            </a>
            <button
              onClick={onClose}
              className="block w-full px-8 py-3 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Maybe later
            </button>

            <p className="text-gray-600 text-xs mt-6">Risk disclosure: CFDs are complex instruments</p>
          </div>
        </div>
      </div>
    </>
  );
}
