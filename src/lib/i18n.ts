import type { Lang } from "../data/people";

/* Full interface dictionary: [English, Persian, Arabic] */
const D: Record<string, [string, string, string]> = {
  "brand": ["GUESS YOUR FAMOUS PEOPLE", "حدس بزن افراد مشهور را", "خمّن مشاهيرك"],
  "brand.sub": ["THE GLOBAL LEGENDS QUIZ", "بازی جهانی افسانه‌ها", "لعبة الأساطير العالمية"],
  "tagline": ["How well do you know the world's most famous people?", "چقدر افراد مشهور جهان را می‌شناسی؟", "ما مدى معرفتك بأشهر شخصيات العالم؟"],

  "nav.home": ["Home", "خانه", "الرئيسية"],
  "nav.play": ["Play", "بازی", "العب"],
  "nav.board": ["Leaderboard", "جدول امتیازات", "لوحة الصدارة"],
  "nav.profile": ["Profile", "نمایهٔ من", "ملفي"],
  "nav.explore": ["Legends", "افسانه‌ها", "الأساطير"],

  "home.play": ["PLAY NOW", "همین حالا بازی کن", "العب الآن"],
  "home.modes": ["GAME MODES", "حالت‌های بازی", "أوضاع اللعب"],
  "home.pick": ["Pick your arena & difficulty", "زمین و سختی بازی را انتخاب کن", "اختر ساحتك ومستوى الصعوبة"],
  "home.legend": ["LEGEND OF THE DAY", "افسانهٔ امروز", "أسطورة اليوم"],
  "home.legendSub": ["Can you name this legend before midnight?", "تا نیمه‌شب حدس بزن این کیست؟", "هل تخمّن من هذا قبل منتصف الليل؟"],
  "home.reveal": ["REVEAL", "نمایش", "اكشف"],
  "home.stats.people": ["legends", "افسانه", "أسطورة"],
  "home.stats.cats": ["categories", "دسته‌بندی", "فئة"],
  "home.stats.answered": ["questions answered", "سؤال پاسخ‌داده‌شده", "سؤالًا تمت الإجابة عليه"],

  "mode.classic": ["Classic", "کلاسیک", "كلاسيكي"],
  "mode.classic.d": ["15 legends · 4 choices · hints allowed", "۱۵ افسانه · ۴ گزینه · با سرنخ", "١٥ أسطورة · ٤ خيارات · مع تلميحات"],
  "mode.time": ["Time Challenge", "چالش زمان", "تحدي الوقت"],
  "mode.time.d": ["12s per question — pure speed", "۱۲ ثانیه برای هر سؤال — سرعت خالص", "١٢ ثانية لكل سؤال — سرعة خالصة"],
  "mode.streak": ["Streak", "زنجیره", "السلسلة"],
  "mode.streak.d": ["Play until 3 misses — chase the combo", "تا ۳ خطا بازی کن — زنجیره بساز", "العب حتى ٣ أخطاء — ابنِ السلسلة"],
  "mode.daily": ["Daily Challenge", "چالش روزانه", "التحدي اليومي"],
  "mode.daily.d": ["Same 10 legends for everyone today", "امروز برای همه یک ۱۰ سؤال مشترک", "١٠ أسئلة مشتركة للجميع اليوم"],

  "diff.label": ["DIFFICULTY", "سختی", "الصعوبة"],
  "diff.1": ["EASY", "آسان", "سهل"],
  "diff.2": ["MEDIUM", "متوسط", "متوسط"],
  "diff.3": ["HARD", "سخت", "صعب"],
  "diff.4": ["EXPERT", "حرفه‌ای", "خبير"],
  "diff.locked": ["Reach {a}% on {b} to unlock", "برای باز شدن {a}٪ در {b} بگیر", "احصل على {a}٪ في {b} للفتح"],

  "quiz.whoBorn": ["WHO WAS BORN ON THIS DATE?", "چه کسی در این تاریخ متولد شده است؟", "من وُلد في هذا التاريخ؟"],
  "quiz.question": ["QUESTION {a} OF {b}", "سؤال {a} از {b}", "السؤال {a} من {b}"],
  "quiz.score": ["SCORE", "امتیاز", "النتيجة"],
  "quiz.streak": ["STREAK", "زنجیره", "السلسلة"],
  "quiz.time": ["TIME", "زمان", "الوقت"],
  "quiz.correct": ["CORRECT!", "درست!", "صحيح!"],
  "quiz.wrong": ["WRONG!", "اشتباه!", "خطأ!"],
  "quiz.timeout": ["TIME'S UP!", "وقت تمام شد!", "انتهى الوقت!"],
  "quiz.skipped": ["SKIPPED", "رد شد", "تم التخطي"],
  "quiz.next": ["NEXT", "بعدی", "التالي"],
  "quiz.results": ["RESULTS", "نتایج", "النتائج"],
  "quiz.finalScore": ["FINAL SCORE", "امتیاز نهایی", "النتيجة النهائية"],
  "quiz.accuracy": ["ACCURACY", "دقت", "الدقة"],
  "quiz.bestStreak": ["BEST STREAK", "بهترین زنجیره", "أفضل سلسلة"],
  "quiz.correctCount": ["CORRECT", "درست", "صحيحة"],
  "quiz.wrongCount": ["WRONG", "اشتباه", "خاطئة"],
  "quiz.timeTaken": ["TIME", "زمان", "الوقت"],
  "quiz.playAgain": ["PLAY AGAIN", "دوباره بازی کن", "العب مرة أخرى"],
  "quiz.nextLevel": ["NEXT LEVEL", "مرحلهٔ بعد", "المستوى التالي"],
  "quiz.home": ["HOME", "خانه", "الرئيسية"],
  "quiz.viewBoard": ["VIEW LEADERBOARD", "مشاهدهٔ جدول", "عرض اللوحة"],
  "quiz.complete": ["{a} / {b} COMPLETE", "{a} از {b} کامل شد", "اكتمل {a} من {b}"],
  "quiz.perfect": ["PERFECT GAME!", "بازی بی‌نقص!", "لعبة مثالية!"],
  "quiz.correctWas": ["The answer was", "پاسخ درست بود", "الإجابة الصحيحة كانت"],
  "quiz.knownFor": ["Known for", "معروف برای", "مشهور بـ"],
  "quiz.newBest": ["NEW BEST SCORE!", "رکورد جدید!", "رقم قياسي جديد!"],
  "quiz.locked": ["Daily challenge done — back tomorrow!", "چالش امروز انجام شد — فردا برگرد!", "أنجزت تحدي اليوم — عُد غدًا!"],
  "quiz.gameOver": ["GAME OVER", "پایان بازی", "انتهت اللعبة"],
  "quiz.misses": ["MISSES", "خطاها", "الأخطاء"],

  "hint.label": ["HINT", "سرنخ", "تلميح"],
  "hint.country": ["Country", "کشور", "الدولة"],
  "hint.job": ["Field", "حرفه", "المجال"],
  "hint.famous": ["Known for", "معروف برای", "مشهور بـ"],
  "hint.letter": ["First letter", "حرف اول", "الحرف الأول"],
  "hint.cost": ["−{a} pts", "−{a} امتیاز", "−{a} نقطة"],
  "hint.used": ["USED", "استفاده شد", "مستخدم"],
  "skip": ["SKIP", "رد کردن", "تخطّي"],

  "sr.correct": ["Correct! You earned {a} points. Total {b}.", "درست! {a} امتیاز گرفتی. مجموع {b}.", "صحيح! كسبت {a} نقطة. المجموع {b}."],
  "sr.wrong": ["Wrong. The answer was {a}.", "اشتباه. پاسخ درست {a} بود.", "خطأ. الإجابة كانت {a}."],
  "sr.timeout": ["Time is up. The answer was {a}.", "وقت تمام شد. پاسخ درست {a} بود.", "انتهى الوقت. الإجابة كانت {a}."],
  "sr.question": ["Question {a} of {b}. Who was born on this date?", "سؤال {a} از {b}. چه کسی در این تاریخ متولد شده؟", "السؤال {a} من {b}. من وُلد في هذا التاريخ؟"],

  "board.title": ["LEADERBOARDS", "جدول‌های امتیازات", "لوحات الصدارة"],
  "board.sub": ["The world's sharpest memory arena", "حافظه‌های تیز جهان این‌جاست", "ساحة أقوى الذاكرات"],
  "board.rank": ["RANK", "رتبه", "الترتيب"],
  "board.player": ["PLAYER", "بازیکن", "اللاعب"],
  "board.score": ["SCORE", "امتیاز", "النتيجة"],
  "board.acc": ["ACC", "دقت", "دقة"],
  "board.streak": ["STREAK", "زنجیره", "سلسلة"],
  "board.you": ["YOU", "شما", "أنت"],
  "board.local": ["Saved on this device — a real backend can plug in here later.", "روی این دستگاه ذخیره می‌شود — بعداً می‌توان سرور واقعی وصل کرد.", "يُحفظ على هذا الجهاز — يمكن ربط خادم حقيقي لاحقًا."],

  "profile.title": ["PLAYER PROFILE", "نمایهٔ بازیکن", "ملف اللاعب"],
  "profile.level": ["LEVEL", "سطح", "المستوى"],
  "profile.games": ["Games", "بازی‌ها", "الألعاب"],
  "profile.questions": ["Questions", "سؤال‌ها", "الأسئلة"],
  "profile.correct": ["Correct", "درست", "صحيحة"],
  "profile.accuracy": ["Accuracy", "دقت", "الدقة"],
  "profile.best": ["Best score", "بهترین امتیاز", "أفضل نتيجة"],
  "profile.streak": ["Best streak", "بهترین زنجیره", "أفضل سلسلة"],
  "profile.xp": ["XP", "تجربه", "الخبرة"],
  "profile.edit": ["Tap to change name", "برای تغییر نام ضربه بزن", "اضغط لتغيير الاسم"],
  "profile.save": ["SAVE", "ذخیره", "حفظ"],
  "profile.reset": ["RESET PROGRESS", "پاک کردن پیشرفت", "إعادة التعيين"],

  "explore.title": ["THE LEGENDS", "افسانه‌ها", "الأساطير"],
  "explore.sub": ["Browse every famous person in the database.", "همهٔ افراد مشهور پایگاه داده را مرور کن.", "تصفح كل المشاهير في قاعدة البيانات."],
  "explore.ph": ["Search… Messi, مسی, ميسي", "جستجو… مسی، Messi", "ابحث… ميسي، Messi"],
  "explore.all": ["All", "همه", "الكل"],
  "explore.empty": ["No legends found.", "افسانه‌ای یافت نشد.", "لا نتائج."],

  "common.born": ["Born", "تولد", "الميلاد"],
  "common.country": ["Country", "کشور", "الدولة"],
  "common.field": ["Field", "حرفه", "المجال"],
  "common.sound": ["Sound", "صدا", "الصوت"],
  "common.language": ["Language", "زبان", "اللغة"],
  "common.close": ["Close", "بستن", "إغلاق"],
  "common.back": ["Back", "بازگشت", "رجوع"],

  "era.1": ["Ancient", "باستان", "العصور القديمة"],
  "era.2": ["Classical", "کلاسیک", "الكلاسيكية"],
  "era.3": ["Early Modern", "اوایل مدرن", "الحديثة المبكرة"],
  "era.4": ["20th Century", "قرن بیستم", "القرن العشرون"],
  "era.5": ["Modern", "مدرن", "الحديثة"],
};

export const G_MONTHS: Record<Lang, string[]> = {
  en: ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"],
  fa: ["ژانویه","فوریه","مارس","آوریل","مه","ژوئن","ژوئیه","اوت","سپتامبر","اکتبر","نوامبر","دسامبر"],
  ar: ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
};

export function makeT(lang: Lang) {
  const idx = lang === "en" ? 0 : lang === "fa" ? 1 : 2;
  return function t(key: string, vars?: Record<string, number | string>): string {
    const row = D[key];
    let s = row ? row[idx] : key;
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  };
}
export const monthNameG = (m1: number, lang: Lang) => G_MONTHS[lang][m1 - 1];
