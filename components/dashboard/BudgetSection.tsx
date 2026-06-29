'use client';

import type { BudgetAnalysis } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { StatCard } from '@/components/ui/stat-card';
import { BudgetBarChart } from '@/components/charts/BudgetChart';
import { formatKr, formatPct } from '@/lib/utils';
import { Wallet, PiggyBank, TrendingDown, Shield } from 'lucide-react';

interface BudgetSectionProps {
  analysis: BudgetAnalysis;
  onGoToBudgetForm?: () => void;
}

const PRIORITET_STYLES = {
  høj: 'danger',
  medium: 'warning',
  lav: 'info',
} as const;

const STATUS_MAP = {
  sund: { label: 'Sund økonomi', color: 'success' },
  advarsel: { label: 'Kræver opmærksomhed', color: 'warning' },
  kritisk: { label: 'Kritisk – tag handling nu', color: 'danger' },
} as const;

export function BudgetSection({ analysis, onGoToBudgetForm }: BudgetSectionProps) {
  const status = STATUS_MAP[analysis.budgetStatus];

  return (
    <div className="space-y-5">
      {/* Status banner */}
      <div className={`rounded-2xl p-4 flex items-center gap-3 ${
        analysis.budgetStatus === 'sund' ? 'bg-emerald-50 border border-emerald-200' :
        analysis.budgetStatus === 'advarsel' ? 'bg-amber-50 border border-amber-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <Shield className={`w-6 h-6 shrink-0 ${
          analysis.budgetStatus === 'sund' ? 'text-emerald-500' :
          analysis.budgetStatus === 'advarsel' ? 'text-amber-500' : 'text-red-500'
        }`} />
        <div>
          <p className={`font-semibold ${
            analysis.budgetStatus === 'sund' ? 'text-emerald-700' :
            analysis.budgetStatus === 'advarsel' ? 'text-amber-700' : 'text-red-700'
          }`}>{status.label}</p>
          <p className="text-xs text-slate-500">Baseret på dine budgetdata</p>
        </div>
        <Badge variant={status.color} className="ml-auto">{status.label}</Badge>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Rådighedsbeløb"
          value={formatKr(analysis.rådighedsbeløb)}
          subtitle="efter alle udgifter"
          icon={<Wallet className="w-4 h-4" />}
          color={analysis.rådighedsbeløb >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Opsparingsrate"
          value={formatPct(analysis.opsparingsrate)}
          subtitle={analysis.opsparingsrate >= 20 ? 'Fremragende' : analysis.opsparingsrate >= 10 ? 'God' : 'Lav'}
          icon={<PiggyBank className="w-4 h-4" />}
          color={analysis.opsparingsrate >= 20 ? 'green' : analysis.opsparingsrate >= 10 ? 'blue' : 'red'}
        />
        <StatCard
          label="Gældsgrad"
          value={formatPct(analysis.gældsgrad)}
          subtitle="af nettoindkomst"
          icon={<TrendingDown className="w-4 h-4" />}
          color={analysis.gældsgrad <= 20 ? 'green' : analysis.gældsgrad <= 35 ? 'yellow' : 'red'}
        />
        <StatCard
          label="Nødopsparing"
          value={`${analysis.nødopsparingDækning.toFixed(1)} mdr.`}
          subtitle={`Anbefalet: 3-6 mdr.`}
          icon={<Shield className="w-4 h-4" />}
          color={analysis.nødopsparingDækning >= 3 ? 'green' : analysis.nødopsparingDækning >= 1 ? 'yellow' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Oversigt */}
        <Card>
          <CardHeader>
            <CardTitle>Budgetoversigt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: 'Nettoindkomst', value: analysis.totalIndkomst, sign: '+', cls: 'text-blue-600' },
                { label: 'Faste udgifter', value: analysis.fasteUdgifter, sign: '-', cls: 'text-slate-700' },
                { label: 'Variable udgifter', value: analysis.variableUdgifter, sign: '-', cls: 'text-slate-700' },
              ].map(({ label, value, sign, cls }) => (
                <div key={label} className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className={`text-sm font-semibold ${cls}`}>{sign === '-' ? '-' : ''}{formatKr(value)}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-t-2 border-slate-200 mt-2">
                <span className="font-bold text-slate-800">Rådighedsbeløb</span>
                <span className={`text-lg font-bold ${analysis.rådighedsbeløb >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatKr(analysis.rådighedsbeløb)}
                </span>
              </div>
            </div>

            {analysis.nødopsparingDækning < 3 && onGoToBudgetForm && (
              <button
                onClick={onGoToBudgetForm}
                className="mt-4 w-full text-left rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 hover:bg-amber-100 hover:border-amber-300 transition-colors group"
              >
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ Din nødopsparing dækker kun {analysis.nødopsparingDækning.toFixed(1)} måneder.
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Prioritér at opbygge {formatKr(analysis.anbefaletNødopsparing - analysis.aktuelOpsparing)} mere.
                </p>
                <p className="text-xs font-semibold text-amber-700 mt-1.5 group-hover:underline">Ret det i budgettet →</p>
              </button>
            )}
            {analysis.nødopsparingDækning < 3 && !onGoToBudgetForm && (
              <Alert type="warning" className="mt-4">
                Din nødopsparing dækker kun {analysis.nødopsparingDækning.toFixed(1)} måneder.
                Prioritér at opbygge {formatKr(analysis.anbefaletNødopsparing - analysis.aktuelOpsparing)} mere.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Graf */}
        <Card>
          <CardHeader>
            <CardTitle>Udgiftsfordeling</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetBarChart analysis={analysis} />
            <p className="text-xs text-slate-400 mt-2">Grøn = ok, Gul = over anbefaling, Rød = kritisk</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimeringsforslag */}
      {analysis.optimeringer.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Anbefalede forbedringer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.optimeringer.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={onGoToBudgetForm}
                  disabled={!onGoToBudgetForm}
                  className={`w-full text-left rounded-xl p-4 border transition-all group ${
                    onGoToBudgetForm ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : 'cursor-default'
                  } ${
                    opt.prioritet === 'høj' ? 'bg-red-50 border-red-100 hover:border-red-300' :
                    opt.prioritet === 'medium' ? 'bg-amber-50 border-amber-100 hover:border-amber-300' :
                    'bg-blue-50 border-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-700 leading-relaxed flex-1">{opt.beskrivelse}</p>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${
                        opt.prioritet === 'høj' ? 'text-red-600' :
                        opt.prioritet === 'medium' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        Spar {formatKr(opt.besparelse)}/mdr.
                      </p>
                      <Badge variant={PRIORITET_STYLES[opt.prioritet]}>
                        {opt.prioritet === 'høj' ? 'Høj prioritet' : opt.prioritet === 'medium' ? 'Medium' : 'Lav prioritet'}
                      </Badge>
                    </div>
                  </div>
                  {onGoToBudgetForm && (
                    <p className={`text-xs font-semibold mt-2 group-hover:underline ${
                      opt.prioritet === 'høj' ? 'text-red-600' :
                      opt.prioritet === 'medium' ? 'text-amber-600' : 'text-blue-600'
                    }`}>Ret det i budgettet →</p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
