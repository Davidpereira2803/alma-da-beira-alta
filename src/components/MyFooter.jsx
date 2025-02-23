import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function MyFooter() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  return (
    <footer className="bg-[#B6AA84] text-black text-center py-4 mt-auto">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} Alma Da Beira Alta - Luxembourg</p>
        <p className="text-xs my-3 text-black">Developed & Maintained by David Pereira de Magalhaes</p>

        {/* Show Admin Panel button only if admin is logged in */}
        {user && user.email === adminEmail && (
          <Link to="/admin">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2">
              {t("admin_panel")}
            </button>
          </Link>
        )}

        {/* Always show "Admin Login" button if the user is NOT logged in */}
        <Link to="/login">
          <button className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg mt-2 ml-3 text-xs">
            {t("admin_login")}
          </button>
        </Link>
      </div>
    </footer>
  );
}

export default MyFooter;
