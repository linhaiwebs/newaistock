import { useState, useEffect } from 'react';
import { fetchStockData, streamDiagnosis, trackEvent, trackConversion, getWeightedRedirect } from '../lib/api';
import { getSessionId } from '../lib/session';
import { trackDiagnosisClick, trackConversionClick } from '../lib/analytics';
import { StockDiagnosisState, StockDiagnosisActions, ProgressStage } from '../types/stock';

export function useStockDiagnosis(): StockDiagnosisState & StockDiagnosisActions {
  const [stockCode, setStockCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState('');
  const [stockName, setStockName] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
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
    setResult('');

    setProgressStages([
      { label: 'データ取得中', progress: 0 },
      { label: 'AI分析準備中', progress: 0 },
      { label: '結果生成中', progress: 0 },
    ]);

    try {
      setProgressStages([
        { label: 'データ取得中', progress: 30 },
        { label: 'AI分析準備中', progress: 0 },
        { label: '結果生成中', progress: 0 },
      ]);

      const response = await fetchStockData(stockCode);
      const stockData = response.data;
      const historicalData = stockData.historical
        .map((p: any) => `${p.date}: 終値 ${p.close}`)
        .join('\n');

      setProgressStages([
        { label: 'データ取得中', progress: 100, completed: true },
        { label: 'AI分析準備中', progress: 50 },
        { label: '結果生成中', progress: 0 },
      ]);

      await new Promise(resolve => setTimeout(resolve, 300));

      let fullText = '';
      let firstChunk = true;

      for await (const chunk of streamDiagnosis(
        stockCode,
        stockData.basic.name,
        stockData.current.price.toString(),
        historicalData,
        sessionId
      )) {
        if (firstChunk) {
          setProgressStages([
            { label: 'データ取得中', progress: 100, completed: true },
            { label: 'AI分析準備中', progress: 100, completed: true },
            { label: '結果生成中', progress: 100, completed: true },
          ]);
          await new Promise(resolve => setTimeout(resolve, 500));
          setAnalyzing(false);
          setShowResult(true);
          firstChunk = false;
        }

        fullText += chunk;
        setResult(fullText);
      }

      const redirect = await getWeightedRedirect();
      if (redirect) {
        setRedirectUrl(redirect.url);
      }
    } catch (error) {
      console.error('Diagnosis failed:', error);
      setResult('診断中にエラーが発生しました。もう一度お試しください。');
      setShowResult(true);
      setAnalyzing(false);
      setProgressStages([]);
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

  function resetDiagnosis() {
    setShowResult(false);
    setAnalyzing(false);
    setResult('');
    setStockCode('');
    setStockName('');
    setRedirectUrl('');
    setProgressStages([]);
  }

  return {
    stockCode,
    stockName,
    loading,
    analyzing,
    showResult,
    result,
    redirectUrl,
    progressStages,
    setStockCode,
    handleDiagnose,
    handleConversion,
    resetDiagnosis,
  };
}
