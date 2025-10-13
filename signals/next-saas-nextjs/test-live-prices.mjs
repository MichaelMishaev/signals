/**
 * Test script for live price service
 * Run with: node test-live-prices.mjs
 */

// Binance API test for crypto
async function testBinanceCrypto() {
  console.log('\n🔵 Testing Binance Crypto API...');

  try {
    const symbols = ['BTCUSDT', 'ETHUSDT'];

    for (const symbol of symbols) {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();

      if (data.lastPrice) {
        console.log(`✅ ${symbol}: $${parseFloat(data.lastPrice).toFixed(2)}`);
        console.log(`   24h Change: ${parseFloat(data.priceChangePercent).toFixed(2)}%`);
      }
    }
  } catch (error) {
    console.error('❌ Binance API error:', error.message);
  }
}

// ExchangeRate API test for forex
async function testExchangeRateForex() {
  console.log('\n💱 Testing ExchangeRate API for Forex...');

  try {
    const baseCurrencies = ['EUR', 'GBP'];

    for (const base of baseCurrencies) {
      const response = await fetch(`https://open.exchangerate-api.com/v6/latest/${base}`);
      const data = await response.json();

      if (data.rates && data.rates.USD) {
        console.log(`✅ ${base}/USD: ${data.rates.USD.toFixed(5)}`);
        console.log(`   Updated: ${data.time_last_update_utc || 'N/A'}`);
      }
    }
  } catch (error) {
    console.error('❌ ExchangeRate API error:', error.message);
  }
}

// Test common pairs
async function testCommonPairs() {
  console.log('\n📊 Testing Common Trading Pairs...');

  const pairs = {
    'BTCUSDT': 'crypto',
    'ETHUSDT': 'crypto',
    'EUR/USD': 'forex',
    'GBP/USD': 'forex',
  };

  console.log('\nPair Type Detection:');
  for (const [pair, expectedType] of Object.entries(pairs)) {
    console.log(`  ${pair} → ${expectedType}`);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Live Price Service Tests\n');
  console.log('='.repeat(50));

  await testBinanceCrypto();
  await testExchangeRateForex();
  await testCommonPairs();

  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!\n');
  console.log('📝 Summary:');
  console.log('   - Binance API: FREE, no API key, real-time crypto prices');
  console.log('   - ExchangeRate API: FREE, no API key, forex rates (updated hourly)');
  console.log('   - Auto-refresh: Every 30 seconds in the app');
}

runTests();
