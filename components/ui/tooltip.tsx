'use client';

import { useState, ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps { content: string; children?: ReactNode; }

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex items-center gap-1" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help shrink-0" />
      {visible && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-xl bg-slate-800 px-3 py-2 text-xs text-white shadow-xl">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </span>
      )}
    </span>
  );
}
