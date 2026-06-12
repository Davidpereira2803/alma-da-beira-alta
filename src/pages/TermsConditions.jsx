import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function TermsConditions() {
  const { t } = useTranslation();

  return (
    <div className="page-safe-top min-h-screen bg-[#F1F0E4] px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-[#3E3F29] mb-2">
          {t("terms_title")}
        </h1>
        <p className="text-sm text-[#7D8D86] mb-8">
          {t("terms_last_updated", { date: "12/06/2026" })}
        </p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_1_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_1_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_2_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_2_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_3_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_3_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_4_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_4_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_5_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_5_body")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_6_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">{t("terms_section_6_body")}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#3E3F29] mb-2">{t("terms_section_7_title")}</h2>
          <p className="text-[#3E3F29] text-sm leading-relaxed">
            {t("terms_section_7_body")}{" "}
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

export default TermsConditions;
