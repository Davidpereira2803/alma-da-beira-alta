import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(t("invalid_credentials"));
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await googleLogin();
      navigate("/admin");
    } catch (err) {
      setError(t("google_login_failed"));
    }
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#F1F0E4] border-t-4 border-[#BCA88D] rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-serif font-bold text-center text-[#3E3F29] mb-4">{t("admin_login")}</h2>

        {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {t("login")}
          </button>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-[#7D8D86] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#BCA88D] transition"
          >
            {t("forgot_password")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
