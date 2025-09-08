import { useAuth } from "../../context/AuthContext";
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
    <div className="bg-[#F1F0E4] min-h-screen flex justify-center items-center py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Finance */}
        <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("finance")}</h2>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/finance")}
          >
            {t("finances")}
          </button>
        </div>

        {/* Gallery Management */}
        <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("gallery_management")}</h2>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/gallery")}
          >
            {t("manage_gallery")}
          </button>
        </div>

        {/* Events Management */}
        <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("events_management")}</h2>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/events")}
          >
            {t("manage_events")}
          </button>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/manage-event-registrations")}
          >
            {t("manage_event_registrations")}
          </button>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/event-registrations")}
          >
            {t("event_people_list")}
          </button>
        </div>

        {/* General Management */}
        <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6 text-center">
          <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("general_management")}</h2>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/registrations")}
          >
            {t("manage_registrations")}
          </button>
          <button
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold mb-2"
            onClick={() => navigate("/admin/members")}
          >
            {t("manage_members")}
          </button>
          <button
            className="w-full bg-[#7D8D86] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#BCA88D] transition font-semibold mt-3"
            onClick={handleLogout}
          >
            {t("admin_logout")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
