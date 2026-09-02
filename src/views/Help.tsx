import type { ReactNode } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { DIFFS } from "../lib/quiz";
import { Ic } from "../components/ui";
import { sfx } from "../lib/audio";

function Section({ icon, title, accent, delay, children }: {
  icon: string; title: string; accent: string; delay: number; children: ReactNode;
}) {
  return (
    <section className="anim-rise glass clip-card relative overflow-hidden p-6 sm:p-8" style={{ animationDelay: `${delay}s` }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(70% 60% at 100% 0%, ${accent}24, transparent 60%)` }} aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center clip-card-sm" style={{ background: `${accent}1f`, color: accent }}>
            <Ic n={icon} size={19} />
          </span>
          <h2 className="font-display text-base sm:text-xl font-black tracking-wide text-cream-50">{title}</h2>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

function List({ items, accent, icon }: { items: string[]; accent: string; icon?: string }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          {icon ? (
            <span className="mt-0.5 shrink-0" style={{ color: accent }}><Ic n={icon} size={15} /></span>
          ) : (
            <span className="mt-1.5 h-2 w-2 shrink-0 clip-card-sm" style={{ background: accent }} />
          )}
          <p className="text-sm leading-7 text-cream-100">{s}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Help() {
  const { t, lang, digits } = useApp();
  const DIFF_C = ["#4dffd8", "#ffc95c", "#ff8a5c", "#ff5470"];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="anim-rise">
        <div className="text-[10px] font-black tracking-[0.3em] text-mint-400">{t("brand.sub")}</div>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-cream-50">{t("guide.title")}</h1>
        <p className="mt-3 text-sm text-cream-500">{t("guide.sub")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <Section icon="target" title={t("guide.goal.t")} accent="#ffc95c" delay={0}>
          <p className="text-sm sm:text-[15px] leading-8 text-cream-100">{t("guide.goal.d")}</p>
        </Section>

        <Section icon="list" title={t("guide.keys.t")} accent="#4dffd8" delay={0.05}>
          <List accent="#4dffd8" icon="bolt" items={[t("guide.keys.1"), t("guide.keys.2"), t("guide.keys.3"), t("guide.keys.4")]} />
        </Section>

        <Section icon="star" title={t("guide.score.t")} accent="#ff8a5c" delay={0.1}>
          {/* real scoring table straight from DIFFS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DIFFS.map((d) => (
              <div key={d.id} className="clip-card-sm border border-ink-700 bg-ink-900/70 p-3 text-center transition-transform hover:-translate-y-0.5">
                <div className="font-display text-[10px] font-black tracking-wide" style={{ color: DIFF_C[d.id - 1] }}>{t(`diff.${d.id}`)}</div>
                <div className="mt-1 font-display text-xl font-black text-cream-50">{digits(d.base)}</div>
                <div className="mt-0.5 text-[9px] font-bold text-cream-500">{digits(d.time)}s · {digits(d.questions)} Q</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <List accent="#ff8a5c" items={[t("guide.score.2"), t("guide.score.3"), t("guide.score.4"), t("guide.score.5"), t("guide.score.6")]} />
          </div>
        </Section>

        <Section icon="refresh" title={t("guide.flow.t")} accent="#8fb7ff" delay={0.15}>
          <List accent="#8fb7ff" items={[t("guide.flow.1"), t("guide.flow.2"), t("guide.flow.3"), t("guide.flow.4"), t("guide.flow.5"), t("guide.flow.6")]} />
        </Section>

        <Section icon="trophy" title={t("guide.out.t")} accent="#f5ad1d" delay={0.2}>
          <p className="text-sm sm:text-[15px] leading-8 text-cream-100">{t("guide.out.d")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[t("quiz.finalScore"), t("quiz.accuracy"), t("quiz.bestStreak"), t("quiz.timeTaken"), t("profile.xp"), t("profile.level")].map((chip) => (
              <span key={chip} className="clip-tag border border-gold-500/35 bg-gold-500/[0.08] px-3 py-1.5 text-[10px] font-black text-gold-300">{chip}</span>
            ))}
          </div>
        </Section>

        <Section icon="spark" title={t("guide.tips.t")} accent="#ff5470" delay={0.25}>
          <List accent="#ff5470" icon="flame" items={[t("guide.tips.1"), t("guide.tips.2"), t("guide.tips.3"), t("guide.tips.4"), t("guide.tips.5"), t("guide.tips.6")]} />
        </Section>

        <div className="flex flex-wrap justify-center gap-3 pt-2 pb-4">
          <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic&diff=1"); }}
            className="btn btn-primary clip-slant px-8 py-4 text-xs font-black">
            <Ic n="play" size={15} /> {t("home.play")}
          </button>
          <button type="button" onClick={() => { sfx.play("click"); go("/about"); }}
            className="btn btn-ghost clip-slant px-6 py-4 text-xs font-bold">
            <Ic n="medal" size={15} /> {t("nav.about")}
          </button>
        </div>
      </div>
    </div>
  );
}
