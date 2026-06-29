import { calculateDisposableIncome, calculateSavingsRate, suggestBudgetOptimizations, analyzeBudget } from '../lib/calculations/budget';
import type { BudgetData } from '../types';

const sampleBudget: BudgetData = {
  kategorier: [
    { navn: 'Husleje', beløb: 8000, type: 'fast', kategori: 'bolig' },
    { navn: 'El og varme', beløb: 1000, type: 'fast', kategori: 'bolig' },
    { navn: 'Mad', beløb: 3500, type: 'variabel', kategori: 'mad' },
    { navn: 'Transport', beløb: 1500, type: 'variabel', kategori: 'transport' },
    { navn: 'Forsikringer', beløb: 800, type: 'fast', kategori: 'forsikring' },
    { navn: 'Abonnementer', beløb: 600, type: 'fast', kategori: 'abonnementer' },
    { navn: 'Opsparing', beløb: 2000, type: 'fast', kategori: 'opsparing' },
    { navn: 'Forbrug', beløb: 2000, type: 'variabel', kategori: 'forbrug' },
  ],
};

const nettoIndkomst = 28000;

describe('calculateDisposableIncome', () => {
  test('beregner korrekt rådighedsbeløb', () => {
    const total = sampleBudget.kategorier.reduce((s, k) => s + k.beløb, 0);
    expect(calculateDisposableIncome(nettoIndkomst, sampleBudget)).toBe(nettoIndkomst - total);
  });
  test('negativt ved udgifter over indkomst', () => {
    expect(calculateDisposableIncome(nettoIndkomst, { kategorier: [{ navn: 'Alt', beløb: 40000, type: 'fast', kategori: 'bolig' }] })).toBeLessThan(0);
  });
  test('returnerer nettoindkomst ved tomt budget', () => {
    expect(calculateDisposableIncome(nettoIndkomst, { kategorier: [] })).toBe(nettoIndkomst);
  });
});

describe('calculateSavingsRate', () => {
  test('beregner opsparingsrate som procent', () => {
    const rate = calculateSavingsRate(nettoIndkomst, sampleBudget);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThanOrEqual(100);
  });
  test('returnerer 0 ved ingen opsparing og negativt rådighedsbeløb', () => {
    expect(calculateSavingsRate(nettoIndkomst, { kategorier: [{ navn: 'Alt', beløb: 30000, type: 'fast', kategori: 'forbrug' }] })).toBe(0);
  });
});

describe('suggestBudgetOptimizations', () => {
  test('returnerer array', () => { expect(Array.isArray(suggestBudgetOptimizations(nettoIndkomst, sampleBudget))).toBe(true); });
  test('kritisk advarsel ved negativt rådighedsbeløb', () => {
    const opts = suggestBudgetOptimizations(nettoIndkomst, { kategorier: [{ navn: 'Bolig', beløb: 35000, type: 'fast', kategori: 'bolig' }] });
    expect(opts.some((o) => o.prioritet === 'høj')).toBe(true);
  });
  test('sorterer høj prioritet først', () => {
    const opts = suggestBudgetOptimizations(nettoIndkomst, sampleBudget);
    const priMap: Record<string, number> = { 'høj': 3, medium: 2, lav: 1 };
    for (let i = 0; i < opts.length - 1; i++) {
      expect(priMap[opts[i].prioritet]).toBeGreaterThanOrEqual(priMap[opts[i + 1].prioritet]);
    }
  });
  test('foreslår opsparingsoptimering ved lav opsparingsrate', () => {
    const opts = suggestBudgetOptimizations(30000, { kategorier: [
      { navn: 'Forbrug', beløb: 29500, type: 'variabel', kategori: 'forbrug' },
      { navn: 'Opsparing', beløb: 100, type: 'fast', kategori: 'opsparing' },
    ]});
    expect(opts.some((o) => o.kategori === 'opsparing')).toBe(true);
  });
});

describe('analyzeBudget', () => {
  test('returnerer komplet analyse', () => {
    const a = analyzeBudget(nettoIndkomst, sampleBudget, 50000);
    ['rådighedsbeløb','opsparingsrate','gældsgrad','budgetStatus','optimeringer','kategoriFordeling']
      .forEach(f => expect(a).toHaveProperty(f));
  });
  test('budgetstatus er gyldigt', () => {
    expect(['sund','advarsel','kritisk']).toContain(analyzeBudget(nettoIndkomst, sampleBudget, 50000).budgetStatus);
  });
  test('beregner korrekte faste udgifter', () => {
    const expected = sampleBudget.kategorier.filter(k => k.type === 'fast').reduce((s, k) => s + k.beløb, 0);
    expect(analyzeBudget(nettoIndkomst, sampleBudget, 50000).fasteUdgifter).toBe(expected);
  });
  test('nødopsparingDækning beregnes korrekt', () => {
    const total = sampleBudget.kategorier.reduce((s, k) => s + k.beløb, 0);
    expect(analyzeBudget(nettoIndkomst, sampleBudget, 50000).nødopsparingDækning).toBeCloseTo(50000 / total, 1);
  });
  test('sund status ved god økonomi', () => {
    const budget: BudgetData = { kategorier: [
      { navn: 'Bolig', beløb: 7000, type: 'fast', kategori: 'bolig' },
      { navn: 'Mad', beløb: 3000, type: 'variabel', kategori: 'mad' },
      { navn: 'Opsparing', beløb: 5000, type: 'fast', kategori: 'opsparing' },
    ]};
    expect(analyzeBudget(nettoIndkomst, budget, 100000).budgetStatus).toBe('sund');
  });
});
