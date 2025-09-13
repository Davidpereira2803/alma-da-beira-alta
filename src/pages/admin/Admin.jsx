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

  const Btn = ({ onClick, children, variant = "primary", ariaLabel }) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-full h-10 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-[#F1F0E4] active:scale-[.98] transition";
    const styles =
      variant === "primary"
        ? "bg-[#BCA88D] text-[#3E3F29] hover:bg-[#7D8D86] shadow-sm"
        : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4]";
    return (
      <button onClick={onClick} className={`${base} ${styles}`} aria-label={ariaLabel}>
        {children}
      </button>
    );
  };

  const Card = ({ icon, title, children }) => (
    <div className="bg-white border-t-4 border-[#BCA88D] shadow rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F0E4] ring-1 ring-[#3E3F29]/10">
          {icon}
        </span>
        <h2 className="text-xl font-serif font-bold text-[#3E3F29]">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="page-safe-top min-h-screen bg-[#F1F0E4]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3F29]">
              {t("admin_panel") || "Admin Panel"}
            </h1>
            <p className="text-[#7D8D86] mt-1">
              {t("admin_dashboard_hint") || "Manage content and quick actions."}
            </p>
          </div>
          <Btn onClick={handleLogout} variant="secondary" ariaLabel={t("admin_logout")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 17l5-5-5-5M20 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4h7v16H4z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {t("admin_logout")}
          </Btn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card
            title={t("finance")}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M6 6h12M6 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => navigate("/admin/finance")} ariaLabel={t("finances")}>
                {t("finances")}
              </Btn>
            </div>
          </Card>

          <Card
            title={t("gallery_management")}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M7 13l3-3 3 3 3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => navigate("/admin/gallery")} ariaLabel={t("manage_gallery")}>
                {t("manage_gallery")}
              </Btn>
            </div>
          </Card>

          <Card
            title={t("events_management")}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => navigate("/admin/events")} ariaLabel={t("manage_events")}>
                {t("manage_events")}
              </Btn>
              <Btn
                variant="secondary"
                onClick={() => navigate("/admin/manage-event-registrations")}
                ariaLabel={t("manage_event_registrations")}
              >
                {t("manage_event_registrations")}
              </Btn>
              <Btn
                variant="secondary"
                onClick={() => navigate("/admin/event-registrations")}
                ariaLabel={t("event_registrations_list")}
              >
                {t("event_registrations_list")}
              </Btn>
            </div>
          </Card>

          <Card
            title={t("general_management")}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 15a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" />
                <path d="M2 22a8 8 0 0116 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          >
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => navigate("/admin/registrations")} ariaLabel={t("manage_registrations")}>
                {t("manage_registrations")}
              </Btn>
              <Btn onClick={() => navigate("/admin/members")} ariaLabel={t("manage_members")}>
                {t("manage_members")}
              </Btn>
              <Btn onClick={() => navigate("/admin/register")} ariaLabel={t("register_member")}>
                {t("register_member")}
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Admin;
