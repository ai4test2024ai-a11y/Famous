import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./state/store";
import { useRoute, go } from "./lib/router";
import { Logo, ParticlesBg, Ic } from "./components/ui";
import { sfx } from "./lib/audio";
import type { Lang } from "./data/people";
import Home from "./views/Home";
import Quiz from "./views/Quiz";
import type { Mode } from "./views/Quiz";
import { Leaderboard, Profile, Explore } from "./views/More";

const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "EN" },
  { id: "fa", label: "فارسی", flag: "فا" },
  { id: "ar", label: "العربية", flag: "ع" },
];

function Shell() {
  const { t, lang, setLang, soundOn, toggleSound } = useApp();
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [route.page, route.query]);

  const nav = [
    { id: "home", label: t("nav.home"), icon: "home", to: "/" },
    { id: "quiz", label: t("nav.play"), icon: "play", to: "/quiz?mode=classic&diff=1" },
    { id: "explore", label: t("nav.explore"), icon: "search", to: "/explore" },
    { id: "board", label: t("nav.board"), icon: "trophy", to: "/board" },
    { id: "profile", label: t("nav.profile"), icon: "user", to: "/profile" },
  ];

  const mode = (route.query.get("mode") ?? "classic") as Mode;
  const diff = Math.min(4, Math.max(1, Number(route.query.get("diff")) || 1));

  return (
    <div className="relative min-h-dvh">
      <ParticlesBg />

      <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-3 sm:px-6 py-2.5">
          <button type="button" onClick={() => { sfx.play("click"); go("/"); }} className="shrink-0" aria-label={t("nav.home")}>
            <Logo />
          </button>

          <nav className="order-3 basis-full hidden items-center gap-0.5 overflow-x-auto no-scrollbar whitespace-nowrap xl:order-none xl:flex xl:basis-auto xl:overflow-visible" aria-label={t("nav.home")}>
            {nav.map((n) => {
              const active = route.page === n.id;
              return (
                <button key={n.id} type="button" onClick={() => { sfx.play("click"); go(n.to); }}
                  className={`clip-card-sm flex shrink-0 items-center gap-1.5 whitespace-nowrap px-2.5 py-2 font-display text-[10px] font-bold tracking-wide transition-colors 2xl:px-3 2xl:text-[11px] ${active ? "bg-gold-500/15 text-gold-400" : "text-cream-300 hover:bg-ink-800 hover:text-cream-50"}`}>
                  <Ic n={n.icon} size={13} /> {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* language */}
            <div className="relative">
              <button type="button" onClick={() => { setLangOpen((o) => !o); sfx.play("click"); }}
                aria-label={t("common.language")} aria-expanded={langOpen}
                className="btn btn-ghost clip-card-sm shrink-0 px-2.5 py-2.5 text-[11px] font-bold whitespace-nowrap">
                <Ic n="globe" size={14} />
                <span>{LANGS.find((l) => l.id === lang)?.flag}</span>
                <Ic n="chev" size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={() => setLangOpen(false)} aria-label={t("common.close")} />
                  <div className="anim-pop absolute end-0 top-full z-50 mt-2 w-40 clip-card glass p-1.5 shadow-2xl shadow-black/60">
                    {LANGS.map((l) => (
                      <button key={l.id} type="button" onClick={() => { setLang(l.id); setLangOpen(false); sfx.play("flip"); }}
                        className={`flex w-full items-center justify-between clip-card-sm px-3 py-2.5 text-xs font-bold transition-colors ${lang === l.id ? "bg-gold-500/15 text-gold-400" : "text-cream-300 hover:bg-ink-800"}`}>
                        <span>{l.label}</span>
                        {lang === l.id && <Ic n="check" size={13} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* sound */}
            <button type="button" onClick={() => { toggleSound(); sfx.play("click"); }} title={t("common.sound")} aria-label={t("common.sound")}
              className="btn btn-ghost clip-card-sm shrink-0 px-2.5 py-2.5">
              <Ic n={soundOn ? "vol" : "volOff"} size={15} className={soundOn ? "text-mint-400" : "text-cream-500"} />
            </button>

            {/* burger */}
            <button type="button" onClick={() => { setMenuOpen((o) => !o); sfx.play("click"); }} aria-label={t("nav.home")} aria-expanded={menuOpen}
              className="btn btn-ghost clip-card-sm shrink-0 px-2.5 py-2.5 xl:hidden">
              <Ic n={menuOpen ? "x" : "list"} size={16} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="anim-pop border-t border-ink-700/60 bg-ink-900/95 px-4 py-4 xl:hidden pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-2 gap-2">
              {nav.map((n) => (
                <button key={n.id} type="button" onClick={() => { sfx.play("click"); go(n.to); }}
                  className={`clip-card-sm flex items-center gap-2.5 px-4 py-3.5 font-display text-[11px] font-bold ${route.page === n.id ? "bg-gold-500/15 text-gold-400" : "bg-ink-800 text-cream-300"}`}>
                  <Ic n={n.icon} size={15} /> {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <div key={`${route.page}-${route.query.toString()}`} className="anim-rise">
          {route.page === "home" && <Home />}
          {route.page === "quiz" && <Quiz mode={mode} diffId={diff} />}
          {route.page === "board" && <Leaderboard />}
          {route.page === "profile" && <Profile />}
          {route.page === "explore" && <Explore initialCat={route.query.get("cat") ?? undefined} />}
        </div>
      </main>

      <footer className="relative z-10 mt-20 border-t border-ink-700/60 bg-ink-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Logo size={32} />
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <button type="button" onClick={() => go("/quiz?mode=classic&diff=1")} className="text-cream-300 hover:text-gold-400 transition-colors">{t("nav.play")}</button>
            <button type="button" onClick={() => go("/explore")} className="text-cream-300 hover:text-gold-400 transition-colors">{t("nav.explore")}</button>
            <button type="button" onClick={() => go("/board")} className="text-cream-300 hover:text-gold-400 transition-colors">{t("nav.board")}</button>
          </div>
        </div>
        <div className="border-t border-ink-800 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-[11px] font-semibold text-cream-500">
          © {new Date().getFullYear()} {t("brand")}
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
