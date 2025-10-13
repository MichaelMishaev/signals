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
                    <strong>⚠️ HIGH RISK WARNING:</strong> Trading foreign exchange (Forex), cryptocurrencies,
                    commodities, options, futures, and stocks involves <strong>substantial risk of loss</strong> and
                    may not be suitable for all investors. You could lose some or all of your invested capital.
                    Leverage can magnify both profits and losses. Before trading, carefully consider your financial
                    situation, investment experience, risk tolerance, and objectives. <strong>Only trade with money you
                    can afford to lose completely.</strong> Never use borrowed funds or money needed for essential
                    expenses.
                  </p>

                  <p>
                    <strong>📊 MAJORITY OF TRADERS LOSE MONEY:</strong> Statistical data shows that the majority of
                    retail traders lose money when trading leveraged products. You should consider whether you fully
                    understand how these products work and whether you can afford to take the high risk of losing your
                    money. Past success rates do not predict your individual performance.
                  </p>

                  <p>
                    <strong>🚫 NOT FINANCIAL OR INVESTMENT ADVICE:</strong> TradeSignal PK is a <strong>trading
                    signals platform for educational purposes only</strong>. All signals, analysis, commentary, and
                    information provided are <strong>NOT</strong> financial advice, investment recommendations, or
                    solicitations to buy/sell securities. We are <strong>NOT</strong> registered investment advisors,
                    financial advisors, or brokers. You must make your own independent trading decisions and consult
                    qualified financial professionals before investing.
                  </p>

                  <p>
                    <strong>📈 PAST PERFORMANCE DOES NOT GUARANTEE FUTURE RESULTS:</strong> Historical win rates,
                    performance metrics, and past trading results displayed on this platform do not guarantee or
                    predict future performance. No representation is made that any account will achieve similar
                    profits or losses. Market conditions change constantly, and individual results vary significantly
                    based on execution, timing, broker, account size, and risk management.
                  </p>

                  <p>
                    <strong>🎯 SIGNALS ARE EDUCATIONAL INDICATORS ONLY:</strong> Trading signals provided by
                    TradeSignal PK are educational market analysis indicators, not guaranteed trading instructions.
                    Signals may be delayed, contain errors, or become invalid due to rapidly changing market
                    conditions. You are solely responsible for independently verifying all information, conducting
                    your own analysis, and deciding whether to act on any signal.
                  </p>

                  <p>
                    <strong>💼 YOUR SOLE RESPONSIBILITY:</strong> You acknowledge that you are fully responsible for
                    all trading decisions and their outcomes (profits or losses). You must conduct your own due
                    diligence, risk assessment, and market research. TradeSignal PK does not make decisions for you
                    and cannot be held responsible for your trading results, missed opportunities, execution problems,
                    or any losses incurred.
                  </p>

                  <p>
                    <strong>❌ NO GUARANTEES OR WARRANTIES:</strong> TradeSignal PK provides information <strong>&quot;AS
                    IS&quot;</strong> without any guarantees regarding accuracy, completeness, timeliness, or
                    reliability. We make no promises about profitability, win rates, or signal performance. Technical
                    issues, delays, errors, or service interruptions may occur. We reserve the right to modify or
                    discontinue services without notice.
                  </p>

                  <p>
                    <strong>⚖️ LIMITATION OF LIABILITY:</strong> <strong>Under no circumstances</strong> shall
                    TradeSignal PK, its owners, employees, partners, or affiliates be liable for any trading losses,
                    missed profits, direct, indirect, incidental, consequential, or special damages arising from use
                    of this platform or reliance on any signals or information. You agree to hold TradeSignal PK
                    harmless from any claims related to your trading activities.
                  </p>

                  <p>
                    <strong>🔒 BROKER RESPONSIBILITY:</strong> TradeSignal PK is <strong>NOT a broker</strong> and
                    does not execute trades, hold funds, or manage client money. You must use properly licensed and
                    regulated brokers for all trading activities. We are not responsible for broker actions, execution
                    quality, spreads, commissions, technical problems, or any broker-related issues.
                  </p>

                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-xs text-yellow-900 dark:text-yellow-200 space-y-2">
                      <strong className="block text-sm mb-2">🇵🇰 PAKISTAN REGULATORY COMPLIANCE (SECP):</strong>
                      <span className="block">
                        TradeSignal PK operates as an <strong>educational trading signals platform</strong> in
                        accordance with Pakistani laws and SECP guidelines. We are committed to transparency and
                        client protection.
                      </span>
                      <span className="block mt-2">
                        <strong>Important:</strong> We are <strong>NOT</strong> a licensed broker, financial advisor,
                        or investment advisor. We do <strong>NOT</strong> hold client funds, execute trades, or
                        provide personalized financial advice.
                      </span>
                      <span className="block mt-2">
                        <strong>Verify Your Broker:</strong> Always use SECP-licensed and regulated brokers. Verify
                        broker credentials at{' '}
                        <a
                          href="https://www.secp.gov.pk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold hover:text-yellow-950 dark:hover:text-yellow-50">
                          www.secp.gov.pk
                        </a>
                      </span>
                      <span className="block mt-2 text-[10px] italic">
                        Note: As of 2025, no Forex brokers are SECP-regulated for retail Forex trading in Pakistan.
                        International brokers operate under their respective jurisdictions. Users must verify
                        regulatory status and assume all risks.
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700">
                    <p className="text-xs font-bold text-red-900 dark:text-red-200 text-center">
                      ⚠️ FINAL WARNING: THE MAJORITY OF RETAIL TRADERS LOSE MONEY ⚠️
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-300 mt-2 text-center">
                      Before risking your capital, ensure you fully understand the risks involved and are financially
                      prepared to accept complete loss of your investment. If in doubt, seek professional financial
                      advice.
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
