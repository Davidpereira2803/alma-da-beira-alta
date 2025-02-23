import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminManageEventRegistrations() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [newRegistration, setNewRegistration] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEvents(eventList);
  };

  const fetchRegistrations = async (eventId) => {
    setSelectedEvent(eventId);
    const eventRef = collection(db, `events/${eventId}/registrations`);
    const querySnapshot = await getDocs(eventRef);
    const registrationsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRegistrations(registrationsList);
  };

  const handleAddRegistration = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !newRegistration.name || !newRegistration.description) return;
    
    const eventRef = collection(db, `events/${selectedEvent}/registrations`);
    const docRef = await addDoc(eventRef, { ...newRegistration, arrived: false, paid: false });

    setRegistrations([...registrations, { id: docRef.id, ...newRegistration, arrived: false, paid: false }]);
    setNewRegistration({ name: "", description: "" });
  };

  const handleDeleteRegistration = async (userId) => {
    await deleteDoc(doc(db, `events/${selectedEvent}/registrations/${userId}`));
    setRegistrations(registrations.filter((reg) => reg.id !== userId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("manage_event_registrations")}</h2>

      {/* Event Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">{t("select_event")}</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => fetchRegistrations(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>{t("choose_event")}</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.title} - {event.date}</option>
          ))}
        </select>
      </div>

      {/* Add Registration Form */}
      {selectedEvent && (
        <form onSubmit={handleAddRegistration} className="mt-4 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-2">{t("add_registration")}</h3>
          
          <div className="mb-2">
            <label className="block">{t("name")}</label>
            <input
              type="text"
              value={newRegistration.name}
              onChange={(e) => setNewRegistration({ ...newRegistration, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block">{t("description")}</label>
            <input
              type="text"
              value={newRegistration.description}
              onChange={(e) => setNewRegistration({ ...newRegistration, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
            {t("add_person")}
          </button>
        </form>
      )}

      {/* Registrations List */}
      {selectedEvent && (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">{t("name")}</th>
              <th className="border p-2">{t("description")}</th>
              <th className="border p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="text-center">
                <td className="border p-2">{reg.name}</td>
                <td className="border p-2">{reg.description}</td>
                <td className="border p-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteRegistration(reg.id)}
                  >
                    {t("remove")}
                  </button>
                </td>
              </tr>
            ))}
            {/* Total Count Row */}
            <tr className="bg-gray-100 text-center font-bold">
              <td className="border p-2" colSpan="2">{t("total_people")}</td>
              <td className="border p-2">{registrations.length}</td>
            </tr>
          </tbody>
        </table>
      )}
        <button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-stone-700 text-white py-2 rounded-lg hover:bg-stone-900 transition"
        >
          {t("back_to_admin_panel")}
        </button>
    </div>
  );
}

export default AdminManageEventRegistrations;
