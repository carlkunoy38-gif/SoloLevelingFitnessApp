'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BudgetAnalysis } from '@/types';
import { formatKr } from '@/lib/utils';

const STATUS_COLORS = { ok: '#10b981', høj: '#f59e0b', kritisk: '#ef4444' };

interface BudgetChartProps {
  analysis: BudgetAnalysis;
}

export function BudgetBarChart({ analysis }: BudgetChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = analysis.kategoriFordeling
    .filter((k) => k.beløb > 0)
    .sort((a, b) => b.beløb - a.beløb)
    .map((k) => ({
      name: k.kategori.charAt(0).toUpperCase() + k.kategori.slice(1),
      beløb: Math.round(k.beløb),
      status: k.status,
      procent: k.procentAfIndkomst.toFixed(1),
    }));

  return (
    <div
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.recharts-bar-rectangle')) {
          setActiveIndex(null);
        }
      }}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
          onClick={(state) => {
            const idx = state?.activeTooltipIndex;
            setActiveIndex(idx !== undefined ? (idx === activeIndex ? null : idx) : null);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            angle={-40}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(v, _name, props) => [
              `${formatKr(Number(v))} (${props.payload?.procent}% af indkomst)`,
              'Beløb',
            ]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
            cursor={{ fill: 'rgba(148,163,184,0.1)' }}
            defaultIndex={activeIndex ?? undefined}
          />
          <Bar dataKey="beløb" radius={[6, 6, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
