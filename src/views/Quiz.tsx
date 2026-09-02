import { useEffect, useRef, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { buildGame, DIFFS, todayKey, type Question } from "../lib/quiz";
import { localizedName, countryName, countryCode3, catName, monthOf, dayOf, eraOf } from "../data/people";
import { monthNameG } from "../lib/i18n";
import { Portrait, Ic, fireConfetti } from "../components/ui";
import { sfx } from "../lib/audio";

export type Mode = "classic" | "time" | "streak" | "daily";
const HINTS = ["country", "field", "famous", "letter"] as const;
type HintId = (typeof HINTS)[number];

const fmt = (x: number) => x.toLocaleString("en-US");

interface EndInfo {
  score: number; correct: number; total: number; bestStreak: number; timeTaken: number;
  newBest: boolean; xpGained: number; levelBefore: number; levelAfter: number;
}

function CountUp({ to, dur = 1200 }: { to: number; dur?: number }) {
  const { digits } = useApp();
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const f = Math.min(1, (t - t0) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - f, 3))));
      if (f < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <span>{digits(fmt(v))}</span>;
}

export default function Quiz({ mode, diffId }: { mode: Mode; diffId: number }) {
  const { t, lang, digits, recordGame, isUnlocked } = useApp();
  const conf = DIFFS[Math.min(3, Math.max(0, diffId - 1))];
  const isStreak = mode === "streak";
  const timePerQ = mode === "time" ? 12 : isStreak ? 15 : conf.time;
  const qTotal = mode === "daily" ? 10 : isStreak ? 50 : conf.questions;

  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [picked, setPicked] = useState(-1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [misses, setMisses] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gain, setGain] = useState<{ v: number; k: number }>({ v: 0, k: 0 });
  const [timeLeft, setTimeLeft] = useState(timePerQ);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<HintId[]>([]);
  const [announce, setAnnounce] = useState("");
  const [end, setEnd] = useState<EndInfo | null>(null);

  const st = useRef({ score: 0, correct: 0, best: 0, misses: 0, streak: 0, time: 0 });
  const advanceTimer = useRef(0);

  const dailyDone = mode === "daily" && localStorage.getItem("gyfp_lastDaily") === todayKey();

  const start = () => {
    sfx.play("click");
    const seed = mode === "daily" ? `daily-${todayKey()}` : undefined;
    const built = buildGame({ diff: conf, seed, count: qTotal });
    if (built.length === 0) return;
    st.current = { score: 0, correct: 0, best: 0, misses: 0, streak: 0, time: 0 };
    setQs(built);
    setIdx(0); setPhase("play"); setPicked(-1);
    setScore(0); setStreak(0); setMisses(0); setCorrectCount(0);
    setTimeLeft(timePerQ); setHintsUsed(0); setRevealedHints([]); setEnd(null);
    setStage("play");
    sfx.play("flip");
  };

  const finish = () => {
    const total = isStreak ? Math.max(1, st.current.correct + st.current.misses) : qs.length;
    const summary = {
      diff: conf.id, score: st.current.score, correct: st.current.correct,
      total, bestStreak: st.current.best, timeTaken: Math.round(st.current.time),
    };
    const res = recordGame(summary);
    if (mode === "daily") localStorage.setItem("gyfp_lastDaily", todayKey());
    setEnd({ ...summary, ...res });
    setStage("done");
    sfx.play("complete");
    if (st.current.correct > 0) fireConfetti(st.current.correct >= total && total >= 10);
    if (res.levelAfter > res.levelBefore) window.setTimeout(() => sfx.play("levelup"), 600);
  };

  const advance = () => {
    const ranOut = idx + 1 >= qs.length;
    const streakOver = isStreak && st.current.misses >= 3;
    if (ranOut || streakOver) finish();
    else {
      setIdx((x) => x + 1);
      setPhase("play"); setPicked(-1);
      setTimeLeft(timePerQ); setHintsUsed(0); setRevealedHints([]);
      sfx.play("flip");
    }
  };

  const answer = (i: number) => {
    if (stage !== "play" || phase !== "play") return;
    const q = qs[idx];
    if (!q) return;
    const ok = i === q.correct;
    const skipped = i === -2;
    const timeBonus = ok ? Math.round(Math.max(0, timeLeft)) * 2 : 0;
    const streakBonus = ok ? Math.min(st.current.streak * 15, 150) : 0;
    const hintPenalty = ok ? hintsUsed * Math.round(q.base * 0.2) : 0;
    const gained = ok ? Math.max(10, q.base - hintPenalty) + timeBonus + streakBonus : 0;
    const penalty = !ok && !skipped ? 20 : 0;
    st.current.score = Math.max(0, st.current.score + gained - penalty);
    st.current.time += timePerQ - Math.max(0, timeLeft);
    if (ok) {
      st.current.streak += 1; st.current.correct += 1;
      st.current.best = Math.max(st.current.best, st.current.streak);
    } else {
      st.current.streak = 0;
      if (!skipped) st.current.misses += 1;
    }
    setScore(st.current.score);
    setStreak(st.current.streak);
    setMisses(st.current.misses);
    setCorrectCount(st.current.correct);
    setGain({ v: gained - penalty, k: Date.now() });
    setPicked(i); setPhase("reveal");
    if (ok) {
      sfx.play("correct");
      if (st.current.streak >= 3) window.setTimeout(() => sfx.play("streak"), 320);
    } else if (!skipped) sfx.play("wrong");

    const nm = localizedName(q.person, lang);
    setAnnounce(
      ok ? t("sr.correct", { a: digits(fmt(gained - penalty)), b: digits(fmt(st.current.score)) })
        : i === -1 ? t("sr.timeout", { a: nm }) : t("sr.wrong", { a: nm })
    );
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(advance, 2400);
  };

  const useHint = (h: HintId) => {
    if (stage !== "play" || phase !== "play" || revealedHints.includes(h)) return;
    setRevealedHints((r) => [...r, h]);
    setHintsUsed((n) => n + 1);
    sfx.play("flip");
  };
  const skip = () => {
    if (stage !== "play" || phase !== "play") return;
    answer(-2);
  };

  /* timer */
  useEffect(() => {
    if (stage !== "play" || phase !== "play") return;
    const id = window.setInterval(() => setTimeLeft((x) => x - 0.1), 100);
    return () => window.clearInterval(id);
  }, [stage, phase, idx]);

  /* timeout */
  useEffect(() => {
    if (stage === "play" && phase === "play" && timeLeft <= 0) answer(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage, phase]);

  /* reset hints + announce question */
  useEffect(() => {
    setHintsUsed(0); setRevealedHints([]);
    if (stage === "play" && qs[idx]) {
      setAnnounce(t("sr.question", { a: digits(idx + 1), b: digits(isStreak ? "∞" : qs.length) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, stage]);

  /* keyboard: 1-4 answer · H hint · S skip · Enter next */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (stage !== "play") return;
      if (phase === "reveal") {
        if (e.key === "Enter") { window.clearTimeout(advanceTimer.current); advance(); }
        return;
      }
      const n = Number(e.key);
      if (n >= 1 && n <= 4) answer(n - 1);
      else if (e.key === "h" || e.key === "H") {
        const nxt = HINTS.find((x) => !revealedHints.includes(x));
        if (nxt) useHint(nxt);
      } else if (e.key === "s" || e.key === "S") skip();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, phase, idx, qs, timeLeft, hintsUsed, revealedHints]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  /* ================= INTRO ================= */
  if (stage === "intro") {
    const modeName = t(`mode.${mode === "time" ? "time" : mode}`);
    const modeDesc = t(`mode.${mode === "time" ? "time" : mode}.d`);
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <div className="glass clip-card anim-pop relative overflow-hidden p-7 sm:p-10">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(60% 60% at 80% 0%, rgba(245,173,29,0.4), transparent 60%)" }} />
          <div className="relative">
            <button type="button" onClick={() => go("/")} className="btn btn-ghost clip-slant px-4 py-2 text-[11px] font-bold">
              <Ic n="home" size={13} /> {t("nav.home")}
            </button>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-gold-500/15 text-gold-400 clip-card">
                <Ic n={mode === "daily" ? "bolt" : mode === "streak" ? "flame" : mode === "time" ? "clock" : "calendar"} size={26} />
              </span>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-cream-50">{modeName}</h1>
                <p className="mt-1 text-sm text-cream-500">{modeDesc}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5 text-[11px] font-bold">
              {!isStreak && <span className="clip-tag bg-ink-800 px-3 py-1.5 text-gold-400">{digits(qTotal)} {lang === "fa" ? "سؤال" : lang === "ar" ? "أسئلة" : "QUESTIONS"}</span>}
              {isStreak && <span className="clip-tag bg-ink-800 px-3 py-1.5 text-coral-400">3 {t("quiz.misses")}</span>}
              <span className="clip-tag bg-ink-800 px-3 py-1.5 text-mint-400">{digits(timePerQ)}s</span>
              <span className="clip-tag bg-ink-800 px-3 py-1.5 text-coral-400">{t(`diff.${conf.id}`)}</span>
            </div>
            {mode === "daily" && dailyDone && (
              <div className="mt-6 clip-card-sm border border-gold-500/40 bg-gold-500/10 p-4 text-sm text-gold-300">{t("quiz.locked")}</div>
            )}
            <div className="mt-8">
              <button type="button" disabled={mode === "daily" && dailyDone} onClick={start}
                className="btn btn-primary clip-slant px-9 py-4 text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed">
                <Ic n="play" size={17} /> {t("home.play")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DONE ================= */
  if (stage === "done" && end) {
    const accPct = Math.round((end.correct / end.total) * 100);
    const nextUnlocked = conf.id < 4 && isUnlocked(conf.id + 1);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center anim-pop">
          <div className="text-[10px] font-bold tracking-[0.3em] text-mint-400">{isStreak ? t("quiz.gameOver") : t("quiz.results")}</div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-black text-cream-50">
            {isStreak ? `${digits(end.correct)} ${t("profile.correct")}` : t("quiz.complete", { a: digits(end.total), b: digits(end.total) })}
          </h1>
          {end.newBest && <div className="mt-3 inline-block clip-tag bg-gold-500 px-5 py-1.5 font-display text-sm font-black text-ink-950 anim-streak">✦ {t("quiz.newBest")} ✦</div>}
          {end.correct === end.total && !isStreak && (
            <div className="mt-3 inline-block clip-tag bg-mint-500 px-5 py-1.5 font-display text-sm font-black text-ink-950 anim-streak">✦ {t("quiz.perfect")} ✦</div>
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="glass clip-card p-6 text-center anim-rise">
            <div className="text-[10px] font-bold tracking-[0.25em] text-cream-500">{t("quiz.finalScore")}</div>
            <div className="mt-3 font-display text-4xl sm:text-5xl font-black text-gold-400"><CountUp to={end.score} /></div>
            <div className="mt-4 text-xs text-cream-500">+{digits(fmt(end.xpGained))} {t("profile.xp")}</div>
          </div>
          <div className="glass clip-card p-6 anim-rise" style={{ animationDelay: "0.1s" }}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label={t("quiz.accuracy")} value={`${digits(accPct)}${lang === "fa" ? "٪" : "%"}`} color="#4dffd8" />
              <Stat label={t("quiz.bestStreak")} value={digits(end.bestStreak)} color="#ff8a5c" icon="flame" />
              <Stat label={t("quiz.correctCount")} value={`${digits(end.correct)}/${digits(end.total)}`} color="#1fe0bd" />
              <Stat label={t("quiz.timeTaken")} value={`${digits(end.timeTaken)}s`} color="#8fb7ff" icon="clock" />
            </div>
          </div>
          <div className="glass clip-card p-6 anim-rise flex flex-col gap-2.5" style={{ animationDelay: "0.2s" }}>
            <div className="mb-1 text-[10px] font-bold tracking-[0.25em] text-cream-500">{t("profile.level")} {digits(end.levelAfter)}</div>
            <button type="button" onClick={start} className="btn btn-primary clip-slant px-5 py-3 text-xs font-black">
              <Ic n="refresh" size={15} /> {t("quiz.playAgain")}
            </button>
            {nextUnlocked && (
              <button type="button" onClick={() => go(`/quiz?mode=classic&diff=${conf.id + 1}`)} className="btn btn-mint clip-slant px-5 py-3 text-xs font-black">
                <Ic n="arrow" size={15} className="rtl:-scale-x-100" /> {t("quiz.nextLevel")}
              </button>
            )}
            <button type="button" onClick={() => go("/board")} className="btn btn-ghost clip-slant px-5 py-3 text-xs font-bold">
              <Ic n="trophy" size={15} /> {t("quiz.viewBoard")}
            </button>
            <button type="button" onClick={() => go("/")} className="btn btn-ghost clip-slant px-5 py-3 text-xs font-bold">
              <Ic n="home" size={15} /> {t("quiz.home")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PLAY ================= */
  const q = qs[idx];
  if (!q) return null;
  const person = q.person;
  const tPct = (timeLeft / timePerQ) * 100;
  const timerColor = tPct > 50 ? "#4dffd8" : tPct > 25 ? "#ffc95c" : "#ff5470";
  const hintVal = (h: HintId) =>
    h === "country" ? countryName(person.cc, lang)
    : h === "field" ? catName(person.cat, lang)
    : h === "famous" ? person.famous
    : (localizedName(person, lang).trim()[0] ?? "?").toUpperCase();
  const hintIcon = (h: HintId) => (h === "country" ? "globe" : h === "field" ? "case" : h === "famous" ? "spark" : "pen");

  return (
    <div className="no-select mx-auto max-w-3xl px-4 py-8">
      <div aria-live="polite" role="status" className="sr-only">{announce}</div>

      {/* HUD */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button type="button" aria-label={t("common.close")} onClick={() => { window.clearTimeout(advanceTimer.current); go("/"); }} className="btn btn-ghost clip-card-sm px-3 py-2 text-cream-300">
          <Ic n="x" size={15} />
        </button>
        <div className="text-center min-w-0">
          <div className="font-display text-[11px] sm:text-xs font-bold text-cream-300">
            {isStreak ? `${t("quiz.streak")} ${digits(streak)}` : t("quiz.question", { a: digits(idx + 1), b: digits(qs.length) })}
          </div>
          {!isStreak && (
            <div className="mt-1.5 flex justify-center gap-[3px] sm:gap-1">
              {qs.map((_, i) => (
                <span key={i} className={`h-1.5 w-1.5 sm:w-3.5 clip-card-sm transition-colors ${i < idx ? "bg-mint-500" : i === idx ? "bg-gold-400" : "bg-ink-700"}`} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative text-center">
            <div className="text-[8px] font-bold tracking-[0.2em] text-cream-500">{t("quiz.score")}</div>
            <div className="font-display text-base sm:text-lg font-black text-gold-400">{digits(fmt(score))}</div>
            {gain.v !== 0 && phase === "reveal" && (
              <span key={gain.k} className={`anim-score pointer-events-none absolute -top-1 start-1/2 font-display text-sm font-black ${gain.v >= 0 ? "text-mint-400" : "text-coral-400"}`}>
                {gain.v >= 0 ? "+" : ""}{digits(fmt(gain.v))}
              </span>
            )}
          </div>
          {isStreak ? (
            <div className="clip-card-sm bg-coral-500/15 px-2.5 py-1.5 text-center text-coral-400">
              <div className="flex items-center gap-1"><Ic n="x" size={13} /><span className="font-display text-sm font-black">{digits(misses)}/3</span></div>
            </div>
          ) : (
            <div className={`clip-card-sm px-2.5 py-1.5 text-center ${streak >= 3 ? "bg-coral-500/15 text-coral-400" : "bg-ink-800 text-cream-500"}`}>
              <div className="flex items-center gap-1"><Ic n="flame" size={14} /><span key={streak} className={`font-display text-sm font-black ${streak >= 3 ? "anim-streak" : ""}`}>{digits(streak)}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* timer */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-800" role="progressbar" aria-label={t("quiz.time")} aria-valuenow={Math.max(0, Math.round(timeLeft))} aria-valuemin={0} aria-valuemax={timePerQ}>
        <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${Math.max(0, tPct)}%`, background: timerColor, boxShadow: `0 0 12px ${timerColor}` }} />
      </div>

      {/* date + mystery card */}
      <div key={idx} className="anim-pop glass clip-card relative mt-6 overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(60% 90% at 50% 0%, rgba(245,173,29,0.35), transparent 70%)" }} />
        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="w-32 sm:w-40 shrink-0 clip-card-sm overflow-hidden">
            <Portrait person={person} mystery={phase === "play"} className="aspect-[3/4] w-full" monogram="text-3xl" />
          </div>
          <div className="text-center sm:text-start flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="clip-tag px-3 py-1 font-display text-[9px] font-black tracking-[0.2em]" style={{ background: "rgba(245,173,29,0.12)", color: "#ffc95c", boxShadow: "inset 0 0 0 1px rgba(245,173,29,0.4)" }}>
                {t(`diff.${conf.id}`)}
              </span>
              <span className="clip-tag bg-ink-800 px-3 py-1 font-display text-[9px] font-black tracking-[0.2em] text-mint-400">
                {digits(Math.max(0, Math.ceil(timeLeft)))}s
              </span>
            </div>
            <div className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-cream-50 leading-tight">
              {monthNameG(monthOf(person), lang)} {digits(dayOf(person))}
            </div>
            <div className="mt-2 font-display text-xs sm:text-sm font-bold tracking-wide text-gold-400">{t("quiz.whoBorn")}</div>
            {phase === "reveal" && (
              <div className={`anim-pop mt-2 font-display text-lg font-black ${picked === q.correct ? "text-mint-400" : "text-coral-400"}`}>
                {picked === -2 ? t("quiz.skipped") : picked === -1 ? t("quiz.timeout") : picked === q.correct ? t("quiz.correct") : t("quiz.wrong")}
              </div>
            )}
            {phase === "reveal" && picked !== q.correct && (
              <div className="mt-1 text-xs text-cream-300">{t("quiz.correctWas")}: <span className="font-bold text-mint-400">{localizedName(person, lang)}</span></div>
            )}
            {phase === "reveal" && (
              <div className="mt-2 text-[11px] text-cream-500"><span className="text-gold-300 font-bold">{t("quiz.knownFor")}:</span> {person.famous} · {t(`era.${eraOf(person)}`)}</div>
            )}
          </div>
        </div>
      </div>

      {/* hints + skip */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {HINTS.map((h) => {
          const revealed = revealedHints.includes(h);
          const cost = digits(fmt(Math.round(q.base * 0.2)));
          return (
            <button key={h} type="button" onClick={() => useHint(h)} disabled={phase !== "play" || revealed}
              aria-label={revealed ? `${t(`hint.${h}`)}: ${hintVal(h)}` : `${t("hint.label")} — ${t(`hint.${h}`)} (${t("hint.cost", { a: cost })})`}
              className={`clip-card-sm flex items-center gap-1.5 border px-3 py-2 font-display text-[10px] font-bold tracking-wide transition-all disabled:cursor-not-allowed ${revealed ? "border-mint-500/60 bg-mint-500/10 text-mint-400" : "border-ink-600 bg-ink-850/80 text-cream-300 hover:border-gold-400/60 hover:text-gold-300 disabled:opacity-40"}`}>
              <Ic n={hintIcon(h)} size={13} />
              {revealed ? <span className="max-w-[160px] truncate">{hintVal(h)}</span> : t(`hint.${h}`)}
              {!revealed && <span className="text-coral-400">{t("hint.cost", { a: cost })}</span>}
            </button>
          );
        })}
        <button type="button" onClick={skip} disabled={phase !== "play"} aria-label={t("skip")}
          className="btn btn-ghost clip-card-sm ms-auto px-4 py-2 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-40">
          <Ic n="skip" size={13} /> {t("skip")}
        </button>
      </div>

      {/* options */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {q.options.map((op, i) => {
          const isCorrect = phase === "reveal" && i === q.correct;
          const isWrongPick = phase === "reveal" && picked === i && i !== q.correct;
          const dimmed = phase === "reveal" && !isCorrect && !isWrongPick;
          return (
            <button key={`${idx}-${op.id}`} type="button" onClick={() => answer(i)} disabled={phase === "reveal"}
              aria-label={`${digits(i + 1)}. ${localizedName(op, lang)}`}
              className={`anim-slide group relative flex items-center gap-3 clip-card border p-3 text-start transition-all duration-200 ${
                isCorrect ? "border-mint-400 bg-mint-500/10 shadow-[0_0_24px_rgba(31,224,189,0.25)]"
                : isWrongPick ? "border-coral-500 bg-coral-500/10 anim-shake"
                : dimmed ? "border-ink-700 bg-ink-900/60 opacity-40"
                : "border-ink-600 bg-ink-850/80 hover:border-gold-400/60 hover:bg-ink-800"}`}
              style={{ animationDelay: `${i * 0.06}s` }}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center clip-card-sm font-display text-[11px] font-black ${isCorrect ? "bg-mint-500 text-ink-950" : isWrongPick ? "bg-coral-500 text-ink-950" : "bg-ink-700 text-cream-300"}`}>
                {digits(i + 1)}
              </span>
              <Portrait person={op} className="h-12 w-10 shrink-0" monogram="text-[10px]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[13px] sm:text-sm font-bold text-cream-50">{localizedName(op, lang)}</span>
                <span className="mt-0.5 block text-[10px] font-semibold text-gold-300">{countryCode3(op.cc)}</span>
              </span>
              {phase === "reveal" && (isCorrect || isWrongPick) && (
                <span className={`shrink-0 ${isCorrect ? "text-mint-400" : "text-coral-400"}`}><Ic n={isCorrect ? "check" : "x"} size={20} /></span>
              )}
            </button>
          );
        })}
      </div>

      {phase === "reveal" && (
        <div className="mt-5 flex justify-center">
          <button type="button" onClick={() => { window.clearTimeout(advanceTimer.current); advance(); }} className="btn btn-primary clip-slant px-8 py-3 text-xs font-black">
            {idx + 1 >= qs.length || (isStreak && misses >= 3) ? t("quiz.results") : t("quiz.next")} <Ic n="arrow" size={14} className="rtl:-scale-x-100" />
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color, icon }: { label: string; value: string; color: string; icon?: string }) {
  return (
    <div className="clip-card-sm border border-ink-700 bg-ink-900/70 p-3">
      <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.15em] text-cream-500">
        {icon && <span style={{ color }}><Ic n={icon} size={11} /></span>}{label}
      </div>
      <div className="mt-1 font-display text-lg font-black" style={{ color }}>{value}</div>
    </div>
  );
}
