'use client';

import type { TaxCalculationResult, BudgetAnalysis } from '@/types';
import { formatKr } from '@/lib/utils';

interface StatusBannerProps {
  tax: TaxCalculationResult | null;
  budget: BudgetAnalysis | null;
}

export function StatusBanner({ tax, budget }: StatusBannerProps) {
  if (!tax) return null;

  type Status = 'green' | 'yellow' | 'red';
  let status: Status = 'green';
  let emoji = '🟢';
  let headline = '';
  let detail = '';

  if (!budget) {
    status = 'yellow';
    emoji = '🟡';
    headline = `Du har ${formatKr(tax.nettoIndkomst)} til rådighed efter skat`;
    detail = 'Tilføj dit budget for at se rådighedsbeløb og opsparingsrate.';
  } else {
    const { rådighedsbeløb, opsparingsrate, gældsgrad, nødopsparingDækning } = budget;
    if (rådighedsbeløb < 0) {
      status = 'red'; emoji = '🔴';
      headline = `Du bruger ${formatKr(Math.abs(rådighedsbeløb))} mere end du tjener`;
      detail = 'Reducer udgifterne eller øg indkomsten – dit budget er i minus.';
    } else if (opsparingsrate < 5 || gældsgrad > 40 || nødopsparingDækning < 1) {
      status = 'yellow'; emoji = '🟡';
      headline = 'Din økonomi kræver opmærksomhed';
      detail = `Opsparingsrate: ${opsparingsrate.toFixed(0)}% · Nødopsparing: ${nødopsparingDækning.toFixed(1)} mdr. · Gæld: ${gældsgrad.toFixed(0)}% af indkomst`;
    } else {
      headline = 'Din økonomi ser sund ud!';
      detail = `Du sparer ${opsparingsrate.toFixed(0)}% og har ${formatKr(rådighedsbeløb)} til overs hver måned.`;
    }
  }

  const styles = { green: 'bg-emerald-50 border-emerald-200', yellow: 'bg-amber-50 border-amber-200', red: 'bg-red-50 border-red-200' };
  const textStyles = { green: 'text-emerald-900', yellow: 'text-amber-900', red: 'text-red-900' };

  return (
    <div className={`rounded-2xl border px-4 py-3.5 flex items-start gap-3 ${styles[status]}`}>
      <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
      <div className={textStyles[status]}>
        <p className="font-semibold text-sm">{headline}</p>
        <p className="text-xs opacity-75 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
