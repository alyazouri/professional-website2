import { useLang } from "./LanguageContext";
import { t } from "./i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NightModeToggle } from "./Features";
import { EagleIcon, BoltIcon } from "./Icons";

function smoothScrollTo(id: string) {
  const el = document.querySelector(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: "smooth" });
}

export function StatusBar({ ping }: { ping: number | null }) {
  const { lang } = useLang();

  const links = [
    { href: "#generator", label: t("nav_generator", lang) },
    { href: "#ping", label: t("nav_ping", lang) },
    { href: "#pac", label: t("nav_pac", lang) },
    { href: "#about", label: t("nav_about", lang) },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[#04060b]/80 backdrop-blur-xl">
      <div className="container-section flex h-14 items-center justify-between gap-3">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5 group shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/15 to-transparent border border-orange-400/25 transition-all duration-300 group-hover:border-orange-400/50 group-hover:shadow-lg group-hover:shadow-orange-500/20">
            <EagleIcon className="h-[1.35rem] w-[1.35rem]" />
          </span>
          <span className="font-display text-[0.8rem] font-black tracking-wide text-white leading-none">
            ALYAZOURI
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent"> 2026</span>
            <span className="hidden items-center gap-1 text-[0.6rem] font-medium text-white/35 sm:inline-flex mt-0.5">
              <BoltIcon className="h-2.5 w-2.5 text-orange-400/70" /> Jordan
            </span>
          </span>
        </a>

        {/* Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => smoothScrollTo(l.href)}
              className="nav-link rounded-lg px-3 py-1.5 text-xs font-semibold text-white/55 transition-colors hover:text-orange-300"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {ping !== null && (
            <span className="hidden items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-bold text-emerald-300/90 sm:flex tabular-nums">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {ping}ms
            </span>
          )}
          <NightModeToggle />
          <LanguageSwitcher />
          <button onClick={() => smoothScrollTo("#generator")} className="btn-primary hidden rounded-lg px-3.5 py-2 text-xs sm:inline-flex">
            {t("nav_cta", lang)}
          </button>
        </div>
      </div>
    </header>
  );
}
