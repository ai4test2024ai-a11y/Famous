import type { Lang } from "./lib/util";

/* Full interface dictionary: [English, Persian, Arabic] */
const D: Record<string, [string, string, string]> = {
  "brand": ["GUESS YOUR FAMOUS PEOPLE", "حدس بزن افراد مشهور را", "خمّن مشاهيرك"],
  "brand.sub": ["THE GLOBAL LEGENDS GAME", "بازی جهانی افسانه‌ها", "لعبة الأساطير العالمية"],
  "tagline": ["How well do you know the world's most famous people?", "چقدر افراد مشهور جهان را می‌شناسی؟", "ما مدى معرفتك بأشهر شخصيات العالم؟"],

  "nav.home": ["Home", "خانه", "الرئيسية"],
  "nav.play": ["Play", "بازی", "العب"],
  "nav.categories": ["Categories", "دسته‌بندی‌ها", "الفئات"],
  "nav.explore": ["Explore", "کاوش افراد", "استكشف"],
  "nav.leaderboard": ["Leaderboard", "جدول امتیازات", "لوحة الصدارة"],
  "nav.profile": ["Profile", "نمایهٔ من", "ملفي"],

  "btn.playNow": ["PLAY NOW", "همین حالا بازی کن", "العب الآن"],
  "btn.categories": ["CATEGORIES", "دسته‌بندی‌ها", "الفئات"],
  "btn.daily": ["DAILY CHALLENGE", "چالش روزانه", "التحدي اليومي"],
  "btn.leaderboard": ["LEADERBOARD", "جدول امتیازات", "لوحة الصدارة"],
  "btn.birthdate": ["BIRTHDATE QUIZ", "کوییز تاریخ تولد", "اختبار تاريخ الميلاد"],
  "btn.myBirthday": ["MY BIRTHDAY", "تولد من", "عيد ميلادي"],
  "btn.start": ["START GAME", "شروع بازی", "ابدأ اللعبة"],
  "btn.playAgain": ["PLAY AGAIN", "دوباره بازی کن", "العب مرة أخرى"],
  "btn.backHome": ["BACK TO HOME", "بازگشت به خانه", "العودة للرئيسية"],
  "btn.viewBoard": ["VIEW LEADERBOARD", "مشاهدهٔ جدول امتیازات", "عرض لوحة الصدارة"],
  "btn.viewProfile": ["VIEW PROFILE", "مشاهدهٔ کارت", "عرض البطاقة"],
  "btn.playCat": ["PLAY THIS CATEGORY", "بازی در این دسته", "العب هذه الفئة"],
  "btn.loadMore": ["LOAD MORE", "بارگذاری بیشتر", "تحميل المزيد"],
  "btn.save": ["SAVE", "ذخیره", "حفظ"],
  "btn.reveal": ["REVEAL", "نمایش", "اكشف"],
  "btn.findTwins": ["FIND MY TWINS", "هم‌تولدی‌های من", "ابحث عن توأمي"],

  "mode.classic.desc": ["15 questions · mixed categories · smart distractors", "۱۵ سؤال · دسته‌های ترکیبی · گزینه‌های هوشمند", "١٥ سؤالًا · فئات مختلطة · خيارات ذكية"],
  "mode.daily.desc": ["One seeded challenge per day. Climb the daily board.", "روزی یک چالش مشترک برای همهٔ بازیکنان. در جدول روزانه بالا بروید.", "تحدٍّ واحد يوميًا للجميع. تصدّر اللوحة اليومية."],
  "mode.cat.desc": ["Deep-dive a single category and become its expert.", "در یک دسته غرق شو و متخصصش شو.", "تعمّق في فئة واحدة وكن خبيرها."],
  "mode.bday.desc": ["Enter your birthday — Gregorian or Solar Hijri — and play.", "تاریخ تولدت را وارد کن؛ میلادی یا هجری شمسی.", "أدخل عيد ميلادك — ميلاديًا أو هجريًا شمسيًا."],

  "home.kicker": ["THE ULTIMATE FAMOUS-PEOPLE ARENA", "ورزشگاه نهایی افراد مشهور", "ساحة المشاهير الكبرى"],
  "home.live": ["LIVE DATABASE", "پایگاه دادهٔ زنده", "قاعدة بيانات حية"],
  "home.peopleCount": ["famous people", "فرد مشهور", "شخصية مشهورة"],
  "home.categories": ["categories", "دسته‌بندی", "فئة"],
  "home.questionsPlayed": ["questions answered", "سؤال پاسخ‌داده‌شده", "سؤالًا تمت الإجابة عليه"],
  "home.modes": ["GAME MODES", "حالت‌های بازی", "أوضاع اللعب"],
  "home.modesSub": ["Pick your arena", "زمین بازی‌ات را انتخاب کن", "اختر ساحتك"],
  "home.topCats": ["TOP CATEGORIES", "دسته‌های برتر", "أهم الفئات"],
  "home.legend": ["LEGEND OF THE DAY", "افسانهٔ امروز", "أسطورة اليوم"],
  "home.legendSub": ["Can you guess who this is before midnight?", "تا قبل از نیمه‌شب حدس بزن این کیست؟", "هل تخمّن من هذا قبل منتصف الليل؟"],
  "home.how": ["HOW IT WORKS", "چطور کار می‌کند؟", "كيف تعمل اللعبة؟"],
  "home.how1t": ["A DATE APPEARS", "یک تاریخ ظاهر می‌شود", "تظهر تواريخ"],
  "home.how1d": ["Every round shows a birth date — like DECEMBER 25 — and five famous suspects.", "هر راند یک تاریخ تولد نشان می‌دهد — مثل ۲۵ دسامبر — و پنج فرد مشهور.", "كل جولة تعرض تاريخ ميلاد — مثل ٢٥ ديسمبر — وخمسة مرشحين مشهورين."],
  "home.how2t": ["PICK THE LEGEND", "افسانه را انتخاب کن", "اختر الأسطورة"],
  "home.how2d": ["One was born on that exact day. Beat the clock, build streaks, earn XP.", "فقط یکی در همان روز به دنیا آمده. با زمان مسابقه بده، زنجیره بساز، تجربه بگیر.", "واحد فقط وُلد في ذلك اليوم. سابق الوقت وابنِ السلاسل واكسب الخبرة."],
  "home.how3t": ["CLIMB THE WORLD", "در جهان بالا برو", "تصدّر العالم"],
  "home.how3d": ["Unlock achievements, level up, and fight for the global leaderboard.", "دستاوردها را باز کن، سطح بالا برو و برای صدر جدول جهانی بجنگ.", "افتح الإنجازات وارتقِ بالمستوى ونافس على صدارة العالم."],
  "home.browse": ["BROWSE THE ENCYCLOPEDIA", "دانشنامه را مرور کن", "تصفح الموسوعة"],
  "home.browseSub": ["Search 96,000+ legends in English, فارسی or العربية", "بیش از ۹۶٬۰۰۰ افسانه را به انگلیسی، فارسی یا عربی جستجو کن", "ابحث في أكثر من ٩٦٬٠٠٠ أسطورة بالإنجليزية أو الفارسية أو العربية"],
  "home.step": ["STEP", "گام", "الخطوة"],

  "quiz.whoBorn": ["WHO WAS BORN ON THIS DATE?", "چه کسی در این تاریخ متولد شده است؟", "من وُلد في هذا التاريخ؟"],
  "quiz.whoShort": ["WHO WAS BORN ON", "چه کسی متولد شده؟", "من وُلد في هذا اليوم؟"],
  "quiz.choices": ["CHOICES", "گزینه", "خيارات"],
  "quiz.question": ["QUESTION {a} OF {b}", "سؤال {a} از {b}", "السؤال {a} من {b}"],
  "quiz.score": ["SCORE", "امتیاز", "النتيجة"],
  "quiz.streak": ["STREAK", "زنجیره", "السلسلة"],
  "quiz.best": ["BEST", "بهترین", "الأفضل"],
  "quiz.correct": ["CORRECT!", "درست!", "صحيح!"],
  "quiz.wrong": ["WRONG!", "اشتباه!", "خطأ!"],
  "quiz.timeout": ["TIME'S UP!", "وقت تمام شد!", "انتهى الوقت!"],
  "quiz.next": ["NEXT", "بعدی", "التالي"],
  "quiz.results": ["RESULTS", "نتایج", "النتائج"],
  "quiz.complete": ["{a} / {b} QUESTIONS COMPLETE", "{a} از {b} سؤال کامل شد", "اكتمل {a} من {b} سؤالًا"],
  "quiz.finalScore": ["FINAL SCORE", "امتیاز نهایی", "النتيجة النهائية"],
  "quiz.accuracy": ["ACCURACY", "دقت", "الدقة"],
  "quiz.bestStreak": ["BEST STREAK", "بهترین زنجیره", "أفضل سلسلة"],
  "quiz.xp": ["XP EARNED", "تجربهٔ کسب‌شده", "الخبرة المكتسبة"],
  "quiz.levelUp": ["LEVEL UP!", "سطح بالاتر!", "ارتقاء مستوى!"],
  "quiz.newLevel": ["You reached level {a}", "به سطح {a} رسیدی", "وصلت إلى المستوى {a}"],
  "quiz.achUnlocked": ["ACHIEVEMENT UNLOCKED", "دستاورد باز شد", "تم فتح إنجاز"],
  "quiz.points": ["POINTS", "امتیاز", "نقاط"],
  "quiz.timeBonus": ["TIME BONUS", "پاداش سرعت", "مكافأة السرعة"],
  "quiz.streakBonus": ["STREAK BONUS", "پاداش زنجیره", "مكافأة السلسلة"],
  "quiz.perfect": ["PERFECT GAME!", "بازی بی‌نقص!", "لعبة مثالية!"],
  "quiz.correctWas": ["The answer was", "پاسخ درست بود", "الإجابة الصحيحة كانت"],
  "quiz.bornOn": ["born", "متولد", "وُلد"],
  "quiz.calendar": ["CALENDAR", "تقویم", "التقويم"],
  "quiz.gregorian": ["GREGORIAN", "میلادی", "ميلادي"],
  "quiz.jalali": ["SOLAR HIJRI", "هجری شمسی", "هجري شمسي"],
  "quiz.diffLabel": ["DIFFICULTY", "سختی", "الصعوبة"],
  "quiz.locked": ["Daily challenge already completed today — come back tomorrow!", "چالش روزانهٔ امروز انجام شد — فردا برگرد!", "أكملت تحدي اليوم بالفعل — عُد غدًا!"],
  "quiz.timer": ["TIME", "زمان", "الوقت"],

  "diff.1": ["EASY", "آسان", "سهل"],
  "diff.2": ["MEDIUM", "متوسط", "متوسط"],
  "diff.3": ["HARD", "سخت", "صعب"],
  "diff.4": ["IMPOSSIBLE", "غیرممکن", "مستحيل"],

  "era.1": ["CLASSIC ERA", "دوران کلاسیک", "الحقبة الكلاسيكية"],
  "era.2": ["GOLDEN ERA", "عصر طلایی", "العصر الذهبي"],
  "era.3": ["MODERN ERA", "دوران مدرن", "الحقبة الحديثة"],
  "era.4": ["DIGITAL ERA", "عصر دیجیتال", "العصر الرقمي"],
  "era.5": ["NEW GENERATION", "نسل جدید", "الجيل الجديد"],

  "rarity.1": ["RISING", "نوظهور", "صاعد"],
  "rarity.2": ["STAR", "ستاره", "نجم"],
  "rarity.3": ["ICON", "آیکون", "أيقونة"],
  "rarity.4": ["LEGEND", "افسانه", "أسطورة"],

  "common.back": ["Back", "بازگشت", "رجوع"],
  "common.country": ["Country", "کشور", "الدولة"],
  "common.born": ["Born", "تولد", "الميلاد"],
  "common.profession": ["Profession", "حرفه", "المهنة"],
  "common.category": ["Category", "دسته", "الفئة"],
  "common.era": ["Era", "دوران", "الحقبة"],
  "common.popularity": ["Popularity", "محبوبیت", "الشعبية"],
  "common.difficulty": ["Difficulty", "سختی", "الصعوبة"],
  "common.biography": ["Biography", "زندگی‌نامه", "السيرة"],
  "common.facts": ["Legacy", "میراث", "الإرث"],
  "common.related": ["Related arenas", "زمین‌های مرتبط", "الساحات ذات الصلة"],
  "common.jalaliDate": ["Solar Hijri", "هجری شمسی", "هجري شمسي"],
  "common.gregorianDate": ["Gregorian", "میلادی", "ميلادي"],
  "common.all": ["All", "همه", "الكل"],
  "common.close": ["Close", "بستن", "إغلاق"],
  "common.you": ["YOU", "شما", "أنت"],
  "common.search": ["Search", "جستجو", "بحث"],
  "common.sound": ["Sound", "صدا", "الصوت"],
  "common.on": ["ON", "روشن", "مفعّل"],
  "common.off": ["OFF", "خاموش", "مطفأ"],
  "common.language": ["Language", "زبان", "اللغة"],

  "explore.title": ["THE LEGENDS ENCYCLOPEDIA", "دانشنامهٔ افسانه‌ها", "موسوعة الأساطير"],
  "explore.sub": ["A living database of world fame — search in any language.", "پایگاه دادهٔ زندهٔ شهرت جهانی — به هر زبانی جستجو کن.", "قاعدة بيانات حية للشهرة العالمية — ابحث بأي لغة."],
  "explore.ph": ["Search… Messi, مسی, ميسي", "جستجو… مسی، Messi", "ابحث… ميسي، Messi"],
  "explore.legends": ["VERIFIED LEGENDS", "افسانه‌های تأییدشده", "أساطير موثّقة"],
  "explore.registry": ["FULL REGISTRY", "فهرست کامل", "السجل الكامل"],
  "explore.inDb": ["people in database", "نفر در پایگاه داده", "شخصًا في قاعدة البيانات"],
  "explore.results": ["{a} results", "{a} نتیجه", "{a} نتيجة"],
  "explore.empty": ["No legends found — try another name or language.", "افسانه‌ای یافت نشد — نام یا زبان دیگری امتحان کن.", "لا نتائج — جرّب اسمًا أو لغة أخرى."],
  "explore.loading": ["Loading records…", "در حال بارگذاری…", "جارٍ التحميل…"],
  "explore.page": ["Page {a}", "صفحهٔ {a}", "الصفحة {a}"],
  "explore.verified": ["VERIFIED", "تأییدشده", "موثّق"],
  "explore.registryBadge": ["REGISTRY", "فهرست", "سجل"],
  "explore.filterCat": ["Category", "دسته", "الفئة"],
  "explore.filterCountry": ["Country", "کشور", "الدولة"],

  "lb.title": ["LEADERBOARDS", "جدول‌های امتیازات", "لوحات الصدارة"],
  "lb.sub": ["The world's sharpest memory arena", "حافظه‌های تیز جهان این‌جاست", "ساحة أقوى الذاكرات في العالم"],
  "lb.global": ["GLOBAL", "جهانی", "عالمي"],
  "lb.daily": ["DAILY", "روزانه", "يومي"],
  "lb.weekly": ["WEEKLY", "هفتگی", "أسبوعي"],
  "lb.rank": ["RANK", "رتبه", "الترتيب"],
  "lb.player": ["PLAYER", "بازیکن", "اللاعب"],
  "lb.score": ["SCORE", "امتیاز", "النتيجة"],
  "lb.acc": ["ACC", "دقت", "دقة"],
  "lb.streak": ["STREAK", "زنجیره", "سلسلة"],
  "lb.level": ["LEVEL", "سطح", "المستوى"],
  "lb.yourRank": ["Your entry appears after your first finished game.", "پس از نخستین بازی کامل، نام شما اینجا ثبت می‌شود.", "يظهر اسمك بعد أول لعبة مكتملة."],

  "profile.title": ["PLAYER PROFILE", "نمایهٔ بازیکن", "ملف اللاعب"],
  "profile.level": ["LEVEL", "سطح", "المستوى"],
  "profile.xpNext": ["{a} XP to level {b}", "{a} تجربه تا سطح {b}", "{a} خبرة حتى المستوى {b}"],
  "profile.games": ["Games", "بازی‌ها", "الألعاب"],
  "profile.questions": ["Questions", "سؤال‌ها", "الأسئلة"],
  "profile.correct": ["Correct", "درست", "صحيحة"],
  "profile.accuracy": ["Accuracy", "دقت", "الدقة"],
  "profile.bestScore": ["Best score", "بهترین امتیاز", "أفضل نتيجة"],
  "profile.bestStreak": ["Best streak", "بهترین زنجیره", "أفضل سلسلة"],
  "profile.favCat": ["Favorite arena", "زمین موردعلاقه", "الساحة المفضلة"],
  "profile.editName": ["Tap to change your name", "برای تغییر نام ضربه بزن", "اضغط لتغيير اسمك"],
  "profile.stats": ["CAREER STATS", "آمار حرفه‌ای", "إحصاءات المسيرة"],
  "profile.achTitle": ["ACHIEVEMENTS", "دستاوردها", "الإنجازات"],
  "profile.locked": ["LOCKED", "قفل", "مقفل"],
  "profile.unlocked": ["UNLOCKED", "بازشده", "مفتوح"],
  "profile.noneYet": ["Play games to fill this hall of fame.", "با بازی‌کردن این تالار افتخار را پر کن.", "العب لملء قاعة الشهرة هذه."],

  "ach.firstWin": ["First Win", "نخستین پیروزی", "أول فوز"],
  "ach.firstWin.d": ["Finish a game with more right than wrong", "یک بازی را با برد به پایان برسان", "أنهِ لعبة بفوز"],
  "ach.streak5": ["On Fire", "آتشین", "مشتعل"],
  "ach.streak5.d": ["Hit a 5-answer streak", "زنجیرهٔ ۵ پاسخ درست", "سلسلة ٥ إجابات"],
  "ach.streak10": ["Unstoppable", "توقف‌ناپذیر", "لا يُوقف"],
  "ach.streak10.d": ["Hit a 10-answer streak", "زنجیرهٔ ۱۰ پاسخ درست", "سلسلة ١٠ إجابات"],
  "ach.streak25": ["Inferno", "جهنم سوزان", "الجحيم"],
  "ach.streak25.d": ["Hit a 25-answer streak", "زنجیرهٔ ۲۵ پاسخ درست", "سلسلة ٢٥ إجابة"],
  "ach.acc90": ["Sharpshooter", "تیرانداز ماهر", "قنّاص"],
  "ach.acc90.d": ["90%+ accuracy in a full game", "دقت ۹۰٪+ در یک بازی کامل", "دقة ٩٠٪+ في لعبة كاملة"],
  "ach.football": ["Football Expert", "کارشناس فوتبال", "خبير كرة القدم"],
  "ach.football.d": ["25 correct football answers", "۲۵ پاسخ درست در فوتبال", "٢٥ إجابة صحيحة في كرة القدم"],
  "ach.movies": ["Movie Expert", "کارشناس سینما", "خبير السينما"],
  "ach.movies.d": ["25 correct cinema answers", "۲۵ پاسخ درست در سینما", "٢٥ إجابة صحيحة في السينما"],
  "ach.music": ["Music Expert", "کارشناس موسیقی", "خبير الموسيقى"],
  "ach.music.d": ["25 correct music answers", "۲۵ پاسخ درست در موسیقی", "٢٥ إجابة صحيحة في الموسيقى"],
  "ach.iran": ["Iranian Legends", "افسانه‌های ایرانی", "أساطير إيران"],
  "ach.iran.d": ["20 correct answers about Iranians", "۲۰ پاسخ درست دربارهٔ ایرانیان", "٢٠ إجابة صحيحة عن الإيرانيين"],
  "ach.world": ["World Knowledge", "دانش جهانی", "معرفة عالمية"],
  "ach.world.d": ["Correct answers from 15 countries", "پاسخ درست از ۱۵ کشور", "إجابات صحيحة من ١٥ دولة"],
  "ach.master": ["Quiz Master", "استاد کوییز", "أستاذ الاختبار"],
  "ach.master.d": ["A perfect 15/15 game", "بازی بی‌نقص ۱۵ از ۱۵", "لعبة مثالية ١٥/١٥"],
  "ach.daily3": ["Ritual", "اهلِ هر روز", "الملتزم"],
  "ach.daily3.d": ["Complete 3 daily challenges", "۳ چالش روزانه را کامل کن", "أكمل ٣ تحديات يومية"],
  "ach.level10": ["Veteran", "کهنه‌کار", "المخضرم"],
  "ach.level10.d": ["Reach level 10", "به سطح ۱۰ برس", "ابلغ المستوى ١٠"],
  "ach.explorer": ["Archivist", "آرشیودار", "أمين الأرشيف"],
  "ach.explorer.d": ["Open 25 legend profiles", "۲۵ کارت افسانه را باز کن", "افتح ٢٥ بطاقة أسطورة"],

  "bday.title": ["MY BIRTHDAY MATCH", "مسابقهٔ تولد من", "مباراة عيد ميلادي"],
  "bday.sub": ["Enter your birthday in either calendar — we handle the conversion.", "تاریخ تولدت را به هر تقویمی وارد کن — تبدیل با ما.", "أدخل عيد ميلادك بأي تقويم — والتحويل علينا."],
  "bday.year": ["Year", "سال", "السنة"],
  "bday.month": ["Month", "ماه", "الشهر"],
  "bday.day": ["Day", "روز", "اليوم"],
  "bday.twins": ["LEGENDS BORN ON YOUR DAY", "افسانه‌های هم‌روز تو", "أساطير وُلدت في يومك"],
  "bday.twinsNone": ["No verified legend shares your exact day — yet you can still play!", "هنوز هیچ افسانه‌ای دقیقاً هم‌روز تو نیست — ولی بازی برقرار است!", "لا أسطورة موثّقة تشاركك يومك تمامًا — لكن يمكنك اللعب!"],
  "bday.invalid": ["Please enter a valid date in the selected calendar.", "لطفاً تاریخ معتبری در تقویم انتخابی وارد کن.", "رجاءً أدخل تاريخًا صحيحًا في التقويم المحدد."],

  "toast.ach": ["Achievement unlocked!", "دستاورد باز شد!", "تم فتح إنجاز!"],
  "toast.level": ["Level up!", "سطح بالاتر!", "ارتقاء!"],
  "toast.saved": ["Name saved", "نام ذخیره شد", "تم حفظ الاسم"],

  "footer.about": ["The world's most famous people, turned into the ultimate guessing game.", "مشهورترین افراد جهان، در قالب هیجان‌انگیزترین بازی حدس.", "أشهر شخصيات العالم في لعبة التخمين الكبرى."],
  "footer.modes": ["Modes", "حالت‌ها", "الأوضاع"],
  "footer.top": ["Top arenas", "زمین‌های برتر", "أهم الساحات"],
  "footer.note": ["All portraits are original AI-stylized artwork. Not affiliated with any person shown.", "همهٔ چهره‌نگاره‌ها آثار سبک‌پردازی‌شدهٔ هوش مصنوعی و اورجینال هستند و وابستگی به افراد نمایش‌داده‌شده ندارند.", "جميع الصور أعمال فنية أصلية بأسلوب الذكاء الاصطناعي وغير منتسبة لأي شخصية معروضة."],
  "footer.rights": ["All rights reserved.", "همهٔ حقوق محفوظ است.", "جميع الحقوق محفوظة."],
};

export const G_MONTHS: Record<Lang, string[]> = {
  en: ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"],
  fa: ["ژانویه","فوریه","مارس","آوریل","مه","ژوئن","ژوئیه","اوت","سپتامبر","اکتبر","نوامبر","دسامبر"],
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
};

export const J_MONTHS_FA = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

export function monthNameG(m1: number, lang: Lang) { return G_MONTHS[lang][m1 - 1]; }
export function monthNameJ(m1: number) { return J_MONTHS_FA[m1 - 1]; }

/* cc -> [en, fa, ar, code3] */
export const COUNTRIES: Record<string, [string, string, string, string]> = {
  AR: ["Argentina","آرژانتین","الأرجنتين","ARG"], BR: ["Brazil","برزیل","البرازيل","BRA"],
  DE: ["Germany","آلمان","ألمانيا","GER"], ES: ["Spain","اسپانیا","إسبانيا","ESP"],
  FR: ["France","فرانسه","فرنسا","FRA"], GB: ["United Kingdom","بریتانیا","المملكة المتحدة","GBR"],
  IT: ["Italy","ایتالیا","إيطاليا","ITA"], NL: ["Netherlands","هلند","هولندا","NED"],
  PT: ["Portugal","پرتغال","البرتغال","POR"], US: ["United States","ایالات متحده","الولايات المتحدة","USA"],
  CA: ["Canada","کانادا","كندا","CAN"], IR: ["Iran","ایران","إيران","IRI"],
  EG: ["Egypt","مصر","مصر","EGY"], SA: ["Saudi Arabia","عربستان سعودی","السعودية","KSA"],
  TR: ["Turkey","ترکیه","تركيا","TUR"], IN: ["India","هند","الهند","IND"],
  JP: ["Japan","ژاپن","اليابان","JPN"], KR: ["South Korea","کرهٔ جنوبی","كوريا الجنوبية","KOR"],
  CN: ["China","چین","الصين","CHN"], AU: ["Australia","استرالیا","أستراليا","AUS"],
  ZA: ["South Africa","آفریقای جنوبی","جنوب أفريقيا","RSA"], NG: ["Nigeria","نیجریه","نيجيريا","NGA"],
  RS: ["Serbia","صربستان","صربيا","SRB"], HR: ["Croatia","کرواسی","كرواتيا","CRO"],
  PL: ["Poland","لهستان","بولندا","POL"], SE: ["Sweden","سوئد","السويد","SWE"],
  UA: ["Ukraine","اوکراین","أوكرانيا","UKR"], RU: ["Russia","روسیه","روسيا","RUS"],
  CH: ["Switzerland","سوئیس","سويسرا","SUI"], BE: ["Belgium","بلژیک","بلجيكا","BEL"],
  MX: ["Mexico","مکزیک","المكسيك","MEX"], CO: ["Colombia","کلمبیا","كولومبيا","COL"],
  UY: ["Uruguay","اروگوئه","الأوروغواي","URU"], CU: ["Cuba","کوبا","كوبا","CUB"],
  JM: ["Jamaica","جامائیکا","جامايكا","JAM"], KE: ["Kenya","کنیا","كينيا","KEN"],
  MA: ["Morocco","مراکش","المغرب","MAR"], DZ: ["Algeria","الجزیره","الجزائر","ALG"],
  QA: ["Qatar","قطر","قطر","QAT"], ID: ["Indonesia","اندونزی","إندونيسيا","INA"],
  NZ: ["New Zealand","نیوزیلند","نيوزيلندا","NZL"], GR: ["Greece","یونان","اليونان","GRE"],
  AT: ["Austria","اتریش","النمسا","AUT"], NO: ["Norway","نروژ","النرويج","NOR"],
  DK: ["Denmark","دانمارک","الدنمارك","DEN"], PK: ["Pakistan","پاکستان","باكستان","PAK"],
  LB: ["Lebanon","لبنان","لبنان","LIB"], IL: ["Israel","اسرائیل","إسرائيل","ISR"],
  ET: ["Ethiopia","اتیوپی","إثيوبيا","ETH"], PH: ["Philippines","فیلیپین","الفلبين","PHI"],
  IQ: ["Iraq","عراق","العراق","IRQ"], CL: ["Chile","شیلی","تشيلي","CHI"],
};

export function countryName(cc: string, lang: Lang): string {
  const c = COUNTRIES[cc];
  return c ? c[lang === "en" ? 0 : lang === "fa" ? 1 : 2] : cc;
}
export function countryCode3(cc: string): string {
  return COUNTRIES[cc]?.[3] ?? cc;
}

export function makeT(lang: Lang) {
  const idx = lang === "en" ? 0 : lang === "fa" ? 1 : 2;
  return function t(key: string, vars?: Record<string, number | string>): string {
    const row = D[key];
    let s = row ? row[idx] : key;
    if (vars) {
      for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
    }
    return s;
  };
}

export function locDateGregorian(dob: string, lang: Lang, digits: (x: string | number) => string): string {
  const [y, m, d] = dob.split("-").map(Number);
  if (lang === "en") return `${G_MONTHS.en[m - 1]} ${d}, ${y}`;
  return `${digits(d)} ${G_MONTHS[lang][m - 1]} ${digits(y)}`;
}
