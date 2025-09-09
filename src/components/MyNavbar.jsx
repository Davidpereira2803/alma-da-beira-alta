import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/01.jpg";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";

function MyNavbar() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/gallery", label: t("gallery") },
    { to: "/events", label: t("events") },
    { to: "/about", label: t("about_us") },
  ];

  return (
    <nav className="bg-[#3E3F29] text-[#F1F0E4] shadow-md w-full relative">
      <div className="flex items-center justify-between px-4 py-3 w-full relative">
        {/* Left: Logo and Name */}
        <div className="flex items-center gap-3 flex-shrink-0 min-w-[220px]">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-10 rounded border-2 border-[#BCA88D] shadow"
            />
            <span className="font-serif text-2xl font-bold tracking-wide text-[#BCA88D]">{t("title")}</span>
          </Link>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-lg font-medium px-2 py-1 rounded transition ${
                location.pathname === link.to
                  ? "text-[#BCA88D] font-bold"
                  : "hover:text-[#BCA88D]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Language Selector */}
        <div className="hidden md:flex items-center flex-shrink-0 min-w-[120px] justify-end">
          <select
            className="bg-[#7D8D86] text-[#3E3F29] px-3 py-2 rounded focus:outline-none"
            onChange={e => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="pt">PT</option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl p-2 rounded focus:outline-none text-[#F1F0E4]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#3E3F29] border-t border-[#BCA88D] py-4 px-6 flex flex-col gap-4 shadow">
          {/* Logo and Name */}
          <Link
            to="/"
            className="flex items-center gap-3 mb-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src={logo}
              alt="Logo"
              className="w-14 h-10 rounded border-2 border-[#BCA88D] shadow"
            />
            <span className="font-serif text-2xl font-bold tracking-wide text-[#BCA88D]">{t("title")}</span>
          </Link>
          {/* Nav Links */}
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium px-2 py-1 rounded transition ${
                location.pathname === link.to
                  ? "text-[#BCA88D] font-bold"
                  : "hover:text-[#BCA88D]"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* Language Selector */}
          <select
            className="bg-[#7D8D86] text-[#3E3F29] px-3 py-2 rounded focus:outline-none mt-2"
            onChange={e => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="pt">PT</option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>
        </div>
      )}
    </nav>
  );
}

export default MyNavbar;
