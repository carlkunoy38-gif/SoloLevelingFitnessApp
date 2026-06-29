'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { InvestmentProfile } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { Alert } from '@/components/ui/alert';

const schema = z.object({
  alder: z.coerce.number().min(18).max(90),
  tidshorisont: z.coerce.number().min(1).max(50),
  risikovillighed: z.enum(['lav', 'middel', 'høj']),
  månedligtOverskud: z.coerce.number().min(0),
  nødopsparingDækket: z.boolean(),
  gæld: z.coerce.number().min(0),
  mål: z.enum(['pension', 'boligkøb', 'frihed', 'generel_formue', 'kortSigt']),
});

type FormData = z.infer<typeof schema>;

interface InvestmentFormProps {
  defaultValues?: Partial<InvestmentProfile>;
  onSubmit: (data: InvestmentProfile) => void;
}

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-600 mb-1';

const RISIKO_LABELS = {
  lav: { label: 'Lav', desc: 'Kapitalbevarelse, obligationer, stabile afkast', color: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
  middel: { label: 'Middel', desc: 'Blanding af aktier og obligationer', color: 'border-blue-400 bg-blue-50 text-blue-700' },
  høj: { label: 'Høj', desc: 'Primært aktier, accepterer store udsving', color: 'border-orange-400 bg-orange-50 text-orange-700' },
};

const MÅL_LABELS: Record<string, string> = {
  pension: 'Pensionsopsparing (lang sigt)',
  boligkøb: 'Boligkøb (mellemlang sigt)',
  frihed: 'Finansiel frihed / FIRE',
  generel_formue: 'Generel formueudvikling',
  kortSigt: 'Kortsigtet mål (< 3 år)',
};

export function InvestmentForm({ defaultValues, onSubmit }: InvestmentFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      alder: defaultValues?.alder ?? 30,
      tidshorisont: defaultValues?.tidshorisont ?? 20,
      risikovillighed: defaultValues?.risikovillighed ?? 'middel',
      månedligtOverskud: defaultValues?.månedligtOverskud ?? 0,
      nødopsparingDækket: defaultValues?.nødopsparingDækket ?? false,
      gæld: defaultValues?.gæld ?? 0,
      mål: defaultValues?.mål ?? 'generel_formue',
    },
  });

  const risikovillighed = watch('risikovillighed');
  const nødopsparingDækket = watch('nødopsparingDækket');

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as unknown as InvestmentProfile))} className="space-y-5">
      <Alert type="warning" title="Ikke personlig investeringsrådgivning">
        Disse scenarier er generelle informationer og udgør ikke autoriseret investeringsrådgivning.
        Kontakt en certificeret investeringsrådgiver, inden du træffer større investeringsbeslutninger.
        Historiske afkast er ingen garanti for fremtidige afkast.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Alder</label>
          <input type="number" {...register('alder')} className={inputCls} placeholder="fx 30" />
          {errors.alder && <p className="text-red-500 text-xs mt-1">{errors.alder.message}</p>}
        </div>

        <div>
          <label className={labelCls}>
            <Tooltip content="Jo længere tidshorisont, jo mere risiko kan du typisk tage, da kortsigtede kursfald udlignes over tid.">
              Investeringshorisont (år)
            </Tooltip>
          </label>
          <input type="number" {...register('tidshorisont')} className={inputCls} placeholder="fx 20" />
          {errors.tidshorisont && <p className="text-red-500 text-xs mt-1">{errors.tidshorisont.message}</p>}
        </div>

        <div>
          <label className={labelCls}>
            <Tooltip content="Månedligt beløb du kan sætte til side til investering – efter alle udgifter og nødopsparing.">
              Månedligt overskud til investering (kr.)
            </Tooltip>
          </label>
          <input type="number" {...register('månedligtOverskud')} className={inputCls} placeholder="fx 2000" />
        </div>

        <div>
          <label className={labelCls}>
            <Tooltip content="Total gæld (forbrugslån, studielån, billån mv. – IKKE boliglån i eget hjem). Høj gæld kan betyde at afdrag er bedre end investering.">
              Total forbrugsgæld (kr.)
            </Tooltip>
          </label>
          <input type="number" {...register('gæld')} className={inputCls} placeholder="fx 50000" />
        </div>

        <div>
          <label className={labelCls}>Investeringsmål</label>
          <select {...register('mål')} className={inputCls}>
            {Object.entries(MÅL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-5">
          <input
            type="checkbox"
            id="nødopsparing"
            {...register('nødopsparingDækket')}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="nødopsparing" className="text-sm font-medium text-slate-600 cursor-pointer">
            <Tooltip content="Nødopsparing bør dække 3-6 måneders udgifter på let tilgængelig konto. ALTID opbyg nødopsparing inden du investerer.">
              Nødopsparing er dækket (3-6 mdr.)
            </Tooltip>
          </label>
        </div>
      </div>

      {!nødopsparingDækket && (
        <Alert type="danger" title="Opbyg nødopsparing først">
          Sæt alle ledige midler i nødopsparing, inden du investerer. En nødopsparing forhindrer dig i at sælge
          investeringer på det forkerte tidspunkt ved uforudsete udgifter.
        </Alert>
      )}

      {/* Risikovælger */}
      <div>
        <label className={`${labelCls} mb-3`}>
          <Tooltip content="Risikovillighed beskriver din evne og vilje til at tåle kursudsving. Vær ærlig – undgå at overestimere din tabstolerance.">
            Risikovillighed
          </Tooltip>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(RISIKO_LABELS) as [FormData['risikovillighed'], typeof RISIKO_LABELS.lav][]).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setValue('risikovillighed', k)}
              className={`rounded-xl border-2 p-3 text-left transition-all ${risikovillighed === k ? v.color + ' border-2' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
            >
              <p className="font-semibold text-sm">{v.label}</p>
              <p className="text-xs mt-0.5 leading-relaxed">{v.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
      >
        Vis investeringsscenarier
      </button>
    </form>
  );
}
