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

function App() {
  return (
    <Router>
      <div className="w-full flex flex-col min-h-screen bg-gray-100">
        {/* Navbar */}
        <MyNavbar />

        <main className="flex-grow container mx-auto my-4">
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
