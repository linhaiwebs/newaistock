interface HistoricalDataPoint {
  close: number;
  high: number;
  low: number;
}

export interface TechnicalIndicators {
  rsi: number;
  volatility: number;
  volatilityLevel: 'low' | 'medium' | 'high';
  trend: 'bullish' | 'bearish' | 'neutral';
  rsiStatus: 'overbought' | 'oversold' | 'neutral';
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) {
    return 50 + Math.random() * 30;
  }

  const changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i];
    else avgLoss += Math.abs(changes[i]);
  }

  avgGain /= period;
  avgLoss /= period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.round(rsi);
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 15 + Math.random() * 10;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  return Math.round(stdDev * 100 * Math.sqrt(252) * 10) / 10;
}

export function calculateTechnicalIndicators(
  historicalData: HistoricalDataPoint[]
): TechnicalIndicators {
  const closePrices = historicalData.map(d => d.close).filter(p => p > 0);

  if (closePrices.length < 2) {
    return {
      rsi: 50,
      volatility: 20,
      volatilityLevel: 'medium',
      trend: 'neutral',
      rsiStatus: 'neutral',
    };
  }

  const rsi = calculateRSI(closePrices, 14);
  const volatility = calculateVolatility(closePrices);

  let volatilityLevel: 'low' | 'medium' | 'high';
  if (volatility < 15) volatilityLevel = 'low';
  else if (volatility < 25) volatilityLevel = 'medium';
  else volatilityLevel = 'high';

  let rsiStatus: 'overbought' | 'oversold' | 'neutral';
  if (rsi >= 70) rsiStatus = 'overbought';
  else if (rsi <= 30) rsiStatus = 'oversold';
  else rsiStatus = 'neutral';

  const recentPrices = closePrices.slice(0, 5);
  const olderPrices = closePrices.slice(5, 10);

  if (recentPrices.length > 0 && olderPrices.length > 0) {
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    const trend = recentAvg > olderAvg * 1.02 ? 'bullish' :
                  recentAvg < olderAvg * 0.98 ? 'bearish' : 'neutral';

    return { rsi, volatility, volatilityLevel, trend, rsiStatus };
  }

  return {
    rsi,
    volatility,
    volatilityLevel,
    trend: 'neutral',
    rsiStatus,
  };
}
