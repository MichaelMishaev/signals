'use client';

import { useState } from 'react';
import TimelineSidebarLayout from './TimelineSidebarLayout';
import NewsPageClient from '../news/NewsPageClient';
import { INewsArticle } from '@/interface';

interface ContentTabsSwitcherProps {
  newsArticles: INewsArticle[];
}

const ContentTabsSwitcher = ({ newsArticles }: ContentTabsSwitcherProps) => {
  const [activeTab, setActiveTab] = useState<'signals' | 'news'>('signals');

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="bg-background-2 dark:bg-background-6 sticky top-0 z-40 border-b border-stroke-2 dark:border-stroke-6">
        <div className="main-container">
          <div className="flex items-center justify-center gap-2 py-4">
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-200 ${
                activeTab === 'signals'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                  : 'bg-white dark:bg-background-7 text-secondary dark:text-accent hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-stroke-2 dark:border-stroke-6'
              }`}
            >
              📊 Live Signals
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-200 ${
                activeTab === 'news'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                  : 'bg-white dark:bg-background-7 text-secondary dark:text-accent hover:bg-primary-50 dark:hover:bg-primary-900/20 border-2 border-stroke-2 dark:border-stroke-6'
              }`}
            >
              📰 News & Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-screen">
        {activeTab === 'signals' ? (
          <TimelineSidebarLayout />
        ) : (
          <div className="bg-background-2 dark:bg-background-6">
            <NewsPageClient newsArticles={newsArticles} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentTabsSwitcher;
