import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminEventRegistrations() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventPrices, setEventPrices] = useState({ memberPrice: 0, regularPrice: 0 });
  const [registrations, setRegistrations] = useState([]);

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
    const eventDoc = doc(db, `events/${eventId}`);
    const eventSnapshot = await getDocs(collection(db, `events/${eventId}/registrations`));
    
    const eventData = (await getDocs(collection(db, "events"))).docs
      .find((doc) => doc.id === eventId)?.data();

    if (eventData) {
      setEventPrices({
        memberPrice: eventData.memberPrice || 0,
        regularPrice: eventData.regularPrice || 0,
      });
    }

    const registrationsList = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRegistrations(registrationsList);
  };

  const updateRegistrationStatus = async (eventId, userId, field) => {
    const registrationRef = doc(db, `events/${eventId}/registrations/${userId}`);
    const updatedRegistrations = registrations.map((reg) =>
      reg.id === userId ? { ...reg, [field]: !reg[field] } : reg
    );
    setRegistrations(updatedRegistrations);
    await updateDoc(registrationRef, { [field]: !registrations.find((reg) => reg.id === userId)[field] });
  };

  // Calculate total revenue from paid attendees
  const totalRevenue = registrations
    .filter((reg) => reg.paid)
    .reduce((sum, reg) => sum + Number(reg.isMember ? eventPrices.memberPrice : eventPrices.regularPrice), 0);


  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("event_registrations")}</h2>

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

      {/* Registrations Table */}
      {selectedEvent && (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">{t("name")}</th>
              <th className="border p-2">{t("description")}</th>
              <th className="border p-2">{t("is_member")}</th>
              <th className="border p-2">{t("price")}</th>
              <th className="border p-2">{t("arrived")}</th>
              <th className="border p-2">{t("paid")}</th>
              <th className="border p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => {
              const price = reg.isMember ? eventPrices.memberPrice : eventPrices.regularPrice;
              return (
                <tr key={reg.id} className="text-center">
                  <td className="border p-2">{reg.name}</td>
                  <td className="border p-2">{reg.description}</td>
                  <td className="border p-2">{reg.isMember ? "✅" : "❌"}</td>
                  <td className="border p-2">€{price}</td>
                  <td className="border p-2">{reg.arrived ? "✅" : "❌"}</td>
                  <td className="border p-2">{reg.paid ? "✅" : "❌"}</td>
                  <td className="border p-2 flex justify-center space-x-2">
                    <button
                      className={`px-2 py-1 rounded ${reg.arrived ? "bg-green-500" : "bg-gray-500"} text-white`}
                      onClick={() => updateRegistrationStatus(selectedEvent, reg.id, "arrived")}
                    >
                      {t("mark_arrived")}
                    </button>
                    <button
                      className={`px-2 py-1 rounded ${reg.paid ? "bg-blue-500" : "bg-gray-500"} text-white`}
                      onClick={() => updateRegistrationStatus(selectedEvent, reg.id, "paid")}
                    >
                      {t("mark_paid")}
                    </button>
                  </td>
                </tr>
              );
            })}
            {/* Total Count & Revenue Row */}
            <tr className="bg-gray-100 text-center font-bold">
              <td className="border p-2" colSpan="3">{t("total_people")}</td>
              <td className="border p-2" colSpan="1">€{totalRevenue}</td>
              <td className="border p-2">{registrations.filter(r => r.arrived).length}</td>
              <td className="border p-2">{registrations.filter(r => r.paid).length}</td>
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

export default AdminEventRegistrations;
