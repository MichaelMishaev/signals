// Sample signal data for preview components
export const sampleSignalData = {
  id: 1,
  type: 'SIGNAL',
  title: 'EUR/USD Strong BUY Signal Generated',
  content:
    'Technical analysis shows bullish momentum with RSI recovering from oversold territory. MACD shows bullish crossover with increasing volume supporting the upward move. ECB policy stance remains hawkish while USD shows weakness following recent Fed minutes.',
  pair: 'EUR/USD',
  action: 'BUY' as const,
  entry: 1.085,
  stopLoss: 1.082,
  takeProfit: 1.092,
  currentPrice: 1.0885,
  confidence: 87,
  market: 'FOREX',
  status: 'ACTIVE',
  pips: 35,
  author: 'Ahmad Ali',
  authorImage: '/images/avatars/ahmad-ali.jpg',
  publishDate: '2025-01-15',
  analysis: 'Strong technical setup with multiple confluences supporting bullish bias.',
  chart: '/images/charts/eurusd-chart.jpg',
  keyLevels: {
    resistance: [1.092, 1.095, 1.098],
    support: [1.082, 1.079, 1.075],
  },
  riskManagement: {
    positionSize: '2% of account',
    maxRisk: '30 pips',
    rewardTarget: '70 pips',
  },
};
