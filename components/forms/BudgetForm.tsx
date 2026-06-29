'use client';

import { useState } from 'react';
import type { BudgetData, BudgetCategory, BudgetKategori } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { Plus, Trash2 } from 'lucide-react';
import { formatKr } from '@/lib/utils';

const KATEGORI_LABELS: Record<BudgetKategori, string> = {
  bolig: 'Bolig',
  mad: 'Mad & dagligvarer',
  transport: 'Transport',
  forsikring: 'Forsikring',
  abonnementer: 'Abonnementer',
  gæld: 'Gæld',
  opsparing: 'Opsparing',
  investering: 'Investering',
  forbrug: 'Forbrug',
  andet: 'Andet',
};

const KATEGORI_FARVER: Record<BudgetKategori, string> = {
  bolig: 'bg-blue-100 text-blue-700',
  mad: 'bg-emerald-100 text-emerald-700',
  transport: 'bg-purple-100 text-purple-700',
  forsikring: 'bg-slate-100 text-slate-700',
  abonnementer: 'bg-pink-100 text-pink-700',
  gæld: 'bg-red-100 text-red-700',
  opsparing: 'bg-teal-100 text-teal-700',
  investering: 'bg-indigo-100 text-indigo-700',
  forbrug: 'bg-orange-100 text-orange-700',
  andet: 'bg-gray-100 text-gray-700',
};

interface BudgetFormProps {
  defaultValues?: BudgetData;
  nettoIndkomst: number;
  onSubmit: (data: BudgetData) => void;
}

const inputCls = 'rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500';

export function BudgetForm({ defaultValues, nettoIndkomst, onSubmit }: BudgetFormProps) {
  const [kategorier, setKategorier] = useState<BudgetCategory[]>(
    defaultValues?.kategorier ?? [
      { navn: 'Husleje/boliglån', beløb: 0, type: 'fast', kategori: 'bolig' },
      { navn: 'El, vand, varme', beløb: 0, type: 'fast', kategori: 'bolig' },
      { navn: 'Mad og dagligvarer', beløb: 0, type: 'variabel', kategori: 'mad' },
      { navn: 'Transport', beløb: 0, type: 'variabel', kategori: 'transport' },
      { navn: 'Forsikringer', beløb: 0, type: 'fast', kategori: 'forsikring' },
      { navn: 'Abonnementer', beløb: 0, type: 'fast', kategori: 'abonnementer' },
      { navn: 'Gældsydelser', beløb: 0, type: 'fast', kategori: 'gæld' },
      { navn: 'Opsparing', beløb: 0, type: 'fast', kategori: 'opsparing' },
      { navn: 'Investering', beløb: 0, type: 'fast', kategori: 'investering' },
      { navn: 'Diverse forbrug', beløb: 0, type: 'variabel', kategori: 'forbrug' },
    ]
  );

  const [nyNavn, setNyNavn] = useState('');
  const [nyKategori, setNyKategori] = useState<BudgetKategori>('andet');
  const [nyType, setNyType] = useState<'fast' | 'variabel'>('fast');

  const totalUdgifter = kategorier.reduce((s, k) => s + (k.beløb || 0), 0);
  const rådighedsbeløb = nettoIndkomst - totalUdgifter;

  function updateBeløb(idx: number, value: number) {
    setKategorier((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], beløb: value };
      return next;
    });
  }

  function updateNavn(idx: number, value: string) {
    setKategorier((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], navn: value };
      return next;
    });
  }

  function removeKategori(idx: number) {
    setKategorier((prev) => prev.filter((_, i) => i !== idx));
  }

  function addKategori() {
    if (!nyNavn.trim()) return;
    setKategorier((prev) => [
      ...prev,
      { navn: nyNavn.trim(), beløb: 0, type: nyType, kategori: nyKategori },
    ]);
    setNyNavn('');
  }

  return (
    <div className="space-y-5">
      {/* Live totals */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
          <p className="text-xs text-blue-600 font-medium">Nettoindkomst</p>
          <p className="text-lg font-bold text-blue-700">{formatKr(nettoIndkomst)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-xs text-slate-500 font-medium">Total udgifter</p>
          <p className="text-lg font-bold text-slate-700">{formatKr(totalUdgifter)}</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${rådighedsbeløb >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <p className={`text-xs font-medium ${rådighedsbeløb >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Rådighedsbeløb</p>
          <p className={`text-lg font-bold ${rådighedsbeløb >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatKr(rådighedsbeløb)}</p>
        </div>
      </div>

      {/* Kategori-rows */}
      <div className="space-y-2">
        {kategorier.map((k, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2">
            <span className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium ${KATEGORI_FARVER[k.kategori]}`}>
              {KATEGORI_LABELS[k.kategori]}
            </span>
            <input
              value={k.navn}
              onChange={(e) => updateNavn(idx, e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm text-slate-700 focus:outline-none"
              placeholder="Navn"
            />
            <span className="text-xs text-slate-400 shrink-0">{k.type === 'fast' ? 'Fast' : 'Var.'}</span>
            <input
              type="number"
              value={k.beløb || ''}
              onChange={(e) => updateBeløb(idx, Number(e.target.value))}
              className={`${inputCls} w-28 text-right`}
              placeholder="0"
              min="0"
            />
            <span className="text-xs text-slate-400 shrink-0">kr./mdr.</span>
            <button
              onClick={() => removeKategori(idx)}
              className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Tilføj ny post */}
      <div className="rounded-xl border border-dashed border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-600 mb-3">Tilføj udgift</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <input
            value={nyNavn}
            onChange={(e) => setNyNavn(e.target.value)}
            className={`${inputCls} col-span-2 md:col-span-1`}
            placeholder="Navn (fx Netflix)"
          />
          <select value={nyKategori} onChange={(e) => setNyKategori(e.target.value as BudgetKategori)} className={inputCls}>
            {Object.entries(KATEGORI_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={nyType} onChange={(e) => setNyType(e.target.value as 'fast' | 'variabel')} className={inputCls}>
            <option value="fast">Fast</option>
            <option value="variabel">Variabel</option>
          </select>
          <button
            type="button"
            onClick={addKategori}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-1.5 px-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tilføj
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tooltip content="Nødopsparing bør dække 3-6 måneders udgifter. Er du dækket?" />
        <p className="text-xs text-slate-500">Husk at inkludere opsparing i budgettet (anbefalet: min. 10% af nettoindkomst)</p>
      </div>

      <button
        type="button"
        onClick={() => onSubmit({ kategorier })}
        className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
      >
        Gem budget og analyser
      </button>
    </div>
  );
}
