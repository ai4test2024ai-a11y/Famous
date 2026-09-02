import type { Person } from "../data/people";
import { PEOPLE, monthDay } from "../data/people";

export interface Question {
  person: Person;
  options: Person[];   /* 4 shuffled, includes correct */
  correct: number;     /* index of correct within options */
  base: number;        /* base points by difficulty */
}

export interface DiffConf {
  id: 1 | 2 | 3 | 4;
  base: number;
  time: number;        /* seconds per question */
  minPop: number;      /* easiest pool */
  maxPop: number;      /* hardest pool */
  questions: number;
}

export const DIFFS: DiffConf[] = [
  { id: 1, base: 100, time: 25, minPop: 5, maxPop: 5, questions: 15 },
  { id: 2, base: 150, time: 20, minPop: 4, maxPop: 5, questions: 15 },
  { id: 3, base: 200, time: 15, minPop: 3, maxPop: 4, questions: 15 },
  { id: 4, base: 300, time: 12, minPop: 2, maxPop: 4, questions: 15 },
];

/* deterministic PRNG (seeded for daily challenge) */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Distractors: prefer same category + close era + believable popularity,
   never the same birth month-day (keeps exactly one valid answer). */
function pickDistractors(correct: Person, rng: () => number, diff: DiffConf): Person[] {
  const md = monthDay(correct);
  const chosen: Person[] = [];
  let pool = PEOPLE.filter((c) => c.id !== correct.id && monthDay(c) !== md);
  while (chosen.length < 3 && pool.length > 0) {
    const weights = pool.map((c) => {
      let w = 0.5 + c.pop * 0.5;
      const sameCat = c.cat === correct.cat;
      if (diff.id >= 3) {
        if (sameCat) w *= 9;
        if (c.cc === correct.cc) w *= 2.5;
        if (Math.abs(c.pop - correct.pop) <= 1) w *= 2;
      } else if (diff.id === 2) {
        if (sameCat) w *= 5;
        if (c.cc === correct.cc) w *= 1.8;
      } else {
        if (!sameCat) w *= 3; /* easy: clearly different fields */
        if (sameCat) w *= 0.35;
      }
      return w;
    });
    let total = 0;
    for (const w of weights) total += w;
    let r = rng() * total;
    let idx = 0;
    for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) { idx = i; break; } }
    chosen.push(pool[idx]);
    const id = pool[idx].id;
    pool = pool.filter((c) => c.id !== id);
  }
  return chosen;
}

export interface GameOptions {
  diff: DiffConf;
  seed?: string;       /* if set, deterministic (daily) */
  count?: number;      /* override question count */
}

/* Builds a full game. No person or birth-date repeats inside one game,
   and the seeded RNG means consecutive games differ unless seeded. */
export function buildGame(opts: GameOptions): Question[] {
  const rng = mulberry32(opts.seed ? hashStr(opts.seed) : hashStr(`g${Date.now()}${Math.random()}`));
  const count = opts.count ?? opts.diff.questions;

  const pool = PEOPLE.filter((p) => p.pop >= opts.diff.minPop && p.pop <= opts.diff.maxPop);
  const source = pool.length >= count ? pool : PEOPLE.filter((p) => p.pop >= 2);

  const used = new Set<string>();
  const usedMd = new Set<string>();
  const qs: Question[] = [];
  let guard = 0;

  while (qs.length < count && guard++ < count * 40) {
    const candidates = source.filter((p) => !used.has(p.id) && !usedMd.has(monthDay(p)));
    if (candidates.length === 0) break;
    const weights = candidates.map((c) => 1 + c.pop);
    let total = 0;
    for (const w of weights) total += w;
    let r = rng() * total;
    let person = candidates[0];
    for (let i = 0; i < candidates.length; i++) { r -= weights[i]; if (r <= 0) { person = candidates[i]; break; } }

    const distractors = pickDistractors(person, rng, opts.diff);
    if (distractors.length < 3) continue;
    const options = shuffle([person, ...distractors], rng);
    used.add(person.id);
    usedMd.add(monthDay(person));
    qs.push({ person, options, correct: options.indexOf(person), base: opts.diff.base });
  }
  return qs;
}

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
