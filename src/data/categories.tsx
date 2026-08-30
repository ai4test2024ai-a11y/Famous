import type { ReactNode } from "react";
import type { Lang } from "../lib/util";

export type ThemeId = "sport" | "cinema" | "music" | "science" | "history" | "iran" | "space";

const img = (id: string) => `https://image.qwenlm.ai/generated-images/${id}/_result.png`;

export const IMG = {
  hero: img("b6940c9c-8b57-4dd0-a019-3ce6b9aa1275"),
  sport: img("67ecd8ca-0a82-442c-81af-259522c1f71a"),
  cinema: img("08be1b50-c7f0-4f79-8190-822b14d5884c"),
  music: img("bdd758cf-9ee6-4e64-a28a-a7ff4c9f0bcb"),
  science: img("364844d8-9c3c-444d-9abb-d32be91bbfbb"),
  history: img("c0ff8b06-4f89-4c96-9113-c190b8c5dae5"),
  iran: img("a7447165-6463-4511-8c58-5bd8d9011426"),
  space: img("5c0f5819-cc1d-4159-a760-0f303e6a6822"),
};

export const THEMES: Record<ThemeId, { c1: string; c2: string; art: string }> = {
  sport: { c1: "#35d07f", c2: "#ffc95c", art: IMG.sport },
  cinema: { c1: "#ff5470", c2: "#ffc95c", art: IMG.cinema },
  music: { c1: "#ff54a8", c2: "#4dffd8", art: IMG.music },
  science: { c1: "#45d4ff", c2: "#9ef7d0", art: IMG.science },
  history: { c1: "#f5ad1d", c2: "#ff8a5c", art: IMG.history },
  iran: { c1: "#35e0d0", c2: "#5b8cff", art: IMG.iran },
  space: { c1: "#8fb7ff", c2: "#ffd98a", art: IMG.space },
};

export interface CatDef {
  id: string;
  name: [string, string, string];
  theme: ThemeId;
  icon: string;
}

export const CATS: CatDef[] = [
  { id: "football", name: ["Football", "فوتبال", "كرة القدم"], theme: "sport", icon: "football" },
  { id: "basketball", name: ["Basketball", "بسکتبال", "كرة السلة"], theme: "sport", icon: "basketball" },
  { id: "tennis", name: ["Tennis", "تنیس", "التنس"], theme: "sport", icon: "tennis" },
  { id: "motorsport", name: ["Racing Drivers", "رانندگان مسابقه", "سائقو السباقات"], theme: "sport", icon: "flag" },
  { id: "boxing", name: ["Boxers", "بوکسورها", "الملاكمون"], theme: "sport", icon: "glove" },
  { id: "athletics", name: ["Athletics", "دو و میدانی", "ألعاب القوى"], theme: "sport", icon: "run" },
  { id: "sport", name: ["More Sports", "ورزش‌های دیگر", "رياضات أخرى"], theme: "sport", icon: "trophy" },
  { id: "actors", name: ["Actors", "بازیگران", "الممثلون"], theme: "cinema", icon: "mask" },
  { id: "actresses", name: ["Actresses", "بازیگران زن", "الممثلات"], theme: "cinema", icon: "star" },
  { id: "directors", name: ["Directors", "کارگردانان", "المخرجون"], theme: "cinema", icon: "clapper" },
  { id: "tv", name: ["TV Personalities", "چهره‌های تلویزیونی", "شخصيات التلفزيون"], theme: "cinema", icon: "tv" },
  { id: "comedians", name: ["Comedians", "کمدین‌ها", "الكوميديون"], theme: "cinema", icon: "laugh" },
  { id: "singers", name: ["Singers", "خوانندگان", "المغنون"], theme: "music", icon: "mic" },
  { id: "musicians", name: ["Musicians", "نوازندگان", "الموسيقيون"], theme: "music", icon: "note" },
  { id: "rappers", name: ["Rappers", "رپرها", "مغني الراب"], theme: "music", icon: "rap" },
  { id: "bands", name: ["Bands", "گروه‌های موسیقی", "الفرق الموسيقية"], theme: "music", icon: "band" },
  { id: "composers", name: ["Composers", "آهنگسازان", "الملحنون"], theme: "music", icon: "piano" },
  { id: "scientists", name: ["Scientists", "دانشمندان", "العلماء"], theme: "science", icon: "flask" },
  { id: "tech", name: ["Technology Figures", "چهره‌های فناوری", "شخصيات التقنية"], theme: "science", icon: "chip" },
  { id: "gaming", name: ["Gaming Personalities", "چهره‌های گیمینگ", "شخصيات الألعاب"], theme: "space", icon: "pad" },
  { id: "internet", name: ["Internet Personalities", "چهره‌های اینترنت", "شخصيات الإنترنت"], theme: "science", icon: "wifi" },
  { id: "astronauts", name: ["Astronauts", "فضانوردان", "رواد الفضاء"], theme: "space", icon: "rocket" },
  { id: "historical", name: ["Historical Figures", "شخصیت‌های تاریخی", "شخصيات تاريخية"], theme: "history", icon: "pillar" },
  { id: "leaders", name: ["World Leaders", "رهبران جهان", "قادة العالم"], theme: "history", icon: "crown" },
  { id: "writers", name: ["Writers", "نویسندگان", "الكتّاب"], theme: "history", icon: "pen" },
  { id: "artists", name: ["Artists", "هنرمندان", "الفنانون"], theme: "history", icon: "palette" },
  { id: "entrepreneurs", name: ["Entrepreneurs", "کارآفرینان", "رواد الأعمال"], theme: "history", icon: "case" },
];

export const SPECIAL_CATS: CatDef[] = [
  { id: "iran", name: ["Famous Iranians", "ایرانیان مشهور", "الإيرانيون المشاهير"], theme: "iran", icon: "star8" },
  { id: "world", name: ["World Famous People", "افراد مشهور جهان", "مشاهير العالم"], theme: "space", icon: "globe" },
];

const CAT_MAP: Record<string, CatDef> = {};
for (const c of [...CATS, ...SPECIAL_CATS]) CAT_MAP[c.id] = c;

export function catDef(id: string): CatDef {
  return CAT_MAP[id] ?? { id, name: [id, id, id], theme: "science", icon: "globe" };
}
export function catName(id: string, lang: Lang): string {
  const d = CAT_MAP[id];
  if (!d) return id;
  return d.name[lang === "en" ? 0 : lang === "fa" ? 1 : 2];
}

/* ---------------- icon set (inline SVG, stroke-based) ---------------- */
const P: Record<string, ReactNode> = {
  football: (<><circle cx="12" cy="12" r="9" /><path d="M12 7.5 16 10.4l-1.5 4.6h-5L8 10.4zM12 3v4.5M16 10.4l4.3-1.5M14.5 15l2.6 3.7M9.5 15l-2.6 3.7M8 10.4 3.7 8.9" /></>),
  basketball: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-3 2.6-3 15.4 0 18M12 3c3 2.6 3 15.4 0 18" /></>),
  tennis: (<><circle cx="12" cy="12" r="9" /><path d="M4.5 5.5c3.5 2.5 3.5 10.5 0 13M19.5 5.5c-3.5 2.5-3.5 10.5 0 13" /></>),
  flag: (<><path d="M5 21V4" /><path d="M5 4h13l-2.5 4L18 12H5" /></>),
  glove: (<><path d="M7 12V6.5a2 2 0 0 1 4 0V11m0-4.5v-1a2 2 0 0 1 4 0V11m0-3a2 2 0 0 1 4 2v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2a2 2 0 0 1 2-4" /></>),
  run: (<><circle cx="14" cy="4.5" r="2" /><path d="m9 21 2.5-5L9 13.5 10 8.5l4-1 2.5 3 3.5 1M10 8.5 6.5 10 5 13m6.5 3.5L13 17l-1 4" /></>),
  trophy: (<><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 5H4.5a3.5 3.5 0 0 0 3.6 3.5M16 5h3.5a3.5 3.5 0 0 1-3.6 3.5M12 13v3m-4 4h8m-6.5 0 .5-4h4l.5 4" /></>),
  mask: (<><path d="M4 5c2.5 1 5 1.5 8 1.5S17.5 6 20 5v7c0 4.5-3.5 8-8 8s-8-3.5-8-8z" /><path d="M8.5 11c.7-.7 1.8-.7 2.5 0M13 11c.7-.7 1.8-.7 2.5 0M8.5 15.5c2 1.5 5 1.5 7 0" /></>),
  star: (<><path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.7l-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z" /></>),
  clapper: (<><rect x="3.5" y="9" width="17" height="11" rx="1" /><path d="m4 9 2-4.5h14L22 9M8.2 4.8 10 9m3.3-4.2L15 9" /></>),
  tv: (<><rect x="3" y="6.5" width="18" height="12" rx="1.5" /><path d="m8.5 3 3.5 3.5L15.5 3" /></>),
  laugh: (<><circle cx="12" cy="12" r="9" /><path d="M7.5 14c1.2 2.3 2.7 3.5 4.5 3.5s3.3-1.2 4.5-3.5zM8 9.5h.01M16 9.5h.01" /></>),
  mic: (<><rect x="9" y="3" width="6" height="10" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21m-3.5 0h7" /></>),
  note: (<><path d="M9 18.5V6l11-2.5V16" /><circle cx="6.5" cy="18.5" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></>),
  rap: (<><path d="M4 14a8 8 0 0 1 16 0" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></>),
  band: (<><path d="m4 20 14.5-14.5M17 4l3 3-2 2-3-3zM6.5 13.5 9 16c-1.5 2-4.5 2.5-5.5 1.5S4.5 15 6.5 13.5z" /></>),
  piano: (<><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M8 5v9M12 5v9M16 5v9" /></>),
  flask: (<><path d="M10 3h4M10.5 3v5.5L5 19a1.6 1.6 0 0 0 1.5 2.3h11A1.6 1.6 0 0 0 19 19l-5.5-10.5V3" /><path d="M7.5 15h9" /></>),
  chip: (<><rect x="7" y="7" width="10" height="10" rx="1.5" /><rect x="10" y="10" width="4" height="4" /><path d="M9 3.5V7M15 3.5V7M9 17v3.5M15 17v3.5M3.5 9H7M3.5 15H7M17 9h3.5M17 15h3.5" /></>),
  pad: (<><path d="M6.5 7h11a4.5 4.5 0 0 1 4.4 5.4l-.8 4a3 3 0 0 1-5.2 1.4L14.5 16h-5l-1.4 1.8a3 3 0 0 1-5.2-1.4l-.8-4A4.5 4.5 0 0 1 6.5 7z" /><path d="M8 10.5v3M6.5 12h3M15.5 10.5h.01M17.5 13h.01" /></>),
  wifi: (<><path d="M3 9.5a13.5 13.5 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9 16.3a4.5 4.5 0 0 1 6 0" /><circle cx="12" cy="19" r="1.2" /></>),
  rocket: (<><path d="M12 15.5c6-4 7.5-9 7-12-3-.5-8 1-12 7" /><path d="M7 10.5 4 13.5l3.5.5M13.5 17l-3 3 .5-3.5M7 10.5 13.5 17M9.5 14.5 7 17" /><circle cx="14.5" cy="9.5" r="1.6" /></>),
  pillar: (<><path d="M4 21h16M5.5 18h13M7 18V9m3.3 9V9m3.4 9V9m3.3 9V9M4.5 9h15L12 4z" /></>),
  crown: (<><path d="m4 8 4 3.5L12 6l4 5.5L20 8l-1.5 10h-13z" /><path d="M8.5 21h7" /></>),
  pen: (<><path d="m14.5 5 4.5 4.5L8 20.5l-5 1 1-5zM12.5 7l4.5 4.5" /></>),
  palette: (<><path d="M12 3a9 9 0 1 0 .5 18c1.8 0 2-1.2 1.2-2.2-.9-1.2-.3-2.8 1.6-2.8H17a4 4 0 0 0 4-4c0-5-4-9-9-9z" /><circle cx="8" cy="10" r="1.1" /><circle cx="12" cy="7.5" r="1.1" /><circle cx="16" cy="10" r="1.1" /></>),
  case: (<><rect x="3.5" y="7.5" width="17" height="12" rx="1.5" /><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M12 11v3" /></>),
  star8: (<><path d="M12 2.5 14 8l5.5-2-2 5.5 5.5 2-5.5 2 2 5.5L14 16l-2 5.5L10 16l-5.5 2 2-5.5-5.5-2 5.5-2-2-5.5L10 8z" /></>),
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18" /></>),
  grid: (<><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></>),
  play: (<><path d="M7 4.5v15l12-7.5z" /></>),
  calendar: (<><rect x="3.5" y="5" width="17" height="15.5" rx="1.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>),
  search: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>),
  user: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.3-3.8 4-5.5 7.5-5.5s6.2 1.7 7.5 5.5" /></>),
  flame: (<><path d="M12 3c.5 3-1.5 4.5-2.8 6C7.7 10.8 7 12.4 7 14a5 5 0 0 0 10 0c0-2.5-1.3-4.2-2.5-5.8C13.3 6.5 12.5 5 12 3z" /><path d="M12 21a2.7 2.7 0 0 1-2.7-2.7c0-1.5 1.2-2.4 2.7-4 1.5 1.6 2.7 2.5 2.7 4A2.7 2.7 0 0 1 12 21z" /></>),
  check: (<><path d="m4.5 12.5 5 5L19.5 7" /></>),
  x: (<><path d="m6 6 12 12M18 6 6 18" /></>),
  chev: (<><path d="m6 9 6 6 6-6" /></>),
  vol: (<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5zM15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /></>),
  volOff: (<><path d="M4 9.5v5h3.5L12 19V5L7.5 9.5zM16 9.5l5 5M21 9.5l-5 5" /></>),
  bolt: (<><path d="M13 2.5 4.5 13.5H11l-1 8L18.5 10H12z" /></>),
  gem: (<><path d="m7 3.5 10 0 4 5.5-9 11.5L3 9zM3 9h18M9.5 3.5 8 9l4 11.5L16 9l-1.5-5.5" /></>),
  medal: (<><circle cx="12" cy="14.5" r="5.5" /><path d="m8.5 10.5-3-7M15.5 10.5l3-7M8 3.5h8M12 12l1 2 2 .3-1.5 1.4.4 2.1-1.9-1-1.9 1 .4-2.1L9 14.3 11 14z" /></>),
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 6.5V12l3.5 2.5" /></>),
  edit: (<><path d="M12 20h8M16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1 1-4z" /></>),
  lock: (<><rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>),
  spark: (<><path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" /></>),
  refresh: (<><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3.5V8h-4.5" /></>),
  target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" /></>),
  arrow: (<><path d="M4 12h16M14 6l6 6-6 6" /></>),
  home: (<><path d="m4 11 8-7 8 7v9.5a1 1 0 0 1-1 1h-4.5V15h-5v6.5H5a1 1 0 0 1-1-1z" /></>),
  list: (<><path d="M8.5 6h12M8.5 12h12M8.5 18h12" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>),
};

export function Ic({ n, size = 18, className = "" }: { n: string; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      {P[n] ?? P.globe}
    </svg>
  );
}
