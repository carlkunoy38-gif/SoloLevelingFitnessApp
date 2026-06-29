'use client';

import { useState } from 'react';
import { Plus, Trash2, Check, X, Pencil } from 'lucide-react';
import type { Profile } from '@/lib/profiles';

interface ProfileSwitcherProps {
  profiles: Profile[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: (navn: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, navn: string) => void;
}

const EMOJIS = ['👤', '👩', '👨', '👶', '🧑', '👴', '👵', '🏠', '💼', '🎯'];

export function ProfileSwitcher({ profiles, activeId, onSwitch, onCreate, onDelete, onRename }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [newNavn, setNewNavn] = useState('');
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const active = profiles.find(p => p.id === activeId);

  function handleCreate() {
    if (!newNavn.trim()) return;
    onCreate(newNavn.trim());
    setNewNavn('');
    setCreating(false);
  }

  function handleRename(id: string) {
    if (!renameValue.trim()) return;
    onRename(id, renameValue.trim());
    setRenamingId(null);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
      >
        <span>{active?.emoji ?? '👤'}</span>
        <span className="max-w-[80px] truncate hidden sm:inline">{active?.navn ?? 'Profil'}</span>
        <span className="text-slate-400">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Profiler</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {profiles.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 ${p.id === activeId ? 'bg-blue-50' : ''}`}>
                  {renamingId === p.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleRename(p.id); if (e.key === 'Escape') setRenamingId(null); }}
                        className="flex-1 text-xs border border-blue-300 rounded-lg px-2 py-1 outline-none"
                      />
                      <button onClick={() => handleRename(p.id)} className="text-emerald-600 hover:text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setRenamingId(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { onSwitch(p.id); setOpen(false); }}
                        className="flex-1 flex items-center gap-2 text-left"
                      >
                        <span>{p.emoji ?? EMOJIS[i % EMOJIS.length]}</span>
                        <span className="text-sm text-slate-700 truncate">{p.navn}</span>
                        {p.id === activeId && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto shrink-0" />}
                      </button>
                      <button
                        onClick={() => { setRenamingId(p.id); setRenameValue(p.navn); }}
                        className="text-slate-300 hover:text-slate-500 p-0.5"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      {profiles.length > 1 && (
                        <button
                          onClick={() => { if (confirm(`Slet "${p.navn}"?`)) onDelete(p.id); }}
                          className="text-slate-300 hover:text-red-500 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100">
              {creating ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={newNavn}
                    onChange={e => setNewNavn(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false); }}
                    placeholder="Navn på profil…"
                    className="flex-1 text-xs border border-blue-300 rounded-lg px-2 py-1.5 outline-none"
                  />
                  <button onClick={handleCreate} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Opret
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCreating(true)}
                  className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-700 w-full"
                >
                  <Plus className="w-3.5 h-3.5" /> Ny profil
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
