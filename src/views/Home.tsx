import { useMemo, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { DIFFS, todayKey, mulberry32, hashStr } from "../lib/quiz";
import { PEOPLE, CATEGORIES, localizedName } from "../data/people";
import { Ic, Portrait } from "../components/ui";
import { sfx } from "../lib/audio";

export default function Home() {
  const { t, lang, digits, profile, isUnlocked } = useApp();
  const [diff, setDiff] = useState(1);

  const legend = useMemo(() => {
    const rng = mulberry32(hashStr(`legend-${todayKey()}`));
    return PEOPLE[Math.floor(rng() * PEOPLE.length)];
  }, []);
  const [revealed, setRevealed] = useState(false);

  const fmt = (x: number) => x.toLocaleString("en-US");
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

  return (
    <div className="relative">
      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(70% 60% at 75% 15%, rgba(245,173,29,0.13), transparent 60%), radial-gradient(50% 50% at 15% 85%, rgba(31,224,189,0.1), transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-14 sm:pt-16 sm:pb-20 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="anim-rise">
            <div className="inline-flex items-center gap-2.5 glass clip-tag px-3.5 py-1.5">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" /></span>
              <span className="text-[10px] font-bold tracking-[0.22em] text-mint-300">{digits(PEOPLE.length)}+ {t("home.stats.people")}</span>
            </div>
            <h1 className="mt-6 font-display font-black leading-[1] tracking-tight text-[clamp(2rem,6.5vw,4.4rem)]">
              {t("brand").split(" ").map((w, i, arr) => (
                <span key={i} className={i === 0 ? "text-outline" : i === arr.length - 1 ? "text-gold-400" : "text-cream-50"}>{w}{" "}</span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-cream-300">{t("tagline")}</p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="button" onClick={() => play("classic")} className="btn btn-primary clip-slant px-9 py-4 text-sm sm:text-base font-black">
                <Ic n="play" size={18} /> {t("home.play")}
              </button>
              <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-ghost clip-slant px-6 py-4 text-xs sm:text-sm font-bold">
                <Ic n="search" size={16} /> {t("nav.explore")}
              </button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
              {[
                { n: digits(PEOPLE.length), l: t("home.stats.people") },
                { n: digits(CATEGORIES.length), l: t("home.stats.cats") },
                { n: digits(fmt(profile.questions)), l: t("home.stats.answered") },
              ].map((s) => (
                <div key={s.l} className="glass clip-card-sm px-3 py-3.5 text-center">
                  <div className="font-display text-lg sm:text-2xl font-black text-gold-400">{s.n}</div>
                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-cream-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* legend of the day */}
          <div className="anim-rise" style={{ animationDelay: "0.1s" }}>
            <div className="glass clip-card p-6">
              <div className="text-[10px] font-black tracking-[0.25em] text-gold-400">{t("home.legend")}</div>
              <div className="mt-4 grid grid-cols-[150px_1fr] gap-4 items-center">
                <div className={`clip-card-sm overflow-hidden ${revealed ? "" : "blur-[14px] saturate-50"} transition-all duration-700`}>
                  <Portrait person={legend} className="aspect-[3/4] w-full" monogram="text-2xl" />
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-black text-cream-50 min-h-[2.5rem]">
                    {revealed ? localizedName(legend, lang) : "؟ ؟ ؟"}
                  </div>
                  <div className="mt-1.5 text-[11px] text-cream-500 leading-relaxed min-h-[3rem]">
                    {revealed ? legend.famous : t("home.legendSub")}
                  </div>
                  {!revealed ? (
                    <button type="button" onClick={() => { setRevealed(true); sfx.play("correct"); }} className="btn btn-mint clip-slant mt-3 px-5 py-2.5 text-[11px] font-black">
                      <Ic n="eye" size={14} /> {t("home.reveal")}
                    </button>
                  ) : (
                    <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-ghost clip-slant mt-3 px-5 py-2.5 text-[11px] font-bold">
                      <Ic n="search" size={14} /> {t("nav.explore")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* difficulty */}
      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="flex items-center gap-2 mb-3">
          <Ic n="target" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("diff.label")}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

      {/* modes */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-center gap-2 mb-3">
          <Ic n="play" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.modes")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modes.map((m, i) => (
            <button key={m.id} type="button" onClick={() => play(m.id)}
              className="card-glow clip-card glass group relative overflow-hidden p-6 text-start transition-transform hover:-translate-y-1"
              style={{ ["--g1" as string]: `${m.c}66`, ["--g2" as string]: `${m.c}44` } as React.CSSProperties}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center clip-card-sm" style={{ background: `${m.c}1f`, color: m.c }}>
                  <Ic n={m.icon} size={22} />
                </span>
                <span className="text-ink-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <Ic n="arrow" size={20} className="rtl:-scale-x-100" />
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-black text-cream-50">{t(`mode.${m.id}`)}</h3>
              <p className="mt-1.5 text-sm text-cream-500">{t(`mode.${m.id}.d`)}</p>
              {i === 0 && <span className="mt-3 inline-block clip-tag bg-ink-800 px-3 py-1 text-[10px] font-bold text-gold-400">{t(`diff.${diff}`)}</span>}
            </button>
          ))}
        </div>
      </section>

      {/* category strip */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="flex items-center gap-2 mb-3">
          <Ic n="grid" size={16} className="text-gold-400" />
          <h2 className="font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("home.stats.cats")}</h2>
        </div>
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2">
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
    </div>
  );
}
