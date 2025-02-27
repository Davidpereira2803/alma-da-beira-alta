import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import im from "../assets/Beira-Alta.jpg";

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

    <div className="w-full">

      <div className="flex justify-center items-center px-4 my-5">
        <img src={ im } alt="Alma da Beira Alta" className="w-4/5 md:w-4/5 h-[40vh] md:h-[50vh] object-cover rounded-lg" />
      </div>

      <div className="flex justify-center items-center px-4 my-5">
        <div className="bg-[#B6AA84] text-black py-5 rounded-lg w-4/5 text-center">
          <h2 className="text-2xl font-bold my-3">{t("who_we_are")}</h2>
          <p className="text-lg mt-3 w-1/2 mx-auto text-center">{t("who_we_are_text")}</p>
          <div className="mt-4 w-fit mx-auto text-center">
            {t("association_leaders")}
            <ul className="list-none text-left mt-3">
              <li><strong>{t("president")}:</strong> <span className="text-gray-900">Daisy F. Pereira</span></li>
              <li><strong>{t("vice_president")}:</strong> <span className="text-gray-900">S. Monteiro Da Silva</span></li>
              <li><strong>{t("secretary")}:</strong> <span className="text-gray-900">Ana I. Esteves</span></li>
              <li><strong>{t("treasurer")}:</strong> <span className="text-gray-900">Jessica Pereira Braz</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center  my-5 px-4">
        <div className="bg-[#B6AA84] text-black p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("latest_gallery")}</h3>
          {latestImage ? (
            <Link to="/gallery">
              <img src={latestImage.url} alt={t("gallery_image_alt")} className="rounded-lg mt-3 shadow-lg w-full" />
            </Link>
          ) : (
            <p>{t("no_images_available")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center px-4 my-5">
        <div className="bg-[#B6AA84] text-black p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("upcoming_event")}</h3>
          {nearestEvent ? (
            <div className="flex flex-wrap justify-center items-center bg-black text-white mt-3 mx-auto min-h-[50vh] p-8 rounded gap-3">
              
              <div className="text-left pl-4 max-w-[450px] flex-1">
                <h4 className="text-4xl font-bold mb-6">{nearestEvent.title}</h4>
                <p className="mb-2"><strong>{t("date")}:</strong> {nearestEvent.date}</p>
                <p className="mb-2"><strong>{t("location")}:</strong> {nearestEvent.location}</p>
                <p className="mb-2"><strong>{t("member_price")}:</strong> {nearestEvent.memberPrice}€</p>
                <p className="mb-2"><strong>{t("regular_price")}:</strong> {nearestEvent.regularPrice}€</p>
                <p className="mb-4">{nearestEvent.description}</p>

                <div className="flex flex-col w-full max-w-[250px]">
                  {nearestEvent.pdfUrl && (
                    <a
                      href={nearestEvent.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg my-2 w-full text-center"
                    >
                      {t("download_pdf")}
                    </a>
                  )}
                  <Link to="/events" className="w-full">
                    <button className="bg-[#C8102E] text-white px-4 py-2 rounded-lg my-2 w-full">
                      {t("view_all_events")}
                    </button>
                  </Link>
                </div>
              </div>

              {nearestEvent.backgroundImage && (
                <div className="flex-1 flex justify-center">
                  <img 
                    src={nearestEvent.backgroundImage} 
                    alt={nearestEvent.title} 
                    className="rounded-lg shadow-lg w-[200px] h-[320px] object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            <p>{t("no_upcoming_events")}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center my-5 px-4">
        <div className="bg-[#B6AA84] text-black p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("watch_our_video")}</h3>
          <iframe
            className="w-full aspect-video mt-3 rounded-lg"
            src="https://www.youtube.com/embed/SjY3asK1Wzk"
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-[#B6AA84] text-black p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("join_us")}</h3>
          <p>{t("join_us_text")}</p>
          <Link to="/register">
            <button className="bg-stone-700 text-white px-4 py-2 rounded-lg mt-3">{t("register_now")}</button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center text-center my-5 px-4">
        <div className="bg-[#B6AA84] text-black p-6 rounded-lg w-4/5">
          <h3 className="text-xl font-bold my-3">{t("contact")}</h3>
          <p><FaEnvelope className="inline-block mr-2 text-stone-500 " /> {t("email")}: <a href="mailto:info@almadabeiraalta.com" className="text-blue-400">info@almadabeiraalta.com</a></p>
          <p><FaPhone className="inline-block mr-2 text-stone-500" /> {t("phone")}: +352 123 456 789</p>
          <p className="mt-4">{t("follow_us")}</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} className="text-stone-500 hover:text-blue-600" />
            </a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} className="text-stone-500 hover:text-pink-500" />
            </a>
            <a href="https://www.youtube.com/channel/yourchannel" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={30} className="text-stone-500 hover:text-red-600" />
            </a>
            <a href="https://www.tiktok.com/@yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTiktok size={30} className="text-stone-500 hover:text-black" />
            </a>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Home;
