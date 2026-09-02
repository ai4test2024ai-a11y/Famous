/* ============================================================
   FAMOUS PEOPLE DATABASE
   ------------------------------------------------------------
   Each person has ONE unique id used across every language.
   To add a person, append one `p(...)` line — nothing else needed.
   The quiz engine, search, profiles and hints all pick it up
   automatically, so the list can grow to 500 / 1000+ easily.

   p(id, en, fa, ar, dob, cc, cat, pop, diff, famous, iran?)
     dob  : "YYYY-MM-DD"  (only month-day is used by the game)
     cc   : country code (see COUNTRIES below)
     cat  : category id (see CATEGORIES below)
     pop  : 1-5 popularity   diff : 1-4 difficulty tier
     famous: short "known for" line (shown as Hint 3 + in reveal)
   ============================================================ */

export type Lang = "en" | "fa" | "ar";
const LI: Record<Lang, number> = { en: 0, fa: 1, ar: 2 };

export interface Person {
  id: string; en: string; fa: string; ar: string;
  dob: string; cc: string; cat: string;
  pop: number; diff: number; famous: string;
  iran?: boolean;
}

function p(
  id: string, en: string, fa: string, ar: string, dob: string,
  cc: string, cat: string, pop: number, diff: number, famous: string, iran?: 1
): Person {
  const x: Person = { id, en, fa, ar, dob, cc, cat, pop, diff, famous };
  if (iran) x.iran = true;
  return x;
}

export const PEOPLE: Person[] = [
  /* ================= FOOTBALL ================= */
  p("messi", "Lionel Messi", "لیونل مسی", "ليونيل ميسي", "1987-06-24", "AR", "football", 5, 1, "8 Ballon d'Ors & 2022 World Cup winner"),
  p("ronaldo", "Cristiano Ronaldo", "کریستیانو رونالدو", "كريستيانو رونالدو", "1985-02-05", "PT", "football", 5, 1, "5 Ballon d'Ors, all-time top international scorer"),
  p("pele", "Pelé", "پله", "بيليه", "1940-10-23", "BR", "football", 5, 1, "Only player to win 3 World Cups"),
  p("maradona", "Diego Maradona", "دیه‌گو مارادونا", "دييغو مارادونا", "1960-10-30", "AR", "football", 5, 1, "1986 World Cup, 'Hand of God' & 'Goal of the Century'"),
  p("mbappe", "Kylian Mbappé", "کیلیان امباپه", "كيليان مبابي", "1998-12-20", "FR", "football", 5, 1, "2018 World Cup winner, electric pace"),
  p("zidane", "Zinedine Zidane", "زین‌الدین زیدان", "زين الدين زيدان", "1972-06-23", "FR", "football", 5, 1, "1998 World Cup hero & iconic playmaker"),
  p("neymar", "Neymar Jr", "نیمار", "نيمار", "1992-02-05", "BR", "football", 5, 1, "Brazil's flamboyant star forward"),
  p("salah", "Mohamed Salah", "محمد صلاح", "محمد صلاح", "1992-06-15", "EG", "football", 5, 1, "Liverpool's Egyptian King"),
  p("beckham", "David Beckham", "دیوید بکام", "ديفيد بيكهام", "1975-05-02", "GB", "football", 5, 1, "Free-kick icon & global style figure"),
  p("ronaldinho", "Ronaldinho", "رونالدینیو", "رونالدينيو", "1980-03-21", "BR", "football", 5, 1, "The smiling magician of football"),
  p("haaland", "Erling Haaland", "ارلینگ هالند", "إرلينغ هالاند", "2000-07-21", "NO", "football", 4, 2, "Prolific Norwegian goal machine"),
  p("kane", "Harry Kane", "هری کین", "هاري كين", "1993-07-28", "GB", "football", 4, 2, "England's record striker"),
  p("debruyne", "Kevin De Bruyne", "کوین دی‌بروینه", "كيفين دي بروين", "1991-06-28", "BE", "football", 4, 2, "Manchester City's visionary passer"),
  p("modric", "Luka Modrić", "لوکا مودریچ", "لوكا مودريتش", "1985-09-09", "HR", "football", 4, 2, "2018 Ballon d'Or, Croatia's maestro"),
  p("lewandowski", "Robert Lewandowski", "روبرت لواندوفسکی", "روبرت ليفاندوفسكي", "1988-08-21", "PL", "football", 4, 2, "Poland's deadly striker"),
  p("ibrahimovic", "Zlatan Ibrahimović", "زلاتان ابراهیموویچ", "زلاتان إبراهيموفيتش", "1981-10-03", "SE", "football", 4, 2, "Acrobatic goals & legendary confidence"),
  p("xavi", "Xavi Hernández", "ژاوی هرناندس", "تشافي هرنانديز", "1980-01-25", "ES", "football", 4, 2, "Barcelona's tiki-taka brain"),
  p("iniesta", "Andrés Iniesta", "آندرس اینیستا", "أندريس إنييستا", "1984-05-11", "ES", "football", 4, 2, "Scored Spain's 2010 World Cup final goal"),
  p("pirlo", "Andrea Pirlo", "آندره‌آ پیرلو", "أندريا بيرلو", "1979-05-19", "IT", "football", 4, 2, "Elegant Italian deep-lying playmaker"),
  p("buffon", "Gianluigi Buffon", "جانلوئیجی بوفون", "جانلويجي بوفون", "1978-01-28", "IT", "football", 4, 2, "Legendary Italian goalkeeper"),
  p("ramos", "Sergio Ramos", "سرخیو راموس", "سيرجيو راموس", "1986-03-30", "ES", "football", 4, 2, "Real Madrid's steel captain"),
  p("maldini", "Paolo Maldini", "پائولو مالدینی", "باولو مالديني", "1968-06-26", "IT", "football", 4, 2, "AC Milan's immortal defender"),
  p("cruyff", "Johan Cruyff", "یوهان کرایف", "يوهان كرويف", "1947-04-25", "NL", "football", 4, 2, "Father of Total Football"),
  p("suarez", "Luis Suárez", "لوئیس سوارز", "لويس سواريز", "1987-01-24", "UY", "football", 4, 2, "Uruguay's relentless striker"),
  p("bale", "Gareth Bale", "گرت بیل", "غاريث بيل", "1989-07-16", "GB", "football", 4, 2, "Champions League final bicycle kick"),
  p("son", "Son Heung-min", "سون هیونگ-مین", "سون هيونغ مين", "1992-07-08", "KR", "football", 4, 2, "Tottenham & South Korea's star"),
  p("van-dijk", "Virgil van Dijk", "ویرجیل ون‌دایک", "فيرجيل فان دايك", "1991-07-08", "NL", "football", 3, 3, "Dominant Liverpool centre-back"),
  p("kaka", "Kaká", "کاکا", "كاكا", "1982-04-22", "BR", "football", 4, 2, "2007 Ballon d'Or, elegant attacker"),
  p("figo", "Luís Figo", "لوئیس فیگو", "لويس فيغو", "1972-11-04", "PT", "football", 3, 3, "2000 Ballon d'Or winger"),
  p("neuer", "Manuel Neuer", "مانوئل نویر", "مانويل نوير", "1986-03-27", "DE", "football", 3, 3, "Sweeper-keeper revolution"),
  p("ali-daei", "Ali Daei", "علی دایی", "علي دائي", "1969-03-21", "IR", "football", 4, 2, "Held the international goals world record", 1),
  p("ali-karimi", "Ali Karimi", "علی کریمی", "علي كريمي", "1978-11-08", "IR", "football", 3, 3, "Iran's dribbling 'Wizard'", 1),
  p("mahdavikia", "Mehdi Mahdavikia", "مهدی مهدوی‌کیا", "مهدي مهدوي كيا", "1977-07-24", "IR", "football", 3, 3, "Iran's right-wing legend, Bundesliga star", 1),

  /* ================= BASKETBALL ================= */
  p("jordan", "Michael Jordan", "مایکل جردن", "مايكل جوردن", "1963-02-17", "US", "basketball", 5, 1, "6 NBA titles, called the GOAT"),
  p("lebron", "LeBron James", "لبران جیمز", "ليبرون جيمس", "1984-12-30", "US", "basketball", 5, 1, "NBA's all-time leading scorer"),
  p("kobe", "Kobe Bryant", "کوبی برایانت", "كوبي براينت", "1978-08-23", "US", "basketball", 5, 1, "Lakers legend, 'Mamba Mentality'"),
  p("curry", "Stephen Curry", "استفن کری", "ستيفن كوري", "1988-03-14", "US", "basketball", 4, 2, "Greatest shooter in NBA history"),
  p("shaq", "Shaquille O'Neal", "شکیل اونیل", "شاكيل أونيل", "1972-03-06", "US", "basketball", 4, 2, "Unstoppable dominant center"),
  p("magic", "Magic Johnson", "مجیک جانسون", "ماجيك جونسون", "1959-08-14", "US", "basketball", 4, 2, "Showtime Lakers' legendary point guard"),
  p("bird", "Larry Bird", "لری برد", "لاري بيرد", "1956-12-07", "US", "basketball", 3, 3, "Celtics icon & deadly shooter"),
  p("durant", "Kevin Durant", "کوین دورانت", "كيفن دورانت", "1988-09-29", "US", "basketball", 4, 2, "Scoring machine, multiple Finals MVPs"),
  p("hamed", "Hamed Haddadi", "حامد حدادی", "حامد حدادي", "1985-05-19", "IR", "basketball", 2, 4, "Iran's NBA center & Asian star", 1),

  /* ================= TENNIS ================= */
  p("federer", "Roger Federer", "راجر فدرر", "روجر فيدرر", "1981-08-08", "CH", "tennis", 5, 1, "20 Grand Slams, silky elegance"),
  p("nadal", "Rafael Nadal", "رافائل نادال", "رافاييل نادال", "1986-06-03", "ES", "tennis", 5, 1, "14 French Open titles, 'King of Clay'"),
  p("djokovic", "Novak Djokovic", "نواک جوکوویچ", "نوفاك ديوكوفيتش", "1987-05-22", "RS", "tennis", 5, 1, "Most Grand Slam titles in men's tennis"),
  p("serena", "Serena Williams", "سرینا ویلیامز", "سيرينا ويليامز", "1981-09-26", "US", "tennis", 5, 1, "23 Grand Slam singles titles"),
  p("sharapova", "Maria Sharapova", "ماریا شاراپووا", "ماريا شارابوفا", "1987-04-19", "RU", "tennis", 4, 2, "5 Grand Slams, former world No.1"),
  p("alcaraz", "Carlos Alcaraz", "کارلوس آلکاراز", "كارلوس ألكاراز", "2003-05-05", "ES", "tennis", 4, 2, "Youngest men's world No.1"),

  /* ================= MOTORSPORT ================= */
  p("schumacher", "Michael Schumacher", "میشائل شوماخر", "مايكل شوماخر", "1969-01-03", "DE", "motorsport", 5, 1, "7 Formula One world titles"),
  p("hamilton", "Lewis Hamilton", "لوئیس همیلتون", "لويس هاميلتون", "1985-01-07", "GB", "motorsport", 5, 1, "7 F1 titles, most race wins"),
  p("senna", "Ayrton Senna", "آیرتون سنا", "آيرتون سينا", "1960-03-21", "BR", "motorsport", 4, 2, "3 F1 titles, racing icon"),
  p("rossi", "Valentino Rossi", "والنتینو روسی", "فالنتينو روسي", "1979-02-16", "IT", "motorsport", 3, 3, "9-time MotoGP world champion"),

  /* ================= BOXING ================= */
  p("muhammad-ali", "Muhammad Ali", "محمد علی کلی", "محمد علي كلاي", "1942-01-17", "US", "boxing", 5, 1, "'The Greatest', 3-time heavyweight champ"),
  p("tyson", "Mike Tyson", "مایک تایسون", "مايك تايسون", "1966-06-30", "US", "boxing", 5, 1, "Youngest-ever heavyweight champion"),
  p("mayweather", "Floyd Mayweather", "فلوید می‌ودر", "فلويد مايويذر", "1977-02-24", "US", "boxing", 4, 2, "Undefeated 50-0, 5-division champ"),
  p("pacquiao", "Manny Pacquiao", "منی پاکوئیاو", "ماني باكياو", "1978-12-17", "PH", "boxing", 4, 2, "Only 8-division world champion"),
  p("foreman", "George Foreman", "جرج فورمن", "جورج فورمان", "1949-01-10", "US", "boxing", 3, 3, "Oldest heavyweight champion at 45"),

  /* ================= ATHLETICS & SPORT ================= */
  p("usain-bolt", "Usain Bolt", "یوسین بولت", "يوسين بولت", "1986-08-21", "JM", "athletics", 5, 1, "Fastest man ever, 8 Olympic golds"),
  p("phelps", "Michael Phelps", "مایکل فلپس", "مايكل فيلبس", "1985-06-30", "US", "athletics", 5, 1, "Most Olympic golds ever (23)"),
  p("biles", "Simone Biles", "سیمون بایلز", "سيمون بايلز", "1997-03-14", "US", "athletics", 4, 2, "Greatest gymnast of all time"),
  p("comaneci", "Nadia Comăneci", "نادیا کومانیچی", "ناديا كومانيتشي", "1961-11-12", "RO", "athletics", 3, 3, "First perfect 10 in Olympic gymnastics"),
  p("kipchoge", "Eliud Kipchoge", "الیود کیپچوگه", "إليود كيبتشوغي", "1984-11-05", "KE", "athletics", 3, 3, "Marathon world record & sub-2h run"),
  p("takhti", "Gholamreza Takhti", "غلامرضا تختی", "غلام رضا تختي", "1930-08-27", "IR", "athletics", 3, 3, "Iran's Olympic wrestling hero, 'Jahan Pahlavan'", 1),

  /* ================= ACTORS ================= */
  p("tom-cruise", "Tom Cruise", "تام کروز", "توم كروز", "1962-07-03", "US", "actors", 5, 1, "Mission: Impossible superstar"),
  p("dicaprio", "Leonardo DiCaprio", "لئوناردو دی‌کاپریو", "ليوناردو دي كابريو", "1974-11-11", "US", "actors", 5, 1, "Titanic & Oscar-winning actor"),
  p("brad-pitt", "Brad Pitt", "برد پیت", "براد بيت", "1963-12-18", "US", "actors", 5, 1, "Fight Club & Once Upon a Time in Hollywood"),
  p("will-smith", "Will Smith", "ویل اسمیت", "ويل سميث", "1968-09-25", "US", "actors", 5, 1, "Men in Black & Fresh Prince"),
  p("johnny-depp", "Johnny Depp", "جانی دپ", "جوني ديب", "1963-06-09", "US", "actors", 4, 2, "Jack Sparrow in Pirates of the Caribbean"),
  p("tom-hanks", "Tom Hanks", "تام هنکس", "توم هانكس", "1956-07-09", "US", "actors", 5, 1, "Forrest Gump & two-time Oscar winner"),
  p("freeman", "Morgan Freeman", "مورگان فریمن", "مورغان فريمان", "1937-06-01", "US", "actors", 5, 1, "The iconic voice & Shawshank star"),
  p("denzel", "Denzel Washington", "دنزل واشینگتن", "دنزل واشنطن", "1954-12-28", "US", "actors", 4, 2, "Training Day Oscar winner"),
  p("downey", "Robert Downey Jr.", "رابرت داونی جونیور", "روبرت داوني جونيور", "1965-04-04", "US", "actors", 5, 1, "Iron Man of the MCU"),
  p("shahrukh-khan", "Shah Rukh Khan", "شاهرخ خان", "شاروخ خان", "1965-11-02", "IN", "actors", 5, 1, "'King Khan' of Bollywood"),
  p("amitabh", "Amitabh Bachchan", "آمیتاب باچان", "أميتاب باتشان", "1942-10-11", "IN", "actors", 4, 2, "Bollywood's 'Shahenshah'"),
  p("jackie-chan", "Jackie Chan", "جکی چان", "جاكي شان", "1954-04-07", "CN", "actors", 5, 1, "Martial-arts comedy action star"),
  p("chaplin", "Charlie Chaplin", "چارلی چاپلین", "تشارلي شابلن", "1889-04-16", "GB", "actors", 5, 1, "Silent-film 'Little Tramp' legend"),
  p("pacino", "Al Pacino", "آل پاچینو", "آل باتشينو", "1940-04-25", "US", "actors", 4, 2, "The Godfather's Michael Corleone"),
  p("de-niro", "Robert De Niro", "رابرت دنیرو", "روبرت دي نيرو", "1943-08-17", "US", "actors", 4, 2, "Taxi Driver & Raging Bull"),
  p("harrison-ford", "Harrison Ford", "هریسون فورد", "هاريسون فورد", "1942-07-13", "US", "actors", 4, 2, "Han Solo & Indiana Jones"),
  p("bruce-lee", "Bruce Lee", "بروس لی", "بروس لي", "1940-11-27", "CN", "actors", 5, 1, "Martial arts film pioneer"),
  p("farhadi", "Asghar Farhadi", "اصغر فرهادی", "أصغر فرهادي", "1972-05-07", "IR", "actors", 4, 2, "Two-time Oscar-winning Iranian director", 1),
  p("kiarostami", "Abbas Kiarostami", "عباس کیارستمی", "عباس كيارستمي", "1940-06-22", "IR", "actors", 3, 3, "Palme d'Or-winning Iranian director", 1),

  /* ================= ACTRESSES ================= */
  p("monroe", "Marilyn Monroe", "مریلین مونرو", "مارلين مونرو", "1926-06-01", "US", "actresses", 5, 1, "Hollywood's eternal icon"),
  p("hepburn", "Audrey Hepburn", "آدری هپبورن", "أودري هيبورن", "1929-05-04", "BE", "actresses", 5, 1, "Breakfast at Tiffany's & humanitarian"),
  p("scarlett", "Scarlett Johansson", "اسکارلت جوهانسون", "سكارليت جوهانسون", "1984-11-22", "US", "actresses", 5, 1, "Black Widow of the MCU"),
  p("jolie", "Angelina Jolie", "آنجلینا جولی", "أنجلينا جولي", "1975-06-04", "US", "actresses", 5, 1, "Lara Croft & UN envoy"),
  p("watson", "Emma Watson", "اما واتسون", "إيما واتسون", "1990-04-15", "GB", "actresses", 4, 2, "Hermione in Harry Potter"),
  p("gadot", "Gal Gadot", "گل گدوت", "غال غادوت", "1985-04-30", "IL", "actresses", 4, 2, "Wonder Woman"),
  p("cruz", "Penélope Cruz", "پنه‌لوپه کروز", "بينيلوبي كروز", "1974-04-28", "ES", "actresses", 4, 2, "Oscar-winning Spanish actress"),
  p("roberts", "Julia Roberts", "جولیا رابرتز", "جوليا روبرتس", "1967-10-28", "US", "actresses", 4, 2, "Pretty Woman & Oscar winner"),

  /* ================= SINGERS ================= */
  p("michael-jackson", "Michael Jackson", "مایکل جکسون", "مايكل جاكسون", "1958-08-29", "US", "singers", 5, 1, "The King of Pop, 'Thriller'"),
  p("elvis", "Elvis Presley", "الویس پریسلی", "إلفيس بريسلي", "1935-01-08", "US", "singers", 5, 1, "The King of Rock and Roll"),
  p("whitney", "Whitney Houston", "ویتنی هیوستون", "ويتني هيوستن", "1963-08-09", "US", "singers", 5, 1, "'I Will Always Love You'"),
  p("madonna", "Madonna", "مدونا", "مادونا", "1958-08-16", "US", "singers", 5, 1, "The Queen of Pop"),
  p("freddie", "Freddie Mercury", "فردی مرکوری", "فريدي ميركوري", "1946-09-05", "GB", "singers", 5, 1, "Queen's legendary frontman"),
  p("adele", "Adele", "ادل", "أديل", "1988-05-05", "GB", "singers", 5, 1, "Powerhouse voice, 'Hello'"),
  p("sheeran", "Ed Sheeran", "اد شیرن", "إد شيران", "1991-02-17", "GB", "singers", 5, 1, "'Shape of You' singer-songwriter"),
  p("swift", "Taylor Swift", "تیلور سویفت", "تايلور سويفت", "1989-12-13", "US", "singers", 5, 1, "Eras Tour record-breaking star"),
  p("beyonce", "Beyoncé", "بیانسه", "بيونسيه", "1981-09-04", "US", "singers", 5, 1, "Queen Bey, 32 Grammys"),
  p("ariana", "Ariana Grande", "آریانا گرانده", "أريانا غراندي", "1993-06-26", "US", "singers", 5, 1, "'Thank U, Next' pop star"),
  p("bieber", "Justin Bieber", "جاستین بیبر", "جاستن بيبر", "1994-03-01", "CA", "singers", 5, 1, "Teen pop sensation turned superstar"),
  p("weeknd", "The Weeknd", "د ویکند", "ذا ويكند", "1990-02-16", "CA", "singers", 4, 2, "'Blinding Lights' hitmaker"),
  p("shakira", "Shakira", "شکیرا", "شاكيرا", "1977-02-02", "CO", "singers", 5, 1, "'Waka Waka' World Cup anthem"),
  p("marley", "Bob Marley", "باب مارلی", "بوب مارلي", "1945-02-06", "JM", "singers", 5, 1, "Reggae's global ambassador"),
  p("sinatra", "Frank Sinatra", "فرانک سیناترا", "فرانك سيناترا", "1915-12-12", "US", "singers", 4, 2, "'My Way' — Ol' Blue Eyes"),
  p("john", "Elton John", "التون جان", "إلتون جون", "1947-03-25", "GB", "singers", 5, 1, "Rocket Man piano icon"),
  p("googoosh", "Googoosh", "گوگوش", "گوگوش", "1950-05-05", "IR", "singers", 4, 2, "Iran's most beloved pop diva", 1),
  p("ebi", "Ebi", "ابی", "إبي", "1949-06-19", "IR", "singers", 4, 2, "'Mr. Voice' of Iranian pop", 1),
  p("shajarian", "Mohammad Reza Shajarian", "محمدرضا شجریان", "محمد رضا شجريان", "1940-09-23", "IR", "singers", 4, 2, "Master of Persian classical song", 1),
  p("dariush", "Dariush Eghbali", "داریوش اقبالی", "داريوش إقبالي", "1946-11-04", "IR", "singers", 3, 3, "Iconic Iranian ballad singer", 1),

  /* ================= RAPPERS ================= */
  p("eminem", "Eminem", "امینم", "إمينيم", "1972-10-17", "US", "rappers", 5, 1, "Rap God, best-selling rapper ever"),
  p("drake", "Drake", "دریک", "دريك", "1986-10-24", "CA", "rappers", 5, 1, "Streaming-era rap superstar"),
  p("tupac", "Tupac Shakur", "توپاک شکور", "توباك شاكور", "1971-06-16", "US", "rappers", 4, 2, "Legendary West Coast rapper"),
  p("jayz", "Jay-Z", "جی-زی", "جاي زي", "1969-12-04", "US", "rappers", 4, 2, "Rap mogul & billionaire"),

  /* ================= COMPOSERS ================= */
  p("mozart", "Wolfgang Amadeus Mozart", "موتسارت", "موتسارت", "1756-01-27", "AT", "composers", 5, 1, "Child-prodigy classical genius"),
  p("beethoven", "Ludwig van Beethoven", "بتهوون", "بيتهوفن", "1770-12-17", "DE", "composers", 5, 1, "Composed masterpieces while deaf"),
  p("bach", "Johann Sebastian Bach", "باخ", "باخ", "1685-03-31", "DE", "composers", 4, 2, "Baroque master of counterpoint"),
  p("chopin", "Frédéric Chopin", "شوپن", "شوبان", "1810-03-01", "PL", "composers", 4, 2, "Poet of the piano"),
  p("tchaikovsky", "Pyotr Tchaikovsky", "چایکوفسکی", "تشايكوفسكي", "1840-05-07", "RU", "composers", 4, 2, "Swan Lake & The Nutcracker"),

  /* ================= SCIENTISTS ================= */
  p("einstein", "Albert Einstein", "آلبرت اینشتین", "ألبرت أينشتاين", "1879-03-14", "DE", "scientists", 5, 1, "Theory of relativity, E=mc²"),
  p("newton", "Isaac Newton", "اسحاق نیوتن", "إسحاق نيوتن", "1643-01-04", "GB", "scientists", 5, 1, "Laws of motion & gravity"),
  p("tesla", "Nikola Tesla", "نیکولا تسلا", "نيكولا تيسلا", "1856-07-10", "RS", "scientists", 5, 1, "Alternating current & futurist inventor"),
  p("darwin", "Charles Darwin", "چارلز داروین", "تشارلز داروين", "1809-02-12", "GB", "scientists", 5, 1, "Theory of evolution"),
  p("curie", "Marie Curie", "ماری کوری", "ماري كوري", "1867-11-07", "PL", "scientists", 5, 1, "Nobels in two sciences, radioactivity"),
  p("hawking", "Stephen Hawking", "استیون هاوکینگ", "ستيفن هوكينغ", "1942-01-08", "GB", "scientists", 5, 1, "Black holes & A Brief History of Time"),
  p("galileo", "Galileo Galilei", "گالیله", "غاليليو غاليلي", "1564-02-15", "IT", "scientists", 4, 2, "Father of modern astronomy"),
  p("edison", "Thomas Edison", "توماس ادیسون", "توماس إديسون", "1847-02-11", "US", "scientists", 5, 1, "Light bulb & 1,000+ patents"),
  p("turing", "Alan Turing", "آلن تورینگ", "آلان تورينغ", "1912-06-23", "GB", "scientists", 4, 2, "Father of computer science"),
  p("mirzakhani", "Maryam Mirzakhani", "مریم میرزاخانی", "مريم ميرزاخاني", "1977-05-12", "IR", "scientists", 4, 2, "First woman to win the Fields Medal", 1),
  p("ibn-sina", "Ibn Sina (Avicenna)", "ابن سینا", "ابن سينا", "0980-08-07", "IR", "scientists", 4, 2, "The Canon of Medicine, polymath", 1),

  /* ================= TECHNOLOGY ================= */
  p("jobs", "Steve Jobs", "استیو جابز", "ستيف جوبز", "1955-02-24", "US", "tech", 5, 1, "Co-founded Apple, iPhone visionary"),
  p("gates", "Bill Gates", "بیل گیتس", "بيل غيتس", "1955-10-28", "US", "tech", 5, 1, "Co-founded Microsoft"),
  p("musk", "Elon Musk", "ایلان ماسک", "إيلون ماسك", "1971-06-28", "US", "tech", 5, 1, "Tesla, SpaceX & X"),
  p("zuckerberg", "Mark Zuckerberg", "مارک زاکربرگ", "مارك زوكربيرغ", "1984-05-14", "US", "tech", 5, 1, "Created Facebook"),
  p("bezos", "Jeff Bezos", "جف بزوس", "جيف بيزوس", "1964-01-12", "US", "tech", 5, 1, "Founded Amazon"),
  p("pichai", "Sundar Pichai", "ساندار پیچای", "ساندار بيتشاي", "1972-07-12", "IN", "tech", 3, 3, "CEO of Google & Alphabet"),
  p("lovelace", "Ada Lovelace", "ایدا لاولیس", "آدا لوفلايس", "1815-12-10", "GB", "tech", 3, 3, "First computer programmer"),

  /* ================= ENTREPRENEURS ================= */
  p("disney", "Walt Disney", "والت دیزنی", "والت ديزني", "1901-12-05", "US", "entrepreneurs", 5, 1, "Mickey Mouse & Disneyland"),
  p("ford", "Henry Ford", "هنری فورد", "هنري فورد", "1863-07-30", "US", "entrepreneurs", 4, 2, "Assembly-line automobile pioneer"),
  p("oprah", "Oprah Winfrey", "اپرا وینفری", "أوبرا وينفري", "1954-01-29", "US", "entrepreneurs", 5, 1, "Media mogul & talk-show queen"),
  p("chanel", "Coco Chanel", "کوکو شنل", "كوكو شانيل", "1883-08-19", "FR", "entrepreneurs", 4, 2, "Revolutionary fashion designer"),
  p("branson", "Richard Branson", "ریچارد برانسون", "ريتشارد برانسون", "1950-07-18", "GB", "entrepreneurs", 3, 3, "Virgin Group founder"),

  /* ================= HISTORICAL ================= */
  p("napoleon", "Napoleon Bonaparte", "ناپلئون بناپارت", "نابليون بونابرت", "1769-08-15", "FR", "historical", 5, 1, "French emperor & military genius"),
  p("caesar", "Julius Caesar", "ژولیوس سزار", "يوليوس قيصر", "0100-07-12", "IT", "historical", 5, 1, "Roman dictator, 'crossed the Rubicon'"),
  p("cleopatra", "Cleopatra", "کلئوپاترا", "كليوباترا", "0069-01-01", "EG", "historical", 5, 1, "Last active ruler of ancient Egypt"),
  p("alexander", "Alexander the Great", "اسکندر مقدونی", "الإسكندر الأكبر", "0356-07-20", "GR", "historical", 5, 1, "Conquered an empire by age 30"),
  p("victoria", "Queen Victoria", "ملکه ویکتوریا", "الملكة فيكتوريا", "1819-05-24", "GB", "historical", 4, 2, "63-year British reign"),
  p("genghis", "Genghis Khan", "چنگیزخان", "جنكيز خان", "1162-04-16", "MN", "historical", 4, 2, "Founded the Mongol Empire"),
  p("cyrus", "Cyrus the Great", "کوروش بزرگ", "قورش الكبير", "0576-01-01", "IR", "historical", 5, 1, "Founded Persia's Achaemenid Empire", 1),
  p("saladin", "Saladin", "صلاح‌الدین ایوبی", "صلاح الدين الأيوبي", "1137-01-01", "IQ", "historical", 3, 3, "Sultan who recaptured Jerusalem"),

  /* ================= WORLD LEADERS ================= */
  p("gandhi", "Mahatma Gandhi", "ماهاتما گاندی", "المهاتما غاندي", "1869-10-02", "IN", "leaders", 5, 1, "Led India's independence nonviolently"),
  p("mandela", "Nelson Mandela", "نلسون ماندلا", "نيلسون مانديلا", "1918-07-18", "ZA", "leaders", 5, 1, "Ended apartheid, 27 years in prison"),
  p("mlk", "Martin Luther King Jr.", "مارتین لوتر کینگ", "مارتن لوثر كينغ", "1929-01-15", "US", "leaders", 5, 1, "'I Have a Dream' civil rights leader"),
  p("churchill", "Winston Churchill", "وینستون چرچیل", "وينستون تشرشل", "1874-11-30", "GB", "leaders", 4, 2, "Led Britain through WWII"),
  p("lincoln", "Abraham Lincoln", "آبراهام لینکلن", "أبراهام لينكولن", "1809-02-12", "US", "leaders", 5, 1, "US president who ended slavery"),
  p("obama", "Barack Obama", "باراک اوباما", "باراك أوباما", "1961-08-04", "US", "leaders", 5, 1, "First African-American US president"),

  /* ================= WRITERS ================= */
  p("shakespeare", "William Shakespeare", "ویلیام شکسپیر", "ويليام شكسبير", "1564-04-26", "GB", "writers", 5, 1, "Greatest playwright in English"),
  p("rowling", "J.K. Rowling", "جی.کی. رولینگ", "ج. ك. رولينغ", "1965-07-31", "GB", "writers", 5, 1, "Created Harry Potter"),
  p("tolstoy", "Leo Tolstoy", "لئو تولستوی", "ليو تولستوي", "1828-09-09", "RU", "writers", 4, 2, "War and Peace & Anna Karenina"),
  p("twain", "Mark Twain", "مارک تواین", "مارك توين", "1835-11-30", "US", "writers", 4, 2, "Tom Sawyer & Huckleberry Finn"),
  p("rumi", "Rumi", "مولانا", "جلال الدين الرومي", "1207-09-30", "IR", "writers", 5, 1, "World's most-read poet of love", 1),
  p("hafez", "Hafez", "حافظ", "حافظ الشيرازي", "1315-01-01", "IR", "writers", 4, 2, "Persia's beloved lyric poet", 1),
  p("khayyam", "Omar Khayyam", "عمر خیام", "عمر الخيام", "1048-05-18", "IR", "writers", 4, 2, "Rubáiyát poet & mathematician", 1),
  p("hedayat", "Sadegh Hedayat", "صادق هدایت", "صادق هدايت", "1903-02-17", "IR", "writers", 3, 3, "Author of The Blind Owl", 1),

  /* ================= ARTISTS ================= */
  p("van-gogh", "Vincent van Gogh", "ونسان ون‌گوگ", "فينسنت فان غوخ", "1853-03-30", "NL", "artists", 5, 1, "Starry Night post-impressionist"),
  p("picasso", "Pablo Picasso", "پابلو پیکاسو", "بابلو بيكاسو", "1881-10-25", "ES", "artists", 5, 1, "Co-founded Cubism"),
  p("da-vinci", "Leonardo da Vinci", "لئوناردو داوینچی", "ليوناردو دا فينشي", "1452-04-15", "IT", "artists", 5, 1, "Mona Lisa & Renaissance genius"),
  p("michelangelo", "Michelangelo", "میکل‌آنژ", "مايكل أنجلو", "1475-03-06", "IT", "artists", 4, 2, "Sistine Chapel ceiling"),
  p("kahlo", "Frida Kahlo", "فریدا کالو", "فريدا كاهلو", "1907-07-06", "MX", "artists", 4, 2, "Iconic Mexican self-portraits"),
  p("dali", "Salvador Dalí", "سالوادور دالی", "سلفادور دالي", "1904-05-11", "ES", "artists", 4, 2, "Surrealist melting clocks"),
  p("warhol", "Andy Warhol", "اندی وارهول", "أندي وارهول", "1928-08-06", "US", "artists", 3, 3, "Pop art pioneer"),

  /* ================= ASTRONAUTS ================= */
  p("armstrong", "Neil Armstrong", "نیل آرمسترانگ", "نيل أرمسترونغ", "1930-08-05", "US", "astronauts", 5, 1, "First human on the Moon"),
  p("gagarin", "Yuri Gagarin", "یوری گاگارین", "يوري غاغارين", "1934-03-09", "RU", "astronauts", 5, 1, "First human in space"),

  /* ================= TV / COMEDY / INTERNET ================= */
  p("atkinson", "Rowan Atkinson", "روآن اتکینسون", "روان أتكينسون", "1955-01-06", "GB", "comedians", 4, 2, "Mr. Bean"),
  p("hart", "Kevin Hart", "کوین هارت", "كيفن هارت", "1979-07-06", "US", "comedians", 4, 2, "Stand-up & Jumanji star"),
  p("khan", "Salman Khan", "سلمان خان", "سلمان خان", "1965-12-27", "IN", "actors", 4, 2, "Bollywood's 'Bhaijaan'"),
  p("aniston", "Jennifer Aniston", "جنیفر آنیستون", "جينيفر أنيستون", "1969-02-11", "US", "actresses", 4, 2, "Rachel on Friends"),
  p("pewdiepie", "PewDiePie", "پیودی‌پای", "بيودي باي", "1989-10-24", "SE", "internet", 3, 3, "YouTube's breakout gaming star"),

  /* ================= FOOTBALL (extended) ================= */
  p("best", "George Best", "جرج بست", "جورج بست", "1946-05-22", "GB", "football", 3, 3, "Manchester United's dazzling winger"),
  p("puskas", "Ferenc Puskás", "فرانس پوشکاش", "فيرينك بوشكاش", "1927-04-02", "IT", "football", 3, 3, "Hungarian golden team's goal machine"),
  p("di-stefano", "Alfredo Di Stéfano", "آلفردو دی‌استفانو", "ألفريدو دي ستيفانو", "1926-07-04", "AR", "football", 3, 3, "Real Madrid's five European Cups"),
  p("platini", "Michel Platini", "میشل پلاتینی", "ميشيل بلاتيني", "1955-06-21", "FR", "football", 3, 3, "Three consecutive Ballon d'Ors"),
  p("baggio", "Roberto Baggio", "روبرتو باجو", "روبرتو باجيو", "1967-02-18", "IT", "football", 3, 3, "Italy's 'Divine Ponytail'"),
  p("drogba", "Didier Drogba", "دیدیه دروگبا", "ديدييه دروغبا", "1978-03-11", "IT", "football", 4, 2, "Chelsea's legendary striker"),
  p("etoo", "Samuel Eto'o", "ساموئل اتوئو", "صامويل إيتو", "1981-03-10", "IT", "football", 4, 2, "Cameroon's record goalscorer"),
  p("casillas", "Iker Casillas", "ایکر کاسیاس", "إيكر كاسياس", "1981-05-20", "ES", "football", 4, 2, "Spain's 'Saint Iker' in goal"),
  p("garrincha", "Garrincha", "گارینشا", "غارينشا", "1933-10-28", "BR", "football", 3, 3, "Brazil's joyful dribbling genius"),

  /* ================= ACTORS / ACTRESSES (extended) ================= */
  p("clooney", "George Clooney", "جورج کلونی", "جورج كلوني", "1961-05-06", "US", "actors", 4, 2, "Ocean's Eleven leading man"),
  p("damon", "Matt Damon", "مت دیمون", "مات ديمون", "1970-10-08", "US", "actors", 4, 2, "Good Will Hunting Oscar writer"),
  p("samuel-jackson", "Samuel L. Jackson", "ساموئل ال جکسون", "صامويل ال جاكسون", "1948-12-21", "US", "actors", 4, 2, "Pulp Fiction & Nick Fury"),
  p("jackman", "Hugh Jackman", "هیو جکمن", "هيو جاكمان", "1968-10-12", "AU", "actors", 4, 2, "Wolverine of the X-Men"),
  p("hemsworth", "Chris Hemsworth", "کریس همسورث", "كريس هيمسوورث", "1983-08-11", "AU", "actors", 4, 2, "Marvel's Thor"),
  p("johnson", "Dwayne Johnson", "دواین جانسون", "دواين جونسون", "1972-05-02", "US", "actors", 5, 1, "'The Rock' — wrestler turned star"),
  p("reeves", "Keanu Reeves", "کیانو ریوز", "كيانو ريفز", "1964-09-02", "CA", "actors", 4, 2, "Neo in The Matrix"),
  p("streep", "Meryl Streep", "مریل استریپ", "ميريل ستريب", "1949-06-22", "US", "actresses", 4, 2, "Most Oscar-nominated actress ever"),
  p("blanchett", "Cate Blanchett", "کیت بلانشت", "كيت بلانشيت", "1969-05-14", "AU", "actresses", 3, 3, "Galadriel & two-time Oscar winner"),
  p("portman", "Natalie Portman", "ناتالی پورتمن", "ناتالي بورتمان", "1981-06-09", "IL", "actresses", 4, 2, "Black Swan Oscar winner"),
  p("hathaway", "Anne Hathaway", "آن هاتاوی", "آن هاثاواي", "1982-11-12", "US", "actresses", 4, 2, "Les Misérables Oscar winner"),
  p("golshifteh", "Golshifteh Farahani", "گلشیفته فراهانی", "غولشيفته فراهاني", "1983-07-10", "IR", "actresses", 3, 3, "Internationally acclaimed Iranian actress", 1),
  p("zar-amir", "Zar Amir Ebrahimi", "زر امیر ابراهیمی", "زار أمير إبراهيمي", "1981-07-01", "IR", "actresses", 2, 4, "Cannes Best Actress, 'Holy Spider'", 1),

  /* ================= SINGERS (extended) ================= */
  p("bruno-mars", "Bruno Mars", "برونو مارس", "برونو مارس", "1985-10-08", "US", "singers", 5, 1, "'Uptown Funk' hitmaker"),
  p("lady-gaga", "Lady Gaga", "لیدی گاگا", "ليدي غاغا", "1986-03-28", "US", "singers", 5, 1, "Pop provocateur & Oscar-winning actress"),
  p("mariah", "Mariah Carey", "ماریا کری", "ماريا كاري", "1969-03-27", "US", "singers", 4, 2, "Five-octave voice, 'All I Want for Christmas'"),
  p("wonder", "Stevie Wonder", "استیوی واندر", "ستيفي ووندر", "1950-05-13", "US", "singers", 4, 2, "Blind soul genius, 25 Grammys"),
  p("bowie", "David Bowie", "دیوید بویی", "ديفيد بوي", "1947-01-08", "GB", "singers", 4, 2, "Ziggy Stardust chameleon of rock"),
  p("winehouse", "Amy Winehouse", "ایمی واین‌هاوس", "إيمي واينهاوس", "1983-09-14", "GB", "singers", 3, 3, "'Rehab' soul singer"),
  p("franklin", "Aretha Franklin", "آرتا فرانکلین", "أريثا فرانكلين", "1942-03-25", "US", "singers", 3, 3, "The Queen of Soul"),
  p("hayedeh", "Hayedeh", "هایده", "هايده", "1942-04-10", "IR", "singers", 3, 3, "Legendary Iranian classical voice", 1),
  p("shadmehr", "Shadmehr Aghili", "شادمهر عقیلی", "شادمهر عقيلي", "1973-01-27", "IR", "singers", 3, 3, "Iranian pop star & multi-instrumentalist", 1),

  /* ================= BASKETBALL / TENNIS (extended) ================= */
  p("giannis", "Giannis Antetokounmpo", "یانیس آدتوکومبو", "يانيس أنتيتوكونمبو", "1994-12-06", "GR", "basketball", 4, 2, "NBA's 'Greek Freak'"),
  p("doncic", "Luka Dončić", "لوکا دانچیچ", "لوكا دونتشيتش", "1999-02-28", "SI", "basketball", 4, 2, "Slovenian NBA superstar"),
  p("russell", "Bill Russell", "بیل راسل", "بيل راسل", "1934-02-12", "US", "basketball", 3, 3, "11 NBA championships"),
  p("chamberlain", "Wilt Chamberlain", "ویلت چمبرلین", "ويلت تشامبرلين", "1936-08-21", "US", "basketball", 3, 3, "Scored 100 points in a single game"),
  p("graf", "Steffi Graf", "اشтефی گراف", "شتيفي غراف", "1969-06-14", "DE", "tennis", 3, 3, "Golden Slam — all four majors + Olympic gold"),
  p("borg", "Björn Borg", "بیورن بورگ", "بيورن بورغ", "1956-06-06", "SE", "tennis", 3, 3, "Ice-cool 11 Grand Slam champion"),
  p("swiatek", "Iga Świątek", "ایگا شفیونتك", "إيغا شفيونتيك", "2001-05-31", "PL", "tennis", 3, 3, "Dominant women's world No.1"),

  /* ================= SCIENTISTS (extended) ================= */
  p("faraday", "Michael Faraday", "مایکل فارادی", "مايكل فاراداي", "1791-09-22", "GB", "scientists", 3, 3, "Electromagnetic induction pioneer"),
  p("maxwell", "James Clerk Maxwell", "جیمز کلرک ماکسول", "جيمس كليرك ماكسويل", "1831-06-13", "GB", "scientists", 3, 3, "Unified electricity & magnetism"),
  p("bohr", "Niels Bohr", "نیلز بور", "نيلز بور", "1885-10-07", "IT", "scientists", 3, 3, "Atomic structure Nobel laureate"),
  p("sagan", "Carl Sagan", "کارل سیگن", "كارل ساغان", "1934-11-09", "US", "scientists", 3, 3, "Cosmos — brought space to millions"),
  p("neumann", "John von Neumann", "جان فون نویمان", "جون فون نيومان", "1903-12-28", "US", "scientists", 3, 3, "Computing & game theory pioneer"),
  p("khwarizmi", "Al-Khwarizmi", "خوارزمی", "الخوارزمي", "0780-01-01", "IR", "scientists", 4, 2, "Father of algebra & algorithms", 1),

  /* ================= TECH (extended) ================= */
  p("wozniak", "Steve Wozniak", "استیو وزنیاک", "ستيف وزنياك", "1950-08-11", "US", "tech", 3, 3, "Co-founded Apple, built the first Mac"),
  p("huang", "Jensen Huang", "جنسن هوانگ", "جنسن هوانغ", "1963-02-17", "US", "tech", 3, 3, "NVIDIA CEO, AI chip king"),
  p("ellison", "Larry Ellison", "لری الیسون", "لاري إليسون", "1944-08-17", "US", "tech", 3, 3, "Co-founded Oracle"),

  /* ================= HISTORICAL / LEADERS (extended) ================= */
  p("polo", "Marco Polo", "مارکو پولو", "ماركو بولو", "1254-09-15", "IT", "historical", 3, 3, "Venetian explorer of the Silk Road"),
  p("columbus", "Christopher Columbus", "کریستف کلمب", "كريستوفر كولومبوس", "1451-10-31", "IT", "historical", 4, 2, "1492 voyage to the Americas"),
  p("elizabeth-i", "Elizabeth I", "الیزابت اول", "إليزابيث الأولى", "1533-09-07", "GB", "historical", 3, 3, "England's 'Virgin Queen'"),
  p("roosevelt", "Franklin D. Roosevelt", "فرانکلین روزولت", "فرانكلين روزفلت", "1882-01-30", "US", "leaders", 4, 2, "Led the US through WWII & Depression"),
  p("de-gaulle", "Charles de Gaulle", "شارل دوگل", "شارل ديغول", "1890-11-22", "FR", "leaders", 3, 3, "Leader of Free France"),
  p("elizabeth-ii", "Elizabeth II", "الیزابت دوم", "إليزابيث الثانية", "1926-04-21", "GB", "leaders", 4, 2, "Longest-reigning British monarch"),

  /* ================= WRITERS (extended) ================= */
  p("hugo", "Victor Hugo", "ویکتور هوگو", "فيكتور هوغو", "1802-02-26", "FR", "writers", 4, 2, "Les Misérables & Notre-Dame"),
  p("dostoevsky", "Fyodor Dostoevsky", "فئودور داستایفسکی", "فيودور دوستويفسكي", "1821-11-11", "RU", "writers", 3, 3, "Crime and Punishment"),
  p("cervantes", "Miguel de Cervantes", "میگل دو سروانتس", "ميغيل دي ثيربانتس", "1547-09-29", "ES", "writers", 3, 3, "Don Quixote, first modern novel"),
  p("austen", "Jane Austen", "جین آستین", "جين أوستن", "1775-12-16", "GB", "writers", 4, 2, "Pride and Prejudice"),
  p("orwell", "George Orwell", "جورج اورول", "جورج أورويل", "1903-06-25", "GB", "writers", 4, 2, "1984 & Animal Farm"),

  /* ================= ARTISTS (extended) ================= */
  p("monet", "Claude Monet", "کلود مونه", "كلود مونيه", "1840-11-14", "FR", "artists", 4, 2, "Impressionism's Water Lilies"),
  p("rembrandt", "Rembrandt", "رامبرانت", "رامبرانت", "1606-07-15", "NL", "artists", 3, 3, "Dutch master of light, The Night Watch"),
  p("hokusai", "Katsushika Hokusai", "کاتسوشیکا هوکوسای", "كاتسوشيكا هوكوساي", "1760-10-31", "JP", "artists", 3, 3, "The Great Wave off Kanagawa"),
  p("kamal-ol-molk", "Kamal-ol-Molk", "کمال‌الملک", "كمال الملك", "1848-01-01", "IR", "artists", 2, 4, "Iran's master realist painter", 1),

  /* ================= ASTRONAUTS / COMEDY (extended) ================= */
  p("aldrin", "Buzz Aldrin", "باز آلدرین", "بز ألدرين", "1930-01-20", "US", "astronauts", 4, 2, "Second human on the Moon"),
  p("tereshkova", "Valentina Tereshkova", "والنتینا ترشکوا", "فالنتينا تيريشكوفا", "1937-03-06", "RU", "astronauts", 3, 3, "First woman in space"),
  p("carrey", "Jim Carrey", "جیم کری", "جيم كاري", "1962-01-17", "CA", "comedians", 4, 2, "The Mask's rubber-faced comic"),
  p("gervais", "Ricky Gervais", "ریکی جرویس", "ريكي جيرفيه", "1961-06-25", "GB", "comedians", 3, 3, "The Office creator"),
  p("trevor-noah", "Trevor Noah", "تروور نوح", "تريفور نوح", "1984-02-20", "ZA", "comedians", 3, 3, "The Daily Show host"),
];

/* ------------------------------------------------------------
   CATEGORIES — localized [en, fa, ar], icon + brand colors.
   ------------------------------------------------------------ */
export interface CatDef {
  id: string; icon: string; c1: string; c2: string;
  name: [string, string, string];
}
export const CATEGORIES: CatDef[] = [
  { id: "football", icon: "football", c1: "#35d07f", c2: "#ffc95c", name: ["Football", "فوتبال", "كرة القدم"] },
  { id: "basketball", icon: "basketball", c1: "#ff8a3d", c2: "#ffd98a", name: ["Basketball", "بسکتبال", "كرة السلة"] },
  { id: "tennis", icon: "tennis", c1: "#a8e05f", c2: "#f3ecda", name: ["Tennis", "تنیس", "التنس"] },
  { id: "motorsport", icon: "flag", c1: "#ff5470", c2: "#ffc95c", name: ["Racing Drivers", "رانندگان مسابقه", "سائقو السباقات"] },
  { id: "boxing", icon: "glove", c1: "#ff6b4d", c2: "#ffa3b2", name: ["Boxers", "بوکسورها", "الملاكمون"] },
  { id: "athletics", icon: "run", c1: "#4dffd8", c2: "#8fb7ff", name: ["Athletes", "ورزشکاران", "الرياضيون"] },
  { id: "actors", icon: "mask", c1: "#ffc95c", c2: "#ff5470", name: ["Actors", "بازیگران", "الممثلون"] },
  { id: "actresses", icon: "star", c1: "#ff9ecd", c2: "#ffd98a", name: ["Actresses", "بازیگران زن", "الممثلات"] },
  { id: "singers", icon: "mic", c1: "#c77dff", c2: "#4dffd8", name: ["Singers", "خوانندگان", "المغنون"] },
  { id: "rappers", icon: "rap", c1: "#8fb7ff", c2: "#c77dff", name: ["Rappers", "رپرها", "مغني الراب"] },
  { id: "composers", icon: "piano", c1: "#d9d0b8", c2: "#ffc95c", name: ["Composers", "آهنگسازان", "الملحنون"] },
  { id: "scientists", icon: "flask", c1: "#45d4ff", c2: "#9ef7d0", name: ["Scientists", "دانشمندان", "العلماء"] },
  { id: "tech", icon: "chip", c1: "#4dffd8", c2: "#45d4ff", name: ["Technology", "فناوری", "التقنية"] },
  { id: "entrepreneurs", icon: "case", c1: "#f5ad1d", c2: "#ff8a5c", name: ["Entrepreneurs", "کارآفرینان", "رواد الأعمال"] },
  { id: "historical", icon: "pillar", c1: "#f5ad1d", c2: "#d9d0b8", name: ["Historical Figures", "شخصیت‌های تاریخی", "شخصيات تاريخية"] },
  { id: "leaders", icon: "crown", c1: "#ffc95c", c2: "#ff5470", name: ["World Leaders", "رهبران جهان", "قادة العالم"] },
  { id: "writers", icon: "pen", c1: "#d9d0b8", c2: "#8fb7ff", name: ["Writers", "نویسندگان", "الكتّاب"] },
  { id: "artists", icon: "palette", c1: "#ff7d92", c2: "#8fb7ff", name: ["Artists", "هنرمندان", "الفنانون"] },
  { id: "astronauts", icon: "rocket", c1: "#8fb7ff", c2: "#ffd98a", name: ["Astronauts", "فضانوردان", "رواد الفضاء"] },
  { id: "comedians", icon: "laugh", c1: "#ffd98a", c2: "#ff5470", name: ["Comedians", "کمدین‌ها", "الكوميديون"] },
  { id: "internet", icon: "wifi", c1: "#4dffd8", c2: "#c77dff", name: ["Internet Stars", "چهره‌های اینترنت", "نجوم الإنترنت"] },
];

const CAT_MAP: Record<string, CatDef> = {};
for (const c of CATEGORIES) CAT_MAP[c.id] = c;
export const catDef = (id: string): CatDef =>
  CAT_MAP[id] ?? { id, icon: "star", c1: "#f5ad1d", c2: "#4dffd8", name: [id, id, id] };
export const catName = (id: string, lang: Lang) => catDef(id).name[LI[lang]];

/* ------------------------------------------------------------
   COUNTRIES — localized [en, fa, ar] + 3-letter code.
   ------------------------------------------------------------ */
export const COUNTRIES: Record<string, { n: [string, string, string]; code: string }> = {
  AR: { n: ["Argentina", "آرژانتین", "الأرجنتين"], code: "ARG" },
  BR: { n: ["Brazil", "برزیل", "البرازيل"], code: "BRA" },
  DE: { n: ["Germany", "آلمان", "ألمانيا"], code: "GER" },
  ES: { n: ["Spain", "اسپانیا", "إسبانيا"], code: "ESP" },
  FR: { n: ["France", "فرانسه", "فرنسا"], code: "FRA" },
  GB: { n: ["United Kingdom", "بریتانیا", "المملكة المتحدة"], code: "GBR" },
  IT: { n: ["Italy", "ایتالیا", "إيطاليا"], code: "ITA" },
  NL: { n: ["Netherlands", "هلند", "هولندا"], code: "NED" },
  PT: { n: ["Portugal", "پرتغال", "البرتغال"], code: "POR" },
  US: { n: ["United States", "ایالات متحده", "الولايات المتحدة"], code: "USA" },
  CA: { n: ["Canada", "کانادا", "كندا"], code: "CAN" },
  IR: { n: ["Iran", "ایران", "إيران"], code: "IRI" },
  EG: { n: ["Egypt", "مصر", "مصر"], code: "EGY" },
  IN: { n: ["India", "هند", "الهند"], code: "IND" },
  JP: { n: ["Japan", "ژاپن", "اليابان"], code: "JPN" },
  CN: { n: ["China", "چین", "الصين"], code: "CHN" },
  KR: { n: ["South Korea", "کرهٔ جنوبی", "كوريا الجنوبية"], code: "KOR" },
  AU: { n: ["Australia", "استرالیا", "أستراليا"], code: "AUS" },
  ZA: { n: ["South Africa", "آفریقای جنوبی", "جنوب أفريقيا"], code: "RSA" },
  NO: { n: ["Norway", "نروژ", "النرويج"], code: "NOR" },
  SE: { n: ["Sweden", "سوئد", "السويد"], code: "SWE" },
  RS: { n: ["Serbia", "صربستان", "صربيا"], code: "SRB" },
  HR: { n: ["Croatia", "کرواسی", "كرواتيا"], code: "CRO" },
  PL: { n: ["Poland", "لهستان", "بولندا"], code: "POL" },
  UA: { n: ["Ukraine", "اوکراین", "أوكرانيا"], code: "UKR" },
  CH: { n: ["Switzerland", "سوئیس", "سويسرا"], code: "SUI" },
  BE: { n: ["Belgium", "بلژیک", "بلجيكا"], code: "BEL" },
  MX: { n: ["Mexico", "مکزیک", "المكسيك"], code: "MEX" },
  CO: { n: ["Colombia", "کلمبیا", "كولومبيا"], code: "COL" },
  UY: { n: ["Uruguay", "اروگوئه", "الأوروغواي"], code: "URU" },
  JM: { n: ["Jamaica", "جامائیکا", "جامايكا"], code: "JAM" },
  KE: { n: ["Kenya", "کنیا", "كينيا"], code: "KEN" },
  TR: { n: ["Turkey", "ترکیه", "تركيا"], code: "TUR" },
  RU: { n: ["Russia", "روسیه", "روسيا"], code: "RUS" },
  AT: { n: ["Austria", "اتریش", "النمسا"], code: "AUT" },
  IL: { n: ["Israel", "اسرائیل", "إسرائيل"], code: "ISR" },
  PH: { n: ["Philippines", "فیلیپین", "الفلبين"], code: "PHI" },
  RO: { n: ["Romania", "رومانی", "رومانيا"], code: "ROU" },
  MN: { n: ["Mongolia", "مغولستان", "منغوليا"], code: "MGL" },
  IQ: { n: ["Iraq", "عراق", "العراق"], code: "IRQ" },
  GR: { n: ["Greece", "یونان", "اليونان"], code: "GRE" },
  SI: { n: ["Slovenia", "اسلوونی", "سلوفينيا"], code: "SLO" },
  CI: { n: ["Côte d'Ivoire", "ساحل عاج", "كوت ديفوار"], code: "CIV" },
  CM: { n: ["Cameroon", "کامرون", "الكاميرون"], code: "CMR" },
  HU: { n: ["Hungary", "مجارستان", "المجر"], code: "HUN" },
  DK: { n: ["Denmark", "دانمارک", "الدنمارك"], code: "DEN" },
};

export const countryName = (cc: string, lang: Lang) => COUNTRIES[cc]?.n[LI[lang]] ?? cc;
export const countryCode3 = (cc: string) => COUNTRIES[cc]?.code ?? cc;

/* ------------------------------------------------------------
   HELPERS
   ------------------------------------------------------------ */
export function localizedName(p: Person, lang: Lang): string {
  if (lang === "fa" && p.fa) return p.fa;
  if (lang === "ar" && p.ar) return p.ar;
  return p.en;
}
export const monthDay = (p: Person): string => {
  const parts = p.dob.split("-");
  return `${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`;
};
export const yearOf = (p: Person): number => parseInt(p.dob.slice(0, 4), 10);
export const monthOf = (p: Person): number => parseInt(p.dob.split("-")[1], 10);
export const dayOf = (p: Person): number => parseInt(p.dob.split("-")[2], 10);
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}
export function eraOf(p: Person): 1 | 2 | 3 | 4 | 5 {
  const y = yearOf(p);
  if (y < 1700) return 1;
  if (y < 1900) return 2;
  if (y < 1960) return 3;
  if (y < 1990) return 4;
  return 5;
}

export const PERSON_BY_ID: Map<string, Person> = new Map(PEOPLE.map((x) => [x.id, x]));
