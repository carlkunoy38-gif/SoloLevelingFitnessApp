'use client';

import { useState, useEffect, useCallback } from 'react';
import type { IncomeData, BudgetData, InvestmentProfile, TaxCalculationResult, BudgetAnalysis } from '@/types';
import { calculateTaxEstimate } from '@/lib/tax/calculations';
import { analyzeBudget } from '@/lib/calculations/budget';
import { suggestInvestmentAllocation, simulateInvestmentGrowth } from '@/lib/investment/allocation';
import {
  loadProfiles, getActiveProfileId, setActiveProfileId,
  createProfile, updateProfile, deleteProfile, getOrCreateActiveProfile,
  type Profile,
} from '@/lib/profiles';
import { hasCompletedOnboarding, markOnboardingComplete } from '@/lib/store';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { BudgetForm } from '@/components/forms/BudgetForm';
import { InvestmentForm } from '@/components/forms/InvestmentForm';
import { TaxSection } from '@/components/dashboard/TaxSection';
import { BudgetSection } from '@/components/dashboard/BudgetSection';
import { InvestmentSection } from '@/components/dashboard/InvestmentSection';
import { OverviewSection } from '@/components/dashboard/OverviewSection';
import { StatusBanner } from '@/components/dashboard/StatusBanner';
import { AiAdvisorSection } from '@/components/dashboard/AiAdvisorSection';
import { MarketDataWidget } from '@/components/dashboard/MarketDataWidget';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { ProfileSwitcher } from '@/components/ui/ProfileSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { exportTaxToCSV, exportBudgetToCSV, exportFullReportToPDF } from '@/lib/export';
import { LayoutDashboard, DollarSign, Wallet, TrendingUp, Download, Sparkles } from 'lucide-react';

type Tab = 'oversigt' | 'indkomst' | 'budget' | 'investering' | 'ai';

const TABS: { id: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { id: 'oversigt', label: 'Oversigt', shortLabel: 'Oversigt', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'indkomst', label: 'Skat', shortLabel: 'Skat', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'budget', label: 'Budget', shortLabel: 'Budget', icon: <Wallet className="w-5 h-5" /> },
  { id: 'investering', label: 'Investering', shortLabel: 'Invest.', icon: <TrendingUp className="w-5 h-5" /> },
  { id: 'ai', label: 'AI Rådgiver', shortLabel: 'AI', icon: <Sparkles className="w-5 h-5" /> },
];

function computeFromProfile(profile: Profile): { tax: TaxCalculationResult | null; budget: BudgetAnalysis | null } {
  if (!profile.income.bruttoIndkomst || profile.income.bruttoIndkomst === 0) {
    return { tax: null, budget: null };
  }
  const tax = calculateTaxEstimate(profile.income as IncomeData);
  const budget = analyzeBudget(tax.nettoIndkomst, profile.budget, profile.aktuelOpsparing);
  return { tax, budget };
}

export function Dashboard() {
  const [tab, setTab] = useState<Tab>('oversigt');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null);
  const [saved, setSaved] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);

  const activeProfile = profiles.find(p => p.id === activeId) ?? null;

  const refreshComputations = useCallback((profile: Profile) => {
    const { tax, budget } = computeFromProfile(profile);
    setTaxResult(tax);
    setBudgetAnalysis(budget);
  }, []);

  useEffect(() => {
    const profile = getOrCreateActiveProfile();
    const all = loadProfiles();
    setProfiles(all);
    setActiveId(profile.id);
    refreshComputations(profile);
    setReady(true);
    if (!hasCompletedOnboarding()) setShowOnboarding(true);
  }, [refreshComputations]);

  function switchProfile(id: string) {
    setActiveProfileId(id);
    setActiveId(id);
    const profile = loadProfiles().find(p => p.id === id);
    if (profile) refreshComputations(profile);
  }

  function handleCreateProfile(navn: string) {
    const profile = createProfile(navn);
    const all = loadProfiles();
    setProfiles(all);
    switchProfile(profile.id);
  }

  function handleDeleteProfile(id: string) {
    deleteProfile(id);
    const all = loadProfiles();
    setProfiles(all);
    if (id === activeId && all.length > 0) {
      switchProfile(all[0].id);
    }
  }

  function handleRenameProfile(id: string, navn: string) {
    updateProfile(id, { navn });
    setProfiles(loadProfiles());
  }

  function saveActiveProfile(updates: Partial<Profile>) {
    if (!activeId) return;
    updateProfile(activeId, updates);
    setProfiles(loadProfiles());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleOnboardingComplete(income: IncomeData, budget: BudgetData) {
    markOnboardingComplete();
    setShowOnboarding(false);
    const tax = calculateTaxEstimate(income);
    setTaxResult(tax);
    const ba = analyzeBudget(tax.nettoIndkomst, budget, 0);
    setBudgetAnalysis(ba);
    saveActiveProfile({ income, budget, aktuelOpsparing: 0 });
  }

  function handleOnboardingSkip() {
    markOnboardingComplete();
    setShowOnboarding(false);
  }

  function handleIncomeSubmit(income: IncomeData) {
    const tax = calculateTaxEstimate(income);
    setTaxResult(tax);
    const profile = loadProfiles().find(p => p.id === activeId);
    const ba = analyzeBudget(tax.nettoIndkomst, profile?.budget ?? activeProfile!.budget, profile?.aktuelOpsparing ?? 0);
    setBudgetAnalysis(ba);
    saveActiveProfile({ income });
    setTab('oversigt');
  }

  function handleBudgetSubmit(budget: BudgetData) {
    if (!taxResult) return;
    const profile = loadProfiles().find(p => p.id === activeId);
    const ba = analyzeBudget(taxResult.nettoIndkomst, budget, profile?.aktuelOpsparing ?? 0);
    setBudgetAnalysis(ba);
    saveActiveProfile({ budget });
    setTab('oversigt');
  }

  function handleInvestmentSubmit(investment: InvestmentProfile) {
    saveActiveProfile({ investment });
    setTab('oversigt');
  }

  function handleExportPDF() {
    if (!taxResult) return;
    const profile = loadProfiles().find(p => p.id === activeId);
    const inv = profile?.investment as InvestmentProfile | undefined;
    const sim = inv?.alder
      ? simulateInvestmentGrowth(
          inv.månedligtOverskud ?? 1000,
          inv.tidshorisont ?? 20,
          suggestInvestmentAllocation(inv),
        )
      : null;
    exportFullReportToPDF(taxResult, budgetAnalysis!, sim);
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-slate-400 text-sm">Indlæser…</div>
      </div>
    );
  }

  const investmentProfile = activeProfile?.investment as InvestmentProfile | undefined;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {showOnboarding && (
        <OnboardingWizard onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 truncate">Dansk Økonomiapp</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Skat · Budget · Investering · 2025</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ProfileSwitcher
              profiles={profiles}
              activeId={activeId}
              onSwitch={switchProfile}
              onCreate={handleCreateProfile}
              onDelete={handleDeleteProfile}
              onRename={handleRenameProfile}
            />

            <div className="hidden sm:flex items-center gap-1">
              <label className="text-xs text-slate-500">Nødopsp.:</label>
              <input
                type="number"
                value={activeProfile?.aktuelOpsparing ?? 0}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  updateProfile(activeId, { aktuelOpsparing: v });
                  setProfiles(loadProfiles());
                  if (taxResult && activeProfile) {
                    setBudgetAnalysis(analyzeBudget(taxResult.nettoIndkomst, activeProfile.budget, v));
                  }
                }}
                className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs"
                placeholder="0"
              />
              <span className="text-xs text-slate-400">kr.</span>
            </div>

            {taxResult && budgetAnalysis && (
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            )}
          </div>
        </div>

        <div className="hidden md:flex max-w-6xl mx-auto px-4 gap-1 pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-sm font-medium transition-colors ${
                tab === t.id
                  ? t.id === 'ai' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-4">
        <StatusBanner
          tax={taxResult}
          budget={budgetAnalysis}
          onGoToBudget={() => setTab('budget')}
          onGoToIncome={() => setTab('indkomst')}
        />

        {tab === 'oversigt' && (
          <OverviewSection
            taxResult={taxResult}
            budgetAnalysis={budgetAnalysis}
            onGoToIncome={() => setTab('indkomst')}
            onGoToBudget={() => setTab('budget')}
            onGoToInvestment={() => setTab('investering')}
            onExportCSVTax={() => taxResult && exportTaxToCSV(taxResult)}
            onExportCSVBudget={() => budgetAnalysis && exportBudgetToCSV(budgetAnalysis)}
          />
        )}

        {tab === 'indkomst' && (
          <div className="space-y-5">
            <Card>
              <CardContent className="pt-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Indkomst & Skatteestimat</h2>
                <IncomeForm
                  defaultValues={activeProfile?.income as Partial<IncomeData>}
                  onSubmit={handleIncomeSubmit}
                />
              </CardContent>
            </Card>
            {taxResult && <TaxSection result={taxResult} />}
          </div>
        )}

        {tab === 'budget' && (
          <div className="space-y-5">
            <Card>
              <CardContent className="pt-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Budgetplanlægning</h2>
                {!taxResult && (
                  <p className="text-sm text-amber-600 mb-4">
                    Indtast indkomst først for at se rådighedsbeløb i realtid.
                  </p>
                )}
                <BudgetForm
                  defaultValues={activeProfile?.budget}
                  nettoIndkomst={taxResult?.nettoIndkomst ?? 0}
                  onSubmit={handleBudgetSubmit}
                />
              </CardContent>
            </Card>
            {budgetAnalysis && (
              <BudgetSection
                analysis={budgetAnalysis}
                onGoToBudgetForm={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            )}
          </div>
        )}

        {tab === 'investering' && (
          <div className="space-y-5">
            <MarketDataWidget />
            <Card>
              <CardContent className="pt-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Investeringsprofil</h2>
                <InvestmentForm
                  defaultValues={activeProfile?.investment as Partial<InvestmentProfile>}
                  onSubmit={handleInvestmentSubmit}
                />
              </CardContent>
            </Card>
            {investmentProfile?.alder && (
              <InvestmentSection profile={investmentProfile} />
            )}
          </div>
        )}

        {tab === 'ai' && (
          <AiAdvisorSection taxResult={taxResult} budgetAnalysis={budgetAnalysis} />
        )}
      </main>

      <footer className="hidden md:block mt-16 border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Alle beregninger er estimater baseret på Skattestyrelsens satser for 2025.
            Appen udgør ikke autoriseret skatte- eller investeringsrådgivning.
          </p>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30">
        <div className="flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors ${
                tab === t.id
                  ? t.id === 'ai' ? 'text-indigo-600' : 'text-blue-600'
                  : 'text-slate-400'
              }`}
            >
              <span className={`transition-transform ${tab === t.id ? 'scale-110' : ''}`}>
                {t.icon}
              </span>
              {t.shortLabel}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
