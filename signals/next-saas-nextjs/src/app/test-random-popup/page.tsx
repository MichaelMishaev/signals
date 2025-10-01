'use client';

import { useRandomPopup } from '@/components/shared/popups';
import { useState } from 'react';

export default function TestRandomPopupPage() {
  const { showPopup, PopupComponent } = useRandomPopup();
  const [popupCount, setPopupCount] = useState(0);

  const handleShowPopup = () => {
    showPopup();
    setPopupCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Random Popup Generator Test</h1>
        <p className="text-gray-400 mb-8">
          Each click generates a popup with random text content and random design
        </p>

        <div className="grid gap-4">
          {/* Info Card */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-3">How It Works</h2>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Random text selection from config/textOfPopUp.md</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Random design template (centered, gradient, minimal, detailed)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Random color scheme (blue, green, purple, cyan, amber)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Random icons and achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>All content is compliant with regulations</span>
              </li>
            </ul>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-2">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-400">{popupCount}</div>
                <div className="text-sm text-gray-500">Popups Shown</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">20</div>
                <div className="text-sm text-gray-500">Title Variations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">5</div>
                <div className="text-sm text-gray-500">Design Templates</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleShowPopup}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
            >
              Generate Random Popup
            </button>
            <button
              onClick={() => {
                for (let i = 0; i < 3; i++) {
                  setTimeout(() => {
                    handleShowPopup();
                  }, i * 1500);
                }
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Show 3 Popups
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-bold mb-2">Text Content</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 20 different titles</li>
                <li>• 20 different subtitles</li>
                <li>• 10 body text variations</li>
                <li>• 12 CTA button texts</li>
                <li>• 10 disclaimer options</li>
              </ul>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
              <h4 className="text-white font-bold mb-2">Visual Design</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• 5 color schemes</li>
                <li>• 4 layout templates</li>
                <li>• 15 icon options</li>
                <li>• Responsive design</li>
                <li>• Smooth animations</li>
              </ul>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              ✓ All popups follow regulatory compliance standards with educational language and proper disclaimers
            </p>
          </div>
        </div>
      </div>

      {/* Render the popup component */}
      <PopupComponent />
    </div>
  );
}