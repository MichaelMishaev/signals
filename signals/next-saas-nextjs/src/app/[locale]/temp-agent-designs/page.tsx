'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    { id: 'glass', name: 'Glassmorphism', description: 'Modern frosted glass effect with blur' },
    { id: 'neon', name: 'Neon Glow', description: 'Vibrant neon borders with glow effects' },
    { id: 'minimal', name: 'Minimal Pro', description: 'Clean, professional minimalist design' },
    { id: 'card', name: 'Premium Card', description: 'Elevated card with subtle shadows' },
    { id: 'split', name: 'Split Panel', description: 'Two-column design with visual/content split' },
    { id: 'floating', name: 'Floating Agent', description: '3D floating effect with depth' },
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
      {showPopup && activeVariant === 'glass' && <GlassPopup onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'neon' && <NeonPopup onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'minimal' && <MinimalPopup onClose={() => setShowPopup(false)} />}
      {showPopup && activeVariant === 'card' && <CardPopup onClose={() => setShowPopup(false)} />}
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

              {/* Success Trader Photo */}
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 to-teal-500/40 rounded-full blur-3xl animate-pulse"></div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
                  alt="Successful Trader"
                  className="relative w-72 h-72 rounded-full object-cover border-4 border-emerald-400/50 shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/30 to-transparent rounded-full"></div>
              </div>

              {/* Floating Chart Arrow */}
              <div className="absolute -right-8 top-12 w-56 h-56 animate-float">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 170 L 50 150 L 70 130 L 90 100 L 110 80 L 130 60 L 150 40 L 170 20"
                    stroke="url(#arrowGradient)"
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-lg"
                  />
                  <polygon
                    points="155,5 185,20 170,35"
                    fill="url(#arrowGradient)"
                    className="drop-shadow-lg"
                  />
                </svg>
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

function GlassPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-scaleIn">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm z-10"
          >
            <span className="text-white text-2xl leading-none">×</span>
          </button>

          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=1000&fit=crop"
              alt="Trading Background"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative text-center p-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces"
                alt="Professional Trader"
                className="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl shadow-cyan-500/50"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-3">Start Trading Today</h3>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Join thousands of traders using AI-powered signals. Get 3 free expert signals when you sign up.
            </p>

            <div className="space-y-3">
              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
              >
                Open Free Account →
              </a>
              <button
                onClick={onClose}
                className="block w-full px-8 py-3 text-white/70 hover:text-white transition-colors text-sm"
              >
                Maybe later
              </button>
            </div>

            <p className="text-white/50 text-xs mt-6">Risk warning: Trading involves risk</p>
          </div>
        </div>
      </div>
    </>
  );
}

function NeonPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg animate-scaleIn">
        <div className="bg-gray-950 rounded-3xl border-2 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)] p-8 relative overflow-hidden">
          {/* Neon Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <img
              src="https://images.unsplash.com/photo-1639322537228-f564d14bcf20?w=800&h=1000&fit=crop"
              alt="Neon Chart"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-full flex items-center justify-center transition-all border border-cyan-500/50 z-10"
          >
            <span className="text-cyan-400 text-2xl leading-none">×</span>
          </button>

          <div className="relative text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-60 animate-pulse" />
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.8)]">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=faces"
                  alt="Expert Trader"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
              Unlock Premium Signals
            </h3>
            <p className="text-cyan-400 font-semibold mb-4">AI-Powered Trading Intelligence</p>
            <p className="text-gray-300 text-base mb-8 leading-relaxed">
              Access exclusive real-time trading signals with up to 85% accuracy. Start with 3 free signals today.
            </p>

            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-400 mb-3"
            >
              Activate Premium Access →
            </a>
            <button
              onClick={onClose}
              className="block w-full px-8 py-3 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
            >
              Continue with free version
            </button>

            <p className="text-gray-600 text-xs mt-6">Educational purposes only</p>
          </div>
        </div>
      </div>
    </>
  );
}

function MinimalPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-scaleIn">
        <div className="bg-white rounded-3xl p-10 relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <span className="text-2xl leading-none">×</span>
          </button>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
                alt="Professional Advisor"
                className="w-full h-full rounded-3xl object-cover shadow-xl rotate-3 hover:rotate-6 transition-transform"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Trading Signals</h3>
            <p className="text-gray-600 text-base mb-8 leading-relaxed">
              Get instant access to professional-grade trading signals. Join 10,000+ active traders.
            </p>

            <a
              href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all mb-3"
            >
              Get Started
            </a>
            <button
              onClick={onClose}
              className="block w-full px-8 py-3 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
            >
              Not now
            </button>

            <p className="text-gray-400 text-xs mt-6">No credit card required</p>
          </div>
        </div>
      </div>
    </>
  );
}

function CardPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md animate-scaleIn">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-1 shadow-2xl">
          <div className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-5">
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=800&fit=crop"
                alt="Trading Charts"
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10"
            >
              <span className="text-white text-2xl leading-none">×</span>
            </button>

            <div className="relative text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces"
                  alt="Professional"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-300 text-sm font-semibold">LIVE NOW</span>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">Exclusive Trading Offer</h3>
              <p className="text-gray-300 text-base mb-6 leading-relaxed">
                Open your account today and receive 3 premium trading signals absolutely free.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Free Signals</span>
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-green-400 font-bold text-xl">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Expiry</span>
                  <span className="text-white font-bold">24 Hours</span>
                </div>
              </div>

              <a
                href="https://one.exnessonelink.com/a/c_8f0nxidtbt"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 mb-3"
              >
                Claim My Signals →
              </a>
              <button
                onClick={onClose}
                className="block w-full px-8 py-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                I'll pass on this offer
              </button>
            </div>
          </div>
        </div>
      </div>
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

              <div className="relative z-10 w-32 h-32 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces"
                  alt="Success Trader"
                  className="w-full h-full rounded-3xl object-cover border-4 border-white/30 shadow-2xl rotate-6"
                />
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
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces"
                alt="Elite Trader"
                className="relative w-36 h-36 rounded-3xl object-cover border-4 border-gradient-to-br from-cyan-500 to-purple-600 shadow-2xl transform rotate-6 hover:rotate-12 transition-transform"
              />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
