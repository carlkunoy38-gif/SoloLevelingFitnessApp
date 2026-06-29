import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'slate';

const colorMap: Record<StatusColor, { bg: string; text: string; border: string; accent: string }> = {
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
  yellow: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', accent: 'bg-slate-500' },
};

interface StatCardProps { label: string; value: string; subtitle?: string; icon?: ReactNode; color?: StatusColor; className?: string; }

export function StatCard({ label, value, subtitle, icon, color = 'slate', className }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn('rounded-2xl border p-5 flex flex-col gap-3', c.bg, c.border, className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && <span className={cn('p-2 rounded-xl text-white', c.accent)}>{icon}</span>}
      </div>
      <div>
        <p className={cn('text-2xl font-bold', c.text)}>{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
