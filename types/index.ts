// Centrale typer for dansk økonomiapp

export interface IncomeData {
  bruttoIndkomst: number;
  indkomstType: 'løn' | 'su' | 'selvstændig';
  trækprocent: number;
  månedsfradrag: number;
  kommune: string;
  kirkeskat: boolean;
  pensionEgenAndel: number;
  pensionType: 'beløb' | 'procent';
  andreFradrag: number;
}

export interface TaxCalculationResult {
  bruttoIndkomst: number;
  amBidrag: number;
  personligIndkomst: number;
  beskæftigelsesfradrag: number;
  personfradrag: number;
  skattepligtigIndkomst: number;
  bundskat: number;
  kommuneskat: number;
  kirkeskat: number;
  topskat: number;
  samletSkat: number;
  nettoIndkomst: number;
  effektivSkatteprocent: number;
  marginalSkatteprocent: number;
  skattefordeling: {
    amBidrag: number;
    bundskat: number;
    kommuneskat: number;
    kirkeskat: number;
    topskat: number;
  };
}

export interface BudgetCategory {
  navn: string;
  beløb: number;
  type: 'fast' | 'variabel';
  kategori: BudgetKategori;
}

export type BudgetKategori =
  | 'bolig'
  | 'mad'
  | 'transport'
  | 'forsikring'
  | 'abonnementer'
  | 'gæld'
  | 'opsparing'
  | 'investering'
  | 'forbrug'
  | 'andet';

export interface BudgetData {
  kategorier: BudgetCategory[];
}

export interface BudgetAnalysis {
  totalIndkomst: number;
  fasteUdgifter: number;
  variableUdgifter: number;
  totalUdgifter: number;
  rådighedsbeløb: number;
  opsparingsrate: number;
  gældsgrad: number;
  anbefaletNødopsparing: number;
  aktuelOpsparing: number;
  nødopsparingDækning: number;
  budgetStatus: 'sund' | 'advarsel' | 'kritisk';
  optimeringer: BudgetOptimering[];
  kategoriFordeling: KategoriFordeling[];
}

export interface BudgetOptimering {
  kategori: BudgetKategori;
  besparelse: number;
  beskrivelse: string;
  prioritet: 'lav' | 'medium' | 'høj';
}

export interface KategoriFordeling {
  kategori: BudgetKategori;
  beløb: number;
  procentAfIndkomst: number;
  anbefaletMax: number;
  status: 'ok' | 'høj' | 'kritisk';
}

export interface InvestmentProfile {
  alder: number;
  tidshorisont: number;
  risikovillighed: 'lav' | 'middel' | 'høj';
  månedligtOverskud: number;
  nødopsparingDækket: boolean;
  gæld: number;
  mål: InvesteringsMål;
}

export type InvesteringsMål =
  | 'pension'
  | 'boligkøb'
  | 'frihed'
  | 'generel_formue'
  | 'kortSigt';

export interface InvestmentAllocation {
  kategori: string;
  procent: number;
  beskrivelse: string;
  eksempler: string[];
  risiko: 'lav' | 'middel' | 'høj';
}

export interface InvestmentScenario {
  navn: string;
  risikoprofil: 'lav' | 'middel' | 'høj';
  fordeling: InvestmentAllocation[];
  forventetÅrligAfkastMin: number;
  forventetÅrligAfkastMax: number;
  anbefaling: string;
  advarsler: string[];
}

export interface InvestmentSimulation {
  månedligtBeløb: number;
  år: number;
  scenarie: InvestmentScenario;
  simulationsData: SimulationDataPoint[];
  slutværdiMin: number;
  slutværdiForventet: number;
  slutværdiMax: number;
  totalIndskudt: number;
  gebyrerÅrlig: number;
  skattemæssigNote: string;
}

export interface SimulationDataPoint {
  år: number;
  min: number;
  forventet: number;
  max: number;
  indskudt: number;
}

export interface FinancialProfile {
  income: IncomeData;
  budget: BudgetData;
  investment: InvestmentProfile;
  createdAt: string;
  updatedAt: string;
}

export interface DisposableIncomeResult {
  nettoIndkomst: number;
  fasteUdgifter: number;
  variableUdgifter: number;
  rådighedsbeløb: number;
  opsparingsbeløb: number;
  opsparingsrate: number;
}
