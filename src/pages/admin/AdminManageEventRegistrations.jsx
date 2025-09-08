import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDocs, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import QRCodeGenerator from "../../components/QR-Generator";
import emailjs from "@emailjs/browser";
import QRCode from "qrcode";

function AdminManageEventRegistrations() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [visibleQR, setVisibleQR] = useState(null);

  const [newRegistration, setNewRegistration] = useState({
    name: "",
    email: "",
    description: "",
    isMember: false,
    qrCodeData: "",
    password: "",
  });

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const sendEmailWithQR = async (recipientEmail, qrCodeBase64, name, eventTitle, uniquepassowrd) => {
    const qrPageLink = `${window.location.origin}/qr`;

    const templateParams = {
      to_email: recipientEmail,
      user_name: name,
      event_title: eventTitle,
      qr_code_attachment: qrCodeBase64,
      qr_page_link: qrPageLink,
      password: uniquepassowrd,
    };
  
    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE,
        import.meta.env.VITE_EMAIL_TEMPLATE2,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC
      );
      console.log("Email sent successfully!", response.status, response.text);
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

  const qrCodeData = `${newRegistration.name} - ${selectedEvent}`;
  const password = generatePassword();

  try {
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

    if (editingRegistration) {
      await updateDoc(doc(db, `events/${selectedEvent}/registrations/${editingRegistration.id}`), {
        ...newRegistration,
        qrCodeData,
      });

      setRegistrations(registrations.map((reg) =>
        reg.id === editingRegistration.id ? { id: reg.id, ...newRegistration, qrCodeData } : reg
      ));

      setEditingRegistration(null);
    } else {
      const eventRef = collection(db, `events/${selectedEvent}/registrations`);
      const docRef = await addDoc(eventRef, {
        ...newRegistration,
        qrCodeData,
        password,
        arrived: false,
        paid: false,
      });

      setRegistrations([...registrations, { id: docRef.id, ...newRegistration, qrCodeData, arrived: false, paid: false }]);

      if (newRegistration.email && newRegistration.email.trim() !== "") {
        sendEmailWithQR(newRegistration.email, qrCodeUrl, newRegistration.name, selectedEvent, password);
      }
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
  }

  setNewRegistration({ name: "", email: "", description: "", isMember: false, qrCodeData: "" });
};


  const handleEditRegistration = (registration) => {
    setNewRegistration(registration);
    setEditingRegistration(registration);
  };

  const handleDeleteRegistration = async (userId) => {
    await deleteDoc(doc(db, `events/${selectedEvent}/registrations/${userId}`));
    setRegistrations(registrations.filter((reg) => reg.id !== userId));
  };

  const toggleQRVisibility = (regId) => {
    setVisibleQR(visibleQR === regId ? null : regId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("manage_event_registrations")}</h2>

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

      {selectedEvent && (
        <form onSubmit={handleAddOrUpdateRegistration} className="mt-4 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-2">{editingRegistration ? t("edit_registration") : t("add_registration")}</h3>

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
            <label className="block">{t("email")}</label>
            <input
              type="email"
              value={newRegistration.email}
              onChange={(e) => setNewRegistration({ ...newRegistration, email: e.target.value })}
              className="w-full p-2 border rounded"
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

          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={newRegistration.isMember}
              onChange={(e) => setNewRegistration({ ...newRegistration, isMember: e.target.checked })}
              className="mr-2"
            />
            <label>{t("is_member")}</label>
          </div>

          <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
            {editingRegistration ? t("save_changes") : t("add_person")}
          </button>
        </form>
      )}

      {visibleQR && (
        <div className="mt-4 text-center">
          <QRCodeGenerator text={registrations.find((reg) => reg.id === visibleQR)?.qrCodeData || ""} />
        </div>
      )}

      {selectedEvent && (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">{t("name")}</th>
              <th className="border p-2">{t("description")}</th>
              <th className="border p-2">{t("is_member")}</th>
              <th className="border p-2">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) => (
              <tr key={reg.id} className="text-center">
                <td className="border p-2">{reg.name}</td>
                <td className="border p-2">{reg.description}</td>
                <td className="border p-2">{reg.isMember ? "✅" : "❌"}</td>
                <td className="border p-2 flex space-x-2 justify-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEditRegistration(reg)}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteRegistration(reg.id)}
                  >
                    {t("remove")}
                  </button>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => toggleQRVisibility(reg.id)}
                  >
                    {visibleQR === reg.id ? t("hide_qr") : t("show_qr")}
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 text-center font-bold">
              <td className="border p-2" colSpan="2">{t("total_people")}</td>
              <td className="border p-2">{registrations.length}</td>
              <td className="border p-2">{registrations.filter(reg => reg.isMember).length} {t("members")}</td>
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
