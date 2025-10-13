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
                    <strong>HIGH RISK WARNING:</strong> Trading foreign exchange, commodities, options, futures, and
                    stocks on margin carries an extremely high level of risk and may not be suitable for all investors.
                    The high degree of leverage available can work against you as well as for you. Before deciding to
                    trade, you should carefully consider your investment objectives, level of experience, and risk
                    tolerance. There is a substantial risk of loss associated with trading. You could sustain a total
                    loss of your initial investment and be required to deposit additional funds to maintain your
                    position. Only invest funds that you can afford to lose completely.
                  </p>

                  <p>
                    <strong>LOSS OF CAPITAL WARNING:</strong> The majority of retail investor accounts lose money when
                    trading leveraged products. You should consider whether you understand how leveraged products work
                    and whether you can afford to take the high risk of losing your money. Statistics show that a
                    significant percentage of traders experience losses. Do not invest money you cannot afford to lose.
                  </p>

                  <p>
                    <strong>NOT FINANCIAL OR INVESTMENT ADVICE:</strong> The signals, analysis, and information provided
                    by TradeSignal PK are for educational, informational, and entertainment purposes only. They do not
                    constitute financial advice, investment recommendations, trading advice, or solicitations to buy or
                    sell any securities or financial instruments. We are not registered investment advisors, and nothing
                    on this platform should be interpreted as personalized investment advice. You are solely responsible
                    for your own investment decisions.
                  </p>

                  <p>
                    <strong>PAST PERFORMANCE DISCLAIMER:</strong> Past performance is not indicative of future results.
                    Historical win rates, performance metrics, and trading results displayed on this platform are based
                    on past data and do not guarantee or predict future trading performance. No representation is being
                    made that any account will or is likely to achieve profits or losses similar to those shown. Trading
                    results can vary significantly, and past success does not ensure future profitability.
                  </p>

                  <p>
                    <strong>HYPOTHETICAL OR SIMULATED PERFORMANCE:</strong> Hypothetical or simulated performance
                    results have certain limitations. Unlike actual trading records, simulated results do not represent
                    actual trading and may not reflect the impact of market risks, liquidity issues, or other real-world
                    trading factors. Simulated trading programs are generally designed with the benefit of hindsight, and
                    no representation is made that any account will achieve results similar to those shown.
                  </p>

                  <p>
                    <strong>YOUR SOLE RESPONSIBILITY:</strong> You acknowledge and agree that you are solely responsible
                    for your investment decisions and any resulting gains or losses. You should conduct your own research
                    and due diligence before making any trading decisions. If necessary, seek independent advice from a
                    qualified financial advisor who understands your specific circumstances. TradeSignal PK does not
                    provide personalized financial advice and cannot be held responsible for your trading decisions.
                  </p>

                  <p>
                    <strong>NO GUARANTEES:</strong> TradeSignal PK makes no guarantees, warranties, or promises regarding
                    the accuracy, completeness, timeliness, or reliability of any signals, analysis, or information
                    provided. Trading signals may contain errors, delays, or inaccuracies. We reserve the right to modify,
                    suspend, or discontinue any service without prior notice. Your use of our platform is entirely at your
                    own risk.
                  </p>

                  <p>
                    <strong>LIMITATION OF LIABILITY:</strong> TradeSignal PK, its owners, employees, affiliates, and
                    partners shall not be held liable for any direct, indirect, incidental, consequential, or special
                    damages arising from your use of our platform or reliance on any information, signals, or analysis
                    provided. This includes, but is not limited to, financial losses, lost profits, trading losses, or
                    data loss. You agree to indemnify and hold harmless TradeSignal PK from any claims arising from your
                    trading activities.
                  </p>

                  <p>
                    <strong>REGULATORY WARNING:</strong> Online trading and investing in financial markets may be subject
                    to regulations in your jurisdiction. It is your responsibility to ensure compliance with all applicable
                    laws, regulations, and licensing requirements. Some jurisdictions may prohibit or restrict certain
                    types of trading activities. Verify that you are legally permitted to trade in your country of residence.
                  </p>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      <strong>PAKISTAN REGULATORY NOTICE:</strong> TradeSignal PK operates in accordance with the
                      Securities and Exchange Commission of Pakistan (SECP) guidelines and applicable financial
                      regulations. We are committed to transparency, ethical practices, and client protection. This
                      platform provides educational content and trading signals but does not operate as a regulated
                      financial advisor or broker. All trading activities should be conducted through properly licensed
                      and regulated brokers. For regulatory inquiries, contact the SECP at{' '}
                      <a
                        href="https://www.secp.gov.pk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-yellow-900 dark:hover:text-yellow-100">
                        www.secp.gov.pk
                      </a>
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
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>SECP Guidelines Aware</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Educational Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Data Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Not Investment Advice</span>
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
