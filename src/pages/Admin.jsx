import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function Admin() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="fw-bold mb-4">{t("admin_panel")}</h2>

        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/events")}>
          {t("manage_events")}
        </Button>

        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/gallery")}>
          {t("manage_gallery")}
        </Button>
        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/members")}>
          {t("manage_members")}
        </Button>
        <Button variant="dark" className="w-100 mb-2" onClick={() => navigate("/admin/registrations")}>
          {t("manage_registrations")}
        </Button>

        <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
          {t("admin_logout")}
        </Button>
      </Card>
    </Container>
  );
}

export default Admin;