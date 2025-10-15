'use client';

import React, { useState } from 'react';
import {
  GlassElite,
  GlassNeon,
  GlassMinimal,
  GlassPremium,
  GlassAurora,
  GlassFrost,
  GlassPrism,
  GlassDark,
  GlassGradient,
  GlassCrystal,
  GlassBlur,
  GlassEdge,
  GlassGlow,
  GlassShimmer,
} from '@/components/popups/GlassVariations';

type PopupType =
  | 'elite'
  | 'neon'
  | 'minimal'
  | 'premium'
  | 'aurora'
  | 'frost'
  | 'prism'
  | 'dark'
  | 'gradient'
  | 'crystal'
  | 'blur'
  | 'edge'
  | 'glow'
  | 'shimmer';

interface PopupCard {
  id: PopupType;
  name: string;
  description: string;
  colors: string;
  gradient: string;
  component: React.ComponentType<{ onClose: () => void }>;
}

const popups: PopupCard[] = [
  {
    id: 'elite',
    name: 'Glass Elite',
    description: 'Professional elite design with Muhammad Ahmad',
    colors: 'Cyan & Blue',
    gradient: 'from-cyan-500 to-blue-600',
    component: GlassElite,
  },
  {
    id: 'neon',
    name: 'Glass Neon',
    description: 'Neon glow effect with Amir Khan',
    colors: 'Cyan Neon',
    gradient: 'from-cyan-400 to-cyan-600',
    component: GlassNeon,
  },
  {
    id: 'minimal',
    name: 'Glass Minimal',
    description: 'Clean minimal light design with Zain Malik',
    colors: 'Light Gray',
    gradient: 'from-gray-100 to-gray-300',
    component: GlassMinimal,
  },
  {
    id: 'premium',
    name: 'Glass Premium',
    description: 'Premium purple gradient with Farhan Ahmed',
    colors: 'Purple & Blue',
    gradient: 'from-purple-600 to-blue-600',
    component: GlassPremium,
  },
  {
    id: 'aurora',
    name: 'Glass Aurora',
    description: 'Pink aurora effect with Rashid Ali',
    colors: 'Pink & Purple',
    gradient: 'from-pink-500 to-purple-600',
    component: GlassAurora,
  },
  {
    id: 'frost',
    name: 'Glass Frost',
    description: 'Frost crystal effect with Imran Hassan',
    colors: 'Blue & Cyan',
    gradient: 'from-blue-500 to-cyan-500',
    component: GlassFrost,
  },
  {
    id: 'prism',
    name: 'Glass Prism',
    description: 'Rainbow spectrum with Adnan Qureshi',
    colors: 'Rainbow',
    gradient: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    component: GlassPrism,
  },
  {
    id: 'dark',
    name: 'Glass Dark',
    description: 'Dark mode pro with Tariq Mahmood',
    colors: 'Dark & Emerald',
    gradient: 'from-gray-900 to-emerald-600',
    component: GlassDark,
  },
  {
    id: 'gradient',
    name: 'Glass Gradient',
    description: 'Momentum gradient with Bilal Sharif',
    colors: 'Purple, Pink & Orange',
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
    component: GlassGradient,
  },
  {
    id: 'crystal',
    name: 'Glass Crystal',
    description: 'Crystal clear light with Kamran Iqbal',
    colors: 'Light Blue',
    gradient: 'from-blue-400 to-cyan-400',
    component: GlassCrystal,
  },
  {
    id: 'blur',
    name: 'Glass Blur',
    description: 'Ultra blur privacy with Naveed Akhtar',
    colors: 'Teal & Cyan',
    gradient: 'from-teal-500 to-cyan-500',
    component: GlassBlur,
  },
  {
    id: 'edge',
    name: 'Glass Edge',
    description: 'Sharp angular edge with Shahzad Khan',
    colors: 'Orange & Red',
    gradient: 'from-orange-600 to-red-600',
    component: GlassEdge,
  },
  {
    id: 'glow',
    name: 'Glass Glow',
    description: 'Green glowing power with Asim Raza',
    colors: 'Green Glow',
    gradient: 'from-green-500 to-emerald-500',
    component: GlassGlow,
  },
  {
    id: 'shimmer',
    name: 'Glass Shimmer',
    description: 'Gold shimmer premium with Junaid Malik',
    colors: 'Gold',
    gradient: 'from-yellow-500 to-amber-500',
    component: GlassShimmer,
  },
];

export default function PopupGalleryPage() {
  const [activePopup, setActivePopup] = useState<PopupType | null>(null);

  const openPopup = (type: PopupType) => {
    setActivePopup(type);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const ActivePopupComponent = activePopup
    ? popups.find(p => p.id === activePopup)?.component
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Glassmorphism Popup Gallery
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            14 Premium Popup Variations
          </p>
          <p className="text-gray-400">
            Click any card to preview the popup design
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-black text-cyan-400">14</div>
            <div className="text-gray-400 text-sm">Total Popups</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-black text-pink-400">10</div>
            <div className="text-gray-400 text-sm">New Designs</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-black text-purple-400">100%</div>
            <div className="text-gray-400 text-sm">Glassmorphism</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="text-3xl font-black text-orange-400">🔥</div>
            <div className="text-gray-400 text-sm">Premium Quality</div>
          </div>
        </div>

        {/* Popup Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popups.map((popup) => (
            <button
              key={popup.id}
              onClick={() => openPopup(popup.id)}
              className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl text-left"
            >
              {/* Gradient Preview */}
              <div className={`w-full h-24 rounded-xl bg-gradient-to-r ${popup.gradient} mb-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold opacity-80">PREVIEW</span>
                </div>
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {popup.name}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {popup.description}
              </p>

              {/* Colors Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${popup.gradient}`}></div>
                <span className="text-xs text-gray-400">{popup.colors}</span>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xl">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">About These Popups</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Features:</h3>
              <ul className="space-y-1 text-sm">
                <li>✓ Full glassmorphism effects</li>
                <li>✓ Pakistani professional traders</li>
                <li>✓ Responsive design</li>
                <li>✓ Exness affiliate integration</li>
                <li>✓ Unique color themes</li>
                <li>✓ Professional photography</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Technologies:</h3>
              <ul className="space-y-1 text-sm">
                <li>• Next.js 15 App Router</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS 4</li>
                <li>• backdrop-blur-3xl</li>
                <li>• Custom animations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Popup */}
      {ActivePopupComponent && <ActivePopupComponent onClose={closePopup} />}
    </div>
  );
}
