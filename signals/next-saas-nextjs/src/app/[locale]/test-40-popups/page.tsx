'use client';

import React, { useState } from 'react';
import * as AllPopups from '@/components/popups/AllPopups40';

type PopupName = keyof typeof AllPopups;

const popupsList: { name: PopupName; label: string; inspired: string; color: string }[] = [
  { name: 'GlassElite', label: 'Glass Elite', inspired: 'Apple', color: 'cyan' },
  { name: 'GlassNeon', label: 'Glass Neon', inspired: 'Stripe', color: 'cyan' },
  { name: 'AirbnbJourney', label: 'Airbnb Journey', inspired: 'Airbnb', color: 'rose' },
  { name: 'SpotifyPremium', label: 'Spotify Premium', inspired: 'Spotify', color: 'green' },
  { name: 'NetflixUnlimited', label: 'Netflix Unlimited', inspired: 'Netflix', color: 'red' },
  { name: 'TeslaFuture', label: 'Tesla Future', inspired: 'Tesla', color: 'gray' },
  { name: 'GoogleClean', label: 'Google Clean', inspired: 'Google', color: 'blue' },
  { name: 'FacebookSocial', label: 'Facebook Social', inspired: 'Facebook', color: 'blue' },
  { name: 'InstagramVisual', label: 'Instagram Visual', inspired: 'Instagram', color: 'purple' },
  { name: 'TwitterBrief', label: 'Twitter Brief', inspired: 'Twitter', color: 'sky' },
  { name: 'LinkedInPro', label: 'LinkedIn Pro', inspired: 'LinkedIn', color: 'blue' },
  { name: 'DropboxSimple', label: 'Dropbox Simple', inspired: 'Dropbox', color: 'blue' },
  { name: 'SlackTeam', label: 'Slack Team', inspired: 'Slack', color: 'purple' },
  { name: 'DiscordGaming', label: 'Discord Gaming', inspired: 'Discord', color: 'indigo' },
  { name: 'MediumRead', label: 'Medium Read', inspired: 'Medium', color: 'gray' },
  { name: 'PinterestVisual', label: 'Pinterest Visual', inspired: 'Pinterest', color: 'red' },
  { name: 'ShopifyMerchant', label: 'Shopify Merchant', inspired: 'Shopify', color: 'green' },
  { name: 'NotionClean', label: 'Notion Clean', inspired: 'Notion', color: 'gray' },
  { name: 'FigmaDesign', label: 'Figma Design', inspired: 'Figma', color: 'purple' },
  { name: 'GitHubDev', label: 'GitHub Dev', inspired: 'GitHub', color: 'gray' },
  { name: 'DribbbleCreative', label: 'Dribbble Creative', inspired: 'Dribbble', color: 'pink' },
  { name: 'BehanceShowcase', label: 'Behance Showcase', inspired: 'Behance', color: 'blue' },
  { name: 'YouTubeVideo', label: 'YouTube Video', inspired: 'YouTube', color: 'red' },
  { name: 'TikTokViral', label: 'TikTok Viral', inspired: 'TikTok', color: 'cyan' },
  { name: 'UberRide', label: 'Uber Ride', inspired: 'Uber', color: 'gray' },
  { name: 'LyftFriendly', label: 'Lyft Friendly', inspired: 'Lyft', color: 'pink' },
  { name: 'AmazonMarket', label: 'Amazon Market', inspired: 'Amazon', color: 'yellow' },
  { name: 'eBayAuction', label: 'eBay Auction', inspired: 'eBay', color: 'blue' },
  { name: 'EtsyHandmade', label: 'Etsy Handmade', inspired: 'Etsy', color: 'orange' },
  { name: 'PayPalSecure', label: 'PayPal Secure', inspired: 'PayPal', color: 'blue' },
  { name: 'CoinbaseCrypto', label: 'Coinbase Crypto', inspired: 'Coinbase', color: 'blue' },
  { name: 'BinanceGold', label: 'Binance Gold', inspired: 'Binance', color: 'yellow' },
  { name: 'RobinhoodFeather', label: 'Robinhood Feather', inspired: 'Robinhood', color: 'green' },
  { name: 'WebflowNoCode', label: 'Webflow NoCode', inspired: 'Webflow', color: 'purple' },
  { name: 'SquarespaceElegant', label: 'Squarespace Elegant', inspired: 'Squarespace', color: 'gray' },
  { name: 'WixCreative', label: 'Wix Creative', inspired: 'Wix', color: 'blue' },
  { name: 'WordPressBlog', label: 'WordPress Blog', inspired: 'WordPress', color: 'blue' },
  { name: 'MailchimpEmail', label: 'Mailchimp Email', inspired: 'Mailchimp', color: 'yellow' },
  { name: 'HubSpotInbound', label: 'HubSpot Inbound', inspired: 'HubSpot', color: 'orange' },
  { name: 'SalesforceCloud', label: 'Salesforce Cloud', inspired: 'Salesforce', color: 'blue' },
];

export default function Test40PopupsPage() {
  const [activePopup, setActivePopup] = useState<PopupName | null>(null);

  const openPopup = (name: PopupName) => {
    setActivePopup(name);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const ActivePopupComponent = activePopup ? AllPopups[activePopup] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            40 Famous Site-Inspired Popups
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Click any card to test the popup design
          </p>
          <p className="text-gray-400">
            Each popup inspired by a famous website, adapted for trading signals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-black text-cyan-400">40</div>
            <div className="text-gray-400 text-sm">Total Popups</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-black text-green-400">38</div>
            <div className="text-gray-400 text-sm">New Designs</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-black text-purple-400">40</div>
            <div className="text-gray-400 text-sm">Famous Sites</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-black text-pink-400">100%</div>
            <div className="text-gray-400 text-sm">Functional</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center">
            <div className="text-3xl font-black text-orange-400">🔥</div>
            <div className="text-gray-400 text-sm">Premium</div>
          </div>
        </div>

        {/* Popup Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {popupsList.map((popup, index) => (
            <button
              key={popup.name}
              onClick={() => openPopup(popup.name)}
              className="group relative bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:scale-105 hover:shadow-2xl text-left"
            >
              {/* Number Badge */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {index + 1}
              </div>

              {/* Color Indicator */}
              <div className={`w-full h-20 rounded-lg bg-gradient-to-br from-${popup.color}-500 to-${popup.color}-700 mb-3 flex items-center justify-center`}>
                <span className="text-white text-3xl font-black opacity-50">
                  {index + 1}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {popup.label}
              </h3>
              <p className="text-xs text-gray-400">
                Inspired by {popup.inspired}
              </p>

              {/* Hover Arrow */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xl">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">About This Collection</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300 text-sm">
            <div>
              <h3 className="font-semibold text-white mb-2">Inspiration Sources:</h3>
              <p>Apple, Stripe, Airbnb, Spotify, Netflix, Tesla, Google, Facebook, Instagram, Twitter, LinkedIn, Dropbox, Slack, Discord, Medium, Pinterest, Shopify, Notion, Figma, GitHub, Dribbble, Behance, YouTube, TikTok, Uber, Lyft, Amazon, eBay, Etsy, PayPal, Coinbase, Binance, Robinhood, Webflow, Squarespace, Wix, WordPress, Mailchimp, HubSpot, Salesforce</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Features:</h3>
              <ul className="space-y-1">
                <li>✓ 40 unique designs</li>
                <li>✓ Famous site-inspired</li>
                <li>✓ Fully responsive</li>
                <li>✓ Exness affiliate links</li>
                <li>✓ Pakistani trader profiles</li>
                <li>✓ Various color schemes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Technologies:</h3>
              <ul className="space-y-1">
                <li>• Next.js 15</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS 4</li>
                <li>• Glassmorphism</li>
                <li>• Modern animations</li>
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
