import React, { useMemo, useRef, useState } from 'react';
import { VERBS, conjugate, acceptedAnswers, Tense, Pronoun } from '../data/conjugations';
import { addOrUpdateError } from '../services/errorService';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';
import { useProgress } from '../hooks/useProgress';

function normalize(s: string){ return (s||'').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/["'’]/g,'').replace(/\s+/g,' ').trim(); }

export default function ConjugationExercise(){
  const { level, recordResult } = useAdaptiveDifficulty('translations');
  const { addXP } = useProgress() as any;
  const pronouns: Pronoun[] = ['I','You','He','She','It','We','They'];
  const tenses: Tense[] = ['Present Simple','Past Simple','Present Continuous','Future Simple'];
  const [verb, setVerb] = useState(() => VERBS[Math(Math()*VERBS)]);
  const [pronoun, setPronoun] = useState<Pronoun>('I');
  const [tense, setTense] = useState<Tense>('Past Simple');
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<null|string>(null);

  const expected = useMemo(()=> conjugate(verb as string, tense, pronoun), [verb, tense, pronoun]);
  const accepted = useMemo(()=> acceptedAnswers(verb as string, tense, pronoun).map(s=> normalize(s)), [verb, tense, pronoun]);

  const onCheck = ()=>{
    const attempt = normalize(value);
    const ok = accepted(attempt) || attempt === normalize(expected);
    setFeedback(ok ? 'Correct!' : `Incorrect — expected: ${expected}`);
    recordResult(ok);
    if(ok){
      try{ addXP(12); }catch(e){}
      // pick new challenge
      setVerb(VERBS[Math(Math()*VERBS)] as any);
      setPronoun(pronouns[Math(Math()*pronouns)]);
      setTense(tenses[Math(Math()*tenses)]);
      setValue('');
    } else {
      try{ addOrUpdateError({ type: 'conjugation', level, prompt: pronoun + ' ' + verb + ' → ' + tense, expected, userAnswer: value }); }catch(e){}
    }
  };

  return (
    <div className="card">
      <h3>Conjugations — Input (improved)</h3>
      <div className="muted">Level: {level}</div>
      <div style={{marginTop:12}}>
        <label className="muted">Pronoun</label>
        <select value={pronoun} onChange={e=> setPronoun(e.value as Pronoun)}>
          {pronouns(p=> <option key={p} value={p}>{p}</option>)}
        </select>
        <label style={{marginLeft:12}} className="muted">Tense</label>
        <select value={tense} onChange={e=> setTense(e.value as Tense)}>
          {tenses(t=> <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div style={{marginTop:12}}>
        <div>Verb: <b>{verb}</b></div>
        <div style={{marginTop:8, display:'flex', gap:8}}>
          <input placeholder="Type the correct form" value={value} onChange={e=>setValue(e.value)} onKeyDown={e=>{ if(e==='Enter') onCheck(); }} style={{minWidth:260}} />
          <button onClick={onCheck}>Check</button>
        </div>
        {feedback && <div style={{marginTop:10}}>{feedback}</div>}
      </div>
    </div>
  )
}
