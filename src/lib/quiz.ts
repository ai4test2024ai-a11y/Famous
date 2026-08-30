import type { Person } from "../data/people";
import { PEOPLE, eraOf, yearOf } from "../data/people";
import { mulberry32, hashStr, shuffle, monthDayKey } from "./util";

export interface Question {
  person: Person;          /* correct answer */
  md: string;              /* "M-D" of the birth date */
  options: Person[];       /* 5 shuffled, includes correct */
  correct: number;         /* index of correct inside options */
  diff: 1 | 2 | 3 | 4;
  base: number;
}

const SPORTS = new Set(["football", "basketball", "tennis", "motorsport", "boxing", "athletics", "sport"]);
const CINEMA = new Set(["actors", "actresses", "directors", "tv", "comedians"]);
const MUSIC = new Set(["singers", "musicians", "rappers", "bands", "composers"]);

function clusterOf(cat: string): Set<string> | null {
  if (SPORTS.has(cat)) return SPORTS;
  if (CINEMA.has(cat)) return CINEMA;
  if (MUSIC.has(cat)) return MUSIC;
  return null;
}

const BASE_POINTS: Record<number, number> = { 1: 100, 2: 150, 3: 200, 4: 300 };

export function pickDistractors(correct: Person, rng: () => number, diff: number): Person[] {
  const md = monthDayKey(correct.dob);
  const pool: Person[] = [];
  const weights: number[] = [];
  const cluster = clusterOf(correct.cat);
  for (const c of PEOPLE) {
    if (c.id === correct.id) continue;
    if (monthDayKey(c.dob) === md) continue; // never a second valid answer
    let w = 0.5 + c.pop * 0.5;
    const sameCat = c.cat === correct.cat;
    const sameCluster = cluster !== null && cluster.has(c.cat);
    const sameCountry = c.cc === correct.cc;
    const eraClose = Math.abs(yearOf(c) - yearOf(correct)) <= 20;
    if (diff >= 3) {
      if (sameCat) w *= 9;
      else if (sameCluster) w *= 3;
      if (sameCountry) w *= 3;
      if (eraClose) w *= 1.8;
      if (diff === 4 && !sameCat && !sameCountry) w *= 0.05;
    } else if (diff === 2) {
      if (sameCat) w *= 5;
      else if (sameCluster) w *= 2;
      if (sameCountry) w *= 2;
      if (eraClose) w *= 1.4;
    } else {
      if (!sameCat && !sameCluster) w *= 3; // easy: obviously different fields
      if (sameCat) w *= 0.4;
    }
    if (correct.iran && c.iran) w *= 2.2;
    pool.push(c);
    weights.push(w);
  }
  const chosen: Person[] = [];
  const used = new Set<string>([correct.id]);
  while (chosen.length < 4 && pool.length > 0) {
    let total = 0;
    for (let i = 0; i < pool.length; i++) total += used.has(pool[i].id) ? 0 : weights[i];
    if (total <= 0) break;
    let r = rng() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) {
      if (used.has(pool[i].id)) continue;
      r -= weights[i];
      if (r <= 0) { idx = i; break; }
    }
    used.add(pool[idx].id);
    chosen.push(pool[idx]);
  }
  return chosen;
}

export interface GameOptions {
  count: number;
  seed?: string;
  cat?: string;            /* restrict correct answers */
  preferIds?: string[];    /* bias (e.g. birthday twins) */
}

export function buildGame(opts: GameOptions): Question[] {
  const rng = mulberry32(hashStr(opts.seed ?? `g${Date.now()}`));
  let pool = PEOPLE.slice();
  if (opts.cat === "iran") pool = pool.filter((p) => p.iran);
  else if (opts.cat === "world") pool = pool.filter((p) => p.pop >= 5);
  else if (opts.cat) pool = pool.filter((p) => p.cat === opts.cat);
  if (pool.length < 6) pool = PEOPLE.slice();

  const prefer = new Set(opts.preferIds ?? []);
  const used = new Set<string>();
  const usedMd = new Set<string>();
  const qs: Question[] = [];

  while (qs.length < opts.count && qs.length < pool.length) {
    const candidates = pool.filter((p) => !used.has(p.id) && !usedMd.has(monthDayKey(p.dob)));
    if (candidates.length === 0) break;
    const weights = candidates.map((c) => {
      let w = 1 + c.pop;
      if (prefer.has(c.id)) w *= 12;
      if (used.size > 0) {
        const lastCat = qs[qs.length - 1]?.person.cat;
        if (c.cat === lastCat) w *= 0.35; // spread categories
      }
      return w;
    });
    let total = weights.reduce((a, b) => a + b, 0);
    let r = rng() * total;
    let person = candidates[0];
    for (let i = 0; i < candidates.length; i++) {
      r -= weights[i];
      if (r <= 0) { person = candidates[i]; break; }
    }
    const md = monthDayKey(person.dob);
    let diff = (person.diff + (rng() < 0.3 ? 1 : rng() > 0.75 ? -1 : 0)) as 1 | 2 | 3 | 4;
    diff = Math.max(1, Math.min(4, diff)) as 1 | 2 | 3 | 4;
    const distractors = pickDistractors(person, rng, diff);
    if (distractors.length < 4) continue;
    const options = shuffle([person, ...distractors], rng);
    used.add(person.id);
    usedMd.add(md);
    qs.push({ person, md, options, correct: options.indexOf(person), diff, base: BASE_POINTS[diff] });
  }
  return qs;
}

/* ---------------- profile / progression ---------------- */

export interface GameResultRow { date: string; score: number; acc: number; streak: number; total: number; }

export interface Profile {
  name: string;
  xp: number;
  games: number;
  wins: number;
  questions: number;
  correct: number;
  bestScore: number;
  bestStreak: number;
  perfects: number;
  dailies: number;
  byCat: Record<string, number>;
  byCountry: Record<string, number>;
  iranCorrect: number;
  ach: string[];
  history: GameResultRow[];
  viewed: string[];
}

export const EMPTY_PROFILE: Profile = {
  name: "", xp: 0, games: 0, wins: 0, questions: 0, correct: 0,
  bestScore: 0, bestStreak: 0, perfects: 0, dailies: 0,
  byCat: {}, byCountry: {}, iranCorrect: 0, ach: [], history: [], viewed: [],
};

export function levelFromXp(xp: number): number {
  return 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 120));
}
export function xpForLevel(l: number): number {
  return 120 * (l - 1) * (l - 1);
}

export interface AchDef { id: string; icon: string; cond: (p: Profile) => boolean; }

export const ACHIEVEMENTS: AchDef[] = [
  { id: "firstWin", icon: "trophy", cond: (p) => p.wins >= 1 },
  { id: "streak5", icon: "flame", cond: (p) => p.bestStreak >= 5 },
  { id: "streak10", icon: "flame", cond: (p) => p.bestStreak >= 10 },
  { id: "streak25", icon: "flame", cond: (p) => p.bestStreak >= 25 },
  { id: "acc90", icon: "target", cond: (p) => p.history.some((h) => h.acc >= 90 && h.total >= 10) },
  { id: "football", icon: "football", cond: (p) => (p.byCat.football ?? 0) >= 25 },
  { id: "movies", icon: "mask", cond: (p) => cinemaCount(p) >= 25 },
  { id: "music", icon: "mic", cond: (p) => musicCount(p) >= 25 },
  { id: "iran", icon: "star8", cond: (p) => p.iranCorrect >= 20 },
  { id: "world", icon: "globe", cond: (p) => Object.keys(p.byCountry).length >= 15 },
  { id: "master", icon: "crown", cond: (p) => p.perfects >= 1 },
  { id: "daily3", icon: "calendar", cond: (p) => p.dailies >= 3 },
  { id: "level10", icon: "gem", cond: (p) => levelFromXp(p.xp) >= 10 },
  { id: "explorer", icon: "search", cond: (p) => p.viewed.length >= 25 },
];

function cinemaCount(p: Profile) {
  return (p.byCat.actors ?? 0) + (p.byCat.actresses ?? 0) + (p.byCat.directors ?? 0) + (p.byCat.tv ?? 0) + (p.byCat.comedians ?? 0);
}
function musicCount(p: Profile) {
  return (p.byCat.singers ?? 0) + (p.byCat.musicians ?? 0) + (p.byCat.rappers ?? 0) + (p.byCat.bands ?? 0) + (p.byCat.composers ?? 0);
}

/* ---------------- leaderboard bots ---------------- */

export interface BoardRow { name: string; score: number; acc: number; streak: number; level: number; you?: boolean; }

const BOT_NAMES = [
  "NovaKing", "AtlasFox", "QuizSultan", "MoonCatcher", "TurboNia", "PixelPasha",
  "ZenMaster", "CaspianWave", "RetroRex", "AuroraBee", "NightOwl", "CrimsonAce",
  "LunarLayla", "StormRider", "GoldenGoat", "EchoVale", "MidasTouch", "SilverFox",
  "QuantumQ", "VelvetViper", "SaffronStar", "CedarCrown", "NeonNomad", "DesertHawk",
];

export function genBoard(tab: "global" | "daily" | "weekly", seedKey: string, you?: BoardRow | null): BoardRow[] {
  const rng = mulberry32(hashStr(`${tab}-${seedKey}`));
  const n = 14;
  const rows: BoardRow[] = [];
  const usedNames = new Set<string>();
  const [hi, lo] = tab === "global" ? [32000, 9000] : tab === "weekly" ? [9800, 2400] : [2800, 500];
  for (let i = 0; i < n; i++) {
    let name = BOT_NAMES[Math.floor(rng() * BOT_NAMES.length)];
    while (usedNames.has(name)) name = BOT_NAMES[Math.floor(rng() * BOT_NAMES.length)];
    usedNames.add(name);
    const frac = 1 - i / n;
    rows.push({
      name: `${name}${Math.floor(rng() * 90) + 10}`,
      score: Math.round(lo + (hi - lo) * frac * (0.8 + rng() * 0.4)),
      acc: Math.round(58 + rng() * 41),
      streak: Math.round(3 + rng() * (tab === "daily" ? 12 : 34)),
      level: Math.round(2 + rng() * (tab === "global" ? 26 : 12)),
    });
  }
  rows.sort((a, b) => b.score - a.score);
  if (you && you.score > 0) {
    rows.push(you);
    rows.sort((a, b) => b.score - a.score);
  }
  return rows.slice(0, 15);
}

export { eraOf };
