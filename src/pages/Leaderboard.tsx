import { useMemo, useState } from "react";
import { useApp } from "../state/store";
import { genBoard, levelFromXp, type BoardRow } from "../lib/quiz";
import { SectionHead } from "../components/bits";
import { Ic } from "../data/categories";
import { sfx } from "../lib/audio";
import { fmtNum, todayKey } from "../lib/util";

type Tab = "global" | "daily" | "weekly";

function weekKey(): string {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const wk = Math.floor((d.getTime() - start.getTime()) / (7 * 86400000));
  return `${d.getFullYear()}-w${wk}`;
}

export default function LeaderboardPage() {
  const { t, lang, digits, profile } = useApp();
  const [tab, setTab] = useState<Tab>("global");

  const you = useMemo<BoardRow | null>(() => {
    const today = todayKey();
    let score = 0;
    if (tab === "global") score = profile.bestScore;
    else if (tab === "daily") score = profile.history.filter((h) => h.date === today).reduce((m, h) => Math.max(m, h.score), 0);
    else {
      const cutoff = Date.now() - 7 * 86400000;
      score = profile.history
        .filter((h) => new Date(h.date).getTime() >= cutoff)
        .reduce((s, h) => s + h.score, 0);
    }
    if (score <= 0) return null;
    const acc = profile.questions === 0 ? 0 : Math.round((profile.correct / profile.questions) * 100);
    return { name: profile.name || "Player", score, acc, streak: profile.bestStreak, level: levelFromXp(profile.xp), you: true };
  }, [tab, profile]);

  const rows = useMemo(() => {
    const seed = tab === "daily" ? todayKey() : tab === "weekly" ? weekKey() : "all-time";
    return genBoard(tab, seed, you);
  }, [tab, you]);

  const RANK_COLOR = ["#ffc95c", "#c9d6e8", "#d08b5b"];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <SectionHead icon="trophy" title={t("lb.title")} sub={t("lb.sub")} />

      <div className="flex clip-card-sm overflow-hidden border border-ink-600 w-fit">
        {(["global", "daily", "weekly"] as Tab[]).map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => { setTab(tb); sfx.play("click"); }}
            className={`px-5 py-2.5 font-display text-[11px] font-black tracking-wide transition-colors ${tab === tb ? "bg-gold-500 text-ink-950" : "bg-ink-800 text-cream-300 hover:bg-ink-700"}`}
          >
            {t(`lb.${tb}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 clip-card glass overflow-hidden">
        <div className="grid grid-cols-[52px_1fr_70px_80px] sm:grid-cols-[64px_1fr_80px_80px_80px_80px] items-center gap-2 border-b border-ink-700 bg-ink-900/80 px-4 py-3 text-[9px] font-black tracking-[0.18em] text-cream-500">
          <span>{t("lb.rank")}</span>
          <span>{t("lb.player")}</span>
          <span className="text-center">{t("lb.level")}</span>
          <span className="text-center">{t("lb.acc")}</span>
          <span className="hidden sm:block text-center">{t("lb.streak")}</span>
          <span className="text-end">{t("lb.score")}</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={`${r.name}-${i}`}
            className={`anim-slide grid grid-cols-[52px_1fr_70px_80px] sm:grid-cols-[64px_1fr_80px_80px_80px_80px] items-center gap-2 border-b border-ink-800 px-4 py-3 transition-colors ${r.you ? "bg-gold-500/[0.09] border-s-2 border-s-gold-400" : "hover:bg-ink-800/50"}`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <span className="flex items-center gap-1.5">
              {i < 3 ? (
                <span className="flex h-7 w-7 items-center justify-center clip-card-sm font-display text-[11px] font-black text-ink-950" style={{ background: RANK_COLOR[i] }}>
                  {digits(i + 1)}
                </span>
              ) : (
                <span className="w-7 text-center font-display text-xs font-bold text-cream-500">{digits(i + 1)}</span>
              )}
            </span>
            <span className="flex items-center gap-2.5 min-w-0">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center clip-card-sm font-display text-[11px] font-black ${r.you ? "bg-gold-500 text-ink-950" : "bg-ink-700 text-cream-300"}`}>
                {r.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className={`block truncate font-display text-[12px] font-bold ${r.you ? "text-gold-300" : "text-cream-100"}`}>
                  {r.name} {r.you && <span className="text-[9px] text-gold-400">({t("common.you")})</span>}
                </span>
              </span>
            </span>
            <span className="text-center font-display text-xs font-bold text-mint-400">{digits(r.level)}</span>
            <span className="text-center text-xs font-bold text-cream-300">{digits(r.acc)}{lang === "fa" ? "٪" : "%"}</span>
            <span className="hidden sm:flex items-center justify-center gap-1 text-xs font-bold text-coral-400">
              <Ic n="flame" size={12} /> {digits(r.streak)}
            </span>
            <span className="text-end font-display text-sm font-black text-gold-400">{fmtNum(r.score, lang)}</span>
          </div>
        ))}
      </div>

      {!you && <p className="mt-4 text-center text-xs text-cream-500">{t("lb.yourRank")}</p>}
    </div>
  );
}
