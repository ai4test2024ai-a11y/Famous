import { useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { ACHIEVEMENTS, levelFromXp, xpForLevel } from "../lib/quiz";
import { catName, Ic } from "../data/categories";
import { RingProgress, SectionHead } from "../components/bits";
import { sfx } from "../lib/audio";
import { fmtNum, pct } from "../lib/util";

export default function ProfilePage() {
  const { t, lang, digits, profile, setName, pushToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile.name);

  const level = levelFromXp(profile.xp);
  const curBase = xpForLevel(level);
  const nextBase = xpForLevel(level + 1);
  const prog = pct(profile.xp - curBase, nextBase - curBase);
  const acc = pct(profile.correct, profile.questions);

  const favCat = Object.entries(profile.byCat).sort((a, b) => b[1] - a[1])[0]?.[0];

  const saveName = () => {
    setName(draft || "Player");
    setEditing(false);
    sfx.play("correct");
    pushToast({ kind: "info", title: t("toast.saved") });
  };

  const stats = [
    { l: t("profile.games"), v: fmtNum(profile.games, lang), i: "play", c: "#ffc95c" },
    { l: t("profile.questions"), v: fmtNum(profile.questions, lang), i: "list", c: "#8fb7ff" },
    { l: t("profile.correct"), v: fmtNum(profile.correct, lang), i: "check", c: "#4dffd8" },
    { l: t("profile.accuracy"), v: `${digits(acc)}${lang === "fa" ? "٪" : "%"}`, i: "target", c: "#ff8a5c" },
    { l: t("profile.bestScore"), v: fmtNum(profile.bestScore, lang), i: "trophy", c: "#ffc95c" },
    { l: t("profile.bestStreak"), v: digits(profile.bestStreak), i: "flame", c: "#ff5470" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <SectionHead icon="user" title={t("profile.title")} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* identity card */}
        <div className="glass clip-card relative overflow-hidden p-6">
          <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(80% 60% at 50% 0%, rgba(245,173,29,0.4), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="relative">
                <RingProgress value={prog} size={104} stroke={9} color="#f5ad1d">
                  <div className="text-center">
                    <div className="text-[8px] font-bold tracking-[0.2em] text-cream-500">{t("profile.level")}</div>
                    <div className="font-display text-3xl font-black text-gold-400">{digits(level)}</div>
                  </div>
                </RingProgress>
              </div>
              <div className="min-w-0">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      maxLength={18}
                      autoFocus
                      className="w-full clip-card-sm border border-gold-400 bg-ink-800 px-3 py-2 font-display text-sm font-bold text-cream-50 focus:outline-none"
                    />
                    <button type="button" onClick={saveName} className="btn btn-primary clip-card-sm px-3 py-2 text-[10px] font-black">{t("btn.save")}</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setDraft(profile.name); setEditing(true); }} className="group text-start">
                    <div className="flex items-center gap-2 font-display text-xl font-black text-cream-50">
                      <span className="truncate">{profile.name || "Player"}</span>
                      <span className="text-cream-500 transition-colors group-hover:text-gold-400"><Ic n="edit" size={14} /></span>
                    </div>
                    <div className="mt-0.5 text-[10px] text-cream-500">{t("profile.editName")}</div>
                  </button>
                )}
                <div className="mt-2 text-[11px] font-bold text-mint-400">
                  {fmtNum(profile.xp, lang)} XP
                </div>
              </div>
            </div>
            <div className="mt-4 text-[10px] font-semibold text-cream-500">
              {t("profile.xpNext", { a: fmtNum(Math.max(0, nextBase - profile.xp), lang), b: digits(level + 1) })}
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-800">
              <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-[width] duration-700" style={{ width: `${prog}%` }} />
            </div>

            <div className="mt-5 clip-card-sm border border-ink-700 bg-ink-900/70 p-3.5">
              <div className="text-[9px] font-bold tracking-[0.2em] text-cream-500">{t("profile.favCat")}</div>
              <div className="mt-1.5 flex items-center gap-2 font-display text-sm font-bold text-cream-50">
                {favCat ? (
                  <>
                    <span className="text-gold-400"><Ic n={favCat === "iran" ? "star8" : "globe"} size={15} /></span>
                    {catName(favCat, lang)}
                  </>
                ) : (
                  <span className="text-cream-500 text-xs font-semibold">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* stats */}
          <div>
            <h3 className="mb-3 font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("profile.stats")}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.l} className="clip-card border border-ink-700 bg-ink-850/80 p-4 transition-transform hover:-translate-y-0.5">
                  <span style={{ color: s.c }}><Ic n={s.i} size={18} /></span>
                  <div className="mt-2.5 font-display text-xl font-black text-cream-50">{s.v}</div>
                  <div className="mt-0.5 text-[10px] font-bold tracking-wide text-cream-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* recent games */}
          {profile.history.length > 0 && (
            <div>
              <h3 className="mb-3 font-display text-xs font-black tracking-[0.25em] text-cream-500">{t("quiz.results")}</h3>
              <div className="flex flex-col gap-2">
                {profile.history.slice(0, 6).map((h, i) => (
                  <div key={i} className="clip-card-sm flex items-center gap-4 border border-ink-700 bg-ink-850/70 px-4 py-2.5">
                    <span className="font-display text-[10px] font-bold text-cream-500" dir="ltr">{h.date}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-800">
                      <div className={`h-full rounded-full ${h.acc >= 70 ? "bg-mint-500" : h.acc >= 40 ? "bg-gold-500" : "bg-coral-500"}`} style={{ width: `${h.acc}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-cream-300">{digits(h.acc)}{lang === "fa" ? "٪" : "%"}</span>
                    <span className="font-display text-sm font-black text-gold-400">{fmtNum(h.score, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* achievements */}
          <div>
            <h3 className="mb-3 font-display text-xs font-black tracking-[0.25em] text-cream-500">
              {t("profile.achTitle")} · {digits(profile.ach.length)}/{digits(ACHIEVEMENTS.length)}
            </h3>
            {profile.ach.length === 0 && <p className="mb-3 text-xs text-cream-500">{t("profile.noneYet")}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((a) => {
                const un = profile.ach.includes(a.id);
                return (
                  <div key={a.id} className={`clip-card border p-4 transition-all ${un ? "border-gold-500/50 bg-gold-500/[0.07] shadow-[0_0_20px_rgba(245,173,29,0.12)]" : "border-ink-700 bg-ink-850/60 opacity-60"}`}>
                    <div className="flex items-center justify-between">
                      <span className={un ? "text-gold-400" : "text-ink-400"}><Ic n={un ? a.icon : "lock"} size={20} /></span>
                      <span className={`text-[8px] font-black tracking-[0.15em] ${un ? "text-mint-400" : "text-cream-500"}`}>
                        {un ? t("profile.unlocked") : t("profile.locked")}
                      </span>
                    </div>
                    <div className={`mt-2.5 font-display text-[12px] font-black ${un ? "text-cream-50" : "text-cream-500"}`}>{t(`ach.${a.id}`)}</div>
                    <div className="mt-1 text-[10px] leading-relaxed text-cream-500">{t(`ach.${a.id}.d`)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic"); }} className="btn btn-primary clip-slant self-start px-8 py-3.5 text-xs font-black">
            <Ic n="play" size={15} /> {t("btn.playNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
