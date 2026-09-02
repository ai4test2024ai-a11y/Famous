import { useMemo } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { CATS, SPECIAL_CATS, catDef, catName, Ic, THEMES } from "../data/categories";
import { peopleByCat } from "../data/people";
import { PersonCard, SectionHead } from "../components/bits";
import { sfx } from "../lib/audio";

export default function CategoriesPage({ param }: { param?: string }) {
  const { t, lang, digits } = useApp();

  const all = useMemo(() => [...SPECIAL_CATS, ...CATS], []);

  if (param) {
    const def = catDef(param);
    const people = useMemo(() => peopleByCat(param).sort((a, b) => b.pop - a.pop), [param]);
    const theme = THEMES[def.theme];
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="relative overflow-hidden clip-card">
          <img src={theme.art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/30" />
          <div className="relative p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => go("/categories")} className="btn btn-ghost clip-card-sm px-3 py-2.5">
                <Ic n="arrow" size={16} className="rtl:-scale-x-100 rotate-180" />
              </button>
              <span className="flex h-16 w-16 items-center justify-center clip-card" style={{ background: `${theme.c1}22`, color: theme.c2, boxShadow: `inset 0 0 0 1px ${theme.c1}55` }}>
                <Ic n={def.icon} size={34} />
              </span>
              <div>
                <h1 className="font-display text-2xl sm:text-4xl font-black text-cream-50">{catName(param, lang)}</h1>
                <p className="mt-1 text-sm text-cream-300">{digits(people.length)} × {t("home.peopleCount")}</p>
              </div>
            </div>
            <button type="button" onClick={() => { sfx.play("click"); go(`/quiz?mode=category&cat=${param}`); }} className="btn btn-primary clip-slant px-7 py-3.5 text-xs sm:text-sm font-black shrink-0">
              <Ic n="play" size={16} /> {t("btn.playCat")}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {people.map((p) => (
            <PersonCard key={p.id} person={p} onClick={() => go(`/person/${p.id}`)} />
          ))}
        </div>
        {people.length === 0 && (
          <p className="mt-10 text-center text-sm text-cream-500">{t("explore.empty")}</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHead icon="grid" title={t("nav.categories")} sub={t("tagline")} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {all.map((c, i) => {
          const theme = THEMES[c.theme];
          const count = peopleByCat(c.id).length;
          const big = i < 2;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => { sfx.play("click"); go(`/categories/${c.id}`); }}
              className={`card-glow clip-card group relative overflow-hidden text-start transition-transform hover:-translate-y-1.5 ${big ? "col-span-2 aspect-[2/1] sm:aspect-[2.2/1]" : "aspect-[4/3]"}`}
              style={{ ["--g1" as string]: `${theme.c1}77`, ["--g2" as string]: `${theme.c2}66` }}
            >
              <img src={theme.art} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-45" draggable={false} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(165deg, ${theme.c1}26, rgba(5,11,18,0.92) 75%)` }} />
              <div className={`relative flex h-full flex-col justify-between ${big ? "p-6" : "p-4"}`}>
                <span style={{ color: theme.c2 }}><Ic n={c.icon} size={big ? 34 : 26} /></span>
                <div>
                  <div className={`font-display font-black text-cream-50 leading-tight ${big ? "text-xl sm:text-3xl" : "text-sm sm:text-base"}`}>
                    {catName(c.id, lang)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px] sm:text-[11px] font-bold" style={{ color: theme.c2 }}>
                    <span>{digits(count)} {t("home.peopleCount")}</span>
                    <span className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 flex items-center gap-1">
                      <Ic n="play" size={11} /> {t("nav.play")}
                    </span>
                  </div>
                </div>
              </div>
              <span className="pointer-events-none absolute -bottom-4 -end-4 opacity-[0.08] group-hover:opacity-20 transition-opacity" style={{ color: theme.c1 }}>
                <Ic n={c.icon} size={big ? 130 : 90} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
