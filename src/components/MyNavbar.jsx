import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/01.jpg";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";

function MyNavbar() {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#B6AA84] text-black py-4 w-full">
      <div className="mx-auto flex justify-between items-center px-4 w-95/100">
        <Link to="/" className="flex items-center text-[28px] font-bold">
          <img src={logo} alt="Logo" className="w-16 h-12 mr-3" />
          {t("title")}
        </Link>

        <button
          className="md:hidden text-black text-2xl focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/gallery" className="text-[24px] hover:text-gray-300">{t("gallery")}</Link>
          <Link to="/events" className="text-[24px] hover:text-gray-300">{t("events")}</Link>
          <Link to="/register" className="text-[24px] hover:text-gray-300">{t("register")}</Link>
          <Link to="/qr" className="text-[24px] hover:text-gray-300">QR-Code</Link>
        </div>

        <select
          className="bg-stone-800 text-white px-3 py-2 rounded-md focus:outline-none hidden md:block"
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option value="pt">PT</option>
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="de">DE</option>
        </select>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col items-center bg-[#B6AA84] w-full py-4 space-y-4">
          <Link to="/gallery" className="text-[20px] hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            {t("gallery")}
          </Link>
          <Link to="/events" className="text-[20px] hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            {t("events")}
          </Link>
          <Link to="/register" className="text-[20px] hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            {t("register")}
          </Link>
          <select
            className="bg-stone-800 text-white px-3 py-2 rounded-md focus:outline-none"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
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
