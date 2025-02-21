import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useTranslation } from "react-i18next";

function MyNavbar() {
  const { t, i18n } = useTranslation();

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo & Title */}
        <Link to="/" className="flex items-center text-2xl font-bold">
          <img src={logo} alt="Logo" className="w-16 h-12 mr-3" />
          {t("title")}
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/gallery" className="text-lg hover:text-gray-300">{t("gallery")}</Link>
          <Link to="/events" className="text-lg hover:text-gray-300">{t("events")}</Link>
          <Link to="/register" className="text-lg hover:text-gray-300">{t("register")}</Link>
        </div>

        {/* Language Selector */}
        <select
          className="bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none"
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="pt">PT</option>
          <option value="de">DE</option>
        </select>
      </div>
    </nav>
  );
}

export default MyNavbar;
