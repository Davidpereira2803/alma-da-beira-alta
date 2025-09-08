import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

function AdminManageEventRegistrations() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [editingRegistration, setEditingRegistration] = useState(null);

  const [newRegistration, setNewRegistration] = useState({
    name: "",
    email: "",
    description: "",
    isMember: false,
    password: "",
  });

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const sendEmail = async (recipientEmail, name, eventTitle, uniquepassowrd) => {
    const templateParams = {
      to_email: recipientEmail,
      user_name: name,
      event_title: eventTitle,
      password: uniquepassowrd,
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE,
        import.meta.env.VITE_EMAIL_TEMPLATE2,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC
      );
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

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

  const handleAddOrUpdateRegistration = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !newRegistration.name || !newRegistration.description) return;

    const password = generatePassword();

    try {
      if (editingRegistration) {
        await updateDoc(doc(db, `events/${selectedEvent}/registrations/${editingRegistration.id}`), {
          ...newRegistration,
        });

        setRegistrations(registrations.map((reg) =>
          reg.id === editingRegistration.id ? { id: reg.id, ...newRegistration } : reg
        ));

        setEditingRegistration(null);
      } else {
        const eventRef = collection(db, `events/${selectedEvent}/registrations`);
        const docRef = await addDoc(eventRef, {
          ...newRegistration,
          password,
          arrived: false,
          paid: false,
        });

        setRegistrations([...registrations, { id: docRef.id, ...newRegistration, arrived: false, paid: false }]);

        if (newRegistration.email && newRegistration.email.trim() !== "") {
          sendEmail(newRegistration.email, newRegistration.name, selectedEvent, password);
        }
      }
    } catch (error) {
      console.error("Error saving registration:", error);
    }

    setNewRegistration({ name: "", email: "", description: "", isMember: false });
  };

  const handleEditRegistration = (registration) => {
    setNewRegistration(registration);
    setEditingRegistration(registration);
  };

  const handleDeleteRegistration = async (userId) => {
    await deleteDoc(doc(db, `events/${selectedEvent}/registrations/${userId}`));
    setRegistrations(registrations.filter((reg) => reg.id !== userId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#F1F0E4] min-h-screen">
      <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("manage_event_registrations")}</h2>

      <div className="mb-4">
        <label className="block text-[#3E3F29] font-medium">{t("select_event")}</label>
        <select
          className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
          onChange={(e) => fetchRegistrations(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>{t("choose_event")}</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.title} - {event.date}</option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <form onSubmit={handleAddOrUpdateRegistration} className="mt-4 p-4 bg-[#7D8D86] shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-[#3E3F29]">{editingRegistration ? t("edit_registration") : t("add_registration")}</h3>

          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("name")}</label>
            <input
              type="text"
              value={newRegistration.name}
              onChange={(e) => setNewRegistration({ ...newRegistration, name: e.target.value })}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("email")}</label>
            <input
              type="email"
              value={newRegistration.email}
              onChange={(e) => setNewRegistration({ ...newRegistration, email: e.target.value })}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("description")}</label>
            <input
              type="text"
              value={newRegistration.description}
              onChange={(e) => setNewRegistration({ ...newRegistration, description: e.target.value })}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={newRegistration.isMember}
              onChange={(e) => setNewRegistration({ ...newRegistration, isMember: e.target.checked })}
              className="mr-2"
            />
            <label className="text-[#3E3F29]">{t("is_member")}</label>
          </div>

          <button type="submit" className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition">
            {editingRegistration ? t("save_changes") : t("add_person")}
          </button>
        </form>
      )}

      {selectedEvent && (
        <table className="w-full border-collapse border border-[#BCA88D] mt-4 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#7D8D86] text-[#3E3F29]">
              <th className="border border-[#BCA88D] p-2">{t("name")}</th>
              <th className="border border-[#BCA88D] p-2">{t("description")}</th>
              <th className="border border-[#BCA88D] p-2">{t("is_member")}</th>
              <th className="border border-[#BCA88D] p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="text-center bg-[#F1F0E4]">
                <td className="border border-[#BCA88D] p-2">{reg.name}</td>
                <td className="border border-[#BCA88D] p-2">{reg.description}</td>
                <td className="border border-[#BCA88D] p-2">{reg.isMember ? "✅" : "❌"}</td>
                <td className="border border-[#BCA88D] p-2 flex space-x-2 justify-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-blue-700 transition"
                    onClick={() => handleEditRegistration(reg)}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-red-700 transition"
                    onClick={() => handleDeleteRegistration(reg.id)}
                  >
                    {t("remove")}
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-[#F1F0E4] text-center font-bold">
              <td className="border border-[#BCA88D] p-2" colSpan="2">{t("total_people")}</td>
              <td className="border border-[#BCA88D] p-2">{registrations.length}</td>
              <td className="border border-[#BCA88D] p-2">{registrations.filter(reg => reg.isMember).length} {t("members")}</td>
            </tr>
          </tbody>
        </table>
      )}

      <button
        onClick={() => window.history.back()}
        className="w-full mt-4 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
      >
        {t("back_to_admin_panel")}
      </button>
    </div>
  );
}

export default AdminManageEventRegistrations;
