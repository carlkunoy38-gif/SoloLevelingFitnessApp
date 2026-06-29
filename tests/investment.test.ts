import { suggestInvestmentAllocation, simulateInvestmentGrowth, getAlleScenarier } from '../lib/investment/allocation';
import type { InvestmentProfile } from '../types';

const baseProfile: InvestmentProfile = {
  alder: 35, tidshorisont: 20, risikovillighed: 'middel',
  månedligtOverskud: 3000, nødopsparingDækket: true, gæld: 0, mål: 'generel_formue',
};

describe('suggestInvestmentAllocation', () => {
  test('lav risiko ved kort tidshorisont', () => { expect(suggestInvestmentAllocation({ ...baseProfile, tidshorisont: 2 }).risikoprofil).toBe('lav'); });
  test('lav risiko når nødopsparing ikke er dækket', () => { expect(suggestInvestmentAllocation({ ...baseProfile, nødopsparingDækket: false }).risikoprofil).toBe('lav'); });
  test('høj risiko ved høj risikovillighed og lang horisont', () => {
    expect(suggestInvestmentAllocation({ ...baseProfile, risikovillighed: 'høj', tidshorisont: 20, alder: 30 }).risikoprofil).toBe('høj');
  });
  test('middel risiko som default', () => { expect(suggestInvestmentAllocation(baseProfile).risikoprofil).toBe('middel'); });
  test('fordeling summerer til 100%', () => {
    expect(suggestInvestmentAllocation(baseProfile).fordeling.reduce((s, f) => s + f.procent, 0)).toBe(100);
  });
  test('lav risiko til ældre investor', () => { expect(suggestInvestmentAllocation({ ...baseProfile, alder: 70 }).risikoprofil).toBe('lav'); });
});

describe('simulateInvestmentGrowth', () => {
  const scenarie = getAlleScenarier().find(s => s.risikoprofil === 'middel')!;
  test('returnerer simulationsdata', () => { expect(simulateInvestmentGrowth(2000, 10, scenarie).simulationsData.length).toBeGreaterThan(0); });
  test('data har korrekte felter', () => {
    const d = simulateInvestmentGrowth(2000, 10, scenarie).simulationsData.at(-1)!;
    ['år','min','forventet','max','indskudt'].forEach(f => expect(d).toHaveProperty(f));
  });
  test('max >= forventet >= min', () => {
    const s = simulateInvestmentGrowth(2000, 20, scenarie);
    expect(s.slutværdiMax).toBeGreaterThanOrEqual(s.slutværdiForventet);
    expect(s.slutværdiForventet).toBeGreaterThanOrEqual(s.slutværdiMin);
  });
  test('totalIndskudt stemmer', () => { expect(simulateInvestmentGrowth(2000, 10, scenarie).totalIndskudt).toBeCloseTo(2000 * 10 * 12, -1); });
  test('slutværdi er større end indskudt', () => {
    const s = simulateInvestmentGrowth(2000, 20, scenarie);
    expect(s.slutværdiForventet).toBeGreaterThan(s.totalIndskudt);
  });
  test('gebyr påvirker afkast negativt', () => {
    const lav = simulateInvestmentGrowth(2000, 20, scenarie, 0.1);
    const høj = simulateInvestmentGrowth(2000, 20, scenarie, 2.0);
    expect(lav.slutværdiForventet).toBeGreaterThan(høj.slutværdiForventet);
  });
  test('returnerer skattemæssig note', () => { expect(simulateInvestmentGrowth(2000, 10, scenarie).skattemæssigNote.length).toBeGreaterThan(10); });
});

describe('getAlleScenarier', () => {
  test('returnerer 3 scenarier', () => { expect(getAlleScenarier().length).toBe(3); });
  test('dækker alle risikoprofiler', () => {
    const profiler = getAlleScenarier().map(s => s.risikoprofil);
    ['lav','middel','høj'].forEach(p => expect(profiler).toContain(p));
  });
});
