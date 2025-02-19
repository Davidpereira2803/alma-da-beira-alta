import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
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
import { Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <MyNavbar />

        <main className="flex-grow-1 container my-4">
          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/events" element={<ProtectedRoute>
              <Container>
                <AdminEvents />
                
              </Container>
            </ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute>
              <Container>
                <AdminGallery />
                
              </Container>
            </ProtectedRoute>} />
          </Routes>
        </main>

        {/* Footer */}
        <MyFooter />
      </div>
    </Router>
  );
}

export default App;
