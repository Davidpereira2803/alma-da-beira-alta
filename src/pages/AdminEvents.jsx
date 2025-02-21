import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminEvents() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "", pdfUrl: "", backgroundImage: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  // ✅ Convert GitHub URL to Raw Link
  const convertToRawGitHubLink = (url) => {
    const githubPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)/;
    if (githubPattern.test(url)) {
      return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
    }
    return url;
  };

  // ✅ Add New Event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.description) {
      alert("All fields except PDF URL are required!");
      return;
    }

    const formattedPdfUrl = convertToRawGitHubLink(newEvent.pdfUrl);
    const formattedBackgroundImage = convertToRawGitHubLink(newEvent.backgroundImage);

    try {
      const docRef = await addDoc(collection(db, "events"), { ...newEvent, pdfUrl: formattedPdfUrl, backgroundImage: formattedBackgroundImage});
      setEvents([...events, { id: docRef.id, ...newEvent, pdfUrl: formattedPdfUrl, backgroundImage: formattedBackgroundImage }]);
      setNewEvent({ title: "", date: "", description: "", pdfUrl: "", backgroundImage: "" });

      alert("Event added successfully!");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error adding event. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{t("manage_events")}</h2>

        {/* ✅ Add Event Form */}
        <form onSubmit={handleAddEvent} className="mb-6 p-4 bg-gray-200 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-3">{t("add_event")}</h4>
          
          <div className="mb-3">
            <label className="block text-gray-700 font-medium">{t("event_title")}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium">{t("event_date")}</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium">{t("event_description")}</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>

          {/* ✅ GitHub PDF URL Input */}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium">{t("event_pdf_url")}</label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              value={newEvent.pdfUrl}
              onChange={(e) => setNewEvent({ ...newEvent, pdfUrl: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium">{t("event_background_image_url")}</label>
            <input type="url" className="w-full p-2 border rounded" value={newEvent.backgroundImage} onChange={(e) => setNewEvent({ ...newEvent, backgroundImage: e.target.value })} />
          </div>

          <button type="submit" className="w-full bg-stone-700 text-white py-2 rounded-lg hover:bg-stone-900 transition">
            {t("add_event")}
          </button>
        </form>

        {/* ✅ Events Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 text-gray-700">
                <th className="border p-2">{t("event_title")}</th>
                <th className="border p-2">{t("event_date")}</th>
                <th className="border p-2">{t("event_description")}</th>
                <th className="border p-2">{t("event_pdf_brochure")}</th>
                <th className="border p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="text-center bg-gray-100">
                  <td className="border p-2">{event.title}</td>
                  <td className="border p-2">{event.date}</td>
                  <td className="border p-2">{event.description}</td>
                  <td className="border p-2">
                    {event.pdfUrl ? (
                      <a href={event.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {t("view_pdf")}
                      </a>
                    ) : (
                      "No PDF"
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => deleteDoc(doc(db, "events", event.id))}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 transition"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-stone-700 text-white py-2 rounded-lg hover:bg-stone-900 transition"
        >
          {t("back_to_admin_panel")}
        </button>
      </div>
    </div>
  );
}

export default AdminEvents;
