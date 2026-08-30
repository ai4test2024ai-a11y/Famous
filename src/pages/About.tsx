import { useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { Ic } from "../data/categories";
import { SectionHead } from "../components/bits";
import { sfx } from "../lib/audio";

const PHONE = "00971551544988";

export default function AboutPage() {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    sfx.play("click");
    try {
      await navigator.clipboard.writeText(PHONE);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = PHONE;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    sfx.play("correct");
    window.setTimeout(() => setCopied(false), 2200);
  };

  const stack = ["React", "TypeScript", "Tailwind CSS", "WebAudio API", "EN / فارسی / العربية", "RTL Engine"];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <SectionHead icon="user" title={t("about.title")} />

      {/* creator card */}
      <div className="glass clip-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(90% 70% at 85% 0%, rgba(245,173,29,0.35), transparent 65%), radial-gradient(60% 60% at 0% 100%, rgba(31,224,189,0.18), transparent 60%)" }} aria-hidden />
        <div className="relative p-6 sm:p-9">
          <button type="button" onClick={() => { sfx.play("click"); go("/"); }} className="btn btn-ghost clip-slant px-4 py-2 text-[11px] font-bold">
            <Ic n="home" size={13} /> {t("nav.home")}
          </button>

          <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* avatar mark */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1.5 opacity-50 blur-lg anim-glow" style={{ background: "linear-gradient(140deg, #f5ad1d, #1fe0bd)" }} aria-hidden />
              <div className="relative flex h-20 w-20 items-center justify-center clip-card border-2 border-gold-500/60 bg-ink-850">
                <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden>
                  <path d="M24 4 41 13.5v19L24 44 7 32.5v-19Z" fill="none" stroke="#f5ad1d" strokeWidth="2.2" strokeLinejoin="round" />
                  <path d="M17 20.5c0-2.2 1.5-4 3.5-4s3.5 1.6 3.5 4c0 3-3.5 3.2-3.5 6" fill="none" stroke="#f3ecda" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx="20.5" cy="31.5" r="1.7" fill="#1fe0bd" />
                  <path d="m31 15 1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4Z" fill="#ff5470" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-[0.25em] text-gold-400">{t("about.dev")}</div>
              <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-black text-cream-50">{t("about.madeBy2")}</h2>
              <span className="mt-2.5 inline-flex items-center gap-1.5 clip-tag bg-mint-500/12 px-3 py-1 text-[10px] font-black tracking-[0.15em] text-mint-400">
                <Ic n="spark" size={12} /> {t("about.badge")}
              </span>
            </div>
          </div>

          <p className="mt-7 max-w-xl text-sm sm:text-[15px] leading-relaxed text-cream-100">{t("about.purpose")}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-cream-300">
            {t("about.madeBy1")} <strong className="font-display font-black text-gold-400">{t("about.madeBy2")}</strong>
          </p>
        </div>
      </div>

      {/* instructor + contact */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="clip-card border border-ink-700 bg-ink-850/80 p-6">
          <div className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.22em] text-mint-400">
            <Ic n="medal" size={15} /> {t("about.teacher").toUpperCase()}
          </div>
          <div className="mt-3 font-display text-lg font-black text-cream-50">{t("about.teacherName")}</div>
          <div className="mt-4 border-t border-ink-700 pt-4">
            <div className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.22em] text-cream-500">
              <Ic n="vol" size={14} /> {t("about.phone").toUpperCase()}
            </div>
            <div className="mt-2.5 font-display text-xl sm:text-2xl font-black tracking-wider text-gold-400" dir="ltr">{PHONE}</div>
          </div>
        </div>

        <div className="clip-card border border-ink-700 bg-ink-850/80 p-6 flex flex-col justify-center gap-3">
          <a href={`tel:${PHONE}`} className="btn btn-primary clip-slant w-full px-5 py-3.5 text-xs font-black" onClick={() => sfx.play("click")}>
            <Ic n="vol" size={15} /> {t("about.call")}
          </a>
          <button type="button" onClick={copy} className={`btn clip-slant w-full px-5 py-3.5 text-xs font-black transition-colors ${copied ? "btn-mint" : "btn-ghost"}`}>
            <Ic n={copied ? "check" : "edit"} size={15} /> {copied ? t("about.copied") : t("about.copy")}
          </button>
        </div>
      </div>

      {/* stack */}
      <div className="mt-5 glass clip-card p-6">
        <div className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.22em] text-cream-500">
          <Ic n="chip" size={14} /> {t("about.stack")}
        </div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="clip-tag border border-ink-600 bg-ink-800 px-3 py-1.5 font-display text-[10px] font-bold text-cream-300">{s}</span>
          ))}
        </div>
        <p className="mt-5 text-[11px] italic text-cream-500">✦ {t("about.madeWith")}</p>
      </div>
    </div>
  );
}
