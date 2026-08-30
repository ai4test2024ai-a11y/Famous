import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { buildGame, ACHIEVEMENTS, xpForLevel, type Question } from "../lib/quiz";
import { PEOPLE, localizedName, yearOf } from "../data/people";
import { monthNameG, monthNameJ, countryCode3 } from "../i18n";
import { toJalaali, toGregorian, jalaaliMonthLength, isValidJalaali } from "../lib/jalali";
import { Portrait, fireConfetti } from "../components/bits";
import { catName, catDef, Ic, THEMES } from "../data/categories";
import { sfx } from "../lib/audio";
import { todayKey, fmtNum, clamp } from "../lib/util";

const QTIME = 20;
const DIFF_COLOR: Record<number, string> = { 1: "#4dffd8", 2: "#ffc95c", 3: "#ff8a5c", 4: "#ff5470" };

interface EndInfo {
  score: number; correct: number; total: number; bestStreak: number;
  xpGained: number; levelBefore: number; levelAfter: number; newAchs: string[];
}

function CountUp({ to, dur = 1300 }: { to: number; dur?: number }) {
  const { digits } = useApp();
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const f = clamp((t - t0) / dur, 0, 1);
      setV(Math.round(to * (1 - Math.pow(1 - f, 3))));
      if (f < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, dur]);
  return <span>{digits(v)}</span>;
}

export default function QuizPage({ mode, cat }: { mode: string; cat?: string }) {
  const { t, lang, digits, recordGame, profile } = useApp();

  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"play" | "reveal">("play");
  const [picked, setPicked] = useState<number>(-1);
  const [score, setScore] = useState(0);
  const [gain, setGain] = useState<{ v: number; k: number }>({ v: 0, k: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QTIME);
  const [showJalali, setShowJalali] = useState(lang === "fa");
  const [end, setEnd] = useState<EndInfo | null>(null);

  const acc = useRef({ byCat: {} as Record<string, number>, byCountry: {} as Record<string, number>, iran: 0 });
  const advanceTimer = useRef(0);

  /* birthday-mode inputs */
  const [calSys, setCalSys] = useState<"g" | "j">(lang === "fa" ? "j" : "g");
  const [byYear, setByYear] = useState(1990);
  const [byMonth, setByMonth] = useState(6);
  const [byDay, setByDay] = useState(15);

  const qCount = mode === "daily" ? 10 : 15;
  const dailyDone = mode === "daily" && localStorage.getItem("gyfp_lastDaily") === todayKey();

  const twins = useMemo(() => {
    if (stage !== "intro" || mode !== "birthday") return [];
    let gm = byMonth, gd = byDay;
    if (calSys === "j") {
      if (!isValidJalaali(byYear, byMonth, byDay)) return [];
      const g = toGregorian(byYear, byMonth, byDay);
      gm = g.gm; gd = g.gd;
    }
    const key = `${gm}-${gd}`;
    return PEOPLE.filter((p) => {
      const [, m, d] = p.dob.split("-").map(Number);
      return `${m}-${d}` === key;
    }).slice(0, 6);
  }, [stage, mode, calSys, byYear, byMonth, byDay]);

  const start = () => {
    sfx.play("click");
    let seed = `${mode}-${Date.now()}`;
    let prefer: string[] = [];
    if (mode === "daily") seed = `daily-${todayKey()}`;
    if (mode === "birthday") {
      prefer = twins.map((p) => p.id);
      seed = `bday-${calSys}-${byYear}-${byMonth}-${byDay}`;
    }
    const built = buildGame({ count: qCount, seed, cat: mode === "category" ? cat : undefined, preferIds: prefer });
    if (built.length === 0) return;
    setQs(built);
    setIdx(0); setPhase("play"); setPicked(-1); setScore(0); setStreak(0); setBestStreak(0);
    setCorrectCount(0); setTimeLeft(QTIME);
    acc.current = { byCat: {}, byCountry: {}, iran: 0 };
    setEnd(null);
    setStage("play");
    sfx.play("flip");
  };

  /* timer */
  useEffect(() => {
    if (stage !== "play" || phase !== "play") return;
    const id = window.setInterval(() => setTimeLeft((x) => x - 0.1), 100);
    return () => window.clearInterval(id);
  }, [stage, phase, idx]);

  const finish = (finalScore: number, finalCorrect: number, finalBest: number) => {
    const total = qs.length;
    const summary = {
      score: finalScore, correct: finalCorrect, total, bestStreak: finalBest,
      byCat: acc.current.byCat, byCountry: acc.current.byCountry,
      iranCorrect: acc.current.iran, daily: mode === "daily", win: finalCorrect * 2 > total,
    };
    const res = recordGame(summary);
    if (mode === "daily") {
      localStorage.setItem("gyfp_lastDaily", todayKey());
      const prev = Number(localStorage.getItem("gyfp_dailyBest") ?? 0);
      localStorage.setItem("gyfp_dailyBest", String(Math.max(prev, finalScore)));
    }
    setEnd({ score: finalScore, correct: finalCorrect, total, bestStreak: finalBest, ...res });
    setStage("done");
    sfx.play("complete");
    if (finalCorrect * 2 > total) fireConfetti(finalCorrect === total);
    if (res.levelAfter > res.levelBefore) window.setTimeout(() => sfx.play("levelup"), 600);
  };

  const answer = (i: number) => {
    if (stage !== "play" || phase !== "play") return;
    const q = qs[idx];
    const ok = i === q.correct;
    const timeBonus = ok ? Math.round(Math.max(0, timeLeft)) * (q.diff + 1) : 0;
    const streakBonus = ok ? Math.min(streak * 15, 150) : 0;
    const pts = ok ? q.base + timeBonus + streakBonus : 0;
    setPicked(i);
    setPhase("reveal");
    if (ok) {
      sfx.play("correct");
      const ns = streak + 1;
      setStreak(ns);
      setBestStreak((b) => Math.max(b, ns));
      setCorrectCount((c) => c + 1);
      setScore((s) => s + pts);
      setGain({ v: pts, k: Date.now() });
      if (ns >= 3 && ns % 2 === 1) window.setTimeout(() => sfx.play("streak"), 350);
      acc.current.byCat[q.person.cat] = (acc.current.byCat[q.person.cat] ?? 0) + 1;
      acc.current.byCountry[q.person.cc] = (acc.current.byCountry[q.person.cc] ?? 0) + 1;
      if (q.person.iran) acc.current.iran += 1;
    } else {
      sfx.play("wrong");
      setStreak(0);
    }
    const finalScore = score + pts;
    const finalCorrect = correctCount + (ok ? 1 : 0);
    const finalBest = Math.max(bestStreak, ok ? streak + 1 : bestStreak);
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      if (idx + 1 >= qs.length) finish(finalScore, finalCorrect, finalBest);
      else {
        setIdx((x) => x + 1);
        setPhase("play");
        setPicked(-1);
        setTimeLeft(QTIME);
        sfx.play("flip");
      }
    }, 2400);
  };

  /* timeout */
  useEffect(() => {
    if (stage === "play" && phase === "play" && timeLeft <= 0) answer(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, stage, phase]);

  /* keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (stage !== "play" || phase !== "play") return;
      const n = Number(e.key);
      if (n >= 1 && n <= 5) answer(n - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, phase, idx, streak, score, correctCount, bestStreak, timeLeft, qs]);

  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

  /* ================= INTRO ================= */
  if (stage === "intro") {
    const modeTitle = mode === "daily" ? t("btn.daily") : mode === "birthday" ? t("btn.myBirthday") : mode === "category" && cat ? catName(cat, lang) : t("btn.birthdate");
    const modeDesc = mode === "daily" ? t("mode.daily.desc") : mode === "birthday" ? t("mode.bday.desc") : mode === "category" ? t("mode.cat.desc") : t("mode.classic.desc");
    const catD = mode === "category" && cat ? catDef(cat) : null;
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
        <div className="glass clip-card anim-pop relative overflow-hidden p-7 sm:p-10">
          {catD && (
            <img src={THEMES[catD.theme].art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" draggable={false} />
          )}
          <div className="relative">
            <button type="button" onClick={() => go("/")} className="btn btn-ghost clip-slant px-4 py-2 text-[11px] font-bold">
              <Ic n="home" size={13} /> {t("nav.home")}
            </button>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center bg-gold-500/15 text-gold-400 clip-card">
                <Ic n={mode === "daily" ? "bolt" : mode === "birthday" ? "star" : "calendar"} size={28} />
              </span>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-cream-50">{modeTitle}</h1>
                <p className="mt-1 text-sm text-cream-500">{modeDesc}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 text-[11px] font-bold">
              <span className="clip-tag bg-ink-800 px-3 py-1.5 text-gold-400">{digits(qCount)} {lang === "fa" ? "سؤال" : lang === "ar" ? "أسئلة" : "QUESTIONS"}</span>
              <span className="clip-tag bg-ink-800 px-3 py-1.5 text-mint-400">{digits(5)} {t("quiz.choices")}</span>
              <span className="clip-tag bg-ink-800 px-3 py-1.5 text-coral-400">{digits(QTIME)}s</span>
            </div>

            {mode === "daily" && dailyDone && (
              <div className="mt-6 clip-card-sm border border-gold-500/40 bg-gold-500/10 p-4 text-sm text-gold-300">
                {t("quiz.locked")}
              </div>
            )}

            {mode === "birthday" && (
              <div className="mt-7">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-cream-500">{t("quiz.calendar")}</span>
                  <div className="flex clip-card-sm overflow-hidden border border-ink-600">
                    {(["g", "j"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setCalSys(s); sfx.play("click"); }}
                        className={`px-3.5 py-2 text-[11px] font-bold transition-colors ${calSys === s ? "bg-gold-500 text-ink-950" : "bg-ink-800 text-cream-300 hover:bg-ink-700"}`}
                      >
                        {s === "g" ? t("quiz.gregorian") : t("quiz.jalali")}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-cream-500">{t("bday.year")}</span>
                    <input
                      type="number"
                      value={byYear}
                      min={calSys === "g" ? 1850 : 1240}
                      max={calSys === "g" ? 2025 : 1404}
                      onChange={(e) => setByYear(Number(e.target.value) || 0)}
                      className="mt-1 w-full clip-card-sm border border-ink-600 bg-ink-800 px-3 py-2.5 font-display text-sm font-bold text-cream-50 focus:border-gold-400 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-cream-500">{t("bday.month")}</span>
                    <select
                      value={byMonth}
                      onChange={(e) => setByMonth(Number(e.target.value))}
                      className="mt-1 w-full clip-card-sm border border-ink-600 bg-ink-800 px-3 py-2.5 font-display text-sm font-bold text-cream-50 focus:border-gold-400 focus:outline-none"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>{digits(i + 1)} · {calSys === "g" ? monthNameG(i + 1, lang) : monthNameJ(i + 1)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold tracking-wide text-cream-500">{t("bday.day")}</span>
                    <select
                      value={byDay}
                      onChange={(e) => setByDay(Number(e.target.value))}
                      className="mt-1 w-full clip-card-sm border border-ink-600 bg-ink-800 px-3 py-2.5 font-display text-sm font-bold text-cream-50 focus:border-gold-400 focus:outline-none"
                    >
                      {Array.from({ length: calSys === "j" ? jalaaliMonthLength(byYear || 1399, byMonth) : 31 }, (_, i) => (
                        <option key={i} value={i + 1}>{digits(i + 1)}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-5">
                  <div className="text-[10px] font-bold tracking-[0.2em] text-gold-400">{t("bday.twins")}</div>
                  {twins.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {twins.map((p) => (
                        <div key={p.id} className="anim-pop flex items-center gap-2.5 clip-card-sm border border-ink-600 bg-ink-800/80 p-2 pe-4">
                          <Portrait person={p} className="h-11 w-9" art={false} monogram="text-[10px]" />
                          <div>
                            <div className="font-display text-[11px] font-bold text-cream-50">{localizedName(p, lang)}</div>
                            <div className="text-[9px] text-cream-500">{catName(p.cat, lang)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-cream-500">{calSys === "j" && !isValidJalaali(byYear, byMonth, byDay) ? t("bday.invalid") : t("bday.twinsNone")}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={mode === "daily" && dailyDone}
                onClick={() => start()}
                className="btn btn-primary clip-slant px-9 py-4 text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Ic n="play" size={17} /> {t("btn.start")}
              </button>
              {mode === "daily" && dailyDone && (
                <button type="button" onClick={() => start()} className="btn btn-ghost clip-slant px-6 py-4 text-xs font-bold">
                  <Ic n="refresh" size={15} /> {t("btn.playAgain")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DONE ================= */
  if (stage === "done" && end) {
    const accPct = Math.round((end.correct / end.total) * 100);
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="text-center anim-pop">
          <div className="text-[10px] font-bold tracking-[0.3em] text-mint-400">{t("quiz.results")}</div>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl font-black text-cream-50">
            {t("quiz.complete", { a: digits(end.total), b: digits(end.total) })}
          </h1>
          {end.correct === end.total && (
            <div className="mt-3 inline-block clip-tag bg-gold-500 px-5 py-1.5 font-display text-sm font-black text-ink-950 anim-streak">
              ✦ {t("quiz.perfect")} ✦
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="glass clip-card p-6 text-center md:col-span-1 anim-rise">
            <div className="text-[10px] font-bold tracking-[0.25em] text-cream-500">{t("quiz.finalScore")}</div>
            <div className="mt-3 font-display text-4xl sm:text-5xl font-black text-gold-400">
              <CountUp to={end.score} />
            </div>
            <div className="mt-5 flex justify-center">
              <RingMini value={accPct} label={digits(accPct) + (lang === "fa" ? "٪" : "%")} sub={t("quiz.accuracy")} />
            </div>
          </div>

          <div className="glass clip-card p-6 anim-rise" style={{ animationDelay: "0.1s" }}>
            <div className="grid grid-cols-2 gap-4">
              <StatBox label={t("quiz.accuracy")} value={`${digits(accPct)}${lang === "fa" ? "٪" : "%"}`} color="#4dffd8" />
              <StatBox label={t("quiz.bestStreak")} value={digits(end.bestStreak)} color="#ff8a5c" icon="flame" />
              <StatBox label={t("quiz.correct")} value={`${digits(end.correct)}/${digits(end.total)}`} color="#ffc95c" />
              <StatBox label={t("quiz.xp")} value={`+${fmtNum(end.xpGained, lang)}`} color="#8fb7ff" icon="bolt" />
            </div>
            {end.newAchs.length > 0 && (
              <div className="mt-5 border-t border-ink-700 pt-4">
                <div className="text-[10px] font-bold tracking-[0.22em] text-gold-400">{t("quiz.achUnlocked")}</div>
                <div className="mt-2.5 flex flex-col gap-2">
                  {end.newAchs.map((id) => {
                    const def = ACHIEVEMENTS.find((a) => a.id === id);
                    return (
                      <div key={id} className="anim-pop flex items-center gap-2.5 clip-card-sm bg-gold-500/10 px-3 py-2">
                        <span className="text-gold-400"><Ic n={def?.icon ?? "medal"} size={16} /></span>
                        <span className="font-display text-[11px] font-bold text-cream-50">{t(`ach.${id}`)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="glass clip-card p-6 anim-rise" style={{ animationDelay: "0.2s" }}>
            <div className="text-[10px] font-bold tracking-[0.25em] text-cream-500">{t("profile.level")}</div>
            <div className="mt-3 flex items-center gap-4">
              <RingMini value={100} label={digits(end.levelAfter)} sub="" color="#f5ad1d" />
              <div>
                {end.levelAfter > end.levelBefore ? (
                  <>
                    <div className="font-display text-lg font-black text-mint-400 anim-streak">{t("quiz.levelUp")}</div>
                    <div className="mt-1 text-xs text-cream-300">{t("quiz.newLevel", { a: digits(end.levelAfter) })}</div>
                  </>
                ) : (
                  <>
                    <div className="font-display text-lg font-black text-cream-50">{digits(end.levelAfter)}</div>
                    <div className="mt-1 text-xs text-cream-500">
                      {t("profile.xpNext", { a: fmtNum(Math.max(0, xpForLevel(end.levelAfter + 1) - profile.xp), lang), b: digits(end.levelAfter + 1) })}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <button type="button" onClick={() => { setStage("intro"); sfx.play("click"); }} className="btn btn-primary clip-slant px-5 py-3 text-xs font-black">
                <Ic n="refresh" size={15} /> {t("btn.playAgain")}
              </button>
              <button type="button" onClick={() => go("/leaderboard")} className="btn btn-mint clip-slant px-5 py-3 text-xs font-black">
                <Ic n="trophy" size={15} /> {t("btn.viewBoard")}
              </button>
              <button type="button" onClick={() => go("/")} className="btn btn-ghost clip-slant px-5 py-3 text-xs font-bold">
                <Ic n="home" size={15} /> {t("btn.backHome")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PLAY ================= */
  const q = qs[idx];
  if (!q) return null;
  const [ym, ymM, ymD] = [yearOf(q.person), Number(q.person.dob.split("-")[1]), Number(q.person.dob.split("-")[2])];
  const jal = toJalaali(ym, ymM, ymD);
  const tPct = (timeLeft / QTIME) * 100;
  const timerColor = tPct > 50 ? "#4dffd8" : tPct > 25 ? "#ffc95c" : "#ff5470";

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* HUD */}
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => { window.clearTimeout(advanceTimer.current); go("/"); }} className="btn btn-ghost clip-card-sm px-3 py-2 text-cream-300">
          <Ic n="x" size={15} />
        </button>
        <div className="text-center">
          <div className="font-display text-[11px] sm:text-xs font-bold tracking-wide text-cream-300">
            {t("quiz.question", { a: digits(idx + 1), b: digits(qs.length) })}
          </div>
          <div className="mt-1.5 flex justify-center gap-1">
            {qs.map((_, i) => (
              <span key={i} className={`h-1.5 w-4 clip-card-sm transition-colors ${i < idx ? "bg-mint-500" : i === idx ? "bg-gold-400" : "bg-ink-700"}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="relative text-center">
            <div className="text-[8px] font-bold tracking-[0.2em] text-cream-500">{t("quiz.score")}</div>
            <div className="font-display text-base sm:text-lg font-black text-gold-400">{fmtNum(score, lang)}</div>
            {gain.v > 0 && phase === "reveal" && picked === q.correct && (
              <span key={gain.k} className="anim-score pointer-events-none absolute -top-1 start-1/2 font-display text-sm font-black text-mint-400">
                +{digits(gain.v)}
              </span>
            )}
          </div>
          <div className={`clip-card-sm px-2.5 py-1.5 text-center ${streak >= 3 ? "bg-coral-500/15 text-coral-400" : "bg-ink-800 text-cream-500"}`}>
            <div className="flex items-center gap-1">
              <Ic n="flame" size={14} />
              <span key={streak} className={`font-display text-sm font-black ${streak >= 3 ? "anim-streak" : ""}`}>{digits(streak)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* timer bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
        <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${Math.max(0, tPct)}%`, background: timerColor, boxShadow: `0 0 12px ${timerColor}` }} />
      </div>

      {/* date panel */}
      <div key={idx} className="anim-pop glass clip-card relative mt-6 overflow-hidden p-7 text-center">
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(60% 90% at 50% 0%, rgba(245,173,29,0.35), transparent 70%)" }} />
        <div className="relative">
          <div className="flex items-center justify-center gap-2.5">
            <span className="clip-tag px-3 py-1 font-display text-[9px] font-black tracking-[0.2em]" style={{ background: `${DIFF_COLOR[q.diff]}1f`, color: DIFF_COLOR[q.diff], boxShadow: `inset 0 0 0 1px ${DIFF_COLOR[q.diff]}55` }}>
              {t(`diff.${q.diff}`)}
            </span>
            <button type="button" onClick={() => setShowJalali((s) => !s)} className={`btn clip-card-sm px-2 py-1 ${showJalali ? "text-mint-400 bg-mint-500/10" : "text-cream-500 bg-ink-800"}`}>
              <Ic n="calendar" size={13} />
            </button>
          </div>
          <div className="mt-4 font-display text-4xl sm:text-6xl font-black tracking-tight text-cream-50">
            {showJalali
              ? `${digits(jal.jd)} ${monthNameJ(jal.jm)}`
              : lang === "en"
                ? `${monthNameG(ymM, lang)} ${digits(ymD)}`
                : `${digits(ymD)} ${monthNameG(ymM, lang)}`}
          </div>
          <div className="mt-2 text-[11px] font-semibold tracking-wide text-cream-500">
            {showJalali
              ? `${monthNameG(ymM, lang)} ${digits(ymD)} · ${t("common.gregorianDate")}`
              : `${digits(jal.jd)} ${monthNameJ(jal.jm)} ${digits(jal.jy)} · ${t("common.jalaliDate")}`}
          </div>
          <div className="mt-4 font-display text-sm sm:text-base font-bold tracking-wide text-gold-400">{t("quiz.whoBorn")}</div>
          {phase === "reveal" && (
            <div className={`anim-pop mt-3 font-display text-xl font-black ${picked === q.correct ? "text-mint-400" : "text-coral-400"}`}>
              {picked === -1 ? t("quiz.timeout") : picked === q.correct ? t("quiz.correct") : t("quiz.wrong")}
            </div>
          )}
        </div>
      </div>

      {/* options */}
      <div className="mt-5 flex flex-col gap-2.5">
        {q.options.map((op, i) => {
          const isCorrect = phase === "reveal" && i === q.correct;
          const isWrongPick = phase === "reveal" && picked === i && i !== q.correct;
          const dimmed = phase === "reveal" && !isCorrect && !isWrongPick;
          return (
            <button
              key={`${idx}-${op.id}`}
              type="button"
              onClick={() => answer(i)}
              disabled={phase === "reveal"}
              className={`anim-slide group relative flex items-center gap-3.5 clip-card border p-3 text-start transition-all duration-200 ${
                isCorrect
                  ? "border-mint-400 bg-mint-500/10 shadow-[0_0_24px_rgba(31,224,189,0.25)]"
                  : isWrongPick
                    ? "border-coral-500 bg-coral-500/10 anim-shake"
                    : dimmed
                      ? "border-ink-700 bg-ink-900/60 opacity-40"
                      : "border-ink-600 bg-ink-850/80 hover:border-gold-400/60 hover:bg-ink-800 hover:ps-5"
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center clip-card-sm font-display text-[11px] font-black ${isCorrect ? "bg-mint-500 text-ink-950" : isWrongPick ? "bg-coral-500 text-ink-950" : "bg-ink-700 text-cream-300"}`}>
                {digits(i + 1)}
              </span>
              <Portrait person={op} className="h-12 w-10 shrink-0" art={false} monogram="text-[10px]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[13px] sm:text-sm font-bold text-cream-50">{localizedName(op, lang)}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-cream-500">
                  <span className="text-gold-300">{countryCode3(op.cc)}</span>
                  <span>·</span>
                  <span>{catName(op.cat, lang)}</span>
                </span>
              </span>
              {phase === "reveal" && (isCorrect || isWrongPick) && (
                <span className={`shrink-0 ${isCorrect ? "text-mint-400" : "text-coral-400"}`}>
                  <Ic n={isCorrect ? "check" : "x"} size={20} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {phase === "reveal" && (
        <div className="mt-5 flex justify-center">
          <button type="button" onClick={() => { window.clearTimeout(advanceTimer.current); advance(); }} className="btn btn-primary clip-slant px-8 py-3 text-xs font-black">
            {idx + 1 >= qs.length ? t("quiz.results") : t("quiz.next")} <Ic n="arrow" size={14} className="rtl:-scale-x-100" />
          </button>
        </div>
      )}
    </div>
  );

  function advance() {
    if (idx + 1 >= qs.length) {
      finish(score, correctCount, bestStreak);
    } else {
      setIdx((x) => x + 1);
      setPhase("play");
      setPicked(-1);
      setTimeLeft(QTIME);
      sfx.play("flip");
    }
  }
}

function StatBox({ label, value, color, icon }: { label: string; value: string; color: string; icon?: string }) {
  return (
    <div className="clip-card-sm border border-ink-700 bg-ink-900/70 p-3.5">
      <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.18em] text-cream-500">
        {icon && <span style={{ color }}><Ic n={icon} size={11} /></span>}
        {label}
      </div>
      <div className="mt-1.5 font-display text-lg font-black" style={{ color }}>{value}</div>
    </div>
  );
}

function RingMini({ value, label, sub, color = "#1fe0bd" }: { value: number; label: string; sub: string; color?: string }) {
  const size = 86;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(77,115,150,0.25)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-lg font-black text-cream-50">{label}</div>
        {sub && <div className="text-[8px] font-bold tracking-wide text-cream-500">{sub}</div>}
      </div>
    </div>
  );
}
