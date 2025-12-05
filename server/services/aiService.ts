import { calculateTechnicalIndicators } from '../utils/technicalIndicators.js';

interface StockAnalysisParams {
  stockCode: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  historicalData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  lineAccountName?: string;
}

export async function analyzeStockWithAI(params: StockAnalysisParams): Promise<AsyncGenerator<string>> {
  const indicators = calculateTechnicalIndicators(params.historicalData);

  const formattedPrice = params.currentPrice.toLocaleString('ja-JP');
  const formattedChange = params.priceChange >= 0
    ? `+${params.priceChange.toLocaleString('ja-JP')}`
    : params.priceChange.toLocaleString('ja-JP');
  const formattedChangePercent = params.priceChangePercent >= 0
    ? `+${params.priceChangePercent.toFixed(2)}`
    : params.priceChangePercent.toFixed(2);

  const volatilityLevelJP = {
    low: '低',
    medium: '中',
    high: '高'
  }[indicators.volatilityLevel];

  const rsiStatusJP = {
    overbought: '過買い',
    oversold: '過売り',
    neutral: '中立'
  }[indicators.rsiStatus];

  const lineAccount = params.lineAccountName || 'AI株式診断アシスタント';

  let trendPrediction = '横ばい圏内での推移';
  if (indicators.rsi >= 70) {
    trendPrediction = '過熱感があり、調整局面に入る可能性';
  } else if (indicators.rsi <= 30) {
    trendPrediction = '売られすぎの状態で、反発の兆し';
  } else if (indicators.rsi >= 55) {
    trendPrediction = '上昇トレンドの継続';
  } else if (indicators.rsi <= 45) {
    trendPrediction = '下落圧力が見られる';
  }

  const analysisTemplate = `【AI診断】${params.stockName}（${params.stockCode}）について診断を行いました。

現在の株価は${formattedPrice}円、前日比${formattedChange}円（${formattedChangePercent}%）です。テクニカル指標ではRSI ${indicators.rsi.toFixed(1)}（${rsiStatusJP}）、ボラティリティは${volatilityLevelJP}水準となっています。

より詳細な分析は、LINEで「${lineAccount}」を追加し、銘柄コード【${params.stockCode}】を送信してください。`;

  async function* generateResponse() {
    const chunks = analysisTemplate.split('');

    for (const char of chunks) {
      yield char;
      await new Promise(resolve => setTimeout(resolve, 20));
    }
  }

  return generateResponse();
}
