import React, { useMemo, useState } from 'react';
import { translationsA1 } from '@/data/translationsA1';
import { translationsA2 } from '@/data/translationsA2';

type Level = 'A1'|'A2';
export default function TranslationExercise({ level='A1' }: { level?: Level }){
  const dataset = level==='A2' ? translationsA2 : translationsA1;
  const [i,setI] = useState(0);
  const item = dataset[i % dataset.length];
  const [value,setValue] = useState('');
  const [feedback,setFeedback] = useState('');

  const ask = useMemo(() => item.en, [item]);
  const answer = useMemo(() => item.it.toLowerCase(), [item]);

  const check = () => {
    const ok = value.trim().toLowerCase() === answer;
    setFeedback(ok ? '✅' : `❌ ${answer}`);
    if (ok){ setI(i+1); setValue(''); }
  };

  return <div>
    <div style={{marginBottom:8}}>Translate to Italian: <b>{ask}</b></div>
    <input value={value} onChange={e=> setValue(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') check(); }} />
    <button onClick={check} style={{marginLeft:8}}>Check</button>
    {feedback && <div style={{marginTop:8}}>{feedback}</div>}
  </div>;
}
