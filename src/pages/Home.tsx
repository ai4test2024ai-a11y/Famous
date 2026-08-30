import { useEffect, useMemo, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { IMG, CATS, SPECIAL_CATS, Ic, catName, catDef, THEMES } from "../data/categories";
import { PEOPLE, localizedName, peopleByCat } from "../data/people";
import { DB_TOTAL } from "../data/registry";
import { PersonCard, SectionHead, fireConfetti, Tilt } from "../components/bits";
import { PERSON_BY_ID } from "../data/people";
import { rngFrom, todayKey, fmtNum } from "../lib/util";
import { monthNameG } from "../i18n";
import { sfx } from "../lib/audio";

const FLOATERS = ["messi", "googoosh", "einstein", "beyonce", "takhti", "senna"];
const TICKER_DATE = [
  { m: 12, d: 25 }, { m: 6, d: 24 }, { m: 10, d: 23 }, { m: 4, d: 5 }, { m: 8, d: 21 },
];

function DateTicket() {
  const { t, lang, digits } = useApp();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % TICKER_DATE.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  const { m, d } = TICKER_DATE[i];
  return (
    <div className="glass clip-card relative p-5 text-center">
      <div className="text-[9px] font-bold tracking-[0.22em] text-mint-400">{t("quiz.whoShort")}</div>
      <div key={i} className="anim-flicker mt-2 font-display text-2xl sm:text-3xl font-black text-gold-400 leading-tight">
        {lang === "en" ? `${monthNameG(m, lang)} ${digits(d)}` : `${digits(d)} ${monthNameG(m, lang)}`}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((k) => (
          <span key={k} className={`h-4 w-8 clip-card-sm ${k === i ? "bg-gold-500" : "bg-ink-700"} transition-colors`} />
        ))}
      </div>
      <div className="mt-3 text-4xl font-display font-black text-outline-gold select-none">?</div>
    </div>
  );
}

export default function Home() {
  const { t, lang, digits, profile } = useApp();
  const [revealed, setRevealed] = useState(false);

  const legend = useMemo(() => {
    const rng = rngFrom(`legend-${todayKey()}`);
    return PEOPLE[Math.floor(rng() * PEOPLE.length)];
  }, []);

  const floaters = FLOATERS.map((id) => PERSON_BY_ID.get(id)).filter((p): p is NonNullable<typeof p> => !!p);
  const tickerNames = useMemo(() => [...PEOPLE].sort((a, b) => b.pop - a.pop).slice(0, 42), []);
  const words = t("brand").split(" ");

  const modes = [
    { icon: "calendar", title: t("btn.birthdate"), desc: t("mode.classic.desc"), to: "/quiz?mode=classic", cls: "text-gold-400 bg-gold-500/12" },
    { icon: "bolt", title: t("btn.daily"), desc: t("mode.daily.desc"), to: "/quiz?mode=daily", cls: "text-mint-400 bg-mint-500/12" },
    { icon: "star", title: t("btn.myBirthday"), desc: t("mode.bday.desc"), to: "/quiz?mode=birthday", cls: "text-coral-400 bg-coral-500/12" },
    { icon: "grid", title: t("btn.categories"), desc: t("mode.cat.desc"), to: "/categories", cls: "text-[#8fb7ff] bg-[#8fb7ff]/12" },
  ];

  return (
    <div className="relative">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="" className="h-full w-full object-cover opacity-45" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/40 to-ink-950" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 75% 20%, rgba(245,173,29,0.13), transparent 60%), radial-gradient(50% 50% at 15% 80%, rgba(31,224,189,0.1), transparent 60%)" }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="anim-rise">
            <div className="inline-flex items-center gap-2.5 glass clip-tag px-3.5 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-400" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.22em] text-mint-300">
                {t("home.live")} · {fmtNum(DB_TOTAL, lang)} {t("home.peopleCount")}
              </span>
            </div>

            <h1 className="mt-6 font-display font-black leading-[0.98] tracking-tight text-[clamp(2.2rem,6.5vw,4.6rem)]">
              {words.map((w, i) => (
                <span key={i} className={i === 0 ? "text-outline" : i === words.length - 1 ? "text-gold-400" : "text-cream-50"}>
                  {w}{" "}
                </span>
              ))}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-cream-300">{t("tagline")}</p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic"); }} className="btn btn-primary clip-slant px-9 py-4 text-sm sm:text-base font-black">
                <Ic n="play" size={18} /> {t("btn.playNow")}
              </button>
              <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=daily"); }} className="btn btn-ghost clip-slant px-6 py-4 text-xs sm:text-sm font-bold">
                <Ic n="bolt" size={16} /> {t("btn.daily")}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=birthday"); }} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] sm:text-xs font-bold">
                <Ic n="star" size={14} /> {t("btn.myBirthday")}
              </button>
              <button type="button" onClick={() => { sfx.play("click"); go("/categories"); }} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] sm:text-xs font-bold">
                <Ic n="grid" size={14} /> {t("btn.categories")}
              </button>
              <button type="button" onClick={() => { sfx.play("click"); go("/leaderboard"); }} className="btn btn-ghost clip-slant px-5 py-3 text-[11px] sm:text-xs font-bold">
                <Ic n="trophy" size={14} /> {t("btn.leaderboard")}
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">
              {[
                { n: fmtNum(DB_TOTAL, lang), l: t("home.peopleCount") },
                { n: digits(CATS.length + SPECIAL_CATS.length), l: t("home.categories") },
                { n: fmtNum(profile.questions, lang), l: t("home.questionsPlayed") },
              ].map((s) => (
                <div key={s.l} className="glass clip-card-sm px-3 py-3.5 text-center">
                  <div className="font-display text-lg sm:text-2xl font-black text-gold-400">{s.n}</div>
                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-cream-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating cards */}
          <div className="relative hidden lg:block h-[540px]" aria-hidden>
            {floaters.map((p, i) => {
              const pos = [
                "top-0 start-6 w-44 z-20", "top-10 end-0 w-40 z-10", "top-52 start-0 w-40 z-10",
                "top-44 end-8 w-48 z-30", "bottom-6 start-16 w-44 z-20", "bottom-0 end-0 w-36 z-10",
              ][i];
              const delay = `${i * 0.7}s`;
              return (
                <div key={p.id} className={`absolute ${pos}`} style={{ ["--r0" as string]: `${-5 + i * 2}deg`, ["--r1" as string]: `${3 - i}deg`, animationDelay: delay }}>
                  <div className="anim-floaty" style={{ animationDelay: delay }}>
                    <Tilt max={12}>
                      <div className="shadow-2xl shadow-black/60 clip-card" onClick={() => go(`/person/${p.id}`)}>
                        <PersonCard person={p} size="sm" />
                      </div>
                    </Tilt>
                  </div>
                </div>
              );
            })}
            <div className="absolute top-[42%] start-[30%] z-40 w-52 anim-floaty" style={{ ["--r0" as string]: "-2deg", ["--r1" as string]: "2deg" }}>
              <DateTicket />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TICKER ================= */}
      <div className="relative border-y border-ink-700/60 bg-ink-900/70 py-3 overflow-hidden">
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <SectionHead icon="play" title={t("home.modes")} sub={t("home.modesSub")} />
        <div className="grid gap-4 md:grid-cols-2">
          {modes.map((m, i) => (
            <button
              key={m.to}
              type="button"
              onClick={() => { sfx.play("click"); go(m.to); }}
              className={`card-glow clip-card glass group relative overflow-hidden p-6 text-start transition-transform hover:-translate-y-1 ${i === 0 ? "md:row-span-2 md:p-8" : ""}`}
              style={{ ["--g1" as string]: "rgba(245,173,29,0.45)", ["--g2" as string]: "rgba(31,224,189,0.35)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className={`flex h-11 w-11 items-center justify-center clip-card-sm ${m.cls}`}>
                  <Ic n={m.icon} size={22} />
                </span>
                <span className="text-ink-400 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <Ic n="arrow" size={20} className="rtl:-scale-x-100" />
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg sm:text-xl font-black text-cream-50">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-500">{m.desc}</p>
              {i === 0 && (
                <div className="mt-6 flex items-end gap-2">
                  <div className="clip-card-sm bg-gold-500 px-4 py-2 font-display text-2xl font-black text-ink-950">25</div>
                  <div className="pb-1">
                    <div className="font-display text-sm font-bold text-gold-400">{monthNameG(12, lang)}</div>
                    <div className="text-[10px] tracking-[0.2em] text-cream-500">5 × ?</div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ================= LEGEND OF THE DAY ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <SectionHead icon="star" title={t("home.legend")} sub={t("home.legendSub")} />
        <div className="grid gap-6 md:grid-cols-[300px_1fr] items-stretch">
          <div className="relative mx-auto w-full max-w-[300px]">
            <Tilt max={10}>
              <div className="clip-card shadow-2xl shadow-black/50">
                <div className={revealed ? "" : "blur-[18px] saturate-50 transition-all duration-700"}>
                  <PersonCard person={legend} size="lg" onClick={() => revealed && go(`/person/${legend.id}`)} />
                </div>
              </div>
            </Tilt>
            {!revealed && (
              <button
                type="button"
                onClick={() => { setRevealed(true); sfx.play("achievement"); fireConfetti(false); }}
                className="btn btn-primary clip-slant absolute inset-0 m-auto h-fit w-fit px-8 py-3.5 text-sm font-black"
              >
                {t("btn.reveal")}
              </button>
            )}
          </div>
          <div className="glass clip-card flex flex-col justify-center p-7">
            <div className="text-[10px] font-bold tracking-[0.25em] text-gold-400">{catName(legend.cat, lang)} · {countryName3(legend.cc)}</div>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-black text-cream-50">
              {revealed ? localizedName(legend, lang) : "؟ ؟ ؟"}
            </h3>
            <p className="mt-3 text-sm text-cream-500 leading-relaxed">{revealed && legend.bio ? legend.bio : t("home.legendSub")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {revealed && (
                <button type="button" onClick={() => go(`/person/${legend.id}`)} className="btn btn-ghost clip-slant px-5 py-2.5 text-xs font-bold">
                  {t("btn.viewProfile")}
                </button>
              )}
              <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic"); }} className="btn btn-mint clip-slant px-5 py-2.5 text-xs font-bold">
                <Ic n="play" size={14} /> {t("btn.playNow")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <SectionHead icon="grid" title={t("home.topCats")} />
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[...SPECIAL_CATS, ...CATS].map((c) => {
            const th = THEMES[c.theme];
            const count = peopleByCat(c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => { sfx.play("click"); go(`/categories/${c.id}`); }}
                className="clip-card group relative w-40 shrink-0 overflow-hidden p-4 text-start transition-transform hover:-translate-y-1"
                style={{ background: `linear-gradient(160deg, ${th.c1}26, #0b1826 70%)`, boxShadow: `inset 0 0 0 1px ${th.c1}33` }}
              >
                <span style={{ color: th.c2 }}><Ic n={c.icon} size={22} /></span>
                <div className="mt-3 font-display text-[12px] font-bold leading-snug text-cream-50">{catName(c.id, lang)}</div>
                <div className="mt-1 text-[10px] font-semibold text-cream-500">{digits(count)} · {t("home.peopleCount")}</div>
                <span className="absolute -bottom-3 -end-3 opacity-10 transition-opacity group-hover:opacity-25" style={{ color: th.c1 }}>
                  <Ic n={c.icon} size={70} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= HOW ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <SectionHead icon="spark" title={t("home.how")} />
        <div className="grid gap-px overflow-hidden clip-card bg-ink-700/50 md:grid-cols-3">
          {[
            { n: "01", tt: t("home.how1t"), d: t("home.how1d"), c: "#ffc95c" },
            { n: "02", tt: t("home.how2t"), d: t("home.how2d"), c: "#4dffd8" },
            { n: "03", tt: t("home.how3t"), d: t("home.how3d"), c: "#ff5470" },
          ].map((s, i) => (
            <div key={s.n} className="relative bg-ink-900/90 p-7" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="font-display text-5xl font-black text-outline" style={{ ["-webkit-text-stroke" as string]: `1.5px ${s.c}` }}>{digits(s.n)}</div>
              <h3 className="mt-4 font-display text-base font-black text-cream-50">{s.tt}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-500">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BROWSE CTA ================= */}
      <section className="relative overflow-hidden border-t border-ink-700/60">
        <img src={THEMES.iran.art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-950/90" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-cream-50">{t("home.browse")}</h2>
            <p className="mt-2 text-sm text-cream-300">{t("home.browseSub")}</p>
          </div>
          <button type="button" onClick={() => { sfx.play("click"); go("/explore"); }} className="btn btn-mint clip-slant px-8 py-4 text-sm font-black shrink-0">
            <Ic n="search" size={17} /> {t("nav.explore")}
          </button>
        </div>
      </section>
    </div>
  );
}

function countryName3(cc: string) {
  return cc;
}
