import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function About() {
  const { t } = useTranslation();

  const galleryImages = [
    { src: heroImg, alt: t("event1_alt") },
    { src: heroImg, alt: t("event2_alt") },
    { src: heroImg, alt: t("event3_alt") },
  ];

  return (
    <div className="bg-[#F1F0E4] min-h-screen">
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={heroImg}
          alt={t("about_us_hero_alt")}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3E3F29]/80 via-[#3E3F29]/50 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex flex-col justify-center hero-safe-top">
          <p className="text-[#F1F0E4]/80 text-xs md:text-sm uppercase tracking-widest">
            {t("about_us")}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white">
            {t("about_title") || t("about_us")}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="text-[#3E3F29] space-y-4 leading-relaxed">
              <p>{t("about_us_paragraph1")}</p>
              <p>{t("about_us_paragraph2")}</p>
              <p>{t("about_us_paragraph3")}</p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={heroImg}
              alt={t("about_us_hero_alt")}
              className="rounded-2xl shadow-lg border-4 border-[#BCA88D] object-cover w-full aspect-[16/10]"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow p-6 md:p-8 border-t-4 border-[#BCA88D]">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <img
              src={heroImg}
              alt={t("team_group_photo_alt")}
              className="rounded-2xl border-4 border-[#BCA88D] object-cover w-full aspect-[16/10]"
            />
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-3">
                {t("our_team")}
              </h2>
              <p className="text-[#3E3F29]">{t("team_group_description")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-2 text-center">
          {t("our_mission")}
        </h2>
        <p className="text-[#3E3F29] text-center max-w-3xl mx-auto mb-6">
          {t("mission_statement")}
        </p>
        <h3 className="text-lg font-semibold text-[#3E3F29] text-center mb-4">
          {t("our_values")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-5 border-t-4 border-[#BCA88D] text-center">
            <div className="text-3xl mb-2">🤝</div>
            <div className="font-bold text-[#3E3F29]">
              {t("value_community")}
            </div>
            <div className="text-[#7D8D86]">
              {t("value_community_desc")}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-t-4 border-[#BCA88D] text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-[#3E3F29]">
              {t("value_culture")}
            </div>
            <div className="text-[#7D8D86]">
              {t("value_culture_desc")}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 border-t-4 border-[#BCA88D] text-center">
            <div className="text-3xl mb-2">🌱</div>
            <div className="font-bold text-[#3E3F29]">
              {t("value_growth")}
            </div>
            <div className="text-[#7D8D86]">
              {t("value_growth_desc")}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4 text-center">
          {t("about_us_gallery_title")}
        </h2>
        <div className="bg-white rounded-2xl shadow p-4 border-t-4 border-[#BCA88D]">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={4500}
            swipeable
            emulateTouch
          >
            {galleryImages.map((img, idx) => (
              <div key={idx} className="px-1">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="rounded-xl object-cover w-full aspect-[16/9]"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-[#3E3F29] text-[#F1F0E4] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-bold">
              {t("join_our_family")}
            </h3>
            <p className="text-[#F1F0E4]/90">{t("join_us_text")}</p>
          </div>
          <Link
            to="/register"
            className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] px-6 py-3 rounded-full font-semibold shadow transition"
          >
            {t("register_now")}
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;