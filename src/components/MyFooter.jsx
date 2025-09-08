import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function MyFooter() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const adminEmail = "admin@example.com";

  return (
    <footer className="bg-[#3E3F29] text-[#F1F0E4] pt-12 pb-6 mt-auto shadow-inner">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#BCA88D]">{t("contact") || "Contact Us"}</span>
            <p>
              <FaEnvelope className="inline-block mr-2 text-[#BCA88D]" /> info@almadabeiraalta.com
            </p>
            <p>
              <FaPhone className="inline-block mr-2 text-[#BCA88D]" /> +352 123 456 789
            </p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.youtube.com/channel/yourchannel" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={28} className="hover:text-[#BCA88D] transition" />
            </a>
            <a href="https://www.tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTiktok size={28} className="hover:text-[#BCA88D] transition" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-2">
          {user && user.email === adminEmail && (
            <Link to="/admin">
              <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] px-4 py-2 rounded-lg text-sm shadow transition font-semibold">
                {t("admin_panel")}
              </button>
            </Link>
          )}
          <Link to="/login">
            <button className="bg-[#7D8D86] hover:bg-[#BCA88D] text-[#3E3F29] px-4 py-2 rounded-lg text-xs shadow transition font-semibold">
              {t("admin_login")}
            </button>
          </Link>
        </div>

        <div className="mt-6 text-center text-xs text-[#BCA88D]">
          © {new Date().getFullYear()} Alma Da Beira Alta - Luxembourg<br />
          Developed & Maintained by David Pereira de Magalhaes
        </div>
      </div>
    </footer>
  );
}

export default MyFooter;
