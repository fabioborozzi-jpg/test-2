export type Tense = 'Present Simple' | 'Past Simple' | 'Present Continuous' | 'Future Simple';
export type Pronoun = 'I'|'You'|'He'|'She'|'It'|'We'|'They';

export const IRREGULARS: Record<string, { past: string; pastPart?: string; present3?: string }> = {
  be: { past: 'was/were', pastPart: 'been', present3: 'is' },
  have: { past: 'had', pastPart: 'had', present3: 'has' },
  do: { past: 'did', pastPart: 'done', present3: 'does' },
  go: { past: 'went', pastPart: 'gone', present3: 'goes' },
  eat: { past: 'ate', pastPart: 'eaten', present3: 'eats' },
  see: { past: 'saw', pastPart: 'seen', present3: 'sees' },
  come: { past: 'came', pastPart: 'come', present3: 'comes' },
  take: { past: 'took', pastPart: 'taken', present3: 'takes' },
  make: { past: 'made', pastPart: 'made', present3: 'makes' },
  get: { past: 'got', pastPart: 'got', present3: 'gets' },
  give: { past: 'gave', pastPart: 'given', present3: 'gives' },
  read: { past: 'read', pastPart: 'read', present3: 'reads' },
  write: { past: 'wrote', pastPart: 'written', present3: 'writes' },
  run: { past: 'ran', pastPart: 'run', present3: 'runs' },
  buy: { past: 'bought', pastPart: 'bought', present3: 'buys' },
  teach: { past: 'taught', pastPart: 'taught', present3: 'teaches' },
  think: { past: 'thought', pastPart: 'thought', present3: 'thinks' },
  sleep: { past: 'slept', pastPart: 'slept', present3: 'sleeps' },
  bring: { past: 'brought', pastPart: 'brought', present3: 'brings' },
  build: { past: 'built', pastPart: 'built', present3: 'builds' },
};

export const VERBS = [
  'be','have','do','go','eat','see','come','take','make','get','give','read','write','run','buy','teach','think','sleep','bring','build'
] as const;

function isVowel(ch: string){ return 'aeiou'.includes(ch.toLowerCase()); }

function thirdPersonSingular(base: string){
  if (base.endsWith('y') && !isVowel(base.at(-2) || '')) return base.slice(0,-1) + 'ies';
  if (/(s|sh|ch|x|z)$/.test(base)) return base + 'es';
  return base + 's';
}

function continuousForm(base: string){
  if (base.endsWith('ie')) return base.slice(0,-2) + 'ying';
  if (base.endsWith('e') && base !== 'be') return base.slice(0,-1) + 'ing';
  if (/^[a-z]*[aeiou][bcdfghjklmnpqrstvwxyz]$/.test(base)) return base + base.slice(-1) + 'ing'; // CVC doubling
  return base + 'ing';
}

export function conjugate(verb: string, tense: Tense, pronoun: Pronoun): string {
  const v = verb.toLowerCase();
  const irr = IRREGULARS[v];
  if (tense === 'Past Simple') {
    return irr ? irr.past : (v.endsWith('e') ? v + 'd' : v + 'ed');
  }
  if (tense === 'Present Simple') {
    if (pronoun === 'He' || pronoun === 'She' || pronoun === 'It') {
      if (irr?.present3) return irr.present3;
      return thirdPersonSingular(v);
    }
    if (v === 'be') return 'am';
    return v;
  }
  if (tense === 'Present Continuous') {
    const be = (pronoun === 'I') ? 'am' : (pronoun === 'He' || pronoun === 'She' || pronoun === 'It') ? 'is' : 'are';
    return be + ' ' + continuousForm(v);
  }
  if (tense === 'Future Simple') {
    return 'will ' + v;
  }
  return v;
}

function normalize(s: string){ return (s || '').toLowerCase().replace(/[“”"']/g,'').trim(); }

export function acceptedAnswers(verb: string, tense: Tense, pronoun: Pronoun): string[] {
  const answer = conjugate(verb, tense, pronoun);
  const list = [answer];
  // simple alternatives
  if (tense === 'Future Simple') {
    list.push("'ll " + verb.toLowerCase()); // contraction
  }
  return Array.from(new Set(list.map(normalize)));
}
