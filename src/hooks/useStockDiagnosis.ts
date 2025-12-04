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
  const [lineAccountName, setLineAccountName] = useState('AI株式診断アシスタント');
  const [progressStages, setProgressStages] = useState<ProgressStage[]>([]);
  const sessionId = getSessionId();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      console.log('[useStockDiagnosis] Auto-loading stock code from URL:', code);
      setStockCode(code);
      loadStockData(code);
    } else {
      console.log('[useStockDiagnosis] No stock code in URL, ready for user input');
    }
  }, []);

  async function loadStockData(code: string) {
    try {
      setLoading(true);
      const response = await fetchStockData(code);

      if (response?.data?.basic?.name) {
        setStockCode(code);
        setStockName(response.data.basic.name);
        await trackEvent(sessionId, 'page_view', code);
      } else {
        setStockCode(code);
        console.warn('[useStockDiagnosis] Stock data loaded but name is missing');
      }
    } catch (error) {
      console.error('[useStockDiagnosis] Failed to load stock data:', error);
      setStockCode(code);
    } finally {
      setLoading(false);
    }
  }

  async function completeProgressAndShowResult() {
    setProgressStages([
      { label: 'データ取得中', progress: 100, completed: true },
      { label: 'AI分析準備中', progress: 100, completed: true },
      { label: '結果生成中', progress: 100, completed: true },
    ]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setAnalyzing(false);
    setShowResult(true);
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

      if (!stockData || !stockData.basic) {
        await completeProgressAndShowResult();

        const redirect = await getWeightedRedirect();
        if (redirect) {
          setRedirectUrl(redirect.url);
          setLineAccountName(redirect.userId);
          setResult(`私たちのスタッフ、「${redirect.userId}」のLINEアカウントを追加してください。\n\n追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード【${stockCode}】を送信してください。`);
        } else {
          setResult(`私たちのスタッフ、「${lineAccountName}」のLINEアカウントを追加してください。\n\n追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード【${stockCode}】を送信してください。`);
        }
        return;
      }

      if (!stockData.basic.name) {
        await completeProgressAndShowResult();

        const redirect = await getWeightedRedirect();
        if (redirect) {
          setRedirectUrl(redirect.url);
          setLineAccountName(redirect.userId);
          setResult(`私たちのスタッフ、「${redirect.userId}」のLINEアカウントを追加してください。\n\n追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード【${stockCode}】を送信してください。`);
        } else {
          setResult(`私たちのスタッフ、「${lineAccountName}」のLINEアカウントを追加してください。\n\n追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード【${stockCode}】を送信してください。`);
        }
        return;
      }

      setProgressStages([
        { label: 'データ取得中', progress: 100, completed: true },
        { label: 'AI分析準備中', progress: 100, completed: true },
        { label: '結果生成中', progress: 0 },
      ]);

      await new Promise(resolve => setTimeout(resolve, 300));

      const redirect = await getWeightedRedirect();
      if (redirect) {
        setLineAccountName(redirect.userId);
      }

      let fullText = '';
      let firstChunk = true;

      for await (const chunk of streamDiagnosis(
        stockCode,
        stockData.basic.name,
        stockData,
        sessionId,
        lineAccountName
      )) {
        if (firstChunk) {
          await completeProgressAndShowResult();
          firstChunk = false;
        }

        fullText += chunk;
        setResult(fullText);
      }

      if (redirect) {
        setRedirectUrl(redirect.url);
      }
    } catch (error) {
      console.error('Diagnosis failed:', error);
      await completeProgressAndShowResult();

      const redirect = await getWeightedRedirect();
      if (redirect) {
        setRedirectUrl(redirect.url);
        setLineAccountName(redirect.userId);
      }

      const stockNameFormatted = stockName ? `「${stockName}」または` : '';
      setResult(`私たちのスタッフ、「${lineAccountName}」のLINEアカウントを追加してください。\n\n追加が完了しましたら、詳細診断レポートを受け取るために、銘柄コード${stockNameFormatted}【${stockCode}】を送信してください。`);
    }
  }

  async function handleConversion() {
    trackConversionClick();

    // 立即打开新窗口（不等待 API）
    if (redirectUrl) {
      window.open(redirectUrl, '_blank');
    }

    // 后台异步记录，不阻塞用户
    Promise.allSettled([
      trackConversion(sessionId, stockCode),
      trackEvent(sessionId, 'conversion_click', stockCode)
    ]).catch(error => {
      console.error('Tracking error:', error);
    });
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
