import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

function RegisterMember() {
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

    if (!formData.name || !formData.phone || !formData.address) {
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

      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: t("email_confirmation_message", { name: formData.name }),
      };

      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE,
        import.meta.env.VITE_EMAIL_TEMPLATE,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC
      );

      setSuccess(t("registration_successful"));
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
      setError("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(t("registration_error"));
      setSuccess(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-[#B6AA84] px-4 py-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-2">
          {t("register_member")}
        </h2>
        <p className="text-center text-gray-600 mb-4">{t("register_member_instruction")}</p>

        {success && <p className="bg-green-100 text-green-800 p-2 rounded text-center mb-2">{success}</p>}
        {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B6AA84]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B6AA84]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B6AA84]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("address")}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B6AA84]"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">{t("additional_message")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B6AA84]"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8C7B4F] text-white py-2 rounded-lg font-semibold hover:bg-[#B6AA84] transition"
          >
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;
