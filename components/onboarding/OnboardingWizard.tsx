'use client';

import { useState } from 'react';
import type { IncomeData, BudgetData } from '@/types';
import { formatKr } from '@/lib/utils';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (income: IncomeData, budget: BudgetData) => void;
  onSkip: () => void;
}

const KOMMUNER = [
  'København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers',
  'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Helsingør',
  'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge', 'Holstebro',
  'Taastrup', 'Slagelse', 'Hillerød', 'Holbæk', 'Sønderborg', 'Svendborg',
];

const STEPS = ['Indkomst', 'Udgifter', 'Mål', 'Færdig'];

export function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [bruttoIndkomst, setBruttoIndkomst] = useState(45000);
  const [kommune, setKommune] = useState('København');
  const [bolig, setBolig] = useState(8000);
  const [mad, setMad] = useState(3500);
  const [transport, setTransport] = useState(2000);
  const [gæld, setGæld] = useState(0);
  const [opsparingPct, setOpsparingPct] = useState(10);

  const opsparingBeløb = Math.round(bruttoIndkomst * 0.92 * (opsparingPct / 100));
  const savingsIn20yrs = Math.round(opsparingBeløb * 12 * 20 * 1.85);

  function handleComplete() {
    const income: IncomeData = {
      bruttoIndkomst,
      indkomstType: 'løn',
      trækprocent: 38,
      månedsfradrag: 4142,
      kommune,
      kirkeskat: false,
      pensionEgenAndel: 0,
      pensionType: 'beløb',
      andreFradrag: 0,
    };
    const budget: BudgetData = {
      kategorier: [
        { navn: 'Husleje / boliglån', beløb: bolig, type: 'fast', kategori: 'bolig' },
        { navn: 'Mad og dagligvarer', beløb: mad, type: 'variabel', kategori: 'mad' },
        { navn: 'Transport', beløb: transport, type: 'variabel', kategori: 'transport' },
        { navn: 'Forsikringer', beløb: 800, type: 'fast', kategori: 'forsikring' },
        { navn: 'Abonnementer', beløb: 400, type: 'fast', kategori: 'abonnementer' },
        { navn: 'Gældsydelser', beløb: gæld, type: 'fast', kategori: 'gæld' },
        { navn: 'Opsparing', beløb: opsparingBeløb, type: 'fast', kategori: 'opsparing' },
        { navn: 'Diverse forbrug', beløb: 1500, type: 'variabel', kategori: 'forbrug' },
      ],
    };
    onComplete(income, budget);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        <div className="flex gap-1.5 p-5 pb-0">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-blue-600' : 'bg-slate-100'}`} />
          ))}
        </div>

        <div className="p-6">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Trin 1 af 3</p>
                <h2 className="text-2xl font-bold text-slate-900">Hvad tjener du?</h2>
                <p className="text-slate-500 mt-1 text-sm">Din bruttoløn (før skat) pr. måned</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 text-center py-3 tabular-nums">{formatKr(bruttoIndkomst)}</div>
                <input type="range" min={10000} max={150000} step={1000} value={bruttoIndkomst}
                  onChange={(e) => setBruttoIndkomst(Number(e.target.value))} className="w-full accent-blue-600 h-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10.000 kr.</span><span>150.000 kr.</span></div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Din bopælskommune</label>
                <select value={kommune} onChange={(e) => setKommune(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white">
                  {KOMMUNER.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">Du kan vælge alle 98 kommuner i Indkomst-fanen</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Trin 2 af 3</p>
                <h2 className="text-2xl font-bold text-slate-900">Hvad betaler du?</h2>
                <p className="text-slate-500 mt-1 text-sm">Dine vigtigste månedlige udgifter</p>
              </div>
              {[
                { emoji: '🏠', label: 'Husleje / boliglån', value: bolig, set: setBolig, max: 25000 },
                { emoji: '🛒', label: 'Mad & dagligvarer', value: mad, set: setMad, max: 12000 },
                { emoji: '🚗', label: 'Transport', value: transport, set: setTransport, max: 8000 },
                { emoji: '💳', label: 'Gæld (lån, afdrag)', value: gæld, set: setGæld, max: 15000 },
              ].map(({ emoji, label, value, set, max }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-medium text-slate-700">{emoji} {label}</label>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{formatKr(value)}</span>
                  </div>
                  <input type="range" min={0} max={max} step={500} value={value}
                    onChange={(e) => set(Number(e.target.value))} className="w-full accent-blue-600 h-2" />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Trin 3 af 3</p>
                <h2 className="text-2xl font-bold text-slate-900">Hvad vil du spare?</h2>
                <p className="text-slate-500 mt-1 text-sm">Anbefalet: minimum 10% af nettoindkomst</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-emerald-600 text-center py-2 tabular-nums">{opsparingPct}%</div>
                <div className="text-center text-slate-500 text-sm mb-3">≈ {formatKr(opsparingBeløb)} kr./mdr. efter skat</div>
                <input type="range" min={0} max={50} step={5} value={opsparingPct}
                  onChange={(e) => setOpsparingPct(Number(e.target.value))} className="w-full accent-emerald-600 h-2" />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0%</span><span className="text-emerald-600 font-medium">↑ Anbefalet: 10–20%</span><span>50%</span>
                </div>
              </div>
              {opsparingBeløb > 0 && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
                  <p className="text-sm font-semibold text-emerald-800 mb-1">💡 Om 20 år kan du have:</p>
                  <p className="text-2xl font-bold text-emerald-700">{formatKr(savingsIn20yrs)}</p>
                  <p className="text-xs text-emerald-600 mt-1">Ved {opsparingPct}% opsparing + 6% gennemsnitligt afkast</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="pt-2">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-slate-900">Klar til at se din økonomi!</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Vi har sat din profil op. Du kan justere alle detaljer i de enkelte faner.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-left">
                {[
                  { label: 'Bruttoindkomst', value: formatKr(bruttoIndkomst) + ' /mdr.' },
                  { label: 'Kommune', value: kommune },
                  { label: 'Faste udgifter', value: formatKr(bolig + mad + transport + gæld) + ' /mdr.' },
                  { label: 'Opsparingsmål', value: opsparingPct + '% (' + formatKr(opsparingBeløb) + ')' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="font-semibold text-slate-800 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-8 pt-2 flex gap-3">
          {step === 0 ? (
            <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 px-3 py-2.5">Spring over</button>
          ) : step < 3 ? (
            <button onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4" /> Tilbage
            </button>
          ) : null}
          <button onClick={step < 3 ? () => setStep((s) => s + 1) : handleComplete}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            {step < 3 ? <>Næste <ArrowRight className="w-4 h-4" /></> : <>Vis min økonomi <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
