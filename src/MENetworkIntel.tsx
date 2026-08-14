import { useState, useMemo, memo } from "react";
import { useLang } from "./LanguageContext";
import { ME_COUNTRIES, countryStats, formatIPCount, type MECountry } from "./meNetwork";

export const MENetworkIntel = memo(function MENetworkIntel() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "ipv4" | "ipv6" | "asn">("overview");
  const [search, setSearch] = useState("");

  const country = selected ? ME_COUNTRIES.find(c => c.code === selected) : null;

  const totals = useMemo(() => {
    let ipv4 = 0, ipv6 = 0, asn = 0, isp = 0;
    ME_COUNTRIES.forEach(c => {
      const s = countryStats(c);
      ipv4 += s.totalIPv4;
      ipv6 += s.ipv6Prefixes;
      asn += s.asnCount;
      isp += s.ispCount;
    });
    return { countries: ME_COUNTRIES.length, ipv4, ipv6, asn, isp };
  }, []);

  const filteredCountries = ME_COUNTRIES.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.nameAr.includes(search) || c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
          {ar ? "🌐 استخبارات شبكات الشرق الأوسط" : "🌐 Middle East Network Intelligence"}
        </h2>
        <p className="mt-2 text-sm text-white/50">
          {ar ? `${totals.countries} دولة · ${formatIPCount(totals.ipv4)} عنوان IPv4 · ${totals.asn} ASN` : `${totals.countries} countries · ${formatIPCount(totals.ipv4)} IPv4 addresses · ${totals.asn} ASNs`}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {[
          { v: totals.countries, l: ar ? "دولة" : "Countries", c: "text-white" },
          { v: formatIPCount(totals.ipv4), l: "IPv4", c: "text-orange-300" },
          { v: totals.ipv6, l: "IPv6", c: "text-sky-300" },
          { v: totals.asn, l: "ASN", c: "text-emerald-300" },
          { v: totals.isp, l: "ISP", c: "text-amber-300" },
        ].map((s, i) => (
          <div key={i} className="card rounded-xl p-3 text-center">
            <div className={`font-display text-xl font-black ${s.c}`}>{s.v}</div>
            <div className="text-[9px] text-white/40">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card flex items-center gap-2 rounded-xl px-3 py-2">
        <span className="text-white/40">🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={ar ? "ابحث عن دولة..." : "Search country..."}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none" />
      </div>

      {/* Country Grid */}
      {!selected && (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCountries.map(c => {
            const s = countryStats(c);
            return (
              <button key={c.code} onClick={() => setSelected(c.code)}
                className="card rounded-xl p-4 text-left transition-all hover:ring-1 hover:ring-orange-400/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{ar ? c.nameAr : c.name}</div>
                    <div className="text-[10px] text-white/40">{c.code} · {c.isps.length} ISPs</div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[9px]">
                  <div className="rounded bg-white/5 p-1.5 text-center"><span className="text-white/40">IPv4</span><div className="font-bold text-orange-300">{formatIPCount(s.totalIPv4)}</div></div>
                  <div className="rounded bg-white/5 p-1.5 text-center"><span className="text-white/40">IPv6</span><div className="font-bold text-sky-300">{s.ipv6Prefixes}</div></div>
                  <div className="rounded bg-white/5 p-1.5 text-center"><span className="text-white/40">ASN</span><div className="font-bold text-emerald-300">{s.asnCount}</div></div>
                  <div className="rounded bg-white/5 p-1.5 text-center"><span className="text-white/40">DNS</span><div className="font-bold text-purple-300">{s.dnsCount}</div></div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Country Detail */}
      {selected && country && (
        <div className="space-y-4">
          {/* Back + Header */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="btn-ghost rounded-lg px-3 py-2 text-xs">← {ar ? "رجوع" : "Back"}</button>
            <span className="text-3xl">{country.flag}</span>
            <div>
              <div className="text-lg font-bold text-white">{ar ? country.nameAr : country.name}</div>
              <div className="text-xs text-white/40">{country.code} · {country.isps.join(", ")}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["overview", "ipv4", "ipv6", "asn"] as const).map(tb => (
              <button key={tb} onClick={() => setTab(tb)}
                className={`flex-1 rounded-lg py-2 text-[11px] font-bold ${tab === tb ? "bg-orange-500/20 text-orange-300 border border-orange-400/30" : "btn-ghost"}`}>
                {tb === "overview" ? (ar ? "نظرة عامة" : "Overview") :
                 tb === "ipv4" ? `IPv4 (${country.ipv4Prefixes.length})` :
                 tb === "ipv6" ? `IPv6 (${country.ipv6Prefixes.length})` :
                 `ASN (${country.asns.length})`}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === "overview" && <CountryOverview country={country} ar={ar} />}

          {/* IPv4 Tab */}
          {tab === "ipv4" && (
            <div className="space-y-2">
              {country.ipv4Prefixes.length === 0 && <div className="card rounded-xl p-6 text-center text-white/40">{ar ? "لا توجد بيانات" : "No data"}</div>}
              {country.ipv4Prefixes.map((p, i) => (
                <div key={i} className="card rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-bold text-orange-300 font-mono">{p.cidr}</code>
                    <span className="text-[10px] text-white/40">{formatIPCount(p.allocated)} IPs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[9px]">
                    <div><span className="text-white/30">ISP:</span> <span className="text-white">{p.isp}</span></div>
                    <div><span className="text-white/30">ASN:</span> <span className="text-white">AS{p.asn}</span></div>
                    <div><span className="text-white/30">{ar ? "المصدر" : "Source"}:</span> <span className="text-white/60">{p.source}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* IPv6 Tab */}
          {tab === "ipv6" && (
            <div className="space-y-2">
              {country.ipv6Prefixes.length === 0 && <div className="card rounded-xl p-6 text-center text-white/40">{ar ? "لا توجد بيانات IPv6" : "No IPv6 data"}</div>}
              {country.ipv6Prefixes.map((p, i) => (
                <div key={i} className="card rounded-xl p-3">
                  <code className="text-sm font-bold text-sky-300 font-mono">{p.cidr}</code>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[9px]">
                    <div><span className="text-white/30">ISP:</span> <span className="text-white">{p.isp}</span></div>
                    <div><span className="text-white/30">ASN:</span> <span className="text-white">AS{p.asn}</span></div>
                    <div><span className="text-white/30">{ar ? "المصدر" : "Source"}:</span> <span className="text-white/60">{p.source}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ASN Tab */}
          {tab === "asn" && (
            <div className="space-y-2">
              {country.asns.map((a, i) => (
                <div key={i} className="card rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-display text-sm font-bold text-emerald-300">AS{a.asn}</span>
                      <span className="ml-2 text-xs text-white">{a.name}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{a.source}</span>
                  </div>
                  <div className="text-[9px] text-white/50">{a.org}</div>
                  <div className="mt-2 flex gap-2 text-[9px]">
                    <span className="rounded bg-orange-500/15 px-2 py-0.5 text-orange-300">IPv4: {a.ipv4Count} prefixes</span>
                    <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-300">IPv6: {a.ipv6Count} prefixes</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Data Source Notice */}
          <div className="card rounded-xl p-3">
            <div className="text-[9px] text-amber-300/70">
              ⚠️ {ar ? "البيانات مأخوذة من RIPE NCC (الهيئة الإقليمية لعناوين الإنترنت). عدد المستخدمين = UNKNOWN. الأداء = NOT MEASURED من موقعك." : "Data sourced from RIPE NCC (Regional Internet Registry). User count = UNKNOWN. Performance = NOT MEASURED from your location."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

function CountryOverview({ country, ar }: { country: MECountry; ar: boolean }) {
  const s = countryStats(country);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { v: formatIPCount(s.totalIPv4), l: "IPv4 Addresses", c: "text-orange-300" },
          { v: s.ipv4Prefixes, l: "IPv4 Prefixes", c: "text-orange-300" },
          { v: s.ipv6Prefixes, l: "IPv6 Prefixes", c: "text-sky-300" },
          { v: s.asnCount, l: "ASNs", c: "text-emerald-300" },
        ].map((m, i) => (
          <div key={i} className="card rounded-xl p-3 text-center">
            <div className={`font-display text-xl font-black ${m.c}`}>{m.v}</div>
            <div className="text-[9px] text-white/40">{m.l}</div>
          </div>
        ))}
      </div>

      {/* ISPs */}
      <div className="card rounded-xl p-3">
        <div className="text-xs font-bold text-white mb-2">{ar ? "مزوّدو الخدمة" : "Internet Service Providers"}</div>
        <div className="flex flex-wrap gap-1.5">
          {country.isps.map(isp => (
            <span key={isp} className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-white/70">{isp}</span>
          ))}
        </div>
      </div>

      {/* Disclaimers */}
      <div className="grid gap-2 text-[9px]">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-white/35">
          <span className="font-bold text-white/50">{ar ? "عدد المستخدمين:" : "User Count:"}</span> UNKNOWN — {ar ? "لا توجد بيانات موثوقة" : "No verified telemetry available"}
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-white/35">
          <span className="font-bold text-white/50">{ar ? "الأداء:" : "Performance:"}</span> NOT MEASURED — {ar ? "استخدم DNS Scanner لقياس الأداء" : "Use DNS Scanner for live measurements"}
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-white/35">
          <span className="font-bold text-white/50">{ar ? "المصدر:" : "Source:"}</span> RIPE NCC — {ar ? "الهيئة الإقليمية لتخصيص عناوين الإنترنت" : "Regional Internet Registry for Europe/ME"}
        </div>
      </div>
    </div>
  );
}
