import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { resetPassword } = useAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      await resetPassword(email);
      setMessage(t("password_reset_email_sent"));
    } catch (err) {
      setError(t("password_reset_failed"));
    }
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#F1F0E4] border-t-4 border-[#BCA88D] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-4">{t("forgot_password")}</h2>

        {message && <p className="bg-green-100 text-green-800 p-2 rounded text-center mb-3">{message}</p>}
        {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-3">{error}</p>}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {t("send_reset_email")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
