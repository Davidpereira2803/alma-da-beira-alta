import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";

function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="fw-bold mb-4">Admin Panel</h2>

        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/events")}>
          Manage Events
        </Button>

        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/gallery")}>
          Manage Gallery
        </Button>
        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/members")}>
          Manage Members
        </Button>
        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/registrations")}>
          Manage Registrations
        </Button>

        <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
          Logout
        </Button>
      </Card>
    </Container>
  );
}

export default Admin;