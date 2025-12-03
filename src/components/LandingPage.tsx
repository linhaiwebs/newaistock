import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { fetchStockData, streamDiagnosis, trackEvent, trackConversion, getWeightedRedirect } from '../lib/api';
import { getSessionId } from '../lib/session';
import { trackDiagnosisClick, trackConversionClick } from '../lib/analytics';

export function LandingPage() {
  const [stockCode, setStockCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const [stockName, setStockName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const sessionId = getSessionId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      setStockCode(code);
      loadStockData(code);
    }
  }, []);

  async function loadStockData(code: string) {
    try {
      setLoading(true);
      const response = await fetchStockData(code);
      setStockCode(code);
      setStockName(response.data.basic.name);

      await trackEvent(sessionId, 'page_view', code);
    } catch (error) {
      console.error('Failed to load stock data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDiagnose() {
    if (!stockCode) return;

    trackDiagnosisClick();
    await trackEvent(sessionId, 'diagnosis_click', stockCode);

    setAnalyzing(true);
    setShowResult(false);

    try {
      const response = await fetchStockData(stockCode);
      const stockData = response.data;
      const historicalData = stockData.historical
        .map((p: any) => `${p.date}: 終値 ${p.close}`)
        .join('\n');

      let fullText = '';

      for await (const chunk of streamDiagnosis(
        stockCode,
        stockData.basic.name,
        stockData.current.price.toString(),
        historicalData,
        sessionId
      )) {
        fullText += chunk;
        setResult(fullText);
      }

      setShowResult(true);
      setAnalyzing(false);

      const redirect = await getWeightedRedirect();
      if (redirect) {
        setRedirectUrl(redirect.url);
      }
    } catch (error) {
      console.error('Diagnosis failed:', error);
      setResult('診断中にエラーが発生しました。もう一度お試しください。');
      setShowResult(true);
      setAnalyzing(false);
    }
  }

  async function handleConversion() {
    trackConversionClick();
    await trackConversion(sessionId, stockCode);
    await trackEvent(sessionId, 'conversion_click', stockCode);

    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AI株式診断結果
                </h1>
                <p className="text-gray-600">{stockName} ({stockCode})</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {result}
              </div>
            </div>

            {redirectUrl && (
              <button
                onClick={handleConversion}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                <span>詳細情報を確認する</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                AI分析中
              </h2>
              <p className="text-gray-600">
                株式データを詳細に分析しています...
              </p>
            </div>

            <div className="space-y-4">
              <LoadingBar label="市場データ取得中" delay={0} />
              <LoadingBar label="テクニカル指標分析中" delay={300} />
              <LoadingBar label="トレンド評価中" delay={600} />
              <LoadingBar label="投資判断生成中" delay={900} />
              <LoadingBar label="レポート作成中" delay={1200} />
            </div>

            {result && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl max-h-60 overflow-y-auto">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {result}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI株式診断
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            最新のAI技術で株式を分析
          </p>
          <p className="text-gray-500">
            銘柄コードを入力するだけで、詳細な投資分析レポートを生成
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              銘柄コード
            </label>
            <input
              type="text"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              disabled={loading || analyzing}
            />

            <button
              onClick={handleDiagnose}
              disabled={!stockCode || loading || analyzing}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>今すぐ診断</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI分析"
              description="最新の機械学習モデルで株価トレンドを分析"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="詳細レポート"
              description="テクニカル指標と投資判断を提供"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="リスク評価"
              description="投資リスク要因を明確に提示"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingBar({ label, delay }: { label: string; delay: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-loading-bar" />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
