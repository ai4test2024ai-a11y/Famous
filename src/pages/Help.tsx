import { useApp } from "../state/store";
import { go } from "../lib/router";
import { Ic } from "../data/categories";
import { SectionHead } from "../components/bits";
import { sfx } from "../lib/audio";

/* Values below mirror the real game constants: QTIME=20s, BASE_POINTS {100,150,200,300},
   timeBonus = timeLeft×(diff+1), streakBonus = min(streak×15, 150), 15 rounds (10 daily), 5 options. */
const BASE_PTS = [
  { d: 1, v: 100, c: "#4dffd8" },
  { d: 2, v: 150, c: "#ffc95c" },
  { d: 3, v: 200, c: "#ff8a5c" },
  { d: 4, v: 300, c: "#ff5470" },
];

function Section({ icon, title, children, accent = "#f5ad1d", delay = 0 }: {
  icon: string; title: string; children: React.ReactNode; accent?: string; delay?: number;
}) {
  return (
    <section className="glass clip-card relative overflow-hidden p-6 sm:p-8 anim-rise" style={{ animationDelay: `${delay}s` }}>
      <div className="absolute inset-0 opacity-[0.14] pointer-events-none" style={{ background: `radial-gradient(70% 60% at 100% 0%, ${accent}, transparent 60%)` }} aria-hidden />
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

function Steps({ items, accent }: { items: string[]; accent: string }) {
  const { digits } = useApp();
  return (
    <ol className="flex flex-col gap-3">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center clip-card-sm font-display text-[11px] font-black text-ink-950" style={{ background: accent }}>
            {digits(i + 1)}
          </span>
          <p className="text-sm leading-relaxed text-cream-100">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HelpPage() {
  const { t, lang, digits } = useApp();

  const controls = [
    { icon: "target", txt: t("guide.keys.tap") },
    { icon: "list", txt: t("guide.keys.kb") },
    { icon: "calendar", txt: t("guide.keys.cal") },
    { icon: "x", txt: t("guide.keys.exit") },
  ];

  const outcome = [
    t("quiz.finalScore"), t("quiz.accuracy"), t("quiz.bestStreak"),
    t("quiz.correct"), t("quiz.xp"), `${t("profile.level")} + ${t("profile.achTitle")}`,
  ];

  const modes = [
    { icon: "calendar", name: t("btn.birthdate"), desc: t("mode.classic.desc"), to: "/quiz?mode=classic", c: "#ffc95c" },
    { icon: "bolt", name: t("btn.daily"), desc: t("mode.daily.desc"), to: "/quiz?mode=daily", c: "#4dffd8" },
    { icon: "star", name: t("btn.myBirthday"), desc: t("mode.bday.desc"), to: "/quiz?mode=birthday", c: "#ff5470" },
    { icon: "grid", name: t("btn.categories"), desc: t("mode.cat.desc"), to: "/categories", c: "#8fb7ff" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <SectionHead icon="spark" title={t("guide.title")} sub={t("guide.sub")} />

      <div className="flex flex-col gap-5">
        {/* GOAL */}
        <Section icon="target" title={t("guide.goal.t")} accent="#ffc95c">
          <p className="text-sm sm:text-[15px] leading-relaxed text-cream-100">{t("guide.goal.d")}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black">
            <span className="clip-tag bg-ink-800 px-3 py-1.5 text-gold-400">{digits(15)} {lang === "fa" ? "راند" : lang === "ar" ? "جولة" : "ROUNDS"}</span>
            <span className="clip-tag bg-ink-800 px-3 py-1.5 text-mint-400">{digits(5)} {t("quiz.choices")}</span>
            <span className="clip-tag bg-ink-800 px-3 py-1.5 text-coral-400">{digits(20)}s</span>
          </div>
        </Section>

        {/* CONTROLS */}
        <Section icon="pad" title={t("guide.keys.t")} accent="#4dffd8" delay={0.05}>
          <ul className="flex flex-col gap-3">
            {controls.map((c) => (
              <li key={c.txt} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center clip-card-sm bg-ink-800 text-mint-400">
                  <Ic n={c.icon} size={15} />
                </span>
                <p className="text-sm leading-relaxed text-cream-100">{c.txt}</p>
              </li>
            ))}
          </ul>
          {/* real scoring table */}
          <div className="mt-5 border-t border-ink-700 pt-4">
            <div className="text-[10px] font-black tracking-[0.22em] text-cream-500">{t("guide.base")}</div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BASE_PTS.map((b) => (
                <div key={b.d} className="clip-card-sm border border-ink-700 bg-ink-900/70 p-3 text-center transition-transform hover:-translate-y-0.5">
                  <div className="font-display text-[10px] font-black tracking-wide" style={{ color: b.c }}>{t(`diff.${b.d}`)}</div>
                  <div className="mt-1 font-display text-xl font-black text-cream-50">{digits(b.v)}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-cream-500">
              + {t("quiz.timeBonus")} · + {t("quiz.streakBonus")} (≤{digits(150)})
            </p>
          </div>
        </Section>

        {/* HOW TO PLAY */}
        <Section icon="play" title={t("guide.how.t")} accent="#ff8a5c" delay={0.1}>
          <Steps accent="#ff8a5c" items={[
            t("guide.how.s1"), t("guide.how.s2"), t("guide.how.s3"), t("guide.how.s4"), t("guide.how.s5"),
          ]} />
        </Section>

        {/* FLOW */}
        <Section icon="refresh" title={t("guide.flow.t")} accent="#8fb7ff" delay={0.15}>
          <Steps accent="#8fb7ff" items={[
            t("guide.flow.s1"), t("guide.flow.s2"), t("guide.flow.s3"), t("guide.flow.s4"), t("guide.flow.s5"), t("guide.flow.s6"),
          ]} />
        </Section>

        {/* MODES */}
        <Section icon="grid" title={t("home.modes")} accent="#f5ad1d" delay={0.2}>
          <div className="grid gap-3 sm:grid-cols-2">
            {modes.map((m) => (
              <button
                key={m.to}
                type="button"
                onClick={() => { sfx.play("click"); go(m.to); }}
                className="clip-card border border-ink-700 bg-ink-900/70 p-4 text-start transition-all hover:-translate-y-0.5 hover:border-ink-400"
              >
                <span className="flex items-center gap-2 font-display text-[12px] font-black" style={{ color: m.c }}>
                  <Ic n={m.icon} size={15} /> {m.name}
                </span>
                <span className="mt-1.5 block text-[11px] leading-relaxed text-cream-500">{m.desc}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* OUTCOME */}
        <Section icon="trophy" title={t("guide.out.t")} accent="#ffc95c" delay={0.25}>
          <p className="text-sm leading-relaxed text-cream-100">{t("guide.out.d")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {outcome.map((o) => (
              <span key={o} className="clip-tag border border-gold-500/35 bg-gold-500/[0.08] px-3 py-1.5 text-[10px] font-black text-gold-300">{o}</span>
            ))}
          </div>
        </Section>

        {/* TIPS */}
        <Section icon="spark" title={t("guide.tips.t")} accent="#ff5470" delay={0.3}>
          <ul className="flex flex-col gap-3">
            {[t("guide.tips.1"), t("guide.tips.2"), t("guide.tips.3"), t("guide.tips.4"), t("guide.tips.5"), t("guide.tips.6")].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1 shrink-0 text-coral-400"><Ic n="bolt" size={14} /></span>
                <p className="text-sm leading-relaxed text-cream-100">{tip}</p>
              </li>
            ))}
          </ul>
        </Section>

        <div className="flex flex-wrap justify-center gap-3 pt-2 pb-6">
          <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic"); }} className="btn btn-primary clip-slant px-8 py-4 text-xs font-black">
            <Ic n="play" size={15} /> {t("btn.playNow")}
          </button>
          <button type="button" onClick={() => { sfx.play("click"); go("/about"); }} className="btn btn-ghost clip-slant px-6 py-4 text-xs font-bold">
            <Ic n="user" size={15} /> {t("nav.about")}
          </button>
        </div>
      </div>
    </div>
  );
}
