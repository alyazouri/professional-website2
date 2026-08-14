import { useLang } from "./LanguageContext";
import { t } from "./i18n";
import { getWeaponProfile, type WeaponProfile } from "./weaponProfiles";
import { PRO_PROFILES, type Device, type ProProfileId } from "./data";

export type GyroMode = "off" | "scope" | "always";

export type SensParams = {
  deviceId: string;
  device: Device;
  brandId: string;
  fingers: number;
  gyroMode: GyroMode;
  weaponId: string;
  weaponName: string;
  weaponRecoil: number;
  weaponRange: number;
  weaponType: string;
  proProfile: string;
};

export type ScopeSens = {
  tpp: number; fpp: number; noScope: number; red: number;
  scope2: number; scope3: number; scope4: number; scope6: number; scope8: number;
};

export type GameplaySettings = {
  sprintSensitivity: number;
  joystickSize: number;
  tppFOV: number;
  fppFOV: number;
  aimAssist: boolean;          // دايماً false — النظام مصمم بدون aim assist
  crosshairHeight: number;     // ارتفاع الكروسهير الأمثل للهدشوت (%)
  headshotLockScore: number;   // نسبة قوة إمساك الرأس (0-100)
};

export type Sens = {
  cam: ScopeSens;
  ads: ScopeSens;
  gyro: { cam: ScopeSens; ads: ScopeSens };
  freeLook: { cam: number; parashoot: number; vehicle: number };
  gameplay: GameplaySettings;
  aiScore: number;
  factors: { deviceFactor: number; weaponFactor: number; fingerFactor: number; profileFactor: number };
};

// ═══════════════════════════════════════════════════════════════
//  PUBG MOBILE GLOBAL 2026 — ENGINE V5 FINAL
//
//  4 أنظمة مستقلة:
//    Camera:   للمسح بدون إطلاق — "as LOW as you can control"
//    ADS:      للتتبع أثناء الإطلاق — "as HIGH as you can control"
//    Gyro:     تعديل بميلان الجهاز بدون إطلاق
//    Gyro ADS: تحكم بالارتداد بميلان الجهاز أثناء الإطلاق
//
//  كل scope مستقل. كل نظام مستقل.
//  القيم الأساسية هي الهدف النهائي.
//  التعديلات إضافية (+/-) وليست مضاعفات تراكمية.
// ═══════════════════════════════════════════════════════════════

const ROWS: (keyof ScopeSens)[] = ["tpp","fpp","noScope","red","scope2","scope3","scope4","scope6","scope8"];
const HIPFIRE: (keyof ScopeSens)[] = ["tpp","fpp","noScope"];

export const SCOPE_DEFS: { key: keyof ScopeSens; icon: string; labelKey: string }[] = [
  { key: "tpp", icon: "👁️", labelKey: "sens_tpp" },
  { key: "fpp", icon: "👁️", labelKey: "sens_fpp" },
  { key: "red", icon: "🔴", labelKey: "sens_red_dot" },
  { key: "scope2", icon: "🎯", labelKey: "sens_2x" },
  { key: "scope3", icon: "🎯", labelKey: "sens_3x" },
  { key: "scope4", icon: "🔭", labelKey: "sens_4x" },
  { key: "scope6", icon: "🔭", labelKey: "sens_6x" },
  { key: "scope8", icon: "🔭", labelKey: "sens_8x" },
];

const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ═══════════════════════════════════════════════════════════════
//  STABLE CASCADE ENGINE — منحنى رياضي يضمن ثبات تام
//
//  المشكلة: القيم الثابتة تخلق فجوات غير منتظمة بين السكوبات
//  → الإحساس يتغير عند كل تبديل سكوب = عدم ثبات
//
//  الحل: منحنى قوة (Power Law) يُحسب من معادلة واحدة
//    S(zoom) = anchor / (zoom / baseZoom) ^ exponent
//
//  هذا يضمن:
//    • نسبة ثابتة بين كل سكوب والتالي
//    • ذاكرة عضلية متّسقة 100%
//    • صفر قفزات مفاجئة
//    • تبديل السكوبات = نفس الإحساس دائماً
// ═══════════════════════════════════════════════════════════════

// معاملات التكبير الفعلية لكل سكوب في PUBG Mobile
const SCOPE_ZOOM: Record<string, number> = {
  red: 1.4, scope2: 2.1, scope3: 3.0, scope4: 4.0, scope6: 6.1, scope8: 8.1,
};
const BASE_ZOOM = 1.4; // Red Dot هو نقطة الارتكاز

// يبني منحنى ثابت رياضياً من نقطة ارتكاز وأُسّ
function cascade(anchor: number, exponent: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, z] of Object.entries(SCOPE_ZOOM)) {
    out[k] = Math.round(anchor / Math.pow(z / BASE_ZOOM, exponent));
  }
  return out;
}

// يبني جدول قناص كامل (4 أنظمة) من منحنيات رياضية مستقرة
function buildSniper(
  camA: number, camE: number,
  adsA: number, adsE: number,
  gyroA: number, gyroE: number,
  gyroAdsA: number, gyroAdsE: number,
): Record<string, SniperBase> {
  const c = cascade(camA, camE);
  const a = cascade(adsA, adsE);
  const g = cascade(gyroA, gyroE);
  const ga = cascade(gyroAdsA, gyroAdsE);
  const out: Record<string, SniperBase> = {};
  for (const k of Object.keys(SCOPE_ZOOM)) {
    out[k] = { cam: c[k], ads: a[k], gyro: g[k], gyroAds: ga[k] };
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════
//  PUBG MOBILE GLOBAL — FINAL SENSITIVITY VALUES
//
//  المصادر الموثوقة:
//    cashify.in 2026:    Camera TPP 95-100, FPP 85-90, Red 50-55
//    esports.net 2026:   Camera TPP 95-100, Red 50-55, 8x 10-13
//    Sportskeeda:        Gyro TPP 350-400, Red 350-400, 3x 320-350
//    Jonathan Gaming:    Gyro Red 90-95, ADS Gyro Red 300, 3x 236
//    BitTopup 3.5:       Gyro 6x 120-195, 8x 55-70
//    ar-pay.com 2026:    High-end Camera TPP 95-100, Red 55-60
//
//  الأنظمة الأربعة مستقلة:
//    Camera:   البحث والمسح — "as low as you can control"
//    ADS:      تتبّع الارتداد أثناء الإطلاق — أعلى من Camera
//    Gyro:     الأيم الرئيسي بالميلان — 300+ للقريب
//    Gyro ADS: تعويض الارتداد بالميلان أثناء الرش — أعلى من Gyro
// ═══════════════════════════════════════════════════════════════
const TARGET: Record<"cam" | "ads" | "gyro" | "gyroAds", ScopeSens> = {
  // CAMERA (cashify + esports.net 2026)
  cam: { tpp: 97, fpp: 88, noScope: 97, red: 53, scope2: 33, scope3: 22, scope4: 17, scope6: 12, scope8: 11 } as ScopeSens,
  // ADS (cashify + esports.net 2026)
  ads: { tpp: 97, fpp: 88, noScope: 97, red: 57, scope2: 39, scope3: 32, scope4: 27, scope6: 21, scope8: 11 } as ScopeSens,
  // GYRO (Sportskeeda + Jonathan + BitTopup)
  gyro: { tpp: 300, fpp: 300, noScope: 300, red: 300, scope2: 280, scope3: 250, scope4: 200, scope6: 130, scope8: 60 } as ScopeSens,
  // GYRO ADS (Jonathan 300% Red, 236% 3x, BitTopup 120% 6x)
  gyroAds: { tpp: 310, fpp: 310, noScope: 310, red: 310, scope2: 300, scope3: 240, scope4: 180, scope6: 110, scope8: 70 } as ScopeSens,
};

// ═══════════════════════════════════════════════════════════════
//  DEVICE OFFSET — تعديل إضافي (+/-) بدل مضاعف تراكمي
// ═══════════════════════════════════════════════════════════════
function deviceOffset(device: Device) {
  // كل عامل يعطي offset صغير يُضاف/يُطرح من القيمة المستهدفة
  // بدل ما يُضرب ويغيّر القيمة بشكل كبير

  // FPS: أعلى = أدق = نخفض قليل
  const fpsOff =
    device.fps >= 165 ? -0.06 :
    device.fps >= 144 ? -0.04 :
    device.fps >= 120 ? -0.02 :
    device.fps >= 90  ?  0.00 :
    device.fps >= 60  ?  0.00 : 0.04;

  // Touch: أعلى = أدق
  const touchOff =
    device.touchRate >= 720 ? -0.03 :
    device.touchRate >= 480 ? -0.02 :
    device.touchRate >= 240 ?  0.00 :
    0.02;

  // شاشة: أكبر = أكثر حساسية مطلوبة
  const screenOff =
    device.screenSize >= 13  ?  0.18 :
    device.screenSize >= 11  ?  0.12 :
    device.screenSize >= 8   ?  0.04 :
    device.screenSize >= 6.5 ?  0.00 : -0.03;

  // Gyro hardware
  const gyroOff =
    device.gyroQuality === "excellent" ?  0.00 :
    device.gyroQuality === "good"      ? -0.08 : -0.18;

  return {
    camOff: fpsOff + touchOff + screenOff,
    adsOff: fpsOff + touchOff + screenOff,
    gyroOff: fpsOff + touchOff + screenOff + gyroOff,
  };
}

// ═══════════════════════════════════════════════════════════════
//  FINGER OFFSET
// ═══════════════════════════════════════════════════════════════
function fingerOffset(fingers: number) {
  switch (fingers) {
    case 2: return { cam:  0.08, ads:  0.06, gyro: -0.12, gyroAds: -0.10 };
    case 3: return { cam:  0.04, ads:  0.03, gyro: -0.06, gyroAds: -0.04 };
    case 4: return { cam:  0.00, ads:  0.00, gyro:  0.00, gyroAds:  0.00 };
    case 5: return { cam: -0.04, ads: -0.02, gyro:  0.04, gyroAds:  0.03 };
    case 6: return { cam: -0.07, ads: -0.04, gyro:  0.07, gyroAds:  0.05 };
    default: return { cam: 0, ads: 0, gyro: 0, gyroAds: 0 };
  }
}

// ═══════════════════════════════════════════════════════════════
//  WEAPON DNA — معادلة حساسية حقيقية لكل فئة سلاح
//  كل فئة لها DNA قتالي مبني على سلوكها الفعلي في PUBG Mobile:
//    - مدى الاشتباك الأمثل
//    - نمط الارتداد
//    - وضع الإطلاق (تلقائي/شبه/يدوي)
//    - السكوب المستخدم غالباً
//  AR = المرجع (1.0). باقي الفئات تُضبط نسبياً.
//  القناصات/DMR تُعالج بنظام مستقل في sniperBaseValue.
// ═══════════════════════════════════════════════════════════════
type WeaponMod = { cam: number; ads: number; gyro: number; gyroAds: number };

type WeaponDna = {
  // HIPFIRE (TPP/FPP/noScope) — سلوك القريب
  hip: WeaponMod;
  // SCOPE (red→8x) — سلوك البعيد/المتوسط
  scope: WeaponMod;
  // مدى تأثير الارتداد على قيم التحكم (0-1.5)
  recoilImpact: number;
};

const WEAPON_DNA: Record<string, WeaponDna> = {
  // AR — متوازن، كل المسافات، المرجع
  ar: {
    hip:   { cam: 0.00, ads: 0.00, gyro: 0.00, gyroAds: 0.00 },
    scope: { cam: 0.00, ads: 0.00, gyro: 0.00, gyroAds: 0.00 },
    recoilImpact: 1.00,
  },
  // SMG — متخصّص القريب: hipfire سريع + جايرو عالي للتتبع، ضعيف من بعيد
  smg: {
    hip:   { cam: 0.06, ads: -0.03, gyro: 0.13, gyroAds: 0.11 },
    scope: { cam: -0.04, ads: -0.06, gyro: 0.04, gyroAds: 0.05 },
    recoilImpact: 0.70,
  },
  // LMG — ملك الرش المستمر: ثقيل + ADS وجايرو عالي للتتبع الطويل
  lmg: {
    hip:   { cam: -0.02, ads: 0.05, gyro: 0.09, gyroAds: 0.13 },
    scope: { cam: -0.02, ads: 0.06, gyro: 0.09, gyroAds: 0.13 },
    recoilImpact: 0.85,
  },
  // SHOTGUN — آلة الفليك: أسرع دوران + جايرو فوري بين الأهداف
  shotgun: {
    hip:   { cam: 0.09, ads: 0.00, gyro: 0.16, gyroAds: 0.07 },
    scope: { cam: -0.03, ads: -0.04, gyro: 0.03, gyroAds: 0.03 },
    recoilImpact: 0.45,
  },
  // PISTOL — سلاح احتياطي: حركة سريعة + جايرو سريع
  pistol: {
    hip:   { cam: 0.06, ads: -0.03, gyro: 0.10, gyroAds: 0.05 },
    scope: { cam: -0.02, ads: -0.03, gyro: 0.03, gyroAds: 0.02 },
    recoilImpact: 0.60,
  },
  // القناصات تُعالج في sniperBaseValue — DNA محايد
  dmr:    { hip: { cam: 0, ads: 0, gyro: 0, gyroAds: 0 }, scope: { cam: 0, ads: 0, gyro: 0, gyroAds: 0 }, recoilImpact: 0 },
  sniper: { hip: { cam: 0, ads: 0, gyro: 0, gyroAds: 0 }, scope: { cam: 0, ads: 0, gyro: 0, gyroAds: 0 }, recoilImpact: 0 },
};

// مرجع AKM الكامل لاشتقاق باقي الأسلحة
const AKM_REF = { v: 0.76, h: 0.44, recovery: 0.64, accuracy: 0.77 };

function weaponOffset(wp: WeaponProfile, row: keyof ScopeSens): WeaponMod {
  const dna = WEAPON_DNA[wp.type] ?? WEAPON_DNA.ar;
  const isHipfire = row === "tpp" || row === "fpp" || row === "noScope";

  // ابدأ من DNA الفئة (hipfire أم scope)
  const base = isHipfire ? dna.hip : dna.scope;
  let { cam, ads, gyro, gyroAds } = base;

  if (wp.type !== "sniper" && wp.type !== "dmr") {
    // ═══ نموذج متعدّد العوامل — كل سلاح فريد ببياناته الكاملة ═══
    const v = wp.verticalRecoil / 100;
    const h = wp.horizontalRecoil / 100;
    const recovery = wp.recovery / 100;
    const accuracy = wp.firstShotAccuracy / 100;

    // 1) الارتداد العمودي (المحرك الرئيسي للتحكم)
    const vDiff = (v - AKM_REF.v) * 0.15 * dna.recoilImpact;
    // 2) الارتداد الأفقي (اهتزاز جانبي = يحتاج جايرو للتقويم)
    const hDiff = (h - AKM_REF.h) * 0.08 * dna.recoilImpact;
    // 3) سرعة الاسترجاع (استرجاع أعلى = ADS أعلى يسمح به السلاح)
    const recDiff = (recovery - AKM_REF.recovery) * 0.06;
    // 4) دقة الطلقة الأولى (أعلى = ADS أدق/أبطأ للتحكّم)
    const accDiff = (accuracy - AKM_REF.accuracy) * 0.05;

    if (isHipfire) {
      ads     += vDiff + recDiff - accDiff;
      gyro    += vDiff * 1.5 + hDiff * 1.2;
      gyroAds += vDiff * 1.3 + hDiff * 1.0 + recDiff;
      cam     -= vDiff * 0.3;
    } else {
      // السكوب: التحكّم بالرتداد أثناء الرش من السكوب
      gyro    += vDiff * 1.3 + hDiff * 1.0;
      gyroAds += vDiff * 1.6 + hDiff * 1.2 + recDiff;
      ads     += vDiff * 0.6 + recDiff - accDiff;
    }
  }

  return { cam, ads, gyro, gyroAds };
}

// ═══════════════════════════════════════════════════════════════
//  SNIPER PRECISION ENGINE — نظام مستقل لكل سكوب
//
//  القناصات مختلفة جذرياً عن أسلحة الرش:
//  - طلقة واحدة: لا يوجد "تتبع ارتداد" — الأهم هو الدقة قبل الإطلاق
//  - كل سكوب له ديناميكية مختلفة تماماً
//  - 8x scope: 8.1× تكبير — 1 بكسل حركة = 8 بكسلات في عالم اللعبة
//    لذلك يحتاج حساسية منخفضة جداً ومضبوطة بدقة
//
//  Bolt-Action (AWM, Kar98k, M24, Mosin):
//    - طلقة واحدة ثم bolt cycle
//    - الأولوية: دقة الطلقة الأولى + quickscope + flick shot
//    - ADS أبطأ من Camera (ما تحتاج تتبع — تحتاج تثبت)
//    - Gyro منخفض جداً (أي اهتزاز = miss)
//
//  DMR (Mini14, SKS, SLR, Mk14):
//    - طلقات متتابعة semi-auto
//    - الأولوية: vertical recoil recovery + follow-up shots
//    - ADS أعلى من Bolt (تحتاج تتبع الارتداد بين الطلقات)
//    - Gyro أعلى من Bolt (يساعد في إرجاع الكروسهير بعد كل طلقة)
// ═══════════════════════════════════════════════════════════════

type SniperBase = { cam: number; ads: number; gyro: number; gyroAds: number } | null;

// ── القيم المطلقة المستهدفة لكل سكوب (Bolt-Action) ──
// منخفضة Camera/ADS للدقة — عالية Gyro للتعديل بالميلان
// منحنى جايرو متناسق وشرس: cascade عكسي منتظم + Gyro ADS < Gyro = ثبات لحظة الإطلاق
// BOLT APEX: أقوى + أسرع على الرأس (أُسّ هادئ جداً = سكوبات بعيدة شرسة + سريعة)
// Gyro ADS < Gyro = ثبات لحظة الإطلاق | دايماً تحت DMR
const BOLT_TARGETS = buildSniper(50, 0.50, 48, 0.49, 258, 0.38, 240, 0.36);

// ── القيم المطلقة المستهدفة لكل سكوب (DMR) ──
// أسرع من bolt: semi-auto tap-fire + follow-up
// منحنى متناسق وشرس: ADS >= Camera (تتبع ارتداد عمودي) + GyroADS >= Gyro (follow-up)
// cascade عكسي منتظم (تكبير أعلى = حساسية أقل) = ذاكرة عضلية متّسقة
// DMR APEX: أقوى + أسرع تتبع رأس متتابع (أُسّ هادئ = قوة + سرعة + ثبات)
// Gyro ADS > Gyro = تتبع الارتداد بين الطلقات | دايماً فوق Bolt
const DMR_TARGETS = buildSniper(60, 0.52, 60, 0.51, 278, 0.40, 292, 0.38);

// يرجع القيم المطلقة لقناص على سكوب (null لغير القناصات أو TPP/FPP/noScope)
function sniperBaseValue(weaponType: string, row: keyof ScopeSens): SniperBase {
  if (weaponType !== "sniper" && weaponType !== "dmr") return null;
  if (row === "tpp" || row === "fpp" || row === "noScope") return null;
  const table = weaponType === "sniper" ? BOLT_TARGETS : DMR_TARGETS;
  return table[row] ?? null;
}

// offset للقناص على TPP/FPP/noScope فقط (السكوبات تستخدم القيم المطلقة)
function sniperOffset(weaponType: string, row: keyof ScopeSens): SniperBase {
  if (weaponType !== "sniper" && weaponType !== "dmr") return null;
  const isBolt = weaponType === "sniper";

  // TPP/FPP: القناصة ما تحتاج TPP/FPP مختلف كثير
  // بس أبطأ شوي من AR عشان ما تطير الكاميرا لما تفتح السكوب
  if (row === "tpp" || row === "fpp") {
    return isBolt
      ? { cam: -0.04, ads: -0.06, gyro: -0.08, gyroAds: -0.08 }
      : { cam: -0.02, ads: -0.03, gyro: -0.05, gyroAds: -0.05 };
  }

  // NoScope: hip-fire قريب — quickscope
  if (row === "noScope") {
    return isBolt
      ? { cam:  0.00, ads: -0.10, gyro: -0.12, gyroAds: -0.10 }  // Bolt: أبطأ — دقة الطلقة الأولى
      : { cam:  0.00, ads: -0.05, gyro: -0.08, gyroAds: -0.06 }; // DMR: أسرع شوي — follow-up
  }

  // ═══ SCOPED — هنا الضبط الدقيق الحقيقي ═══
  //
  // الفلسفة:
  //   Camera: يتحكم بسرعة المسح (scanning) — يحتاج يكون بطيء بما يكفي
  //           عشان تقدر توقف على الرأس بدون ما تتجاوزه (zero over-drag)
  //           لكن سريع بما يكفي عشان تلحق هدف يتحرك (zero under-drag)
  //
  //   ADS:    للقناصات bolt-action: أبطأ من Camera!
  //           لأنك ما تحتاج تتبع ارتداد — تحتاج تثبّت قبل الطلقة
  //           لحظة الضغط على fire = لازم يكون ثابت 100%
  //           للـ DMR: أعلى من Camera — عشان تتبع الارتداد العمودي
  //
  //   Gyro:   منخفض جداً — أي ميلان صغير على 6x/8x = حركة ضخمة
  //           على 8x: 1° ميلان = ~40 بكسل حركة (مع zoom 8.1×)
  //           لازم يكون منخفض بما يكفي عشان إيدك ما تهتز
  //           لكن عالي بما يكفي عشان تقدر تعدّل micro-adjustments
  //
  //   GyroADS: أبطأ من Gyro Camera — ثبات أقصى لحظة الإطلاق

  // مصفوفة القيم لكل سكوب — كل سطر مستقل تماماً
  // [cam_offset, ads_offset, gyro_offset, gyroAds_offset]
  // السكوبات تستخدم القيم المطلقة (sniperBaseValue) في المحرك الرئيسي
  // ما نرجع offset هنا
  void isBolt;

  // للسكوبات ترجع null — القيم المطلقة تُعالج في المحرك عبر sniperBaseValue
  return null;
}

// ═══════════════════════════════════════════════════════════════
//  PROFILE OFFSET — كل بروفايل يعدّل كل scope
// ═══════════════════════════════════════════════════════════════
function profileOffset(profile: (typeof PRO_PROFILES)[0], row: keyof ScopeSens) {
  // sensMultiplier: 1.0 = baseline. كل 0.01 فوق/تحت = ~1% تعديل
  const baseOff = profile.sensMultiplier - 1.0;

  if (row === "tpp") {
    const off = (profile.tppMultiplier - 1.0);
    return { cam: off + baseOff, ads: off + baseOff, gyro: baseOff, gyroAds: baseOff };
  }
  if (row === "fpp") {
    const off = (profile.fppMultiplier - 1.0);
    return { cam: off + baseOff, ads: off + baseOff, gyro: baseOff, gyroAds: baseOff };
  }

  const scopeMap: Record<string, number> = {
    noScope: profile.redDotMultiplier, red: profile.redDotMultiplier,
    scope2: profile.scope2Multiplier, scope3: profile.scope3Multiplier,
    scope4: profile.scope4Multiplier, scope6: profile.scope6Multiplier,
    scope8: profile.scope8Multiplier,
  };
  const scopeOff = (scopeMap[row] ?? 1.0) - 1.0;
  const adsOff = profile.adsMultiplier - 1.0;
  const gyroOff = profile.gyroMultiplier - 1.0;

  return {
    cam: scopeOff + baseOff,
    ads: scopeOff + adsOff + baseOff,
    gyro: gyroOff + baseOff,
    gyroAds: gyroOff + adsOff + baseOff,
  };
}

// ═══════════════════════════════════════════════════════════════
//  MAIN ENGINE
// ═══════════════════════════════════════════════════════════════
export function computeSensitivity(p: SensParams): Sens {
  const { device, fingers, gyroMode, weaponName, weaponRecoil, weaponRange, weaponType, proProfile } = p;

  const profile = PRO_PROFILES.find(x => x.id === (proProfile as ProProfileId)) ?? PRO_PROFILES[0];
  const wp = getWeaponProfile(weaponName, weaponRecoil, weaponRange, weaponType);

  const dev = deviceOffset(device);
  const fin = fingerOffset(fingers);
  // weaponOffset يُحسب لكل سكوب داخل اللوب (لأن المصفوفة تختلف حسب السكوب)

  const cam     = {} as Record<keyof ScopeSens, number>;
  const ads     = {} as Record<keyof ScopeSens, number>;
  const gyroCam = {} as Record<keyof ScopeSens, number>;
  const gyroAds = {} as Record<keyof ScopeSens, number>;

  for (const row of ROWS) {
    const pro = profileOffset(profile, row);

    // ── مصفوفة السلاح لكل سكوب على حدة (hipfire مختلف عن scoped) ──
    const wpn = weaponOffset(wp, row);

    // ── القناصات على السكوبات: قيم مطلقة مستقلة ──
    const sniperAbs = sniperBaseValue(wp.type, row);
    // ── القناصات على TPP/FPP/noScope: offset ──
    const sniperOvr = sniperOffset(wp.type, row);

    if (sniperAbs) {
      // ═══ Sniper SCOPE — قيم مطلقة مستقلة عن AR ═══
      // نطبّق فقط تعديلات الجهاز + الأصابع + البروفايل (مش سلاح/ارتداد)
      const camTotal  = dev.camOff  + fin.cam  + (pro.cam - 0);
      const adsTotal  = dev.adsOff  + fin.ads  + (pro.ads - 0);
      const gyroTotal = dev.gyroOff + fin.gyro + (pro.gyro - 0);
      const gyroAdsTotal = dev.gyroOff + fin.gyroAds + (pro.gyroAds - 0);

      cam[row] = cl(Math.round(sniperAbs.cam     * (1 + camTotal)), 1, 300);
      ads[row] = cl(Math.round(sniperAbs.ads     * (1 + adsTotal)), 1, 300);

      if (gyroMode === "off" || (gyroMode === "scope" && HIPFIRE.includes(row))) {
        gyroCam[row] = 0;
        gyroAds[row] = 0;
      } else {
        gyroCam[row] = cl(Math.round(sniperAbs.gyro    * (1 + gyroTotal)),    1, 400);
        gyroAds[row] = cl(Math.round(sniperAbs.gyroAds * (1 + gyroAdsTotal)), 1, 400);
      }
    } else {
      // ═══ AR / SMG / LMG / إلخ + القناصات TPP/FPP/noScope ═══
      const sniperCam     = sniperOvr?.cam     ?? 0;
      const sniperAds     = sniperOvr?.ads     ?? 0;
      const sniperGyro    = sniperOvr?.gyro    ?? 0;
      const sniperGyroAds = sniperOvr?.gyroAds ?? 0;

      const camTotal     = dev.camOff  + fin.cam     + wpn.cam     + pro.cam     + sniperCam;
      const adsTotal     = dev.adsOff  + fin.ads     + wpn.ads     + pro.ads     + sniperAds;
      const gyroTotal    = dev.gyroOff + fin.gyro    + wpn.gyro    + pro.gyro    + sniperGyro;
      const gyroAdsTotal = dev.gyroOff + fin.gyroAds + wpn.gyroAds + pro.gyroAds + sniperGyroAds;

      cam[row] = cl(Math.round(TARGET.cam[row] * (1 + camTotal)), 1, 300);
      ads[row] = cl(Math.round(TARGET.ads[row] * (1 + adsTotal)), 1, 300);

      if (gyroMode === "off" || (gyroMode === "scope" && HIPFIRE.includes(row))) {
        gyroCam[row] = 0;
        gyroAds[row] = 0;
      } else {
        gyroCam[row] = cl(Math.round(TARGET.gyro[row]    * (1 + gyroTotal)),    1, 400);
        gyroAds[row] = cl(Math.round(TARGET.gyroAds[row] * (1 + gyroAdsTotal)), 1, 400);
      }
    }
  }

  // ═══ FREE LOOK ═══
  // Vehicle: بروفايلات عدوانية/مخصصة تحتاج free look أعلى بكثير
  //          عشان تقدر تطلّع على الأعداء أثناء القيادة + تطلق من السيارة
  const vehicleBoost =
    profile.isCustom ? 1.40 :                    // ALYAZOURI PRO: أعلى شي — ملك السيارات
    profile.category === "aggressive" ? 1.25 :   // عدواني: يحتاج يطلّع بسرعة
    1.15;                                        // عادي

  const freeLook = {
    cam:       cl(Math.round(cam.tpp * 1.05), 1, 300),
    parashoot: cl(Math.round(cam.tpp * 1.20), 1, 300),
    vehicle:   cl(Math.round(cam.tpp * vehicleBoost), 1, 300),
  };

  // ═══ GAMEPLAY ═══
  const camNorm = cl(cam.tpp / 200, 0, 1);
  const sprintSensitivity = cl(Math.round(85 + (1 - camNorm) * 12 + (device.screenSize >= 11 ? -3 : 0) + (fingers >= 5 ? -1 : fingers <= 2 ? 2 : 0)), 75, 100);
  const joystickSize = cl((device.screenSize >= 13 ? 100 : device.screenSize >= 11 ? 95 : device.screenSize >= 8 ? 85 : device.screenSize >= 6.5 ? 78 : 72) + (fingers >= 6 ? -10 : fingers >= 5 ? -5 : 0) + Math.round((1 - camNorm) * 5), 50, 120);
  const tppFOV = cl(Math.round(83 + camNorm * 5 + (fingers >= 5 ? 1.5 : 0.5) + (device.screenSize >= 11 ? -1 : 0.5)), 80, 90);
  const fppFOV = cl(Math.round(88 + camNorm * 10 + (fingers >= 5 ? 3 : 1.5) + (device.screenSize >= 11 ? -2 : 1)), 80, 103);

  // ═══ AI SCORE ═══
  const devScore = 1.0 + dev.camOff;
  const aiScore = cl(Math.round(
    (devScore * 0.22 + (1 - wp.verticalRecoil / 200) * 0.18 + (fingers / 7) * 0.20
    + ((profile.recoilControl + profile.tracking) / 220) * 0.22
    + (gyroMode === "off" ? 0.4 : device.gyroQuality === "excellent" ? 1 : device.gyroQuality === "good" ? 0.75 : 0.5) * 0.18
    + (profile.isCustom ? 0.04 : 0)) * 100
  ), 1, 100);

  return {
    cam: cam as ScopeSens, ads: ads as ScopeSens,
    gyro: { cam: gyroCam as ScopeSens, ads: gyroAds as ScopeSens },
    freeLook,
    gameplay: {
      sprintSensitivity,
      joystickSize,
      tppFOV,
      fppFOV,
      aimAssist: false,  // NEURAL HEADSHOT ENGINE: لا حاجة لـ aim assist
      crosshairHeight: cl(38 + fingers, 38, 45),  // ارتفاع الكروسهير الأمثل للهدشوت
      headshotLockScore: cl(Math.round((gyroAds.red / 400) * 100 + (profile.isCustom ? 18 : 0) + (profile.adsMultiplier > 1.1 ? 8 : 0)), 1, 100),
    },
    aiScore,
    factors: {
      deviceFactor: 1.0 + dev.camOff,
      weaponFactor: cl((100 - wp.verticalRecoil * 0.5) / 100, 0.4, 1),
      fingerFactor: 1.0 + fin.cam,
      profileFactor: profile.sensMultiplier,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
//  UI
// ═══════════════════════════════════════════════════════════════
export function SensTable({ title, icon, data, max, accent = "text-orange-300", barClass = "from-orange-500 to-amber-400" }: {
  title: string; icon: string; data: ScopeSens; max: number; accent?: string; barClass?: string;
}) {
  const { lang } = useLang();
  return (
    <div className="card rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-base ${accent}`}>{icon}</span>
        <span className={`text-sm font-bold ${accent}`}>{title}</span>
      </div>
      <div className="space-y-2">
        {SCOPE_DEFS.map(r => {
          const v = (data as Record<string, number>)[r.key] ?? 0;
          const off = v <= 0;
          const pct = off ? 0 : Math.round(v / max * 100);
          return (
            <div key={r.key} className="flex items-center gap-2">
              <span className="w-6 text-center text-sm">{r.icon}</span>
              <span className="w-16 text-xs text-white/60">{t(r.labelKey as never, lang)}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${barClass} stat-bar`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`w-12 text-right text-xs font-bold ${off ? "text-white/30" : accent}`}>
                {off ? "—" : `${v}%`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FactorsCard({ factors }: { factors: Sens["factors"] }) {
  const { lang } = useLang();
  const items = [
    { k: "D", label: t("stability_device", lang), v: factors.deviceFactor, color: "text-orange-300" },
    { k: "W", label: t("stability_weapon", lang), v: factors.weaponFactor, color: "text-amber-300" },
    { k: "F", label: t("stability_fingers", lang), v: factors.fingerFactor, color: "text-emerald-300" },
    { k: "P", label: lang === "ar" ? "البروفايل" : "Profile", v: factors.profileFactor, color: "text-sky-300" },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(it => (
        <div key={it.k} className="card rounded-xl p-3 text-center">
          <div className={`font-display text-lg font-bold ${it.color}`}>{it.k}</div>
          <div className="text-[10px] text-white/50">{it.label}</div>
          <div className="mt-1 text-sm font-bold text-white">{(it.v * 100).toFixed(0)}%</div>
        </div>
      ))}
    </div>
  );
}
