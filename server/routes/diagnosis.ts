import express from 'express';
import { analyzeStockWithAI, getFullAIAnalysis } from '../services/aiService.js';
import { getCachedDiagnosis, setCachedDiagnosis } from '../services/cacheService.js';
import { supabaseAdmin } from '../db/supabaseAdmin.js';

const router = express.Router();

router.get('/cache/:stockCode', async (req, res) => {
  try {
    const { stockCode } = req.params;
    const cached = await getCachedDiagnosis(stockCode);

    if (cached) {
      res.json({ cached: true, result: cached });
    } else {
      res.json({ cached: false });
    }
  } catch (error) {
    console.error('Cache check error:', error);
    res.status(500).json({ error: 'Failed to check cache' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { stockCode, stockName, stockData, sessionId } = req.body;

    if (!stockCode || !stockName || !stockData) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cached = await getCachedDiagnosis(stockCode);

    if (cached) {
      await supabaseAdmin.from('stock_diagnoses').insert({
        session_id: sessionId,
        stock_code: stockCode,
        diagnosis_result: cached,
        from_cache: true,
        converted: false,
      });

      return res.json({ cached: true, result: cached });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const generator = await analyzeStockWithAI({
      stockCode,
      stockName,
      currentPrice: stockData.current.price,
      priceChange: stockData.current.change,
      priceChangePercent: stockData.current.changePercent,
      historicalData: stockData.historical || [],
    });

    let fullResult = '';

    for await (const chunk of generator) {
      fullResult += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

    await setCachedDiagnosis(stockCode, fullResult);

    await supabaseAdmin.from('stock_diagnoses').insert({
      session_id: sessionId,
      stock_code: stockCode,
      diagnosis_result: fullResult,
      from_cache: false,
      converted: false,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Analysis failed' });
    }
  }
});

export default router;
