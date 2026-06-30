import { NextResponse } from 'next/server';

interface Quote {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
}

async function fetchYahoo(symbol: string, currency = 'USD'): Promise<Omit<Quote, 'symbol' | 'name' | 'currency'>> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FinanceApp/1.0)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });
    if (!res.ok) return { price: null, change: null, changePct: null };
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return { price: null, change: null, changePct: null };
    const price: number | null = meta.regularMarketPrice ?? null;
    const prev: number | null = meta.chartPreviousClose ?? meta.previousClose ?? null;
    const change = price !== null && prev !== null ? price - prev : null;
    const changePct = change !== null && prev ? (change / prev) * 100 : null;
    return { price, change, changePct };
  } catch {
    return { price: null, change: null, changePct: null };
  }
}

export async function GET() {
  const [sp500, c25, msciWorld, oblig] = await Promise.all([
    fetchYahoo('^GSPC', 'USD'),
    fetchYahoo('^OMXC25', 'DKK'),
    fetchYahoo('IWDA.AS', 'EUR'),
    fetchYahoo('^TNX', 'USD'),
  ]);

  const quotes: Quote[] = [
    { symbol: '^OMXC25', name: 'C25 – Danmark', currency: 'DKK', ...c25 },
    { symbol: '^GSPC', name: 'S&P 500 – USA', currency: 'USD', ...sp500 },
    { symbol: 'IWDA.AS', name: 'MSCI World ETF', currency: 'EUR', ...msciWorld },
    { symbol: '^TNX', name: '10-årig US rente', currency: '%', ...oblig },
  ];

  return NextResponse.json({
    quotes,
    timestamp: new Date().toISOString(),
  });
}
