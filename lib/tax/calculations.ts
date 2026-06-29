// Skatteberegninger baseret på Skattestyrelsens officielle satser
// ADVARSEL: Disse beregninger er estimater. Faktisk skat afhænger af
// din forskudsopgørelse og årsopgørelse fra Skattestyrelsen.
// Kilde: https://skat.dk

import { TAX_RATES_2025, KOMMUNESKAT_2025, KIRKESKAT_2025 } from '@/data/tax-rates/2025';
import type { IncomeData, TaxCalculationResult } from '@/types';

const RATES = TAX_RATES_2025;

export function calculateAmBidrag(bruttoIndkomst: number): number {
  return bruttoIndkomst * RATES.amBidrag;
}

export function getKommuneskat(kommune: string): number {
  const sats = KOMMUNESKAT_2025[kommune];
  return sats ?? RATES.kommuneskatGennemsnit;
}

export function getKirkeskat(kommune: string): number {
  const sats = KIRKESKAT_2025[kommune];
  return sats ?? RATES.kirkeskatGennemsnit;
}

export function calculateBeskæftigelsesfradrag(personligIndkomstÅr: number): number {
  const fradrag = personligIndkomstÅr * RATES.beskæftigelsesfradragSats;
  return Math.min(fradrag, RATES.beskæftigelsesfradragMax);
}

export function calculateTaxEstimate(income: IncomeData): TaxCalculationResult {
  const { bruttoIndkomst, kommune, kirkeskat: harKirkeskat, andreFradrag } = income;

  const bruttoÅr = bruttoIndkomst * 12;

  const amBidragÅr = calculateAmBidrag(bruttoÅr);
  const personligIndkomstÅr = bruttoÅr - amBidragÅr;

  const pensionÅr = income.pensionType === 'procent'
    ? bruttoIndkomst * (income.pensionEgenAndel / 100) * 12
    : income.pensionEgenAndel * 12;

  const beskæftigelsesfradragÅr = calculateBeskæftigelsesfradrag(personligIndkomstÅr);
  const personfradragÅr = RATES.personfradrag;
  const andreFradragÅr = andreFradrag * 12;

  const skattepligtigIndkomstÅr = Math.max(
    0,
    personligIndkomstÅr - personfradragÅr - beskæftigelsesfradragÅr - andreFradragÅr - pensionÅr
  );

  const kommunesatsSats = getKommuneskat(kommune);
  const kirkeskatSats = harKirkeskat ? getKirkeskat(kommune) : 0;

  const bundskatGrundlag = Math.max(0, personligIndkomstÅr - personfradragÅr - pensionÅr);
  const bundskatÅr = bundskatGrundlag * RATES.bundskat;
  const kommuneskatÅr = skattepligtigIndkomstÅr * kommunesatsSats;
  const kirkeskatÅr = skattepligtigIndkomstÅr * kirkeskatSats;

  const topskatGrundlag = Math.max(0, personligIndkomstÅr - pensionÅr - RATES.topskattegrænse);
  const topskatÅr = topskatGrundlag * RATES.topskat;

  const samletSkatÅr = amBidragÅr + bundskatÅr + kommuneskatÅr + kirkeskatÅr + topskatÅr;
  const nettoIndkomstÅr = bruttoÅr - samletSkatÅr;

  const månedFaktor = 1 / 12;
  const amBidrag = amBidragÅr * månedFaktor;
  const personligIndkomst = personligIndkomstÅr * månedFaktor;
  const beskæftigelsesfradrag = beskæftigelsesfradragÅr * månedFaktor;
  const personfradrag = personfradragÅr * månedFaktor;
  const skattepligtigIndkomst = skattepligtigIndkomstÅr * månedFaktor;
  const bundskat = bundskatÅr * månedFaktor;
  const kommuneskat = kommuneskatÅr * månedFaktor;
  const kirkeskat = kirkeskatÅr * månedFaktor;
  const topskat = topskatÅr * månedFaktor;
  const samletSkat = samletSkatÅr * månedFaktor;
  const nettoIndkomst = nettoIndkomstÅr * månedFaktor;

  const effektivSkatteprocent = bruttoÅr > 0 ? (samletSkatÅr / bruttoÅr) * 100 : 0;

  const erTopskatter = personligIndkomstÅr - pensionÅr > RATES.topskattegrænse;
  const marginalAmBidrag = RATES.amBidrag;
  const marginalIndkomst = 1 - marginalAmBidrag;
  const marginalBundskat = marginalIndkomst * RATES.bundskat;
  const marginalKommuneskat = marginalIndkomst * kommunesatsSats;
  const marginalKirkeskat = marginalIndkomst * kirkeskatSats;
  const marginalTopskat = erTopskatter ? marginalIndkomst * RATES.topskat : 0;
  const marginalSkatteprocent = (marginalAmBidrag + marginalBundskat + marginalKommuneskat + marginalKirkeskat + marginalTopskat) * 100;

  return {
    bruttoIndkomst,
    amBidrag,
    personligIndkomst,
    beskæftigelsesfradrag,
    personfradrag,
    skattepligtigIndkomst,
    bundskat,
    kommuneskat,
    kirkeskat,
    topskat,
    samletSkat,
    nettoIndkomst,
    effektivSkatteprocent,
    marginalSkatteprocent,
    skattefordeling: { amBidrag, bundskat, kommuneskat, kirkeskat, topskat },
  };
}

export function calculateNetIncome(income: IncomeData): number {
  return calculateTaxEstimate(income).nettoIndkomst;
}
