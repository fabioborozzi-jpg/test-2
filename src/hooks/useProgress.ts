import { useEffect, useState } from 'react';
import type { Progress } from '../services/progressService';
import { getProgress, addXP as svcAddXP, addAchievement as svcAddAch, setLevel as svcSetLevel } from '../services/progressService';

export function useProgress(){
  const [progress, setProgress] = useState<Progress>({ xp:0, streak:0, achievements:[], level:'A1' });

  useEffect(()=>{
    setProgress(getProgress());
  }, []);

  const addXP = async (amount: number)=>{
    svcAddXP(amount);
    setProgress(getProgress());
  };
  const addAchievement = async (id: string)=>{
    svcAddAch(id);
    setProgress(getProgress());
  };
  const setLevel = async (level: string)=>{
    svcSetLevel(level);
    setProgress(getProgress());
  };
  const reset = async ()=>{
    // simple reset by overwriting local storage
    svcSetLevel('A1');
  };

  return { progress, addXP, addAchievement, setLevel, reset };
}
