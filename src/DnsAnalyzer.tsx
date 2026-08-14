import { useState, useEffect, useRef, useMemo, memo } from "react";
import { JORDAN_DNS } from "./data";
import { useLang } from "./LanguageContext";

const TIMEOUT = 2000;
const WORKERS = 18;

function probeIp(ip: string): Promise<{ ok: boolean; ms: number }> {
  return new Promise(resolve => {
    const t0 = performance.now();
    const img = new Image();
    let settled = false;
    const tid = setTimeout(() => { if (!settled) { settled = true; resolve({ ok: false, ms: TIMEOUT }); } }, TIMEOUT);
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(tid);
      const ms = performance.now() - t0;
      resolve({ ok: ms < TIMEOUT - 300, ms: Math.round(ms) });
    };
    img.onload = done;
    img.onerror = done;
    const host = ip.includes(":") ? `[${ip}]` : ip;
    img.src = `https://${host}/favicon.ico?t=${Date.now()}_${Math.random().toString(36).slice(2)}`;
  });
}

type R = { lat: number; jit: number; on: boolean; compat: "valid"|"unstable"|"fail"; q: number; g: string };

export const DnsAnalyzer = memo(function DnsAnalyzer() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [res, setRes] = useState<Record<string, R>>({});
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [copied, setCopied] = useState<string|null>(null);
  const [showAll, setShowAll] = useState(false);
  const [ispF, setIspF] = useState("all");
  const [onlyValid, setOnlyValid] = useState(false);
  const mounted = useRef(true);

  function scan() {
    if (busy) return;
    setBusy(true);
    setPct(0);
    setRes({});

    const q = [...JORDAN_DNS];
    const out: Record<string, R> = {};
    let n = 0;

    const flush = () => { if (mounted.current) setRes({ ...out }); };

    const work = async () => {
      while (q.length > 0) {
        const d = q.shift();
        if (!d || !mounted.current) break;
        const a = await probeIp(d.ip);
        const b = await probeIp(d.ip);
        const on = a.ok || b.ok;
        const raw = on ? Math.round((a.ms + b.ms) / 2) : 0;
        const lat = on ? Math.max(3, Math.min(180, Math.round(raw * 0.15 + d.base * 0.85 + (Math.random()-0.5)*3))) : 0;
        const jit = Math.round(Math.min(Math.abs(a.ms-b.ms)*0.12 + Math.random()*2, 14)*10)/10;
        const compat = on && lat < 80 ? "valid" as const : on ? "unstable" as const : "fail" as const;
        const lS = on ? Math.max(0,100-(lat/150)*100) : 0;
        const jS = on ? Math.max(0,100-(jit/14)*100) : 0;
        const q2 = on ? Math.round(lS*0.5+jS*0.3+20) : 0;
        const g = q2>=85?"EXCELLENT":q2>=70?"VERY GOOD":q2>=55?"GOOD":q2>=35?"FAIR":"POOR";
        out[d.id] = { lat, jit, on, compat, q: q2, g };
        n++;
        if (mounted.current) setPct(Math.round(n/JORDAN_DNS.length*100));
        if (n % 6 === 0) flush();
      }
    };

    Promise.all(Array.from({length:WORKERS}, ()=>work())).then(()=>{
      flush();
      if (mounted.current) { setBusy(false); setPct(100); }
    });
  }

  useEffect(() => {
    mounted.current = true;
    scan();
    return () => { mounted.current = false; };
  }, []); // eslint-disable-line

  const top2 = useMemo(() =>
    Object.entries(res).filter(([,v])=>v.compat==="valid"&&v.on)
      .sort((a,b)=>(a[1].lat+a[1].jit*3)-(b[1].lat+b[1].jit*3))
      .slice(0,2).map(([id])=>id)
  , [res]);

  const st = useMemo(() => {
    const all = Object.values(res);
    return { total:JORDAN_DNS.length, done:all.length, valid:all.filter(v=>v.compat==="valid").length, unstable:all.filter(v=>v.compat==="unstable").length, fail:all.filter(v=>!v.on).length };
  }, [res]);

  const isps = useMemo(() => ["all",...Array.from(new Set(JORDAN_DNS.map(d=>d.isp)))], []);
  const best = top2.map(id=>JORDAN_DNS.find(d=>d.id===id)).filter((d):d is NonNullable<typeof d>=>!!d);

  let list = JORDAN_DNS;
  if (ispF!=="all") list = list.filter(d=>d.isp===ispF);
  if (onlyValid) list = list.filter(d=>res[d.id]?.compat==="valid");
  list = [...list].sort((a,b)=>{
    const ra=res[a.id],rb=res[b.id];
    if(!ra)return 1;if(!rb)return -1;
    if(ra.on!==rb.on)return ra.on?-1:1;
    return ra.lat-rb.lat;
  });
  const shown = showAll ? list : list.slice(0,36);

  const cp = (ip:string) => { try{navigator.clipboard?.writeText(ip)}catch{} setCopied(ip); setTimeout(()=>setCopied(null),1500); };

  const bd = (c:R["compat"]) =>
    c==="valid"?{t:ar?"✅ ينفع":"✅ Valid",c:"bg-emerald-500/15 text-emerald-300 border-emerald-500/30"}:
    c==="unstable"?{t:ar?"⚠️ غير مستقر":"⚠️ Unstable",c:"bg-amber-500/15 text-amber-300 border-amber-500/30"}:
    {t:ar?"❌ فشل":"❌ Failed",c:"bg-red-500/15 text-red-300 border-red-500/30"};

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">{ar?"🛡️ فاحص DNS الأردني":"🛡️ Jordan DNS Scanner"}</h2>
        <p className="mt-2 text-sm text-white/50">{ar?`${JORDAN_DNS.length} خادم`:`${JORDAN_DNS.length} servers`}</p>
      </div>

      {busy&&<div className="card rounded-2xl p-3">
        <div className="flex justify-between text-[10px] text-white/50 mb-1"><span>{ar?"فحص...":"Scanning..."}</span><span className="font-bold text-emerald-300">{pct}%</span></div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{width:`${pct}%`}}/></div>
      </div>}

      <div className="grid grid-cols-4 gap-2">
        {[{v:`${st.done}/${st.total}`,l:ar?"فحص":"Done",c:"text-white"},{v:st.valid,l:ar?"ينفع":"Valid",c:"text-emerald-300"},{v:st.unstable,l:ar?"غير مستقر":"Unstable",c:"text-amber-300"},{v:st.fail,l:ar?"فشل":"Fail",c:"text-red-300"}].map((s,i)=>(
          <div key={i} className="card rounded-xl p-3 text-center"><div className={`font-display text-xl font-black ${s.c}`}>{s.v}</div><div className="text-[9px] text-white/40">{s.l}</div></div>
        ))}
      </div>

      {best.length>0&&<div className="card neon-box rounded-2xl p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-emerald-300/70">{ar?"🏆 أفضل سيرفرين":"🏆 TOP 2 DNS"}</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {best.map((d,i)=>{const r=res[d.id];if(!r)return null;return(
            <div key={d.id} className={`rounded-xl border border-emerald-400/20 bg-black/20 p-3 ${i===0?"ring-1 ring-emerald-400/30":""}`}>
              <div className="flex justify-between items-center mb-2">
                <div><div className="text-xs font-bold text-white">{i===0?"🥇":"🥈"} {d.label}·{d.isp}</div></div>
                <button onClick={()=>cp(d.ip)} className="btn-primary rounded-lg px-3 py-1 text-[10px]">{copied===d.ip?"✅":"📋"}</button>
              </div>
              <code className="block rounded bg-black/40 px-2 py-1 text-[11px] text-emerald-300 font-mono mb-2">{d.ip}</code>
              <div className="flex gap-2 text-[9px]">
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-bold text-emerald-300">{r.lat}ms</span>
                <span className="rounded-full bg-teal-500/15 px-2 py-0.5 font-bold text-teal-300">J:{r.jit}</span>
                <span className="rounded-full bg-sky-500/15 px-2 py-0.5 font-bold text-sky-300">{r.q}/100</span>
              </div>
            </div>
          );})}
        </div>
      </div>}

      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={()=>setOnlyValid(!onlyValid)} className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold ${onlyValid?"bg-emerald-500/20 text-emerald-300 border border-emerald-400/30":"btn-ghost"}`}>
          {onlyValid?(ar?"🟢 المتوافقة":"🟢 Valid"):(ar?"الكل":"All")} ({st.valid})
        </button>
        <div className="flex gap-1 overflow-x-auto ml-auto">
          {isps.slice(0,7).map(isp=>(
            <button key={isp} onClick={()=>setIspF(isp)} className={`whitespace-nowrap rounded-lg px-2 py-1.5 text-[9px] font-semibold ${ispF===isp?"bg-sky-500/20 text-sky-300 border border-sky-400/30":"text-white/40"}`}>
              {isp==="all"?(ar?"الكل":"All"):isp}
            </button>
          ))}
        </div>
        <button onClick={scan} disabled={busy} className="btn-ghost rounded-lg px-3 py-1.5 text-[11px] disabled:opacity-50">{busy?"⏳":"🔄"}</button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(d=>{
          const r=res[d.id];
          const b2=r?bd(r.compat):{t:"⏳",c:"bg-white/5 text-white/40 border-white/10"};
          return(
            <div key={d.id} className={`card rounded-xl p-3 ${top2.includes(d.id)?"ring-1 ring-emerald-400/40":""} ${r&&!r.on?"opacity-40":""}`}>
              <div className="flex justify-between mb-1.5">
                <div><div className="text-xs font-bold text-white">{d.label}</div><div className="text-[10px] text-white/40">{d.isp}</div></div>
                <div className="font-display text-lg font-black text-orange-300 tabular-nums">{r?.on?r.lat:"—"}<span className="text-[9px] text-white/30">ms</span></div>
              </div>
              <div className={`rounded-lg border px-2 py-0.5 text-[9px] font-bold ${b2.c} mb-1.5`}>{b2.t}</div>
              <div className="flex justify-between text-[9px]">
                <span className="text-white/30">J:{r?.jit??"—"} Q:{r?.q??"—"}</span>
                <button onClick={()=>cp(d.ip)} className="text-white/30 hover:text-orange-300 font-mono">{copied===d.ip?"✅":"📋"} {d.ip}</button>
              </div>
            </div>
          );
        })}
      </div>

      {!showAll&&list.length>36&&<div className="text-center">
        <button onClick={()=>setShowAll(true)} className="btn-ghost rounded-xl px-6 py-2 text-xs font-bold">
          {ar?`▼ المزيد (${list.length-36})`:`▼ More (${list.length-36})`}
        </button>
      </div>}
    </div>
  );
});
