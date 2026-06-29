'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KOMMUNESKAT_2025 } from '@/data/tax-rates/2025';
import type { IncomeData } from '@/types';
import { Tooltip } from '@/components/ui/tooltip';
import { Alert } from '@/components/ui/alert';

const schema = z.object({
  bruttoIndkomst: z.coerce.number().min(0, 'Skal være 0 eller mere'),
  indkomstType: z.enum(['løn', 'su', 'selvstændig']),
  trækprocent: z.coerce.number().min(0).max(60),
  månedsfradrag: z.coerce.number().min(0),
  kommune: z.string().min(1),
  kirkeskat: z.boolean(),
  pensionEgenAndel: z.coerce.number().min(0),
  pensionType: z.enum(['beløb', 'procent']),
  andreFradrag: z.coerce.number().min(0),
});

type FormData = z.infer<typeof schema>;

interface IncomeFormProps {
  defaultValues?: Partial<IncomeData>;
  onSubmit: (data: IncomeData) => void;
}

const kommuner = Object.keys(KOMMUNESKAT_2025).sort();

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const labelCls = 'block text-sm font-medium text-slate-600 mb-1';

export function IncomeForm({ defaultValues, onSubmit }: IncomeFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      bruttoIndkomst: defaultValues?.bruttoIndkomst ?? 0,
      indkomstType: defaultValues?.indkomstType ?? 'løn',
      trækprocent: defaultValues?.trækprocent ?? 38,
      månedsfradrag: defaultValues?.månedsfradrag ?? 4142,
      kommune: defaultValues?.kommune ?? 'København',
      kirkeskat: defaultValues?.kirkeskat ?? false,
      pensionEgenAndel: defaultValues?.pensionEgenAndel ?? 0,
      pensionType: defaultValues?.pensionType ?? 'beløb',
      andreFradrag: defaultValues?.andreFradrag ?? 0,
    },
  });

  const pensionType = watch('pensionType');
  const bruttoIndkomst = watch('bruttoIndkomst');

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d as unknown as IncomeData))} className="space-y-5">
      <Alert type="info" title="Om skatteberegning">
        Beregningen er et estimat baseret på Skattestyrelsens officielle satser for 2025.
        Din faktiske skat fastsættes af Skattestyrelsens forskudsopgørelse og årsopgørelse.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bruttoindkomst */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Din løn/indkomst FØR alle fradrag og skat – det beløb din arbejdsgiver udbetaler som samlet ydelse.">
              Bruttoindkomst pr. måned (kr.)
            </Tooltip>
          </label>
          <input type="number" {...register('bruttoIndkomst')} className={inputCls} placeholder="fx 45000" />
          {errors.bruttoIndkomst && <p className="text-red-500 text-xs mt-1">{errors.bruttoIndkomst.message}</p>}
        </div>

        {/* Indkomsttype */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Lønmodtager betaler AM-bidrag og A-skat. SU-modtagere er undtaget AM-bidrag. Selvstændige har særlige regler.">
              Indkomsttype
            </Tooltip>
          </label>
          <select {...register('indkomstType')} className={inputCls}>
            <option value="løn">Lønindkomst</option>
            <option value="su">SU (Statens Uddannelsesstøtte)</option>
            <option value="selvstændig">Selvstændig erhvervsdrivende</option>
          </select>
        </div>

        {/* Trækprocent */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Din trækprocent (A-skatteprocent) fra dit skattekort hos Skattestyrelsen. Find den på skat.dk under 'Forskudsopgørelse'.">
              Trækprocent (%)
            </Tooltip>
          </label>
          <input type="number" step="0.1" {...register('trækprocent')} className={inputCls} placeholder="fx 38" />
          {errors.trækprocent && <p className="text-red-500 text-xs mt-1">{errors.trækprocent.message}</p>}
          <p className="text-xs text-slate-400 mt-1">Bruges kun som reference – beregningen bruger officielle satser</p>
        </div>

        {/* Månedsfradrag */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Dit månedlige personfradrag fra skattekortet. Standardpersonfradrag er 4.142 kr./måned i 2025 (49.700 kr./år).">
              Månedsfradrag (kr.)
            </Tooltip>
          </label>
          <input type="number" {...register('månedsfradrag')} className={inputCls} placeholder="4142" />
          {errors.månedsfradrag && <p className="text-red-500 text-xs mt-1">{errors.månedsfradrag.message}</p>}
        </div>

        {/* Kommune */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Din bopælskommune afgør kommuneskattesatsen. Kommuneskat varierer fra ca. 21,7% til 28% (2025).">
              Bopælskommune
            </Tooltip>
          </label>
          <select {...register('kommune')} className={inputCls}>
            {kommuner.map((k) => (
              <option key={k} value={k}>{k.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {/* Kirkeskat */}
        <div className="flex items-center gap-3 pt-6">
          <input type="checkbox" id="kirkeskat" {...register('kirkeskat')} className="w-4 h-4 rounded" />
          <label htmlFor="kirkeskat" className="text-sm font-medium text-slate-600 cursor-pointer">
            <Tooltip content="Kirkeskat betales kun af folkekirkemedlemmer og udgør ca. 0,65–1% afhængig af kommune.">
              Betaler kirkeskat
            </Tooltip>
          </label>
        </div>

        {/* Pensionstype */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Pensionsindbetaling reducerer din skattepligtige indkomst. Arbejdsgiverbidraget indgår normalt ikke her – kun din egenandel.">
              Pension egenandel – type
            </Tooltip>
          </label>
          <select {...register('pensionType')} className={inputCls}>
            <option value="beløb">Fast beløb (kr./mdr.)</option>
            <option value="procent">Procent af bruttoLøn</option>
          </select>
        </div>

        {/* Pension beløb/procent */}
        <div>
          <label className={labelCls}>
            {pensionType === 'procent' ? 'Pensionsprocent (%)' : 'Pensionsbeløb (kr./mdr.)'}
          </label>
          <input
            type="number"
            step={pensionType === 'procent' ? '0.5' : '100'}
            {...register('pensionEgenAndel')}
            className={inputCls}
            placeholder={pensionType === 'procent' ? 'fx 5' : 'fx 1500'}
          />
          {pensionType === 'procent' && bruttoIndkomst > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              ≈ {Math.round(bruttoIndkomst * (Number(watch('pensionEgenAndel')) / 100))} kr./mdr.
            </p>
          )}
        </div>

        {/* Andre fradrag */}
        <div>
          <label className={labelCls}>
            <Tooltip content="Fradragsberettigede udgifter som A-kasse (halvdelen er fradragsberettiget), fagforening og lignende. Fradrag reducerer den skattepligtige indkomst.">
              Andre fradrag (kr./mdr.)
            </Tooltip>
          </label>
          <input type="number" {...register('andreFradrag')} className={inputCls} placeholder="fx 500" />
          <p className="text-xs text-slate-400 mt-1">A-kasse, fagforening, befordringsfradrag mv.</p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Beregn skatteestimat
      </button>
    </form>
  );
}
