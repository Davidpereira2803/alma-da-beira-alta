import { Navbar, Nav, Container, Form } from "react-bootstrap";
import logo from "../assets/logo.jpg";
import { useTranslation } from "react-i18next";

function MyNavbar() {
  const { t, i18n } = useTranslation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ height: "80px", padding: "10px 20px" }}>
      <Container>
        {/* Logo & Title */}
        <Navbar.Brand href="/" className="fw-bold fs-3 d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            width="71"
            height="50"
            className="d-inline-block align-top me-2"
          />
          {t("title")}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/gallery" className="fs-5 px-3">{t("gallery")}</Nav.Link>
            <Nav.Link href="/events" className="fs-5 px-3">{t("events")}</Nav.Link>
            <Nav.Link href="/register" className="fs-5 px-3">{t("register")}</Nav.Link>
          </Nav>

          {/* Language Selector */}
          <Form.Select
            className="ms-3 w-auto"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">🇬🇧</option>
            <option value="fr">🇫🇷</option>
            <option value="pt">🇵🇹</option>
            <option value="de">🇩🇪</option>
          </Form.Select>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;