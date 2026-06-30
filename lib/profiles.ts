'use client';

import type { IncomeData, BudgetData, InvestmentProfile } from '@/types';

export interface Profile {
  id: string;
  navn: string;
  emoji: string;
  income: Partial<IncomeData>;
  budget: BudgetData;
  investment: Partial<InvestmentProfile>;
  aktuelOpsparing: number;
  createdAt: string;
  updatedAt: string;
}

const PROFILES_KEY = 'dk-finance-profiles-v2';
const ACTIVE_KEY = 'dk-finance-active-profile';
const LEGACY_KEY = 'dk-finance-data';

const DEFAULT_INCOME: Partial<IncomeData> = {
  bruttoIndkomst: 0,
  indkomstType: 'løn',
  trækprocent: 38,
  månedsfradrag: 4142,
  kommune: 'København',
  kirkeskat: false,
  pensionEgenAndel: 0,
  pensionType: 'beløb',
  andreFradrag: 0,
};

const DEFAULT_BUDGET: BudgetData = {
  kategorier: [
    { navn: 'Husleje/boliglån', beløb: 0, type: 'fast', kategori: 'bolig' },
    { navn: 'El, vand, varme', beløb: 0, type: 'fast', kategori: 'bolig' },
    { navn: 'Mad og dagligvarer', beløb: 0, type: 'variabel', kategori: 'mad' },
    { navn: 'Transport', beløb: 0, type: 'variabel', kategori: 'transport' },
    { navn: 'Forsikringer', beløb: 0, type: 'fast', kategori: 'forsikring' },
    { navn: 'Abonnementer', beløb: 0, type: 'fast', kategori: 'abonnementer' },
    { navn: 'Gældsydelser', beløb: 0, type: 'fast', kategori: 'gæld' },
    { navn: 'Opsparing', beløb: 0, type: 'fast', kategori: 'opsparing' },
    { navn: 'Investering', beløb: 0, type: 'fast', kategori: 'investering' },
    { navn: 'Diverse forbrug', beløb: 0, type: 'variabel', kategori: 'forbrug' },
  ],
};

const DEFAULT_INVESTMENT: Partial<InvestmentProfile> = {
  alder: 30,
  tidshorisont: 20,
  risikovillighed: 'middel',
  månedligtOverskud: 0,
  nødopsparingDækket: false,
  gæld: 0,
  mål: 'generel_formue',
};

const EMOJIS = ['👤', '👩', '👨', '👶', '🧑', '👴', '👵', '🏠', '💼', '🎯'];

function makeId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadProfiles(): Profile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: Profile[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
}

export function setActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function createProfile(navn: string, emoji?: string): Profile {
  const profiles = loadProfiles();
  const now = new Date().toISOString();
  const profile: Profile = {
    id: makeId(),
    navn,
    emoji: emoji ?? EMOJIS[profiles.length % EMOJIS.length],
    income: { ...DEFAULT_INCOME },
    budget: { kategorier: DEFAULT_BUDGET.kategorier.map(k => ({ ...k })) },
    investment: { ...DEFAULT_INVESTMENT },
    aktuelOpsparing: 0,
    createdAt: now,
    updatedAt: now,
  };
  profiles.push(profile);
  saveProfiles(profiles);
  return profile;
}

export function updateProfile(id: string, updates: Partial<Omit<Profile, 'id' | 'createdAt'>>): void {
  const profiles = loadProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx === -1) return;
  profiles[idx] = { ...profiles[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProfiles(profiles);
}

export function deleteProfile(id: string): void {
  const profiles = loadProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
}

export function getOrCreateActiveProfile(): Profile {
  let profiles = loadProfiles();

  if (profiles.length === 0 && typeof window !== 'undefined') {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const now = new Date().toISOString();
        const migrated: Profile = {
          id: makeId(),
          navn: 'Min økonomi',
          emoji: '👤',
          income: parsed.income ?? { ...DEFAULT_INCOME },
          budget: parsed.budget ?? { kategorier: DEFAULT_BUDGET.kategorier.map(k => ({ ...k })) },
          investment: parsed.investment ?? { ...DEFAULT_INVESTMENT },
          aktuelOpsparing: parsed.aktuelOpsparing ?? 0,
          createdAt: now,
          updatedAt: now,
        };
        profiles = [migrated];
        saveProfiles(profiles);
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch { /* ignore */ }
  }

  if (profiles.length === 0) {
    const profile = createProfile('Min økonomi', '👤');
    setActiveProfileId(profile.id);
    return profile;
  }

  const activeId = getActiveProfileId();
  const active = profiles.find(p => p.id === activeId) ?? profiles[0];
  setActiveProfileId(active.id);
  return active;
}
