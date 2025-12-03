import express from 'express';
import { scrapeStockData } from '../services/stockScraper.js';
import { getCachedStockData, setCachedStockData } from '../services/cacheService.js';

const router = express.Router();

router.post('/fetch', async (req, res) => {
  try {
    const { code, force } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Stock code is required' });
    }

    if (!force) {
      const cached = await getCachedStockData(code);
      if (cached) {
        console.log(`Returning cached stock data for ${code}`);
        return res.json({
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    console.log(`Fetching fresh stock data for ${code}`);
    const stockData = await scrapeStockData(code);

    await setCachedStockData(code, stockData);

    res.json({
      success: true,
      data: stockData,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stock fetch error:', error);

    const cached = await getCachedStockData(req.body.code);
    if (cached) {
      console.log(`Returning stale cached data for ${req.body.code} after error`);
      return res.json({
        success: true,
        data: cached,
        cached: true,
        stale: true,
        error: 'Fresh data unavailable, returning cached data',
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/:code/basic', async (req, res) => {
  try {
    const { code } = req.params;

    const cached = await getCachedStockData(code);
    if (cached) {
      return res.json({
        success: true,
        data: cached.basic,
        cached: true,
      });
    }

    const stockData = await scrapeStockData(code);
    await setCachedStockData(code, stockData);

    res.json({
      success: true,
      data: stockData.basic,
      cached: false,
    });
  } catch (error) {
    console.error('Basic info fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch basic info',
    });
  }
});

router.get('/:code/current', async (req, res) => {
  try {
    const { code } = req.params;

    const cached = await getCachedStockData(code);
    if (cached) {
      return res.json({
        success: true,
        data: cached.current,
        cached: true,
      });
    }

    const stockData = await scrapeStockData(code);
    await setCachedStockData(code, stockData);

    res.json({
      success: true,
      data: stockData.current,
      cached: false,
    });
  } catch (error) {
    console.error('Current price fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch current price',
    });
  }
});

router.get('/:code/historical', async (req, res) => {
  try {
    const { code } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const cached = await getCachedStockData(code);
    if (cached) {
      const limited = cached.historical.slice(0, days);
      return res.json({
        success: true,
        data: limited,
        cached: true,
      });
    }

    const stockData = await scrapeStockData(code);
    await setCachedStockData(code, stockData);

    const limited = stockData.historical.slice(0, days);
    res.json({
      success: true,
      data: limited,
      cached: false,
    });
  } catch (error) {
    console.error('Historical data fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data',
    });
  }
});

export default router;
