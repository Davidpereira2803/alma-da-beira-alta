import { useState } from "react";
import { db } from "../../firebase";
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
      setError("");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(t("registration_error"));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F1F0E4] p-6">
      <div className="w-full max-w-lg bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-2">
          {t("register_member")}
        </h2>
        <p className="text-center text-[#7D8D86] mb-4">{t("register_member_instruction")}</p>

        {success && <p className="bg-green-100 text-green-800 p-2 rounded text-center mb-2">{success}</p>}
        {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("address")}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("additional_message")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {t("submit")}
          </button>
        </form>

        <button
          className="w-full mt-4 bg-[#7D8D86] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#BCA88D] transition"
          onClick={() => window.history.back()}
        >
          {t("back_to_registration_panel")}
        </button>
      </div>
    </div>
  );
}

export default AdminRegisterMember;
