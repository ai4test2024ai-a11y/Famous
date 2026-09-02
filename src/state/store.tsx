import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "../data/people";
import { makeT } from "../lib/i18n";
import { sfx } from "../lib/audio";
import { todayKey } from "../lib/quiz";

export interface GameSummary {
  diff: number;
  score: number;
  correct: number;
  total: number;
  bestStreak: number;
  timeTaken: number;
}

export interface Profile {
  name: string;
  xp: number;
  games: number;
  questions: number;
  correct: number;
  bestStreak: number;
  bestScore: Record<number, number>;
  bestAcc: Record<number, number>;
  history: { date: string; score: number; acc: number; streak: number }[];
}

const EMPTY: Profile = {
  name: "", xp: 0, games: 0, questions: 0, correct: 0, bestStreak: 0,
  bestScore: {}, bestAcc: {}, history: [],
};

interface Ctx {
  lang: Lang; setLang: (l: Lang) => void;
  t: (k: string, v?: Record<string, number | string>) => string;
  digits: (x: string | number) => string;
  soundOn: boolean; toggleSound: () => void;
  profile: Profile;
  setName: (n: string) => void;
  recordGame: (g: GameSummary) => { newBest: boolean; xpGained: number; levelBefore: number; levelAfter: number };
  resetProgress: () => void;
  isUnlocked: (diffId: number) => boolean;
}

const AppCtx = createContext<Ctx | null>(null);

export const levelFromXp = (xp: number) => 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 120));

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem("gyfp_profile_v3");
    if (raw) return { ...EMPTY, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch { /* ignore */ }
  return { ...EMPTY };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const s = localStorage.getItem("gyfp_lang");
    return s === "fa" || s === "ar" ? s : "en";
  });
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem("gyfp_sound") !== "0");
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    localStorage.setItem("gyfp_lang", lang);
  }, [lang]);

  useEffect(() => {
    sfx.muted = !soundOn;
    localStorage.setItem("gyfp_sound", soundOn ? "1" : "0");
  }, [soundOn]);

  useEffect(() => {
    try { localStorage.setItem("gyfp_profile_v3", JSON.stringify(profile)); } catch { /* ignore */ }
  }, [profile]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleSound = useCallback(() => setSoundOn((s) => !s), []);

  const digits = useCallback((x: string | number) => {
    const s = String(x);
    if (lang === "en") return s;
    const map = lang === "fa" ? "۰۱۲۳۴۵۶۷۸۹" : "٠١٢٣٤٥٦٧٨٩";
    return s.replace(/[0-9]/g, (d) => map[Number(d)]);
  }, [lang]);

  const isUnlocked = useCallback((diffId: number) => {
    if (diffId <= 1) return true;
    return (profileRef.current.bestAcc[diffId - 1] ?? 0) >= 50;
  }, []);

  const recordGame = useCallback((g: GameSummary) => {
    const prev = profileRef.current;
    const acc = g.total === 0 ? 0 : Math.round((g.correct / g.total) * 100);
    const xpGained = Math.round(g.score / 8) + g.correct * 6;
    const prevBest = prev.bestScore[g.diff] ?? 0;
    const newBest = g.score > prevBest && g.score > 0;
    const next: Profile = {
      ...prev,
      xp: prev.xp + xpGained,
      games: prev.games + 1,
      questions: prev.questions + g.total,
      correct: prev.correct + g.correct,
      bestStreak: Math.max(prev.bestStreak, g.bestStreak),
      bestScore: { ...prev.bestScore, [g.diff]: Math.max(prevBest, g.score) },
      bestAcc: { ...prev.bestAcc, [g.diff]: Math.max(prev.bestAcc[g.diff] ?? 0, acc) },
      history: [{ date: todayKey(), score: g.score, acc, streak: g.bestStreak }, ...prev.history].slice(0, 50),
    };
    setProfile(next);
    return { newBest, xpGained, levelBefore: levelFromXp(prev.xp), levelAfter: levelFromXp(next.xp) };
  }, []);

  const resetProgress = useCallback(() => setProfile({ ...EMPTY, name: profileRef.current.name }), []);
  const setName = useCallback((n: string) => setProfile((p) => ({ ...p, name: n.trim().slice(0, 18) })), []);

  const value: Ctx = {
    lang, setLang, t, digits, soundOn, toggleSound,
    profile, setName, recordGame, resetProgress, isUnlocked,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
