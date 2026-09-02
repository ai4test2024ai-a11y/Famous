import { useEffect, useMemo, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { DIFFS, todayKey, mulberry32, hashStr } from "../lib/quiz";
import { PEOPLE, CATEGORIES, localizedName } from "../data/people";
import { Ic, Portrait, PersonCard, fireConfetti } from "../components/ui";
import { sfx } from "../lib/audio";

/* ---------------- mystery ticket (cycles real game facts) ---------------- */
function Ticket({ onPlay }: { onPlay: () => void }) {
  const { t, digits } = useApp();
  const facts = useMemo(() => [
    `${digits(15)} ${t("home.rounds")}`,
    `${digits(4)} ${t("home.choices")}`,
    `${digits(300)} ${t("quiz.score")}`,
    `${digits(25)}–${digits(12)} ${t("home.secs")}`,
  ], [digits, t]);
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % facts.length), 2400);
    return () => window.clearInterval(id);
  }, [facts.length]);
  return (
    <div className="glass clip-card relative p-5 text-center">
      <div className="text-[9px] font-bold tracking-[0.3em] text-mint-400">{t("home.ticket.facts")}</div>
      <div key={i} className="anim-flicker mt-2 font-display text-xl font-black leading-tight text-gold-400">{facts[i]}</div>
      <div className="mt-3 flex justify-center gap-1.5">
        {facts.map((_, k) => (
          <span key={k} className={`h-3.5 w-7 clip-card-sm transition-colors ${k === i ? "bg-gold-500" : "bg-ink-700"}`} />
        ))}
      </div>
      <div className="mt-2 font-display text-4xl font-black text-outline-gold select-none">?</div>
      <button type="button" onClick={onPlay} className="btn btn-primary clip-slant mt-3 w-full px-5 py-3 text-xs font-black">
        <Ic n="play" size={14} /> {t("home.play")}
      </button>
    </div>
  );
}

const FLOAT_POS = [
  "top-0 start-6 w-44 z-20", "top-10 end-0 w-40 z-10", "top-52 start-0 w-40 z-10",
  "top-44 end-8 w-48 z-30", "bottom-6 start-16 w-44 z-20", "bottom-0 end-0 w-36 z-10",
];

export default function Home() {
  const { t, lang, digits, profile, isUnlocked } = useApp();
  const [diff, setDiff] = useState(1);
  const [revealed, setRevealed] = useState(false);

  const legend = useMemo(() => {
    const rng = mulberry32(hashStr(`legend-${todayKey()}`));
    return PEOPLE[Math.floor(rng() * PEOPLE.length)];
  }, []);

  const famous = useMemo(() => PEOPLE.filter((p) => p.pop >= 5), []);
  const floaters = useMemo(() => [0, 6, 12, 18, 24, 30].map((i) => famous[i % famous.length]), [famous]);
  const tickerNames = useMemo(() => [...PEOPLE].sort((a, b) => b.pop - a.pop).slice(0, 40), []);

  const play = (mode: string) => {
    sfx.play("click");
    go(`/quiz?mode=${mode}&diff=${diff}`);
  };

  const modes = [
    { id: "classic", icon: "calendar", c: "#ffc95c" },
    { id: "time", icon: "clock", c: "#4dffd8" },
    { id: "streak", icon: "flame", c: "#ff5470" },
    { id: "daily", icon: "bolt", c: "#8fb7ff" },
  ];
  const words = t("brand").split(" ");

  return (
    <div className="relative">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 75% 15%, rgba(245,173,29,0.14), transparent 60%), radial-gradient(50% 50% at 12% 85%, rgba(31,224,189,0.1), transparent 60%)" }} aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="anim-rise">
            <div className="inline-flex items-center gap-2.5 glass clip-tag px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.22em] text-mint-300">
                {digits(PEOPLE.length)}+ {t("home.stats.people")}
              </span>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.1rem,6.5vw,4.4rem)] font-black leading-[1] tracking-tight">
              {words.map((w, i) => (
                <span key={i} className={i === 0 ? "text-outline" : i === words.length - 1 ? "text-gold-400" : "text-cream-50"}>{w}{" "}</span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-base text-cream-300 sm:text-lg">{t("tagline")}</p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => play("classic")} className="btn btn-primary clip-slant px-9 py-4 text-sm font-black sm:text-base">
                <Ic n="play" size={18} /> {t("home.play")}
              </button>
              <button type="button" onClick={() => play("daily")} className="btn btn-ghost clip-slant px-6 py-4 text-xs font-bold sm:text-sm">
                <Ic n="bolt" size={16} /> {t("mode.daily")}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
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

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { n: digits(PEOPLE.length), l: t("home.stats.people") },
                { n: digits(CATEGORIES.length), l: t("home.stats.cats") },
                { n: digits(profile.questions), l: t("home.stats.answered") },
              ].map((s) => (
                <div key={s.l} className="glass clip-card-sm px-3 py-3.5 text-center">
                  <div className="font-display text-lg font-black text-gold-400 sm:text-2xl">{s.n}</div>
                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-cream-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating cards + ticket */}
          <div className="relative hidden h-[540px] lg:block" aria-hidden>
            {floaters.map((p, i) => (
              <div key={`${p.id}-${i}`} className={`absolute ${FLOAT_POS[i]}`} style={{ ["--r0" as string]: `${-5 + i * 2}deg`, ["--r1" as string]: `${3 - i}deg`, animationDelay: `${i * 0.7}s` }}>
                <div className="anim-floaty" style={{ animationDelay: `${i * 0.7}s` }}>
                  <div className="clip-card shadow-2xl shadow-black/60">
                    <PersonCard person={p} onClick={() => { sfx.play("click"); go("/explore"); }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="anim-floaty absolute start-[30%] top-[40%] z-40 w-56" style={{ ["--r0" as string]: "-2deg", ["--r1" as string]: "2deg" }}>
              <Ticket onPlay={() => play("classic")} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <div className="relative overflow-hidden border-y border-ink-700/60 bg-ink-900/70 py-3">
        <div className="marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex items-center gap-8">
              {tickerNames.map((p) => (
                <span key={`${rep}-${p.id}`} className="flex items-center gap-8">
                  <span className="font-display text-sm font-bold tracking-wide text-cream-300">{localizedName(p, lang)}</span>
                  <span className="text-gold-500">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Ic n="play" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.modes")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modes.map((m, i) => (
            <button key={m.id} type="button" onClick={() => play(m.id)}
              className="card group glass clip-card relative overflow-hidden p-6 text-start transition-transform hover:-translate-y-1"
              style={{ boxShadow: `inset 0 0 0 1px ${m.c}26` }}>
              <div className="flex items-start justify-between gap-4">
                <span className="clip-card-sm flex h-11 w-11 items-center justify-center" style={{ background: `${m.c}1f`, color: m.c }}>
                  <Ic n={m.icon} size={22} />
                </span>
                <span className="text-ink-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <Ic n="arrow" size={20} className="rtl:-scale-x-100" />
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-black text-cream-50">{t(`mode.${m.id}`)}</h3>
              <p className="mt-1.5 text-sm text-cream-500">{t(`mode.${m.id}.d`)}</p>
              {i === 0 && <span className="clip-tag mt-3 inline-block bg-ink-800 px-3 py-1 text-[10px] font-bold text-gold-400">{t(`diff.${diff}`)}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* ================= DIFFICULTY ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Ic n="target" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("diff.label")}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DIFFS.map((d) => {
            const unlocked = isUnlocked(d.id);
            const active = diff === d.id;
            const prevAcc = profile.bestAcc[d.id - 1];
            return (
              <button key={d.id} type="button" disabled={!unlocked} onClick={() => { setDiff(d.id); sfx.play("click"); }}
                className={`clip-card relative p-4 text-start transition-all disabled:cursor-not-allowed ${active ? "bg-gold-500/15 shadow-[inset_0_0_0_1.5px_rgba(245,173,29,0.6)]" : "bg-ink-850/80 hover:bg-ink-800"} ${unlocked ? "" : "opacity-50"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-black" style={{ color: ["#4dffd8", "#ffc95c", "#ff8a5c", "#ff5470"][d.id - 1] }}>{t(`diff.${d.id}`)}</span>
                  {!unlocked && <Ic n="lock" size={15} className="text-cream-500" />}
                </div>
                <div className="mt-1.5 text-[10px] text-cream-500">{digits(d.base)}+ {t("quiz.score")} · {digits(d.time)}s</div>
                {unlocked && (profile.bestAcc[d.id] ?? 0) > 0 && (
                  <div className="mt-1 text-[10px] font-bold text-mint-400">{t("quiz.accuracy")}: {digits(profile.bestAcc[d.id])}{lang === "fa" ? "٪" : "%"}</div>
                )}
                {!unlocked && (
                  <div className="mt-1 text-[9px] text-coral-400">{t("diff.locked", { a: digits(50), b: t(`diff.${d.id - 1}`) })}{prevAcc !== undefined ? ` (${digits(prevAcc)}${lang === "fa" ? "٪" : "%"})` : ""}</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= LEGEND OF THE DAY ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Ic n="star" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.legend")}</h2>
        </div>
        <div className="grid items-stretch gap-6 md:grid-cols-[300px_1fr]">
          <div className="relative mx-auto w-full max-w-[300px]">
            <div className={`clip-card overflow-hidden shadow-2xl shadow-black/50 transition-all duration-700 ${revealed ? "" : "blur-[16px] saturate-50"}`}>
              <Portrait person={legend} className="aspect-[3/4] w-full" monogram="text-5xl" />
            </div>
            {!revealed && (
              <button type="button" onClick={() => { setRevealed(true); sfx.play("correct"); fireConfetti(false); }}
                className="btn btn-primary clip-slant absolute inset-0 m-auto h-fit w-fit px-8 py-3.5 text-sm font-black">
                <Ic n="eye" size={16} /> {t("home.reveal")}
              </button>
            )}
          </div>
          <div className="glass clip-card flex flex-col justify-center p-7">
            <div className="text-[10px] font-bold tracking-[0.25em] text-gold-400">{t("home.legendSub")}</div>
            <h3 className="mt-3 font-display text-3xl font-black text-cream-50 sm:text-4xl">
              {revealed ? localizedName(legend, lang) : "؟ ؟ ؟"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-500">{revealed ? legend.famous : t("home.legendSub")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {revealed && (
                <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-ghost clip-slant px-5 py-2.5 text-xs font-bold">
                  <Ic n="search" size={14} /> {t("nav.explore")}
                </button>
              )}
              <button type="button" onClick={() => play("classic")} className="btn btn-mint clip-slant px-5 py-2.5 text-xs font-bold">
                <Ic n="play" size={14} /> {t("home.play")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Ic n="grid" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.topCats")}</h2>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => {
            const count = PEOPLE.filter((p) => p.cat === c.id).length;
            if (count === 0) return null;
            return (
              <button key={c.id} type="button" onClick={() => { sfx.play("click"); go(`/explore?cat=${c.id}`); }}
                className="clip-card group relative w-40 shrink-0 overflow-hidden p-4 text-start transition-transform hover:-translate-y-1"
                style={{ background: `linear-gradient(160deg, ${c.c1}26, #0b1826 70%)`, boxShadow: `inset 0 0 0 1px ${c.c1}33` }}>
                <span style={{ color: c.c2 }}><Ic n={c.icon} size={22} /></span>
                <div className="mt-3 font-display text-[12px] font-bold leading-snug text-cream-50">{c.name[lang === "en" ? 0 : lang === "fa" ? 1 : 2]}</div>
                <div className="mt-1 text-[10px] font-semibold text-cream-500">{digits(count)} {t("home.stats.people")}</div>
                <span className="absolute -bottom-3 -end-3 opacity-10 transition-opacity group-hover:opacity-25" style={{ color: c.c1 }}><Ic n={c.icon} size={64} /></span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Ic n="spark" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.how.t")}</h2>
        </div>
        <div className="clip-card grid gap-px overflow-hidden bg-ink-700/50 md:grid-cols-3">
          {[
            { n: "01", tt: t("home.how.1t"), d: t("home.how.1d"), c: "#ffc95c" },
            { n: "02", tt: t("home.how.2t"), d: t("home.how.2d"), c: "#4dffd8" },
            { n: "03", tt: t("home.how.3t"), d: t("home.how.3d"), c: "#ff5470" },
          ].map((s) => (
            <div key={s.n} className="bg-ink-900/90 p-7">
              <div className="font-display text-5xl font-black text-outline" style={{ ["-webkit-text-stroke" as string]: `1.5px ${s.c}` }}>{digits(s.n)}</div>
              <h3 className="mt-4 font-display text-base font-black text-cream-50">{s.tt}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BROWSE CTA ================= */}
      <section className="relative mt-16 overflow-hidden border-t border-ink-700/60">
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(60% 100% at 20% 50%, rgba(31,224,189,0.25), transparent 60%), radial-gradient(60% 100% at 85% 50%, rgba(245,173,29,0.2), transparent 60%)" }} aria-hidden />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="font-display text-2xl font-black text-cream-50 sm:text-3xl">{t("home.browse.t")}</h2>
            <p className="mt-2 text-sm text-cream-300">{t("home.browse.d")}</p>
          </div>
          <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-mint clip-slant shrink-0 px-8 py-4 text-sm font-black">
            <Ic n="search" size={17} /> {t("nav.explore")}
          </button>
        </div>
      </section>
    </div>
  );
}
