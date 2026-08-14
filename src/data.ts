import type { WeaponProfile } from "./weaponProfiles";

export type Device = {
  name: string;
  fps: number;
  touchRate: number;
  screenSize: number;
  resolution: string;
  gyroQuality: "excellent" | "good" | "average";
};

export type DeviceBrand = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  devices: Device[];
};

const d = (name: string, fps: number, touchRate: number, screenSize: number, resolution: string, gyroQuality: Device["gyroQuality"]): Device => 
  ({ name, fps, touchRate, screenSize, resolution, gyroQuality });

export const BRANDS: DeviceBrand[] = [
  {
    id: "apple", name: "Apple", icon: "🍎", accent: "from-slate-300 to-slate-500",
    devices: [
      d("iPhone 16 Pro Max", 120, 120, 6.9, "2868×1320", "excellent"),
      d("iPhone 16 Pro", 120, 120, 6.3, "2622×1206", "excellent"),
      d("iPhone 16 Plus", 60, 120, 6.7, "2796×1290", "good"),
      d("iPhone 16", 60, 120, 6.1, "2556×1179", "good"),
      d("iPhone 15 Pro Max", 120, 120, 6.7, "2796×1290", "excellent"),
      d("iPhone 15 Pro", 120, 120, 6.1, "2556×1179", "excellent"),
      d("iPhone 15 Plus", 60, 120, 6.7, "2796×1290", "good"),
      d("iPhone 15", 60, 120, 6.1, "2556×1179", "good"),
      d("iPhone 14 Pro Max", 120, 120, 6.7, "2796×1290", "excellent"),
      d("iPhone 14 Pro", 120, 120, 6.1, "2556×1179", "excellent"),
      d("iPhone 14 Plus", 60, 120, 6.7, "2778×1284", "good"),
      d("iPhone 13 Pro Max", 120, 120, 6.7, "2778×1284", "excellent"),
      d("iPhone 13 Pro", 120, 120, 6.1, "2532×1170", "excellent"),
      d("iPhone 13", 60, 120, 6.1, "2532×1170", "excellent"),
      d("iPhone 12 Pro Max", 60, 120, 6.7, "2778×1284", "good"),
      d("iPhone 12 Pro", 60, 120, 6.1, "2532×1170", "good"),
      d("iPhone 12", 60, 120, 6.1, "2532×1170", "good"),
      d("iPhone SE (2022)", 60, 120, 4.7, "1334×750", "average"),
      d("iPhone 11 Pro Max", 60, 120, 6.5, "2688×1242", "good"),
      d("iPhone 11 Pro", 60, 120, 5.8, "2436×1125", "good"),
      d("iPhone 11", 60, 120, 6.1, "1792×828", "good"),
      d("iPhone XS Max", 60, 120, 6.5, "2688×1242", "good"),
      d("iPad Pro 13 (M4)", 120, 120, 13.0, "2752×2064", "excellent"),
      d("iPad Pro 12.9 (M2)", 120, 120, 12.9, "2732×2048", "excellent"),
      d("iPad Pro 11 (M4)", 120, 120, 11.0, "2420×1668", "excellent"),
      d("iPad Pro 11 (M2)", 120, 120, 11.0, "2388×1668", "excellent"),
      d("iPad Pro 12.9 (M1)", 120, 120, 12.9, "2732×2048", "excellent"),
      d("iPad Air M2", 60, 120, 11.0, "2360×1640", "excellent"),
      d("iPad Air 5", 60, 120, 10.9, "2360×1640", "good"),
      d("iPad Mini 7", 120, 120, 8.3, "2266×1488", "excellent"),
      d("iPad Mini 6", 60, 120, 8.3, "2266×1488", "good"),
      d("iPad 10", 60, 120, 10.9, "2360×1640", "average"),
      d("iPad 9", 60, 60, 10.2, "2160×1620", "average"),
    ],
  },
  {
    id: "samsung", name: "Samsung", icon: "📱", accent: "from-blue-400 to-indigo-600",
    devices: [
      d("Galaxy S25 Ultra", 120, 240, 6.9, "3120×1440", "excellent"),
      d("Galaxy S25+", 120, 240, 6.7, "3120×1440", "excellent"),
      d("Galaxy S25", 120, 240, 6.2, "2340×1080", "excellent"),
      d("Galaxy S24 Ultra", 120, 240, 6.8, "3120×1440", "excellent"),
      d("Galaxy S24+", 120, 240, 6.7, "3120×1440", "excellent"),
      d("Galaxy S24", 120, 240, 6.2, "2340×1080", "excellent"),
      d("Galaxy S23 Ultra", 120, 240, 6.8, "3088×1440", "excellent"),
      d("Galaxy S23+", 120, 240, 6.6, "2340×1080", "excellent"),
      d("Galaxy S23", 120, 240, 6.1, "2340×1080", "excellent"),
      d("Galaxy S22 Ultra", 120, 240, 6.8, "3088×1440", "excellent"),
      d("Galaxy Z Fold 6", 120, 240, 7.6, "2160×1856", "excellent"),
      d("Galaxy Z Fold 5", 120, 240, 7.6, "2176×1812", "excellent"),
      d("Galaxy Z Flip 6", 120, 240, 6.7, "2640×1080", "good"),
      d("Galaxy S22", 120, 240, 6.1, "2340×1080", "excellent"),
      d("Galaxy S21 Ultra", 120, 240, 6.8, "3200×1440", "excellent"),
      d("Galaxy Note 20 Ultra", 120, 240, 6.9, "3088×1440", "excellent"),
      d("Galaxy A55", 120, 240, 6.6, "2340×1080", "good"),
      d("Galaxy A54", 120, 240, 6.4, "2340×1080", "good"),
      d("Galaxy A35", 90, 240, 6.6, "2340×1080", "average"),
      d("Galaxy Z Fold 6", 120, 240, 7.6, "2160×1856", "excellent"),
      d("Galaxy Z Fold 5", 120, 240, 7.6, "2176×1812", "excellent"),
      d("Galaxy Z Flip 6", 120, 240, 6.7, "2640×1080", "good"),
      d("Galaxy Tab S10 Ultra", 120, 240, 14.6, "2960×1848", "excellent"),
      d("Galaxy Tab S9 Ultra", 120, 240, 14.6, "2960×1848", "excellent"),
      d("Galaxy Tab S9+", 120, 240, 12.4, "2800×1752", "excellent"),
      d("Galaxy Tab S9", 120, 240, 11.0, "2560×1600", "excellent"),
      d("Galaxy Tab S8 Ultra", 120, 240, 14.6, "2960×1848", "excellent"),
      d("Galaxy Tab A9+", 90, 120, 11.0, "1920×1200", "average"),
    ],
  },
  {
    id: "xiaomi", name: "Xiaomi", icon: "🔥", accent: "from-orange-400 to-red-500",
    devices: [
      d("Xiaomi 15 Ultra", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 15 Pro", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 15", 120, 240, 6.36, "2670×1200", "excellent"),
      d("Xiaomi 14 Ultra", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 14 Pro", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 14", 120, 240, 6.36, "2670×1200", "excellent"),
      d("Xiaomi 13T Pro", 144, 480, 6.67, "2712×1220", "excellent"),
      d("Redmi K70 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Redmi K70", 120, 480, 6.67, "2712×1220", "excellent"),
      d("Poco F7 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Poco F6 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Poco F6", 120, 240, 6.67, "2712×1220", "good"),
      d("Poco X6 Pro", 120, 240, 6.67, "2712×1220", "good"),
      d("Poco X6", 120, 240, 6.67, "2460×1080", "average"),
      d("Redmi Note 13 Pro+", 120, 240, 6.67, "2400×1080", "average"),
      d("Redmi Note 13 Pro", 120, 240, 6.67, "2400×1080", "average"),
      d("Redmi Note 13", 120, 240, 6.67, "2400×1080", "average"),
      d("Redmi Note 12 Pro+", 120, 240, 6.67, "2400×1080", "average"),
      d("Xiaomi Pad 6 Pro", 144, 240, 11.0, "2880×1800", "excellent"),
      d("Xiaomi Pad 6", 144, 240, 11.0, "2880×1800", "good"),
    ],
  },
  {
    id: "rog", name: "ASUS ROG", icon: "🎮", accent: "from-red-500 to-rose-700",
    devices: [
      d("ROG Phone 9 Ultimate", 185, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 9 Pro", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 9", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 8 Pro", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 8", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 7 Ultimate", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 7", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 6 Pro", 165, 720, 6.78, "2448×1080", "excellent"),
      d("ROG Phone 6", 165, 720, 6.78, "2448×1080", "excellent"),
      d("ROG Phone 5", 144, 300, 6.78, "2448×1080", "excellent"),
    ],
  },
  {
    id: "redmagic", name: "Red Magic", icon: "👾", accent: "from-red-600 to-purple-700",
    devices: [
      d("Red Magic 10 Pro+", 165, 960, 6.85, "2688×1216", "excellent"),
      d("Red Magic 10 Pro", 144, 960, 6.85, "2688×1216", "excellent"),
      d("Red Magic 9 Pro+", 165, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 9 Pro", 120, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 8 Pro+", 120, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 8 Pro", 120, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 7 Pro", 120, 960, 6.8, "2400×1080", "excellent"),
      d("Red Magic 7", 165, 720, 6.8, "2400×1080", "excellent"),
      d("Red Magic 6 Pro", 165, 500, 6.8, "2400×1080", "excellent"),
      d("Red Magic Tablet Pro", 144, 480, 12.1, "2560×1600", "excellent"),
    ],
  },
  {
    id: "oneplus", name: "OnePlus", icon: "⚡", accent: "from-red-400 to-pink-600",
    devices: [
      d("OnePlus 13", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OnePlus 12", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OnePlus 12R", 120, 240, 6.78, "2780×1264", "good"),
      d("OnePlus 11", 120, 240, 6.7, "3216×1440", "excellent"),
      d("OnePlus 10 Pro", 120, 240, 6.7, "3216×1440", "excellent"),
      d("OnePlus Open", 120, 240, 7.82, "2440×2268", "excellent"),
      d("OnePlus Nord 4", 120, 240, 6.74, "2772×1240", "good"),
      d("OnePlus Nord 3", 120, 240, 6.74, "2772×1240", "good"),
      d("OnePlus Pad 2", 144, 240, 12.1, "3000×2000", "excellent"),
    ],
  },
  {
    id: "realme", name: "Realme", icon: "🟡", accent: "from-yellow-400 to-amber-600",
    devices: [
      d("Realme GT 7 Pro", 120, 240, 6.78, "2780×1264", "excellent"),
      d("Realme GT 6", 120, 240, 6.78, "2780×1264", "excellent"),
      d("Realme GT 5 Pro", 120, 240, 6.78, "2780×1264", "excellent"),
      d("Realme GT Neo 5", 144, 480, 6.74, "2772×1240", "excellent"),
      d("Realme 13 Pro+", 120, 240, 6.7, "2412×1080", "good"),
      d("Realme 12 Pro+", 120, 240, 6.7, "2412×1080", "good"),
      d("Realme 11 Pro+", 120, 240, 6.7, "2412×1080", "average"),
    ],
  },
  {
    id: "google", name: "Google", icon: "🔷", accent: "from-cyan-400 to-teal-600",
    devices: [
      d("Pixel 9 Pro XL", 120, 240, 6.8, "2992×1344", "excellent"),
      d("Pixel 9 Pro", 120, 240, 6.3, "2856×1280", "excellent"),
      d("Pixel 9", 120, 240, 6.3, "2424×1080", "excellent"),
      d("Pixel 8 Pro", 120, 240, 6.7, "2992×1344", "excellent"),
      d("Pixel 8", 120, 240, 6.2, "2400×1080", "excellent"),
      d("Pixel 7 Pro", 120, 240, 6.7, "3120×1440", "good"),
    ],
  },
  {
    id: "huawei", name: "Huawei", icon: "🌸", accent: "from-rose-400 to-pink-600",
    devices: [
      d("Huawei Mate 60 Pro+", 120, 240, 6.82, "2720×1260", "excellent"),
      d("Huawei Mate 60 Pro", 120, 240, 6.82, "2720×1260", "excellent"),
      d("Huawei P60 Pro", 120, 240, 6.67, "2700×1220", "good"),
      d("Huawei Mate 50 Pro", 120, 240, 6.74, "2616×1212", "good"),
    ],
  },
  {
    id: "vivo", name: "Vivo", icon: "🔵", accent: "from-indigo-400 to-blue-600",
    devices: [
      d("Vivo X200 Pro", 120, 240, 6.78, "2800×1280", "excellent"),
      d("Vivo X100 Pro", 120, 240, 6.78, "3200×1440", "excellent"),
      d("Vivo X100", 120, 240, 6.78, "2800×1260", "excellent"),
      d("Vivo X90 Pro", 120, 240, 6.78, "2800×1260", "excellent"),
      d("Vivo V30 Pro", 120, 240, 6.78, "2800×1264", "good"),
      d("iQOO 13", 144, 480, 6.82, "3168×1440", "excellent"),
      d("iQOO 12", 144, 480, 6.78, "3200×1440", "excellent"),
      d("iQOO Neo 9 Pro", 144, 480, 6.78, "2800×1260", "excellent"),
      d("iQOO 11", 144, 480, 6.78, "3200×1440", "excellent"),
      d("iQOO Pad 2", 144, 240, 12.1, "2800×1800", "excellent"),
    ],
  },
  {
    id: "oppo", name: "OPPO", icon: "🟢", accent: "from-green-400 to-emerald-600",
    devices: [
      d("OPPO Find X8 Pro", 120, 240, 6.78, "2780×1264", "excellent"),
      d("OPPO Find X7 Ultra", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OPPO Find X7", 120, 240, 6.78, "2780×1264", "excellent"),
      d("OPPO Find X6 Pro", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OPPO Reno 12 Pro", 120, 240, 6.7, "2412×1080", "good"),
      d("OPPO Reno 11 Pro", 120, 240, 6.7, "2412×1080", "good"),
      d("OnePlus Ace 3 Pro", 120, 240, 6.78, "2780×1264", "excellent"),
      d("OPPO Pad 2", 144, 240, 11.61, "2800×2000", "excellent"),
    ],
  },
  {
    id: "honor", name: "Honor", icon: "✨", accent: "from-sky-400 to-blue-600",
    devices: [
      d("Honor Magic 7 Pro", 120, 240, 6.8, "2800×1280", "excellent"),
      d("Honor Magic 6 Pro", 120, 240, 6.8, "2800×1280", "excellent"),
      d("Honor Magic V3", 120, 240, 7.92, "2344×2156", "excellent"),
      d("Honor 200 Pro", 120, 240, 6.78, "2700×1224", "good"),
      d("Honor 100 Pro", 120, 240, 6.78, "2700×1224", "good"),
      d("Honor X9b", 120, 240, 6.78, "2652×1200", "average"),
    ],
  },
  {
    id: "motorola", name: "Motorola", icon: "🅼", accent: "from-blue-500 to-indigo-700",
    devices: [
      d("Motorola Edge 50 Ultra", 144, 240, 6.7, "2712×1220", "excellent"),
      d("Motorola Edge 50 Pro", 144, 240, 6.7, "2712×1220", "good"),
      d("Motorola Edge 40 Pro", 165, 360, 6.67, "2400×1080", "good"),
      d("ThinkPhone", 144, 360, 6.6, "2400×1080", "good"),
    ],
  },
  {
    id: "nothing", name: "Nothing", icon: "⚪", accent: "from-gray-300 to-gray-500",
    devices: [
      d("Nothing Phone (3)", 120, 240, 6.7, "2400×1080", "good"),
      d("Nothing Phone (2a)", 120, 240, 6.7, "2412×1080", "good"),
      d("Nothing Phone (2)", 120, 240, 6.7, "2400×1080", "good"),
    ],
  },
  {
    id: "zte", name: "ZTE / Nubia", icon: "🔷", accent: "from-cyan-500 to-blue-700",
    devices: [
      d("Nubia Z70 Ultra", 144, 480, 6.85, "2688×1216", "excellent"),
      d("Nubia Z60 Ultra", 120, 480, 6.8, "2480×1116", "excellent"),
      d("Nubia Neo 2", 120, 240, 6.7, "2400×1080", "good"),
      d("Red Magic Tablet", 120, 360, 10.9, "2560×1600", "excellent"),
    ],
  },
  {
    id: "other", name: "Other", icon: "📲", accent: "from-gray-400 to-gray-600",
    devices: [
      d("Generic Gaming (165Hz)", 165, 480, 6.8, "2400×1080", "excellent"),
      d("Generic High-End (120Hz)", 120, 240, 6.5, "2400×1080", "good"),
      d("Generic Mid-Range (90Hz)", 90, 180, 6.5, "2400×1080", "average"),
      d("Generic Budget (60Hz)", 60, 120, 6.5, "2400×1080", "average"),
    ],
  },
];

export type Weapon = { name: string; recoil: number; range: number; type: string };
export type WeaponCategory = { id: string; name: string; icon: string; weapons: Weapon[] };

const w = (name: string, recoil: number, range: number, type: string): Weapon => ({ name, recoil, range, type });

export const WEAPONS: WeaponCategory[] = [
  {
    id: "ar", name: "Assault Rifles", icon: "🔫",
    weapons: [
      w("M416", 52, 80, "ar"),
      w("AKM", 78, 75, "ar"),
      w("SCAR-L", 48, 80, "ar"),
      w("M762", 72, 78, "ar"),
      w("AUG", 45, 82, "ar"),
      w("M16A4", 58, 95, "ar"),
      w("G36C", 50, 80, "ar"),
      w("QBZ", 46, 82, "ar"),
      w("ACE32", 54, 78, "ar"),
      w("FAMAS", 55, 85, "ar"),
      w("Groza", 68, 80, "ar"),
      w("Mk47 Mutant", 70, 90, "ar"),
      w("Honey Badger", 40, 55, "ar"),
      w("K2", 49, 78, "ar"),
    ],
  },
  {
    id: "smg", name: "SMG", icon: "💥",
    weapons: [
      w("UMP45", 32, 45, "smg"),
      w("Micro UZI", 36, 35, "smg"),
      w("Vector", 28, 35, "smg"),
      w("Tommy Gun", 40, 45, "smg"),
      w("MP5K", 30, 45, "smg"),
      w("PP-19 Bizon", 26, 48, "smg"),
      w("P90", 34, 50, "smg"),
      w("JS9", 22, 42, "smg"),
      w("MP9", 24, 40, "smg"),
    ],
  },
  {
    id: "dmr", name: "DMR", icon: "🎯",
    weapons: [
      w("Mini14", 38, 350, "dmr"),
      w("SKS", 48, 300, "dmr"),
      w("SLR", 62, 320, "dmr"),
      w("Mk14", 72, 380, "dmr"),
      w("VSS", 22, 200, "dmr"),
      w("QBU", 42, 320, "dmr"),
      w("Mk12", 44, 350, "dmr"),
    ],
  },
  {
    id: "sniper", name: "Sniper Rifles", icon: "🔭",
    weapons: [
      w("AWM", 92, 1000, "sniper"),
      w("Kar98k", 80, 800, "sniper"),
      w("M24", 78, 850, "sniper"),
      w("Win94", 55, 400, "sniper"),
      w("Lynx AMR", 95, 900, "sniper"),
      w("Mosin Nagant", 79, 820, "sniper"),
    ],
  },
  {
    id: "lmg", name: "LMG", icon: "🔥",
    weapons: [
      w("M249", 68, 120, "lmg"),
      w("DP-28", 72, 110, "lmg"),
      w("MG3", 62, 130, "lmg"),
    ],
  },
  {
    id: "shotgun", name: "Shotguns", icon: "🧨",
    weapons: [
      w("S12K", 65, 25, "shotgun"),
      w("S1897", 85, 30, "shotgun"),
      w("S686", 90, 25, "shotgun"),
      w("DBS", 78, 28, "shotgun"),
      w("M1014", 60, 22, "shotgun"),
    ],
  },
  {
    id: "pistol", name: "Pistols", icon: "🔫",
    weapons: [
      w("P92", 25, 30, "pistol"),
      w("P1911", 22, 35, "pistol"),
      w("Desert Eagle", 55, 45, "pistol"),
      w("P18C", 32, 25, "pistol"),
      w("Scorpion", 28, 30, "pistol"),
    ],
  },
];

export type Server = {
  id: string;
  name: string;
  pubgRegion: string;
  flag: string;
  city: string;
  base: number;
  probe: string;
};

export const SERVERS: Server[] = [
  { id: "me", name: "Middle East", pubgRegion: "ME", flag: "🇦🇪", city: "Abu Dhabi", base: 50, probe: "https://www.ae/favicon.ico" },
  { id: "eu", name: "Europe", pubgRegion: "EU", flag: "🇪🇺", city: "Frankfurt", base: 128, probe: "https://speed.hetzner.de/1GB.bin" },
  { id: "in", name: "India", pubgRegion: "IN", flag: "🇮🇳", city: "Mumbai", base: 108, probe: "https://www.google.co.in/favicon.ico" },
  { id: "as", name: "Asia", pubgRegion: "AS", flag: "🇸🇬", city: "Singapore", base: 142, probe: "https://www.google.com.sg/favicon.ico" },
  { id: "krjp", name: "Korea/Japan", pubgRegion: "KRJP", flag: "🇰🇷", city: "Seoul", base: 158, probe: "https://www.google.co.kr/favicon.ico" },
  { id: "na", name: "North America", pubgRegion: "NA", flag: "🇺🇸", city: "Virginia", base: 176, probe: "https://www.google.com/favicon.ico" },
  { id: "sa", name: "South America", pubgRegion: "SA", flag: "🇧🇷", city: "São Paulo", base: 206, probe: "https://www.google.com.br/favicon.ico" },
];

// ==================== JORDAN DNS SERVERS (86 server) ====================
export type DnsServer = { id: string; ip: string; label: string; isp: string; base: number };

// كشف مزوّد الخدمة (ISP) تلقائياً من بادئة الـ IP
function detectIsp(ip: string): { isp: string; base: number } {
  // IPv6
  if (ip.includes(":")) return { isp: "IPv6", base: 6 };
  // موزّعين عالميين معروفين
  if (ip === "1.1.1.1" || ip === "1.0.0.1") return { isp: "Cloudflare", base: 4 };
  if (ip === "8.8.8.8" || ip === "8.8.4.4") return { isp: "Google", base: 8 };
  const p = ip.split(".");
  const o1 = p[0], o2 = p[1];
  if (o1 === "92" && o2 === "253") return { isp: "Zain", base: 5 };
  if (o1 === "46" && o2 === "32")  return { isp: "Zain", base: 6 };
  if (o1 === "46" && o2 === "185") return { isp: "Orange", base: 7 };
  if (o1 === "77" && o2 === "245") return { isp: "Zain", base: 6 };
  if (o1 === "91" && o2 === "106") return { isp: "VTEL", base: 5 };
  if (o1 === "82" && o2 === "212") return { isp: "Damamax", base: 7 };
  if (o1 === "94" && o2 === "142") return { isp: "Damamax", base: 7 };
  if (o1 === "86" && o2 === "108") return { isp: "Data Vault", base: 8 };
  if (o1 === "176" && o2 === "29") return { isp: "Orange", base: 8 };
  if (o1 === "176" && o2 === "28") return { isp: "Orange", base: 8 };
  if (o1 === "80" && o2 === "90")  return { isp: "Orange", base: 7 };
  if (o1 === "109" && o2 === "237") return { isp: "Jordan Telecom", base: 9 };
  if (o1 === "85" && o2 === "159") return { isp: "Data Vault", base: 10 };
  if (o1 === "213" && o2 === "186") return { isp: "Data Vault", base: 10 };
  if (o1 === "37" && o2 === "75")  return { isp: "Damamax", base: 7 };
  if (o1 === "37" && o2 === "202") return { isp: "Umniah", base: 6 };
  if (o1 === "87" && o2 === "236") return { isp: "Data Vault", base: 9 };
  if (o1 === "193" && o2 === "188") return { isp: "Data Vault", base: 10 };
  if (o1 === "185") return { isp: "Data Vault", base: 10 };
  if (o1 === "212") return { isp: "Jordan Telecom", base: 9 };
  return { isp: "Other", base: 8 };
}

// قائمة عناوين IP موحّدة بدون تكرار (مرجع: AKM route + كل مزوّدي الأردن)
const DNS_IPS_RAW = [
  // Data Vault (86.108)
  "86.108.8.161","86.108.8.157","86.108.11.3","86.108.14.2","86.108.14.128","86.108.44.12","86.108.45.170",
  // Orange (46.185)
  "46.185.129.77","46.185.129.130","46.185.138.166","46.185.139.160","46.185.161.76","46.185.162.241",
  // Zain (77.245)
  "77.245.1.237","77.245.2.216","77.245.2.218","77.245.2.219","77.245.2.220","77.245.2.221","77.245.2.222",
  "77.245.3.158","77.245.10.30","77.245.12.68","77.245.12.169","77.245.13.191",
  // Damamax (94.142)
  "94.142.37.179","94.142.38.212","94.142.38.213","94.142.40.39","94.142.53.34",
  // Umniah (37.202)
  "37.202.67.44","37.202.127.139",
  // Zain (92.253)
  "92.253.13.100","92.253.19.31","92.253.19.65","92.253.23.85","92.253.48.187",
  "92.253.92.116","92.253.92.117","92.253.101.9","92.253.101.67","92.253.101.217",
  "92.253.102.6","92.253.120.32","92.253.121.179","92.253.122.255","92.253.123.145",
  "92.253.123.214","92.253.125.73","92.253.125.74","92.253.127.4","92.253.127.139",
  // VTEL (91.106)
  "91.106.99.231","91.106.99.238","91.106.99.239","91.106.99.244","91.106.99.245","91.106.99.246",
  "91.106.105.142","91.106.105.218","91.106.106.138","91.106.107.227","91.106.111.75",
  // Damamax (82.212)
  "82.212.70.66","82.212.72.18","82.212.79.115","82.212.82.198","82.212.84.109","82.212.84.139",
  // Orange (176.29)
  "176.29.114.132","176.29.114.141","176.29.114.149","176.29.114.159","176.29.114.180",
  "176.29.114.181","176.29.114.182","176.29.114.183","176.29.114.188","176.29.114.190",
  "176.29.114.198","176.29.151.152","176.29.153.215","176.29.154.115","176.29.174.7",
  "176.29.176.230","176.29.199.51","176.29.199.164","176.29.200.50",
  // Jordan Telecom (109.237)
  "109.237.193.178","109.237.197.6","109.237.197.95","109.237.197.195","109.237.198.252",
  "109.237.201.32","109.237.205.149","109.237.205.167",
  // Zain (46.32)
  "46.32.96.18","46.32.100.238","46.32.113.204","46.32.114.40","46.32.114.242","46.32.114.248",
  // Data Vault (85.159)
  "85.159.216.2","85.159.217.82","85.159.217.98","85.159.217.195","85.159.220.226","85.159.222.82",
  // Data Vault (213.186)
  "213.186.163.115","213.186.163.116","213.186.174.123","213.186.174.202",
  // Damamax (37.75)
  "37.75.144.35","37.75.144.135","37.75.144.136","37.75.146.35","37.75.147.135",
  // Orange (80.90)
  "80.90.160.54","80.90.160.58","80.90.160.130","80.90.160.131","80.90.161.242",
  "80.90.162.245","80.90.164.61","80.90.164.164","80.90.164.245","80.90.172.146",
  // Orange (176.28)
  "176.28.250.122","176.28.250.235",
  // Data Vault (87.236)
  "87.236.232.36","87.236.232.99","87.236.232.100","87.236.232.175","87.236.232.176",
  "87.236.233.50","87.236.233.70","87.236.233.117","87.236.233.180","87.236.233.196",
  "87.236.233.197","87.236.233.198","87.236.233.199","87.236.233.200","87.236.233.201",
  "87.236.233.202","87.236.233.203","87.236.233.204","87.236.233.205","87.236.233.206",
  // Jordan Telecom (212.x)
  "212.118.0.1","212.118.3.78","212.118.23.45","212.35.65.89","212.34.0.140","212.34.2.246",
  // Data Vault (213.139 / 193.188)
  "213.139.44.1","193.188.66.4","193.188.66.104","193.188.66.2","193.188.66.103","193.188.69.19",
  // متنوّعة / موزّعون عالميون
  "79.173.251.142","188.247.93.122","62.72.161.1","94.127.208.210","5.198.243.202",
  "185.96.70.36","185.98.220.29","185.98.220.7","188.123.175.175","81.28.112.8",
  "217.23.37.74","37.220.123.91","37.152.6.11","1.1.1.1","8.8.8.8",
  // IPv6
  "2a02:9c0:0:407::4","2a02:9c0:0:408::104","2a02:9c0:0:407::2","2a02:9c0:0:408::103",
  "2a02:9c0:0:19::19","2a01:9700:0:3::29","2a01:9700:0:1::7",
];

// إزالة التكرار نهائياً (Set) + بناء الكائنات
export const JORDAN_DNS: DnsServer[] = Array.from(new Set(DNS_IPS_RAW)).map((ip, i) => {
  const { isp, base } = detectIsp(ip);
  return {
    id: `dns${String(i + 1).padStart(2, "0")}`,
    ip,
    label: `JO-DNS ${String(i + 1).padStart(2, "0")}`,
    isp,
    base,
  };
});

// ==================== PRO PROFILES ==================== 
export type ProProfileId = 
  | "alyazouri_pro"  // البروفايل المخصص - الأول والمميز
  | "alyazouri_apex" // الأقوى — أقصى Headshot Power + Snap/Flick
  | "balanced" | "aggressive" | "competitive" | "headshot" | "sniper" | "spray"
  | "rusher" | "camper" | "support" | "assaulter" | "flanker" | "anchor"
  | "entry_fragger" | "clutcher" | "igl" | "scout";

export type ProProfile = {
  id: ProProfileId;
  name: string;
  nameAr: string;
  icon: string;
  category: "custom" | "general" | "aggressive" | "tactical" | "specialist";
  isCustom?: boolean;  // للبروفايل المخصص
  // Stats 0-100
  recoilControl: number;
  tracking: number;
  flicking: number;
  longRange: number;
  cqcPower: number;
  // Sensitivity multipliers - الأساسية
  sensMultiplier: number;
  // TPP/FPP multipliers (مثل Entry Fragger - سريع وعدواني)
  tppMultiplier: number;
  fppMultiplier: number;
  // Scope multipliers (مثل Clutcher - ذكي ومتوازن مع قوة)
  redDotMultiplier: number;
  scope2Multiplier: number;
  scope3Multiplier: number;
  scope4Multiplier: number;
  scope6Multiplier: number;
  scope8Multiplier: number;
  // ADS & Gyro
  adsMultiplier: number;
  gyroMultiplier: number;
  // Descriptions
  description: string;
  descriptionAr: string;
  // Recommendations
  recommendedFingers: number[];
  recommendedWeapons: string[];
  recommendedGyro: "off" | "scope" | "always";
};

export const PRO_PROFILES: ProProfile[] = [
  // ===== ⭐ ALYAZOURI PRO - البروفايل المخصص ⭐ =====
  {
    id: "alyazouri_pro",
    name: "ALYAZOURI PRO",
    nameAr: "اليازوري برو",
    icon: "🦅",
    category: "custom",
    isCustom: true,
    // إحصائيات إسپورتس متوازنة — لا شيء على حساب شيء
    recoilControl: 95, tracking: 96, flicking: 95, longRange: 93, cqcPower: 96,
    // ═══ قاعدة ═══
    sensMultiplier: 1.0,
    tppMultiplier: 1.10,
    fppMultiplier: 1.08,
    redDotMultiplier: 1.0,
    scope2Multiplier: 0.98,
    scope3Multiplier: 0.92,
    scope4Multiplier: 0.84,
    scope6Multiplier: 0.72,
    scope8Multiplier: 0.62,
    adsMultiplier: 1.04,
    gyroMultiplier: 1.02,
    description: "🦅 NEURAL HEADSHOT ENGINE — Ultimate Royale | NO AIM ASSIST. World's first manual headshot system. Every value derived from enemy head pixel-size at each distance. Gyro locks onto skull at all ranges.",
    descriptionAr: "🦅 محرّك الهدشوت العصبي — Ultimate Royale | بدون Aim Assist. أول نظام هدشوت يدوي بالعالم. كل قيمة مشتقّة من حجم رأس العدو بالبكسل على كل مسافة. الجايرو يلتصق بالجمجمة على كل المسافات.",
    recommendedFingers: [4, 5, 6],
    recommendedWeapons: ["M416", "M762", "Groza", "ACE32", "Mini14"],
    recommendedGyro: "always",
  },

  // ===== ⚡ ALYAZOURI APEX — أقوى حساسية بالعالم ⚡ =====
  {
    id: "alyazouri_apex",
    name: "ALYAZOURI APEX",
    nameAr: "اليازوري أپكس",
    icon: "⚡",
    category: "custom",
    isCustom: true,
    // إحصائيات قصوى — كل شي في الذروة
    recoilControl: 99, tracking: 98, flicking: 99, longRange: 95, cqcPower: 100,
    // ═══ قاعدة — LOCK-ON ═══
    sensMultiplier: 1.0,
    tppMultiplier: 1.16,
    fppMultiplier: 1.14,
    redDotMultiplier: 1.0,
    scope2Multiplier: 0.96,
    scope3Multiplier: 0.90,
    scope4Multiplier: 0.82,
    scope6Multiplier: 0.70,
    scope8Multiplier: 0.60,
    adsMultiplier: 1.06,
    gyroMultiplier: 1.04,
    description: "⚡ APEX — Maximum headshot rate. Fast TPP/FPP for CQC + precise scopes for long range. Gyro optimized for spray control. 100% legitimate.",
    descriptionAr: "⚡ الأپكس — أقصى هدشوت. TPP/FPP سريعة للقريب + سكوبات دقيقة للبعيد. جايرو محسّن لثبات الرش. حساسية شرعية 100%.",
    recommendedFingers: [4, 5, 6],
    recommendedWeapons: ["M416", "M762", "Groza", "AKM", "Vector"],
    recommendedGyro: "always",
  },

  // ===== GENERAL =====
  {
    id: "balanced",
    name: "Balanced",
    nameAr: "متوازن",
    icon: "⚖️",
    category: "general",
    recoilControl: 78, tracking: 80, flicking: 72, longRange: 70, cqcPower: 75,
    sensMultiplier: 1.0,
    tppMultiplier: 1.0, fppMultiplier: 1.0,
    redDotMultiplier: 1.0, scope2Multiplier: 1.0, scope3Multiplier: 1.0,
    scope4Multiplier: 1.0, scope6Multiplier: 1.0, scope8Multiplier: 1.0,
    adsMultiplier: 1.0, gyroMultiplier: 1.0,
    description: "Perfect all-rounder for any situation. Best for beginners and ranked grinders.",
    descriptionAr: "مثالي لكل المواقف. الأفضل للمبتدئين ولاعبي الترتيب.",
    recommendedFingers: [3, 4], recommendedWeapons: ["M416", "SCAR-L", "UMP45"], recommendedGyro: "scope",
  },
  {
    id: "competitive",
    name: "Competitive",
    nameAr: "تنافسي",
    icon: "🏆",
    category: "general",
    recoilControl: 85, tracking: 86, flicking: 80, longRange: 82, cqcPower: 78,
    sensMultiplier: 0.95,
    tppMultiplier: 0.94, fppMultiplier: 0.92,
    redDotMultiplier: 0.95, scope2Multiplier: 0.93, scope3Multiplier: 0.90,
    scope4Multiplier: 0.88, scope6Multiplier: 0.85, scope8Multiplier: 0.82,
    adsMultiplier: 0.94, gyroMultiplier: 0.90,
    description: "Tournament-tuned precision. Lower sensitivity for consistent aim.",
    descriptionAr: "دقة مضبوطة للبطولات. حساسية أقل لتصويب ثابت.",
    recommendedFingers: [4, 5], recommendedWeapons: ["M416", "ACE32", "Mini14"], recommendedGyro: "scope",
  },

  // ===== AGGRESSIVE =====
  {
    id: "aggressive",
    name: "Aggressive",
    nameAr: "عدواني",
    icon: "⚡",
    category: "aggressive",
    recoilControl: 68, tracking: 88, flicking: 85, longRange: 55, cqcPower: 95,
    sensMultiplier: 1.08,
    tppMultiplier: 1.12, fppMultiplier: 1.10,
    redDotMultiplier: 1.05, scope2Multiplier: 1.02, scope3Multiplier: 0.98,
    scope4Multiplier: 0.95, scope6Multiplier: 0.90, scope8Multiplier: 0.85,
    adsMultiplier: 1.05, gyroMultiplier: 1.15,
    description: "Fast pushes, quick rotations. Built for rushers and entry fraggers.",
    descriptionAr: "دفع سريع، تدوير سريع. مصمم للمندفعين.",
    recommendedFingers: [4, 5, 6], recommendedWeapons: ["M762", "Groza", "Vector"], recommendedGyro: "always",
  },
  {
    id: "rusher",
    name: "Rusher",
    nameAr: "راشر",
    icon: "🏃",
    category: "aggressive",
    recoilControl: 62, tracking: 92, flicking: 88, longRange: 45, cqcPower: 98,
    sensMultiplier: 1.15,
    tppMultiplier: 1.20, fppMultiplier: 1.18,
    redDotMultiplier: 1.10, scope2Multiplier: 1.05, scope3Multiplier: 1.00,
    scope4Multiplier: 0.95, scope6Multiplier: 0.88, scope8Multiplier: 0.80,
    adsMultiplier: 1.08, gyroMultiplier: 1.25,
    description: "Maximum speed for close-quarters combat. Hip-fire focused.",
    descriptionAr: "أقصى سرعة للقتال القريب. تركيز على إطلاق الفخذ.",
    recommendedFingers: [4, 5, 6], recommendedWeapons: ["Vector", "Micro UZI", "Groza"], recommendedGyro: "always",
  },
  {
    id: "entry_fragger",
    name: "Entry Fragger",
    nameAr: "دخّال المواجهات",
    icon: "💥",
    category: "aggressive",
    recoilControl: 70, tracking: 90, flicking: 92, longRange: 50, cqcPower: 94,
    sensMultiplier: 1.12,
    tppMultiplier: 1.14, fppMultiplier: 1.14,
    redDotMultiplier: 1.06, scope2Multiplier: 1.02, scope3Multiplier: 0.98,
    scope4Multiplier: 0.94, scope6Multiplier: 0.88, scope8Multiplier: 0.82,
    adsMultiplier: 1.06, gyroMultiplier: 1.20,
    description: "First in, trade kills, clear angles. Fast flicks essential.",
    descriptionAr: "أول من يدخل، تبادل القتلى، تنظيف الزوايا.",
    recommendedFingers: [4, 5, 6], recommendedWeapons: ["M762", "AKM", "P90"], recommendedGyro: "always",
  },
  {
    id: "flanker",
    name: "Flanker",
    nameAr: "المتسلل",
    icon: "🐍",
    category: "aggressive",
    recoilControl: 72, tracking: 85, flicking: 80, longRange: 60, cqcPower: 88,
    sensMultiplier: 1.06,
    tppMultiplier: 1.10, fppMultiplier: 1.08,
    redDotMultiplier: 1.04, scope2Multiplier: 1.00, scope3Multiplier: 0.96,
    scope4Multiplier: 0.92, scope6Multiplier: 0.86, scope8Multiplier: 0.80,
    adsMultiplier: 1.02, gyroMultiplier: 1.12,
    description: "Surprise attacks from unexpected angles. Quick target switching.",
    descriptionAr: "هجمات مفاجئة من زوايا غير متوقعة.",
    recommendedFingers: [4, 5], recommendedWeapons: ["M416", "Vector", "MP5K"], recommendedGyro: "scope",
  },

  // ===== TACTICAL =====
  {
    id: "headshot",
    name: "Headshot Master",
    nameAr: "سيد الهيدشوت",
    icon: "🎯",
    category: "tactical",
    recoilControl: 74, tracking: 78, flicking: 95, longRange: 85, cqcPower: 75,
    sensMultiplier: 0.90,
    tppMultiplier: 0.92, fppMultiplier: 0.90,
    redDotMultiplier: 0.88, scope2Multiplier: 0.85, scope3Multiplier: 0.82,
    scope4Multiplier: 0.78, scope6Multiplier: 0.72, scope8Multiplier: 0.65,
    adsMultiplier: 0.85, gyroMultiplier: 0.88,
    description: "One-tap precision. Lower sensitivity for pixel-perfect headshots.",
    descriptionAr: "دقة الطلقة الواحدة. حساسية أقل لطلقات رأس مثالية.",
    recommendedFingers: [3, 4, 5], recommendedWeapons: ["AKM", "M16A4", "SKS"], recommendedGyro: "scope",
  },
  {
    id: "camper",
    name: "Tactical Holder",
    nameAr: "الحامي التكتيكي",
    icon: "🏠",
    category: "tactical",
    recoilControl: 88, tracking: 70, flicking: 65, longRange: 90, cqcPower: 60,
    sensMultiplier: 0.85,
    tppMultiplier: 0.88, fppMultiplier: 0.85,
    redDotMultiplier: 0.82, scope2Multiplier: 0.78, scope3Multiplier: 0.75,
    scope4Multiplier: 0.70, scope6Multiplier: 0.65, scope8Multiplier: 0.58,
    adsMultiplier: 0.80, gyroMultiplier: 0.78,
    description: "Hold positions, control zones. Low sensitivity for stability.",
    descriptionAr: "حماية المواقع، تحكم بالمناطق. حساسية منخفضة للثبات.",
    recommendedFingers: [2, 3, 4], recommendedWeapons: ["M416", "Mini14", "SLR"], recommendedGyro: "scope",
  },
  {
    id: "anchor",
    name: "Anchor",
    nameAr: "المرساة",
    icon: "⚓",
    category: "tactical",
    recoilControl: 90, tracking: 72, flicking: 60, longRange: 88, cqcPower: 55,
    sensMultiplier: 0.82,
    tppMultiplier: 0.85, fppMultiplier: 0.82,
    redDotMultiplier: 0.80, scope2Multiplier: 0.76, scope3Multiplier: 0.72,
    scope4Multiplier: 0.68, scope6Multiplier: 0.62, scope8Multiplier: 0.55,
    adsMultiplier: 0.78, gyroMultiplier: 0.75,
    description: "Lock down areas, provide cover. Maximum stability.",
    descriptionAr: "قفل المناطق، توفير الغطاء. أقصى ثبات.",
    recommendedFingers: [2, 3, 4], recommendedWeapons: ["DP-28", "M249", "M416"], recommendedGyro: "scope",
  },
  {
    id: "igl",
    name: "IGL Leader",
    nameAr: "قائد الفريق",
    icon: "👑",
    category: "tactical",
    recoilControl: 82, tracking: 80, flicking: 75, longRange: 80, cqcPower: 72,
    sensMultiplier: 0.94,
    tppMultiplier: 0.96, fppMultiplier: 0.94,
    redDotMultiplier: 0.92, scope2Multiplier: 0.90, scope3Multiplier: 0.88,
    scope4Multiplier: 0.85, scope6Multiplier: 0.80, scope8Multiplier: 0.75,
    adsMultiplier: 0.90, gyroMultiplier: 0.92,
    description: "Lead calls, balanced combat. Consistent and reliable.",
    descriptionAr: "قيادة النداءات، قتال متوازن. ثابت وموثوق.",
    recommendedFingers: [4, 5], recommendedWeapons: ["M416", "ACE32", "Mini14"], recommendedGyro: "scope",
  },

  // ===== SPECIALIST =====
  {
    id: "sniper",
    name: "Sniper Elite",
    nameAr: "قنّاص نخبة",
    icon: "🔭",
    category: "specialist",
    recoilControl: 80, tracking: 65, flicking: 90, longRange: 98, cqcPower: 40,
    sensMultiplier: 0.90,
    // TPP/FPP: متوسط — تقدر تتحرك وتطلّع على الأعداء
    tppMultiplier: 0.95, fppMultiplier: 0.92,
    // السكوبات: منخفضة جداً ومتدرجة حسب المسافة
    // Red Dot/2x: quickscope قريب — يحتاج سرعة معقولة للرأس القريب
    redDotMultiplier: 0.85,
    scope2Multiplier: 0.80,
    // 3x: مسافة متوسطة — أبطأ للدقة
    scope3Multiplier: 0.72,
    // 4x: المسافة الذهبية للقناصة في PUBG — بطيء ودقيق جداً
    scope4Multiplier: 0.62,
    // 6x: بعيد — بطيء جداً عشان الرأس يكون صغير
    scope6Multiplier: 0.48,
    // 8x: بعيد جداً — أبطأ شيء، بكسل واحد = الفرق بين رأس وجسم
    scope8Multiplier: 0.35,
    adsMultiplier: 0.75, gyroMultiplier: 0.80,
    description: "Long-range dominance. Ultra-low scopes for pixel-perfect headshots at every distance.",
    descriptionAr: "هيمنة بعيدة المدى. سكوبات بطيئة جداً لطلقات رأس مثالية على كل المسافات.",
    recommendedFingers: [4, 5, 6], recommendedWeapons: ["Kar98k", "M24", "AWM"], recommendedGyro: "always",
  },
  {
    id: "spray",
    name: "Spray Master",
    nameAr: "ملك الرش",
    icon: "💧",
    category: "specialist",
    recoilControl: 96, tracking: 92, flicking: 65, longRange: 70, cqcPower: 90,
    sensMultiplier: 1.05,
    tppMultiplier: 1.08, fppMultiplier: 1.05,
    redDotMultiplier: 1.10, scope2Multiplier: 1.08, scope3Multiplier: 1.05,
    scope4Multiplier: 1.02, scope6Multiplier: 0.98, scope8Multiplier: 0.92,
    adsMultiplier: 1.12, gyroMultiplier: 1.18,
    description: "Laser-like spray control. Hold down and melt enemies.",
    descriptionAr: "تحكم رش كالليزر. اضغط وأذب الأعداء.",
    recommendedFingers: [4, 5], recommendedWeapons: ["M416", "M249", "DP-28"], recommendedGyro: "scope",
  },
  {
    id: "support",
    name: "Support",
    nameAr: "الدعم",
    icon: "🛡️",
    category: "specialist",
    recoilControl: 85, tracking: 78, flicking: 68, longRange: 75, cqcPower: 70,
    sensMultiplier: 0.96,
    tppMultiplier: 0.98, fppMultiplier: 0.96,
    redDotMultiplier: 0.94, scope2Multiplier: 0.92, scope3Multiplier: 0.90,
    scope4Multiplier: 0.88, scope6Multiplier: 0.84, scope8Multiplier: 0.80,
    adsMultiplier: 0.92, gyroMultiplier: 0.95,
    description: "Cover fire, zone control. Consistent suppression.",
    descriptionAr: "نار الغطاء، تحكم المناطق. قمع ثابت.",
    recommendedFingers: [3, 4], recommendedWeapons: ["M249", "DP-28", "M416"], recommendedGyro: "scope",
  },
  {
    id: "assaulter",
    name: "Assaulter",
    nameAr: "المهاجم",
    icon: "⚔️",
    category: "specialist",
    recoilControl: 75, tracking: 85, flicking: 82, longRange: 65, cqcPower: 88,
    sensMultiplier: 1.04,
    tppMultiplier: 1.08, fppMultiplier: 1.06,
    redDotMultiplier: 1.04, scope2Multiplier: 1.00, scope3Multiplier: 0.96,
    scope4Multiplier: 0.92, scope6Multiplier: 0.86, scope8Multiplier: 0.80,
    adsMultiplier: 1.02, gyroMultiplier: 1.10,
    description: "Balanced aggression. Push with precision.",
    descriptionAr: "عدوانية متوازنة. هجوم بدقة.",
    recommendedFingers: [4, 5], recommendedWeapons: ["M416", "M762", "ACE32"], recommendedGyro: "always",
  },
  {
    id: "clutcher",
    name: "Clutcher",
    nameAr: "الكلاتشر",
    icon: "🔥",
    category: "specialist",
    recoilControl: 80, tracking: 88, flicking: 90, longRange: 75, cqcPower: 85,
    sensMultiplier: 1.02,
    // TPP/FPP: بدون تغيير - نفس السرعة
    tppMultiplier: 1.06, fppMultiplier: 1.04,
    // السكوبات: أقل = أدق = تحكم أعلى في التصويب البعيد
    redDotMultiplier: 0.88,   // كان 1.02 → أبطأ بكثير للدقة
    scope2Multiplier: 0.82,   // كان 0.98 → تحكم أفضل
    scope3Multiplier: 0.76,   // كان 0.95 → ثبات عالي
    scope4Multiplier: 0.68,   // كان 0.92 → دقة ممتازة
    scope6Multiplier: 0.58,   // كان 0.88 → تحكم دقيق جداً
    scope8Multiplier: 0.48,   // كان 0.84 → دقة بكسل
    adsMultiplier: 1.00, gyroMultiplier: 1.08,
    description: "1vX specialist. Quick TPP/FPP with surgical scope precision.",
    descriptionAr: "متخصص 1 ضد الكثير. سرعة في TPP/FPP مع دقة جراحية في السكوبات.",
    recommendedFingers: [4, 5, 6], recommendedWeapons: ["M416", "Groza", "Vector"], recommendedGyro: "always",
  },
  {
    id: "scout",
    name: "Scout",
    nameAr: "الكشّاف",
    icon: "👁️",
    category: "specialist",
    recoilControl: 78, tracking: 82, flicking: 78, longRange: 85, cqcPower: 65,
    sensMultiplier: 0.98,
    tppMultiplier: 1.00, fppMultiplier: 0.98,
    redDotMultiplier: 0.96, scope2Multiplier: 0.94, scope3Multiplier: 0.92,
    scope4Multiplier: 0.90, scope6Multiplier: 0.86, scope8Multiplier: 0.82,
    adsMultiplier: 0.94, gyroMultiplier: 0.96,
    description: "Information gatherer. Spot enemies, call positions.",
    descriptionAr: "جامع المعلومات. رصد الأعداء، نداء المواقع.",
    recommendedFingers: [3, 4], recommendedWeapons: ["Mini14", "SKS", "M416"], recommendedGyro: "scope",
  },
];

export const FINGERS = [2, 3, 4, 5, 6];

export type { WeaponProfile };
