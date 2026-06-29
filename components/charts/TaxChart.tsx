'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TaxCalculationResult } from '@/types';
import { formatKr } from '@/lib/utils';

const COLORS = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#ef4444','#10b981'];

export function TaxPieChart({ result }: { result: TaxCalculationResult }) {
  const data = [
    { name: 'Nettoindkomst', value: Math.round(result.nettoIndkomst) },
    { name: 'AM-bidrag', value: Math.round(result.amBidrag) },
    { name: 'Bundskat', value: Math.round(result.bundskat) },
    { name: 'Kommuneskat', value: Math.round(result.kommuneskat) },
    ...(result.kirkeskat > 0 ? [{ name: 'Kirkeskat', value: Math.round(result.kirkeskat) }] : []),
    ...(result.topskat > 0 ? [{ name: 'Topskat', value: Math.round(result.topskat) }] : []),
  ].filter(d => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
          {data.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => formatKr(Number(v))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
