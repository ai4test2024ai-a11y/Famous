import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import type { Person, Lang } from "../data/people";
import { catDef, localizedName, countryCode3, initialsOf } from "../data/people";
import { useApp } from "../state/store";

/* ---------------- inline SVG icons ---------------- */
const P: Record<string, ReactNode> = {
  football: (<><circle cx="12" cy="12" r="9" /><path d="M12 7.5 16 10.4l-1.5 4.6h-5L8 10.4zM12 3v4.5M16 10.4l4.3-1.5M14.5 15l2.6 3.7M9.5 15l-2.6 3.7M8 10.4 3.7 8.9" /></>),
  basketball: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-3 2.6-3 15.4 0 18M12 3c3 2.6 3 15.4 0 18" /></>),
  tennis: (<><circle cx="12" cy="12" r="9" /><path d="M4.5 5.5c3.5 2.5 3.5 10.5 0 13M19.5 5.5c-3.5 2.5-3.5 10.5 0 13" /></>),
  flag: (<><path d="M5 21V4" /><path d="M5 4h13l-2.5 4L18 12H5" /></>),
  glove: (<><path d="M7 12V6.5a2 2 0 0 1 4 0V11m0-4.5v-1a2 2 0 0 1 4 0V11m0-3a2 2 0 0 1 4 2v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-4" /></>),
  run: (<><circle cx="14" cy="4.5" r="2" /><path d="m9 21 2.5-5L9 13.5 10 8.5l4-1 2.5 3 3.5 1M10 8.5 6.5 10 5 13m6.5 3.5L13 17l-1 4" /></>),
  mask: (<><path d="M4 5c2.5 1 5 1.5 8 1.5S17.5 6 20 5v7c0 4.5-3.5 8-8 8s-8-3.5-8-8z" /><path d="M8.5 11c.7-.7 1.8-.7 2.5 0M13 11c.7-.7 1.8-.7 2.5 0M8.5 15.5c2 1.5 5 1.5 7 0" /></>),
  star: (<><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.7l-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z" /></>),
  mic: (<><rect x="9" y="3" width="6" height="10" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21m-3.5 0h7" /></>),
  rap: (<><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>),
  piano: (<><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M8 5v9M12 5v9M16 5v9" /></>),
  flask: (<><path d="M10 3h4M10.5 3v5.5L5 19a1.6 1.6 0 0 0 1.5 2.3h11A1.6 1.6 0 0 0 19 19l-5.5-10.5V3" /><path d="M7.5 15h9" /></>),
  chip: (<><rect x="7" y="7" width="10" height="10" rx="1.5" /><rect x="10" y="10" width="4" height="4" /><path d="M9 3.5V7M15 3.5V7M9 17v3.5M15 17v3.5M3.5 9H7M3.5 15H7M17 9h3.5M17 15h3.5" /></>),
  case: (<><rect x="3.5" y="7.5" width="17" height="12" rx="1.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M12 11v3" /></>),
  pillar: (<><path d="M4 21h16M5.5 18h13M7 18V9m3.3 9V9m3.4 9V9m3.3 9V9M4.5 9h15L12 4z" /></>),
  crown: (<><path d="m4 8 4 3.5L12 6l4 5.5L20 8l-1.5 10h-13z" /><path d="M8.5 21h7" /></>),
  pen: (<><path d="m14.5 5 4.5 4.5L8 20.5l-5 1 1-5zM12.5 7l4.5 4.5" /></>),
  palette: (<><path d="M12 3a9 9 0 1 0 .5 18c1.8 0 2-1.2 1.2-2.2-.9-1.2-.3-2.8 1.6-2.8H17a4 4 0 0 0 4-4c0-5-4-9-9-9z" /><circle cx="8" cy="10" r="1.1" /><circle cx="12" cy="7.5" r="1.1" /><circle cx="16" cy="10" r="1.1" /></>),
  rocket: (<><path d="M12 15.5c6-4 7.5-9 7-12-3-.5-8 1-12 7" /><path d="M7 10.5 4 13.5l3.5.5M13.5 17l-3 3 .5-3.5M7 10.5 13.5 17M9.5 14.5 7 17" /><circle cx="14.5" cy="9.5" r="1.6" /></>),
  laugh: (<><circle cx="12" cy="12" r="9" /><path d="M7.5 14c1.2 2.3 2.7 3.5 4.5 3.5s3.3-1.2 4.5-3.5zM8 9.5h.01M16 9.5h.01" /></>),
  wifi: (<><path d="M3 9.5a13.5 13.5 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9 16.3a4.5 4.5 0 0 1 6 0" /><circle cx="12" cy="19" r="1.2" /></>),
  play: (<><path d="M7 4.5v15l12-7.5z" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.3-3.8 4-5.5 7.5-5.5s6.2 1.7 7.5 5.5" /></>),
  trophy: (<><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 5H4.5a3.5 3.5 0 0 0 3.6 3.5M16 5h3.5a3.5 3.5 0 0 1-3.6 3.5M12 13v3m-4 4h8m-6.5 0 .5-4h4l.5 4" /></>),
  flame: (<><path d="M12 3c.5 3-1.5 4.5-2.8 6C7.7 10.8 7 12.4 7 14a5 5 0 0 0 10 0c0-2.5-1.3-4.2-2.5-5.8C13.3 6.5 12.5 5 12 3z" /><path d="M12 21a2.7 2.7 0 0 1-2.7-2.7c0-1.5 1.2-2.4 2.7-4 1.5 1.6 2.7 2.5 2.7 4A2.7 2.7 0 0 1 12 21z" /></>),
  check: (<><path d="m4.5 12.5 5 5L19.5 7" /></>),
  x: (<><path d="m6 6 12 12M18 6 6 18" /></>),
  chev: (<><path d="m6 9 6 6 6-6" /></>),
  vol: (<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></>),
  volOff: (<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5" /></>),
  bolt: (<><path d="M13 2.5 4.5 13.5H11l-1 8L18.5 10H12z" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 6.5V12l3.5 2.5" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" /></>),
  grid: (<><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></>),
  home: (<><path d="m4 11 8-7 8 7v9.5a1 1 0 0 1-1 1h-4.5V15h-5v6.5H5a1 1 0 0 1-1-1z" /></>),
  list: (<><path d="M8.5 6h12M8.5 12h12M8.5 18h12" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>),
  refresh: (<><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5" /></>),
  arrow: (<><path d="M4 12h16M14 6l6 6-6 6" /></>),
  spark: (<><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" /></>),
  medal: (<><circle cx="12" cy="14.5" r="5.5" /><path d="m8.5 10.5-3-7M15.5 10.5l3-7M8 3.5h8M12 12l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 14.3 11 14z" /></>),
  lock: (<><rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>),
  edit: (<><path d="M12 20h8M16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4z" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>),
  skip: (<><path d="M6 5v14l8-7zM16 5h2.5v14H16z" /></>),
  eye: (<><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>),
};

export function Ic({ n, size = 18, className = "" }: { n: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden>
      {P[n] ?? P.star}
    </svg>
  );
}

/* ---------------- rarity ---------------- */
export const RARITY_COLOR = (pop: number) =>
  pop >= 5 ? "#f5ad1d" : pop === 4 ? "#ff5470" : pop === 3 ? "#1fe0bd" : "#8fb7ff";

/* ---------------- procedural portrait (never breaks) ---------------- */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export function Portrait({ person, className = "", monogram = "text-2xl", mystery = false }: {
  person: Person; className?: string; monogram?: string; mystery?: boolean;
}) {
  const theme = catDef(person.cat);
  const rc = RARITY_COLOR(person.pop);
  const h = hashStr(person.id);
  const grad = `pg-${h}`;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(160deg, ${theme.c1}33, #0b1826 55%, ${theme.c2}22)` } as CSSProperties}
      aria-hidden
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.13]">
        {Array.from({ length: 6 }, (_, i) => (
          <circle key={i} cx="50%" cy="34%" r={`${10 + i * 10}%`} fill="none" stroke={theme.c2} strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 25%, rgba(5,11,18,0.5) 70%, rgba(5,11,18,0.92))" }} />
      <svg viewBox="0 0 100 120" className="absolute inset-x-0 bottom-0 mx-auto h-[82%] max-w-none" style={{ filter: `drop-shadow(0 0 12px ${theme.c1}55)` }}>
        <defs>
          <linearGradient id={`${grad}-b`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mystery ? "#4d7396" : theme.c1} />
            <stop offset="100%" stopColor="#0b1826" />
          </linearGradient>
          <linearGradient id={`${grad}-h`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={mystery ? "#6a8fb0" : theme.c2} />
            <stop offset="100%" stopColor={mystery ? "#4d7396" : theme.c1} />
          </linearGradient>
        </defs>
        <path d="M10 122 C10 90 28 74 50 74 C72 74 90 90 90 122 Z" fill={`url(#${grad}-b)`} opacity="0.96" />
        <circle cx="50" cy="42" r="19" fill={`url(#${grad}-h)`} opacity="0.97" />
        <circle cx="50" cy="42" r="19" fill="none" stroke={mystery ? "#6a8fb0" : theme.c2} strokeWidth="1.4" opacity="0.5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-display font-black select-none ${monogram}`}
          style={{ color: "#fff", opacity: 0.9, textShadow: `0 2px 16px ${theme.c1}aa, 0 0 34px rgba(5,11,18,0.8)` }}>
          {mystery ? "?" : initialsOf(person.en)}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: `inset 0 0 0 1.5px ${rc}55, inset 0 0 30px rgba(5,11,18,0.5)` }} />
    </div>
  );
}

/* ---------------- person card ---------------- */
export function PersonCard({ person, onClick }: { person: Person; onClick?: () => void }) {
  const { lang } = useApp();
  const theme = catDef(person.cat);
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`card group clip-card relative block w-full overflow-hidden text-start transition-transform duration-200 ${onClick ? "cursor-pointer hover:-translate-y-1" : ""}`}
      style={{ background: "#0b1826" }}
    >
      <Portrait person={person} className="aspect-[3/4] w-full" monogram="text-xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-2.5">
        <div className="font-display text-[12px] font-bold leading-snug text-cream-50 [text-shadow:0_2px_10px_rgba(5,11,18,0.9)]">
          {localizedName(person, lang)}
        </div>
        <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-cream-300">
          <span className="rounded-sm bg-ink-900/80 px-1.5 py-0.5 text-gold-300">{countryCode3(person.cc)}</span>
          <span className="rounded-sm bg-ink-900/80 px-1.5 py-0.5" style={{ color: theme.c2 }}>{catDef(person.cat).name[lang === "en" ? 0 : lang === "fa" ? 1 : 2]}</span>
        </div>
      </div>
      <span className="absolute top-1.5 end-1.5 z-10 rounded-sm px-1.5 py-0.5 font-display text-[8px] font-black text-ink-950" style={{ background: RARITY_COLOR(person.pop) }}>
        {"★".repeat(Math.max(1, person.pop))}
      </span>
    </Comp>
  );
}

/* ---------------- logo ---------------- */
export function Logo({ size = 38 }: { size?: number }) {
  const { t } = useApp();
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0" aria-hidden>
        <path d="M24 3 42 13v22L24 45 6 35V13Z" fill="none" stroke="#f5ad1d" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="m24 12 3.1 6.4 7 .9-5.1 4.9 1.3 7L24 27.9l-6.3 3.3 1.3-7-5.1-4.9 7-.9Z" fill="#f5ad1d" />
        <ellipse cx="24" cy="24" rx="19" ry="7.5" fill="none" stroke="#1fe0bd" strokeWidth="1.4" opacity="0.75" transform="rotate(-18 24 24)" />
      </svg>
      <div className="min-w-0 leading-none">
        <div className="font-display font-black tracking-tight text-cream-100 text-[13px] sm:text-[15px] leading-tight truncate max-w-[180px] sm:max-w-none">
          {t("brand")}
        </div>
        <div className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-[0.28em] text-gold-400">{t("brand.sub")}</div>
      </div>
    </div>
  );
}

/* ---------------- ambient particles (canvas, DPR-aware, cleaned up) ---------------- */
export function ParticlesBg() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const N = 40;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.0004, vy: -0.0002 - Math.random() * 0.0005,
      c: ["245,173,29", "31,224,189", "143,183,255", "255,84,112"][Math.floor(Math.random() * 4)],
      a: 0.12 + Math.random() * 0.25,
    }));
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill();
      }
      return () => window.removeEventListener("resize", resize);
    }
    const step = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.a})`; ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

/* ---------------- lightweight confetti ---------------- */
export function fireConfetti(big = false) {
  try {
    const n = big ? 140 : 70;
    const colors = ["#f5ad1d", "#1fe0bd", "#ff5470", "#8fb7ff", "#ffd98a", "#4dffd8"];
    const pieces = Array.from({ length: n }, () => ({
      x: 50 + (Math.random() - 0.5) * 30,
      y: 40 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 2.4,
      vy: -3 - Math.random() * 4,
      r: 3 + Math.random() * 5,
      c: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360, vr: (Math.random() - 0.5) * 14,
    }));
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;z-index:95;pointer-events:none;";
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px`;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    ctx.scale(dpr, dpr);
    const t0 = performance.now();
    const step = (t: number) => {
      const el = t - t0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of pieces) {
        p.x += p.vx; p.vy += 0.12; p.y += p.vy * 0.6; p.rot += p.vr;
        ctx.save();
        ctx.translate((p.x / 100) * window.innerWidth, (p.y / 100) * window.innerHeight);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
      }
      if (el < 2200) requestAnimationFrame(step);
      else canvas.remove();
    };
    requestAnimationFrame(step);
  } catch { /* ignore */ }
}

/* ---------------- progress ring ---------------- */
export function Ring({ value, size = 84, stroke = 7, color = "#1fe0bd", children }: {
  value: number; size?: number; stroke?: number; color?: string; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, value)) / 100);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(77,115,150,0.25)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
      </svg>
      <div className="absolute text-center">{children}</div>
    </div>
  );
}
