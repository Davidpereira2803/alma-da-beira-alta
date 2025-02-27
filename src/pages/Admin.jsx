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
    <div className="flex justify-center items-center bg-[#B6AA84] p-6 my-80">
      
      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">

        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("finance")}</h2>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/finance")}
          >
            {t("finances")}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("gallery_management")}</h2>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/gallery")}
          >
            {t("manage_gallery")}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("events_management")}</h2>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/events")}
          >
            {t("manage_events")}
          </button>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/manage-event-registrations")}
          >
            {t("manage_event_registrations")}
          </button>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/event-registrations")}
          >
            {t("event_people_list")}
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("general_management")}</h2>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/registrations")}
          >
            {t("manage_registrations")}
          </button>

          <button 
            className="w-full bg-gray-800 text-white py-2 rounded-lg shadow-md hover:bg-gray-900 transition duration-300 mb-2"
            onClick={() => navigate("/admin/members")}
          >
            {t("manage_members")}
          </button>

          <button 
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 mt-3"
            onClick={handleLogout}
          >
            {t("admin_logout")}
          </button>

          <button 
            className="w-full bg-red-600 text-white py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-300 mt-3"
            onClick={() => navigate("/admin/qr-scanner")}
          >
            {t("QR-Scanner")}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Admin;
