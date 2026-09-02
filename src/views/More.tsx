import { useMemo, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { PEOPLE, CATEGORIES, localizedName, countryName, countryCode3, catName, monthDay, yearOf, eraOf } from "../data/people";
import type { Person } from "../data/people";
import { monthNameG } from "../lib/i18n";
import { Ic, PersonCard, Portrait, Ring } from "../components/ui";
import { mulberry32, hashStr, todayKey } from "../lib/quiz";
import { levelFromXp } from "../state/store";
import { sfx } from "../lib/audio";

const fmt = (x: number) => x.toLocaleString("en-US");

/* ---------------- LEADERBOARD ---------------- */
const BOTS = ["NovaKing", "AtlasFox", "QuizSultan", "MoonCatcher", "TurboNia", "PixelPasha", "ZenMaster", "CaspianWave", "RetroRex", "AuroraBee", "NightOwl", "CrimsonAce", "LunarLayla", "StormRider", "GoldenGoat"];

export function Leaderboard() {
  const { t, lang, digits, profile } = useApp();
  const rows = useMemo(() => {
    const rng = mulberry32(hashStr(`board-${todayKey()}`));
    const list = BOTS.map((name, i) => ({
      name: `${name}${Math.floor(rng() * 90) + 10}`,
      score: Math.round(14000 * (1 - i / BOTS.length) * (0.75 + rng() * 0.5)),
      acc: Math.round(55 + rng() * 44),
      streak: Math.round(3 + rng() * 20),
      you: false,
    }));
    const best = Math.max(0, ...Object.values(profile.bestScore));
    if (best > 0) {
      const acc = profile.questions ? Math.round((profile.correct / profile.questions) * 100) : 0;
      list.push({ name: profile.name || "Player", score: best, acc, streak: profile.bestStreak, you: true });
    }
    return list.sort((a, b) => b.score - a.score).slice(0, 12);
  }, [profile]);
  const RANK = ["#ffc95c", "#c9d6e8", "#d08b5b"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Header icon="trophy" title={t("board.title")} sub={t("board.sub")} />
      <div className="mt-6 clip-card glass overflow-hidden">
        <div className="grid grid-cols-[44px_1fr_56px_72px] sm:grid-cols-[56px_1fr_70px_70px_80px] items-center gap-1.5 sm:gap-2 border-b border-ink-700 bg-ink-900/80 px-3 sm:px-4 py-3 text-[9px] font-black tracking-[0.15em] text-cream-500">
          <span>{t("board.rank")}</span><span>{t("board.player")}</span>
          <span className="text-center hidden sm:block">{t("board.acc")}</span>
          <span className="text-center">{t("board.streak")}</span>
          <span className="text-end">{t("board.score")}</span>
        </div>
        {rows.map((r, i) => (
          <div key={`${r.name}-${i}`}
            className={`anim-slide grid grid-cols-[44px_1fr_56px_72px] sm:grid-cols-[56px_1fr_70px_70px_80px] items-center gap-1.5 sm:gap-2 border-b border-ink-800 px-3 sm:px-4 py-3 ${r.you ? "bg-gold-500/[0.09] border-s-2 border-s-gold-400" : "hover:bg-ink-800/50"}`}
            style={{ animationDelay: `${i * 0.04}s` }}>
            <span className="flex items-center">
              {i < 3
                ? <span className="flex h-7 w-7 items-center justify-center clip-card-sm font-display text-[11px] font-black text-ink-950" style={{ background: RANK[i] }}>{digits(i + 1)}</span>
                : <span className="w-7 text-center font-display text-xs font-bold text-cream-500">{digits(i + 1)}</span>}
            </span>
            <span className="flex items-center gap-2.5 min-w-0">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center clip-card-sm font-display text-[11px] font-black ${r.you ? "bg-gold-500 text-ink-950" : "bg-ink-700 text-cream-300"}`}>
                {r.name.slice(0, 2).toUpperCase()}
              </span>
              <span className={`truncate font-display text-[12px] font-bold ${r.you ? "text-gold-300" : "text-cream-100"}`}>
                {r.name}{r.you && <span className="text-[9px] text-gold-400"> ({t("board.you")})</span>}
              </span>
            </span>
            <span className="text-center text-xs font-bold text-cream-300 hidden sm:block">{digits(r.acc)}{lang === "fa" ? "٪" : "%"}</span>
            <span className="flex items-center justify-center gap-1 text-xs font-bold text-coral-400"><Ic n="flame" size={12} />{digits(r.streak)}</span>
            <span className="text-end font-display text-sm font-black text-gold-400">{digits(fmt(r.score))}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-cream-500">{t("board.local")}</p>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */
export function Profile() {
  const { t, lang, digits, profile, setName, resetProgress } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile.name);
  const level = levelFromXp(profile.xp);
  const base = 120 * (level - 1) * (level - 1);
  const next = 120 * level * level;
  const prog = Math.min(100, Math.round(((profile.xp - base) / Math.max(1, next - base)) * 100));
  const acc = profile.questions ? Math.round((profile.correct / profile.questions) * 100) : 0;
  const best = Math.max(0, ...Object.values(profile.bestScore));

  const stats = [
    { l: t("profile.games"), v: digits(fmt(profile.games)), i: "play", c: "#ffc95c" },
    { l: t("profile.questions"), v: digits(fmt(profile.questions)), i: "list", c: "#8fb7ff" },
    { l: t("profile.correct"), v: digits(fmt(profile.correct)), i: "check", c: "#4dffd8" },
    { l: t("profile.accuracy"), v: `${digits(acc)}${lang === "fa" ? "٪" : "%"}`, i: "target", c: "#ff8a5c" },
    { l: t("profile.best"), v: digits(fmt(best)), i: "trophy", c: "#ffc95c" },
    { l: t("profile.streak"), v: digits(profile.bestStreak), i: "flame", c: "#ff5470" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Header icon="user" title={t("profile.title")} />
      <div className="mt-6 grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="glass clip-card relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(245,173,29,0.4), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-4">
              <Ring value={prog} size={100} stroke={9} color="#f5ad1d">
                <div className="text-center">
                  <div className="text-[8px] font-bold tracking-[0.2em] text-cream-500">{t("profile.level")}</div>
                  <div className="font-display text-3xl font-black text-gold-400">{digits(level)}</div>
                </div>
              </Ring>
              <div className="min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={18} autoFocus
                      className="w-full clip-card-sm border border-gold-400 bg-ink-800 px-3 py-2 font-display text-sm font-bold text-cream-50 focus:outline-none" />
                    <button type="button" onClick={() => { setName(draft || "Player"); setEditing(false); sfx.play("correct"); }} className="btn btn-primary clip-card-sm px-3 py-2 text-[10px] font-black">{t("profile.save")}</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setDraft(profile.name); setEditing(true); }} className="group text-start">
                    <div className="flex items-center gap-2 font-display text-xl font-black text-cream-50">
                      <span className="truncate">{profile.name || "Player"}</span>
                      <span className="text-cream-500 group-hover:text-gold-400"><Ic n="edit" size={14} /></span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-cream-500">{t("profile.edit")}</div>
                  </button>
                )}
                <div className="mt-2 text-[11px] font-bold text-mint-400">{digits(fmt(profile.xp))} {t("profile.xp")}</div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-800">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-[width] duration-700" style={{ width: `${prog}%` }} />
            </div>
            <button type="button" onClick={() => { resetProgress(); sfx.play("wrong"); }} className="btn btn-ghost clip-slant mt-6 w-full px-4 py-2.5 text-[10px] font-bold text-coral-400">
              {t("profile.reset")}
            </button>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.l} className="clip-card border border-ink-700 bg-ink-850/80 p-4 transition-transform hover:-translate-y-0.5">
                <span style={{ color: s.c }}><Ic n={s.i} size={18} /></span>
                <div className="mt-2.5 font-display text-xl font-black text-cream-50">{s.v}</div>
                <div className="mt-0.5 text-[10px] font-bold tracking-wide text-cream-500">{s.l}</div>
              </div>
            ))}
          </div>
          {profile.history.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("quiz.results")}</h3>
              <div className="flex flex-col gap-2">
                {profile.history.slice(0, 6).map((h, i) => (
                  <div key={i} className="clip-card-sm flex items-center gap-4 border border-ink-700 bg-ink-850/70 px-4 py-2.5">
                    <span className="font-display text-[10px] font-bold text-cream-500" dir="ltr">{h.date}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-800">
                      <div className={`h-full rounded-full ${h.acc >= 70 ? "bg-mint-500" : h.acc >= 40 ? "bg-gold-500" : "bg-coral-500"}`} style={{ width: `${h.acc}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-cream-300">{digits(h.acc)}{lang === "fa" ? "٪" : "%"}</span>
                    <span className="font-display text-sm font-black text-gold-400">{digits(fmt(h.score))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- EXPLORE (encyclopedia) ---------------- */
export function Explore({ initialCat }: { initialCat?: string }) {
  const { t, lang } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCat ?? "");
  const [sel, setSel] = useState<Person | null>(null);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    return PEOPLE
      .filter((p) => (!cat || p.cat === cat) &&
        (!s || p.en.toLowerCase().includes(s) || p.fa.includes(s) || p.ar.includes(s) || countryName(p.cc, "en").toLowerCase().includes(s)))
      .sort((a, b) => b.pop - a.pop)
      .slice(0, 120);
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Header icon="search" title={t("explore.title")} sub={t("explore.sub")} />
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-cream-500"><Ic n="search" size={16} /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("explore.ph")}
            className="w-full clip-card-sm border border-ink-600 bg-ink-850 py-3 ps-10 pe-4 text-sm text-cream-50 placeholder:text-cream-500/70 focus:border-gold-400 focus:outline-none" />
        </div>
        <select value={cat} onChange={(e) => { setCat(e.target.value); sfx.play("click"); }}
          className="clip-card-sm border border-ink-600 bg-ink-800 px-3 py-3 text-xs font-bold text-cream-300 focus:outline-none focus:border-gold-400">
          <option value="">{t("explore.all")}</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name[lang === "en" ? 0 : lang === "fa" ? 1 : 2]}</option>)}
        </select>
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {results.map((p) => <PersonCard key={p.id} person={p} onClick={() => { setSel(p); sfx.play("click"); }} />)}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-ink-400"><Ic n="search" size={40} /></span>
          <p className="text-sm text-cream-500">{t("explore.empty")}</p>
        </div>
      )}

      {/* detail modal */}
      {sel && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={localizedName(sel, lang)}>
          <button type="button" className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" onClick={() => setSel(null)} aria-label={t("common.close")} />
          <div className="anim-pop glass clip-card relative max-h-[90dvh] w-full max-w-md overflow-y-auto p-6">
            <button type="button" onClick={() => setSel(null)} aria-label={t("common.close")} className="btn btn-ghost clip-card-sm absolute top-4 end-4 z-10 px-2.5 py-2">
              <Ic n="x" size={15} />
            </button>
            <div className="clip-card-sm overflow-hidden"><Portrait person={sel} className="aspect-[3/3.4] w-full" monogram="text-4xl" /></div>
            <h2 className="mt-4 font-display text-2xl font-black text-cream-50">{localizedName(sel, lang)}</h2>
            {localizedName(sel, lang) !== sel.en && <div className="font-display text-sm font-bold text-cream-500" dir="ltr">{sel.en}</div>}
            <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
              <Meta l={t("common.born")} v={`${monthNameG(parseInt(monthDay(sel).split("-")[0], 10), lang)} ${parseInt(monthDay(sel).split("-")[1], 10)}, ${yearOf(sel)}`} />
              <Meta l={t("common.country")} v={`${countryName(sel.cc, lang)} (${countryCode3(sel.cc)})`} />
              <Meta l={t("common.field")} v={catName(sel.cat, lang)} />
              <Meta l={t("diff.label")} v={t(`era.${eraOf(sel)}`)} />
            </div>
            <div className="mt-4 clip-card-sm border border-gold-500/30 bg-gold-500/[0.07] p-3.5">
              <div className="text-[9px] font-black tracking-[0.2em] text-gold-400">{t("quiz.knownFor").toUpperCase()}</div>
              <div className="mt-1 text-sm text-cream-100">{sel.famous}</div>
            </div>
            <button type="button" onClick={() => { setSel(null); go("/quiz?mode=classic&diff=1"); }} className="btn btn-primary clip-slant mt-5 w-full px-5 py-3 text-xs font-black">
              <Ic n="play" size={15} /> {t("home.play")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ l, v }: { l: string; v: string }) {
  return (
    <div className="clip-card-sm border border-ink-700 bg-ink-900/70 p-3">
      <div className="text-[9px] font-bold tracking-[0.15em] text-cream-500">{l}</div>
      <div className="mt-1 font-display text-[11px] font-bold text-cream-50">{v}</div>
    </div>
  );
}

function Header({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center bg-gold-500/15 text-gold-400 clip-card-sm"><Ic n={icon} size={19} /></span>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-cream-50">{title}</h1>
      </div>
      {sub && <p className="mt-2 text-sm text-cream-500">{sub}</p>}
    </div>
  );
}
