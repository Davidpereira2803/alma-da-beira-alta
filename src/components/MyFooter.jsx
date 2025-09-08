import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function MyFooter() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  return (
    <footer className="bg-[#B6AA84] text-black py-6 mt-auto shadow-inner">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-2">
        <p className="text-base font-serif font-semibold">
          © {new Date().getFullYear()} Alma Da Beira Alta - Luxembourg
        </p>
        <p className="text-xs text-gray-700 mb-2">
          Developed & Maintained by David Pereira de Magalhaes
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          {user && user.email === adminEmail && (
            <Link to="/admin">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow transition">
                {t("admin_panel")}
              </button>
            </Link>
          )}
          <Link to="/login">
            <button className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-xs shadow transition">
              {t("admin_login")}
            </button>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter;
