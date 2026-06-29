// Budgetberegninger og optimeringsforslag

import type {
  BudgetData,
  BudgetAnalysis,
  BudgetOptimering,
  KategoriFordeling,
  BudgetKategori,
} from '@/types';

const ANBEFALEDE_PROCENTER: Record<BudgetKategori, number> = {
  bolig: 30,
  mad: 15,
  transport: 12,
  forsikring: 5,
  abonnementer: 3,
  gæld: 20,
  opsparing: 20,
  investering: 10,
  forbrug: 10,
  andet: 5,
};

export function calculateDisposableIncome(nettoIndkomst: number, budget: BudgetData): number {
  const totalUdgifter = budget.kategorier.reduce((sum, k) => sum + k.beløb, 0);
  return nettoIndkomst - totalUdgifter;
}

export function calculateSavingsRate(nettoIndkomst: number, budget: BudgetData): number {
  const opsparingsKategorier = budget.kategorier.filter(
    (k) => k.kategori === 'opsparing' || k.kategori === 'investering'
  );
  const totalOpsparing = opsparingsKategorier.reduce((sum, k) => sum + k.beløb, 0);
  const rådighedsbeløb = calculateDisposableIncome(nettoIndkomst, budget);
  const effektivOpsparing = totalOpsparing + Math.max(0, rådighedsbeløb);
  return nettoIndkomst > 0 ? (effektivOpsparing / nettoIndkomst) * 100 : 0;
}

export function suggestBudgetOptimizations(nettoIndkomst: number, budget: BudgetData): BudgetOptimering[] {
  const optimeringer: BudgetOptimering[] = [];

  for (const kategori of budget.kategorier) {
    const anbefaletMax = (ANBEFALEDE_PROCENTER[kategori.kategori] / 100) * nettoIndkomst;
    const overskridelse = kategori.beløb - anbefaletMax;

    if (overskridelse > 200) {
      let prioritet: 'lav' | 'medium' | 'høj' = 'lav';
      let beskrivelse = '';

      switch (kategori.kategori) {
        case 'abonnementer':
          prioritet = 'høj';
          beskrivelse = `Du bruger ${Math.round(overskridelse)} kr./mdr. mere end anbefalet på abonnementer. Gennemgå Netflix, Spotify, aviser og andre faste aftaler – annullér det du ikke bruger aktivt.`;
          break;
        case 'gæld':
          prioritet = 'høj';
          beskrivelse = `Gældsydelser udgør en høj andel af din indkomst. Overvej refinansiering til lavere rente, eller lav en ekstra afbetalingsplan for at reducere løbetid.`;
          break;
        case 'forbrug':
          prioritet = 'medium';
          beskrivelse = `Variabelt forbrug er ${Math.round(overskridelse)} kr. over anbefalet niveau. Sæt et månedligt budget og brug et kontant-/budgetkort for at holde styr på udgifterne.`;
          break;
        case 'mad':
          prioritet = 'medium';
          beskrivelse = `Madbudget er højt. Ugentlig madplan og færre take-away/restaurant-besøg kan spare ${Math.round(overskridelse * 0.4)} kr./mdr.`;
          break;
        case 'transport':
          prioritet = 'medium';
          beskrivelse = `Transportudgifter over anbefalet niveau. Overvej kollektiv trafik, samkørsel, eller om bilen kan undværes.`;
          break;
        case 'bolig':
          prioritet = 'medium';
          beskrivelse = `Boligudgift overstiger 30% af nettoindkomsten. Overvej fremleje af værelse, refinansiering af boliglån, eller om boligen matcher din økonomi.`;
          break;
        default:
          prioritet = 'lav';
          beskrivelse = `${kategori.navn} er ${Math.round(overskridelse)} kr. over anbefalet niveau.`;
      }

      optimeringer.push({ kategori: kategori.kategori, besparelse: Math.round(overskridelse), beskrivelse, prioritet });
    }
  }

  const rådighedsbeløb = calculateDisposableIncome(nettoIndkomst, budget);
  if (rådighedsbeløb < 0) {
    optimeringer.unshift({
      kategori: 'andet',
      besparelse: Math.abs(Math.round(rådighedsbeløb)),
      beskrivelse: `KRITISK: Dit budget er i minus med ${Math.abs(Math.round(rådighedsbeløb))} kr./mdr. Du skal reducere udgifter eller øge indkomst hurtigst muligt.`,
      prioritet: 'høj',
    });
  }

  const opsparingsrate = calculateSavingsRate(nettoIndkomst, budget);
  if (opsparingsrate < 10 && rådighedsbeløb >= 0) {
    optimeringer.push({
      kategori: 'opsparing',
      besparelse: Math.round(nettoIndkomst * 0.1 - nettoIndkomst * (opsparingsrate / 100)),
      beskrivelse: `Din opsparingsrate er kun ${opsparingsrate.toFixed(1)}%. Eksperter anbefaler min. 10-20%. Prøv at øge din månedlige opsparing med automatisk overførsel.`,
      prioritet: opsparingsrate < 5 ? 'høj' : 'medium',
    });
  }

  return optimeringer.sort((a, b) => {
    const prio = { 'høj': 3, medium: 2, lav: 1 };
    return prio[b.prioritet] - prio[a.prioritet];
  });
}

export function analyzeBudget(nettoIndkomst: number, budget: BudgetData, aktuelOpsparing = 0): BudgetAnalysis {
  const fasteUdgifter = budget.kategorier.filter((k) => k.type === 'fast').reduce((sum, k) => sum + k.beløb, 0);
  const variableUdgifter = budget.kategorier.filter((k) => k.type === 'variabel').reduce((sum, k) => sum + k.beløb, 0);
  const totalUdgifter = fasteUdgifter + variableUdgifter;
  const rådighedsbeløb = nettoIndkomst - totalUdgifter;

  const opsparingsbeløb = budget.kategorier
    .filter((k) => k.kategori === 'opsparing' || k.kategori === 'investering')
    .reduce((sum, k) => sum + k.beløb, 0);
  const opsparingsrate = nettoIndkomst > 0 ? (opsparingsbeløb / nettoIndkomst) * 100 : 0;

  const gæld = budget.kategorier.filter((k) => k.kategori === 'gæld').reduce((sum, k) => sum + k.beløb, 0);
  const gældsgrad = nettoIndkomst > 0 ? (gæld / nettoIndkomst) * 100 : 0;

  const anbefaletNødopsparing = totalUdgifter * 3;
  const nødopsparingDækning = totalUdgifter > 0 ? aktuelOpsparing / totalUdgifter : 0;

  let budgetStatus: 'sund' | 'advarsel' | 'kritisk' = 'sund';
  if (rådighedsbeløb < 0 || gældsgrad > 40) budgetStatus = 'kritisk';
  else if (opsparingsrate < 10 || gældsgrad > 25 || nødopsparingDækning < 3) budgetStatus = 'advarsel';

  const kategoriFordeling: KategoriFordeling[] = budget.kategorier.map((k) => {
    const procent = nettoIndkomst > 0 ? (k.beløb / nettoIndkomst) * 100 : 0;
    const anbefaletMax = ANBEFALEDE_PROCENTER[k.kategori];
    let status: 'ok' | 'høj' | 'kritisk' = 'ok';
    if (procent > anbefaletMax * 1.5) status = 'kritisk';
    else if (procent > anbefaletMax) status = 'høj';
    return { kategori: k.kategori, beløb: k.beløb, procentAfIndkomst: procent, anbefaletMax, status };
  });

  return {
    totalIndkomst: nettoIndkomst,
    fasteUdgifter,
    variableUdgifter,
    totalUdgifter,
    rådighedsbeløb,
    opsparingsrate,
    gældsgrad,
    anbefaletNødopsparing,
    aktuelOpsparing,
    nødopsparingDækning,
    budgetStatus,
    optimeringer: suggestBudgetOptimizations(nettoIndkomst, budget),
    kategoriFordeling,
  };
}
