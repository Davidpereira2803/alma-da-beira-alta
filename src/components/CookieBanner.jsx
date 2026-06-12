import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CONSENT_KEY = "adba_cookie_consent";

function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t("cookie_banner_aria_label")}
      className="fixed bottom-0 inset-x-0 z-50 bg-[#3E3F29] text-[#F1F0E4] px-4 py-5 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="flex-1 text-sm leading-relaxed">
          {t("cookie_banner_text")}{" "}
          <Link
            to="/cookies"
            className="underline text-[#BCA88D] hover:text-[#F1F0E4] transition"
          >
            {t("cookie_policy_title")}
          </Link>{" "}
          {t("cookie_banner_and")}{" "}
          <Link
            to="/privacy-policy"
            className="underline text-[#BCA88D] hover:text-[#F1F0E4] transition"
          >
            {t("privacy_policy_title")}
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleAccept}
            className="bg-[#BCA88D] text-[#3E3F29] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#d4bfa2] transition"
          >
            {t("cookie_accept")}
          </button>
          <button
            onClick={handleDecline}
            className="border border-[#BCA88D] text-[#BCA88D] px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#BCA88D]/20 transition"
          >
            {t("cookie_decline")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
