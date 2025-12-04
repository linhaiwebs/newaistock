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

  const prompt = `以下の形式で株式診断レポートを作成してください。必ず指定された形式を厳守し、株価データと指標を正確に記載してください。

【必須フォーマット】
【AI診断】ご入力いただいた${params.stockName}について、モメンタム分析・リアルタイムデータ・AIロジックをもとに診断を行いました。

現在の株価は${formattedPrice}円、前日比${formattedChange}円（${formattedChangePercent}%）。

現在、短期ボラティリティ指標が過去30日の平均と比較して${volatilityLevelJP}水準に達しています。AIの分析によると、テクニカルは${rsiStatusJP}（RSI[${indicators.rsi}%]）が優勢となっており、[適切なトレンド予測]へのつながる傾向が見られます。

私たちのスタッフ、「AI株式診断アシスタント」のLINEアカウントを追加してください。

追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード「${params.stockName}」または【${params.stockCode}】を送信してください。

【重要な指示】
- 上記のフォーマットを厳密に守ってください
- ${params.stockName}、株価${formattedPrice}円、前日比${formattedChange}円（${formattedChangePercent}%）は必ず表示してください
- RSI[${indicators.rsi}%]は必ず表示してください
- ボラティリティ水準は「${volatilityLevelJP}」と表示してください
- テクニカルステータスは「${rsiStatusJP}」と表示してください
- [適切なトレンド予測]の部分は、RSIが${indicators.rsi}%の場合に適切な市場予測（「上昇」「下落」「調整」など）に置き換えてください
- LINE追加の案内は必ず含めてください`;

  async function* generateResponse() {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'あなたは日本株式のAI診断アシスタントです。指定されたフォーマットを厳密に守り、提供されたデータを正確に表示してください。創造的な内容よりも、フォーマットの遵守とデータの正確性を優先してください。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true,
          max_tokens: 1000,
          temperature: 0.3,
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
                yield content;
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('AI service error:', error);
      yield 'AI分析中にエラーが発生しました。しばらく時間をおいて再度お試しください。';
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
