import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "../lib/util";
import { todayKey } from "../lib/util";
import { makeT } from "../i18n";
import { sfx } from "../lib/audio";
import {
  ACHIEVEMENTS, EMPTY_PROFILE, levelFromXp,
  type Profile,
} from "../lib/quiz";

export interface Toast { id: number; kind: "ach" | "level" | "info"; title: string; sub?: string; }

export interface GameSummary {
  score: number; correct: number; total: number; bestStreak: number;
  byCat: Record<string, number>; byCountry: Record<string, number>;
  iranCorrect: number; daily: boolean; win: boolean;
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, number | string>) => string;
  digits: (x: string | number) => string;
  soundOn: boolean;
  toggleSound: () => void;
  profile: Profile;
  setName: (n: string) => void;
  recordGame: (g: GameSummary) => { newAchs: string[]; levelBefore: number; levelAfter: number; xpGained: number };
  markViewed: (id: string) => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
}

const AppCtx = createContext<Ctx | null>(null);

const LS_LANG = "gyfp_lang";
const LS_SOUND = "gyfp_sound";
const LS_PROFILE = "gyfp_profile_v2";

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(LS_PROFILE);
    if (raw) return { ...EMPTY_PROFILE, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch { /* ignore */ }
  return { ...EMPTY_PROFILE };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const s = localStorage.getItem(LS_LANG);
    return s === "fa" || s === "ar" ? s : "en";
  });
  const [soundOn, setSoundOn] = useState<boolean>(() => localStorage.getItem(LS_SOUND) !== "0");
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  const t = useMemo(() => makeT(lang), [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    localStorage.setItem(LS_LANG, lang);
    document.title = `${makeT(lang)("brand")} — ${makeT(lang)("brand.sub")}`;
  }, [lang]);

  useEffect(() => {
    sfx.muted = !soundOn;
    localStorage.setItem(LS_SOUND, soundOn ? "1" : "0");
  }, [soundOn]);

  useEffect(() => {
    try { localStorage.setItem(LS_PROFILE, JSON.stringify(profile)); } catch { /* ignore */ }
  }, [profile]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = toastId.current++;
    setToasts((ts) => [...ts.slice(-2), { ...toast, id }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4200);
  }, []);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleSound = useCallback(() => setSoundOn((s) => !s), []);

  const digits = useCallback((x: string | number) => {
    const s = String(x);
    if (lang === "en") return s;
    const map = lang === "fa" ? "۰۱۲۳۴۵۶۷۸۹" : "٠١٢٣٤٥٦٧٨٩";
    return s.replace(/[0-9]/g, (d) => map[Number(d)]);
  }, [lang]);

  const evaluate = useCallback((prev: Profile, next: Profile): string[] => {
    const before = new Set(prev.ach);
    const fresh: string[] = [];
    for (const a of ACHIEVEMENTS) {
      if (!before.has(a.id) && a.cond(next)) fresh.push(a.id);
    }
    return fresh;
  }, []);

  const applyFresh = useCallback((next: Profile, fresh: string[]) => {
    if (fresh.length === 0) return next;
    const withAch = { ...next, ach: [...next.ach, ...fresh] };
    for (const id of fresh) {
      sfx.play("achievement");
      pushToast({ kind: "ach", title: t("toast.ach"), sub: t(`ach.${id}`) });
    }
    return withAch;
  }, [pushToast, t]);

  const recordGame = useCallback((g: GameSummary) => {
    const prev = profile;
    const levelBefore = levelFromXp(prev.xp);
    const xpGained = Math.round(g.score / 8) + g.correct * 6;
    const byCat = { ...prev.byCat };
    for (const k of Object.keys(g.byCat)) byCat[k] = (byCat[k] ?? 0) + g.byCat[k];
    const byCountry = { ...prev.byCountry };
    for (const k of Object.keys(g.byCountry)) byCountry[k] = (byCountry[k] ?? 0) + g.byCountry[k];
    const acc = g.total === 0 ? 0 : Math.round((g.correct / g.total) * 100);
    const next: Profile = {
      ...prev,
      xp: prev.xp + xpGained,
      games: prev.games + 1,
      wins: prev.wins + (g.win ? 1 : 0),
      questions: prev.questions + g.total,
      correct: prev.correct + g.correct,
      bestScore: Math.max(prev.bestScore, g.score),
      bestStreak: Math.max(prev.bestStreak, g.bestStreak),
      perfects: prev.perfects + (g.correct === g.total && g.total >= 15 ? 1 : 0),
      dailies: prev.dailies + (g.daily ? 1 : 0),
      byCat, byCountry,
      iranCorrect: prev.iranCorrect + g.iranCorrect,
      history: [{ date: todayKey(), score: g.score, acc, streak: g.bestStreak, total: g.total }, ...prev.history].slice(0, 60),
    };
    const fresh = evaluate(prev, next);
    setProfile(applyFresh(next, fresh));
    return { newAchs: fresh, levelBefore, levelAfter: levelFromXp(next.xp), xpGained };
  }, [profile, evaluate, applyFresh]);

  const markViewed = useCallback((id: string) => {
    if (profile.viewed.includes(id)) return;
    const next = { ...profile, viewed: [...profile.viewed, id].slice(0, 150) };
    setProfile(applyFresh(next, evaluate(profile, next)));
  }, [profile, evaluate, applyFresh]);

  const setName = useCallback((n: string) => {
    setProfile((prev) => ({ ...prev, name: n.trim().slice(0, 18) }));
  }, []);

  const value: Ctx = {
    lang, setLang, t, digits, soundOn, toggleSound,
    profile, setName, recordGame, markViewed, toasts, pushToast,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
}
