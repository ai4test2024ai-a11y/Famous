import { useEffect, useMemo } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { PERSON_BY_ID, localizedName, yearOf, eraOf, rarityOf, peopleByCat } from "../data/people";
import type { Person } from "../data/people";
import { pageRegistry } from "../data/registry";
import { catDef, catName, Ic, THEMES } from "../data/categories";
import { Portrait, RARITY_COLOR } from "../components/bits";
import { countryName, countryCode3, locDateGregorian, monthNameJ } from "../i18n";
import { toJalaali } from "../lib/jalali";
import { sfx } from "../lib/audio";
import { fmtNum } from "../lib/util";

export default function PersonPage({ id }: { id: string }) {
  const { t, lang, digits, markViewed } = useApp();

  const person: Person | null = useMemo(() => {
    const p = PERSON_BY_ID.get(id);
    if (p) return p;
    if (id.startsWith("r")) {
      const idx = Number(id.slice(1));
      return pageRegistry(idx, 1)[0] ?? null;
    }
    return null;
  }, [id]);

  useEffect(() => {
    if (person && !person.reg) markViewed(person.id);
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!person) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-cream-500">{t("explore.empty")}</p>
        <button type="button" onClick={() => go("/explore")} className="btn btn-primary clip-slant mt-6 px-7 py-3 text-xs font-black">{t("nav.explore")}</button>
      </div>
    );
  }

  const theme = THEMES[person.iran ? "iran" : catDef(person.cat).theme];
  const rarity = rarityOf(person);
  const era = eraOf(person);
  const year = yearOf(person);
  const [yy, mm, dd] = person.dob.split("-").map(Number);
  const jal = toJalaali(yy, mm, dd);
  const cat = catDef(person.cat);
  const related = peopleByCat(person.cat).filter((p) => p.id !== person.id).slice(0, 5);

  const bio = person.bio ?? templateBio(person, lang, t, digits);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <button type="button" onClick={() => go("/explore")} className="btn btn-ghost clip-slant px-4 py-2 text-[11px] font-bold">
        <Ic n="arrow" size={14} className="rtl:-scale-x-100 rotate-180" /> {t("common.back")}
      </button>

      <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* collectible card */}
        <div>
          <div className="relative">
            <div className="absolute -inset-2 opacity-40 blur-2xl" style={{ background: `linear-gradient(140deg, ${theme.c1}, ${theme.c2})` }} aria-hidden />
            <div className="relative clip-card border-2" style={{ borderColor: `${RARITY_COLOR[rarity]}88` }}>
              <Portrait person={person} className="aspect-[3/4.15]" monogram="text-7xl" />
              <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
                <span className="clip-tag px-2.5 py-1 font-display text-[9px] font-black tracking-[0.18em]" style={{ background: `${RARITY_COLOR[rarity]}22`, color: RARITY_COLOR[rarity], boxShadow: `inset 0 0 0 1px ${RARITY_COLOR[rarity]}66` }}>
                  {t(`rarity.${rarity}`)}
                </span>
                {person.reg && (
                  <span className="clip-tag bg-ink-900/80 px-2.5 py-1 font-display text-[9px] font-bold tracking-[0.18em] text-cream-300">
                    {t("explore.registryBadge")}
                  </span>
                )}
                {!person.reg && (
                  <span className="clip-tag bg-mint-500/15 px-2.5 py-1 font-display text-[9px] font-bold tracking-[0.18em] text-mint-400">
                    {t("explore.verified")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="clip-card-sm border border-ink-700 bg-ink-850 p-3.5">
              <div className="text-[9px] font-bold tracking-[0.18em] text-cream-500">{t("common.popularity")}</div>
              <div className="mt-1.5 flex gap-1 text-gold-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ic key={i} n="star" size={15} className={i <= person.pop ? "" : "opacity-20"} />
                ))}
              </div>
            </div>
            <div className="clip-card-sm border border-ink-700 bg-ink-850 p-3.5">
              <div className="text-[9px] font-bold tracking-[0.18em] text-cream-500">{t("common.difficulty")}</div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-2 flex-1 clip-card-sm ${i <= person.diff ? "" : "opacity-20"}`} style={{ background: i <= person.diff ? DIFF_COLORS[person.diff - 1] : "#4d7396" }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* dossier */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em]" style={{ color: theme.c2 }}>
            <Ic n={cat.icon} size={15} /> {catName(person.cat, lang).toUpperCase()}
            {person.iran && <span className="clip-tag bg-mint-500/15 px-2 py-0.5 text-mint-400">IRI</span>}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl font-black leading-tight text-cream-50">{localizedName(person, lang)}</h1>
          {localizedName(person, lang) !== person.en && (
            <div className="mt-1.5 font-display text-sm font-bold text-cream-500" dir="ltr">{person.en}</div>
          )}

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Meta label={t("common.country")} value={countryName(person.cc, lang)} extra={countryCode3(person.cc)} />
            <Meta label={t("common.gregorianDate")} value={locDateGregorian(person.dob, lang, digits)} />
            <Meta label={t("common.jalaliDate")} value={`${digits(jal.jd)} ${monthNameJ(jal.jm)} ${digits(jal.jy)}`} />
            <Meta label={t("common.profession")} value={catName(person.cat, lang)} />
            <Meta label={t("common.era")} value={t(`era.${era}`)} />
            <Meta label={t("common.category")} value={person.reg ? t("explore.registryBadge") : t("explore.verified")} />
          </div>

          <div className="mt-7 clip-card glass p-6">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.25em] text-gold-400">
              <Ic n="pen" size={13} /> {t("common.biography")}
            </div>
            <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-cream-100">{bio}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {!person.reg && (
              <button type="button" onClick={() => { sfx.play("click"); go(`/quiz?mode=category&cat=${person.cat}`); }} className="btn btn-primary clip-slant px-6 py-3 text-xs font-black">
                <Ic n="play" size={14} /> {t("btn.playCat")}
              </button>
            )}
            <button type="button" onClick={() => { sfx.play("click"); go(`/categories/${person.cat}`); }} className="btn btn-ghost clip-slant px-6 py-3 text-xs font-bold">
              <Ic n={cat.icon} size={14} /> {catName(person.cat, lang)}
            </button>
          </div>

          {related.length > 0 && (
            <div className="mt-8">
              <div className="text-[10px] font-bold tracking-[0.25em] text-cream-500">{t("common.related")}</div>
              <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {related.map((p) => (
                  <button key={p.id} type="button" onClick={() => go(`/person/${p.id}`)} className="w-28 shrink-0 text-start transition-transform hover:-translate-y-1">
                    <Portrait person={p} className="aspect-[3/4]" art={false} monogram="text-lg" />
                    <div className="mt-1.5 truncate text-[10px] font-bold text-cream-300">{localizedName(p, lang)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const DIFF_COLORS = ["#4dffd8", "#ffc95c", "#ff8a5c", "#ff5470"];

function Meta({ label, value, extra }: { label: string; value: string; extra?: string }) {
  return (
    <div className="clip-card-sm border border-ink-700 bg-ink-850/80 p-3.5">
      <div className="text-[9px] font-bold tracking-[0.18em] text-cream-500">{label}</div>
      <div className="mt-1 font-display text-[12px] font-bold text-cream-50">{value}</div>
      {extra && <div className="text-[9px] font-bold text-gold-400">{extra}</div>}
    </div>
  );
}

function templateBio(
  p: Person, lang: "en" | "fa" | "ar",
  t: (k: string, v?: Record<string, number | string>) => string,
  digits: (x: string | number) => string
): string {
  const prof = catName(p.cat, lang);
  const country = countryName(p.cc, lang);
  const era = t(`era.${eraOf(p)}`);
  const y = digits(yearOf(p));
  if (lang === "fa") return `${prof} اهل ${country}، زادهٔ سال ${y} — از چهره‌های «${era}» در صحنهٔ جهانی. نام او در فهرست بزرگان این رشته ثبت شده و در این بازی با سطح سختی ${fmtNum(p.diff, lang)} از ۴ حضور دارد.`;
  if (lang === "ar") return `${prof} من ${country}، وُلد عام ${y} — من وجوه «${era}» على الساحة العالمية. اسمه مسجّل بين كبار هذا المجال، ويظهر في اللعبة بمستوى صعوبة ${fmtNum(p.diff, lang)} من ٤.`;
  return `A celebrated ${prof.toLowerCase()} from ${country}, born in ${yearOf(p)} — a recognized name of the ${era.toLowerCase()} on the world stage, ranked here with difficulty ${p.diff} of 4.`;
}
