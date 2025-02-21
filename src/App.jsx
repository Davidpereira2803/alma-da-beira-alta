import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";
import MyFooter from "./components/MyFooter";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import AdminEvents from "./pages/AdminEvents";
import AdminGallery from "./pages/AdminGallery";
import RegisterMember from "./pages/RegisterMember";
import AdminMembers from "./pages/AdminMembers";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminRegisterMember from "./pages/AdminRegisterMember";
import ForgotPassword from "./pages/ForgotPassword";
import AdminFinancePanel from "./pages/AdminFinancePanel";

function App() {
  return (
    <Router>
      <div className="w-full flex flex-col min-h-screen bg-gray-100">
        {/* Navbar */}
        <MyNavbar />

          <main>
          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/register" element={<RegisterMember />} />
            <Route path="/admin/members" element={<ProtectedRoute><AdminMembers /></ProtectedRoute>} />
            <Route path="/admin/registrations" element={<ProtectedRoute><AdminRegistrations /></ProtectedRoute>} />
            <Route path="/admin/register" element={<ProtectedRoute><AdminRegisterMember /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/finance" element={<ProtectedRoute><AdminFinancePanel /></ProtectedRoute>} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute><AdminEvents /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          </Routes>
        </main>

        {/* Footer */}
        <MyFooter />
      </div>
    </Router>
  );
}

export default App;
