'use client';

import { useState } from 'react';

interface ButtonVariant {
  id: string;
  name: string;
  description: string;
  className: string;
  hoverEffect?: string;
  icon?: string;
}

export default function ButtonTestPage() {
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [copiedToClipboard, setCopiedToClipboard] = useState<string>('');

  const buttonVariants: ButtonVariant[] = [
    {
      id: 'modern-gradient',
      name: 'Modern Gradient',
      description: 'Sleek gradient with subtle animation and glow effect',
      className: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:shadow-primary-500/25 transform hover:-translate-y-0.5 transition-all duration-300 border border-primary-400/20',
      icon: '✨'
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Translucent glass effect with backdrop blur',
      className: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300',
      icon: '🪟'
    },
    {
      id: 'neon-cyberpunk',
      name: 'Neon Cyberpunk',
      description: 'Futuristic neon glow with cyberpunk vibes',
      className: 'bg-black border-2 border-ns-cyan text-ns-cyan px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg shadow-ns-cyan/25 hover:shadow-ns-cyan/50 hover:bg-ns-cyan/10 transition-all duration-300',
      icon: '⚡'
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      description: 'Ultra-clean minimal design with subtle hover',
      className: 'bg-white text-secondary border border-stroke-3 px-8 py-3 rounded-full font-medium hover:border-primary-500 hover:text-primary-600 hover:shadow-md transition-all duration-200',
      icon: '📝'
    },
    {
      id: 'elevated-shadow',
      name: 'Elevated Shadow',
      description: 'Dramatic shadow elevation with depth',
      className: 'bg-primary-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-2xl shadow-primary-500/30 hover:shadow-3xl hover:shadow-primary-500/40 hover:scale-105 transition-all duration-300',
      icon: '🎭'
    },
    {
      id: 'retro-vintage',
      name: 'Retro Vintage',
      description: 'Nostalgic retro style with warm colors',
      className: 'bg-ns-yellow text-secondary border-2 border-secondary/20 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-ns-yellow-light transform hover:rotate-1 transition-all duration-300',
      icon: '📼'
    },
    {
      id: 'outline-hover-fill',
      name: 'Outline to Fill',
      description: 'Outline button that fills on hover',
      className: 'border-2 border-primary-500 text-primary-500 bg-transparent px-6 py-3 rounded-lg font-medium hover:bg-primary-500 hover:text-white hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300',
      icon: '🎨'
    },
    {
      id: 'floating-action',
      name: 'Floating Action',
      description: 'Floating button with pulse animation',
      className: 'bg-ns-green text-secondary px-6 py-3 rounded-full font-bold shadow-xl hover:shadow-2xl animate-pulse hover:animate-none hover:scale-110 transition-all duration-300',
      icon: '🚀'
    },
    {
      id: 'double-border',
      name: 'Double Border',
      description: 'Sophisticated double border design',
      className: 'bg-white text-secondary border-4 border-double border-primary-500 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 hover:border-primary-600 transition-all duration-300',
      icon: '🔲'
    },
    {
      id: 'animated-gradient',
      name: 'Animated Gradient',
      description: 'Dynamic animated gradient background',
      className: 'bg-gradient-to-r from-primary-500 via-ns-cyan to-primary-600 bg-size-200 bg-pos-0 text-white px-6 py-3 rounded-2xl font-bold hover:bg-pos-100 transition-all duration-700 shadow-lg hover:shadow-xl',
      icon: '🌈'
    }
  ];

  const copyToClipboard = (className: string, variantId: string) => {
    navigator.clipboard.writeText(className);
    setCopiedToClipboard(variantId);
    setTimeout(() => setCopiedToClipboard(''), 2000);
  };

  const selectVariant = (variantId: string) => {
    setSelectedVariant(selectedVariant === variantId ? '' : variantId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-1 via-background-2 to-background-3 dark:from-background-8 dark:via-background-7 dark:to-background-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-500/10 to-ns-cyan/10 dark:from-primary-600/20 dark:to-ns-cyan/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-secondary dark:text-accent mb-4">
              🎯 Button Design Laboratory
            </h1>
            <p className="text-xl text-secondary/70 dark:text-accent/70 mb-8 max-w-3xl mx-auto">
              Explore 10 unique button designs crafted to match your website's aesthetic.
              Click any button to see it in action, select your favorite, and copy the code.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-secondary/60 dark:text-accent/60">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-ns-green rounded-full"></span>
                Interactive demos
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-ns-cyan rounded-full"></span>
                Copy-ready code
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-ns-yellow rounded-full"></span>
                Responsive design
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Button Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {buttonVariants.map((variant, index) => (
            <div
              key={variant.id}
              className={`group relative bg-white dark:bg-background-7 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-stroke-3 dark:border-stroke-7 ${
                selectedVariant === variant.id ? 'ring-4 ring-primary-500/30 bg-primary-50/50 dark:bg-primary-900/20' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{variant.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-secondary dark:text-accent">
                      {variant.name}
                    </h3>
                    <p className="text-sm text-secondary/60 dark:text-accent/60 mt-1">
                      Design #{index + 1}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectVariant(variant.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedVariant === variant.id
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-stroke-3 dark:border-stroke-7 hover:border-primary-500'
                    }`}
                    title={selectedVariant === variant.id ? 'Selected' : 'Select this design'}
                  >
                    {selectedVariant === variant.id ? '✓' : ''}
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-secondary/70 dark:text-accent/70 mb-8">
                {variant.description}
              </p>

              {/* Button Demo */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative">
                  <button className={variant.className}>
                    <span>Try Me Out</span>
                  </button>
                  {selectedVariant === variant.id && (
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                      ★
                    </div>
                  )}
                </div>

                {/* Size variations */}
                <div className="flex gap-3 items-center">
                  <button className={`${variant.className} text-sm px-4 py-2`}>Small</button>
                  <button className={variant.className}>Medium</button>
                  <button className={`${variant.className} text-lg px-8 py-4`}>Large</button>
                </div>
              </div>

              {/* Code section */}
              <div className="bg-background-2 dark:bg-background-8 rounded-xl p-4 border border-stroke-3 dark:border-stroke-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-secondary dark:text-accent">Tailwind Classes</span>
                  <button
                    onClick={() => copyToClipboard(variant.className, variant.id)}
                    className="text-xs bg-primary-500 text-white px-3 py-1 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    {copiedToClipboard === variant.id ? 'Copied! ✓' : 'Copy'}
                  </button>
                </div>
                <code className="text-xs text-secondary/70 dark:text-accent/70 break-all block leading-relaxed">
                  className="{variant.className}"
                </code>
              </div>

              {/* Usage example */}
              <div className="mt-4 p-4 bg-background-3 dark:bg-background-9 rounded-xl border border-stroke-3 dark:border-stroke-7">
                <div className="text-sm font-medium text-secondary dark:text-accent mb-2">React Example:</div>
                <code className="text-xs text-secondary/70 dark:text-accent/70 block leading-relaxed">
                  {`<button className="${variant.className}">
  Click Me
</button>`}
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedVariant && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary-500/10 to-ns-green/10 dark:from-primary-600/20 dark:to-ns-green/20 rounded-3xl p-8 border border-primary-500/20">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-secondary dark:text-accent mb-4">
                  🎉 Great Choice!
                </h2>
                <p className="text-secondary/70 dark:text-accent/70 mb-6">
                  You've selected the <strong>{buttonVariants.find(v => v.id === selectedVariant)?.name}</strong> design.
                  This button style will work perfectly with your website's design system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => copyToClipboard(buttonVariants.find(v => v.id === selectedVariant)?.className || '', selectedVariant)}
                    className="btn btn-primary btn-md"
                  >
                    <span>Copy Complete Code</span>
                  </button>
                  <button
                    onClick={() => setSelectedVariant('')}
                    className="btn btn-white btn-md dark:btn-white-dark"
                  >
                    <span>Try Another Design</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Implementation Guide */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-background-7 rounded-3xl p-8 shadow-lg border border-stroke-3 dark:border-stroke-7">
            <h2 className="text-2xl font-bold text-secondary dark:text-accent mb-6 text-center">
              📚 Implementation Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold text-secondary dark:text-accent mb-2">Choose Design</h3>
                <p className="text-sm text-secondary/60 dark:text-accent/60">Select your favorite button design from the options above</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ns-cyan text-secondary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold text-secondary dark:text-accent mb-2">Copy Code</h3>
                <p className="text-sm text-secondary/60 dark:text-accent/60">Copy the Tailwind classes or React component code</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ns-green text-secondary rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold text-secondary dark:text-accent mb-2">Implement</h3>
                <p className="text-sm text-secondary/60 dark:text-accent/60">Paste into your project and customize as needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 200%;
        }
        .bg-pos-0 {
          background-position: 0% 50%;
        }
        .bg-pos-100 {
          background-position: 100% 50%;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}