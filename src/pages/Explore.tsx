import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../state/store";
import { go } from "../lib/router";
import { searchPeople, PEOPLE } from "../data/people";
import type { Person } from "../data/people";
import { REG_CATS, DB_TOTAL, countRegistry, pageRegistry } from "../data/registry";
import { PersonCard, SectionHead } from "../components/bits";
import { CATS, Ic, catName } from "../data/categories";
import type { CatDef } from "../data/categories";
import { sfx } from "../lib/audio";
import { fmtNum } from "../lib/util";
import { COUNTRIES, countryName } from "../i18n";

const PAGE = 24;

export default function ExplorePage() {
  const { t, lang, digits } = useApp();
  const [tab, setTab] = useState<"legends" | "registry">("legends");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [cat, setCat] = useState("");
  const [cc, setCc] = useState("");
  const [items, setItems] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDebounced(q), 280);
    return () => window.clearTimeout(timer.current);
  }, [q]);

  useEffect(() => {
    setPage(1);
  }, [tab, debounced, cat, cc]);

  const legendResults = useMemo(() => {
    if (tab !== "legends") return [];
    const base = debounced.trim() ? searchPeople(debounced) : PEOPLE.slice();
    const filtered = base
      .filter((p) => (!cat || p.cat === cat || (cat === "iran" && p.iran)))
      .filter((p) => !cc || p.cc === cc)
      .sort((a, b) => b.pop - a.pop);
    return filtered;
  }, [tab, debounced, cat, cc]);

  useEffect(() => {
    if (tab !== "registry") return;
    setLoading(true);
    const id = window.setTimeout(() => {
      const f = { cat: cat || undefined, cc: cc || undefined, q: debounced || undefined };
      setTotal(countRegistry(f));
      setItems(pageRegistry(0, PAGE, f));
      setPage(1);
      setLoading(false);
    }, 220);
    return () => window.clearTimeout(id);
  }, [tab, cat, cc, debounced]);

  const loadMore = () => {
    sfx.play("click");
    setLoading(true);
    window.setTimeout(() => {
      const f = { cat: cat || undefined, cc: cc || undefined, q: debounced || undefined };
      setItems((prev) => [...prev, ...pageRegistry(prev.length, PAGE, f)]);
      setPage((p) => p + 1);
      setLoading(false);
    }, 200);
  };

  const regCats = REG_CATS.map((c) => CATS.find((x) => x.id === c)).filter((x): x is CatDef => !!x);
  const regCountries = Object.keys(COUNTRIES).filter((c) => ["BR", "AR", "DE", "ES", "FR", "GB", "IT", "PT", "NL", "US", "MX", "JP", "KR", "IN", "TR", "EG", "NG", "MA", "AU", "SE"].includes(c));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <SectionHead icon="search" title={t("explore.title")} sub={t("explore.sub")} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex clip-card-sm overflow-hidden border border-ink-600">
          {(["legends", "registry"] as const).map((tb) => (
            <button
              key={tb}
              type="button"
              onClick={() => { setTab(tb); setItems([]); sfx.play("click"); }}
              className={`px-4 py-2.5 font-display text-[11px] font-bold tracking-wide transition-colors ${tab === tb ? "bg-gold-500 text-ink-950" : "bg-ink-800 text-cream-300 hover:bg-ink-700"}`}
            >
              {tb === "legends" ? t("explore.legends") : `${t("explore.registry")} · ${fmtNum(DB_TOTAL, lang)}`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-cream-500"><Ic n="search" size={16} /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("explore.ph")}
            className="w-full clip-card-sm border border-ink-600 bg-ink-850 py-3 ps-10 pe-4 text-sm text-cream-50 placeholder:text-cream-500/70 focus:border-gold-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <select value={cat} onChange={(e) => { setCat(e.target.value); sfx.play("click"); }} className="clip-card-sm border border-ink-600 bg-ink-800 px-3 py-2.5 text-xs font-bold text-cream-300 focus:outline-none focus:border-gold-400">
          <option value="">{t("explore.filterCat")}: {t("common.all")}</option>
          {(tab === "legends" ? [...CATS, { id: "iran", name: ["Famous Iranians", "ایرانیان مشهور", "الإيرانيون المشاهير"] as [string, string, string], theme: "iran" as const, icon: "star8" }] : regCats).map((c) => (
            <option key={c.id} value={c.id}>{catName(c.id, lang)}</option>
          ))}
        </select>
        <select value={cc} onChange={(e) => { setCc(e.target.value); sfx.play("click"); }} className="clip-card-sm border border-ink-600 bg-ink-800 px-3 py-2.5 text-xs font-bold text-cream-300 focus:outline-none focus:border-gold-400">
          <option value="">{t("explore.filterCountry")}: {t("common.all")}</option>
          {(tab === "legends" ? Object.keys(COUNTRIES) : regCountries).map((c) => (
            <option key={c} value={c}>{countryName(c, lang)}</option>
          ))}
        </select>
        <span className="ms-auto text-[11px] font-bold text-cream-500">
          {tab === "legends" ? t("explore.results", { a: digits(legendResults.length) }) : t("explore.results", { a: fmtNum(total, lang) })}
        </span>
      </div>

      {tab === "legends" ? (
        legendResults.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {legendResults.slice(0, page * PAGE).map((p) => (
                <PersonCard key={p.id} person={p} size="sm" onClick={() => go(`/person/${p.id}`)} />
              ))}
            </div>
            {legendResults.length > page * PAGE && (
              <div className="mt-8 flex justify-center">
                <button type="button" onClick={() => { setPage((p) => p + 1); sfx.play("click"); }} className="btn btn-ghost clip-slant px-8 py-3 text-xs font-bold">
                  {t("btn.loadMore")} · {digits(Math.min(legendResults.length - page * PAGE, PAGE))}
                </button>
              </div>
            )}
          </>
        ) : (
          <Empty />
        )
      ) : loading && items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-cream-500">
          <span className="anim-spin-slow text-gold-400"><Ic n="refresh" size={30} /></span>
          <span className="text-sm font-semibold">{t("explore.loading")}</span>
        </div>
      ) : items.length > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {items.map((p) => (
              <PersonCard key={p.id} person={p} size="sm" onClick={() => go(`/person/${p.id}`)} />
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="text-[11px] font-bold text-cream-500">{t("explore.page", { a: digits(page) })} · {fmtNum(items.length, lang)}/{fmtNum(total, lang)}</div>
            {items.length < total && (
              <button type="button" onClick={loadMore} disabled={loading} className="btn btn-ghost clip-slant px-8 py-3 text-xs font-bold disabled:opacity-50">
                {loading ? t("explore.loading") : t("btn.loadMore")}
              </button>
            )}
          </div>
        </>
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Empty() {
  const { t } = useApp();
  return (
    <div className="mt-16 flex flex-col items-center gap-3 text-center">
      <span className="text-ink-400"><Ic n="search" size={40} /></span>
      <p className="max-w-sm text-sm text-cream-500">{t("explore.empty")}</p>
    </div>
  );
}
