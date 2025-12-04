import axios from 'axios';
import { calculateTechnicalIndicators, TechnicalIndicators } from '../utils/technicalIndicators.js';

const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || '';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

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

  const prompt = `【${params.stockName}（${params.stockCode}）の診断レポート】

株価情報：
- 現在値：${formattedPrice}円
- 前日比：${formattedChange}円（${formattedChangePercent}%）

テクニカル分析：
- RSI：${indicators.rsi.toFixed(1)}（${rsiStatusJP}）
- ボラティリティ：${volatilityLevelJP}水準

AIは、この銘柄について「${trendPrediction}」と判断しています。

より詳細な分析をご希望の場合は、私たちのスタッフ「${lineAccount}」をLINEで追加し、銘柄コード【${params.stockCode}】を送信してください。専門アナリストによる詳しいレポートをお届けします。

上記の内容を自然な日本語の文章として、150〜250文字程度でまとめてください。専門的でありながら読みやすく、段落分けは適度に行ってください。`;

  async function* generateResponse() {
    let totalOutput = '';
    let chunkCount = 0;

    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'あなたは日本の株式市場に精通したプロのアナリストです。ユーザーに対して、データに基づいた客観的な分析を、自然で読みやすい日本語で提供してください。専門用語は適度に使用し、一般投資家にも理解しやすい表現を心がけてください。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true,
          max_tokens: 1000,
          temperature: 0.6,
          top_p: 0.9,
          frequency_penalty: 0.3,
        },
        {
          headers: {
            'Authorization': `Bearer ${SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
          timeout: 60000,
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter((line: string) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                totalOutput += content;
                chunkCount++;
                yield content;
              }
            } catch (e) {
              console.error('Failed to parse chunk:', e);
              continue;
            }
          }
        }
      }

      if (totalOutput.length < 50) {
        console.error('AI output too short:', totalOutput.length, 'characters');
        const fallbackMessage = `【AI診断】${params.stockName}（${params.stockCode}）について診断を行いました。\n\n現在の株価は${formattedPrice}円、前日比${formattedChange}円（${formattedChangePercent}%）です。テクニカル指標ではRSI ${indicators.rsi.toFixed(1)}（${rsiStatusJP}）、ボラティリティは${volatilityLevelJP}水準となっています。\n\nより詳細な分析は、LINEで「${lineAccount}」を追加し、銘柄コード【${params.stockCode}】を送信してください。`;
        yield fallbackMessage;
      }

      console.log(`AI generated ${totalOutput.length} characters in ${chunkCount} chunks`);

    } catch (error) {
      console.error('AI service error:', error);
      const fallbackMessage = `【AI診断】${params.stockName}（${params.stockCode}）について診断を行いました。\n\n現在の株価は${formattedPrice}円、前日比${formattedChange}円（${formattedChangePercent}%）です。テクニカル指標ではRSI ${indicators.rsi.toFixed(1)}（${rsiStatusJP}）、ボラティリティは${volatilityLevelJP}水準となっています。\n\nより詳細な分析は、LINEで「${lineAccount}」を追加し、銘柄コード【${params.stockCode}】を送信してください。`;
      yield fallbackMessage;
    }
  }

  return generateResponse();
}

export async function getFullAIAnalysis(params: StockAnalysisParams): Promise<string> {
  const generator = await analyzeStockWithAI(params);
  let fullText = '';

  for await (const chunk of generator) {
    fullText += chunk;
  }

  return fullText;
}
