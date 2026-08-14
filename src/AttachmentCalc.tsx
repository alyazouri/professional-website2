import { useState } from "react";
import { useLang } from "./LanguageContext";

type Attachment = {
  id: string;
  icon: string;
  nameAr: string;
  nameEn: string;
  recoilMod: number; // -0.25 (مخفّف) لـ 0 (بدون)
  descAr: string;
  descEn: string;
};

const MUZZLE: Attachment[] = [
  { id: "none", icon: "⊘", nameAr: "بدون", nameEn: "None", recoilMod: 0, descAr: "ارتداد كامل", descEn: "Full recoil" },
  { id: "comp", icon: "🔊", nameAr: "كومبنسيتور", nameEn: "Compensator", recoilMod: -0.25, descAr: "يخفّض الارتداد العمودي والأفقي 25%", descEn: "Reduces vertical+horizontal recoil 25%" },
  { id: "flash", icon: "💡", nameAr: "فلاش هايدر", nameEn: "Flash hider", recoilMod: -0.10, descAr: "يخفي الوميض + يخفّض 10%", descEn: "Hides flash + reduces 10%" },
];

const GRIP: Attachment[] = [
  { id: "none", icon: "⊘", nameAr: "بدون", nameEn: "None", recoilMod: 0, descAr: "بدون تحكم إضافي", descEn: "No extra control" },
  { id: "vertical", icon: "⬇️", nameAr: "جريب عمودي", nameEn: "Vertical Grip", recoilMod: -0.20, descAr: "يخفّض الارتداد العمودي 20%", descEn: "Reduces vertical recoil 20%" },
  { id: "angled", icon: "↘️", nameAr: "جريب زاوي", nameEn: "Angled Grip", recoilMod: -0.10, descAr: "أسرع ADS + يخفّض 10%", descEn: "Faster ADS + reduces 10%" },
  { id: "thumb", icon: "👍", nameAr: "ثَمب جريب", nameEn: "Thumb Grip", recoilMod: -0.12, descAr: "أسرع ADS scoped + 12%", descEn: "Faster scoped ADS + 12%" },
  { id: "half", icon: "🌓", nameAr: "هاف جريب", nameEn: "Half Grip", recoilMod: -0.18, descAr: "يخفّض 18% + استقرار", descEn: "Reduces 18% + stability" },
];

interface Props {
  baseAds: number; // قيمة ADS قبل الإضافات
}

export function AttachmentCalc({ baseAds }: Props) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [muzzle, setMuzzle] = useState("comp");
  const [grip, setGrip] = useState("vertical");

  const m = MUZZLE.find(x => x.id === muzzle)!;
  const g = GRIP.find(x => x.id === grip)!;

  // التأثير المركّب
  const totalMod = 1 + m.recoilMod + g.recoilMod; // مثلاً 1 - 0.25 - 0.20 = 0.55
  const adjustedAds = Math.round(baseAds * totalMod);

  // تأثير على ثبات الرش (نسبة تحسّن)
  const stabilityBoost = Math.round((1 - totalMod) * 100);

  const stabilityColor =
    stabilityBoost >= 40 ? "text-emerald-300" :
    stabilityBoost >= 25 ? "text-amber-300" :
    stabilityBoost >= 10 ? "text-orange-300" : "text-red-300";

  return (
    <div className="card neon-box rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔧</span>
          <div>
            <div className="text-sm font-bold text-white">
              {isAr ? "حاسبة الإضافات" : "Attachment Calculator"}
            </div>
            <div className="text-[10px] text-white/40">
              {isAr ? "اضبط ADS حسب إضافاتك" : "Tune ADS by your attachments"}
            </div>
          </div>
        </div>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">PUBG</span>
      </div>

      {/* Muzzle */}
      <div className="mb-4">
        <div className="mb-2 text-[11px] font-bold text-white/60">{isAr ? " muzzle (الكاتم)" : "Muzzle"}</div>
        <div className="grid grid-cols-3 gap-2">
          {MUZZLE.map(item => (
            <button
              key={item.id}
              onClick={() => setMuzzle(item.id)}
              className={`rounded-xl p-2.5 text-center transition-all ${
                muzzle === item.id ? "bg-orange-500/20 ring-2 ring-orange-400/50" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-lg">{item.icon}</div>
              <div className="mt-0.5 text-[9px] font-bold text-white">{isAr ? item.nameAr : item.nameEn}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Grip */}
      <div className="mb-4">
        <div className="mb-2 text-[11px] font-bold text-white/60">{isAr ? "القبضة (Grip)" : "Grip"}</div>
        <div className="grid grid-cols-5 gap-1.5">
          {GRIP.map(item => (
            <button
              key={item.id}
              onClick={() => setGrip(item.id)}
              className={`rounded-xl p-2 text-center transition-all ${
                grip === item.id ? "bg-orange-500/20 ring-2 ring-orange-400/50" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-base">{item.icon}</div>
              <div className="mt-0.5 text-[8px] font-bold text-white">{isAr ? item.nameAr : item.nameEn}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/5 bg-black/20 p-4">
          <div className="text-[10px] text-white/40">{isAr ? "ADS المعدّل" : "Adjusted ADS"}</div>
          <div className="flex items-end gap-1 mt-1">
            <span className="font-display text-2xl font-black text-orange-300">{adjustedAds}</span>
            <span className="text-xs text-white/30 mb-1">%</span>
          </div>
          <div className="mt-1 text-[9px] text-white/30">
            {isAr ? `بدون: ${baseAds}% → مع الإضافات` : `Base: ${baseAds}% → with attachments`}
          </div>
        </div>
        <div className="rounded-xl border border-white/5 bg-black/20 p-4">
          <div className="text-[10px] text-white/40">{isAr ? "تحسّن الثبات" : "Stability Boost"}</div>
          <div className={`flex items-end gap-1 mt-1 ${stabilityColor}`}>
            <span className="font-display text-2xl font-black">+{stabilityBoost}</span>
            <span className="text-xs text-white/30 mb-1">%</span>
          </div>
          <div className="mt-1 text-[9px] text-white/30">
            {isAr ? "أقل ارتداد = رش أنظف" : "Less recoil = cleaner spray"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3">
        <div className="flex items-start gap-2 text-[10px] text-white/60">
          <span className="text-emerald-300">💡</span>
          <span>
            {isAr
              ? `مع ${isAr ? m.nameAr : m.nameEn} + ${isAr ? g.nameAr : g.nameEn}، ارتداد سلاحك انخفض ${stabilityBoost}%. الكروسهير يثبت أكثر على الهدف.`
              : `With ${m.nameEn} + ${g.nameEn}, your recoil dropped ${stabilityBoost}%. Crosshair holds steadier on target.`}
          </span>
        </div>
      </div>
    </div>
  );
}
