import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

function AdminRegisterMember() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError(t("all_fields_required"));
      return;
    }

    try {
      const membersRef = collection(db, "registrations");

      const emailQuery = query(membersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      const phoneQuery = query(membersRef, where("phone", "==", formData.phone));
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!emailSnapshot.empty || !phoneSnapshot.empty) {
        setError(t("member_already_exists"));
        return;
      }

      await addDoc(membersRef, formData);

      setSuccess(t("registration_successful"));
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(t("registration_error"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {t("register_member")}
        </h2>
        <p className="text-center text-gray-600 mb-4">{t("register_member_instruction")}</p>

        {success && <p className="bg-green-100 text-green-800 p-2 rounded text-center">{success}</p>}
        {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">{t("email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">{t("phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">{t("address")}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">{t("additional_message")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t("submit")}
          </button>
        </form>

        <button
          className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => window.history.back()}
        >
          {t("back_to_registration_panel")}
        </button>
      </div>
    </div>
  );
}

export default AdminRegisterMember;
