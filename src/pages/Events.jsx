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
    <div className="bg-[#F1F0E4] min-h-screen font-sans">
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#3E3F29] mb-8 text-center">{t("events")}</h2>
          <div className="w-full h-2 bg-[#BCA88D] opacity-20 my-2" />

          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-6 mt-10 text-center">{t("upcoming_events")}</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-center text-[#7D8D86]">{t("no_upcoming_events")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-[#F1F0E4] rounded-xl shadow p-0 border-t-4 border-[#BCA88D] flex flex-col overflow-hidden"
                  style={{
                    minHeight: "340px",
                  }}
                >
                  {event.backgroundImage && (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.backgroundImage})` }}
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 text-[#3E3F29] font-serif">{event.title}</h4>
                    <p className="text-sm text-[#7D8D86] mb-1">{t("event_date")}: {event.date}</p>
                    <p className="text-sm text-[#7D8D86] mb-2">{t("event_location")}: {event.location}</p>
                    <p className="mb-4 text-[#3E3F29]">{event.description}</p>
                    {event.pdfUrl && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleViewPdf(event.pdfUrl)}
                          className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("view_brochure")}
                        </button>
                        <a
                          href={event.pdfUrl}
                          download
                          className="bg-[#7D8D86] hover:bg-[#BCA88D] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
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

          <div className="w-full h-2 bg-[#BCA88D] opacity-20 my-2" />

          <h3 className="text-2xl font-serif font-bold text-[#3E3F29] mb-6 mt-10 text-center">{t("past_events")}</h3>
          {pastEvents.length === 0 ? (
            <p className="text-center text-[#7D8D86]">{t("no_past_events")}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-[#F1F0E4] rounded-xl shadow p-0 border-t-4 border-[#BCA88D] flex flex-col overflow-hidden"
                  style={{
                    minHeight: "340px",
                  }}
                >
                  {event.backgroundImage && (
                    <div
                      className="h-40 w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.backgroundImage})` }}
                    />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-lg mb-2 text-[#3E3F29] font-serif">{event.title}</h4>
                    <p className="text-sm text-[#7D8D86] mb-1">{t("event_date")}: {event.date}</p>
                    <p className="text-sm text-[#7D8D86] mb-2">{t("event_location")}: {event.location}</p>
                    <p className="mb-4 text-[#3E3F29]">{event.description}</p>
                    {event.pdfUrl && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleViewPdf(event.pdfUrl)}
                          className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
                        >
                          {t("view_brochure")}
                        </button>
                        <a
                          href={event.pdfUrl}
                          download
                          className="bg-[#7D8D86] hover:bg-[#BCA88D] text-[#3E3F29] py-2 px-4 rounded-full shadow transition font-semibold"
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
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#F1F0E4] p-6 rounded-xl shadow-lg max-w-3xl w-full relative border-t-4 border-[#BCA88D]">
            <button
              className="absolute top-3 right-3 text-[#7D8D86] hover:text-[#3E3F29] text-2xl"
              onClick={() => setShowModal(false)}
              aria-label={t("close")}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-[#3E3F29] font-serif">{t("event_pdf_brochure")}</h3>
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
                <p className="text-[#7D8D86]">{t("no_brochure_available")}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
