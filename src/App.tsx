import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./state/store";
import { useRoute, go } from "./lib/router";
import { Logo, ParticlesBg, Toasts } from "./components/bits";
import { Ic, CATS, catName } from "./data/categories";
import { sfx } from "./lib/audio";
import { levelFromXp } from "./lib/quiz";
import type { Lang } from "./lib/util";
import Home from "./pages/Home";
import QuizPage from "./pages/Quiz";
import CategoriesPage from "./pages/Categories";
import ExplorePage from "./pages/Explore";
import ProfilePage from "./pages/Profile";
import LeaderboardPage from "./pages/Leaderboard";
import PersonPage from "./pages/Person";
import AboutPage from "./pages/About";
import HelpPage from "./pages/Help";

const LANGS: { id: Lang; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "EN" },
  { id: "fa", label: "فارسی", flag: "فا" },
  { id: "ar", label: "العربية", flag: "ع" },
];

function Shell() {
  const { t, lang, setLang, soundOn, toggleSound, profile, digits } = useApp();
  const route = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
    window.scrollTo(0, 0);
  }, [route.page, route.param, route.query]);

  const nav = [
    { id: "home", label: t("nav.home"), icon: "home", to: "/" },
    { id: "play", label: t("nav.play"), icon: "play", to: "/quiz?mode=classic" },
    { id: "categories", label: t("nav.categories"), icon: "grid", to: "/categories" },
    { id: "explore", label: t("nav.explore"), icon: "search", to: "/explore" },
    { id: "leaderboard", label: t("nav.leaderboard"), icon: "trophy", to: "/leaderboard" },
    { id: "help", label: t("nav.help"), icon: "spark", to: "/help" },
    { id: "about", label: t("nav.about"), icon: "medal", to: "/about" },
  ];

  const level = levelFromXp(profile.xp);

  return (
    <div className="relative min-h-dvh">
      <ParticlesBg />

      {/* ================= NAV ================= */}
      <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="px-safe mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-3">
          <button type="button" onClick={() => { sfx.play("click"); go("/"); }} className="shrink-0">
            <Logo />
          </button>

          <nav className="hidden xl:flex items-center gap-0.5">
            {nav.map((n) => {
              const active = route.page === n.id || (n.id === "play" && route.page === "quiz");
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => { sfx.play("click"); go(n.to); }}
                  className={`clip-card-sm flex items-center gap-1.5 px-3 py-2.5 font-display text-[11px] font-bold tracking-wide transition-colors ${active ? "bg-gold-500/15 text-gold-400" : "text-cream-300 hover:bg-ink-800 hover:text-cream-50"}`}
                >
                  <Ic n={n.icon} size={13} /> {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* language */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setLangOpen((o) => !o); sfx.play("click"); }}
                className="btn btn-ghost clip-card-sm px-3 py-2.5 text-[11px] font-bold"
              >
                <Ic n="globe" size={14} />
                <span>{LANGS.find((l) => l.id === lang)?.flag}</span>
                <Ic n="chev" size={12} className={`transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <>
                  <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={() => setLangOpen(false)} aria-label="close" />
                  <div className="anim-pop absolute end-0 top-full z-50 mt-2 w-40 clip-card glass p-1.5 shadow-2xl shadow-black/60">
                    {LANGS.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => { setLang(l.id); setLangOpen(false); sfx.play("flip"); }}
                        className={`flex w-full items-center justify-between clip-card-sm px-3 py-2.5 text-xs font-bold transition-colors ${lang === l.id ? "bg-gold-500/15 text-gold-400" : "text-cream-300 hover:bg-ink-800"}`}
                      >
                        <span>{l.label}</span>
                        {lang === l.id && <Ic n="check" size={13} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* sound */}
            <button type="button" onClick={() => { toggleSound(); sfx.play("click"); }} className="btn btn-ghost clip-card-sm px-3 py-2.5" title={t("common.sound")}>
              <Ic n={soundOn ? "vol" : "volOff"} size={15} className={soundOn ? "text-mint-400" : "text-cream-500"} />
            </button>

            {/* help */}
            <button
              type="button"
              onClick={() => { sfx.play("click"); go("/help"); }}
              title={t("nav.help")}
              className={`btn clip-card-sm px-3 py-2.5 font-display text-sm font-black ${route.page === "help" ? "btn-primary" : "btn-ghost text-cream-300"}`}
            >
              ؟
            </button>

            {/* profile chip */}
            <button type="button" onClick={() => { sfx.play("click"); go("/profile"); }} className="btn btn-ghost clip-card-sm px-3 py-2 gap-2 hidden sm:inline-flex">
              <span className="flex h-6 w-6 items-center justify-center bg-gold-500 clip-card-sm font-display text-[10px] font-black text-ink-950">
                {digits(level)}
              </span>
              <span className="font-display text-[11px] font-bold text-cream-100 max-w-[90px] truncate">
                {profile.name || "Player"}
              </span>
            </button>

            {/* burger */}
            <button type="button" onClick={() => { setMenuOpen((o) => !o); sfx.play("click"); }} className="btn btn-ghost clip-card-sm px-3 py-2.5 xl:hidden">
              <Ic n={menuOpen ? "x" : "list"} size={16} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="anim-pop border-t border-ink-700/60 bg-ink-900/95 px-4 py-4 xl:hidden pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="grid grid-cols-2 gap-2">
              {[...nav, { id: "profile", label: t("nav.profile"), icon: "user", to: "/profile" }].map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => { sfx.play("click"); go(n.to); }}
                  className={`clip-card-sm flex items-center gap-2.5 px-4 py-3.5 font-display text-[11px] font-bold ${route.page === n.id ? "bg-gold-500/15 text-gold-400" : "bg-ink-800 text-cream-300"}`}
                >
                  <Ic n={n.icon} size={15} /> {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ================= PAGES ================= */}
      <main className="relative z-10">
        <div key={`${route.page}-${route.param ?? ""}-${route.query.toString()}`} className="anim-rise">
          {route.page === "home" && <Home />}
          {route.page === "quiz" && <QuizPage mode={route.query.get("mode") ?? "classic"} cat={route.query.get("cat") ?? undefined} />}
          {route.page === "categories" && <CategoriesPage param={route.param} />}
          {route.page === "explore" && <ExplorePage />}
          {route.page === "profile" && <ProfilePage />}
          {route.page === "leaderboard" && <LeaderboardPage />}
          {route.page === "person" && route.param && <PersonPage id={route.param} />}
          {route.page === "about" && <AboutPage />}
          {route.page === "help" && <HelpPage />}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 mt-20 border-t border-ink-700/60 bg-ink-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-500">{t("footer.about")}</p>
            <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-cream-500/70">{t("footer.note")}</p>
          </div>
          <div>
            <div className="font-display text-[10px] font-black tracking-[0.25em] text-gold-400">{t("footer.modes")}</div>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {[
                { l: t("btn.birthdate"), to: "/quiz?mode=classic" },
                { l: t("btn.daily"), to: "/quiz?mode=daily" },
                { l: t("btn.myBirthday"), to: "/quiz?mode=birthday" },
                { l: t("btn.leaderboard"), to: "/leaderboard" },
              ].map((x) => (
                <button key={x.to + x.l} type="button" onClick={() => go(x.to)} className="text-start text-cream-300 transition-colors hover:text-gold-400">
                  {x.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-display text-[10px] font-black tracking-[0.25em] text-gold-400">{t("footer.top")}</div>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {["football", "iran", "singers", "actors", "scientists", "world"].map((c) => (
                <button key={c} type="button" onClick={() => go(`/categories/${c}`)} className="text-start text-cream-300 transition-colors hover:text-gold-400">
                  {catName(c, lang)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-ink-800 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-[11px] font-semibold text-cream-500">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4">
            <span>© {new Date().getFullYear()} {t("brand")} — {t("footer.rights")}</span>
            <span className="flex items-center gap-4">
              <button type="button" onClick={() => { sfx.play("click"); go("/help"); }} className="inline-flex items-center gap-1.5 font-bold text-cream-300 transition-colors hover:text-gold-400">
                <Ic n="spark" size={12} /> {t("nav.help")}
              </button>
              <button type="button" onClick={() => { sfx.play("click"); go("/about"); }} className="inline-flex items-center gap-1.5 font-bold text-cream-300 transition-colors hover:text-gold-400">
                <Ic n="medal" size={12} /> {t("nav.about")}
              </button>
            </span>
          </div>
        </div>
      </footer>

      <Toasts />
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
