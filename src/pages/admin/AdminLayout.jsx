import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdminLayout({ title, description, right, children }) {
  const { t } = useTranslation();

  const navItems = [
    { to: "/admin", label: t("admin_dashboard") || "Dashboard" },
    { to: "/admin/events", label: t("admin_events") || "Events" },
    { to: "/admin/gallery", label: t("admin_gallery") || "Gallery" },
    { to: "/admin/registrations", label: t("admin_registrations") || "Registrations" },
    { to: "/admin/members", label: t("admin_members") || "Members" },
    { to: "/admin/register", label: t("admin_register_member") || "Register Member" },
    { to: "/admin/event-registrations", label: t("admin_event_registrations") || "Event Registrations" },
    { to: "/admin/manage-event-registrations", label: t("admin_manage_event_registrations") || "Manage Event Registrations" },
    { to: "/admin/finance", label: t("admin_finance") || "Finance" },
  ];

  return (
    <div className="page-safe-top min-h-screen bg-[#F1F0E4]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#3E3F29]">
              {title || t("admin_panel")}
            </h1>
            {description && <p className="text-[#7D8D86] mt-1">{description}</p>}
          </div>
          {right}
        </div>

        <div className="mt-4 -mx-1 overflow-x-auto">
          <nav className="px-1 flex gap-2 flex-nowrap md:flex-wrap">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `h-10 px-4 rounded-full text-sm whitespace-nowrap font-semibold inline-flex items-center
                   ${isActive ? "bg-[#3E3F29] text-white" : "bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4]"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <div className="bg-[#F1F0E4] border-t-4 border-[#BCA88D] rounded-xl shadow p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}