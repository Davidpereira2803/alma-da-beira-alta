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
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
          <h2 className="text-2xl font-bold text-center mb-4">{t("forgot_password")}</h2>

          {message && <p className="bg-green-100 text-green-800 p-2 rounded text-center mb-3">{message}</p>}
          {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-3">{error}</p>}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              {t("send_reset_email")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
