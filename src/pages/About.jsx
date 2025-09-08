import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function About() {
  const { t } = useTranslation();

  const galleryImages = [
    { src: "/public/landscape.jpg", alt: t("event1_alt") },
    { src: "/public/landscape.jpg", alt: t("event2_alt") },
    { src: "/public/landscape.jpg", alt: t("event3_alt") },
  ];

  return (
    <div className="min-h-screen bg-[#F1F0E4] flex justify-center items-center p-6">
      <div className="max-w-3xl w-full bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-serif font-bold text-[#3E3F29] mb-4 text-center">
          {t("about_us")}
        </h1>
        <p className="text-lg text-[#3E3F29] mb-6 text-center">
          {t("about_us_intro")}
        </p>
        <div className="w-full flex justify-center mb-8">
          <img
            src={heroImg}
            alt={t("about_us_hero_alt")}
            className="rounded-2xl shadow-lg border-4 border-[#BCA88D] object-cover max-h-64 w-full max-w-3xl"
          />
        </div>
        <div className="text-[#7D8D86] text-base leading-relaxed space-y-4">
          <p>{t("about_us_paragraph1")}</p>
          <p>{t("about_us_paragraph2")}</p>
          <p>{t("about_us_paragraph3")}</p>
        </div>
        <div className="my-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#3E3F29] mb-4 text-center">
            {t("our_team")}
          </h2>
          <img
            src="/public/landscape.jpg"
            alt={t("team_group_photo_alt")}
            className="rounded-2xl shadow-lg border-4 border-[#BCA88D] object-cover max-w-xl w-full mb-4"
          />
          <div className="text-[#3E3F29] text-center text-base max-w-2xl">
            {t("team_group_description")}
          </div>
        </div>
        <div className="my-8">
          <h2 className="text-xl font-bold text-[#3E3F29] mb-2 text-center">
            {t("about_us_gallery_title")}
          </h2>
          <Carousel showThumbs={false} infiniteLoop autoPlay>
            {galleryImages.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="rounded-xl max-h-64 object-cover mx-auto"
                />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="my-8">
          <h2 className="text-xl font-bold text-[#3E3F29] mb-4 text-center">
            {t("our_mission")}
          </h2>
          <p className="text-[#3E3F29] text-center text-base mb-6 max-w-2xl mx-auto">
            {t("mission_statement")}
          </p>
          <h3 className="text-lg font-bold text-[#3E3F29] mb-2 text-center">
            {t("our_values")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-4 border-t-4 border-[#BCA88D] flex flex-col items-center">
              <span className="text-3xl mb-2">🤝</span>
              <div className="font-bold text-[#3E3F29]">
                {t("value_community")}
              </div>
              <div className="text-[#7D8D86] text-center">
                {t("value_community_desc")}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-4 border-[#BCA88D] flex flex-col items-center">
              <span className="text-3xl mb-2">🎉</span>
              <div className="font-bold text-[#3E3F29]">
                {t("value_culture")}
              </div>
              <div className="text-[#7D8D86] text-center">
                {t("value_culture_desc")}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-t-4 border-[#BCA88D] flex flex-col items-center">
              <span className="text-3xl mb-2">🌱</span>
              <div className="font-bold text-[#3E3F29]">
                {t("value_growth")}
              </div>
              <div className="text-[#7D8D86] text-center">
                {t("value_growth_desc")}
              </div>
            </div>
          </div>
        </div>
        <div className="my-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#3E3F29] mb-2 text-center">
            {t("join_us")}
          </h2>
          <p className="text-[#3E3F29] text-center mb-4">
            {t("join_us_text")}
          </p>
          <a
            href="/register"
            className="bg-[#BCA88D] text-[#3E3F29] px-6 py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {t("register_now")}
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;