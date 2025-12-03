import axios from 'axios';
import * as cheerio from 'cheerio';

export interface StockData {
  basic: {
    code: string;
    name: string;
    exchange: string;
    category: string;
    sector: string;
  };
  current: {
    price: number;
    change: number;
    changePercent: number;
    performance: string;
    updateTime: string;
  };
  range: {
    week52High: { price: number; date: string };
    week52Low: { price: number; date: string };
    yearHigh: { price: number; date: string };
    yearLow: { price: number; date: string };
  };
  historical: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
}

function cleanNumber(text: string): number {
  const cleaned = text
    .replace(/,/g, '')
    .replace(/円|株|%/g, '')
    .replace(/\+/g, '')
    .trim();
  return parseFloat(cleaned) || 0;
}

function extractDateFromParentheses(text: string): string {
  const match = text.match(/\((\d{2})\/(\d{2})\/(\d{2})\)/);
  if (match) {
    const [, year, month, day] = match;
    return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return text.trim();
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length === 2) {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  return dateStr;
}

async function fetchWithRetry(url: string, retries = 3): Promise<string> {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];

  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': userAgents[i % userAgents.length],
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://s.kabutan.jp/',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Cache-Control': 'max-age=0',
        },
        timeout: 15000,
        maxRedirects: 5,
      });

      return response.data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error instanceof Error ? error.message : 'Unknown error');
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }

  throw new Error('All retry attempts failed');
}

export async function scrapeStockData(stockCode: string): Promise<StockData> {
  try {
    const url = `https://s.kabutan.jp/stocks/${stockCode}/historical_prices/daily/`;
    console.log(`Fetching stock data for ${stockCode} from ${url}`);

    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    const basicInfo = $('div.flex.justify-between.mx-2.mt-4.text-md.text-gray-700').first();
    const codeExchangeText = basicInfo.find('div').first().text().trim();
    const codeMatch = codeExchangeText.match(/(\d+)/);
    const exchangeMatch = codeExchangeText.match(/東証[A-Z]+|名証|札証|福証/);
    const categoryMatch = codeExchangeText.match(/貸借|制度信用|信用/);

    const sectorLink = basicInfo.find('a.link-primary[href*="/sectors/"]');
    const sector = sectorLink.text().trim() || 'N/A';

    const favoriteStockDiv = $('div[data-controller="stocks--favorite-stock"]').first();
    const name = favoriteStockDiv.attr('data-stocks--favorite-stock-name-value') || 'Unknown';
    const priceValue = favoriteStockDiv.attr('data-stocks--favorite-stock-price-value') || '0';

    const priceDiv = $('div.flex.justify-between.items-center.mx-2');
    const currentPriceText = priceDiv.find('div.text-3xl.flex').text().trim();
    const currentPrice = cleanNumber(currentPriceText || priceValue);

    const changeDiv = priceDiv.find('div.text-right').first();
    const changeText = changeDiv.find('div').first().find('span').first().text().trim();
    const change = cleanNumber(changeText);

    const changePercentText = changeDiv.find('div.text-md span').first().text().trim();
    const changePercent = cleanNumber(changePercentText);

    const performanceIcon = priceDiv.find('i.fa-arrow-up-right, i.fa-arrow-down-right');
    const performance = performanceIcon.hasClass('fa-arrow-up-right') ? 'up' :
                       performanceIcon.hasClass('fa-arrow-down-right') ? 'down' : 'neutral';

    const updateTimeText = priceDiv.find('div.text-right.text-2xs.leading-4.text-slate-500').text().trim();
    const updateTime = updateTimeText.replace(/[()]/g, '');

    const tables = $('table.w-full.text-xs');
    let week52High = { price: 0, date: '' };
    let week52Low = { price: 0, date: '' };
    let yearHigh = { price: 0, date: '' };
    let yearLow = { price: 0, date: '' };

    tables.each((i, table) => {
      const $table = $(table);
      const headers = $table.find('thead tr th, tbody tr th').map((_, el) => $(el).text().trim()).get();

      if (headers.includes('52週高値') && headers.includes('52週安値')) {
        const cells = $table.find('tbody tr td');
        const highText = $(cells[0]).text().trim();
        const lowText = $(cells[1]).text().trim();

        week52High = {
          price: cleanNumber(highText.split('(')[0]),
          date: extractDateFromParentheses(highText)
        };
        week52Low = {
          price: cleanNumber(lowText.split('(')[0]),
          date: extractDateFromParentheses(lowText)
        };
      }

      if (headers.includes('年初来高値') && headers.includes('年初来安値')) {
        const cells = $table.find('tbody tr td');
        const highText = $(cells[0]).text().trim();
        const lowText = $(cells[1]).text().trim();

        yearHigh = {
          price: cleanNumber(highText.split('(')[0]),
          date: extractDateFromParentheses(highText)
        };
        yearLow = {
          price: cleanNumber(lowText.split('(')[0]),
          date: extractDateFromParentheses(lowText)
        };
      }
    });

    const historical: StockData['historical'] = [];
    const historicalTable = $('#historical-price-table table tbody tr');

    historicalTable.each((i, row) => {
      const $row = $(row);
      const cells = $row.find('th, td');

      if (cells.length >= 8) {
        const date = formatDate($(cells[0]).text().trim());
        const open = cleanNumber($(cells[1]).text());
        const high = cleanNumber($(cells[2]).text());
        const low = cleanNumber($(cells[3]).text());
        const close = cleanNumber($(cells[4]).text());
        const change = cleanNumber($(cells[5]).text());
        const changePercent = cleanNumber($(cells[6]).text());
        const volume = cleanNumber($(cells[7]).text());

        historical.push({
          date,
          open,
          high,
          low,
          close,
          change,
          changePercent,
          volume,
        });
      }
    });

    console.log(`Successfully scraped data for ${stockCode}: ${name}, Price: ${currentPrice}, Historical records: ${historical.length}`);

    return {
      basic: {
        code: stockCode,
        name,
        exchange: exchangeMatch ? exchangeMatch[0] : 'N/A',
        category: categoryMatch ? categoryMatch[0] : 'N/A',
        sector,
      },
      current: {
        price: currentPrice,
        change,
        changePercent,
        performance,
        updateTime,
      },
      range: {
        week52High,
        week52Low,
        yearHigh,
        yearLow,
      },
      historical,
    };
  } catch (error) {
    console.error('Stock scraping error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data?.substring(0, 500));
    }
    throw new Error(`Failed to fetch stock data for ${stockCode}`);
  }
}
