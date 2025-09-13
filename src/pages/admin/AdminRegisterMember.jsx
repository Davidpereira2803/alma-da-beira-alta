import { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";

function AdminRegisterMember() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^[+0-9][0-9\s().-]{5,}$/.test((phone || "").trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      showNotice(t("all_fields_required") || "Please fill all required fields.", "error");
      return;
    }
    if (!validateEmail(formData.email)) {
      showNotice(t("invalid_email") || "Please enter a valid email.", "error");
      return;
    }
    if (!validatePhone(formData.phone)) {
      showNotice(t("invalid_phone") || "Please enter a valid phone number.", "error");
      return;
    }

    setLoading(true);
    try {
      const regsRef = collection(db, "registrations");
      const membersRef = collection(db, "members");

      const [regByEmail, regByPhone, memByEmail, memByPhone] = await Promise.all([
        getDocs(query(regsRef, where("email", "==", formData.email))),
        getDocs(query(regsRef, where("phone", "==", formData.phone))),
        getDocs(query(membersRef, where("email", "==", formData.email))),
        getDocs(query(membersRef, where("phone", "==", formData.phone))),
      ]);

      if (!regByEmail.empty || !regByPhone.empty || !memByEmail.empty || !memByPhone.empty) {
        showNotice(t("member_already_exists") || "A registration with this email or phone already exists.", "error");
        setLoading(false);
        return;
      }

      await addDoc(regsRef, {
        ...formData,
        createdAt: serverTimestamp(),
      });

      showNotice(t("registration_successful") || "Registration submitted successfully.");
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      showNotice(t("registration_error") || "There was an error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title={t("register_member")}
      description={t("register_member_instruction") || "Fill in the details to create a registration."}
    >
      {notice.message && (
        <div
          role="status"
          className={`mb-4 rounded-lg p-3 text-sm ${
            notice.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {notice.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow border-t-4 border-[#BCA88D] p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#3E3F29] font-medium mb-1">{t("name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("name_placeholder") || "Your full name"}
                className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
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
                placeholder="you@example.com"
                className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
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
                placeholder={t("phone_placeholder") || "+352 6x xx xx xx"}
                className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                required
              />
              <p className="text-xs text-[#7D8D86] mt-1">{t("phone_hint") || "Include country code if possible."}</p>
            </div>

            <div>
              <label className="block text-[#3E3F29] font-medium mb-1">{t("address")}</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t("address_placeholder") || "Street, City, Postal code"}
                className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("additional_message")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t("message_placeholder") || "Any additional information"}
              className="w-full min-h-24 px-3 py-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              rows="3"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full h-11 px-6 bg-[#BCA88D] text-[#3E3F29] font-semibold shadow hover:bg-[#7D8D86] disabled:opacity-60"
            >
              {loading ? t("submitting") || "Submitting..." : t("submit")}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ name: "", email: "", phone: "", address: "", message: "" })}
              className="inline-flex items-center justify-center rounded-full h-11 px-6 bg-white text-[#3E3F29] ring-1 ring-[#3E3F29]/15 hover:bg-[#F1F0E4]"
            >
              {t("clear") || "Clear"}
            </button>
          </div>
        </form>
      </div>

      <button
        className="w-full mt-6 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
        onClick={() => window.history.back()}
      >
        {t("back_to_admin_panel") || t("back_to_registration_panel")}
      </button>
    </AdminLayout>
  );
}

export default AdminRegisterMember;
