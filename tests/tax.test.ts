import {
  calculateAmBidrag,
  calculateTaxEstimate,
  calculateNetIncome,
  calculateBeskæftigelsesfradrag,
  getKommuneskat,
} from '../lib/tax/calculations';
import { TAX_RATES_2025 } from '../data/tax-rates/2025';

const defaultIncome = {
  bruttoIndkomst: 45000,
  indkomstType: 'løn' as const,
  trækprocent: 38,
  månedsfradrag: 4142,
  kommune: 'København',
  kirkeskat: false,
  pensionEgenAndel: 0,
  pensionType: 'beløb' as const,
  andreFradrag: 0,
};

describe('calculateAmBidrag', () => {
  test('beregner 8% af bruttoindkomst', () => { expect(calculateAmBidrag(45000)).toBeCloseTo(3600, 0); });
  test('returnerer 0 for 0 indkomst', () => { expect(calculateAmBidrag(0)).toBe(0); });
  test('AM-bidragssats er 8%', () => { expect(TAX_RATES_2025.amBidrag).toBe(0.08); });
});

describe('calculateBeskæftigelsesfradrag', () => {
  test('beregner 10,75% af personlig indkomst', () => {
    const fradrag = calculateBeskæftigelsesfradrag(45000 * 12 * 0.92);
    expect(fradrag).toBeGreaterThan(0);
    expect(fradrag).toBeLessThanOrEqual(TAX_RATES_2025.beskæftigelsesfradragMax);
  });
  test('capper ved maksimum (45.100 kr./år)', () => {
    expect(calculateBeskæftigelsesfradrag(1_000_000)).toBe(TAX_RATES_2025.beskæftigelsesfradragMax);
  });
});

describe('calculateTaxEstimate', () => {
  test('returnerer alle felter', () => {
    const r = calculateTaxEstimate(defaultIncome);
    ['bruttoIndkomst','amBidrag','personligIndkomst','bundskat','kommuneskat','kirkeskat','topskat','nettoIndkomst','effektivSkatteprocent','marginalSkatteprocent']
      .forEach(f => expect(r).toHaveProperty(f));
  });
  test('nettoindkomst er lavere end bruttoindkomst', () => {
    const r = calculateTaxEstimate(defaultIncome);
    expect(r.nettoIndkomst).toBeLessThan(r.bruttoIndkomst);
  });
  test('nettoindkomst er positiv', () => { expect(calculateTaxEstimate(defaultIncome).nettoIndkomst).toBeGreaterThan(0); });
  test('sum af skatter stemmer', () => {
    const r = calculateTaxEstimate(defaultIncome);
    const sum = r.amBidrag + r.bundskat + r.kommuneskat + r.kirkeskat + r.topskat;
    expect(r.bruttoIndkomst - sum).toBeCloseTo(r.nettoIndkomst, 0);
  });
  test('ingen kirkeskat når kirkeskat = false', () => { expect(calculateTaxEstimate({ ...defaultIncome, kirkeskat: false }).kirkeskat).toBe(0); });
  test('kirkeskat > 0 når kirkeskat = true', () => { expect(calculateTaxEstimate({ ...defaultIncome, kirkeskat: true }).kirkeskat).toBeGreaterThan(0); });
  test('ingen topskat ved indkomst < topskattegrænse', () => { expect(calculateTaxEstimate({ ...defaultIncome, bruttoIndkomst: 45000 }).topskat).toBe(0); });
  test('topskat ved høj indkomst', () => { expect(calculateTaxEstimate({ ...defaultIncome, bruttoIndkomst: 75000 }).topskat).toBeGreaterThan(0); });
  test('pension reducerer skattepligtig indkomst', () => {
    const uden = calculateTaxEstimate(defaultIncome);
    const med = calculateTaxEstimate({ ...defaultIncome, pensionEgenAndel: 2000, pensionType: 'beløb' });
    expect(med.nettoIndkomst).toBeGreaterThan(uden.nettoIndkomst - 2000);
  });
  test('effektiv skatteprocent er positiv og under 60%', () => {
    const r = calculateTaxEstimate(defaultIncome);
    expect(r.effektivSkatteprocent).toBeGreaterThan(0);
    expect(r.effektivSkatteprocent).toBeLessThan(60);
  });
});

describe('getKommuneskat', () => {
  test('returnerer korrekt sats for København', () => { expect(getKommuneskat('København')).toBeCloseTo(0.238, 3); });
  test('returnerer gennemsnit for ukendt kommune', () => { expect(getKommuneskat('UkendtKommune')).toBeCloseTo(TAX_RATES_2025.kommuneskatGennemsnit, 4); });
});

describe('calculateNetIncome', () => {
  test('returnerer positiv nettoindkomst', () => { expect(calculateNetIncome(defaultIncome)).toBeGreaterThan(0); });
  test('matcher calculateTaxEstimate', () => {
    expect(calculateNetIncome(defaultIncome)).toBeCloseTo(calculateTaxEstimate(defaultIncome).nettoIndkomst, 0);
  });
});
