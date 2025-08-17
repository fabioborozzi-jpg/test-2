// Exponential Moving Average helpers for adaptive difficulty
const KEY_PREFIX = 'panda.ema.';

export function ema(prev: number | undefined, value: number, alpha = 0.2): number {
  const p = typeof prev === 'number' && !Number.isNaN(prev) ? prev : undefined;
  if (p === undefined) return value;
  return alpha * value + (1 - alpha) * p;
}

export function getEMA(category: string, fallback = 0): number {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + category);
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

export function updateEMA(category: string, sample: number, alpha = 0.2): number {
  const prev = getEMA(category, undefined as unknown as number);
  const next = ema(prev, sample, alpha);
  try { localStorage.setItem(KEY_PREFIX + category, String(next)); } catch {}
  return next;
}
