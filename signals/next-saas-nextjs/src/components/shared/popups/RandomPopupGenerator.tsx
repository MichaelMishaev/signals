'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';

// Text content arrays from config - max 15 words each
const POPUP_MESSAGES = [
  'New market analysis available for your educational review today',
  'Your learning progress shows significant improvement in technical analysis understanding',
  'Unlock advanced research tools to enhance your market education journey',
  'Daily educational insight helps you understand risk management principles better',
  'Congratulations on completing five educational modules this week successfully',
  'Market patterns detected that match your current learning curriculum perfectly',
  'Your quiz results demonstrate strong comprehension of fundamental concepts',
  'Three new educational videos added to your personalized learning path',
  'Weekly performance review shows consistent progress in market understanding',
  'Important update available for your current educational course materials',
  'Achievement unlocked for completing ten consecutive days of learning',
  'New study session ready with interactive market analysis exercises',
  'Your dedication to learning has earned you special recognition',
  'Risk management tutorial now available in your education library',
  'Pattern recognition skills improved by twenty percent this month',
  'Educational milestone reached with fifteen hours of focused study time',
  'Market indicators lesson completed with excellent comprehension scores achieved',
  'Your analytical skills have advanced to the next proficiency level',
  'Five star rating earned on latest educational assessment quiz',
  'Personalized learning recommendations based on your recent progress available',
  'Technical analysis certification module now accessible in your dashboard',
  'Weekly digest of market education articles ready for review',
  'Historical data patterns course unlocked for advanced learners only',
  'Your study streak continues for twenty consecutive learning days',
  'Interactive market simulation exercise available for skill practice today',
  'Comprehensive review materials prepared for your upcoming knowledge test',
  'Educational webinar invitation for advanced market analysis techniques ready',
  'Portfolio analysis tutorial customized to your learning preferences available',
  'New beginner friendly content added to foundation course library',
  'Expert level challenges unlocked based on your progress metrics',
  'Monthly learning report shows exceptional dedication to market education'
];

// Simplified content structure
const POPUP_CONTENT = {
  primaryCTAs: [
    'Continue Learning', 'View Analysis', 'Start Session', 'Explore Tools',
    'Learn More', 'Begin Module', 'View Progress', 'Take Quiz',
    'See Report', 'Browse Library', 'Start Journey', 'Access Insights'
  ],
  secondaryCTAs: [
    'Maybe Later', 'Remind Me', 'Skip for Now', 'Browse First',
    'Save for Later', 'Not Now', 'Close', 'Dismiss',
    'Review Later', 'Mark as Read', 'Schedule', 'Bookmark'
  ],
  disclaimers: [
    'Educational purposes only', 'Not investment advice',
    'Past performance doesn\'t guarantee future results', 'Risk disclosure applies',
    'For informational use only', 'Educational content only',
    'No guarantees implied', 'Learning materials only'
  ],
  achievements: [
    'Knowledge Seeker', 'Market Scholar', 'Analysis Expert',
    'Pattern Master', 'Risk Manager', 'Study Champion',
    'Learning Leader', 'Quiz Master', 'Progress Pioneer'
  ],
  statistics: [
    '12 modules completed', '3.5 hours studied', '89% comprehension rate',
    '15 articles reviewed', '5 videos watched', '23 patterns identified',
    '7 concepts mastered', '4 quizzes passed', '45% progress made'
  ]
};

// Icon sets for random selection
const ICONS = ['📚', '📊', '🎯', '🔓', '💡', '📖', '🏆', '🎮', '📈', '🔍', '🎓', '📝', '💰', '🚀', '⚡'];

// Color schemes for random designs
const COLOR_SCHEMES = [
  { primary: 'blue', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  { primary: 'green', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20', text: 'text-green-400' },
  { primary: 'purple', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { primary: 'cyan', gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  { primary: 'amber', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20', text: 'text-amber-400' },
];

// Popup design templates
const POPUP_TEMPLATES = ['centered', 'withIcon', 'gradient', 'minimal', 'detailed'];

interface RandomPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

const getRandomItem = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const RandomPopupGenerator: React.FC<RandomPopupProps> = ({ isOpen, onClose, onAction }) => {
  const [popupContent, setPopupContent] = useState({
    message: '',
    primaryCTA: '',
    secondaryCTA: '',
    disclaimer: '',
    icon: '',
    colorScheme: COLOR_SCHEMES[0],
    template: '',
    achievement: '',
    statistics: [] as string[],
  });

  // Generate random content on mount or when popup opens
  useEffect(() => {
    if (isOpen) {
      generateRandomContent();
    }
  }, [isOpen]);

  const generateRandomContent = () => {
    setPopupContent({
      message: getRandomItem(POPUP_MESSAGES),
      primaryCTA: getRandomItem(POPUP_CONTENT.primaryCTAs),
      secondaryCTA: getRandomItem(POPUP_CONTENT.secondaryCTAs),
      disclaimer: getRandomItem(POPUP_CONTENT.disclaimers),
      icon: getRandomItem(ICONS),
      colorScheme: getRandomItem(COLOR_SCHEMES),
      template: getRandomItem(POPUP_TEMPLATES),
      achievement: getRandomItem(POPUP_CONTENT.achievements),
      statistics: [
        getRandomItem(POPUP_CONTENT.statistics),
        getRandomItem(POPUP_CONTENT.statistics),
        getRandomItem(POPUP_CONTENT.statistics)
      ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicates
    });
  };

  if (!isOpen) return null;

  const renderPopupByTemplate = () => {
    const { message, primaryCTA, secondaryCTA, disclaimer, icon, colorScheme, template, achievement, statistics } = popupContent;

    // Template 1: Centered with Icon
    if (template === 'centered' || template === 'withIcon') {
      return (
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 animate-scaleIn">
          <div className="text-center">
            <div className={cn('w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4', colorScheme.bg)}>
              <span className="text-3xl">{icon}</span>
            </div>
            <div className="mb-6">
              <p className="text-white text-base leading-relaxed">{message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {secondaryCTA}
              </button>
              <button
                onClick={onAction}
                className={cn('flex-1 px-4 py-2 text-white rounded-lg font-bold transition-all', `bg-gradient-to-r ${colorScheme.gradient}`)}
              >
                {primaryCTA}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-3">{disclaimer}</p>
          </div>
        </div>
      );
    }

    // Template 2: Gradient Background
    if (template === 'gradient') {
      return (
        <div className={cn('rounded-xl p-6 max-w-md w-full shadow-2xl animate-scaleIn', `bg-gradient-to-br ${colorScheme.gradient}`)}>
          <div className="bg-gray-900/90 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur">
                <span className="text-2xl">{icon}</span>
              </div>
              <p className={cn('text-sm font-medium', colorScheme.text)}>{achievement}</p>
            </div>
            <p className="text-white text-base mb-4 leading-relaxed">{message}</p>
            <button
              onClick={onAction}
              className="w-full px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg font-bold transition-colors"
            >
              {primaryCTA}
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-300 hover:text-white text-sm mt-2 transition-colors"
            >
              {secondaryCTA}
            </button>
            <p className="text-gray-300 text-xs mt-3 text-center opacity-70">{disclaimer}</p>
          </div>
        </div>
      );
    }

    // Template 3: Minimal
    if (template === 'minimal') {
      return (
        <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700 animate-scaleIn">
          <div className="flex items-start gap-3 mb-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorScheme.bg)}>
              <span className="text-xl">{icon}</span>
            </div>
            <p className={cn('text-sm font-medium', colorScheme.text)}>{achievement}</p>
          </div>
          <p className="text-white text-sm mb-4 leading-relaxed">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              {secondaryCTA}
            </button>
            <button
              onClick={onAction}
              className={cn('flex-1 px-3 py-2 text-white rounded-lg text-sm font-bold transition-all', `bg-gradient-to-r ${colorScheme.gradient}`)}
            >
              {primaryCTA}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-3 text-center">{disclaimer}</p>
        </div>
      );
    }

    // Template 4: Detailed with Stats
    return (
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700 animate-scaleIn">
        <div className="flex items-center justify-between mb-4">
          <span className={cn('text-2xl')}>{icon}</span>
          <span className={cn('text-sm font-medium', colorScheme.text)}>{achievement}</span>
        </div>
        <p className="text-white text-base mb-4 leading-relaxed">{message}</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-gray-900 rounded-lg p-3 text-center">
              <div className={cn('text-xs font-medium', colorScheme.text)}>{stat}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onAction}
          className={cn('w-full px-4 py-2.5 text-white rounded-lg font-bold transition-all mb-2', `bg-gradient-to-r ${colorScheme.gradient}`)}
        >
          {primaryCTA}
        </button>
        <button
          onClick={onClose}
          className="w-full text-gray-400 hover:text-white text-sm transition-colors"
        >
          {secondaryCTA}
        </button>
        <p className="text-gray-500 text-xs mt-3 text-center">{disclaimer}</p>
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {renderPopupByTemplate()}
        </div>
      </div>
    </>
  );
};

// Hook for using random popups
export const useRandomPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showPopup = () => setIsOpen(true);
  const hidePopup = () => setIsOpen(false);

  const handleAction = () => {
    console.log('Primary action clicked');
    // Navigate to external platform or perform action
    window.open('https://platform.example.com/learn', '_blank');
    hidePopup();
  };

  return {
    isOpen,
    showPopup,
    hidePopup,
    PopupComponent: () => (
      <RandomPopupGenerator
        isOpen={isOpen}
        onClose={hidePopup}
        onAction={handleAction}
      />
    ),
  };
};

export default RandomPopupGenerator;