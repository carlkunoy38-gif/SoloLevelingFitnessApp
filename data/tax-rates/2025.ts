// Officielle skattesatser 2025 - Kilde: Skattestyrelsen
// https://skat.dk/skat.aspx?oid=2035568
// Opdateres årligt ved ny skattelov

export const TAX_RATES_2025 = {
  year: 2025,

  // AM-bidrag (arbejdsmarkedsbidrag)
  amBidrag: 0.08, // 8%

  // Bundskat
  bundskat: 0.1264, // 12,64%

  // Topskat (af personlig indkomst over topskattegrænse)
  topskat: 0.15, // 15%
  topskattegrænse: 588900, // kr. (2025) - af personlig indkomst efter AM-bidrag

  // Personfradrag pr. år
  personfradrag: 49700, // kr. (2025)
  personfradragMåned: 4142, // kr./måned (2025)

  // Kommuneskattegrænser (gennemsnit og spænd 2025)
  kommuneskatGennemsnit: 0.2534,
  kommuneskatMin: 0.2170,
  kommuneskatMax: 0.2799,

  // Kirkeskat (gennemsnit)
  kirkeskatGennemsnit: 0.0076,

  // Udligningsskat (fjernet fra 2024)
  udligningsskat: 0,

  // Beskæftigelsesfradrag
  beskæftigelsesfradragSats: 0.1075,
  beskæftigelsesfradragMax: 45100,

  // Aktieindkomst
  aktieindkomstLavSats: 0.27,
  aktieindkomstHøjSats: 0.42,
  aktieindkomstGrænse: 61000,

  // Pensionsgrænser
  ratepensionMaxÅr: 65500,
  livsvarigPensionMaxProcent: 1.0,

  // SU 2025
  suStatsstipendie: 7076,
  suUdeboende: 9316,
} as const;

// Kommuneskatser 2025 - udvalgte kommuner (Skattestyrelsen)
export const KOMMUNESKAT_2025: Record<string, number> = {
  Albertslund: 0.2480, Allørød: 0.2240, Assens: 0.2650, Ballerup: 0.2590,
  Billund: 0.2560, Bornholm: 0.2700, Brøndby: 0.2650, Brønderslev: 0.2790,
  Dragør: 0.2390, Egedal: 0.2490, Esbjerg: 0.2670, Fanø: 0.2700,
  Favrskov: 0.2570, Faxe: 0.2680, Fredensborg: 0.2430, Fredericia: 0.2600,
  Frederiksberg: 0.2290, Frederikshavn: 0.2790, Frederikssund: 0.2590,
  Furesø: 0.2390, Faaborg: 0.2610, Gentofte: 0.2170, Gladsaxe: 0.2390,
  Glostrup: 0.2390, Greve: 0.2410, Gribskov: 0.2560, Guldborgsund: 0.2720,
  Haderslev: 0.2640, Halsnæs: 0.2620, Hedensted: 0.2580, Helsingør: 0.2560,
  Herlev: 0.2500, Herning: 0.2580, Hillerød: 0.2490, Hjørring: 0.2799,
  Holbæk: 0.2680, Holstebro: 0.2590, Horsens: 0.2570, Hvidovre: 0.2600,
  Høje_Taastrup: 0.2600, Hørsholm: 0.2200, Ikast: 0.2530, Ishøj: 0.2600,
  Jammerbugt: 0.2760, Kalundborg: 0.2730, Kerteminde: 0.2660, Kolding: 0.2590,
  København: 0.2380, Køge: 0.2520, Langeland: 0.2710, Lejre: 0.2560,
  Lemvig: 0.2630, Lolland: 0.2750, Lyngby: 0.2310, Læsø: 0.2700,
  Mariagerfjord: 0.2760, Middelfart: 0.2620, Morsø: 0.2780, Norddjurs: 0.2720,
  Nordfyns: 0.2690, Nyborg: 0.2650, Næstved: 0.2680, Odder: 0.2540,
  Odense: 0.2620, Odsherred: 0.2700, Randers: 0.2680, Rebild: 0.2590,
  Ringkøbing: 0.2550, Ringsted: 0.2600, Roskilde: 0.2480, Rudersdal: 0.2190,
  Rødovre: 0.2590, Samsø: 0.2680, Silkeborg: 0.2590, Skanderborg: 0.2490,
  Skive: 0.2680, Slagelse: 0.2710, Solrød: 0.2330, Sorø: 0.2670,
  Stevns: 0.2660, Struer: 0.2620, Svendborg: 0.2650, Syddjurs: 0.2620,
  Sønderborg: 0.2630, Thisted: 0.2700, Tønder: 0.2700, Tårnby: 0.2470,
  Vallensbæk: 0.2440, Varde: 0.2640, Vejen: 0.2560, Vejle: 0.2570,
  Vesthimmerland: 0.2730, Viborg: 0.2570, Vordingborg: 0.2700, Ærø: 0.2700,
  Aabenraa: 0.2630, Aalborg: 0.2640, Aarhus: 0.2400,
};

// Kirkeskat 2025 per kommune (gennemsnit bruges hvis ikke specifik)
export const KIRKESKAT_2025: Record<string, number> = {
  København: 0.0066,
  Aarhus: 0.0076,
  Odense: 0.0100,
  Aalborg: 0.0097,
  Frederiksberg: 0.0065,
  Gentofte: 0.0060,
  Rudersdal: 0.0062,
  Hørsholm: 0.0072,
};
