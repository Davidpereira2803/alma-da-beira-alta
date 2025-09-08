import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/Beira-Alta.jpg";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#232323] min-h-screen font-sans">
      <section className="relative h-[60vh] flex items-center justify-center">
        <img
          src={heroImg}
          alt="Alma da Beira Alta"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="relative z-10 text-center w-full">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#B6AA84] mb-6 drop-shadow-lg">
            Alma da Beira Alta
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t("homepage_intro") || "Preserving Portuguese folklore through dance, music, and stories."}
          </p>
          <Link to="/register">
            <button className="bg-[#B6AA84] hover:bg-[#a59a6f] text-[#232323] font-semibold px-8 py-3 rounded-full shadow-lg transition">
              {t("join_us") || "Join Us"}
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#F7F7F7] py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#B6AA84] mb-4">
              {t("who_we_are") || "Who We Are"}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {t("who_we_are_text") || "Our ASBL is dedicated to celebrating and sharing the rich traditions of Portuguese folklore in Luxembourg."}
            </p>
            <ul className="space-y-2">
              <li><strong>{t("president")}:</strong> Daisy F. Pereira</li>
              <li><strong>{t("vice_president")}:</strong> S. Monteiro Da Silva</li>
              <li><strong>{t("secretary")}:</strong> Ana I. Esteves</li>
              <li><strong>{t("treasurer")}:</strong> Jessica Pereira Braz</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <img
              src={heroImg}
              alt="Folklore Group"
              className="rounded-2xl shadow-lg w-full max-w-sm object-cover border-4 border-[#B6AA84]"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-serif font-bold text-[#B6AA84] mb-8 text-center">
            {t("upcoming_events") || "Upcoming Events"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F7F7F7] rounded-xl shadow p-6 flex flex-col border-t-4 border-[#B6AA84]">
              <img src={heroImg} alt="Event" className="rounded-lg mb-4 h-40 object-cover" />
              <h4 className="font-bold text-lg mb-2 text-[#232323]">Folklore Dance Night</h4>
              <p className="text-sm text-gray-600 mb-2">15 September 2025, Luxembourg City</p>
              <p className="mb-3 text-gray-700">Join us for an evening of traditional dances and music!</p>
              <Link to="/events" className="mt-auto">
                <button className="bg-[#B6AA84] text-[#232323] px-4 py-2 rounded-full hover:bg-[#a59a6f] transition">
                  {t("learn_more") || "Learn More"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-serif font-bold text-[#B6AA84] mb-8 text-center">
            {t("gallery") || "Gallery"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <img src={heroImg} alt="Gallery" className="rounded-xl shadow-lg object-cover h-40 w-full border-4 border-[#B6AA84]" />
          </div>
          <Link to="/gallery">
            <button className="mt-8 bg-[#B6AA84] text-[#232323] px-6 py-2 rounded-full hover:bg-[#a59a6f] transition shadow-lg">
              {t("view_full_gallery") || "View Full Gallery"}
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#232323] py-16 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif font-bold text-[#B6AA84] mb-6">
            {t("contact") || "Contact"}
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
            <p>
              <FaEnvelope className="inline-block mr-2 text-[#B6AA84]" /> info@almadabeiraalta.com
            </p>
            <p>
              <FaPhone className="inline-block mr-2 text-[#B6AA84]" /> +352 123 456 789
            </p>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={32} className="hover:text-[#B6AA84] transition" />
            </a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={32} className="hover:text-[#B6AA84] transition" />
            </a>
            <a href="https://www.youtube.com/channel/yourchannel" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={32} className="hover:text-[#B6AA84] transition" />
            </a>
            <a href="https://www.tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTiktok size={32} className="hover:text-[#B6AA84] transition" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
