import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

const styles: Record<AlertType, { wrapper: string; icon: ReactNode }> = {
  info: { wrapper: 'bg-blue-50 border-blue-200 text-blue-800', icon: <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> },
  success: { wrapper: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> },
  warning: { wrapper: 'bg-amber-50 border-amber-200 text-amber-800', icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" /> },
  danger: { wrapper: 'bg-red-50 border-red-200 text-red-800', icon: <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> },
};

interface AlertProps { type?: AlertType; title?: string; children: ReactNode; className?: string; }

export function Alert({ type = 'info', title, children, className }: AlertProps) {
  const s = styles[type];
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4 text-sm', s.wrapper, className)}>
      {s.icon}
      <div>
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
