import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
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

  const [consent, setConsent] = useState(false);
  const [botField, setBotField] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (botField) return;

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    if (!name || !email || !phone || !address) {
      setError(t("all_fields_required") || "Please fill all required fields.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setError(t("invalid_phone") || "Please enter a valid phone number.");
      return;
    }
    if (!consent) {
      setError(t("privacy_consent_required") || "Please accept the privacy terms.");
      return;
    }

    try {
      setLoading(true);

      const membersRef = collection(db, "registrations");

      const [emailSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(query(membersRef, where("email", "==", email))),
        getDocs(query(membersRef, where("phone", "==", phone))),
      ]);

      if (!emailSnapshot.empty || !phoneSnapshot.empty) {
        setError(t("member_already_exists") || "A registration with this email or phone already exists.");
        setLoading(false);
        return;
      }

      await addDoc(membersRef, {
        name,
        email,
        phone,
        address,
        message: formData.message.trim(),
        createdAt: serverTimestamp(),
        status: "new",
      });

      try {
        const templateParams = {
          name,
          email,
          message: t("email_confirmation_message", { name }) || `Thank you, ${name}!`,
          reply_to: email,
        };
        await emailjs.send(
          import.meta.env.VITE_EMAIL_SERVICE,
          import.meta.env.VITE_EMAIL_TEMPLATE,
          templateParams,
          import.meta.env.VITE_EMAIL_PUBLIC
        );
      } catch (mailErr) {
        console.warn("Email send failed:", mailErr);
      }

      setSuccess(t("registration_successful") || "Registration submitted successfully.");
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
      setConsent(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(t("registration_error") || "There was an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-safe-top flex justify-center items-center min-h-[80vh] bg-[#F1F0E4] px-4 py-10">
      <div className="w-full max-w-lg bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-serif font-bold text-center text-[#3E3F29] mb-2">
          {t("register_member")}
        </h2>
        <p className="text-center text-[#7D8D86] mb-4">{t("register_member_instruction")}</p>

        {success && (
          <p className="bg-green-100 text-green-800 p-2 rounded text-center mb-2" aria-live="polite">
            {success}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-2" aria-live="assertive">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          {/* Honeypot field */}
          <input
            type="text"
            name="company"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("name")}</label>
            <input
              type="text"
              name="name"
              placeholder={t("name_placeholder") || "Your full name"}
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
              placeholder="you@example.com"
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
              placeholder={t("phone_placeholder") || "+352 6x xx xx xx"}
              value={formData.phone}
              onChange={handleChange}
              pattern="^[0-9+()\-.\s]{7,}$"
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
            <p className="text-xs text-[#7D8D86] mt-1">{t("phone_hint") || "Include country code if possible."}</p>
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("address")}</label>
            <input
              type="text"
              name="address"
              placeholder={t("address_placeholder") || "Street, City, Postal code"}
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
              placeholder={t("message_placeholder") || "Any additional information"}
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              rows="3"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-[#3E3F29]">
            <input
              type="checkbox"
              className="mt-1 accent-[#3E3F29]"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              {t("privacy_consent") ||
                "I agree that my data will be stored and used to contact me about my membership request."}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="inline-block h-4 w-4 rounded-full border-2 border-[#3E3F29] border-t-transparent animate-spin" />
            )}
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterMember;
