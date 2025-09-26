'use client';

import { useState } from 'react';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 1,
      name: 'Free',
      price: {
        monthly: 0,
        yearly: 0,
      },
      currency: 'PKR',
      description: 'Perfect for beginners',
      features: [
        '3 signals per day',
        '7-day signal history',
        'Basic market updates',
        'Email support',
        'Mobile web access',
        'Risk disclaimers',
      ],
      limitations: ['No push notifications', 'No chat access', 'No premium signals', 'No API access'],
      cta: 'Start Free',
      href: '/signup-01',
      popular: false,
      color: 'gray',
    },
    {
      id: 2,
      name: 'Premium',
      price: {
        monthly: 2999,
        yearly: 29990,
      },
      currency: 'PKR',
      description: 'Most popular for active traders',
      features: [
        'Unlimited daily signals',
        'Full signal history',
        'Real-time push notifications',
        'Premium chat access',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom alerts',
        'Educational content',
        'Signal performance stats',
      ],
      limitations: [],
      cta: 'Start 7-Day Trial',
      href: '/signup-01',
      popular: true,
      color: 'green',
    },
    {
      id: 3,
      name: 'Professional',
      price: {
        monthly: 9999,
        yearly: 99990,
      },
      currency: 'PKR',
      description: 'For professional traders',
      features: [
        'Everything in Premium',
        'VIP signals',
        'Personal account manager',
        'Custom strategies',
        'White-label options',
        'Bulk API access',
        'Team accounts (5 users)',
        'Advanced risk tools',
        'Direct broker integration',
        'Phone support',
      ],
      limitations: [],
      cta: 'Contact Sales',
      href: '/contact-us',
      popular: false,
      color: 'purple',
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-background-2 dark:bg-background-7">
      <div className="main-container">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <RevealAnimation delay={0.1}>
            <span className="badge badge-primary">PRICING</span>
          </RevealAnimation>
          <RevealAnimation delay={0.2}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl">Choose Your Trading Plan</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="max-w-[600px] mx-auto text-secondary/70">
              Start free and upgrade when you&apos;re ready. All plans include our core trading signals.
            </p>
          </RevealAnimation>
        </div>

        {/* Billing Toggle */}
        <RevealAnimation delay={0.4}>
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-background-6 rounded-full p-1 shadow-md">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'monthly' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === 'yearly' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'
                }`}>
                Yearly
                <span className="ml-1 text-xs bg-ns-yellow text-black px-2 py-0.5 rounded-full">Save 17%</span>
              </button>
            </div>
          </div>
        </RevealAnimation>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <RevealAnimation key={plan.id} delay={0.5 + index * 0.1}>
              <div
                className={`relative bg-white dark:bg-background-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow ${
                  plan.popular ? 'ring-2 ring-primary-500' : ''
                }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-sm text-gray-600 dark:text-gray-400 mr-1">{plan.currency}</span>
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {billingCycle === 'monthly'
                          ? plan.price.monthly.toLocaleString()
                          : Math.floor(plan.price.yearly / 12).toLocaleString()}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-1">/month</span>
                    </div>
                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Billed {plan.currency} {plan.price.yearly.toLocaleString()} yearly
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <LinkButton
                    href={plan.href}
                    className={`w-full btn btn-lg ${
                      plan.popular ? 'btn-primary hover:btn-secondary' : 'btn-secondary hover:btn-primary'
                    }`}>
                    {plan.cta}
                  </LinkButton>

                  {/* Features */}
                  <div className="mt-8 space-y-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Includes:</p>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}

                    {plan.limitations.length > 0 && (
                      <>
                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700"></div>
                        {plan.limitations.map((limitation, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <svg
                              className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-sm text-gray-500 dark:text-gray-500 line-through">{limitation}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </RevealAnimation>
          ))}
        </div>

        {/* Payment Methods */}
        <RevealAnimation delay={0.9}>
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Accepted Payment Methods</p>
            <div className="flex flex-wrap justify-center gap-6">
              <span className="bg-white dark:bg-background-6 px-4 py-2 rounded-lg shadow-sm">JazzCash</span>
              <span className="bg-white dark:bg-background-6 px-4 py-2 rounded-lg shadow-sm">Easypaisa</span>
              <span className="bg-white dark:bg-background-6 px-4 py-2 rounded-lg shadow-sm">Bank Transfer</span>
              <span className="bg-white dark:bg-background-6 px-4 py-2 rounded-lg shadow-sm">Visa/Mastercard</span>
              <span className="bg-white dark:bg-background-6 px-4 py-2 rounded-lg shadow-sm">PayPal</span>
            </div>
          </div>
        </RevealAnimation>

        {/* FAQ Link */}
        <RevealAnimation delay={1.0}>
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Have questions? Check our{' '}
              <LinkButton href="/faq" className="text-primary-600 hover:underline">
                FAQ
              </LinkButton>{' '}
              or{' '}
              <LinkButton href="/contact-us" className="text-primary-600 hover:underline">
                contact support
              </LinkButton>
            </p>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Pricing;
