import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/01.jpg";

/* Custom desktop language menu to replace native <select> */
function LanguageMenu({ isSolid, languages, current, onChange, t }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(
    Math.max(0, languages.findIndex((l) => l.code === current))
  );
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % languages.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + languages.length) % languages.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const lang = languages[active];
        if (lang) {
          onChange(lang.code);
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, active, languages, onChange]);

  useEffect(() => {
    setActive(Math.max(0, languages.findIndex((l) => l.code === current)));
  }, [current, languages]);

  const btnClasses = `inline-flex items-center gap-2 px-4 h-10 rounded-full text-sm border transition
    ${isSolid ? "text-[#3E3F29] border-[#3E3F29]/30 hover:border-[#BCA88D]" : "text-white border-white/40 hover:border-white"}
  `;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("select_language")}
        className={btnClasses}
        onClick={() => setOpen((v) => !v)}
      >
        {languages.find((l) => l.code === current)?.label || current?.toUpperCase()}
        <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-[60] overflow-hidden"
        >
          {languages.map((lng, i) => {
            const selected = current === lng.code;
            const isActive = active === i;
            return (
              <button
                key={lng.code}
                role="option"
                aria-selected={selected}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between
                  ${selected ? "text-[#3E3F29] font-semibold" : "text-[#3E3F29]"}
                  ${isActive ? "bg-[#F1F0E4]" : "hover:bg-black/5"}
                `}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onChange(lng.code);
                  setOpen(false);
                }}
              >
                <span>{lng.label}</span>
                {selected && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MyNavbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const firstMenuLinkRef = useRef(null);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => firstMenuLinkRef.current?.focus(), 0);
      const onKeyDown = (e) => {
        if (e.key === "Escape") setIsMobileMenuOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = prev;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [isMobileMenuOpen]);

  const languages = [
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
    { code: "fr", label: "FR" },
  ];

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const wrapClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300";
  const isSolid = scrolled || !isHome;
  const barClasses = isSolid ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent";

  const linkBase = "px-3 py-2 text-sm font-medium transition-colors duration-200";
  const linkColor = isSolid ? "text-[#3E3F29]" : "text-white";
  const linkHover = isSolid ? "hover:text-[#7D8D86]" : "hover:text-[#F1F0E4]";
  const activeColor = "text-[#BCA88D]";

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/gallery", label: t("gallery") },
    { to: "/events", label: t("events") },
    { to: "/about", label: t("about_us") },
  ];

  return (
    <header className={`${wrapClasses} ${barClasses}`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] text-white font-bold shadow overflow-hidden">
              {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : "A"}
            </span>
            <div className="leading-tight">
              <div className={`text-base md:text-lg font-semibold ${linkColor}`}>{t("title")}</div>
              <div className={`text-[10px] md:text-xs tracking-wide ${isSolid ? "text-[#7D8D86]" : "text-white/80"}`}>
                {t("hero_subtitle")}
              </div>
            </div>
          </Link>

          {/* Center nav links (desktop only from lg) */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `${linkBase} ${linkColor} ${linkHover} ${isActive ? activeColor + " underline underline-offset-4" : ""}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions (desktop only from lg) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Custom Language dropdown (replaces native select) */}
            <LanguageMenu
              isSolid={isSolid}
              languages={languages}
              current={i18n.language}
              onChange={changeLanguage}
              t={t}
            />

            {/* Register CTA */}
            <Link to="/register">
              <button className="h-10 px-5 rounded-full text-sm font-semibold bg-[#BCA88D] text-white hover:bg-[#7D8D86] transition-colors shadow">
                {t("register")}
              </button>
            </Link>
          </div>

          {/* Mobile/Tablet menu button (visible < lg) */}
          <button
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl ${
              isSolid ? "text-[#3E3F29]" : "text-white"
            } hover:bg-black/5 active:scale-95 transition`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            {!isMobileMenuOpen ? (
              <svg width="26" height="26" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M4 7h18M4 13h18M4 19h18" />
              </svg>
            ) : (
              <svg width="26" height="26" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M6 6l14 14M20 6L6 20" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Mobile/Tablet full-screen panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`lg:hidden fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-transform duration-300 motion-reduce:transition-none ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden">
          {/* Top row mirrors header for consistent spacing */}
          <div className="px-4 flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] text-white font-bold shadow overflow-hidden">
                {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : "A"}
              </span>
              <span className="text-[#3E3F29] font-semibold">{t("title")}</span>
            </Link>
            <button
              aria-label="Close menu"
              className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#3E3F29] hover:bg-black/5 active:scale-95 transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="26" height="26" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" d="M6 6l14 14M20 6L6 20" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-6">
            {/* Language pills (mobile/tablet) */}
            <div className="flex gap-2 mb-4">
              {languages.map((lng) => {
                const active = i18n.language === lng.code;
                return (
                  <button
                    key={lng.code}
                    onClick={() => changeLanguage(lng.code)}
                    className={`px-4 h-10 rounded-full text-sm font-medium border transition ${
                      active
                        ? "bg-[#3E3F29] text-white border-[#3E3F29]"
                        : "bg-white text-[#3E3F29] border-[#3E3F29]/20 hover:border-[#BCA88D]"
                    }`}
                  >
                    {lng.label}
                  </button>
                );
              })}
            </div>

            {/* Nav links */}
            <nav className="grid gap-2">
              {navLinks.map((l, idx) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  ref={idx === 0 ? firstMenuLinkRef : null}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 h-12 rounded-2xl text-base border ${
                      isActive
                        ? "bg-[#F1F0E4] border-[#BCA88D]/50 text-[#3E3F29] font-semibold"
                        : "bg-white border-[#3E3F29]/10 text-[#3E3F29] hover:bg-black/5"
                    } focus:outline-none focus:ring-2 focus:ring-[#BCA88D]`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{l.label}</span>
                  <svg width="20" height="20" fill="none" stroke="currentColor" className="opacity-60">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 5l6 5-6 5" />
                  </svg>
                </NavLink>
              ))}
            </nav>

            {/* CTA */}
            <div className="mt-5 flex gap-2">
              <Link to="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full h-12 rounded-full text-base font-semibold bg-[#BCA88D] text-white hover:bg-[#7D8D86] active:scale-[0.99] transition-colors shadow">
                  {t("register")}
                </button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-[#7D8D86] text-center">
              {t("select_language")} • {t("view_all_events") || "View All Events"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MyNavbar;
