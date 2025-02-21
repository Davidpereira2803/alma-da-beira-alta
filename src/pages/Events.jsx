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

  // ✅ Open PDF in Google Docs Viewer
  const handleViewPdf = (pdfUrl) => {
    setSelectedPdf(`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-6">{t("events")}</h2>

      {upcomingEvents.length === 0 ? (
        <p className="text-center text-gray-600">{t("no_upcoming_events")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="relative bg-cover bg-center text-white p-6 rounded-lg shadow-lg"
              style={{
                backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : "none",
                minHeight: "300px",
              }}
            >
              <div className="bg-black/50 p-4 rounded">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-sm">{t("event_date")}: {event.date}</p>
                <p className="text-sm">{t("event_location")}: {event.location}</p>
                <p className="mt-2">{event.description}</p>

                {/* ✅ View & Download Buttons */}
                {event.pdfUrl && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleViewPdf(event.pdfUrl)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                      {t("view_brochure")}
                    </button>
                    <a
                      href={event.pdfUrl}
                      download
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
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

      <h2 className="text-3xl font-bold text-center mt-10">{t("past_events")}</h2>

      {pastEvents.length === 0 ? (
        <p className="text-center text-gray-600">{t("no_past_events")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {pastEvents.map((event, index) => (
            <div
              key={index}
              className="relative bg-cover bg-center text-white p-6 rounded-lg shadow-lg"
              style={{
                backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : "none",
                minHeight: "300px",
              }}
            >
              <div className="bg-black/50 p-4 rounded">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-sm">{t("event_date")}: {event.date}</p>
                <p className="text-sm">{t("event_location")}: {event.location}</p>
                <p className="mt-2">{event.description}</p>

                {/* ✅ View & Download Buttons */}
                {event.pdfUrl && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleViewPdf(event.pdfUrl)}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                      {t("view_brochure")}
                    </button>
                    <a
                      href={event.pdfUrl}
                      download
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
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

      {/* ✅ Modal for Viewing PDFs using Google Docs */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{t("event_pdf_brochure")}</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <div className="mt-4">
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  width="100%"
                  height="500px"
                  className="border-none"
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
