'use client';

import { IncomeData, BudgetData, InvestmentProfile } from '@/types';

const STORAGE_KEY = 'dk-finance-data';

export interface AppState {
  income: Partial<IncomeData>;
  budget: BudgetData;
  investment: Partial<InvestmentProfile>;
  aktuelOpsparing: number;
  profileId: string | null;
}

const DEFAULT_STATE: AppState = {
  income: {
    bruttoIndkomst: 0,
    indkomstType: 'løn',
    trækprocent: 38,
    månedsfradrag: 4142,
    kommune: 'København',
    kirkeskat: false,
    pensionEgenAndel: 0,
    pensionType: 'beløb',
    andreFradrag: 0,
  },
  budget: {
    kategorier: [
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
    ],
  },
  investment: {
    alder: 30,
    tidshorisont: 20,
    risikovillighed: 'middel',
    månedligtOverskud: 0,
    nødopsparingDækket: false,
    gæld: 0,
    mål: 'generel_formue',
  },
  aktuelOpsparing: 0,
  profileId: null,
};

export function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
