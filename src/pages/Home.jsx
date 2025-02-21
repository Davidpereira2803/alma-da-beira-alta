import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();
  const [nearestEvent, setNearestEvent] = useState(null);
  const [latestImage, setLatestImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map(doc => doc.data());

      const today = new Date();
      const upcomingEvents = events.filter(event => new Date(event.date) >= today);

      if (upcomingEvents.length > 0) {
        const closestEvent = upcomingEvents.reduce((prev, curr) =>
          new Date(curr.date) < new Date(prev.date) ? curr : prev
        );
        setNearestEvent(closestEvent);
      }
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
    <>
    <div className="max-w-7xl mx-auto px-4">
      {/* Who We Are Section */}
      <div className="flex justify-center items-center px-4 my-5">
        <div className="bg-stone-900 text-white py-5 rounded-lg w-4/5 text-center">
          <h2 className="text-2xl font-bold my-3">{t("who_we_are")}</h2>
          <p className="text-lg mt-3 w-1/2 mx-auto text-center">{t("who_we_are_text")}</p>
          <div className="mt-4 w-fit mx-auto text-center">
            {t("association_leaders")}
            <ul className="list-none text-left mt-3">
              <li><strong>{t("president")}:</strong> <span className="text-gray-400">Daisy F. Pereira</span></li>
              <li><strong>{t("vice_president")}:</strong> <span className="text-gray-400">S. Monteiro Da Silva</span></li>
              <li><strong>{t("secretary")}:</strong> <span className="text-gray-400">Ana I. Esteves</span></li>
              <li><strong>{t("treasurer")}:</strong> <span className="text-gray-400">Jessica Pereira Braz</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upcoming Event Section */}
      <div className="flex justify-center text-center px-4 my-5">
        <div className="bg-stone-900 text-white p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("upcoming_event")}</h3>
          {nearestEvent ? (
            <div className="p-3 border rounded shadow-sm bg-stone-800 text-white mt-3 w-3/4 mx-auto">
              <h4 className="font-bold">{nearestEvent.title}</h4>
              <p><strong>{t("date")}:</strong> {nearestEvent.date}</p>
              <p><strong>{t("location")}:</strong> {nearestEvent.location}</p>
              <p>{nearestEvent.description}</p>
              {nearestEvent.pdfUrl && (
                <a
                  href={nearestEvent.pdfUrl}
                  target="_blank"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 block"
                >
                  {t("download_pdf")}
                </a>
              )}
              <Link to="/events">
                <button className="bg-stone-700 text-white px-4 py-2 rounded-lg mt-2">{t("view_all_events")}</button>
              </Link>
            </div>
          ) : (
            <p>{t("no_upcoming_events")}</p>
          )}
        </div>
      </div>

      {/* Latest Gallery Section */}
      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-stone-900 text-white p-6 rounded-lg shadow-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("latest_gallery")}</h3>
          {latestImage ? (
            <img src={latestImage.url} alt={t("gallery_image_alt")} className="rounded-lg mt-3 shadow-lg w-full" />
          ) : (
            <p>{t("no_images_available")}</p>
          )}
          <Link to="/gallery">
            <button className="bg-stone-700 text-white px-4 py-2 rounded-lg mt-3">{t("view_full_gallery")}</button>
          </Link>
        </div>
      </div>

      {/* YouTube Video Section */}
      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-stone-900 text-white p-6 rounded-lg shadow-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("watch_our_video")}</h3>
          <iframe
            className="w-full aspect-video mt-3 rounded-lg"
            src="https://www.youtube.com/embed/SjY3asK1Wzk"
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-stone-900 text-white p-6 rounded-lg shadow-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("join_us")}</h3>
          <p>{t("join_us_text")}</p>
          <Link to="/register">
            <button className="bg-stone-700 text-white px-4 py-2 rounded-lg mt-3">{t("register_now")}</button>
          </Link>
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-stone-900 text-white p-6 rounded-lg shadow-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("contact")}</h3>
          <p><FaEnvelope className="inline-block mr-2 text-stone-500 " /> {t("email")}: <a href="mailto:info@almadabeiraalta.com" className="text-blue-400">info@almadabeiraalta.com</a></p>
          <p><FaPhone className="inline-block mr-2 text-stone-500" /> {t("phone")}: +352 123 456 789</p>
          <p className="mt-4">{t("follow_us")}</p>
          <div className="flex justify-center gap-4 mt-3">
            <FaFacebook size={30} className="text-stone-500" />
            <FaInstagram size={30} className="text-stone-500" />
            <FaYoutube size={30} className="text-stone-500" />
            <FaTiktok size={30} className="text-stone-500" />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Home;
