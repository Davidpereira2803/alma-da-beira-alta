import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LAST_UPDATED_DATE } from "../config/legal";

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="page-safe-top min-h-screen bg-[#F1F0E4] px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-[#3E3F29] mb-2">
          {t("privacy_policy_title")}
        </h1>
        <p className="text-sm text-[#7D8D86] mb-8">
          {t("privacy_last_updated", { date: LAST_UPDATED_DATE })}
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_1_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_1_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_2_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_2_body")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-[#3E3F29]">
            <li>{t("privacy_data_item_1")}</li>
            <li>{t("privacy_data_item_2")}</li>
            <li>{t("privacy_data_item_3")}</li>
            <li>{t("privacy_data_item_4")}</li>
            <li>{t("privacy_data_item_5")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_3_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_3_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_4_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_4_body")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-[#3E3F29]">
            <li>{t("privacy_processor_firebase")}</li>
            <li>{t("privacy_processor_emailjs")}</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_5_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_5_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_6_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_6_body")}</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-[#3E3F29]">
            <li>{t("privacy_right_access")}</li>
            <li>{t("privacy_right_rectification")}</li>
            <li>{t("privacy_right_erasure")}</li>
            <li>{t("privacy_right_restriction")}</li>
            <li>{t("privacy_right_portability")}</li>
            <li>{t("privacy_right_objection")}</li>
          </ul>
          <p className="text-[#3E3F29] text-sm leading-relaxed mt-3">
            {t("privacy_rights_contact")}{" "}
            <a
              href="mailto:alma-beira-alta@hotmail.com"
              className="text-[#BCA88D] underline hover:text-[#7D8D86]"
            >
              alma-beira-alta@hotmail.com
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_7_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("privacy_section_7_body")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("privacy_section_8_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">
            {t("privacy_section_8_body")}{" "}
            <a
              href="mailto:alma-beira-alta@hotmail.com"
              className="text-[#BCA88D] underline hover:text-[#7D8D86]"
            >
              alma-beira-alta@hotmail.com
            </a>
          </p>
        </section>

        <div className="border-t border-[#BCA88D]/30 pt-4">
          <Link
            to="/"
            className="text-sm text-[#BCA88D] hover:text-[#7D8D86] transition"
          >
            &larr; {t("back_to_home")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
