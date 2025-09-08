import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function Events() {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => doc.data());

      const today = new Date();
      const upcoming = eventList.filter((event) => new Date(event.date) >= today);
      const past = eventList.filter((event) => new Date(event.date) < today);

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    };

    fetchEvents();
  }, []);

  const handleViewPdf = (pdfUrl) => {
    setSelectedPdf(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`);
    setShowModal(true);
  };

  return (
    <div className="w-full py-10 px-4">
      <h2 className="text-3xl font-serif font-bold text-center mb-8">{t("events")}</h2>

      {upcomingEvents.length === 0 ? (
        <p className="text-center text-gray-600">{t("no_upcoming_events")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="relative bg-[#B6AA84] bg-cover bg-center text-black rounded-xl shadow-lg overflow-hidden flex flex-col justify-end"
              style={{
                backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : "none",
                minHeight: "320px",
              }}
            >
              <div className="bg-black/70 p-5 rounded-xl text-white">
                <h3 className="text-xl font-bold font-serif">{event.title}</h3>
                <p className="text-sm">{t("event_date")}: {event.date}</p>
                <p className="text-sm">{t("event_location")}: {event.location}</p>
                <p className="mt-2">{event.description}</p>
                {event.pdfUrl && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleViewPdf(event.pdfUrl)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                    >
                      {t("view_brochure")}
                    </button>
                    <a
                      href={event.pdfUrl}
                      download
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
                    >
                      {t("download_pdf")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-serif font-bold text-center mt-12 mb-8">{t("past_events")}</h2>

      {pastEvents.length === 0 ? (
        <p className="text-center text-gray-600">{t("no_past_events")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="relative bg-[#B6AA84] bg-cover bg-center text-black rounded-xl shadow-lg overflow-hidden flex flex-col justify-end"
              style={{
                backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : "none",
                minHeight: "320px",
              }}
            >
              <div className="bg-black/70 p-5 rounded-xl text-white">
                <h3 className="text-xl font-bold font-serif">{event.title}</h3>
                <p className="text-sm">{t("event_date")}: {event.date}</p>
                <p className="text-sm">{t("event_location")}: {event.location}</p>
                <p className="mt-2">{event.description}</p>
                {event.pdfUrl && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleViewPdf(event.pdfUrl)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
                    >
                      {t("view_brochure")}
                    </button>
                    <a
                      href={event.pdfUrl}
                      download
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
                    >
                      {t("download_pdf")}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label={t("close")}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">{t("event_pdf_brochure")}</h3>
            <div>
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  width="100%"
                  height="500px"
                  className="border-none rounded"
                  title="PDF Preview"
                ></iframe>
              ) : (
                <p>{t("no_brochure_available")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
