import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminEvents() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    pdfUrl: "",
    backgroundImage: "",
    memberPrice: "",
    regularPrice: "",
    location: "",
  });

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

  const handleAddOrUpdateEvent = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.description || !newEvent.memberPrice || !newEvent.regularPrice || !newEvent.location) {
      alert("All fields except PDF URL are required!");
      return;
    }

    try {
      if (editingEvent) {
        await updateDoc(doc(db, "events", editingEvent.id), newEvent);
        setEvents(events.map((event) => (event.id === editingEvent.id ? { id: event.id, ...newEvent } : event)));
        setEditingEvent(null);
      } else {
        const docRef = await addDoc(collection(db, "events"), newEvent);
        setEvents([...events, { id: docRef.id, ...newEvent }]);
      }

      setNewEvent({
        title: "",
        date: "",
        description: "",
        pdfUrl: "",
        backgroundImage: "",
        memberPrice: "",
        regularPrice: "",
        location: "",
      });

      alert(editingEvent ? "Event updated successfully!" : "Event added successfully!");
    } catch (error) {
      console.error("Error adding/updating event:", error);
      alert("Error saving event. Try again.");
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
  };

  const handleDeleteEvent = async (eventId) => {
    await deleteDoc(doc(db, "events", eventId));
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F1F0E4] p-6">
      <div className="w-full max-w-4xl bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-4">{t("manage_events")}</h2>

        <form onSubmit={handleAddOrUpdateEvent} className="mb-6 p-4 bg-[#7D8D86] rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-3 text-[#3E3F29]">
            {editingEvent ? t("edit_event") : t("add_event")}
          </h4>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_title")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_date")}</label>
            <input
              type="date"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_description")}</label>
            <textarea
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_location")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_pdf_url")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.pdfUrl}
              onChange={(e) => setNewEvent({ ...newEvent, pdfUrl: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("event_background_image_url")}</label>
            <input
              type="text"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.backgroundImage}
              onChange={(e) => setNewEvent({ ...newEvent, backgroundImage: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("member_price")}</label>
            <input
              type="number"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.memberPrice}
              onChange={(e) => setNewEvent({ ...newEvent, memberPrice: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-[#3E3F29] font-medium">{t("regular_price")}</label>
            <input
              type="number"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              value={newEvent.regularPrice}
              onChange={(e) => setNewEvent({ ...newEvent, regularPrice: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold">
            {editingEvent ? t("save_changes") : t("add_event")}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#7D8D86] text-[#3E3F29]">
                <th className="border border-[#BCA88D] p-2">{t("event_title")}</th>
                <th className="border border-[#BCA88D] p-2">{t("event_date")}</th>
                <th className="border border-[#BCA88D] p-2">{t("event_location")}</th>
                <th className="border border-[#BCA88D] p-2">{t("member_price")}</th>
                <th className="border border-[#BCA88D] p-2">{t("regular_price")}</th>
                <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="text-center bg-[#F1F0E4]">
                  <td className="border border-[#BCA88D] p-2">{event.title}</td>
                  <td className="border border-[#BCA88D] p-2">{event.date}</td>
                  <td className="border border-[#BCA88D] p-2">{event.location}</td>
                  <td className="border border-[#BCA88D] p-2">€{event.memberPrice}</td>
                  <td className="border border-[#BCA88D] p-2">€{event.regularPrice}</td>
                  <td className="border border-[#BCA88D] p-2 flex space-x-2 justify-center">
                    <button onClick={() => handleEditEvent(event)} className="bg-blue-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-blue-700 transition">
                      {t("edit")}
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-red-700 transition">
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
          className="w-full mt-4 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg shadow hover:bg-[#7D8D86] transition font-semibold"
        >
          {t("back_to_admin_panel")}
        </button>
      </div>
    </div>
  );
}

export default AdminEvents;
