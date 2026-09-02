/* Scalable extended registry — ~96,000 deterministic generated records.
   Nothing is materialized in memory: records are decoded on demand by index,
   which is what keeps a 100k-scale database instant in the browser. */

import type { Person } from "./people";
import { PEOPLE } from "./people";
import { mulberry32, hashStr } from "../lib/util";

export const REG_CATS = ["football", "basketball", "actors", "singers", "athletics"] as const;
const DECADES = [1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000];

interface Pool { cc: string; f: string[]; l: string[]; }

const POOLS: Pool[] = [
  { cc: "BR", f: ["Lucas","Mateus","Gabriel","Rafael","Thiago","Bruno","Camila","Larissa","Felipe","Gustavo"], l: ["Silva","Santos","Oliveira","Souza","Costa","Pereira","Almeida","Nascimento","Lima","Araújo","Ribeiro","Carvalho"] },
  { cc: "AR", f: ["Javier","Matías","Santiago","Nicolás","Agustín","Leandro","Valentina","Julieta","Facundo","Gonzalo"], l: ["Fernández","González","Rodríguez","Martínez","Díaz","Romero","Sosa","Molina","Castro","Ríos","Vega","Herrera"] },
  { cc: "DE", f: ["Lukas","Jonas","Felix","Leon","Maximilian","Hannah","Emma","Lena","Nils","Moritz"], l: ["Müller","Schmidt","Schneider","Fischer","Weber","Wagner","Becker","Hoffmann","Schulz","Koch","Richter","Klein"] },
  { cc: "ES", f: ["Pablo","Alejandro","Daniel","Adrián","Sergio","Lucía","María","Carmen","Javier","Diego"], l: ["García","Martínez","López","Sánchez","Pérez","Gómez","Torres","Navarro","Moreno","Ortega","Vargas","Ramos"] },
  { cc: "FR", f: ["Louis","Gabriel","Raphaël","Arthur","Jules","Chloé","Léa","Manon","Hugo","Nathan"], l: ["Martin","Bernard","Dubois","Thomas","Robert","Richard","Petit","Durand","Leroy","Moreau","Simon","Laurent"] },
  { cc: "GB", f: ["Oliver","Harry","George","Jack","Charlie","Amelia","Isla","Freya","Alfie","Theo"], l: ["Smith","Jones","Taylor","Brown","Wilson","Evans","Davies","Walker","Wright","Robinson","Clarke","Hall"] },
  { cc: "IT", f: ["Luca","Marco","Alessandro","Matteo","Federico","Giulia","Sofia","Chiara","Andrea","Davide"], l: ["Rossi","Russo","Ferrari","Esposito","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo"] },
  { cc: "PT", f: ["João","Miguel","Diogo","Tiago","Rui","Beatriz","Inês","Mariana","Pedro","André"], l: ["Silva","Sousa","Pereira","Costa","Ferreira","Alves","Rocha","Carvalho","Ribeiro","Martins","Correia","Nunes"] },
  { cc: "NL", f: ["Daan","Sem","Lucas","Levi","Bram","Sanne","Fleur","Lotte","Jesse","Ruben"], l: ["de Jong","Jansen","Visser","Bakker","Smit","Meijer","Mulder","Bos","Peters","Hendriks","Dekker","Vos"] },
  { cc: "US", f: ["Tyler","Brandon","Austin","Dylan","Cole","Madison","Brittany","Kayla","Trevor","Spencer"], l: ["Johnson","Williams","Miller","Davis","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia"] },
  { cc: "MX", f: ["José","Luis","Carlos","Miguel","Alejandro","Guadalupe","Fernanda","Daniela","Ricardo","Raúl"], l: ["Hernández","García","Martínez","López","González","Pérez","Sánchez","Ramírez","Torres","Flores","Rivera","Cruz"] },
  { cc: "JP", f: ["Haruto","Yuto","Sota","Riku","Kaito","Yui","Hina","Sakura","Ren","Itsuki"], l: ["Sato","Suzuki","Takahashi","Tanaka","Watanabe","Ito","Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Yamada"] },
  { cc: "KR", f: ["Minjun","Seojun","Doyun","Jihoon","Hyunwoo","Seoyeon","Jiwoo","Haeun","Minseo","Yejun"], l: ["Kim","Lee","Park","Choi","Jung","Kang","Cho","Yoon","Jang","Lim","Han","Oh"] },
  { cc: "IN", f: ["Arjun","Vikram","Rohan","Aditya","Karan","Priya","Ananya","Ishita","Nikhil","Siddharth"], l: ["Sharma","Patel","Singh","Kumar","Reddy","Verma","Gupta","Mehta","Iyer","Nair","Joshi","Kapoor"] },
  { cc: "TR", f: ["Emre","Burak","Kaan","Mert","Baran","Elif","Zeynep","Ayşe","Deniz","Okan"], l: ["Yılmaz","Kaya","Demir","Çelik","Şahin","Yıldız","Yıldırım","Öztürk","Aydın","Özdemir","Arslan","Doğan"] },
  { cc: "EG", f: ["Ahmed","Mohamed","Omar","Youssef","Karim","Fatma","Nour","Salma","Mostafa","Tarek"], l: ["Hassan","Hussein","Ibrahim","Mahmoud","Abdelrahman","El-Sayed","Ali","Mansour","Farouk","Adel","Samir","Fathy"] },
  { cc: "NG", f: ["Chinedu","Emeka","Obinna","Adebayo","Tunde","Amara","Ngozi","Yetunde","Kelechi","Femi"], l: ["Okafor","Okeke","Eze","Obi","Adeyemi","Balogun","Olawale","Nwosu","Okonkwo","Abubakar","Bello","Danjuma"] },
  { cc: "MA", f: ["Yassine","Mehdi","Amine","Omar","Reda","Salma","Yasmine","Imane","Hamza","Anas"], l: ["El Amrani","Benali","Alaoui","Tazi","Bennis","Chraibi","El Fassi","Berrada","Lahlou","Sefrioui","Bouzidi","Kabbaj"] },
  { cc: "AU", f: ["Liam","Noah","Jackson","Lachlan","Blake","Charlotte","Ruby","Sienna","Cooper","Riley"], l: ["Williams","Jones","Wilson","Taylor","Martin","White","Harris","Clark","Lewis","Young","King","Mitchell"] },
  { cc: "SE", f: ["Erik","Oscar","Hugo","Axel","Nils","Astrid","Elsa","Saga","Filip","Viktor"], l: ["Andersson","Johansson","Karlsson","Nilsson","Eriksson","Larsson","Olsson","Persson","Svensson","Gustafsson","Pettersson","Jonsson"] },
];

const NCATS = REG_CATS.length;
const NERAS = DECADES.length;
const BLOCK = NCATS * NERAS; // per name-pair

interface CountryMeta { pre: number; pairs: number; }
const META: CountryMeta[] = [];
let running = 0;
for (const pool of POOLS) {
  META.push({ pre: running, pairs: pool.f.length * pool.l.length });
  running += pool.f.length * pool.l.length * BLOCK;
}

export const REGISTRY_TOTAL = running;
export const DB_TOTAL = REGISTRY_TOTAL + PEOPLE.length;

function decode(idx: number): Person {
  let lo = 0;
  let hi = META.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (META[mid].pre <= idx) lo = mid;
    else hi = mid - 1;
  }
  const pool = POOLS[lo];
  const rem = idx - META[lo].pre;
  const cat = rem % NCATS;
  const era = Math.floor(rem / NCATS) % NERAS;
  const pair = Math.floor(rem / BLOCK);
  const fi = pair % pool.f.length;
  const li = Math.floor(pair / pool.f.length);
  const rng = mulberry32(hashStr(`reg-${idx}`));
  const year = DECADES[era] + Math.floor(rng() * 10);
  const month = 1 + Math.floor(rng() * 12);
  const day = 1 + Math.floor(rng() * 28);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return {
    id: `r${idx}`,
    en: `${pool.f[fi]} ${pool.l[li]}`,
    fa: "",
    ar: "",
    dob: `${year}-${mm}-${dd}`,
    cc: pool.cc,
    cat: REG_CATS[cat],
    pop: rng() < 0.3 ? 2 : 1,
    diff: 2 + Math.floor(rng() * 3),
    reg: true,
  };
}

export interface RegFilter { cat?: string; cc?: string; q?: string; }

export function countRegistry(f: RegFilter): number {
  if (!f.cat && !f.cc && !f.q) return REGISTRY_TOTAL;
  let n = 0;
  const q = f.q ? f.q.trim().toLowerCase() : "";
  for (let i = 0; i < REGISTRY_TOTAL; i++) {
    const p = decode(i);
    if (f.cat && p.cat !== f.cat) continue;
    if (f.cc && p.cc !== f.cc) continue;
    if (q && !p.en.toLowerCase().includes(q)) continue;
    n++;
  }
  return n;
}

export function pageRegistry(offset: number, limit: number, f: RegFilter = {}): Person[] {
  const out: Person[] = [];
  const q = f.q ? f.q.trim().toLowerCase() : "";
  if (!f.cat && !f.cc && !q) {
    const end = Math.min(offset + limit, REGISTRY_TOTAL);
    for (let i = offset; i < end; i++) out.push(decode(i));
    return out;
  }
  let seen = 0;
  for (let i = 0; i < REGISTRY_TOTAL && out.length < limit; i++) {
    const p = decode(i);
    if (f.cat && p.cat !== f.cat) continue;
    if (f.cc && p.cc !== f.cc) continue;
    if (q && !p.en.toLowerCase().includes(q)) continue;
    if (seen >= offset) out.push(p);
    seen++;
  }
  return out;
}
