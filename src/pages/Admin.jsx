import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Admin() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("admin_panel")}</h2>

        <button
          className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
          onClick={() => navigate("/admin/events")}
        >
          {t("manage_events")}
        </button>

        <button
          className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
          onClick={() => navigate("/admin/gallery")}
        >
          {t("manage_gallery")}
        </button>

        <button
          className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
          onClick={() => navigate("/admin/members")}
        >
          {t("manage_members")}
        </button>

        <button
          className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
          onClick={() => navigate("/admin/registrations")}
        >
          {t("manage_registrations")}
        </button>

        <button
          className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 mt-3"
          onClick={handleLogout}
        >
          {t("admin_logout")}
        </button>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center my-5">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("finance_panel")}</h2>

        <button
          className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
          onClick={() => navigate("/admin/finance")}
        >
          {t("finances")}
        </button>
      </div>
    </div>
  );
}

export default Admin;
