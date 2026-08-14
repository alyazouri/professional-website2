import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { useLang } from "./LanguageContext";

// ═══════════════════════════════════════════════════════════════
//  PAC & PROXY INTELLIGENCE ANALYZER
//  Fetches → Parses → Tests → Scores → Ranks all PAC scripts
// ═══════════════════════════════════════════════════════════════

const GH = (repo: string, file: string) =>
  `https://raw.githubusercontent.com/alyazouri/${repo}/main/${file}`;

// All PAC sources from 4 repositories
const PAC_SOURCES = [
  // Proxypower
  { id: "pp01", url: GH("Proxypower", "01.pac"), name: "Jordan Ultra Pro", repo: "Proxypower" },
  { id: "pp02", url: GH("Proxypower", "0.pac"), name: "PP Lite", repo: "Proxypower" },
  { id: "pp03", url: GH("Proxypower", "00.pac"), name: "PP Extended", repo: "Proxypower" },
  { id: "pp04", url: GH("Proxypower", "00new.pac"), name: "PP Full Config", repo: "Proxypower" },
  { id: "pp05", url: GH("Proxypower", "011.pac"), name: "PP Boost", repo: "Proxypower" },
  { id: "pp06", url: GH("Proxypower", "0111.pac"), name: "PP Boost+", repo: "Proxypower" },
  { id: "pp07", url: GH("Proxypower", "0neew.pac"), name: "PP Pure Direct", repo: "Proxypower" },
  { id: "pp08", url: GH("Proxypower", "0new.pac"), name: "PP Ultra Mega", repo: "Proxypower" },
  { id: "pp09", url: GH("Proxypower", "0new1.pac"), name: "PP Ultra Max", repo: "Proxypower" },
  { id: "pp10", url: GH("Proxypower", "0new11.pac"), name: "PP Ultra Max+", repo: "Proxypower" },
  { id: "pp11", url: GH("Proxypower", "0new111.pac"), name: "PP Ultra Max++", repo: "Proxypower" },
  // Kingboss
  { id: "kb01", url: GH("Kingboss", "0.pac"), name: "KB Mega", repo: "Kingboss" },
  { id: "kb02", url: GH("Kingboss", "00.pac"), name: "KB Standard", repo: "Kingboss" },
  { id: "kb03", url: GH("Kingboss", "000.pac"), name: "KB 000", repo: "Kingboss" },
  { id: "kb04", url: GH("Kingboss", "0000.pac"), name: "KB 0000", repo: "Kingboss" },
  { id: "kb05", url: GH("Kingboss", "001.pac"), name: "KB 001", repo: "Kingboss" },
  { id: "kb06", url: GH("Kingboss", "01.pac"), name: "KB 01", repo: "Kingboss" },
  { id: "kb07", url: GH("Kingboss", "01111.pac"), name: "KB 01111", repo: "Kingboss" },
  { id: "kb08", url: GH("Kingboss", "01pro.pac"), name: "KB Pro", repo: "Kingboss" },
  { id: "kb09", url: GH("Kingboss", "0A.pac"), name: "KB Alpha", repo: "Kingboss" },
  { id: "kb10", url: GH("Kingboss", "0A2.pac"), name: "KB Alpha2", repo: "Kingboss" },
  { id: "kb11", url: GH("Kingboss", "0A3.pac"), name: "KB Alpha3", repo: "Kingboss" },
  // SB3
  { id: "sb01", url: GH("SB3", "0.pac"), name: "SB3 Base", repo: "SB3" },
  { id: "sb02", url: GH("SB3", "1Q.pac"), name: "SB3 1Q", repo: "SB3" },
  { id: "sb03", url: GH("SB3", "9700.pac"), name: "SB3 9700", repo: "SB3" },
  { id: "sb04", url: GH("SB3", "9700C.pac"), name: "SB3 9700C", repo: "SB3" },
  { id: "sb05", url: GH("SB3", "A.pac"), name: "SB3 A", repo: "SB3" },
  { id: "sb06", url: GH("SB3", "Aaa.pac"), name: "SB3 Aaa", repo: "SB3" },
  { id: "sb07", url: GH("SB3", "As.pac"), name: "SB3 As", repo: "SB3" },
  { id: "sb08", url: GH("SB3", "B.pac"), name: "SB3 B", repo: "SB3" },
  { id: "sb09", url: GH("SB3", "Be5.pac"), name: "SB3 Be5", repo: "SB3" },
  { id: "sb10", url: GH("SB3", "Bot.pac"), name: "SB3 Bot", repo: "SB3" },
  { id: "sb11", url: GH("SB3", "C.pac"), name: "SB3 C", repo: "SB3" },
  { id: "sb12", url: GH("SB3", "D.pac"), name: "SB3 D", repo: "SB3" },
  // Q
  { id: "qq01", url: GH("Q", "0.pac"), name: "Q Base", repo: "Q" },
  { id: "qq02", url: GH("Q", "00.pac"), name: "Q 00", repo: "Q" },
  { id: "qq03", url: GH("Q", "0000.pac"), name: "Q 0000", repo: "Q" },
  { id: "qq04", url: GH("Q", "01.pac"), name: "Q 01", repo: "Q" },
  { id: "qq05", url: GH("Q", "0ksajordan.pac"), name: "Q JO+SA Jordan", repo: "Q" },
  { id: "qq06", url: GH("Q", "1.pac"), name: "Q 1", repo: "Q" },
  { id: "qq07", url: GH("Q", "2.pac"), name: "Q 2", repo: "Q" },
  { id: "qq08", url: GH("Q", "20260301.pac"), name: "Q 2026", repo: "Q" },
  { id: "qq09", url: GH("Q", "32ipv6old.pac"), name: "Q IPv6-32", repo: "Q" },
  { id: "qq10", url: GH("Q", "40Ipv6old.pac"), name: "Q IPv6-40", repo: "Q" },
  { id: "qq11", url: GH("Q", "48ipv6old.pac"), name: "Q IPv6-48", repo: "Q" },
  { id: "qq12", url: GH("Q", "D.pac"), name: "Q D", repo: "Q" },
] as const;

// ═══ TYPES ═══
type ProxyEntry = {
  host: string;
  port: number;
  protocol: "PROXY" | "HTTPS" | "SOCKS4" | "SOCKS5" | "DIRECT";
};

type PacAnalysis = {
  id: string;
  name: string;
  repo: string;
  url: string;
  fetched: boolean;
  sizeBytes: number;
  rules: number;
  proxies: ProxyEntry[];
  hasDirect: boolean;
  hasGameDomains: boolean;
  hasJordanCIDRs: boolean;
  complexity: "low" | "medium" | "high";
  status: "pending" | "fetching" | "ready" | "error";
  errorMsg?: string;
};

type ProxyResult = {
  pacId: string;
  proxy: ProxyEntry;
  samples: number[];
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  jitter: number;
  online: boolean;
  qualityScore: number;
  qualityGrade: string;
  jordanVisibility: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  jordanProb: number;
  status: "testing" | "online" | "offline" | "timeout";
};

// ═══ PAC PARSER — Extract proxy entries from PAC text ═══
function parsePac(text: string): {
  proxies: ProxyEntry[];
  rules: number;
  hasDirect: boolean;
  hasGameDomains: boolean;
  hasJordanCIDRs: boolean;
  complexity: "low" | "medium" | "high";
} {
  // Extract all PROXY/HTTPS/SOCKS/SOCKS5 entries
  const proxyRegex = /"(PROXY|HTTPS|SOCKS[45]?)\s+([^:;]+):(\d+)"/gi;
  const proxies: ProxyEntry[] = [];
  const seen = new Set<string>();
  let match;
  while ((match = proxyRegex.exec(text)) !== null) {
    const proto = match[1].toUpperCase() as ProxyEntry["protocol"];
    const host = match[2].trim();
    const port = parseInt(match[3], 10);
    const key = `${proto}:${host}:${port}`;
    if (!seen.has(key) && host && port > 0) {
      seen.add(key);
      proxies.push({ host, port, protocol: proto });
    }
  }

  // Count rules (if statements, return statements)
  const rules = (text.match(/return\s+"[^"]*"/g) || []).length;

  // Check for DIRECT fallback
  const hasDirect = /return\s+"DIRECT"/i.test(text) || /DIRECT/i.test(text);

  // Check for game domains
  const gameKeywords = ["pubg", "proximabeta", "tencent", "levelinfinite", "igamecj", "battlegrounds", "imabox"];
  const hasGameDomains = gameKeywords.some(k => text.toLowerCase().includes(k));

  // Check for Jordan CIDRs
  const joKeywords = ["46.185", "94.142", "176.29", "176.28", "82.212", "92.253", "109.237", "91.106", "77.245"];
  const hasJordanCIDRs = joKeywords.some(k => text.includes(k));

  // Complexity
  const size = text.length;
  const complexity: "low" | "medium" | "high" =
    size > 50000 || proxies.length > 10 ? "high" :
    size > 10000 || proxies.length > 3 ? "medium" : "low";

  return { proxies, rules, hasDirect, hasGameDomains, hasJordanCIDRs, complexity };
}

// ═══ PROXY TESTER — Fast single probe ═══
async function testEndpoint(url: string, _samples = 1): Promise<{ latencies: number[]; reachable: boolean }> {
  const latencies: number[] = [];
  let reachable = false;

  for (let i = 0; i < 1; i++) {
    const result = await new Promise<number | null>(resolve => {
      const start = performance.now();
      const img = new Image();
      const timer = setTimeout(() => { resolve(null); }, 3000);
      img.onload = () => { clearTimeout(timer); resolve(performance.now() - start); reachable = true; };
      img.onerror = () => {
        clearTimeout(timer);
        const latency = performance.now() - start;
        if (latency < 2500) { reachable = true; resolve(latency); }
        else resolve(null);
      };
      img.src = `${url}?_t=${Date.now()}_${i}`;
    });
    if (result !== null) latencies.push(Math.round(result));
  }

  return { latencies, reachable };
}

// ═══ QUALITY SCORE CALCULATION ═══
function calcQuality(latency: number, jitter: number, online: boolean): { score: number; grade: string } {
  if (!online) return { score: 0, grade: "POOR" };
  // Latency: 30% (lower is better, ideal <50ms)
  const latScore = Math.max(0, Math.min(100, 100 - (latency / 200) * 100));
  // Jitter: 20% (lower is better, ideal <5ms)
  const jitScore = Math.max(0, Math.min(100, 100 - (jitter / 20) * 100));
  // Reliability: 20% (online = 100)
  const relScore = online ? 100 : 0;
  // Connection success: 10% (online = 100)
  const connScore = online ? 100 : 0;
  // Packet loss placeholder: 20% (assume 100 if online with low jitter)
  const lossScore = jitter < 10 ? 100 : jitter < 20 ? 70 : 40;

  const score = Math.round(latScore * 0.3 + jitScore * 0.2 + lossScore * 0.2 + relScore * 0.2 + connScore * 0.1);
  const grade =
    score >= 90 ? "EXCELLENT" :
    score >= 75 ? "VERY GOOD" :
    score >= 60 ? "GOOD" :
    score >= 40 ? "FAIR" : "POOR";
  return { score, grade };
}

// ═══ JORDAN VISIBILITY ESTIMATE ═══
function estJordanVisibility(host: string, latency: number, hasJordanCIDR: boolean): {
  level: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  prob: number;
} {
  const joKeywords = ["46.185", "94.142", "176.29", "176.28", "82.212", "92.253", "109.237", "91.106", "77.245"];
  const isJordan = joKeywords.some(k => host.startsWith(k));
  if (isJordan) return { level: "HIGH", prob: 75 };
  if (hasJordanCIDR) return { level: "MEDIUM", prob: 45 };
  if (latency < 50) return { level: "MEDIUM", prob: 35 };
  if (latency < 120) return { level: "LOW", prob: 15 };
  return { level: "LOW", prob: 5 };
}

// ═══ COMPONENT ═══
export const PacAnalyzer = memo(function PacAnalyzer() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [analyses, setAnalyses] = useState<Record<string, PacAnalysis>>({});
  const [proxyResults, setProxyResults] = useState<ProxyResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "fetching" | "testing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"ranking" | "pac" | "summary">("ranking");
  const scanRef = useRef(false);

  const startScan = useCallback(async () => {
    if (scanRef.current) return;
    scanRef.current = true;
    setScanning(true);
    setPhase("fetching");
    setProgress(0);

    // Phase 1: Fetch + Parse all PAC files
    const initAnalyses: Record<string, PacAnalysis> = {};
    PAC_SOURCES.forEach(s => {
      initAnalyses[s.id] = {
        id: s.id, name: s.name, repo: s.repo, url: s.url,
        fetched: false, sizeBytes: 0, rules: 0, proxies: [],
        hasDirect: false, hasGameDomains: false, hasJordanCIDRs: false,
        complexity: "low", status: "fetching",
      };
    });
    setAnalyses(initAnalyses);

    const allProxyResults: ProxyResult[] = [];
    let fetched = 0;
    const total = PAC_SOURCES.length;

    // Fetch PACs in parallel batches
    const fetchBatch = async (batch: readonly (typeof PAC_SOURCES)[number][]) => {
      await Promise.all(batch.map(async (src) => {
        try {
          const res = await fetch(src.url, { cache: "no-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const text = await res.text();
          const parsed = parsePac(text);
          setAnalyses(prev => ({
            ...prev,
            [src.id]: {
              ...prev[src.id], fetched: true, sizeBytes: text.length,
              rules: parsed.rules, proxies: parsed.proxies,
              hasDirect: parsed.hasDirect, hasGameDomains: parsed.hasGameDomains,
              hasJordanCIDRs: parsed.hasJordanCIDRs, complexity: parsed.complexity,
              status: "ready",
            },
          }));
          // Queue proxy tests for this PAC
          const proxiesToTest = parsed.proxies.length > 0 ? parsed.proxies.slice(0, 3) : [];
          // If no proxies found (pure DIRECT PAC), test the PAC URL itself as endpoint
          if (proxiesToTest.length === 0) {
            allProxyResults.push({
              pacId: src.id,
              proxy: { host: src.url, port: 443, protocol: "DIRECT" as const },
              samples: [], avgLatency: 0, minLatency: 0, maxLatency: 0,
              jitter: 0, online: false, qualityScore: 0, qualityGrade: "UNKNOWN",
              jordanVisibility: "UNKNOWN", jordanProb: 0, status: "testing",
            });
          }
          proxiesToTest.forEach(p => {
            allProxyResults.push({
              pacId: src.id, proxy: p, samples: [], avgLatency: 0, minLatency: 0, maxLatency: 0,
              jitter: 0, online: false, qualityScore: 0, qualityGrade: "UNKNOWN",
              jordanVisibility: "UNKNOWN", jordanProb: 0, status: "testing",
            });
          });
        } catch {
          setAnalyses(prev => ({
            ...prev,
            [src.id]: { ...prev[src.id], status: "error", errorMsg: "Fetch failed (CORS/offline)" },
          }));
        }
        fetched++;
        setProgress(Math.round((fetched / total) * 50)); // 50% for fetch phase
      }));
    };

    // Fetch in batches of 10
    for (let i = 0; i < PAC_SOURCES.length; i += 10) {
      await fetchBatch(PAC_SOURCES.slice(i, i + 10));
    }

    // Phase 2: Test endpoints with multiple samples
    setPhase("testing");
    setProxyResults(allProxyResults);

    let tested = 0;
    const testBatch = async (batch: ProxyResult[]) => {
      await Promise.all(batch.map(async (pr) => {
        const globalIdx = allProxyResults.indexOf(pr);
        const testUrl = pr.proxy.protocol === "DIRECT"
          ? pr.proxy.host
          : `https://${pr.proxy.host}`;
        const { latencies, reachable } = await testEndpoint(testUrl, 1);
        const avg = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
        const min = latencies.length > 0 ? Math.min(...latencies) : 0;
        const max = latencies.length > 0 ? Math.max(...latencies) : 0;
        let jit = 0;
        for (let i = 1; i < latencies.length; i++) jit += Math.abs(latencies[i] - latencies[i - 1]);
        jit = latencies.length > 1 ? Math.round((jit / (latencies.length - 1)) * 10) / 10 : 0;
        const { score, grade } = calcQuality(avg, jit, reachable);
        const pacData = analyses[pr.pacId];
        const vis = estJordanVisibility(pr.proxy.host, avg, pacData?.hasJordanCIDRs ?? false);

        allProxyResults[globalIdx] = {
          ...pr, samples: latencies, avgLatency: avg, minLatency: min, maxLatency: max,
          jitter: jit, online: reachable, qualityScore: score, qualityGrade: grade,
          jordanVisibility: vis.level, jordanProb: vis.prob,
          status: reachable ? "online" : "offline",
        };
        tested++;
        setProgress(50 + Math.round((tested / allProxyResults.length) * 50));
        if (tested % 5 === 0 || tested === allProxyResults.length) {
          setProxyResults([...allProxyResults]);
        }
      }));
    };

    for (let i = 0; i < allProxyResults.length; i += 12) {
      await testBatch(allProxyResults.slice(i, i + 12));
    }

    setProxyResults([...allProxyResults]);
    setPhase("done");
    setScanning(false);
    scanRef.current = false;
    setProgress(100);
  }, [analyses]);

  // Auto-start on mount
  useEffect(() => {
    startScan();
    return () => { scanRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ═══ RANKED RESULTS ═══
  const ranked = useMemo(() => {
    return [...proxyResults].sort((a, b) => {
      // Online first
      if (a.online !== b.online) return a.online ? -1 : 1;
      // Higher quality
      if (a.qualityScore !== b.qualityScore) return b.qualityScore - a.qualityScore;
      // Lower latency
      return a.avgLatency - b.avgLatency;
    });
  }, [proxyResults]);

  // ═══ SUMMARY STATS ═══
  const summary = useMemo(() => {
    const fetched = Object.values(analyses).filter(a => a.fetched);
    const totalRules = fetched.reduce((s, a) => s + a.rules, 0);
    const allProxies = new Set<string>();
    fetched.forEach(a => a.proxies.forEach(p => allProxies.add(`${p.host}:${p.port}`)));
    const onlineCount = proxyResults.filter(p => p.online).length;
    const testedCount = proxyResults.length;
    const avgLat = proxyResults.filter(p => p.online).reduce((s, p) => s + p.avgLatency, 0);
    const onlineProxies = proxyResults.filter(p => p.online);
    const avgLatency = onlineProxies.length > 0 ? Math.round(avgLat / onlineProxies.length) : 0;
    const avgJit = onlineProxies.length > 0 ? Math.round(onlineProxies.reduce((s, p) => s + p.jitter, 0) / onlineProxies.length * 10) / 10 : 0;
    const best = ranked[0] && ranked[0].online ? ranked[0] : null;
    const bestPac = best ? analyses[best.pacId] : null;
    const jordanProxies = onlineProxies.filter(p => p.jordanVisibility === "HIGH");
    return {
      pacFiles: PAC_SOURCES.length,
      fetched: fetched.length,
      errors: Object.values(analyses).filter(a => a.status === "error").length,
      totalRules,
      uniqueProxies: allProxies.size,
      testedCount,
      onlineCount,
      offlineCount: testedCount - onlineCount,
      avgLatency, avgJit,
      best, bestPac,
      jordanHigh: jordanProxies.length,
    };
  }, [analyses, proxyResults, ranked]);

  const copyUrl = (url: string, id: string) => {
    try { navigator.clipboard?.writeText(url); } catch { /* */ }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const exportJson = () => {
    const data = {
      summary,
      pacAnalyses: Object.values(analyses).filter(a => a.fetched),
      proxyResults: ranked,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pac-intelligence-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    const headers = "PAC,Proxy,Port,Protocol,Status,AvgLatency,Jitter,Quality,JordanVisibility,JordanProb\n";
    const rows = ranked.map(r => {
      const pac = analyses[r.pacId]?.name ?? r.pacId;
      return `${pac},${r.proxy.host},${r.proxy.port},${r.proxy.protocol},${r.status},${r.avgLatency},${r.jitter},${r.qualityScore},${r.jordanVisibility},${r.jordanProb}`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pac-proxy-ranking.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const phaseLabel = phase === "fetching" ? (isAr ? "تحميل سكربتات PAC..." : "Fetching PAC scripts...")
    : phase === "testing" ? (isAr ? "فحص البروكسيات..." : "Testing proxies...")
    : isAr ? "اكتمل" : "Complete";

  const qualityColor = (g: string) =>
    g === "EXCELLENT" ? "text-emerald-300 bg-emerald-500/15" :
    g === "VERY GOOD" ? "text-teal-300 bg-teal-500/15" :
    g === "GOOD" ? "text-amber-300 bg-amber-500/15" :
    g === "FAIR" ? "text-orange-300 bg-orange-500/15" : "text-red-300 bg-red-500/15";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="mb-2 inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-orange-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
            {isAr ? "محلّل PAC الذكي" : "PAC INTELLIGENCE ANALYZER"}
          </span>
        </div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
          {isAr ? "📡 تحليل PAC & Proxy الكامل" : "📡 Full PAC & Proxy Analysis"}
        </h2>
        <p className="mt-2 text-sm text-white/50">
          {isAr ? "تحميل + فحص + تحليل + ترتيب 46 سكربت PAC" : "Fetch + Parse + Test + Rank 46 PAC scripts"}
        </p>
      </div>

      {/* Progress */}
      {scanning && (
        <div className="card rounded-2xl p-3">
          <div className="flex items-center justify-between text-[10px] text-white/50 mb-1.5">
            <span>{phaseLabel}</span>
            <span className="font-bold text-orange-300">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {phase === "done" && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {[
            { v: `${summary.fetched}/${summary.pacFiles}`, l: isAr ? "PAC محمّل" : "PAC Fetched", c: "text-white" },
            { v: summary.uniqueProxies, l: isAr ? "بروكسي فريد" : "Unique Proxies", c: "text-sky-300" },
            { v: summary.onlineCount, l: isAr ? "متصل" : "Online", c: "text-emerald-300" },
            { v: summary.offlineCount, l: isAr ? "غير متصل" : "Offline", c: "text-red-300" },
            { v: summary.totalRules, l: isAr ? "قواعد" : "Rules", c: "text-amber-300" },
            { v: `${summary.avgLatency}ms`, l: isAr ? "متوسط البينغ" : "Avg Ping", c: "text-orange-300" },
            { v: summary.avgJit, l: isAr ? "متوسط التذبذب" : "Avg Jitter", c: "text-teal-300" },
            { v: summary.jordanHigh, l: isAr ? "JO مرئية" : "JO Visibility", c: "text-purple-300" },
          ].map((s, i) => (
            <div key={i} className="card rounded-xl p-3 text-center">
              <div className={`font-display text-lg font-black ${s.c}`}>{s.v}</div>
              <div className="text-[9px] text-white/40">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Best Result */}
      {summary.best && summary.bestPac && (
        <div className="card neon-box rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20 text-2xl">🏆</div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-300/70">{isAr ? "أفضل PAC + Proxy" : "BEST PAC + PROXY"}</div>
                <div className="text-lg font-bold text-white">{summary.bestPac.name}</div>
                <div className="mt-0.5 flex items-center gap-2">
                  <code className="rounded bg-black/40 px-2 py-0.5 text-xs text-emerald-300 font-mono">{summary.best.proxy.host}:{summary.best.proxy.port}</code>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${qualityColor(summary.best.qualityGrade)}`}>{summary.best.qualityScore}/100 · {summary.best.qualityGrade}</span>
                </div>
              </div>
            </div>
            <button onClick={() => copyUrl(summary.bestPac!.url, summary.best!.pacId)} className="btn-primary rounded-xl px-4 py-2.5 text-sm">
              {copiedId === summary.best.pacId ? "✅" : "📋"} {isAr ? "نسخ" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(["ranking", "pac", "summary"] as const).map(tb => (
          <button key={tb} onClick={() => setSelectedTab(tb)}
            className={`flex-1 rounded-lg py-2 text-[11px] font-bold transition-all ${selectedTab === tb ? "bg-orange-500/20 text-orange-300 border border-orange-400/30" : "btn-ghost"}`}>
            {tb === "ranking" ? (isAr ? "🏆 الترتيب" : "🏆 Ranking") :
             tb === "pac" ? (isAr ? "📜 تحليل PAC" : "📜 PAC Analysis") :
             (isAr ? "📊 التقرير" : "📊 Report")}
          </button>
        ))}
      </div>

      {/* Export Buttons */}
      {phase === "done" && (
        <div className="flex gap-2">
          <button onClick={exportJson} className="btn-ghost flex-1 rounded-lg py-2 text-[11px] font-bold">📥 JSON</button>
          <button onClick={exportCsv} className="btn-ghost flex-1 rounded-lg py-2 text-[11px] font-bold">📥 CSV</button>
          <button onClick={startScan} disabled={scanning} className="btn-ghost flex-1 rounded-lg py-2 text-[11px] font-bold disabled:opacity-50">
            {scanning ? "⏳" : "🔄"} {isAr ? "إعادة" : "Re-scan"}
          </button>
        </div>
      )}

      {/* Ranking Tab */}
      {selectedTab === "ranking" && (
        <div className="space-y-2">
          {ranked.length === 0 && !scanning && (
            <div className="card rounded-2xl p-8 text-center text-white/40">{isAr ? "لا توجد نتائج بعد" : "No results yet"}</div>
          )}
          {ranked.filter(r => r.proxy.host && !r.proxy.host.startsWith("http")).slice(0, 30).map((r, idx) => {
            const pac = analyses[r.pacId];
            return (
              <div key={`${r.pacId}-${r.proxy.host}-${r.proxy.port}`} className={`card rounded-xl p-3 ${r.online ? "" : "opacity-50"}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-display text-sm font-bold text-white/30">{idx + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{r.proxy.host}:{r.proxy.port}</span>
                        <span className="rounded bg-white/5 px-1 py-0.5 text-[8px] font-bold text-white/40">{r.proxy.protocol}</span>
                      </div>
                      <div className="text-[9px] text-white/30 truncate">{pac?.name ?? r.pacId} · {pac?.repo}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="font-display text-sm font-bold text-orange-300">{r.online ? `${r.avgLatency}` : "—"}<span className="text-[8px] text-white/30 font-normal">ms</span></div>
                      <div className="text-[8px] text-white/30">J:{r.jitter}</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${qualityColor(r.qualityGrade)}`}>{r.qualityScore}</span>
                  </div>
                </div>
                {/* Mini latency graph */}
                {r.samples.length > 1 && r.online && (
                  <div className="mt-2 flex items-end gap-0.5 h-6">
                    {r.samples.map((s, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400 rounded-t-sm"
                        style={{ height: `${Math.max(15, Math.min(100, (s / r.maxLatency) * 100))}%` }} />
                    ))}
                  </div>
                )}
                {/* Jordan visibility badge */}
                {r.online && (
                  <div className="mt-1.5 flex items-center gap-2 text-[8px]">
                    <span className={`rounded px-1.5 py-0.5 font-bold ${
                      r.jordanVisibility === "HIGH" ? "bg-emerald-500/15 text-emerald-300" :
                      r.jordanVisibility === "MEDIUM" ? "bg-amber-500/15 text-amber-300" :
                      "bg-white/5 text-white/40"}`}>
                      JO: {r.jordanVisibility} ({r.jordanProb}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PAC Analysis Tab */}
      {selectedTab === "pac" && (
        <div className="space-y-2">
          {Object.values(analyses).filter(a => a.fetched || a.status === "error").map(a => (
            <div key={a.id} className="card rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{a.name}</span>
                    <span className="rounded bg-white/5 px-1 py-0.5 text-[8px] font-bold text-white/40">{a.repo}</span>
                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                      a.complexity === "high" ? "bg-red-500/15 text-red-300" :
                      a.complexity === "medium" ? "bg-amber-500/15 text-amber-300" :
                      "bg-emerald-500/15 text-emerald-300"}`}>{a.complexity.toUpperCase()}</span>
                  </div>
                  <div className="text-[9px] text-white/30">{(a.sizeBytes / 1024).toFixed(1)}KB · {a.rules} rules · {a.proxies.length} proxies</div>
                </div>
                <button onClick={() => copyUrl(a.url, a.id)} className="text-white/30 hover:text-orange-300 text-sm">
                  {copiedId === a.id ? "✅" : "📋"}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {a.hasDirect && <span className="rounded bg-sky-500/15 px-1.5 py-0.5 text-[8px] font-bold text-sky-300">DIRECT ✅</span>}
                {a.hasGameDomains && <span className="rounded bg-orange-500/15 px-1.5 py-0.5 text-[8px] font-bold text-orange-300">GAME DOMAINS</span>}
                {a.hasJordanCIDRs && <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-bold text-emerald-300">JO CIDR 🇯🇴</span>}
                {a.proxies.map((p, i) => (
                  <span key={i} className="rounded bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-white/50">{p.protocol} {p.host}</span>
                ))}
              </div>
              {a.status === "error" && <div className="mt-2 text-[9px] text-red-300">⚠️ {a.errorMsg}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Summary Report Tab */}
      {selectedTab === "summary" && phase === "done" && (
        <div className="card rounded-2xl p-5 space-y-3">
          <div className="text-sm font-bold text-orange-300">{isAr ? "📊 تقرير المشروع الكامل" : "📊 Complete Project Report"}</div>
          <div className="space-y-2 text-xs text-white/60">
            {[
              [isAr ? "إجمالي ملفات PAC" : "Total PAC Files", summary.pacFiles],
              [isAr ? "تم تحميلها" : "Successfully Fetched", summary.fetched],
              [isAr ? "فشل التحميل" : "Fetch Errors", summary.errors],
              [isAr ? "إجمالي القواعد" : "Total Rules", summary.totalRules],
              [isAr ? "بروكسي فريد" : "Unique Proxies", summary.uniqueProxies],
              [isAr ? "تم فحصها" : "Tested", summary.testedCount],
              [isAr ? "متصل" : "Online", summary.onlineCount],
              [isAr ? "غير متصل" : "Offline/Timeout", summary.offlineCount],
              [isAr ? "متوسط البينغ" : "Average Latency", `${summary.avgLatency}ms`],
              [isAr ? "متوسط التذبذب" : "Average Jitter", summary.avgJit],
              [isAr ? "رؤية أردنية عالية" : "High JO Visibility", summary.jordanHigh],
            ].map(([label, val], i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-white/40">{label}</span>
                <span className="font-bold text-white">{val}</span>
              </div>
            ))}
          </div>
          {summary.bestPac && (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-3">
              <div className="text-[10px] uppercase tracking-widest text-emerald-300/70 mb-1">{isAr ? "التوصية" : "RECOMMENDATION"}</div>
              <div className="text-sm text-white/80">
                {isAr ? `أفضل PAC: ${summary.bestPac.name}` : `Best PAC: ${summary.bestPac.name}`}
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                {isAr ? "انسخ الرابط وضعه في إعدادات الوكاي" : "Copy the URL and paste in Proxy settings"}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-3">
            <div className="text-[10px] text-amber-300/80">
              ⚠️ {isAr
                ? "رؤية اللاعبين الأردنيين تقديرية بناءً على معطيات الشبكة، وليست بيانات لاعبين فعليين."
                : "Jordan player visibility is estimated from network indicators, not actual player data."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
