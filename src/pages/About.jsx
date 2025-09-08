import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F1F0E4] flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-[#3E3F29] mb-4 text-center">
          {t("about_us")}
        </h1>
        <p className="text-lg text-[#3E3F29] mb-6 text-center">
          {t("about_us_intro")}
        </p>
        <div className="text-[#7D8D86] text-base leading-relaxed space-y-4">
          <p>
            {t("about_us_paragraph1")}
          </p>
          <p>
            {t("about_us_paragraph2")}
          </p>
          <p>
            {t("about_us_paragraph3")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;