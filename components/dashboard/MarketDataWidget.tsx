'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface Quote {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  currency: string;
}

interface MarketData {
  quotes: Quote[];
  timestamp: string;
}

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return '—';
  if (currency === '%') return `${price.toFixed(2)}%`;
  return price.toLocaleString('da-DK', { maximumFractionDigits: 2 });
}

function formatChange(changePct: number | null): string {
  if (changePct === null) return '—';
  const sign = changePct >= 0 ? '+' : '';
  return `${sign}${changePct.toFixed(2)}%`;
}

export function MarketDataWidget() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastUpdated(new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Live markedsdata</h3>
          {lastUpdated && <p className="text-xs text-slate-400">Sidst opdateret: {lastUpdated}</p>}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && !data ? (
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl bg-slate-50 p-3 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-2/3 mb-2" />
              <div className="h-5 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {(data?.quotes ?? []).map(quote => {
            const up = (quote.changePct ?? 0) >= 0;
            const noData = quote.price === null;
            return (
              <div
                key={quote.symbol}
                className={`rounded-xl p-3 border ${
                  noData ? 'bg-slate-50 border-slate-100' :
                  up ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'
                }`}
              >
                <p className="text-xs text-slate-500 truncate">{quote.name}</p>
                <p className={`text-base font-bold mt-0.5 ${
                  noData ? 'text-slate-400' : up ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {formatPrice(quote.price, quote.currency)}
                  <span className="text-xs font-normal ml-1 text-slate-500">{quote.currency !== '%' ? quote.currency : ''}</span>
                </p>
                <div className={`flex items-center gap-0.5 text-xs font-medium mt-0.5 ${
                  noData ? 'text-slate-400' : up ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {!noData && (up
                    ? <TrendingUp className="w-3 h-3" />
                    : <TrendingDown className="w-3 h-3" />
                  )}
                  {formatChange(quote.changePct)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-300 mt-3 text-center">Data forsinket ~15 min · Ikke investeringsrådgivning</p>
    </div>
  );
}
