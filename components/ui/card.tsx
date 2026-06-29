import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps { className?: string; children: ReactNode; }

export function Card({ className, children }: CardProps) {
  return <div className={cn('rounded-2xl border border-slate-200 bg-white shadow-sm', className)}>{children}</div>;
}
export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('px-6 py-4 border-b border-slate-100', className)}>{children}</div>;
}
export function CardTitle({ className, children }: CardProps) {
  return <h3 className={cn('text-lg font-semibold text-slate-800', className)}>{children}</h3>;
}
export function CardContent({ className, children }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}
