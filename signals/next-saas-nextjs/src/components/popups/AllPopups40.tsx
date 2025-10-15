'use client';
import React from 'react';

// Export first 2 from GlassVariations  
export { GlassElite, GlassNeon } from './GlassVariations';

// 3. Airbnb-inspired
export function AirbnbJourney({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-xl">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl">×</button>
          <div className="flex gap-6">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150" alt="Hassan Ali" className="w-32 h-32 rounded-2xl object-cover" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
              <p className="text-gray-600 mb-4">Join Hassan Ali • Expert Trader</p>
              <div className="flex gap-4 mb-6">
                <div><div className="text-2xl font-bold text-rose-600">4.9★</div><div className="text-xs text-gray-500">Rating</div></div>
                <div><div className="text-2xl font-bold text-rose-600">89%</div><div className="text-xs text-gray-500">Win Rate</div></div>
              </div>
              <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer"
                 className="block w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold text-center hover:opacity-90">
                Begin Journey →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 4. Spotify-inspired
export function SpotifyPremium({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-gradient-to-b from-green-600 to-black rounded-2xl p-8 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/60 text-3xl">×</button>
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">🎵</span>
          </div>
          <h2 className="text-3xl font-black mb-2">Premium Trading</h2>
          <p className="text-green-400 font-bold mb-1">Unlimited Signals</p>
          <p className="text-sm text-gray-300 mb-6">3 months free • Omar Siddiqui</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer"
             className="block py-4 bg-green-500 hover:bg-green-400 rounded-full text-black font-bold text-lg mb-3">
            GET STARTED
          </a>
          <button onClick={onClose} className="text-gray-400 text-sm underline">Not now</button>
        </div>
      </div>
    </>
  );
}

// Continue with 5-40... Creating efficient variations


// 5-40: Remaining 36 variations (compact but complete implementations)

// 5. Netflix
export function NetflixUnlimited({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/95 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
        <div className="bg-black/90 rounded-lg border border-gray-800 p-10 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl">×</button>
          <h1 className="text-4xl font-black mb-4">Unlimited signals, better trades.</h1>
          <p className="text-xl mb-6">Trade anywhere. Cancel anytime.</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-4 bg-red-600 hover:bg-red-700 text-center rounded font-bold text-lg">Get Started →</a>
        </div>
      </div>
    </>
  );
}

// 6. Tesla
export function TeslaFuture({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">×</button>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Future of Trading</h2>
          <p className="text-gray-600 mb-6">Fahad Khan • Innovation Leader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold">Order Now</a>
        </div>
      </div>
    </>
  );
}

// 7. Google
export function GoogleClean({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-white/90 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">×</button>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Find Your Edge</h2>
          <p className="text-gray-600 mb-6">Rizwan Ahmed • Search Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 8. Facebook
export function FacebookSocial({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">×</button>
          <div className="flex items-center gap-3 mb-4">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" alt="Kamran" className="w-14 h-14 rounded-full"/>
            <div>
              <h3 className="font-semibold">Kamran Shah</h3>
              <p className="text-sm text-gray-500">Social Trader</p>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3">Connect & Trade</h2>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center">Join Community</a>
        </div>
      </div>
    </>
  );
}

// 9. Instagram
export function InstagramVisual({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-white rounded-2xl p-6">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">×</button>
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5 mx-auto mb-4">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80" alt="Hamza" className="w-16 h-16 rounded-full object-cover"/>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">See. Trade. Profit.</h2>
          <p className="text-gray-600 text-center text-sm mb-6">Hamza Ali • Visual Analyst</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-center">Follow</a>
        </div>
      </div>
    </>
  );
}

// 10. Twitter
export function TwitterBrief({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-500/30 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">×</button>
          <h2 className="text-2xl font-bold mb-3">What is happening in markets</h2>
          <p className="text-gray-600 mb-6">Usman Khan • Brief Analyst</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold text-center">Start Trading</a>
        </div>
      </div>
    </>
  );
}

// 11-40: Continuing with all remaining variations...

// 11. LinkedIn
export function LinkedInPro({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg p-6">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-2">Professional Trading Network</h2>
          <p className="text-gray-600 mb-4">Arslan Malik • Connect with experts</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-700 text-white rounded font-semibold text-center">Connect</a>
        </div>
      </div>
    </>
  );
}

// 12. Dropbox
export function DropboxSimple({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-900/20 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-3">Keep Trades Organized</h2>
          <p className="mb-4">Saad Ahmed • Storage Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded-lg font-semibold text-center">Start Free</a>
        </div>
      </div>
    </>
  );
}

// 13. Slack
export function SlackTeam({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-purple-900/30 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-3xl font-bold mb-4">Team Trading Together</h2>
          <p className="mb-6">Zubair Ali • Team Leader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-purple-600 text-white rounded-lg font-bold text-center">Join Team</a>
        </div>
      </div>
    </>
  );
}

// 14. Discord
export function DiscordGaming({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-indigo-950/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-indigo-900 rounded-xl p-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-3xl font-bold mb-4">Join Trading Server</h2>
          <p className="mb-6">Adnan Sheikh • Community Manager</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-indigo-500 text-white rounded-lg font-bold text-center">Join Server</a>
        </div>
      </div>
    </>
  );
}

// 15. Medium
export function MediumRead({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-white/95 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
        <div className="bg-white rounded-lg border border-gray-200 p-10">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-4xl font-serif font-bold mb-4">Read & Trade Better</h2>
          <p className="text-gray-600 text-lg mb-6">Iqbal Hussain • Content Strategist</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="inline-block py-2 px-6 bg-black text-white rounded-full font-medium">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 16. Pinterest
export function PinterestVisual({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-3xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-3xl font-bold mb-4">Discover Profitable Ideas</h2>
          <p className="text-gray-600 mb-6">Sana Ahmed • Visual Discovery</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-red-600 text-white rounded-full font-bold text-center">Start Trading</a>
        </div>
      </div>
    </>
  );
}

// 17. Shopify
export function ShopifyMerchant({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-green-900/20 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Start Trading Business</h2>
          <p className="mb-6">Tariq Merchant • Store Owner</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-green-600 text-white rounded font-bold text-center">Start Free Trial</a>
        </div>
      </div>
    </>
  );
}

// 18. Notion
export function NotionClean({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-100/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-semibold mb-4">Your Trading Workspace</h2>
          <p className="text-gray-600 mb-6">Jawad Ali • Productivity Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-2 bg-black text-white rounded text-center font-medium">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 19. Figma
export function FigmaDesign({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-purple-100/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Design Your Profits</h2>
          <p className="mb-6">Rehan Designer • Creative Trader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-purple-600 text-white rounded-lg font-bold text-center">Start Designing</a>
        </div>
      </div>
    </>
  );
}

// 20. GitHub
export function GitHubDev({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-900/90 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-white">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Code Your Trading Strategy</h2>
          <p className="text-gray-400 mb-6">Hamid Developer • Algo Trader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-green-600 text-white rounded font-bold text-center">Start Trading</a>
        </div>
      </div>
    </>
  );
}

// Continuing 21-40...

// 21. Dribbble
export function DribbbleCreative({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-pink-50/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-3xl font-bold mb-4 text-pink-600">Creative Trading</h2>
          <p className="mb-6">Ayesha Designer</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-pink-600 text-white rounded-full font-bold text-center">Join Now</a>
        </div>
      </div>
    </>
  );
}

// 22. Behance
export function BehanceShowcase({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-900/30 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Showcase Your Profits</h2>
          <p className="mb-6">Bilal Portfolio Manager</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded font-bold text-center">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 23. YouTube
export function YouTubeVideo({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg">
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <div className="text-6xl mb-4 text-center">▶️</div>
          <h2 className="text-3xl font-bold mb-4 text-center">Watch & Learn Trading</h2>
          <p className="text-center mb-6">Yasir Content Creator</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-red-600 text-white rounded font-bold text-center">Subscribe</a>
        </div>
      </div>
    </>
  );
}

// 24. TikTok
export function TikTokViral({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-gradient-to-br from-cyan-500 to-pink-600 rounded-2xl p-8 text-white text-center">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-3xl font-black mb-4">Go Viral with Profits</h2>
          <p className="mb-6">Faisal Influencer</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-white text-black rounded-full font-bold">Start Trading</a>
        </div>
      </div>
    </>
  );
}

// 25. Uber
export function UberRide({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Ride to Profits</h2>
          <p className="mb-6">Imran Driver</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-black text-white rounded font-bold text-center">Request Ride</a>
        </div>
      </div>
    </>
  );
}

// 26. Lyft
export function LyftFriendly({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-purple-100/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Friendly Trading Experience</h2>
          <p className="mb-6">Ahsan Friendly Trader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-bold text-center">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 27. Amazon
export function AmazonMarket({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-white/90 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg border border-gray-300 p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Trade Everything</h2>
          <p className="mb-6">Rashid Marketplace Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded font-bold text-center">Add to Cart</a>
        </div>
      </div>
    </>
  );
}

// 28. eBay
export function eBayAuction({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-50/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg p-8 border-2 border-blue-600">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Bid on Success</h2>
          <p className="mb-6">Waqas Auction Master</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded font-bold text-center">Place Bid</a>
        </div>
      </div>
    </>
  );
}

// 29. Etsy
export function EtsyHandmade({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-orange-50/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Handcrafted Profits</h2>
          <p className="mb-6">Nadia Artisan</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-orange-600 text-white rounded-full font-bold text-center">Start Selling</a>
        </div>
      </div>
    </>
  );
}

// 30. PayPal
export function PayPalSecure({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-900/30 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Secure Trading Payments</h2>
          <p className="mb-6">Asif Payment Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded font-bold text-center">Link Account</a>
        </div>
      </div>
    </>
  );
}

// 31-40: Final 10 variations

// 31. Coinbase
export function CoinbaseCrypto({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-950/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Trade Crypto & Forex</h2>
          <p className="mb-6">Naveed Crypto Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded-lg font-bold text-center">Start Trading</a>
        </div>
      </div>
    </>
  );
}

// 32. Binance
export function BinanceGold({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-yellow-900/40 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-gray-900 rounded-xl p-8 text-white">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Gold Standard Trading</h2>
          <p className="mb-6">Junaid Exchange Master</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-yellow-500 text-black rounded font-bold text-center">Trade Now</a>
        </div>
      </div>
    </>
  );
}

// 33. Robinhood
export function RobinhoodFeather({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-green-50/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Investing for Everyone</h2>
          <p className="mb-6">Shahid Investor</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-green-500 text-white rounded-full font-bold text-center">Sign Up</a>
        </div>
      </div>
    </>
  );
}

// 34. Webflow
export function WebflowNoCode({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-purple-100/60 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">No-Code Trading Setup</h2>
          <p className="mb-6">Salman Designer</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-purple-600 text-white rounded font-bold text-center">Get Started</a>
        </div>
      </div>
    </>
  );
}

// 35. Squarespace
export function SquarespaceElegant({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-black text-white rounded-lg p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Elegant Trading Portfolio</h2>
          <p className="mb-6">Haris Elegant Trader</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-white text-black rounded font-bold text-center">Build Site</a>
        </div>
      </div>
    </>
  );
}

// 36. Wix
export function WixCreative({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-100/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Create Your Trading Brand</h2>
          <p className="mb-6">Asad Creative</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-600 text-white rounded-lg font-bold text-center">Start Creating</a>
        </div>
      </div>
    </>
  );
}

// 37. WordPress
export function WordPressBlog({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-100/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg p-8 border border-gray-300">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Blog Your Trading Journey</h2>
          <p className="mb-6">Muneeb Blogger</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-700 text-white rounded font-bold text-center">Start Blog</a>
        </div>
      </div>
    </>
  );
}

// 38. Mailchimp
export function MailchimpEmail({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-yellow-50/80 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-2xl p-8">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <div className="text-5xl mb-4 text-center">🐵</div>
          <h2 className="text-2xl font-bold mb-4 text-center">Email Trading Signals</h2>
          <p className="text-center mb-6">Shakeel Email Expert</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold text-center">Subscribe</a>
        </div>
      </div>
    </>
  );
}

// 39. HubSpot
export function HubSpotInbound({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-orange-50/70 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Inbound Trading Success</h2>
          <p className="mb-6">Danish Marketing Pro</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-orange-600 text-white rounded-lg font-bold text-center">Get Started Free</a>
        </div>
      </div>
    </>
  );
}

// 40. Salesforce
export function SalesforceCloud({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-blue-900/40 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4">×</button>
          <h2 className="text-2xl font-bold mb-4">Enterprise Trading CRM</h2>
          <p className="text-gray-600 mb-6">Khalid Enterprise Manager</p>
          <a href="https://one.exnessonelink.com/a/c_8f0nxidtbt" target="_blank" rel="noopener noreferrer" className="block py-3 bg-blue-700 text-white rounded-lg font-bold text-center">Try Free</a>
        </div>
      </div>
    </>
  );
}

