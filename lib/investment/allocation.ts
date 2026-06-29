// Investeringsallokering og simulation
// DISCLAIMER: Ikke personlig investeringsrådgivning.

import type { InvestmentProfile, InvestmentScenario, InvestmentSimulation, SimulationDataPoint } from '@/types';

const LAV: InvestmentScenario = {
  navn: 'Konservativ',
  risikoprofil: 'lav',
  fordeling: [
    { kategori: 'Korte obligationer', procent: 40, beskrivelse: 'Statsobligation, realkreditobligationer med kort løbetid', eksempler: ['Korte danske statsobligationer', 'SDPR Bloomberg 1-3Y Treasury'], risiko: 'lav' },
    { kategori: 'Brede defensive aktier', procent: 25, beskrivelse: 'Global indekseksponering med lav volatilitet', eksempler: ['iShares MSCI World Min Vol', 'Xtrackers MSCI World'], risiko: 'lav' },
    { kategori: 'Højrenteobligationer', procent: 15, beskrivelse: 'Corporate bonds med moderat risiko', eksempler: ['Vanguard Corporate Bond Index', 'iShares Euro Corp Bond'], risiko: 'middel' },
    { kategori: 'Kontanter/likvider', procent: 20, beskrivelse: 'Højrentekonto, bankinskud, pengemarkedsfond', eksempler: ['Højrenteopsparing bank', 'Pengemarkedsfond'], risiko: 'lav' },
  ],
  forventetÅrligAfkastMin: 2, forventetÅrligAfkastMax: 5,
  anbefaling: 'Egnet til kortere tidshorisont (1-5 år) eller lav risikovillighed. Fokus på kapitalbevarelse frem for vækst.',
  advarsler: ['Afkastet dækker muligvis ikke inflationen over tid', 'Obligationer falder i kurs ved rentestigninger', 'Indskydergaranti gælder kun op til 100.000 EUR i banker'],
};

const MIDDEL: InvestmentScenario = {
  navn: 'Balanceret',
  risikoprofil: 'middel',
  fordeling: [
    { kategori: 'Global aktieindeks (ETF)', procent: 60, beskrivelse: 'Bred global eksponering via indeks-ETF', eksempler: ['Vanguard FTSE All-World ETF', 'iShares Core MSCI World', 'Storebrand Global All Countries'], risiko: 'middel' },
    { kategori: 'Obligationer mix', procent: 25, beskrivelse: 'Mix af stats- og realkreditobligationer', eksempler: ['iShares Core Euro Govt Bond', 'Korte danske realkreditobligationer'], risiko: 'lav' },
    { kategori: 'Ejendomme (REIT)', procent: 10, beskrivelse: 'Global ejendomseksponering via REITs', eksempler: ['Vanguard Real Estate ETF', 'iShares Global REIT ETF'], risiko: 'middel' },
    { kategori: 'Kontanter/buffer', procent: 5, beskrivelse: 'Likvidbuffer til rebalancering', eksempler: ['Opsparingskonto'], risiko: 'lav' },
  ],
  forventetÅrligAfkastMin: 4, forventetÅrligAfkastMax: 8,
  anbefaling: 'Anbefales til de fleste langsigtede investorer. God balance mellem vækst og stabilitet. Mindst 5-10 års horisont.',
  advarsler: ['Aktier kan falde 30-50% i perioder – hold kursen', 'Rebalancér portefølje én gang årligt', 'Aktiebeskatning i Danmark: 27/42% efter regler om aktieindkomst', 'ETF-beskatning: Lagerbeskatning gælder for de fleste udenlandske ETFer'],
};

const HØJ: InvestmentScenario = {
  navn: 'Vækst',
  risikoprofil: 'høj',
  fordeling: [
    { kategori: 'Global aktieindeks (ETF)', procent: 50, beskrivelse: 'Bred global eksponering – kerne', eksempler: ['Vanguard FTSE All-World ETF', 'iShares Core MSCI World'], risiko: 'middel' },
    { kategori: 'Tematiske ETFer', procent: 25, beskrivelse: 'Teknologi, cleantech, sundhed mm.', eksempler: ['iShares Global Clean Energy', 'Invesco QQQ (Nasdaq)', 'ARK Innovation ETF'], risiko: 'høj' },
    { kategori: 'Enkeltaktier', procent: 15, beskrivelse: 'Udvalgte kvalitetsaktier med vækstpotentiale', eksempler: ['Diversificeret portefølje af 10-20 aktier'], risiko: 'høj' },
    { kategori: 'Alternativ (krypto max)', procent: 10, beskrivelse: 'Højrisiko – KUN andel du kan tåle at tabe helt', eksempler: ['Bitcoin, Ethereum – max 5-10% af portefølje'], risiko: 'høj' },
  ],
  forventetÅrligAfkastMin: 5, forventetÅrligAfkastMax: 14,
  anbefaling: 'For investorer med lang tidshorisont (10+ år) og høj risikovillighed. Stor volatilitet forventes.',
  advarsler: ['Krypto er ekstremt volatil og kan falde 80%+ – begrænset eksponering', 'Tematiske ETFer har høj volatilitet og koncentrationsrisiko', 'Enkeltaktier kræver grundig analyse og diversificering', 'Ikke egnet til kortere tidshorisont eller lav tabsevne', 'Skat: Kryptovaluta beskattes som kapitalindkomst – husk at indberette'],
};

export function suggestInvestmentAllocation(profile: InvestmentProfile): InvestmentScenario {
  const { risikovillighed, tidshorisont, nødopsparingDækket, gæld, alder } = profile;
  if (!nødopsparingDækket || gæld > profile.månedligtOverskud * 12) {
    return { ...LAV, anbefaling: 'Prioritér at opbygge nødopsparing og reducere gæld, inden du investerer i aktier.' };
  }
  if (tidshorisont < 3 || alder > 65) return LAV;
  if (risikovillighed === 'lav' || tidshorisont < 5) return LAV;
  if (risikovillighed === 'høj' && tidshorisont >= 10 && alder < 55) return HØJ;
  return MIDDEL;
}

export function simulateInvestmentGrowth(
  månedligtBeløb: number,
  år: number,
  scenarie: InvestmentScenario,
  gebyrerÅrlig = 0.5
): InvestmentSimulation {
  const data: SimulationDataPoint[] = [];
  const afkastMin = (scenarie.forventetÅrligAfkastMin - gebyrerÅrlig) / 100 / 12;
  const afkastForventet = ((scenarie.forventetÅrligAfkastMin + scenarie.forventetÅrligAfkastMax) / 2 - gebyrerÅrlig) / 100 / 12;
  const afkastMax = (scenarie.forventetÅrligAfkastMax - gebyrerÅrlig) / 100 / 12;

  let minVærdi = 0, forventetVærdi = 0, maxVærdi = 0, indskudt = 0;

  for (let mdr = 0; mdr <= år * 12; mdr++) {
    if (mdr > 0) {
      minVærdi = (minVærdi + månedligtBeløb) * (1 + afkastMin);
      forventetVærdi = (forventetVærdi + månedligtBeløb) * (1 + afkastForventet);
      maxVærdi = (maxVærdi + månedligtBeløb) * (1 + afkastMax);
      indskudt += månedligtBeløb;
    }
    if (mdr % 12 === 0) {
      data.push({ år: mdr / 12, min: Math.round(minVærdi), forventet: Math.round(forventetVærdi), max: Math.round(maxVærdi), indskudt: Math.round(indskudt) });
    }
  }

  return {
    månedligtBeløb,
    år,
    scenarie,
    simulationsData: data,
    slutværdiMin: Math.round(minVærdi),
    slutværdiForventet: Math.round(forventetVærdi),
    slutværdiMax: Math.round(maxVærdi),
    totalIndskudt: Math.round(indskudt),
    gebyrerÅrlig,
    skattemæssigNote: 'ETF og aktier i Danmark: Aktieindkomst beskattes 27% op til 61.000 kr. og 42% derover (2025). Brug Aktiesparekonto (max 135.900 kr. indskud, 17% skat) til langsigtede investeringer. Konsultér Skattestyrelsen eller en skatterådgiver.',
  };
}

export const getAlleScenarier = (): InvestmentScenario[] => [LAV, MIDDEL, HØJ];
