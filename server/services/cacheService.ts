import { supabase } from '../db/supabase.js';
import { StockData } from './stockScraper.js';

const CACHE_DURATION_DAYS = 7;
const STOCK_CACHE_DURATION_MINUTES = 5;

export async function getCachedDiagnosis(stockCode: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('ai_cache')
      .select('diagnosis_result, expiry_date, hit_count')
      .eq('stock_code', stockCode)
      .maybeSingle();

    if (error || !data) return null;

    const now = new Date();
    const expiryDate = new Date(data.expiry_date);

    if (now > expiryDate) {
      await supabase.from('ai_cache').delete().eq('stock_code', stockCode);
      return null;
    }

    await supabase
      .from('ai_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('stock_code', stockCode);

    return data.diagnosis_result;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

export async function setCachedDiagnosis(stockCode: string, diagnosis: string): Promise<void> {
  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CACHE_DURATION_DAYS);

    await supabase.from('ai_cache').upsert({
      stock_code: stockCode,
      diagnosis_result: diagnosis,
      cache_timestamp: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      hit_count: 0,
    });
  } catch (error) {
    console.error('Cache storage error:', error);
  }
}

export async function clearCache(stockCode?: string): Promise<void> {
  try {
    if (stockCode) {
      await supabase.from('ai_cache').delete().eq('stock_code', stockCode);
    } else {
      await supabase.from('ai_cache').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (error) {
    console.error('Cache clearing error:', error);
    throw error;
  }
}

export async function getCachedStockData(stockCode: string): Promise<StockData | null> {
  try {
    const { data, error } = await supabase
      .from('ai_cache')
      .select('stock_data, cache_timestamp')
      .eq('stock_code', stockCode)
      .maybeSingle();

    if (error || !data || !data.stock_data) return null;

    const cacheTime = new Date(data.cache_timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60);

    if (diffMinutes > STOCK_CACHE_DURATION_MINUTES) {
      return null;
    }

    return data.stock_data as StockData;
  } catch (error) {
    console.error('Stock cache retrieval error:', error);
    return null;
  }
}

export async function setCachedStockData(stockCode: string, stockData: StockData): Promise<void> {
  try {
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + STOCK_CACHE_DURATION_MINUTES);

    await supabase.from('ai_cache').upsert({
      stock_code: stockCode,
      stock_data: stockData as any,
      cache_timestamp: new Date().toISOString(),
      expiry_date: expiryDate.toISOString(),
      hit_count: 0,
    }, {
      onConflict: 'stock_code'
    });
  } catch (error) {
    console.error('Stock cache storage error:', error);
  }
}
