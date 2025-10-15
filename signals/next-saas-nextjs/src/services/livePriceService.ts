/**
 * Live Price Service
 * Fetches real-time prices for trading pairs from free APIs
 * - Binance: Crypto prices (BTC, ETH, etc.)
 * - ExchangeRate-API: Forex rates (EUR/USD, GBP/USD, etc.)
 */

export interface LivePrice {
  pair: string;
  price: number;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface PriceCache {
  [pair: string]: LivePrice;
}

// Cache to store prices and reduce API calls
let priceCache: PriceCache = {};
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch crypto prices from Binance API (free, no API key required)
 * Supports: BTC, ETH, BNB, SOL, ADA, XRP, DOT, LINK, etc.
 */
async function fetchCryptoPrices(symbols: string[]): Promise<PriceCache> {
  try {
    // Convert pairs like "BTCUSDT" to Binance format
    const binanceSymbols = symbols.map(symbol => {
      // Handle different formats: BTC/USDT, BTCUSDT, BTC
      const clean = symbol.replace('/', '').toUpperCase();

      // If already ends with USDT, return as-is (avoid BTCUSDT -> BTCUSDTT bug)
      if (clean.endsWith('USDT')) {
        return clean;
      }

      // If ends with USD (but not USDT), add T to make it USDT
      if (clean.endsWith('USD')) {
        return clean + 'T';
      }

      // Otherwise, add USDT suffix
      return `${clean}USDT`;
    });

    // Fetch 24hr ticker data from Binance
    const responses = await Promise.all(
      binanceSymbols.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    );

    const prices: PriceCache = {};
    responses.forEach((data, index) => {
      if (data && data.lastPrice) {
        const originalSymbol = symbols[index];
        prices[originalSymbol] = {
          pair: originalSymbol,
          price: parseFloat(data.lastPrice),
          timestamp: Date.now(),
          change24h: parseFloat(data.priceChange),
          changePercent24h: parseFloat(data.priceChangePercent),
        };
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices from Binance:', error);
    return {};
  }
}

/**
 * Fetch forex prices from ExchangeRate-API (free, no API key for basic usage)
 * Supports: All major currency pairs (EUR/USD, GBP/USD, USD/JPY, etc.)
 */
async function fetchForexPrices(pairs: string[]): Promise<PriceCache> {
  try {
    // Extract unique base currencies
    const baseCurrencies = new Set<string>();
    pairs.forEach(pair => {
      const [base] = pair.split('/');
      if (base) baseCurrencies.add(base.toUpperCase());
    });

    // Fetch rates for each base currency
    const responses = await Promise.all(
      Array.from(baseCurrencies).map(base =>
        fetch(`https://open.exchangerate-api.com/v6/latest/${base}`)
          .then(res => res.ok ? res.json() : null)
          .catch(() => null)
      )
    );

    const prices: PriceCache = {};

    pairs.forEach(pair => {
      const [base, quote] = pair.split('/').map(c => c.toUpperCase());

      // Find the response for this base currency
      const baseIndex = Array.from(baseCurrencies).indexOf(base);
      const data = responses[baseIndex];

      if (data && data.rates && data.rates[quote]) {
        prices[pair] = {
          pair,
          price: data.rates[quote],
          timestamp: Date.now(),
        };
      }
    });

    return prices;
  } catch (error) {
    console.error('Error fetching forex prices:', error);
    return {};
  }
}

/**
 * Determine if a pair is crypto or forex
 */
function getPairType(pair: string): 'crypto' | 'forex' | 'unknown' {
  const cryptoSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'XRP', 'DOT', 'LINK', 'MATIC', 'AVAX', 'UNI', 'LTC', 'BCH', 'ATOM', 'FIL', 'TRX', 'ETC', 'XLM', 'ALGO', 'VET'];
  const forexSymbols = ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'USD'];

  const upperPair = pair.toUpperCase();

  // Check if it contains crypto symbols
  for (const crypto of cryptoSymbols) {
    if (upperPair.includes(crypto)) {
      return 'crypto';
    }
  }

  // Check if it's a forex pair (e.g., EUR/USD, GBPUSD)
  const hasTwoForexCurrencies = forexSymbols.filter(curr =>
    upperPair.includes(curr)
  ).length >= 2;

  if (hasTwoForexCurrencies) {
    return 'forex';
  }

  return 'unknown';
}

/**
 * Normalize pair format for API calls
 */
function normalizePair(pair: string): string {
  // Remove spaces and ensure proper format
  let normalized = pair.replace(/\s+/g, '').toUpperCase();

  // Ensure forex pairs have slash
  if (getPairType(normalized) === 'forex' && !normalized.includes('/')) {
    // Insert slash between currencies (e.g., EURUSD -> EUR/USD)
    normalized = normalized.slice(0, 3) + '/' + normalized.slice(3);
  }

  return normalized;
}

/**
 * Main function: Fetch live prices for multiple trading pairs
 * Automatically detects crypto vs forex and uses appropriate API
 */
export async function fetchLivePrices(pairs: string[]): Promise<PriceCache> {
  if (!pairs || pairs.length === 0) {
    return {};
  }

  const now = Date.now();
  const normalizedPairs = pairs.map(normalizePair);

  // Separate crypto and forex pairs
  const cryptoPairs: string[] = [];
  const forexPairs: string[] = [];

  normalizedPairs.forEach(pair => {
    const type = getPairType(pair);
    if (type === 'crypto') {
      cryptoPairs.push(pair);
    } else if (type === 'forex') {
      forexPairs.push(pair);
    }
  });

  // Fetch prices in parallel
  const [cryptoPrices, forexPrices] = await Promise.all([
    cryptoPairs.length > 0 ? fetchCryptoPrices(cryptoPairs) : Promise.resolve({}),
    forexPairs.length > 0 ? fetchForexPrices(forexPairs) : Promise.resolve({}),
  ]);

  // Merge results
  const allPrices = { ...cryptoPrices, ...forexPrices };

  // Update cache
  Object.keys(allPrices).forEach(pair => {
    priceCache[pair] = allPrices[pair];
  });

  return allPrices;
}

/**
 * Get price from cache (if fresh) or fetch new price
 */
export async function getPrice(pair: string): Promise<LivePrice | null> {
  const normalized = normalizePair(pair);
  const cached = priceCache[normalized];

  // Return cached price if fresh (within CACHE_DURATION)
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached;
  }

  // Fetch new price
  const prices = await fetchLivePrices([normalized]);
  return prices[normalized] || null;
}

/**
 * Calculate profit/loss percentage between current price and entry
 */
export function calculatePnL(
  currentPrice: number,
  entryPrice: number,
  action: 'BUY' | 'SELL'
): { pnl: number; pnlPercent: number; isProfit: boolean } {
  let pnl = 0;

  if (action === 'BUY') {
    pnl = currentPrice - entryPrice;
  } else {
    pnl = entryPrice - currentPrice;
  }

  const pnlPercent = (pnl / entryPrice) * 100;

  return {
    pnl,
    pnlPercent,
    isProfit: pnl > 0,
  };
}

/**
 * Format price based on pair type
 */
export function formatPrice(price: number, pair: string): string {
  const type = getPairType(pair);

  if (type === 'crypto') {
    // Crypto: Show 2-4 decimals based on price magnitude
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  }

  // Forex: Always 4-5 decimals
  return price.toFixed(5);
}

/**
 * Clear price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = {};
}
