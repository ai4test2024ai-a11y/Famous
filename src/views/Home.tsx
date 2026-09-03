import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { DIFFS, todayKey, mulberry32, hashStr } from "../lib/quiz";
import { monthNameG } from "../lib/i18n";
import type { Person } from "../data/people";
import { PEOPLE, CATEGORIES, localizedName, catDef, countryCode3 } from "../data/people";
import { Ic, Portrait, RARITY_COLOR, fireConfetti } from "../components/ui";
import { sfx } from "../lib/audio";

/* ---------------- emoji per category ---------------- */
const CAT_EMOJI: Record<string, string> = {
  football: "⚽", basketball: "🏀", tennis: "🎾", motorsport: "🏎️", boxing: "🥊",
  athletics: "🏃", actors: "🎬", actresses: "🎭", singers: "🎤", rappers: "🎧",
  composers: "🎹", scientists: "🧪", tech: "💻", entrepreneurs: "💼", historical: "🏛️",
  leaders: "👑", writers: "📚", artists: "🎨", astronauts: "🚀", comedians: "😂", internet: "📱",
};

/* ---------------- birthdate mystery ticket (cycles real dates) ---------------- */
const TICKET_DATES = [
  { m: 12, d: 25 }, { m: 6, d: 24 }, { m: 10, d: 23 }, { m: 4, d: 5 }, { m: 8, d: 21 },
];
function DateTicket({ onPlay }: { onPlay: () => void }) {
  const { t, lang, digits } = useApp();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % TICKET_DATES.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  const { m, d } = TICKET_DATES[i];
  return (
    <div className="glass clip-card relative -rotate-2 p-5 text-center shadow-2xl shadow-black/60">
      <div className="text-[9px] font-bold tracking-[0.3em] text-mint-400">{t("quiz.whoBorn")}</div>
      <div key={i} className="anim-flicker mt-2 font-display text-2xl font-black leading-tight text-gold-400">
        {lang === "en" ? `${monthNameG(m, lang)} ${digits(d)}` : `${digits(d)} ${monthNameG(m, lang)}`}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {TICKET_DATES.map((_, k) => (
          <span key={k} className={`h-4 w-8 clip-card-sm transition-colors ${k === i ? "bg-gold-500" : "bg-ink-700"}`} />
        ))}
      </div>
      <div className="mt-2 font-display text-4xl font-black text-outline-gold select-none">?</div>
      <button type="button" onClick={onPlay} className="btn btn-primary clip-slant mt-3 w-full px-5 py-3 text-xs font-black">
        <Ic n="play" size={14} /> {t("home.play")}
      </button>
    </div>
  );
}

/* ---------------- colorful collectible card ---------------- */
function LegendCard({ p, className = "" }: { p: Person; className?: string }) {
  const { lang } = useApp();
  const th = catDef(p.cat);
  return (
    <div className={className}>
      <div
        className="clip-card relative w-full overflow-hidden"
        style={{ boxShadow: `0 16px 38px rgba(0,0,0,0.55), 0 0 0 2px ${th.c1}59, 0 0 26px ${th.c1}30` }}
      >
        <Portrait person={p} className="aspect-[3/4.1] w-full" monogram="text-2xl" />
        <span className="absolute top-1.5 start-1.5 z-10 clip-tag bg-ink-950/85 px-2 py-0.5 text-[12px] leading-4" aria-hidden>
          {CAT_EMOJI[p.cat] ?? "⭐"}
        </span>
        <span className="absolute top-1.5 end-1.5 z-10 rounded-sm px-1.5 py-0.5 font-display text-[8px] font-black text-ink-950" style={{ background: RARITY_COLOR(p.pop) }}>
          {"★".repeat(Math.max(1, Math.min(5, p.pop)))}
        </span>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent px-2 pb-2 pt-7 text-center">
          <div className="font-display text-[11px] font-black leading-tight text-cream-50 [text-shadow:0_2px_8px_rgba(5,11,18,0.9)]">
            {localizedName(p, lang)}
          </div>
          <div className="mt-0.5 text-[8px] font-black tracking-[0.22em]" style={{ color: th.c2 }}>
            {countryCode3(p.cc)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- floating card field behind the WHOLE page ---------------- */
const FIELD: { id: string; top: string; pos: string; w: string; delay: string; dur: string; r0: string; r1: string }[] = [
  { id: "messi", top: "1.5%", pos: "start-[3%]", w: "w-24 sm:w-32 lg:w-44", delay: "0s", dur: "6.5s", r0: "-5deg", r1: "2deg" },
  { id: "michael-jackson", top: "3.5%", pos: "end-[4%]", w: "w-22 sm:w-28 lg:w-40", delay: "0.8s", dur: "7.5s", r0: "4deg", r1: "-2deg" },
  { id: "cyrus", top: "8.5%", pos: "start-[20%]", w: "w-20 sm:w-26 lg:w-32", delay: "1.6s", dur: "8.5s", r0: "2deg", r1: "-3deg" },
  { id: "monroe", top: "12%", pos: "end-[16%]", w: "w-22 sm:w-28 lg:w-36", delay: "0.4s", dur: "7s", r0: "3deg", r1: "-4deg" },
  { id: "einstein", top: "17%", pos: "start-[4%]", w: "w-24 sm:w-30 lg:w-40", delay: "1.2s", dur: "6s", r0: "-3deg", r1: "4deg" },
  { id: "jordan", top: "23%", pos: "end-[3%]", w: "w-24 sm:w-30 lg:w-40", delay: "2s", dur: "8s", r0: "-4deg", r1: "2deg" },
  { id: "da-vinci", top: "28%", pos: "start-[11%]", w: "w-20 sm:w-26 lg:w-32", delay: "1.8s", dur: "7.8s", r0: "-6deg", r1: "3deg" },
  { id: "swift", top: "33%", pos: "end-[13%]", w: "w-22 sm:w-28 lg:w-36", delay: "0.6s", dur: "7.2s", r0: "5deg", r1: "-3deg" },
  { id: "musk", top: "38%", pos: "start-[2%]", w: "w-20 sm:w-26 lg:w-32", delay: "1.4s", dur: "6.8s", r0: "-3deg", r1: "2deg" },
  { id: "cleopatra", top: "43%", pos: "end-[4%]", w: "w-22 sm:w-28 lg:w-36", delay: "0.2s", dur: "8.2s", r0: "4deg", r1: "-4deg" },
  { id: "gandhi", top: "48%", pos: "start-[15%]", w: "w-20 sm:w-26 lg:w-32", delay: "1s", dur: "7.6s", r0: "-4deg", r1: "3deg" },
  { id: "picasso", top: "54%", pos: "end-[9%]", w: "w-20 sm:w-26 lg:w-32", delay: "2.2s", dur: "6.4s", r0: "3deg", r1: "-2deg" },
  { id: "armstrong", top: "59%", pos: "start-[3%]", w: "w-24 sm:w-30 lg:w-36", delay: "0.9s", dur: "7s", r0: "-5deg", r1: "2deg" },
  { id: "beyonce", top: "64%", pos: "end-[2%]", w: "w-20 sm:w-26 lg:w-32", delay: "1.7s", dur: "8.6s", r0: "5deg", r1: "-3deg" },
  { id: "ronaldo", top: "70%", pos: "start-[9%]", w: "w-22 sm:w-28 lg:w-36", delay: "0.5s", dur: "6.6s", r0: "-3deg", r1: "4deg" },
  { id: "rumi", top: "76%", pos: "end-[12%]", w: "w-20 sm:w-26 lg:w-32", delay: "1.3s", dur: "7.4s", r0: "4deg", r1: "-2deg" },
  { id: "shakira", top: "82%", pos: "start-[2%]", w: "w-20 sm:w-26 lg:w-32", delay: "2.1s", dur: "7.9s", r0: "-4deg", r1: "3deg" },
  { id: "napoleon", top: "88%", pos: "end-[5%]", w: "w-20 sm:w-26 lg:w-34", delay: "0.7s", dur: "6.9s", r0: "3deg", r1: "-4deg" },
];

function CardField() {
  const byId = useMemo(() => new Map(PEOPLE.map((p) => [p.id, p])), []);
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 opacity-75 sm:opacity-90">
        {FIELD.map((f) => {
          const p = byId.get(f.id);
          if (!p) return null;
          return (
            <div key={f.id} className={`absolute ${f.pos}`} style={{ top: f.top, animationDelay: f.delay }}>
              <div className="anim-floaty" style={{ ["--r0" as string]: f.r0, ["--r1" as string]: f.r1, animationDelay: f.delay, animationDuration: f.dur } as CSSProperties}>
                <LegendCard p={p} className={f.w} />
              </div>
            </div>
          );
        })}
      </div>
      {/* dark scrim so content stays readable over the collage */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/55 to-ink-950/80" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 40% at 50% 8%, rgba(245,173,29,0.1), transparent 60%), radial-gradient(50% 35% at 85% 60%, rgba(31,224,189,0.08), transparent 60%)" }} />
    </div>
  );
}

/* ---------------- section heading ---------------- */
function Head({ emoji, title, end }: { emoji: string; title: string; end?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="flex items-center gap-2.5 font-display text-sm font-black tracking-[0.18em] text-cream-50 sm:text-base">
        <span className="text-lg" aria-hidden>{emoji}</span> {title}
      </h2>
      {end && <span className="text-[10px] font-bold tracking-[0.2em] text-cream-500">{end}</span>}
    </div>
  );
}

const FLOAT_EMOJI = [
  { e: "⚽", pos: "top-[26%] start-[6%]", delay: "0.3s" },
  { e: "🎤", pos: "bottom-[32%] end-[4%]", delay: "1.1s" },
  { e: "👑", pos: "top-[8%] end-[26%]", delay: "1.9s" },
  { e: "🚀", pos: "bottom-[10%] start-[34%]", delay: "0.7s" },
  { e: "🎬", pos: "top-[55%] start-[-8px]", delay: "1.5s" },
];

export default function Home() {
  const { t, lang, digits, profile, isUnlocked } = useApp();
  const [diff, setDiff] = useState(1);
  const [revealed, setRevealed] = useState(false);

  const legend = useMemo(() => {
    const rng = mulberry32(hashStr(`legend-${todayKey()}`));
    return PEOPLE[Math.floor(rng() * PEOPLE.length)];
  }, []);

  const tickerNames = useMemo(() => [...PEOPLE].sort((a, b) => b.pop - a.pop).slice(0, 36), []);

  const play = (mode: string) => {
    sfx.play("click");
    go(`/quiz?mode=${mode}&diff=${diff}`);
  };

  const modes = [
    { id: "classic", icon: "calendar", emoji: "🎯", c: "#ffc95c" },
    { id: "daily", icon: "bolt", emoji: "🌟", c: "#8fb7ff" },
    { id: "time", icon: "clock", emoji: "⏱️", c: "#4dffd8" },
    { id: "streak", icon: "flame", emoji: "🔥", c: "#ff5470" },
  ];

  const DIFF_C = ["#4dffd8", "#ffc95c", "#ff8a5c", "#ff5470"];
  const legendTheme = catDef(legend.cat);

  return (
    <div className="relative overflow-hidden">
      <CardField />

      <div className="relative z-10">
        {/* ================= HERO (centered, ticket in the middle of the collage) ================= */}
        <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-18">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="anim-rise">
              <div className="inline-flex items-center gap-2.5 glass clip-tag px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.22em] text-mint-300">
                  ⭐ {digits(PEOPLE.length)}+ {t("home.stats.people")}
                </span>
              </div>

              <h1 className="mt-6 font-display font-black leading-[1.02] tracking-tight text-[clamp(1.9rem,6.5vw,4.3rem)]">
                {t("brand").split(" ").map((w, i, arr) => (
                  <span key={i} className={i === 0 ? "text-outline" : i === arr.length - 1 ? "text-gold-400" : "text-cream-50"}>{w}{" "}</span>
                ))}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-cream-300 sm:text-lg">{t("tagline")}</p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button type="button" onClick={() => play("classic")} className="btn btn-primary clip-slant px-10 py-4 text-sm font-black sm:text-base">
                  <Ic n="play" size={18} /> {t("home.play")}
                </button>
                <button type="button" onClick={() => play("daily")} className="btn btn-ghost clip-slant px-6 py-4 text-xs font-bold sm:text-sm">
                  <Ic n="bolt" size={16} /> {t("mode.daily")}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={() => play("time")} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] font-bold sm:text-xs">
                  <Ic n="clock" size={14} /> {t("mode.time")}
                </button>
                <button type="button" onClick={() => play("streak")} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] font-bold sm:text-xs">
                  <Ic n="flame" size={14} /> {t("mode.streak")}
                </button>
                <button type="button" onClick={() => { sfx.play("click"); go("/board"); }} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] font-bold sm:text-xs">
                  <Ic n="trophy" size={14} /> {t("nav.board")}
                </button>
              </div>
            </div>

            {/* the iconic birthdate ticket, floating among the cards */}
            <div className="anim-rise relative mx-auto mt-10 w-full max-w-[300px]" style={{ animationDelay: "0.15s" }}>
              <div className="absolute -inset-3 opacity-40 blur-2xl" style={{ background: "linear-gradient(140deg, #f5ad1d, #1fe0bd)" }} aria-hidden />
              <div className="relative">
                <DateTicket onPlay={() => play("classic")} />
              </div>
            </div>

            <div className="anim-rise mx-auto mt-10 grid max-w-lg grid-cols-3 gap-3" style={{ animationDelay: "0.25s" }}>
              {[
                { n: digits(PEOPLE.length), l: t("home.stats.people"), e: "👤" },
                { n: digits(CATEGORIES.length), l: t("home.stats.cats"), e: "🗂️" },
                { n: digits(profile.questions), l: t("home.stats.answered"), e: "✅" },
              ].map((s) => (
                <div key={s.l} className="glass clip-card-sm px-3 py-3.5 text-center transition-transform hover:-translate-y-0.5">
                  <div className="text-sm" aria-hidden>{s.e}</div>
                  <div className="mt-0.5 font-display text-lg font-black text-gold-400 sm:text-2xl">{s.n}</div>
                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-cream-500">{s.l}</div>
                </div>
              ))}
            </div>

            {/* small floating emojis */}
            <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
              {FLOAT_EMOJI.map((f) => (
                <span key={f.e + f.pos} className={`anim-floaty absolute ${f.pos} text-2xl opacity-60`} style={{ animationDelay: f.delay }}>
                  {f.e}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================= NAMES TICKER ================= */}
        <div className="relative overflow-hidden border-y border-ink-700/60 bg-ink-900/80 py-3 backdrop-blur-sm">
          <div className="marquee flex w-max items-center gap-7 whitespace-nowrap">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center gap-7">
                {tickerNames.map((p) => (
                  <span key={`${rep}-${p.id}`} className="flex items-center gap-2.5">
                    <span className="text-sm" aria-hidden>{CAT_EMOJI[p.cat] ?? "⭐"}</span>
                    <span className="font-display text-[13px] font-bold tracking-wide" style={{ color: catDef(p.cat).c2 }}>
                      {localizedName(p, lang)}
                    </span>
                    <span className="text-gold-500/70">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* ================= GAME MODES ================= */}
          <section className="pt-14">
            <Head emoji="🎮" title={t("home.modes")} end={t("home.pick")} />
            <div className="grid gap-4 sm:grid-cols-2">
              {modes.map((m, i) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => play(m.id)}
                  className={`card-glow clip-card glass group relative overflow-hidden p-6 text-start transition-all hover:-translate-y-1 ${i === 0 ? "sm:row-span-2 sm:p-8" : ""}`}
                  style={{ ["--g1" as string]: `${m.c}66`, ["--g2" as string]: `${m.c}40` } as CSSProperties}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center clip-card-sm text-2xl" style={{ background: `${m.c}1f` }} aria-hidden>
                      {m.emoji}
                    </span>
                    <span className="text-ink-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                      <Ic n="arrow" size={20} className="rtl:-scale-x-100" />
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-black text-cream-50 sm:text-xl">{t(`mode.${m.id}`)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream-500">{t(`mode.${m.id}.d`)}</p>
                  {i === 0 && (
                    <div className="mt-6 flex items-end gap-3">
                      <div className="clip-card-sm px-4 py-2 font-display text-2xl font-black text-ink-950" style={{ background: m.c }}>
                        {digits(15)}
                      </div>
                      <div className="pb-0.5">
                        <div className="font-display text-sm font-bold" style={{ color: m.c }}>{t("home.rounds")}</div>
                        <div className="text-[10px] tracking-[0.2em] text-cream-500">{digits(4)} × ?</div>
                      </div>
                    </div>
                  )}
                  <span className="mt-4 inline-block clip-tag bg-ink-800 px-3 py-1 text-[10px] font-bold" style={{ color: DIFF_C[diff - 1] }}>
                    {t(`diff.${diff}`)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ================= DIFFICULTY ================= */}
          <section className="pt-14">
            <Head emoji="🎚️" title={t("diff.label")} end={`${t("profile.level")} ${digits(1 + Math.floor(Math.sqrt(Math.max(0, profile.xp) / 120)))}`} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DIFFS.map((d) => {
                const unlocked = isUnlocked(d.id);
                const active = diff === d.id;
                const prevAcc = profile.bestAcc[d.id - 1];
                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => { setDiff(d.id); sfx.play("click"); }}
                    className={`clip-card relative p-4 text-start transition-all disabled:cursor-not-allowed ${active ? "bg-gold-500/15 shadow-[inset_0_0_0_1.5px_rgba(245,173,29,0.6)]" : "bg-ink-850/85 hover:bg-ink-800"} ${unlocked ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-black" style={{ color: DIFF_C[d.id - 1] }}>{t(`diff.${d.id}`)}</span>
                      {!unlocked && <Ic n="lock" size={15} className="text-cream-500" />}
                    </div>
                    <div className="mt-1.5 text-[10px] text-cream-500">{digits(d.base)}+ {t("quiz.score")} · {digits(d.time)}s</div>
                    {unlocked && (profile.bestAcc[d.id] ?? 0) > 0 && (
                      <div className="mt-1 text-[10px] font-bold text-mint-400">
                        {t("quiz.accuracy")}: {digits(profile.bestAcc[d.id])}{lang === "fa" ? "٪" : "%"}
                      </div>
                    )}
                    {!unlocked && (
                      <div className="mt-1 text-[9px] leading-relaxed text-coral-400">
                        {t("diff.locked", { a: digits(50), b: t(`diff.${d.id - 1}`) })}
                        {prevAcc !== undefined ? ` (${digits(prevAcc)}${lang === "fa" ? "٪" : "%"})` : ""}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================= LEGEND OF THE DAY ================= */}
          <section className="pt-14">
            <Head emoji="🏆" title={t("home.legend")} end={t("home.legendSub")} />
            <div className="clip-card glass relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 80% at 15% 50%, ${legendTheme.c1}1e, transparent 60%)` }} aria-hidden />
              <div className="relative grid gap-6 p-6 sm:p-8 md:grid-cols-[240px_1fr] md:items-center">
                <div className="relative mx-auto w-full max-w-[240px]">
                  <div className="absolute -inset-2 opacity-40 blur-2xl" style={{ background: `linear-gradient(140deg, ${legendTheme.c1}, ${legendTheme.c2})` }} aria-hidden />
                  <div className={`clip-card relative border-2 transition-all duration-700 ${revealed ? "" : "blur-[16px] saturate-50"}`} style={{ borderColor: `${RARITY_COLOR(legend.pop)}77` }}>
                    <Portrait person={legend} className="aspect-[3/4] w-full" monogram="text-4xl" />
                    <span className="absolute top-2 start-2 z-10 clip-tag bg-ink-950/85 px-2 py-0.5 text-sm" aria-hidden>{CAT_EMOJI[legend.cat] ?? "⭐"}</span>
                  </div>
                  {!revealed && (
                    <button
                      type="button"
                      onClick={() => { setRevealed(true); sfx.play("correct"); fireConfetti(false); }}
                      className="btn btn-primary clip-slant absolute inset-0 m-auto h-fit w-fit px-7 py-3 text-xs font-black"
                    >
                      <Ic n="eye" size={15} /> {t("home.reveal")}
                    </button>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.25em]" style={{ color: legendTheme.c2 }}>
                    <Ic n={legendTheme.icon} size={14} /> {catDef(legend.cat).name[lang === "en" ? 0 : lang === "fa" ? 1 : 2]}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-black text-cream-50 sm:text-4xl">
                    {revealed ? localizedName(legend, lang) : "؟ ؟ ؟"}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-300">
                    {revealed ? legend.famous : t("home.legendSub")}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={() => play("classic")} className="btn btn-mint clip-slant px-6 py-3 text-xs font-black">
                      <Ic n="play" size={14} /> {t("home.play")}
                    </button>
                    <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-ghost clip-slant px-6 py-3 text-xs font-bold">
                      <Ic n="search" size={14} /> {t("nav.explore")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CATEGORIES ================= */}
          <section className="pt-14">
            <Head emoji="🗂️" title={t("home.stats.cats")} end={`${digits(CATEGORIES.length)}`} />
            <div className="-mx-4 flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-2 sm:mx-0 sm:px-0">
              {CATEGORIES.map((c) => {
                const count = PEOPLE.filter((p) => p.cat === c.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { sfx.play("click"); go(`/explore?cat=${c.id}`); }}
                    className="clip-card group relative w-40 shrink-0 overflow-hidden p-4 text-start transition-transform hover:-translate-y-1"
                    style={{ background: `linear-gradient(160deg, ${c.c1}2b, #0b1826 72%)`, boxShadow: `inset 0 0 0 1px ${c.c1}38` }}
                  >
                    <span className="text-xl" aria-hidden>{CAT_EMOJI[c.id] ?? "⭐"}</span>
                    <div className="mt-2.5 font-display text-[12px] font-bold leading-snug text-cream-50">
                      {c.name[lang === "en" ? 0 : lang === "fa" ? 1 : 2]}
                    </div>
                    <div className="mt-1 text-[10px] font-semibold" style={{ color: c.c2 }}>
                      {digits(count)} {t("home.stats.people")}
                    </div>
                    <span className="absolute -bottom-3 -end-3 opacity-10 transition-opacity group-hover:opacity-30" style={{ color: c.c1 }} aria-hidden>
                      <Ic n={c.icon} size={64} />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ================= HOW IT WORKS ================= */}
          <section className="pt-14">
            <Head emoji="❓" title={t("home.how.t")} />
            <div className="relative grid gap-4 md:grid-cols-3">
              <div className="pointer-events-none absolute top-9 start-[12%] end-[12%] hidden border-t-2 border-dashed border-ink-600 md:block" aria-hidden />
              {[1, 2, 3].map((n) => (
                <div key={n} className="clip-card relative bg-ink-850/85 p-6 transition-transform hover:-translate-y-1" style={{ boxShadow: "inset 0 0 0 1px rgba(77,115,150,0.22)" }}>
                  <div className="relative z-10 flex h-9 w-9 items-center justify-center clip-card-sm bg-gold-500 font-display text-sm font-black text-ink-950">
                    {digits(n)}
                  </div>
                  <h3 className="mt-4 font-display text-[13px] font-black tracking-wide text-cream-50">{t(`home.how.${n}t`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-500">{t(`home.how.${n}d`)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ================= BROWSE CTA ================= */}
          <section className="mt-14 mb-4">
            <div className="clip-card relative overflow-hidden p-7 sm:p-9" style={{ background: "linear-gradient(120deg, rgba(245,173,29,0.16), rgba(31,224,189,0.1) 55%, rgba(255,84,112,0.13))", boxShadow: "inset 0 0 0 1px rgba(245,173,29,0.3)" }}>
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-display text-2xl font-black text-cream-50 sm:text-3xl">
                    <span aria-hidden>🌍</span> {t("home.browse.t")}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream-300">{t("home.browse.d")}</p>
                </div>
                <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-primary clip-slant shrink-0 px-8 py-4 text-sm font-black">
                  <Ic n="search" size={17} /> {t("nav.explore")}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
