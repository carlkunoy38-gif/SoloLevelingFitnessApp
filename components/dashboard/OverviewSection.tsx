'use client';

import type { TaxCalculationResult, BudgetAnalysis } from '@/types';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { formatKr, formatPct } from '@/lib/utils';
import {
  DollarSign,
  Wallet,
  PiggyBank,
  TrendingDown,
  ArrowRight,
  Download,
} from 'lucide-react';

interface OverviewSectionProps {
  taxResult: TaxCalculationResult | null;
  budgetAnalysis: BudgetAnalysis | null;
  onGoToIncome: () => void;
  onGoToBudget: () => void;
  onGoToInvestment: () => void;
  onExportCSVTax: () => void;
  onExportCSVBudget: () => void;
}

export function OverviewSection({
  taxResult,
  budgetAnalysis,
  onGoToIncome,
  onGoToBudget,
  onGoToInvestment,
  onExportCSVTax,
  onExportCSVBudget,
}: OverviewSectionProps) {
  if (!taxResult) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Velkommen til din økonomiapp</h2>
          <p className="text-blue-100 max-w-xl leading-relaxed">
            Få overblik over din skat, budget og investeringsmuligheder baseret på Skattestyrelsens
            officielle satser for 2025. Start med at indtaste din indkomst.
          </p>
          <button
            onClick={onGoToIncome}
            className="mt-5 flex items-center gap-2 rounded-xl bg-white text-blue-700 px-5 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
          >
            Kom i gang <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Skatteestimat',
              desc: 'AM-bidrag, bundskat, kommuneskat og topskat baseret på Skattestyrelsens 2025-satser.',
              icon: <DollarSign className="w-6 h-6 text-blue-500" />,
              onClick: onGoToIncome,
            },
            {
              title: 'Budgetmotor',
              desc: 'Kategorisér udgifter, beregn rådighedsbeløb og få konkrete optimeringsforslag.',
              icon: <Wallet className="w-6 h-6 text-emerald-500" />,
              onClick: onGoToBudget,
            },
            {
              title: 'Investeringsscenarier',
              desc: 'Simulér investering over tid med lav, middel og høj risikoprofil.',
              icon: <PiggyBank className="w-6 h-6 text-indigo-500" />,
              onClick: onGoToInvestment,
            },
          ].map((f) => (
            <button
              key={f.title}
              onClick={f.onClick}
              className="text-left rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-blue-700">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
                Start <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>

        <Alert type="info" title="Om denne app">
          Alle beregninger er estimater. Den endelige skat fastsættes af Skattestyrelsen via din
          forskudsopgørelse og årsopgørelse. Investeringsscenarier er ikke personlig investeringsrådgivning.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hoved-stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Bruttoindkomst"
          value={formatKr(taxResult.bruttoIndkomst)}
          subtitle="pr. måned"
          icon={<DollarSign className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          label="Nettoindkomst"
          value={formatKr(taxResult.nettoIndkomst)}
          subtitle={`Effektiv skat: ${formatPct(taxResult.effektivSkatteprocent)}`}
          icon={<DollarSign className="w-4 h-4" />}
          color="green"
        />
        {budgetAnalysis && (
          <>
            <StatCard
              label="Rådighedsbeløb"
              value={formatKr(budgetAnalysis.rådighedsbeløb)}
              subtitle="efter udgifter"
              icon={<Wallet className="w-4 h-4" />}
              color={budgetAnalysis.rådighedsbeløb >= 0 ? 'green' : 'red'}
            />
            <StatCard
              label="Opsparingsrate"
              value={formatPct(budgetAnalysis.opsparingsrate)}
              subtitle={budgetAnalysis.opsparingsrate >= 20 ? 'Fremragende' : budgetAnalysis.opsparingsrate >= 10 ? 'God' : 'Lav – bør øges'}
              icon={<PiggyBank className="w-4 h-4" />}
              color={budgetAnalysis.opsparingsrate >= 20 ? 'green' : budgetAnalysis.opsparingsrate >= 10 ? 'blue' : 'red'}
            />
          </>
        )}
      </div>

      {/* Hurtigoversigt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Skattesammendrag */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skatteestimat (månedlig)</CardTitle>
              <div className="flex gap-2">
                <button onClick={onExportCSVTax} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  <Download className="w-3 h-3" /> CSV
                </button>
                <button onClick={onGoToIncome} className="text-xs text-slate-400 hover:text-blue-600">
                  Rediger →
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Bruttoindkomst', value: formatKr(taxResult.bruttoIndkomst), cls: 'text-slate-700' },
                { label: 'AM-bidrag', value: `-${formatKr(taxResult.amBidrag)}`, cls: 'text-red-500' },
                { label: 'Bundskat + Kommuneskat', value: `-${formatKr(taxResult.bundskat + taxResult.kommuneskat)}`, cls: 'text-red-500' },
                taxResult.topskat > 0 ? { label: 'Topskat', value: `-${formatKr(taxResult.topskat)}`, cls: 'text-red-500' } : null,
              ].filter(Boolean).map((row) => row && (
                <div key={row.label} className="flex justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className={`font-medium ${row.cls}`}>{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t border-slate-100 text-base">
                <span>Nettoindkomst</span>
                <span className="text-emerald-600">{formatKr(taxResult.nettoIndkomst)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget sammendrag */}
        {budgetAnalysis ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budgetstatus</CardTitle>
                <div className="flex gap-2">
                  <button onClick={onExportCSVBudget} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                  <button onClick={onGoToBudget} className="text-xs text-slate-400 hover:text-blue-600">
                    Rediger →
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Nettoindkomst', value: formatKr(budgetAnalysis.totalIndkomst), cls: 'text-blue-600' },
                  { label: 'Faste udgifter', value: `-${formatKr(budgetAnalysis.fasteUdgifter)}`, cls: 'text-slate-600' },
                  { label: 'Variable udgifter', value: `-${formatKr(budgetAnalysis.variableUdgifter)}`, cls: 'text-slate-600' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-slate-500">{row.label}</span>
                    <span className={`font-medium ${row.cls}`}>{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t border-slate-100 text-base">
                  <span>Rådighedsbeløb</span>
                  <span className={budgetAnalysis.rådighedsbeløb >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {formatKr(budgetAnalysis.rådighedsbeløb)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-400">Gældsgrad</p>
                  <p className="font-bold text-slate-700">{formatPct(budgetAnalysis.gældsgrad)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-400">Nødopsparing</p>
                  <p className="font-bold text-slate-700">{budgetAnalysis.nødopsparingDækning.toFixed(1)} mdr.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <button
            onClick={onGoToBudget}
            className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
          >
            <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-3 group-hover:text-emerald-400" />
            <p className="font-medium text-slate-500 group-hover:text-emerald-700">Tilføj budget</p>
            <p className="text-xs text-slate-400 mt-1">Beregn rådighedsbeløb og opsparingsrate</p>
          </button>
        )}
      </div>

      {/* Advarsler fra budget */}
      {budgetAnalysis?.optimeringer.filter((o) => o.prioritet === 'høj').map((opt, i) => (
        <Alert key={i} type={opt.kategori === 'gæld' ? 'danger' : 'warning'}>
          {opt.beskrivelse}
        </Alert>
      ))}

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onGoToIncome}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <DollarSign className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-sm font-medium text-slate-700">Opdater indkomst</p>
          <p className="text-xs text-slate-400">Ændr løn eller trækprocent</p>
        </button>
        <button
          onClick={onGoToBudget}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-emerald-300 hover:shadow-sm transition-all"
        >
          <Wallet className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-slate-700">Rediger budget</p>
          <p className="text-xs text-slate-400">Tilpas udgifter og opsparing</p>
        </button>
        <button
          onClick={onGoToInvestment}
          className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <TrendingDown className="w-5 h-5 text-indigo-500 mb-2" />
          <p className="text-sm font-medium text-slate-700">Investeringsplan</p>
          <p className="text-xs text-slate-400">Simulér vækst over tid</p>
        </button>
      </div>
    </div>
  );
}
