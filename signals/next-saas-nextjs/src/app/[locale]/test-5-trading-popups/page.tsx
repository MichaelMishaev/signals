'use client';

import React, { useState } from 'react';
import {
  PremiumGlassPopup,
  MinimalElegantPopup,
  BoldGradientPopup,
  ProfessionalDashboardPopup,
  ModernCardPopup,
} from '@/components/popups/TradingPopups5';

export default function Test5TradingPopupsPage() {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const popups = [
    {
      id: 'glass',
      name: 'Premium Glass Morphism',
      description: 'Modern glassmorphism design with backdrop blur effects',
      color: 'from-blue-500 to-purple-600',
      component: PremiumGlassPopup,
    },
    {
      id: 'minimal',
      name: 'Minimal Elegant',
      description: 'Clean, sophisticated design with subtle typography',
      color: 'from-gray-800 to-gray-900',
      component: MinimalElegantPopup,
    },
    {
      id: 'gradient',
      name: 'Bold Gradient Impact',
      description: 'Eye-catching gradient borders with vibrant colors',
      color: 'from-orange-500 via-pink-500 to-purple-600',
      component: BoldGradientPopup,
    },
    {
      id: 'dashboard',
      name: 'Professional Dashboard',
      description: 'Data-driven dashboard style with live stats',
      color: 'from-emerald-600 to-teal-600',
      component: ProfessionalDashboardPopup,
    },
    {
      id: 'card',
      name: 'Modern Card Design',
      description: 'Mobile-first card layout with feature highlights',
      color: 'from-blue-600 to-purple-600',
      component: ModernCardPopup,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            5 Premium Trading Popups
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click on any card below to preview different popup designs. Each popup is optimized for conversions and leads directly to trading.
          </p>
        </div>

        {/* Popup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {popups.map((popup, index) => (
            <div
              key={popup.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              onClick={() => setActivePopup(popup.id)}
            >
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-br ${popup.color} flex items-center justify-center relative`}>
                <div className="text-white text-center">
                  <div className="text-4xl font-bold mb-2">#{index + 1}</div>
                  <div className="text-sm font-medium opacity-90">Click to Preview</div>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-semibold">
                  NEW
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {popup.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {popup.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Conversion optimized
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mobile responsive
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Trading focused
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 bg-gradient-to-r ${popup.color} text-white rounded-xl font-semibold group-hover:shadow-lg transition-all`}
                >
                  Preview Popup
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About These Popups</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Design Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Modern, conversion-optimized layouts</li>
                <li>• Beautiful gradient and glassmorphism effects</li>
                <li>• Clear call-to-action buttons</li>
                <li>• Trust indicators and social proof</li>
                <li>• Professional color schemes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Fully responsive on all devices</li>
                <li>• Smooth animations and transitions</li>
                <li>• Direct trading account links</li>
                <li>• Easy to close/dismiss</li>
                <li>• SEO-friendly structure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-gray-900 mb-1">5</div>
            <div className="text-sm text-gray-600">Unique Designs</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
            <div className="text-sm text-gray-600">Responsive</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-gray-900 mb-1">89%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>

      {/* Render Active Popup */}
      {activePopup && (() => {
        const popup = popups.find(p => p.id === activePopup);
        if (!popup) return null;
        const PopupComponent = popup.component;
        return <PopupComponent onClose={() => setActivePopup(null)} />;
      })()}
    </div>
  );
}
