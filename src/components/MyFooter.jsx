import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaTiktok,
  FaUserLock,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function MyFooter() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  const social = [
    {
      href:
        "https://www.facebook.com/people/Alma-Da-Beira-Alta/61566001748232/?locale=fr_FR",
      label: "Facebook",
      Icon: FaFacebook,
    },
    { href: "https://www.instagram.com/yourprofile", label: "Instagram", Icon: FaInstagram },
    { href: "https://www.youtube.com/channel/yourchannel", label: "YouTube", Icon: FaYoutube },
    { href: "https://www.tiktok.com/@yourprofile101", label: "TikTok", Icon: FaTiktok },
  ];

  return (
    <footer className="relative bg-[#3E3F29] text-[#F1F0E4] mt-auto">
      <div className="absolute inset-x-0 top-0 h-px bg-[#BCA88D]/30" />
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + Social */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div>
              <div className="font-serif text-xl font-bold text-[#BCA88D]">{t("title")}</div>
              <div className="text-sm text-[#BCA88D]">{t("preserving_folklore")}</div>
            </div>
            <div className="flex items-center gap-5">
              {social.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("follow_us")}: ${label}`}
                  className="text-[#F1F0E4] hover:text-[#BCA88D] transition"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start">
            <div className="font-semibold text-[#BCA88D] mb-3">{t("quick_links")}</div>
            <nav className="grid gap-2 text-sm">
              <Link className="hover:text-[#BCA88D] transition" to="/">{t("home")}</Link>
              <Link className="hover:text-[#BCA88D] transition" to="/about">{t("about_us")}</Link>
              <Link className="hover:text-[#BCA88D] transition" to="/events">{t("events")}</Link>
              <Link className="hover:text-[#BCA88D] transition" to="/gallery">{t("gallery")}</Link>
              <Link className="hover:text-[#BCA88D] transition" to="/register">{t("register")}</Link>
            </nav>
          </div>

          {/* Contact + Admin */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="font-semibold text-[#BCA88D] mb-1">{t("contact")}</div>
            <a href="mailto:info@almadabeiraalta.com" className="text-sm hover:text-[#BCA88D] transition">
              <FaEnvelope className="inline-block mr-2 text-[#BCA88D]" /> info@almadabeiraalta.com
            </a>
            <a href="tel:+352123456789" className="text-sm hover:text-[#BCA88D] transition">
              <FaPhone className="inline-block mr-2 text-[#BCA88D]" /> +352 123 456 789
            </a>

            <div className="mt-3">
              {user && user.email === adminEmail ? (
                <Link to="/admin" title={t("admin_panel")}>
                  <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] px-4 py-2 rounded-full text-sm shadow transition font-semibold">
                    {t("admin_panel")}
                  </button>
                </Link>
              ) : (
                <Link
                  to="/login"
                  title={t("admin_login")}
                  className="text-[#7D8D86] hover:text-[#BCA88D] transition inline-flex items-center gap-2"
                >
                  <FaUserLock size={18} />
                  <span className="text-sm">{t("admin_login")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-[#BCA88D]">
          <div>© {new Date().getFullYear()} {t("title")} — Luxembourg. {t("rights_reserved")}</div>
          <div>{t("developed_by", { name: "David Pereira de Magalhaes" })}</div>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter;
