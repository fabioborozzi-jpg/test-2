import React, { useMemo, useState } from 'react';
import { VERBS, conjugate, acceptedAnswers, Tense, Pronoun } from '../data/conjugations';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';

function normalize(s: string){ return (s || '').toLowerCase().replace(/[“”"']/g,'').trim(); }

const PRONOUNS: Pronoun[] = ['I','You','He','She','It','We','They'];
const TENSES: Tense[] = ['Present Simple','Past Simple','Present Continuous','Future Simple'];

export default function ConjugationExercise(){
<<<<<<< HEAD
  const { level, recordResult } = useAdaptiveDifficulty('conjugations');
  const [verb, setVerb] = useState<string>(() => VERBS[Math.floor(Math.random() * VERBS.length)]);
=======
  const { level, recordResult } = useAdaptiveDifficulty('translations');
  const { addXP } = useProgress() as any;
  const pronouns: Pronoun[] = ['I','You','He','She','It','We','They'];
  const tenses: Tense[] = ['Present Simple','Past Simple','Present Continuous','Future Simple'];
  const [verb, setVerb] = useState(() => VERBS[Math(Math()*VERBS)]);
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
  const [pronoun, setPronoun] = useState<Pronoun>('I');
  const [tense, setTense] = useState<Tense>('Past Simple');
  const [value, setValue] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const expected = useMemo(()=> conjugate(verb, tense, pronoun), [verb, tense, pronoun]);
  const hints = useMemo(()=> acceptedAnswers(verb, tense, pronoun), [verb, tense, pronoun]);

<<<<<<< HEAD
  const onCheck = () => {
    const ok = hints.includes(normalize(value));
    recordResult(ok);
    setFeedback(ok ? '✅ Correct!' : `❌ Expected: ${expected}`);
    if (ok) {
      // next round
      setVerb(VERBS[Math.floor(Math.random() * VERBS.length)]);
=======
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
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
      setValue('');
    }
  };

  return (
<<<<<<< HEAD
    <div>
      <div style={{ display:'flex', gap:8 }}>
        <select value={pronoun} onChange={e=> setPronoun(e.target.value as Pronoun)}>
          {PRONOUNS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={tense} onChange={e=> setTense(e.target.value as Tense)}>
          {TENSES.map(t => <option key={t} value={t}>{t}</option>)}
=======
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
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
        </select>
      </div>
      <div style={{marginTop:12}}>
        <div>Verb: <b>{verb}</b> | Level: {level}</div>
        <div style={{marginTop:8, display:'flex', gap:8}}>
<<<<<<< HEAD
          <input placeholder="Type the correct form" value={value} onChange={e=> setValue(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') onCheck(); }} style={{minWidth:260}} />
=======
          <input placeholder="Type the correct form" value={value} onChange={e=>setValue(e.value)} onKeyDown={e=>{ if(e==='Enter') onCheck(); }} style={{minWidth:260}} />
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
          <button onClick={onCheck}>Check</button>
        </div>
        {feedback && <div style={{marginTop:10}}>{feedback}</div>}
      </div>
    </div>
  );
}
