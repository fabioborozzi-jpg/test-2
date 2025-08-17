export type Progress = { userId?: string; xp: number; streak: number; achievements: string[]; level: string; updatedAt?: string };

const KEY = 'panda.progress.v1';

function loadLocal(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Progress : { xp:0, streak:0, achievements:[], level:'A1' };
  } catch { return { xp:0, streak:0, achievements:[], level:'A1' }; }
}
function saveLocal(p: Progress){
  try{ localStorage.setItem(KEY, JSON.stringify(p)); }catch{}
}

export function getProgress(): Progress { return loadLocal(); }
export function setLevel(level: string){ const p = loadLocal(); p.level = level; p.updatedAt = new Date().toISOString(); saveLocal(p); }
export function addXP(delta: number){ const p = loadLocal(); p.xp = (p.xp||0) + delta; p.updatedAt = new Date().toISOString(); saveLocal(p); }
export function addAchievement(a: string){ const p = loadLocal(); if(!p.achievements.includes(a)) p.achievements.push(a); p.updatedAt = new Date().toISOString(); saveLocal(p); }

// Re-export EMA helpers for backward compatibility (old imports referenced services)
const EMA_PREFIX = 'panda.ema.';
export function getEMA(category: string, fallback = 0): number {
  try {
    const raw = localStorage.getItem(EMA_PREFIX + category);
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}
export function updateEMA(category: string, sample: number, alpha = 0.2): number {
  const prev = getEMA(category, undefined as unknown as number);
  const next = (prev === undefined || Number.isNaN(prev)) ? sample : (alpha * sample + (1 - alpha) * prev);
  try { localStorage.setItem(EMA_PREFIX + category, String(next)); } catch {}
  return next;
}
