// Simpel SQLite-database via better-sqlite3
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'data.db');
let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.exec(`CREATE TABLE IF NOT EXISTS financial_profiles (
      id TEXT PRIMARY KEY,
      navn TEXT NOT NULL DEFAULT 'Min økonomi',
      income_data TEXT NOT NULL DEFAULT '{}',
      budget_data TEXT NOT NULL DEFAULT '{}',
      investment_data TEXT NOT NULL DEFAULT '{}',
      aktuel_opsparing REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`);
  }
  return _db;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export interface DbProfile {
  id: string; navn: string; incomeData: string; budgetData: string;
  investmentData: string; aktuelOpsparing: number; createdAt: string; updatedAt: string;
}

type DbRow = { id: string; navn: string; income_data: string; budget_data: string; investment_data: string; aktuel_opsparing: number; created_at: string; updated_at: string; };

const mapRow = (r: DbRow): DbProfile => ({ id: r.id, navn: r.navn, incomeData: r.income_data, budgetData: r.budget_data, investmentData: r.investment_data, aktuelOpsparing: r.aktuel_opsparing, createdAt: r.created_at, updatedAt: r.updated_at });

export function getAllProfiles(): DbProfile[] {
  return (getDb().prepare('SELECT * FROM financial_profiles ORDER BY updated_at DESC').all() as DbRow[]).map(mapRow);
}

export function getProfile(id: string): DbProfile | null {
  const row = getDb().prepare('SELECT * FROM financial_profiles WHERE id = ?').get(id) as DbRow | undefined;
  return row ? mapRow(row) : null;
}

export function saveProfile(profile: Omit<DbProfile, 'id' | 'createdAt' | 'updatedAt'>): DbProfile {
  const db = getDb(); const now = new Date().toISOString(); const id = generateId();
  db.prepare('INSERT INTO financial_profiles (id, navn, income_data, budget_data, investment_data, aktuel_opsparing, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, profile.navn, profile.incomeData, profile.budgetData, profile.investmentData, profile.aktuelOpsparing, now, now);
  return { ...profile, id, createdAt: now, updatedAt: now };
}

export function updateProfile(id: string, profile: Partial<Omit<DbProfile, 'id' | 'createdAt'>>): DbProfile | null {
  const existing = getProfile(id); if (!existing) return null;
  const now = new Date().toISOString(); const updated = { ...existing, ...profile, updatedAt: now };
  getDb().prepare('UPDATE financial_profiles SET navn = ?, income_data = ?, budget_data = ?, investment_data = ?, aktuel_opsparing = ?, updated_at = ? WHERE id = ?')
    .run(updated.navn, updated.incomeData, updated.budgetData, updated.investmentData, updated.aktuelOpsparing, now, id);
  return updated;
}

export function deleteProfile(id: string): boolean {
  return getDb().prepare('DELETE FROM financial_profiles WHERE id = ?').run(id).changes > 0;
}
