'use client';

import type { TaxCalculationResult, BudgetAnalysis } from '@/types';
import { formatKr } from '@/lib/utils';

interface StatusBannerProps {
  tax: TaxCalculationResult | null;
  budget: BudgetAnalysis | null;
  onGoToBudget?: () => void;
  onGoToIncome?: () => void;
}

export function StatusBanner({ tax, budget, onGoToBudget, onGoToIncome }: StatusBannerProps) {
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
      status = 'red';
      emoji = '🔴';
      headline = `Du bruger ${formatKr(Math.abs(rådighedsbeløb))} mere end du tjener`;
      detail = 'Reducer udgifterne eller øg indkomsten – dit budget er i minus.';
    } else if (opsparingsrate < 5 || gældsgrad > 40 || nødopsparingDækning < 1) {
      status = 'yellow';
      emoji = '🟡';
      headline = 'Din økonomi kræver opmærksomhed';
      detail = `Opsparingsrate: ${opsparingsrate.toFixed(0)}% · Nødopsparing: ${nødopsparingDækning.toFixed(1)} mdr. · Gæld: ${gældsgrad.toFixed(0)}% af indkomst`;
    } else {
      status = 'green';
      emoji = '🟢';
      headline = `Din økonomi ser sund ud!`;
      detail = `Du sparer ${opsparingsrate.toFixed(0)}% og har ${formatKr(rådighedsbeløb)} til overs hver måned.`;
    }
  }

  const styles: Record<Status, string> = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    yellow: 'bg-amber-50 border-amber-200 text-amber-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  const hoverStyles: Record<Status, string> = {
    green: 'hover:bg-emerald-100 hover:border-emerald-300',
    yellow: 'hover:bg-amber-100 hover:border-amber-300',
    red: 'hover:bg-red-100 hover:border-red-300',
  };

  const onClick = status === 'green' ? undefined : !budget ? onGoToIncome : onGoToBudget;

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left rounded-2xl border px-4 py-3.5 flex items-start gap-3 transition-colors ${styles[status]} ${hoverStyles[status]}`}
      >
        <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm">{headline}</p>
          <p className="text-xs opacity-75 mt-0.5">{detail}</p>
        </div>
        <span className="text-xs font-semibold opacity-60 mt-0.5 shrink-0">Ret det →</span>
      </button>
    );
  }

  return (
    <div className={`rounded-2xl border px-4 py-3.5 flex items-start gap-3 ${styles[status]}`}>
      <span className="text-xl shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="font-semibold text-sm">{headline}</p>
        <p className="text-xs opacity-75 mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
