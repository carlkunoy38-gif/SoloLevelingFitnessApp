'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { InvestmentSimulation } from '@/types';
import { formatKr } from '@/lib/utils';

export function InvestmentAreaChart({ simulation }: { simulation: InvestmentSimulation }) {
  const data = simulation.simulationsData.map(d => ({
    'År': `År ${d.år}`,
    'Max scenarie': d.max,
    'Forventet': d.forventet,
    'Min scenarie': d.min,
    'Indskudt': d.indskudt,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
          <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
          <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="År" tick={{ fontSize: 11, fill: '#64748b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
        <Tooltip formatter={(v) => formatKr(Number(v))} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
        <Legend />
        <Area type="monotone" dataKey="Max scenarie" stroke="#6366f1" strokeWidth={1.5} fill="url(#maxGrad)" strokeDasharray="4 2" />
        <Area type="monotone" dataKey="Forventet" stroke="#3b82f6" strokeWidth={2.5} fill="url(#fGrad)" />
        <Area type="monotone" dataKey="Min scenarie" stroke="#10b981" strokeWidth={1.5} fill="url(#minGrad)" strokeDasharray="4 2" />
        <Area type="monotone" dataKey="Indskudt" stroke="#94a3b8" strokeWidth={1} fill="none" strokeDasharray="2 2" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
