import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";
import MyFooter from "./components/MyFooter";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import Admin from "./pages/admin/Admin";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import RegisterMember from "./pages/RegisterMember";
import AdminMembers from "./pages/admin/AdminMembers";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminRegisterMember from "./pages/admin/AdminRegisterMember";
import ForgotPassword from "./pages/ForgotPassword";
import AdminFinancePanel from "./pages/admin/AdminFinancePanel";
import AdminEventRegistrations from "./pages/admin/AdminEventRegistrations";
import AdminManageEventRegistrations from "./pages/admin/AdminManageEventRegistrations";
import About from "./pages/About"; // Add this import

function App() {
  return (
    <Router>
      <div className="w-full flex flex-col min-h-screen bg-[#B6AA84]">
        <MyNavbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} /> {/* Add this line */}
            <Route path="/register" element={<RegisterMember />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/admin/members" element={<AdminProtectedRoute><AdminMembers /></AdminProtectedRoute>} />
            <Route path="/admin/registrations" element={<AdminProtectedRoute><AdminRegistrations /></AdminProtectedRoute>} />
            <Route path="/admin/register" element={<AdminProtectedRoute><AdminRegisterMember /></AdminProtectedRoute>} />
            <Route path="/admin" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />
            <Route path="/admin/events" element={<AdminProtectedRoute><AdminEvents /></AdminProtectedRoute>} />
            <Route path="/admin/gallery" element={<AdminProtectedRoute><AdminGallery /></AdminProtectedRoute>} />
            <Route path="/admin/finance" element={<AdminProtectedRoute><AdminFinancePanel /></AdminProtectedRoute>} />
            <Route path="/admin/event-registrations" element={<AdminProtectedRoute><AdminEventRegistrations /></AdminProtectedRoute>} />
            <Route path="/admin/manage-event-registrations" element={<AdminProtectedRoute><AdminManageEventRegistrations /></AdminProtectedRoute>} />
          </Routes>
        </main>

        <MyFooter />
      </div>
    </Router>
  );
}

export default App;
