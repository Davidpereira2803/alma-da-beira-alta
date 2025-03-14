import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="w-full min-h-screen bg-gray-100">
      <AuthProvider>
        <App />
      </AuthProvider>
    </div>
  </React.StrictMode>
);
