import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok, FaUserLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function MyFooter() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  return (
    <footer className="bg-[#3E3F29] text-[#F1F0E4] pt-12 pb-6 mt-auto shadow-inner">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center">
        {/* Top: Logo/Name and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-lg font-bold text-[#BCA88D]">{t("title") || "Alma Da Beira Alta"}</span>
            <span className="text-sm text-[#BCA88D]">{t("preserving_folklore") || "Preserving Portuguese Folklore"}</span>
          </div>
          <div className="flex gap-6">
            <a href="https://www.facebook.com/people/Alma-Da-Beira-Alta/61566001748232/?locale=fr_FR" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.youtube.com/channel/yourchannel" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.tiktok.com/@yourprofile101" target="_blank" rel="noopener noreferrer">
              <FaTiktok size={28} className="hover:text-[#BCA88D] transition" />
            </a>
          </div>
        </div>

        {/* Middle: Contact Info, Admin Links, Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8">
          {/* Left: Contact Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-serif text-lg font-bold text-[#BCA88D]">{t("contact") || "Contact Us"}</span>
            <p>
              <FaEnvelope className="inline-block mr-2 text-[#BCA88D]" /> info@almadabeiraalta.com
            </p>
            <p>
              <FaPhone className="inline-block mr-2 text-[#BCA88D]" /> +352 123 456 789
            </p>
          </div>
          {/* Center: Admin Links */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0 items-center justify-center flex-1">
            {user && user.email === adminEmail && (
              <Link to="/admin" title={t("admin_panel")}>
                <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] px-4 py-2 rounded-lg text-sm shadow transition font-semibold">
                  {t("admin_panel")}
                </button>
              </Link>
            )}
            <Link to="/login" title={t("admin_login")}>
              <FaUserLock size={20} className="text-[#7D8D86] hover:text-[#BCA88D] transition" />
            </Link>
          </div>
          {/* Right: Copyright */}
          <div className="text-center text-xs text-[#BCA88D]">
            © {new Date().getFullYear()} Alma Da Beira Alta - Luxembourg<br />
            Developed & Maintained by David Pereira de Magalhaes
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MyFooter;
