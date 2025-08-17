import { useCallback, useEffect, useRef, useState } from 'react';

type Voice = SpeechSynthesisVoice | null;

interface SpeakOpts {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

const STORAGE_KEY = 'panda.voice.opts';

function getSavedOpts(): SpeakOpts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as SpeakOpts : {};
  } catch { return {}; }
}

function saveOpts(opts: SpeakOpts) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(opts)); } catch {}
}

export function useVoice() {
  const [isSupported] = useState<boolean>(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const optsRef = useRef<SpeakOpts>({ lang: 'en-GB', rate: 1, pitch: 1, volume: 1, ...getSavedOpts() });

  useEffect(() => {
    if (!isSupported || !synthRef.current) return;
    const load = () => {
      const v = synthRef.current ? synthRef.current.getVoices() : [];
      setVoices(v);
    };
    load();
    if (synthRef.current && typeof synthRef.current.addEventListener === 'function') {
      synthRef.current.addEventListener('voiceschanged', load);
      return () => synthRef.current && synthRef.current.removeEventListener('voiceschanged', load as any);
    }
  }, [isSupported]);

  const speak = useCallback(async (text: string, override?: SpeakOpts) => {
    if (!isSupported || !synthRef.current || !text) return;
    const all = voices;
    const merged: SpeakOpts = { ...optsRef.current, ...(override || {}) };
    const targetLang = merged.lang || 'en-GB';
    const chosen: Voice = all.find(v => v.lang === targetLang) || all.find(v => v.lang?.startsWith('en')) || null;

<<<<<<< HEAD
    const u = new SpeechSynthesisUtterance(text);
    if (chosen) u.voice = chosen;
    if (typeof merged.rate === 'number') u.rate = merged.rate;
    if (typeof merged.pitch === 'number') u.pitch = merged.pitch;
    if (typeof merged.volume === 'number') u.volume = merged.volume;

    synthRef.current.cancel();
    synthRef.current.speak(u);

    await new Promise<void>((res) => {
      u.onend = () => res();
      u.onerror = () => res();
=======
  const speak = useCallback((text: string, opts?: SpeakOpts) => {
    if (!isSupported || !synthRef.current) return Promise.resolve();
    const saved = getSavedOpts();
    const merged = { ...saved, ...opts };
    return new Promise<void>((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(String(text));
        u.lang = merged.lang || (import.meta.env.VITE_VOICE_ACCENT === 'uk' ? 'en-GB' : 'en-US');
        u.rate = merged.rate ?? 1;
        u.pitch = merged.pitch ?? 1;
        u.volume = merged.volume ?? 1;
        const v = findVoice(u.lang);
        if (v) u.voice = v;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        // If not currently speaking and queue empty, speak immediately
        if (!synthRef.current && synthRef.current.speaking && queueRef.current.length === 0) {
          synthRef.current && synthRef.current.speak(u);
        } else {
          queueRef.current.push(u);
          // attempt to flush after small delay
          setTimeout(() => {
            try {
              if (!synthRef.current) return;
              if (!synthRef.current && synthRef.current.speaking && queueRef.current.length > 0) {
                const next = queueRef.current.shift();
                if (next) synthRef.current && synthRef.current.speak(next);
              }
            } catch (e) {}
          }, 200);
        }
      } catch (e) { resolve(); }
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
    });
  }, [isSupported, voices]);

  const speakMultiple = useCallback(async (texts: string[], override?: SpeakOpts) => {
    for (const t of texts) {
      // eslint-disable-next-line no-await-in-loop
      await speak(t, override);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(res => setTimeout(res, 120));
    }
  }, [speak]);

  const setOptions = useCallback((o: SpeakOpts) => {
    optsRef.current = { ...optsRef.current, ...o };
    saveOpts(optsRef.current);
  }, []);

  const stop = useCallback(() => {
    if (!isSupported || !synthRef.current) return;
<<<<<<< HEAD
    try { synthRef.current.cancel(); } catch {}
=======
    try {
      queueRef.current = [];
      synthRef.current && synthRef.current.cancel();
    } catch (e) {}
>>>>>>> 5f4b3a383426e9e2d7844c61ddfab879f8be4197
  }, [isSupported]);

  return { isSupported, voices, speak, speakMultiple, stop, setOptions, options: optsRef.current };
}
