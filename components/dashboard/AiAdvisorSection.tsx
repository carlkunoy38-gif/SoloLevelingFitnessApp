'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import type { TaxCalculationResult, BudgetAnalysis } from '@/types';
import { formatKr, formatPct } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AiAdvisorSectionProps {
  taxResult: TaxCalculationResult | null;
  budgetAnalysis: BudgetAnalysis | null;
}

const SUGGESTED = [
  'Hvad skal jeg prioritere nu?',
  'Kan jeg spare mere op?',
  'Er min gæld bekymrende?',
  'Hvornår kan jeg tåle at købe bolig?',
  'Hvad betyder min opsparingsrate?',
  'Giv mig 3 konkrete sparetips',
];

function buildContext(tax: TaxCalculationResult | null, budget: BudgetAnalysis | null): string {
  if (!tax) return 'Brugeren har endnu ikke indtastet indkomstoplysninger.';

  const lines: string[] = [
    `Bruttoindkomst: ${formatKr(tax.bruttoIndkomst)}/mdr.`,
    `Nettoindkomst: ${formatKr(tax.nettoIndkomst)}/mdr.`,
    `Effektiv skatteprocent: ${formatPct(tax.effektivSkatteprocent)}`,
    `Marginalskat: ${formatPct(tax.marginalSkatteprocent)}`,
  ];

  if (budget) {
    lines.push(
      `Rådighedsbeløb: ${formatKr(budget.rådighedsbeløb)}/mdr.`,
      `Opsparingsrate: ${budget.opsparingsrate.toFixed(1)}%`,
      `Faste udgifter: ${formatKr(budget.fasteUdgifter)}/mdr.`,
      `Variable udgifter: ${formatKr(budget.variableUdgifter)}/mdr.`,
      `Gældsgrad: ${budget.gældsgrad.toFixed(1)}% af nettoindkomst`,
      `Nødopsparing dækning: ${budget.nødopsparingDækning.toFixed(1)} måneder (anbefalet: 3-6)`,
      `Budgetstatus: ${budget.budgetStatus}`,
    );
    if (budget.optimeringer.length > 0) {
      lines.push(`Optimeringsforslag: ${budget.optimeringer.map(o => o.beskrivelse).join('; ')}`);
    }
  } else {
    lines.push('Budget: Ikke udfyldt endnu.');
  }

  return lines.join('\n');
}

export function AiAdvisorSection({ taxResult, budgetAnalysis }: AiAdvisorSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(question: string) {
    if (!question.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          financialContext: buildContext(taxResult, budgetAnalysis),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Fejl');
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ukendt fejl');
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col gap-4">
      {isEmpty && (
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Finansassistenten</h2>
              <p className="text-indigo-200 text-xs">Stillet ind på din økonomi</p>
            </div>
          </div>
          <p className="text-sm text-indigo-100 leading-relaxed">
            {taxResult
              ? `Jeg kender din økonomi — ${formatKr(taxResult.nettoIndkomst)}/mdr. til rådighed efter skat. Stil mig et spørgsmål.`
              : 'Indtast din indkomst i Skat-fanen, så kan jeg give dig personlige råd.'}
          </p>
        </div>
      )}

      {isEmpty && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Prøv at spørge</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-xs rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5" />
                    : <Bot className="w-3.5 h-3.5" />
                  }
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-700" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-100 px-4 py-2 flex gap-2 overflow-x-auto">
            {SUGGESTED.slice(0, 3).map(q => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs text-slate-500 whitespace-nowrap hover:text-indigo-600 transition-colors shrink-0"
              >
                {q} →
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Stil et spørgsmål om din økonomi…"
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-indigo-600 px-4 py-3 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 text-center">AI-vejlederen er ikke autoriseret finansiel rådgivning</p>
    </div>
  );
}
