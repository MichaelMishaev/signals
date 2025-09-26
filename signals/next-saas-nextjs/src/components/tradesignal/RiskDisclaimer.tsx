import RevealAnimation from '../animation/RevealAnimation';

const RiskDisclaimer = () => {
  return (
    <section className="py-12 md:py-16 bg-red-50 dark:bg-red-900/10 border-t-4 border-red-500">
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="bg-white dark:bg-background-6 rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Important Risk Disclaimer
                </h3>

                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Trading Risk Warning:</strong> Trading foreign exchange, commodities, and stocks on margin
                    carries a high level of risk and may not be suitable for all investors. The high degree of leverage
                    can work against you as well as for you.
                  </p>

                  <p>
                    <strong>Not Financial Advice:</strong> The signals and information provided by TradeSignal PK are
                    for educational and informational purposes only. They should not be considered as financial advice,
                    investment recommendations, or solicitations to buy or sell any securities.
                  </p>

                  <p>
                    <strong>Past Performance:</strong> Past performance is not indicative of future results. The
                    historical win rates and performance metrics displayed are based on past data and do not guarantee
                    future trading success.
                  </p>

                  <p>
                    <strong>Your Responsibility:</strong> You should carefully consider your investment objectives,
                    level of experience, and risk appetite before deciding to trade. If necessary, seek advice from an
                    independent financial advisor.
                  </p>

                  <p>
                    <strong>Capital at Risk:</strong> Only trade with money you can afford to lose. Never trade with
                    borrowed money or funds required for essential expenses.
                  </p>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>SECP Compliance:</strong> TradeSignal PK operates in accordance with Securities and
                      Exchange Commission of Pakistan (SECP) guidelines. We are committed to transparency and ethical
                      trading practices. License No: [Pending]
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <a href="/terms-conditions" className="text-blue-600 hover:underline text-xs">
                      Terms & Conditions
                    </a>
                    <a href="/privacy" className="text-blue-600 hover:underline text-xs">
                      Privacy Policy
                    </a>
                    <a href="/gdpr" className="text-blue-600 hover:underline text-xs">
                      Risk Disclosure
                    </a>
                    <a href="/contact-us" className="text-blue-600 hover:underline text-xs">
                      Report Issue
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealAnimation>

        {/* Additional Compliance Badges */}
        <RevealAnimation delay={0.2}>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>SECP Guidelines Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>KYC/AML Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Data Protection Compliant</span>
            </div>
          </div>
        </RevealAnimation>

        {/* Support Contact */}
        <RevealAnimation delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              For support and inquiries:
              <a href="mailto:support@tradesignal.pk" className="ml-1 text-blue-600 hover:underline">
                support@tradesignal.pk
              </a>{' '}
              |{' '}
              <a href="tel:+923001234567" className="text-blue-600 hover:underline">
                +92 300 1234567
              </a>{' '}
              | <span className="text-green-600">WhatsApp: +92 300 1234567</span>
            </p>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default RiskDisclaimer;
