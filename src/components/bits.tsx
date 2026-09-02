import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import confetti from "canvas-confetti";
import { useApp } from "../state/store";
import type { Person } from "../data/people";
import { localizedName, rarityOf } from "../data/people";
import { catDef, catName, Ic, THEMES } from "../data/categories";
import type { ThemeId } from "../data/categories";
import { countryCode3 } from "../i18n";
import { hashStr, initialsOf } from "../lib/util";

export const RARITY_COLOR: Record<number, string> = {
  1: "#8fb7ff",
  2: "#4dffd8",
  3: "#ffc95c",
  4: "#ff5470",
};

export function themeIdOf(p: Person): ThemeId {
  if (p.iran) return "iran";
  return catDef(p.cat).theme;
}

/* ---------------- ambient particles ---------------- */
export function ParticlesBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const COLORS = ["rgba(255,201,92,", "rgba(77,255,216,", "rgba(255,84,112,", "rgba(143,183,255,"];
    interface Dot { x: number; y: number; r: number; vx: number; vy: number; c: string; a: number; tw: number; }
    let dots: Dot[] = [];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(70, Math.floor(w / 22));
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.08 - Math.random() * 0.25,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: 0.15 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2,
      }));
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy; d.tw += 0.02;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `${d.c}${alpha.toFixed(3)})`;
        ctx.shadowColor = `${d.c}0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    if (reduced) draw(0);
    else raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

/* ---------------- logo ---------------- */
export function Logo({ compact = false }: { compact?: boolean }) {
  const { t } = useApp();
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <svg width={compact ? 34 : 40} height={compact ? 34 : 40} viewBox="0 0 48 48" className="shrink-0" aria-hidden>
        <path d="M24 3 42 13v22L24 45 6 35V13Z" fill="none" stroke="#f5ad1d" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="m24 12 3.1 6.4 7 .9-5.1 4.9 1.3 7L24 27.9l-6.3 3.3 1.3-7-5.1-4.9 7-.9Z" fill="#f5ad1d" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" fill="none" stroke="#1fe0bd" strokeWidth="1.4" opacity="0.75" transform="rotate(-18 24 24)" />
      </svg>
      <div className="hidden min-w-0 leading-none min-[430px]:block">
        <div className="font-display font-black tracking-tight text-cream-100 text-[10px] sm:text-[13px] lg:text-[15px] leading-tight">
          {t("brand")}
        </div>
        {!compact && (
          <div className="mt-1 hidden text-[8.5px] font-bold tracking-[0.18em] text-gold-400 lg:block">
            {t("brand.sub")}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- procedural AI-style portrait ---------------- */
function Pattern({ seed, color }: { seed: number; color: string }) {
  const kind = seed % 3;
  if (kind === 0) {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.13]" aria-hidden>
        {Array.from({ length: 7 }, (_, i) => (
          <circle key={i} cx="50%" cy="34%" r={`${8 + i * 9}%`} fill="none" stroke={color} strokeWidth="1" />
        ))}
      </svg>
    );
  }
  if (kind === 1) {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={`${i * 14 - 10}%`} y1="110%" x2={`${i * 14 + 30}%`} y2="-10%" stroke={color} strokeWidth="1.2" />
        ))}
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.14]" aria-hidden>
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 4 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={`${12 + c * 25}%`} cy={`${12 + r * 20}%`} r="1.6" fill={color} />
        ))
      )}
    </svg>
  );
}

export function Portrait({
  person, className = "", monogram = "text-3xl", art = true,
}: {
  person: Person; className?: string; monogram?: string; art?: boolean;
}) {
  const theme = THEMES[themeIdOf(person)];
  const h = hashStr(person.id);
  const rarity = rarityOf(person);
  const rc = RARITY_COLOR[rarity];
  return (
    <div
      className={`relative overflow-hidden bg-ink-800 ${className}`}
      style={{
        ["--g1" as string]: `${theme.c1}66`,
        ["--g2" as string]: `${theme.c2}55`,
        background: `linear-gradient(160deg, ${theme.c1}30, #0b1826 55%, ${theme.c2}22)`,
      } as CSSProperties}
    >
      {art && (
        <img
          src={theme.art}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          draggable={false}
        />
      )}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, transparent 20%, rgba(5,11,18,0.55) 70%, rgba(5,11,18,0.9))` }}
      />
      <Pattern seed={h} color={theme.c2} />
      {/* stylized bust */}
      <svg
        viewBox="0 0 100 120"
        className="absolute inset-x-0 bottom-0 mx-auto h-[82%] max-w-none"
        style={{ filter: `drop-shadow(0 0 14px ${theme.c1}55)` }}
        aria-hidden
      >
        <defs>
          <linearGradient id={`bg-${person.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.c1} />
            <stop offset="100%" stopColor="#0b1826" />
          </linearGradient>
          <linearGradient id={`bh-${person.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={theme.c2} />
            <stop offset="100%" stopColor={theme.c1} />
          </linearGradient>
        </defs>
        <path d="M10 122 C10 90 28 74 50 74 C72 74 90 90 90 122 Z" fill={`url(#bg-${person.id})`} opacity="0.96" />
        <path d="M10 122 C10 90 28 74 50 74 C72 74 90 90 90 122" fill="none" stroke={theme.c2} strokeWidth="1.6" opacity="0.55" />
        <circle cx="50" cy="42" r="19" fill={`url(#bh-${person.id})`} opacity="0.97" />
        <circle cx="50" cy="42" r="19" fill="none" stroke={theme.c2} strokeWidth="1.4" opacity="0.5" />
        <path d="M36 30 A19 19 0 0 1 62 28" fill="none" stroke="#ffffff" strokeWidth="1.4" opacity="0.35" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-display font-black select-none ${monogram}`}
          style={{ color: "#ffffff", opacity: 0.85, textShadow: `0 2px 18px ${theme.c1}aa, 0 0 40px rgba(5,11,18,0.8)` }}
        >
          {initialsOf(person.en)}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1.5px ${rc}55, inset 0 0 34px rgba(5,11,18,0.5)` }} />
      {/* corner brackets */}
      <span className="pointer-events-none absolute top-1.5 start-1.5 h-3 w-3 border-t-2 border-s-2" style={{ borderColor: rc }} />
      <span className="pointer-events-none absolute top-1.5 end-1.5 h-3 w-3 border-t-2 border-e-2" style={{ borderColor: rc }} />
      <span className="pointer-events-none absolute bottom-1.5 start-1.5 h-3 w-3 border-b-2 border-s-2" style={{ borderColor: rc }} />
      <span className="pointer-events-none absolute bottom-1.5 end-1.5 h-3 w-3 border-b-2 border-e-2" style={{ borderColor: rc }} />
    </div>
  );
}

/* ---------------- tilt wrapper ---------------- */
export function Tilt({ children, className = "", max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(760px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg) translateY(-4px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- person card ---------------- */
export function PersonCard({
  person, onClick, size = "md",
}: {
  person: Person; onClick?: () => void; size?: "sm" | "md" | "lg";
}) {
  const { lang, t } = useApp();
  const theme = THEMES[themeIdOf(person)];
  const rarity = rarityOf(person);
  const rc = RARITY_COLOR[rarity];
  const cat = catDef(person.cat);
  return (
    <Tilt className="h-full">
      <button
        type="button"
        onClick={onClick}
        className={`card-glow clip-card group relative block h-full w-full text-start transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${size === "sm" ? "" : "cursor-pointer"}`}
        style={{ ["--g1" as string]: `${theme.c1}88`, ["--g2" as string]: `${theme.c2}77` } as CSSProperties}
      >
        <Portrait person={person} className={size === "lg" ? "aspect-[3/4.1]" : "aspect-[3/4]"} monogram={size === "lg" ? "text-6xl" : size === "sm" ? "text-xl" : "text-3xl"} />
        <span
          className="clip-tag absolute top-2.5 start-2.5 z-10 px-2 py-0.5 pe-3 font-display text-[8px] font-bold tracking-[0.18em]"
          style={{ background: `${rc}22`, color: rc, boxShadow: `inset 0 0 0 1px ${rc}66` }}
        >
          {t(`rarity.${rarity}`)}
        </span>
        <span className="absolute top-2.5 end-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "rgba(5,11,18,0.6)", color: theme.c2 }}>
          <Ic n={cat.icon} size={13} />
        </span>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-3">
          <div className="font-display text-[13px] font-bold leading-snug text-cream-50 [text-shadow:0_2px_10px_rgba(5,11,18,0.9)]">
            {localizedName(person, lang)}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-cream-300">
            <span className="rounded-sm bg-ink-900/80 px-1.5 py-0.5 text-gold-300">{countryCode3(person.cc)}</span>
            <span className="rounded-sm bg-ink-900/80 px-1.5 py-0.5">{catName(person.cat, lang)}</span>
            {person.iran && <span className="rounded-sm bg-mint-500/15 px-1.5 py-0.5 text-mint-400">IRI</span>}
          </div>
        </div>
      </button>
    </Tilt>
  );
}

/* ---------------- misc ---------------- */
export function RingProgress({
  value, size = 92, stroke = 8, color = "#f5ad1d", children,
}: {
  value: number; size?: number; stroke?: number; color?: string; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(77,115,150,0.25)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function SectionHead({ title, sub, icon }: { title: string; sub?: string; icon?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center bg-gold-500/15 text-gold-400 clip-card-sm">
              <Ic n={icon} size={17} />
            </span>
          )}
          <h2 className="font-display text-lg sm:text-2xl font-black tracking-tight text-cream-50">{title}</h2>
        </div>
        {sub && <p className="mt-1.5 text-sm text-cream-500">{sub}</p>}
      </div>
      <span className="hidden sm:block h-[3px] w-16 bg-gradient-to-r from-gold-500 to-transparent" />
    </div>
  );
}

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed z-[90] flex flex-col gap-2.5 start-4 end-4 sm:start-5 sm:end-auto" style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}>
      {toasts.map((toast) => (
        <div key={toast.id} className="anim-pop glass clip-card-sm flex items-center gap-3 px-4 py-3 shadow-xl shadow-black/40 sm:min-w-[240px] max-w-full sm:max-w-[320px]">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center clip-card-sm ${toast.kind === "ach" ? "bg-gold-500/20 text-gold-400" : toast.kind === "level" ? "bg-mint-500/20 text-mint-400" : "bg-coral-500/20 text-coral-400"}`}>
            <Ic n={toast.kind === "ach" ? "medal" : toast.kind === "level" ? "bolt" : "spark"} size={18} />
          </span>
          <div className="min-w-0">
            <div className="font-display text-[11px] font-bold tracking-wide text-cream-50">{toast.title}</div>
            {toast.sub && <div className="mt-0.5 truncate text-xs text-cream-300">{toast.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function fireConfetti(big = false) {
  const colors = ["#ffc95c", "#ff5470", "#4dffd8", "#8fb7ff", "#f3ecda"];
  const base = { colors, disableForReducedMotion: true, zIndex: 80 };
  confetti({ ...base, particleCount: big ? 90 : 45, spread: 70, origin: { x: 0.5, y: 0.7 }, scalar: big ? 1.1 : 0.9 });
  if (big) {
    window.setTimeout(() => confetti({ ...base, particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 200);
    window.setTimeout(() => confetti({ ...base, particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 380);
  }
}
