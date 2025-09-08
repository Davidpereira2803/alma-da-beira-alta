import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";
import Lottie from "lottie-react";
import galoAnimation from "../assets/animations/dancing-animation.json";

function Home() {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestImage, setLatestImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map(doc => doc.data());
      const today = new Date();
      const upcoming = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setUpcomingEvents(upcoming);
    };

    const fetchLatestImage = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const images = querySnapshot.docs.map(doc => doc.data());
      if (images.length > 0) {
        const latest = images.reduce((prev, curr) =>
          new Date(curr.uploadedAt) > new Date(prev.uploadedAt) ? curr : prev
        );
        setLatestImage(latest);
      }
    };

    fetchEvents();
    fetchLatestImage();
  }, []);

  return (
    <div className="bg-[#F1F0E4] min-h-screen font-sans">
      <section className="relative h-[60vh] flex items-center justify-center bg-[#3E3F29]">
        <img
          src={heroImg}
          alt="Alma da Beira Alta"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center w-full flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#BCA88D] mb-6 drop-shadow-lg">
            Alma da Beira Alta
          </h1>
          <p className="text-lg md:text-xl text-[#F1F0E4] mb-8 max-w-2xl mx-auto">
            {t("homepage_intro") || "Preserving Portuguese folklore through dance, music, and stories."}
          </p>
          <Link to="/register">
            <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] font-semibold px-8 py-3 rounded-full shadow-lg transition">
              {t("join_us") || "Join Us"}
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#3E3F29] mb-4">
              {t("who_we_are") || "Who We Are"}
            </h2>
            <p className="text-lg text-[#7D8D86] mb-6">
              {t("who_we_are_text") || "Our ASBL is dedicated to celebrating and sharing the rich traditions of Portuguese folklore in Luxembourg."}
            </p>
            <ul className="space-y-2 text-[#3E3F29]">
              <li><strong>{t("president")}:</strong> Daisy F. Pereira</li>
              <li><strong>{t("vice_president")}:</strong> S. Monteiro Da Silva</li>
              <li><strong>{t("secretary")}:</strong> Ana I. Esteves</li>
              <li><strong>{t("treasurer")}:</strong> Jessica Pereira Braz</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Lottie
              animationData={galoAnimation}
              loop={true}
              style={{ width: "100%", maxWidth: 320, height: 320 }}
              className="rounded-2xl shadow-lg border-4 border-[#BCA88D] bg-white"
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/register">
            <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] font-semibold px-8 py-3 rounded-full shadow-lg transition">
              {t("join_us") || "Join Us"}
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#7D8D86] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-8 text-center">
            {t("upcoming_events") || "Upcoming Events"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, idx) => (
                <div key={idx} className="bg-[#F1F0E4] rounded-xl shadow p-6 flex flex-col border-t-4 border-[#BCA88D]">
                  {event.backgroundImage && (
                    <img src={event.backgroundImage} alt={event.title} className="rounded-lg mb-4 h-40 object-cover" />
                  )}
                  <h4 className="font-bold text-lg mb-2 text-[#3E3F29]">{event.title}</h4>
                  <p className="text-sm text-[#7D8D86] mb-2">{event.date}, {event.location}</p>
                  <p className="mb-3 text-[#3E3F29]">{event.description}</p>
                  <Link to="/events" className="mt-4">
                    <button className="bg-[#BCA88D] text-[#3E3F29] px-4 py-2 rounded-full hover:bg-[#7D8D86] transition">
                      {t("learn_more") || "Learn More"}
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#3E3F29]">
                {t("no_upcoming_events") || "No upcoming events."}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-8 text-center">
            {t("gallery") || "Gallery"}
          </h3>
          <div className="flex flex-col items-center">
            {latestImage ? (
              <Link to="/gallery">
                <img
                  src={latestImage.url}
                  alt={t("gallery_image_alt")}
                  className="rounded-xl shadow-lg object-cover h-40 w-64 border-4 border-[#BCA88D] mx-auto"
                />
              </Link>
            ) : (
              <p className="text-[#7D8D86]">{t("no_images_available") || "No images available."}</p>
            )}
            <Link to="/gallery">
              <button className="mt-8 bg-[#BCA88D] text-[#3E3F29] px-6 py-2 rounded-full hover:bg-[#7D8D86] transition shadow-lg">
                {t("view_full_gallery") || "View Full Gallery"}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
