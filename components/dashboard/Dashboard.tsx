'use client';

import { useState, useEffect } from 'react';
import type { IncomeData, BudgetData, InvestmentProfile, TaxCalculationResult, BudgetAnalysis } from '@/types';
import { calculateTaxEstimate } from '@/lib/tax/calculations';
import { analyzeBudget } from '@/lib/calculations/budget';
import { suggestInvestmentAllocation, simulateInvestmentGrowth } from '@/lib/investment/allocation';
import { loadState, saveState, hasCompletedOnboarding, markOnboardingComplete, type AppState } from '@/lib/store';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { BudgetForm } from '@/components/forms/BudgetForm';
import { InvestmentForm } from '@/components/forms/InvestmentForm';
import { TaxSection } from '@/components/dashboard/TaxSection';
import { BudgetSection } from '@/components/dashboard/BudgetSection';
import { InvestmentSection } from '@/components/dashboard/InvestmentSection';
import { OverviewSection } from '@/components/dashboard/OverviewSection';
import { StatusBanner } from '@/components/dashboard/StatusBanner';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { Card, CardContent } from '@/components/ui/card';
import { exportTaxToCSV, exportBudgetToCSV, exportFullReportToPDF } from '@/lib/export';
import { LayoutDashboard, DollarSign, Wallet, TrendingUp, Download, Save } from 'lucide-react';

type Tab = 'oversigt' | 'indkomst' | 'budget' | 'investering';

const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'oversigt', label: 'Oversigt', shortLabel: 'Oversigt', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'indkomst', label: 'Indkomst & Skat', shortLabel: 'Skat', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'budget', label: 'Budget', shortLabel: 'Budget', icon: <Wallet className="w-5 h-5" /> },
  { id: 'investering', label: 'Investering', shortLabel: 'Invest.', icon: <TrendingUp className="w-5 h-5" /> },
];

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('oversigt');
  const [state, setState] = useState<AppState | null>(null);
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [aktuelOpsparing, setAktuelOpsparing] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setAktuelOpsparing(loaded.aktuelOpsparing);
    if (loaded.income.bruttoIndkomst && loaded.income.bruttoIndkomst > 0) {
      const tax = calculateTaxEstimate(loaded.income as IncomeData);
      setTaxResult(tax);
      const analysis = analyzeBudget(tax.nettoIndkomst, loaded.budget, loaded.aktuelOpsparing);
      setBudgetAnalysis(analysis);
    }
    if (!hasCompletedOnboarding()) setShowOnboarding(true);
  }, []);

  function handleOnboardingComplete(income: IncomeData, budget: BudgetData) {
    markOnboardingComplete();
    setShowOnboarding(false);
    const tax = calculateTaxEstimate(income);
    setTaxResult(tax);
    const analysis = analyzeBudget(tax.nettoIndkomst, budget, 0);
    setBudgetAnalysis(analysis);
    const newState = { ...state!, income, budget };
    setState(newState);
    saveState(newState);
  }

  function handleOnboardingSkip() {
    markOnboardingComplete();
    setShowOnboarding(false);
  }

  function handleIncomeSubmit(income: IncomeData) {
    const tax = calculateTaxEstimate(income);
    setTaxResult(tax);
    const newState = { ...state!, income };
    const analysis = analyzeBudget(tax.nettoIndkomst, newState.budget, aktuelOpsparing);
    setBudgetAnalysis(analysis);
    setState(newState);
    setTab('oversigt');
  }

  function handleBudgetSubmit(budget: BudgetData) {
    if (!taxResult) return;
    const analysis = analyzeBudget(taxResult.nettoIndkomst, budget, aktuelOpsparing);
    setBudgetAnalysis(analysis);
    const newState = { ...state!, budget };
    setState(newState);
    setTab('oversigt');
  }

  function handleInvestmentSubmit(investment: InvestmentProfile) {
    setState({ ...state!, investment });
    setTab('oversigt');
  }

  function handleSave() {
    if (!state) return;
    saveState({ ...state, aktuelOpsparing });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleExportPDF() {
    if (!taxResult) return;
    const sim = state?.investment?.alder
      ? simulateInvestmentGrowth(
          state.investment.månedligtOverskud ?? 1000,
          state.investment.tidshorisont ?? 20,
          suggestInvestmentAllocation(state.investment as InvestmentProfile),
        ) : null;
    exportFullReportToPDF(taxResult, budgetAnalysis!, sim);
  }

  if (!state) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-slate-400 text-sm">Indlæser...</div>
    </div>
  );

  const investmentProfile = state.investment as InvestmentProfile | undefined;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Dansk Økonomiapp</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Skat · Budget · Investering · 2025-satser</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <label className="text-xs text-slate-500">Nødopsparing:</label>
              <input type="number" value={aktuelOpsparing}
                onChange={(e) => { const v = Number(e.target.value); setAktuelOpsparing(v); if (taxResult && state.budget) setBudgetAnalysis(analyzeBudget(taxResult.nettoIndkomst, state.budget, v)); }}
                className="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs" placeholder="0 kr." />
              <span className="text-xs text-slate-400">kr.</span>
            </div>
            <button onClick={handleSave}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{saved ? 'Gemt!' : 'Gem'}</span>
            </button>
            {taxResult && budgetAnalysis && (
              <button onClick={handleExportPDF}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            )}
          </div>
        </div>
        <div className="hidden md:flex max-w-6xl mx-auto px-4 gap-1 pb-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        <StatusBanner tax={taxResult} budget={budgetAnalysis} />

        {tab === 'oversigt' && <OverviewSection taxResult={taxResult} budgetAnalysis={budgetAnalysis}
          onGoToIncome={() => setTab('indkomst')} onGoToBudget={() => setTab('budget')}
          onGoToInvestment={() => setTab('investering')}
          onExportCSVTax={() => taxResult && exportTaxToCSV(taxResult)}
          onExportCSVBudget={() => budgetAnalysis && exportBudgetToCSV(budgetAnalysis)} />}

        {tab === 'indkomst' && (
          <div className="space-y-5">
            <Card><CardContent className="pt-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Indkomst & Skatteestimat</h2>
              <IncomeForm defaultValues={state.income as Partial<IncomeData>} onSubmit={handleIncomeSubmit} />
            </CardContent></Card>
            {taxResult && <TaxSection result={taxResult} />}
          </div>
        )}

        {tab === 'budget' && (
          <div className="space-y-5">
            <Card><CardContent className="pt-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-1">Budgetplanlægning</h2>
              {!taxResult && <p className="text-sm text-amber-600 mb-4">Indtast indkomst først for at se rådighedsbeløb i realtid.</p>}
              <BudgetForm defaultValues={state.budget} nettoIndkomst={taxResult?.nettoIndkomst ?? 0} onSubmit={handleBudgetSubmit} />
            </CardContent></Card>
            {budgetAnalysis && <BudgetSection analysis={budgetAnalysis} />}
          </div>
        )}

        {tab === 'investering' && (
          <div className="space-y-5">
            <Card><CardContent className="pt-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Investeringsprofil</h2>
              <InvestmentForm defaultValues={state.investment as Partial<InvestmentProfile>} onSubmit={handleInvestmentSubmit} />
            </CardContent></Card>
            {investmentProfile?.alder && <InvestmentSection profile={investmentProfile} />}
          </div>
        )}
      </main>

      <footer className="hidden md:block mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Alle beregninger er estimater baseret på Skattestyrelsens offentliggjorte satser for skatteåret 2025.
            Appen udgør ikke autoriseret skatte- eller investeringsrådgivning.
          </p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30">
        <div className="flex">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${tab === t.id ? 'text-blue-600' : 'text-slate-400'}`}>
              {t.icon}
              {t.shortLabel}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
