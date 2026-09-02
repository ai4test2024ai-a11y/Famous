import { useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { Ic } from "../components/ui";
import { sfx } from "../lib/audio";

const PHONE = "00971551544988";

export default function About() {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    sfx.play("click");
    try {
      await navigator.clipboard.writeText(PHONE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the number stays visible & selectable */
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <button type="button" onClick={() => { sfx.play("click"); go("/"); }}
        className="btn btn-ghost clip-slant px-4 py-2 text-[11px] font-bold">
        <Ic n="arrow" size={14} className={`rtl:-scale-x-100 ${lang === "en" ? "rotate-180" : ""}`} /> {t("common.back")}
      </button>

      <div className="anim-pop glass clip-card relative mt-6 overflow-hidden p-7 sm:p-10">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 55% at 85% 0%, rgba(245,173,29,0.16), transparent 60%), radial-gradient(50% 45% at 8% 100%, rgba(31,224,189,0.1), transparent 60%)" }} aria-hidden />

        <div className="relative">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center clip-card bg-gold-500/15 text-gold-400">
              <Ic n="medal" size={28} />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-cream-50">{t("about.title")}</h1>
          </div>

          <p className="mt-7 text-sm sm:text-[15px] leading-8 text-cream-100">{t("about.p1")}</p>

          <p className="mt-4 text-sm sm:text-[15px] leading-8 text-cream-100">
            {t("about.p2a")}{" "}
            <strong className="font-display font-black text-gold-400">{t("about.p2b")}</strong>{" "}
            {t("about.p2c")}
          </p>

          {/* instructor */}
          <div className="mt-8 clip-card-sm border border-ink-600 bg-ink-900/60 p-5">
            <div className="text-[10px] font-black tracking-[0.25em] text-mint-400">{t("about.teacher")}</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center clip-card-sm bg-mint-500/12 text-mint-400">
                <Ic n="user" size={19} />
              </span>
              <span className="font-display text-base sm:text-lg font-black text-cream-50">{t("about.teacherName")}</span>
            </div>
          </div>

          {/* phone */}
          <div className="mt-4 clip-card-sm border border-ink-600 bg-ink-900/60 p-5">
            <div className="text-[10px] font-black tracking-[0.25em] text-coral-400">{t("about.phone")}</div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span dir="ltr" className="select-all font-display text-lg sm:text-xl font-black tracking-[0.08em] text-cream-50">
                {PHONE}
              </span>
              <span className="flex flex-wrap gap-2">
                <button type="button" onClick={copy}
                  className={`btn clip-slant px-4 py-2.5 text-[10px] font-black ${copied ? "btn-mint" : "btn-ghost"}`}>
                  <Ic n={copied ? "check" : "edit"} size={13} /> {copied ? t("about.copied") : t("about.copy")}
                </button>
                <a href={`tel:${PHONE}`} onClick={() => sfx.play("click")}
                  className="btn btn-coral clip-slant px-4 py-2.5 text-[10px] font-black">
                  <Ic n="vol" size={13} /> {t("about.call")}
                </a>
              </span>
            </div>
          </div>

          <button type="button" onClick={() => { sfx.play("click"); go("/quiz?mode=classic&diff=1"); }}
            className="btn btn-primary clip-slant mt-8 px-8 py-4 text-xs sm:text-sm font-black">
            <Ic n="play" size={16} /> {t("about.play")}
          </button>
        </div>
      </div>
    </div>
  );
}
