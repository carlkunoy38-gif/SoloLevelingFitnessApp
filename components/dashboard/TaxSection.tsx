'use client';

import { TaxCalculationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { StatCard } from '@/components/ui/stat-card';
import { TaxPieChart } from '@/components/charts/TaxChart';
import { formatKr, formatPct } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { DollarSign, TrendingDown, Percent } from 'lucide-react';

interface TaxSectionProps {
  result: TaxCalculationResult;
}

const ROW_CLS = 'flex justify-between items-center py-2 border-b border-slate-50 last:border-0';
const LABEL_CLS = 'text-sm text-slate-500';
const VALUE_CLS = 'text-sm font-semibold text-slate-800';
const NEG_CLS = 'text-sm font-semibold text-red-600';

export function TaxSection({ result }: TaxSectionProps) {
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Bruttoindkomst"
          value={formatKr(result.bruttoIndkomst)}
          subtitle="pr. måned"
          icon={<DollarSign className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          label="AM-bidrag (8%)"
          value={`-${formatKr(result.amBidrag)}`}
          subtitle="arbejdsmarkedsbidrag"
          icon={<TrendingDown className="w-4 h-4" />}
          color="yellow"
        />
        <StatCard
          label="Nettoindkomst"
          value={formatKr(result.nettoIndkomst)}
          subtitle="pr. måned efter skat"
          icon={<DollarSign className="w-4 h-4" />}
          color="green"
        />
        <StatCard
          label="Effektiv skat"
          value={formatPct(result.effektivSkatteprocent)}
          subtitle={`Marginalskat: ${formatPct(result.marginalSkatteprocent)}`}
          icon={<Percent className="w-4 h-4" />}
          color="red"
        />
      </div>

      {/* Detaljer + Pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Skatteberegning pr. måned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>Bruttoindkomst</span>
                <span className={VALUE_CLS}>{formatKr(result.bruttoIndkomst)}</span>
              </div>
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>
                  <Tooltip content="8% af bruttoindkomst. Betales af alle lønmodtagere.">AM-bidrag</Tooltip>
                </span>
                <span className={NEG_CLS}>-{formatKr(result.amBidrag)}</span>
              </div>
              <div className={`${ROW_CLS} bg-slate-50 rounded-lg px-2`}>
                <span className="text-sm font-medium text-slate-700">Personlig indkomst</span>
                <span className="text-sm font-semibold text-slate-800">{formatKr(result.personligIndkomst)}</span>
              </div>
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>
                  <Tooltip content="Personfradrag 4.142 kr./mdr. (2025) – der betales ingen skat af dette beløb.">Personfradrag</Tooltip>
                </span>
                <span className="text-sm font-semibold text-emerald-600">-{formatKr(result.personfradrag)}</span>
              </div>
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>
                  <Tooltip content="Op til 45.100 kr./år (2025), 10,75% af personlig indkomst. Gives automatisk for lønnede.">Beskæftigelsesfradrag</Tooltip>
                </span>
                <span className="text-sm font-semibold text-emerald-600">-{formatKr(result.beskæftigelsesfradrag)}</span>
              </div>
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>
                  <Tooltip content="12,64% af personlig indkomst minus personfradrag og pension (2025).">Bundskat</Tooltip>
                </span>
                <span className={NEG_CLS}>-{formatKr(result.bundskat)}</span>
              </div>
              <div className={ROW_CLS}>
                <span className={LABEL_CLS}>Kommuneskat</span>
                <span className={NEG_CLS}>-{formatKr(result.kommuneskat)}</span>
              </div>
              {result.kirkeskat > 0 && (
                <div className={ROW_CLS}>
                  <span className={LABEL_CLS}>Kirkeskat</span>
                  <span className={NEG_CLS}>-{formatKr(result.kirkeskat)}</span>
                </div>
              )}
              {result.topskat > 0 && (
                <div className={ROW_CLS}>
                  <span className={LABEL_CLS}>
                    <Tooltip content="15% af personlig indkomst over 588.900 kr./år (2025) = ca. 49.075 kr./mdr.">Topskat</Tooltip>
                  </span>
                  <span className={NEG_CLS}>-{formatKr(result.topskat)}</span>
                </div>
              )}
              <div className={`${ROW_CLS} border-t border-slate-200 pt-3 mt-1`}>
                <span className="text-base font-bold text-slate-800">Nettoindkomst</span>
                <span className="text-base font-bold text-emerald-600">{formatKr(result.nettoIndkomst)}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">Effektiv skatteprocent</p>
                <p className="text-xl font-bold text-slate-700">{formatPct(result.effektivSkatteprocent)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-xs text-slate-500">Marginalskat</p>
                <p className="text-xl font-bold text-slate-700">{formatPct(result.marginalSkatteprocent)}</p>
                <Tooltip content="Hvad du betaler i skat af den næste krone du tjener." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skattefordeling</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxPieChart result={result} />
          </CardContent>
        </Card>
      </div>

      <Alert type="warning" title="Vigtigt om skatteberegningen">
        Dette er et estimat baseret på Skattestyrelsens satser for 2025. Din faktiske skat beregnes i din
        <strong> forskudsopgørelse og årsopgørelse</strong> hos Skattestyrelsen (skat.dk).
        Beregningen tager ikke højde for alle individuelle forhold som fx kapitalindkomst, aktieindkomst
        eller særlige fradrag.
      </Alert>
    </div>
  );
}
