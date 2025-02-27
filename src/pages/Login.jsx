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
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center items-center my-80">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/5">
          <h2 className="text-2xl font-bold text-center mb-4">{t("admin_login")}</h2>

          {error && <p className="bg-red-100 text-red-800 p-2 rounded text-center mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="block text-gray-700 font-medium">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              {t("login")}
            </button>

            <button onClick={() => navigate("/forgot-password")} className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition text-center">
              {t("forgot_password")}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Login;
