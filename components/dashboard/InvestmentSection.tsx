'use client';

import { useState } from 'react';
import type { InvestmentProfile, InvestmentScenario, InvestmentSimulation } from '@/types';
import { suggestInvestmentAllocation, simulateInvestmentGrowth, getAlleScenarier } from '@/lib/investment/allocation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { StatCard } from '@/components/ui/stat-card';
import { InvestmentAreaChart } from '@/components/charts/InvestmentChart';
import { Badge } from '@/components/ui/badge';
import { formatKr, formatPct } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { exportInvestmentToCSV } from '@/lib/export';

interface InvestmentSectionProps {
  profile: InvestmentProfile;
}

const RISIKO_COLOR = {
  lav: 'success',
  middel: 'info',
  høj: 'warning',
} as const;

const RISIKO_BORDER = {
  lav: 'border-emerald-300 bg-emerald-50',
  middel: 'border-blue-300 bg-blue-50',
  høj: 'border-orange-300 bg-orange-50',
};

export function InvestmentSection({ profile }: InvestmentSectionProps) {
  const alleScenarier = getAlleScenarier();
  const anbefalet = suggestInvestmentAllocation(profile);

  const [valtScenarie, setValtScenarie] = useState<InvestmentScenario>(anbefalet);
  const [gebyr, setGebyr] = useState(0.5);
  const [månedligtBeløb, setMånedligtBeløb] = useState(profile.månedligtOverskud || 1000);

  const simulation: InvestmentSimulation = simulateInvestmentGrowth(
    månedligtBeløb,
    profile.tidshorisont,
    valtScenarie,
    gebyr
  );

  const gevinst = simulation.slutværdiForventet - simulation.totalIndskudt;

  return (
    <div className="space-y-5">
      <Alert type="warning" title="Ikke investeringsrådgivning">
        Disse scenarier er udelukkende til information og udgør IKKE personlig investeringsrådgivning.
        Historiske afkast garanterer ikke fremtidige afkast. Konsultér en autoriseret investeringsrådgiver.
      </Alert>

      {/* Scenarievælger */}
      <div className="grid grid-cols-3 gap-3">
        {alleScenarier.map((s) => (
          <button
            key={s.navn}
            onClick={() => setValtScenarie(s)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${
              valtScenarie.navn === s.navn
                ? `${RISIKO_BORDER[s.risikoprofil]} border-2`
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-slate-800">{s.navn}</span>
              <Badge variant={RISIKO_COLOR[s.risikoprofil]}>
                {s.risikoprofil === 'lav' ? 'Lav risiko' : s.risikoprofil === 'middel' ? 'Middel' : 'Høj risiko'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Forventet: {s.forventetÅrligAfkastMin}–{s.forventetÅrligAfkastMax}% p.a.
            </p>
            {s.navn === anbefalet.navn && (
              <p className="text-xs text-emerald-600 font-medium mt-1">★ Anbefalet til dig</p>
            )}
          </button>
        ))}
      </div>

      {/* Valgt scenarie detaljer */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle>{valtScenarie.navn} – Fordeling</CardTitle>
            <Badge variant={RISIKO_COLOR[valtScenarie.risikoprofil]}>
              {valtScenarie.risikoprofil} risiko
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{valtScenarie.anbefaling}</p>
          <div className="space-y-3">
            {valtScenarie.fordeling.map((alloc, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 text-sm font-bold text-slate-700 shrink-0">{alloc.procent}%</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${alloc.procent}%` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{alloc.kategori}</p>
                  <p className="text-xs text-slate-500 truncate">{alloc.eksempler.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
          {valtScenarie.advarsler.length > 0 && (
            <div className="mt-4 space-y-1">
              {valtScenarie.advarsler.map((a, i) => (
                <p key={i} className="text-xs text-amber-700 flex gap-1.5">
                  <span>⚠</span> {a}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simulator */}
      <Card>
        <CardHeader>
          <CardTitle>Investeringssimulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Månedligt beløb (kr.)</label>
              <input
                type="number"
                value={månedligtBeløb}
                onChange={(e) => setMånedligtBeløb(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tidshorisont (år)</label>
              <input
                type="number"
                value={profile.tidshorisont}
                readOnly
                className="w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">ÅOP/Gebyr (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                value={gebyr}
                onChange={(e) => setGebyr(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="3"
              />
            </div>
          </div>

          <InvestmentAreaChart simulation={simulation} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <StatCard label="Total indskudt" value={formatKr(simulation.totalIndskudt)} color="slate" />
            <StatCard label="Forventet slutværdi" value={formatKr(simulation.slutværdiForventet)} color="blue" />
            <StatCard label="Forventet gevinst" value={formatKr(gevinst)} subtitle="ekskl. skat" color="green" />
            <StatCard
              label="Afkast"
              value={formatPct(simulation.totalIndskudt > 0 ? (gevinst / simulation.totalIndskudt) * 100 : 0)}
              subtitle={`${simulation.år} år, ${formatPct(gebyr)} gebyr p.a.`}
              icon={<TrendingUp className="w-4 h-4" />}
              color="green"
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Skattemæssig note:</strong> {simulation.skattemæssigNote}
            </p>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => exportInvestmentToCSV(simulation)}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Eksportér til CSV
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
