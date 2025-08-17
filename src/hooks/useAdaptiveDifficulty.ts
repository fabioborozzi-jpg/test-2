import { useEffect, useMemo, useState } from 'react';
<<<<<<< HEAD
import type { CEFR } from '../types/levels';
=======
import { CEFR } from '../types/levels';
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
import { getEMA, updateEMA } from '../lib/ema';

const THRESHOLDS: Array<{ min: number; level: CEFR }> = [
  { min: 0.00, level: 'A1' },
  { min: 0.55, level: 'A2' },
  { min: 0.65, level: 'B1' },
  { min: 0.75, level: 'B2' },
  { min: 0.85, level: 'C1' },
  { min: 0.93, level: 'C2' },
];

function levelFromScore(s: number): CEFR {
  let chosen: CEFR = 'A1';
  for (const t of THRESHOLDS) {
    if (s >= t.min) chosen = t.level;
  }
  return chosen;
}

export function useAdaptiveDifficulty(category: string) {
  const [ema, setEma] = useState<number>(() => getEMA(category, 0));

  useEffect(() => {
    // reload when category changes
    setEma(getEMA(category, 0));
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'panda.ema.' + category) {
        const s = Number(e.newValue);
        if (Number.isFinite(s)) setEma(s);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [category]);

  const level = useMemo(() => levelFromScore(ema), [ema]);

  const recordResult = (correct: boolean) => {
    const sample = correct ? 1 : 0;
    const v = updateEMA(category, sample);
    setEma(v);
  };

  return { ema, level, recordResult };
}
