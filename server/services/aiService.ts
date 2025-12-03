import axios from 'axios';

const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || '';
const API_URL = 'https://api.siliconflow.cn/v1/chat/completions';

interface StockAnalysisParams {
  stockCode: string;
  stockName: string;
  currentPrice: string;
  historicalData: string;
}

export async function analyzeStockWithAI(params: StockAnalysisParams): Promise<AsyncGenerator<string>> {
  const prompt = `あなたは株式アナリストです。以下の日本株について詳細な分析を日本語で提供してください。

株式コード: ${params.stockCode}
銘柄名: ${params.stockName}
現在価格: ${params.currentPrice}

過去の価格データ:
${params.historicalData}

以下の観点から分析してください：
1. 株価のトレンド分析
2. テクニカル指標の評価
3. 投資判断のポイント
4. リスク要因
5. 総合的な投資推奨

丁寧で分かりやすい日本語で、800-1000文字程度で回答してください。`;

  async function* generateResponse() {
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'あなたは経験豊富な日本株式アナリストです。',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true,
          max_tokens: 2000,
          temperature: 0.7,
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
